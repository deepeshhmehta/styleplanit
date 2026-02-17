/**
 * utils.js - Shared utility functions
 */
const Utils = {
    /**
     * Robust CSV parser that handles quoted fields containing commas
     */
    parseCSV: function(data) {
        const lines = data.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 1) return [];

        const parseCSVRow = (line) => {
            const result = [];
            let currentField = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                        currentField += '"';
                        i++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    result.push(currentField.trim());
                    currentField = '';
                } else {
                    currentField += char;
                }
            }
            result.push(currentField.trim());
            return result;
        };

        const header = parseCSVRow(lines[0]);
        const results = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVRow(lines[i]);
            const row = {};
            for (let j = 0; j < header.length; j++) {
                row[header[j]] = values[j] !== undefined ? values[j] : '';
            }
            results.push(row);
        }
        return results;
    },

    /**
     * Applies configuration object to elements with specific data attributes
     */
    applyConfig: function(config) {
        document.querySelectorAll('[text-config-key]').forEach(element => {
            const key = element.getAttribute('text-config-key');
            if (config[key] !== undefined) element.textContent = config[key];
        });

        document.querySelectorAll('[href-config-key]').forEach(element => {
            const key = element.getAttribute('href-config-key');
            if (config[key] !== undefined) element.href = config[key];
        });

        document.querySelectorAll('[placeholder-config-key]').forEach(element => {
            const key = element.getAttribute('placeholder-config-key');
            if (config[key] !== undefined) element.placeholder = config[key];
        });
    }
};
