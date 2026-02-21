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
        if (!config || Object.keys(config).length === 0) return;

        // Text and Links
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

        // Image Sources
        document.querySelectorAll('[src-config-key]').forEach(element => {
            const key = element.getAttribute('src-config-key');
            if (config[key] !== undefined) element.src = config[key];
        });

        // Background Images
        document.querySelectorAll('[style-bg-config-key]').forEach(element => {
            const key = element.getAttribute('style-bg-config-key');
            if (config[key] !== undefined) {
                element.style.backgroundImage = 'url("' + config[key] + '")';
            }
        });

        // Meta Tags Optimization
        if (config['PAGE_DESCRIPTION']) {
            this.updateMeta('description', config['PAGE_DESCRIPTION']);
            this.updateMeta('og:description', config['PAGE_DESCRIPTION'], 'property');
        }
        if (config['PAGE_TITLE']) {
            this.updateMeta('og:title', config['PAGE_TITLE'], 'property');
        }
        if (config['OG_IMAGE']) {
            this.updateMeta('og:image', config['OG_IMAGE'], 'property');
        }
    },

    /**
     * Helper to update meta tags
     */
    updateMeta: function(name, content, attr = 'name') {
        let el = document.querySelector(`meta[${attr}="${name}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute(attr, name);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    }
};

/**
 * Data - Centralized data provider with atomic JSON loading and CSV fallbacks
 */
const Data = {
    masterData: null,

    /**
     * Load the master JSON file once
     */
    loadMasterData: async function() {
        if (this.masterData) return this.masterData;
        
        try {
            const response = await fetch('configs/site-data.json?v=' + new Date().getTime());
            if (response.ok) {
                this.masterData = await response.json();
                return this.masterData;
            }
        } catch (e) {
            console.warn("Could not load master JSON, falling back to individual CSVs", e);
        }
        return null;
    },

    /**
     * Helper to build Google Sheets URL from CONFIG
     */
    getPrimaryUrl: function(type) {
        return `https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}/pub?gid=${CONFIG.GIDS[type]}&output=csv`;
    },

    /**
     * Check the version from the dedicated version sheet or master JSON
     */
    checkVersion: async function() {
        const master = await this.loadMasterData();
        let newVersion = null;

        if (master && master.version && master.version.length > 0) {
            newVersion = master.version[0].value || master.version[0].version;
        } else {
            try {
                const data = await this.loadFromNetwork('version', null);
                if (data && data.length > 0) {
                    const versionObj = data.find(item => item.key === 'VERSION' || item.version);
                    newVersion = versionObj ? (versionObj.value || versionObj.version) : null;
                }
            } catch (e) {
                // Silently fail
            }
        }

        if (newVersion) {
            const oldVersion = localStorage.getItem('app_version');
            if (oldVersion && oldVersion !== newVersion) {
                Object.keys(CONFIG.GIDS).forEach(key => {
                    if (key !== 'version') localStorage.removeItem(`cached_${key}`);
                });
            }
            localStorage.setItem('app_version', newVersion);
            this.currentVersion = newVersion;
        }
    },

    /**
     * Perform network loading with manual timeout for better compatibility
     */
    fetchWithTimeout: async function(url, timeout) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    },

    /**
     * Fetch logic with version control and selective caching
     */
    fetch: async function(type) {
        // 1. Try Master JSON first
        const master = await this.loadMasterData();
        if (master && master[type]) {
            return master[type];
        }

        // 2. Individual fallback
        const cacheKey = `cached_${type}`;
        const shouldCache = (type !== 'services');

        // Check for ?nocache=true query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const bypassCache = urlParams.get('nocache') === 'true';

        if (shouldCache && !bypassCache) {
            const cachedData = localStorage.getItem(cacheKey);
            // If we have cached data, return it immediately
            if (cachedData && cachedData !== '[]') {
                return JSON.parse(cachedData);
            }
        }

        // Otherwise load from network
        return await this.loadFromNetwork(type, shouldCache ? cacheKey : null);
    },

    /**
     * Perform network loading
     */
    loadFromNetwork: async function(type, cacheKey) {
        try {
            const url = this.getPrimaryUrl(type);
            const response = await this.fetchWithTimeout(url, CONFIG.SETTINGS.FETCH_TIMEOUT);
            if (!response.ok) throw new Error(`Primary source failed`);
            const text = await response.text();
            const data = Utils.parseCSV(text);
            
            // If primary source returned no data (likely an error page), trigger fallback
            if (!data || data.length === 0) {
                throw new Error(`Primary source returned empty data`);
            }
            
            if (cacheKey) {
                localStorage.setItem(cacheKey, JSON.stringify(data));
            }
            return data;
        } catch (error) {
            try {
                const response = await fetch(CONFIG.BACKUP_PATHS[type]);
                if (!response.ok) throw new Error(`Backup source failed`);
                const text = await response.text();
                const data = Utils.parseCSV(text);
                return data;
            } catch (backupError) {
                console.error(`Both sources for ${type} failed:`, backupError);
                return [];
            }
        }
    },

    /**
     * Silently update the cache in the background (No longer handles version)
     */
    refreshCache: async function(type, cacheKey) {
        try {
            const url = this.getPrimaryUrl(type);
            const response = await this.fetchWithTimeout(url, CONFIG.SETTINGS.BACKGROUND_REFRESH_TIMEOUT);
            if (response.ok) {
                const text = await response.text();
                const data = Utils.parseCSV(text);
                if (data && data.length > 0) {
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                }
            }
        } catch (e) {
            // Fail silently
        }
    }
};
