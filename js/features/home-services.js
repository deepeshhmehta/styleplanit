/**
 * home-services.js - Home page category cards
 */
const HomeServicesFeature = {
    init: async function() {
        const container = $("#home-categories-container");
        if (container.length === 0) return;

        const categories = await Data.fetch("categories");
        const homeCategories = categories.filter(c => c.showOnHomePage);

        this.renderCategories(container, homeCategories);
    },

    renderCategories: function(container, categories) {
        container.empty();
        categories.forEach(category => {
            container.append(`
                <a href="${category.href}" class="category-card">
                    <div class="category-card-bg" style="background-image: url('${category.image_url}')"></div>
                    <div class="category-card-content">
                        <h3>${category.name}</h3>
                        <p>${category.description}</p>
                    </div>
                </a>
            `);
        });
    }
};
