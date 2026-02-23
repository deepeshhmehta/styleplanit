/**
 * reviews.js - Review expansion and rendering logic
 */
const ReviewsFeature = {
  init: async function () {
    const reviews = await Data.fetch("reviews");
    if (reviews.length === 0) {
      $("#reviews-container").html('<p class="text-center">Reviews are currently being updated.</p>');
      return;
    }

    const container = $("#reviews-container");
    container.empty();
    reviews.forEach((review) => {
      container.append(`
                <div class="review-card">
                    <span class="review-author">${review.author}</span>
                    <p>"${review.text.replace(/"/g, "")}"</p>
                </div>
            `);
    });
    this.bindReviewToggle();
  },

  bindReviewToggle: function() {
    $(document).off("click", ".review-card").on("click", ".review-card", function() {
        const card = $(this);
        const isExpanding = !card.hasClass("expanded");
        card.toggleClass("expanded");
        
        const navHeight = $("nav").outerHeight() || 0;
        const extraPadding = CONFIG.SETTINGS.SCROLL_OFFSET;

        if (isExpanding) {
            setTimeout(() => {
                $("html, body").animate({
                    scrollTop: card.offset().top - navHeight - extraPadding
                }, 400);
            }, 100);
        } else {
            card.scrollTop(0);
            $("html, body").animate({
                scrollTop: card.offset().top - navHeight - extraPadding
            }, 200);
        }
    });
  }
};
