/**
 * services.js - Service grid rendering and filtering
 */
const ServicesFeature = {
  options: {},

  init: async function (options = {}) {
    this.options = options;
    let services = await Data.fetch("services");
    if (services.length === 0) {
      $(".service-content").html('<p class="text-center section-padding">Service menu is temporarily unavailable. Please check back later.</p>');
      return;
    }

    // Apply filtering if options provided
    if (options.filter) {
      if (options.mode === "exclude") {
        services = services.filter(s => s.category !== options.filter);
      } else {
        services = services.filter(s => s.category === options.filter);
      }
    }

    const categories = [...new Set(services.map((s) => s.category))];

    this.renderServiceTabs(categories);
    this.renderServiceGrids(categories, services);
    this.bindServiceEvents();
    this.handleHashRouting();

    // Auto-expand if requested (used for Icon Service collection)
    if (this.options.autoExpand) {
        setTimeout(() => {
            $(".service-card").first().click();
        }, 100);
    }
  },

  handleHashRouting: function () {
    const hash = decodeURIComponent(window.location.hash.substring(1)).toLowerCase();
    if (!hash) return;

    const targetTab = $(`.elegant-tabs li[data-tab="${hash}"]`);
    if (targetTab.length > 0) {
      targetTab.click();
    }
  },

  renderServiceTabs: function (categories) {
    const tabsContainer = $(".elegant-tabs ul");
    if (tabsContainer.length === 0) return;
    
    tabsContainer.empty();
    categories.forEach((category, index) => {
      tabsContainer.append(`
                <li class="${index === 0 ? "active" : ""}" data-tab="${category.trim().replace(/\s+/g, "-").toLowerCase()}">
                    ${category}
                </li>
            `);
    });
  },

  renderServiceGrids: function (categories, services) {
    const serviceContent = $(".service-content");
    if (serviceContent.length === 0) return;

    // Load manifest for image resolution
    const assets = Data.masterData.assets_manifest || {};

    serviceContent.empty();
    categories.forEach((category, index) => {
      const categoryId = category.trim().replace(/\s+/g, "-").toLowerCase();
      const grid = $(
        `<div id="${categoryId}" class="services-grid ${index === 0 ? "active" : ""}"></div>`,
      );

      services
        .filter((s) => s.category === category)
        .forEach((service) => {
          const chipsHtml = this.renderServiceChips(service.footer);
          grid.append(`
                    <div class="service-card">
                        <div class="service-card-image">
                            <img src="${service.image_url}" alt="${service.title}">
                        </div>
                        <div class="service-card-content">
                            <h3>${service.title}</h3>
                            <p class="short-desc">${service.short_description}</p>
                            <p class="long-desc">${service.long_description}</p>
                            <div class="service-chips">${chipsHtml}</div>
                        </div>
                    </div>
                `);
        });
      serviceContent.append(grid);
    });
  },

  renderServiceChips: function (footerText) {
    if (!footerText) return "";
    const items = footerText.split(",").map((s) => s.trim());
    return items
      .map((item) => {
        const icon = this.getServiceIcon(item);
        return `<i class="fas ${icon}" data-title="${item}"></i>`;
      })
      .join("");
  },

  getServiceIcon: function (item) {
    const map = {
      "Color Analysis": "fa-palette",
      "Personal Style Analysis": "fa-user-tie",
      "Body Shape Analysis": "fa-bezier-curve",
      "Wardrobing": "fa-tags",
      "Lifestyle Analysis": "fa-mug-hot",
      "Virtual Shopping": "fa-laptop",
      "Lookbook Curation": "fa-book-open",
      "Shopping List": "fa-list-ul",
      "In-Person Shopping": "fa-shopping-bag",
      "Event Styling": "fa-magic",
      "Moodboard curation": "fa-images",
      "Luxury charge": "fa-gem",
    };
    return map[item] || "fa-check-circle";
  },

  bindServiceEvents: function () {
    $(".elegant-tabs li").on("click", function () {
      const tabId = $(this).data("tab");
      $(".elegant-tabs li").removeClass("active");
      $(this).addClass("active");
      $(".services-grid").removeClass("active");
      $("#" + tabId).addClass("active");
    });

    $(".service-card").on("click", function (e) {
      // Ignore click if it originated from the chips container (prevents expansion on mobile icon tap)
      if ($(e.target).closest('.service-chips').length > 0) {
        return;
      }

      const card = $(this);
      const isAlreadyActive = card.hasClass("active");
      
      if (isAlreadyActive) {
        // Disable deactivation if autoExpand is on (keep the card open)
        if (ServicesFeature.options.autoExpand) return;

        card.removeClass("active");
        return;
      }

      card.addClass("card-shifting");
      
      setTimeout(() => {
        $(".service-card").not(card).removeClass("active card-shifting");
        card.addClass("active");
        
        const navHeight = $("nav").outerHeight() || 0;
        const extraPadding = CONFIG.SETTINGS.SCROLL_OFFSET;
        const isMobile = window.innerWidth <= 768;
        
        const scrollTarget = isMobile ? (card.offset().top - (extraPadding * 2)) : card.closest('.services-grid').offset().top;

        if (!ServicesFeature.options.noScroll) {
            setTimeout(() => {
                $("html, body").animate({
                    scrollTop: scrollTarget - navHeight
                }, 600);
            }, 200);
        }

        setTimeout(() => {
            card.removeClass("card-shifting");
        }, 100);
      }, 300);
    });
  }
};
