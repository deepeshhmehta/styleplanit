window.onload = async () => {
    try {
        const response = await fetch('config.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        const config = parseCSV(data);
        applyConfig(config);
    } catch (error) {
        console.error('Error loading or applying config:', error);
    }
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
    document.querySelectorAll('[text-config-key]').forEach(element => {
        const key = element.getAttribute('text-config-key');
        if (config[key] !== undefined) {
            element.textContent = config[key];
        } else {
            console.error(`Config key "${key}" not found for element:`, element);
        }
    });

    document.querySelectorAll('[href-config-key]').forEach(element => {
        const key = element.getAttribute('href-config-key');
        if (config[key] !== undefined) {
            const url = config[key];
            if (isValidUrl(url)) {
                element.href = url;
            } else {
                console.error(`Invalid URL format for key "${key}": "${url}"`, element);
            }
        } else {
            console.error(`Config key "${key}" not found for element:`, element);
        }
    });

    document.querySelectorAll('[placeholder-config-key]').forEach(element => {
        const key = element.getAttribute('placeholder-config-key');
        if (config[key] !== undefined) {
            element.placeholder = config[key];
        } else {
            console.error(`Config key "${key}" not found for element:`, element);
        }
    });
}

function isValidUrl(string) {
    const pattern = new RegExp('^(https:|http:|mailto:|/|#)');
    return pattern.test(string);
}
