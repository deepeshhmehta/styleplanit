// js/services.js
$(document).ready(function(){
    // Function to parse CSV data correctly handling quoted values
    function parseCSV(data) {
        const lines = data.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) return [];

        function parseCSVRow(line) {
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
        }

        const header = parseCSVRow(lines[0]);
        const services = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVRow(lines[i]);
            const service = {};
            for (let j = 0; j < header.length; j++) {
                service[header[j]] = values[j] !== undefined ? values[j] : '';
            }
            services.push(service);
        }
        return services;
    }

    // Fetch and process services data
    $.ajax({
        url: 'configs/services.csv',
        dataType: 'text',
    }).done(function(data) {
        const services = parseCSV(data);
        const categories = [...new Set(services.map(service => service.category))];

        // Populate tabs
        const tabsContainer = $('.elegant-tabs ul');
        categories.forEach((category, index) => {
            tabsContainer.append(`<li class="${index === 0 ? 'active' : ''}" data-tab="${category.replace(/\s+/g, '-').toLowerCase()}">${category}</li>`);
        });

        // Populate service cards
        const serviceContent = $('.service-content');
        categories.forEach((category, index) => {
            const categoryId = category.replace(/\s+/g, '-').toLowerCase();
            const grid = $(`<div id="${categoryId}" class="services-grid ${index === 0 ? 'active' : ''}"></div>`);
            const categoryServices = services.filter(service => service.category === category);
            
            categoryServices.forEach(service => {
                const card = `
                    <div class="service-card" data-long-desc="${service.long_description}">
                        <img src="${service.image_url}" alt="${service.title}">
                        <h3>${service.title}</h3>
                        <p>${service.short_description}</p>
                        <span class="price-tag">${service.footer}</span>
                    </div>
                `;
                grid.append(card);
            });
            serviceContent.append(grid);
        });

        // Tab switching
        $('.elegant-tabs li').on('click', function(){
            var tabId = $(this).data('tab');

            // Update active tab
            $('.elegant-tabs li').removeClass('active');
            $(this).addClass('active');

            // Show/hide service grids
            $('.services-grid').removeClass('active');
            $('#' + tabId).addClass('active');

            // Hide the details container
            $('#service-details').slideUp();
        });

        // Service card click event
        $('.service-card').on('click', function(){
            $('.service-card').removeClass('active');
            $(this).addClass('active');

            // Get card content
            var title = $(this).find('h3').text();
            var longDesc = $(this).data('long-desc');
            var price = $(this).find('.price-tag').text();

            // Update the details container
            var detailsContent = `
                <h3>${title}</h3>
                <p>${longDesc}</p>
                <span class="price-tag">${price}</span>
            `;

            // Hide and show with new content
            $('#service-details').slideUp(function() {
                $(this).html(detailsContent).slideDown();
            });
        });
    });
});
