/**
 * loader.js - Handles dynamic loading of HTML components and app initialization
 */
async function loadComponents() {
    // 0. Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    // 1. Check version immediately to decide if cache needs flushing
    if (typeof Data !== 'undefined') {
        await Data.checkVersion();
    }

    const components = document.querySelectorAll('[data-component]');
    
    const loadPromises = Array.from(components).map(async (element) => {
        const componentName = element.getAttribute('data-component');
        // Skip the static loader if it was accidentally tagged
        if (componentName === 'loader') return;

        try {
            const response = await fetch(`components/${componentName}.html`);
            if (!response.ok) throw new Error(`Failed to load ${componentName}`);
            const html = await response.text();
            element.innerHTML = html;
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
        }
    });

    await Promise.all(loadPromises);
    
    // 2. Load and apply site-wide configuration
    const configArray = await Data.fetch('config');
    let config = {};
    if (configArray.length > 0) {
        configArray.forEach(item => {
            if (!item.key) return; // Skip if key is empty
            
            // Clean mapping for critical keys that might be malformed in source or are Mailchimp related
            if (item.key.includes('SUBSCRIBE_FORM_ACTION')) {
                config['SUBSCRIBE_FORM_ACTION'] = item.value.trim().replace(/│$/, '').trim();
            } else if (item.key.includes('SUBSCRIBE_FORM_ENTRY_ID')) {
                config['SUBSCRIBE_FORM_ENTRY_ID'] = item.value.trim();
            } else if (item.key.includes('MAILCHIMP_FORM_ACTION')) {
                config['MAILCHIMP_FORM_ACTION'] = item.value;
            } else if (item.key.includes('MAILCHIMP_EMAIL_FIELD_NAME')) {
                config['MAILCHIMP_EMAIL_FIELD_NAME'] = item.value;
            } else if (item.key.includes('MAILCHIMP_HIDDEN_FIELD_NAME')) {
                config['MAILCHIMP_HIDDEN_FIELD_NAME'] = item.value;
            } else if (item.key.includes('MAILCHIMP_HIDDEN_FIELD_VALUE')) {
                config['MAILCHIMP_HIDDEN_FIELD_VALUE'] = item.value;
            } else if (item.key.includes('MAILCHIMP_NAME_FIELD_NAME')) {
                config['MAILCHIMP_NAME_FIELD_NAME'] = item.value;
            } else if (item.key.includes('MAILCHIMP_NAME_PLACEHOLDER')) {
                config['MAILCHIMP_NAME_PLACEHOLDER'] = item.value;
            } else if (item.key.includes('LEGAL_COMPLIANCE_TEXT')) {
                config['LEGAL_COMPLIANCE_TEXT'] = item.value;
            } else {
                // Default handling for other keys
                config[item.key] = item.value;
            }
        });
        Utils.applyConfig(config);
    }

    // 1. Initialize UI interactions (Menu, Hero, etc.)
    if (typeof App !== 'undefined') {
        App.init(config);
    }
    Utils.applyConfig(config);

    // 3. Signal that everything is ready
    document.dispatchEvent(new CustomEvent('appReady'));

    // 4. Hide loader and restore scrolling (with 200ms delay to ensure rendering is stable)
    setTimeout(() => {
        const loader = document.getElementById('site-loader');
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 800); // Match transition duration in CSS
        }
    }, 200);
}

document.addEventListener('DOMContentLoaded', loadComponents);
