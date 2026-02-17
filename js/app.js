/**
 * app.js - Main application logic
 */
const App = {
  init: function () {
    this.initNavigation();
    this.initHero();
    if ($("#reviews-container").length > 0) {
      this.initReviews();
    }
    if ($("#services").length > 0) {
      this.initServices();
    }
  },

  initNavigation: function () {
    // Mobile menu toggle using event delegation
    $(document).on("click", ".menu-toggle", function () {
      var expanded = $(this).attr("aria-expanded") === "true";
      $(this).attr("aria-expanded", String(!expanded));
      $(".nav-links").toggleClass("active");
    });

    // Close on nav click
    $(document).on("click", ".nav-links a", function () {
      $(".nav-links").removeClass("active");
      $(".menu-toggle").attr("aria-expanded", "false");
    });
  },

  initHero: function () {
    const heroSlideshow = () => {
      const heroBgs = $(".hero-bg");
      let current = 0;
      if (heroBgs.length === 0) return;

      heroBgs.css("opacity", "0").css("transition", "opacity 1s ease-in-out");
      heroBgs.eq(current).css("opacity", "1").addClass("active");

      setInterval(() => {
        heroBgs.eq(current).css("opacity", "0").removeClass("active");
        current = (current + 1) % heroBgs.length;
        heroBgs.eq(current).css("opacity", "1").addClass("active");
      }, 2000);
    };

    if (window.innerWidth <= 768) {
      heroSlideshow();
    }
  },

  initServices: async function () {
    const services = await Data.fetch("services");
    if (services.length === 0) return;

    const categories = [...new Set(services.map((s) => s.category))];

    this.renderServiceTabs(categories);
    this.renderServiceGrids(categories, services);
    this.bindServiceEvents();
  },

  renderServiceTabs: function (categories) {
    const tabsContainer = $(".elegant-tabs ul");
    categories.forEach((category, index) => {
      tabsContainer.append(`
                <li class="${index === 0 ? "active" : ""}" data-tab="${category.replace(/\s+/g, "-").toLowerCase()}">
                    ${category}
                </li>
            `);
    });
  },

  renderServiceGrids: function (categories, services) {
    const serviceContent = $(".service-content");
    categories.forEach((category, index) => {
      const categoryId = category.replace(/\s+/g, "-").toLowerCase();
      const grid = $(
        `<div id="${categoryId}" class="services-grid ${index === 0 ? "active" : ""}"></div>`,
      );

      services
        .filter((s) => s.category === category)
        .forEach((service) => {
          grid.append(`
                    <div class="service-card" data-long-desc="${service.long_description}">
                        <img src="${service.image_url}" alt="${service.title}">
                        <h3>${service.title}</h3>
                        <p>${service.short_description}</p>
                        <span class="price-tag">${service.footer}</span>
                    </div>
                `);
        });
      serviceContent.append(grid);
    });
  },

  bindServiceEvents: function () {
    $(".elegant-tabs li").on("click", function () {
      const tabId = $(this).data("tab");
      $(".elegant-tabs li").removeClass("active");
      $(this).addClass("active");
      $(".services-grid").removeClass("active");
      $("#" + tabId).addClass("active");
      $("#service-details").slideUp();
    });

    $(".service-card").on("click", function () {
      $(".service-card").removeClass("active");
      $(this).addClass("active");

      const title = $(this).find("h3").text();
      const longDesc = $(this).data("long-desc");
      const price = $(this).find(".price-tag").text();

      $("#service-details").slideUp(function () {
        $(this)
          .html(
            `

                                            <h3>${title}</h3>

                                            <p>${longDesc}</p>

                                            <span class="price-tag">${price}</span>

                                        `,
          )
          .slideDown(function () {
            // Calculate dynamic offset based on nav height

            const navHeight = $("nav").outerHeight() || 0;

            const extraPadding = 40; // Small aesthetic gap

            $("html, body").animate(
              {
                scrollTop: $(this).offset().top - navHeight - extraPadding,
              },
              500,
            );
          });
      });
    });
  },

  initReviews: async function () {
    const reviews = await Data.fetch("reviews");
    if (reviews.length === 0) return;

    const container = $("#reviews-container");
    reviews.forEach((review) => {
      container.append(`
                <div class="review-card">
                    <p>"${review.text.replace(/"/g, "")}"</p>
                    <span>${review.author}</span>
                </div>
            `);
    });
  },
};
