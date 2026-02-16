window.onload = () => {
    fetch('config.csv')
        .then(response => response.text())
        .then(data => {
            const config = parseCSV(data);
            applyConfig(config);
        });
};

function parseCSV(data) {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const config = {};
    // Start from 1 to skip header
    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        const key = parts[0].trim();
        const value = parts.slice(1).join(',').trim().replace(/"/g, '');
        if (key) {
            config[key] = value;
        }
    }
    return config;
}

function applyConfig(config) {
    for (const key in config) {
        const textElements = document.querySelectorAll(`[text-config-key="${key}"]`);
        textElements.forEach(element => {
            element.textContent = config[key];
        });
        
        const hrefElements = document.querySelectorAll(`[href-config-key="${key}"]`);
        hrefElements.forEach(element => {
            element.href = config[key];
        });
    }
}
