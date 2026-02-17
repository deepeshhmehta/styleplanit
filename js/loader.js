/**
 * loader.js - Handles dynamic loading of HTML components and app initialization
 */
async function loadComponents() {
    const components = document.querySelectorAll('[data-component]');
    
    const loadPromises = Array.from(components).map(async (element) => {
        const componentName = element.getAttribute('data-component');
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
    
    // 1. Initialize UI interactions (Menu, Hero, etc.)
    if (typeof App !== 'undefined') {
        App.init();
    }

    // 2. Load and apply site-wide configuration
    const configArray = await Data.fetch('config');
    if (configArray.length > 0) {
        const config = {};
        configArray.forEach(item => {
            if (item.key) config[item.key] = item.value;
        });
        Utils.applyConfig(config);
    }

    // 3. Signal that everything is ready
    document.dispatchEvent(new CustomEvent('appReady'));
}

document.addEventListener('DOMContentLoaded', loadComponents);
