/**
 * portfolio.js - Portfolio image band
 */
const PortfolioFeature = {
    init: async function() {
        const container = $("#portfolio-carousel");
        if (container.length === 0) return;

        // Try to get images from manifest
        const assets = Data.masterData.assets_manifest || {};
        let images = assets['portfolio'] || [];

        // For now, if empty, use placeholders to demonstrate
        if (images.length === 0) {
            images = [
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070",
                "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=2070",
                "https://images.unsplash.com/photo-1539109132314-347f08b526d0?q=80&w=2070",
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070"
            ];
            this.renderImages(container, images);
        } else {
            this.renderImages(container, images.map(img => `assets/images/portfolio/${img}`));
        }
    },

    renderImages: function(container, images) {
        container.empty();
        images.forEach(img => {
            container.append(`
                <div class="portfolio-item">
                    <img src="${img}" alt="Portfolio Work">
                </div>
            `);
        });
    }
};
