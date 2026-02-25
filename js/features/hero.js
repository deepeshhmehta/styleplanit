/**
 * hero.js - Hero section slideshow logic
 */
const HeroFeature = {
  init: async function () {
    const heroContainer = $(".hero-bg-container");
    if (heroContainer.length === 0) return;

    // 1. Get images from manifest
    const masterData = await Data.loadMasterData();
    const images = masterData.assets_manifest["home-page/hero-images"] || [];
    
    if (images.length === 0) return;

    // 2. Clear placeholders and inject actual images
    heroContainer.empty();
    images.forEach((img, index) => {
        heroContainer.append(`
            <div class="hero-bg ${index === 0 ? 'active' : ''}" 
                 style="background-image: url('assets/images/home-page/hero-images/${img}'); 
                        opacity: ${index === 0 ? 1 : 0};">
            </div>
        `);
    });

    const heroBgs = $(".hero-bg");
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
