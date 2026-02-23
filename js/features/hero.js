/**
 * hero.js - Hero section slideshow logic
 */
const HeroFeature = {
  init: function () {
    const heroBgs = $(".hero-bg");
    if (heroBgs.length === 0) return;

    // Detect screen size
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      if (heroBgs.length <= 1) return;

      let current = 0;
      // Start the mobile-only slideshow
      setInterval(() => {
        heroBgs.eq(current).removeClass("active").css("opacity", 0);
        current = (current + 1) % heroBgs.length;
        heroBgs.eq(current).addClass("active").css("opacity", 1);
      }, 4000);
    } else {
      // On desktop, ensure all are visible and tiled
      heroBgs.css({
        opacity: 1,
        transition: "none",
      }).addClass("active");
    }
  }
};
