/**
 * home-services.js - Home page category cards
 */
const HomeServicesFeature = {
    init: async function() {
        const container = $("#home-categories-container");
        if (container.length === 0) return;

        const categories = await Data.fetch("categories");
        const homeCategories = categories.filter(c => {
            const val = String(c.showOnHomePage).toUpperCase();
            return val === 'TRUE';
        });

        this.renderCategories(container, homeCategories);
    },

    renderCategories: function(container, categories) {
        container.empty();
        categories.forEach(category => {
            const slug = category.name.trim().replace(/\s+/g, "-").toLowerCase();
            container.append(`
                <a href="${category.href}" class="category-card" data-ga-category="${slug}">
                    <div class="category-card-bg" style="background-image: url('${category.image_url}')"></div>
                    <div class="category-card-content">
                        <h3>${category.name}</h3>
                        <p>${category.description}</p>
                    </div>
                </a>
            `);
        });

        // Bind tracking
        $(document).on("click", "#home-categories-container .category-card", function() {
            const slug = $(this).data("ga-category");
            Analytics.trackInteraction('home_category', slug);
        });
    }
};
