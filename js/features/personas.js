/**
 * personas.js - Handles scroll dots for the Recognize Yourself section
 */
const PersonasFeature = {
    init: function() {
        const wrapper = $("#personas-grid-wrapper");
        const grid = $("#personas-grid");
        const indicator = $("#personas-scroll-indicator");
        const cards = $(".persona-card");

        if (wrapper.length === 0 || cards.length === 0) return;

        // 1. Create Dots
        indicator.empty();
        cards.each((index) => {
            indicator.append(`<div class="scroll-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`);
        });

        const dots = indicator.find(".scroll-dot");

        // 2. Handle Scroll Event to Update Dots
        wrapper.on("scroll", () => {
            const scrollLeft = wrapper.scrollLeft();
            const maxScroll = wrapper[0].scrollWidth - wrapper.outerWidth();
            const scrollPercent = scrollLeft / maxScroll;
            
            const activeIndex = Math.round(scrollPercent * (cards.length - 1));
            
            dots.removeClass("active");
            dots.eq(activeIndex).addClass("active");
        });

        // 3. Handle Dot Clicks to Scroll
        dots.on("click", function() {
            const index = $(this).data("index");
            const cardWidth = cards.first().outerWidth() + 30;
            
            wrapper.animate({
                scrollLeft: index * cardWidth
            }, 500);
        });
    }
};
