/**
 * loader.js - Handles dynamic loading of HTML components
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

    // Wait for all components to be injected
    await Promise.all(loadPromises);
    
    // Dispatch a custom event so other scripts (like csv-reader.js) know the DOM is ready
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
}

// Initial load
document.addEventListener('DOMContentLoaded', loadComponents);
