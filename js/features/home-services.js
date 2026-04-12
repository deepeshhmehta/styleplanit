/**
 * home-services.js - Interactive package cards for "Pick Your Journey"
 */
const HomeServicesFeature = {
    init: async function() {
        console.log("🔍 [HomeServices] Init called");
        const container = $("#packages-grid-container");
        if (container.length === 0) return;

        const categories = await Data.fetch("categories");
        const homeCategories = categories.filter(c => {
            const val = String(c.showOnHomePage).toUpperCase();
            return val === 'TRUE';
        });

        this.renderPackages(container, homeCategories);
        this.bindEvents();
    },

    renderPackages: function(container, categories) {
        container.empty();
        categories.forEach((category, index) => {
            const inclusions = category.inclusions ? category.inclusions.split('|') : [];
            const inclusionsHtml = inclusions.map(item => `<li>${item}</li>`).join('');
            
            const cleanPrice = category.price ? category.price.replace('From ', '') : '';

            container.append(`
                <div class="package-card" data-tier="${category.name.toLowerCase()}">
                    <div class="package-card-bg" style="background-image: url('${category.image_url}')"></div>
                    <div class="package-card-overlay"></div>
                    <div class="package-card-content">
                        <div class="package-label">Tier 0${index + 1}</div>
                        <h3>${category.name}</h3>
                        <div class="package-price">${cleanPrice}</div>
                        <p class="desc-small">${category.short_description || category.description}</p>
                        
                        <div class="package-details-expanded">
                            <div class="details-left">
                                <p class="desc-large">${category.description} Built into a comprehensive bundle to ensure you move forward with clarity and confidence.</p>
                                <a href="${category.booking_link || '#'}" class="btn btn-primary-accent">Schedule a call</a>
                            </div>
                            <div class="details-right">
                                <div class="package-label" style="color: var(--primary-accent)">What's included</div>
                                <ul class="inclusions-list">
                                    ${inclusionsHtml}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    },

    bindEvents: function() {
        const self = this;
        const grid = $("#packages-grid-container");
        const resetButton = $("#btn-packages-reset");

        $(document).on("click", ".package-card", function(e) {
            if ($(this).hasClass("active") || $(e.target).closest('.package-details-expanded').length > 0) return;

            const tier = $(this).data("tier");
            
            $(".package-card").removeClass("active");
            $(this).addClass("active");
            grid.addClass("has-active");
            resetButton.fadeIn();

            $('html, body').animate({
                scrollTop: $(".packages-section").offset().top - 100
            }, 500);
        });

        $(document).on("click", "#btn-packages-reset", function() {
            $(".package-card").removeClass("active");
            grid.removeClass("has-active");
            resetButton.fadeOut();
        });
    }
};
