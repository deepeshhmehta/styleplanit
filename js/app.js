/**
 * app.js - Main application logic
 */
const App = {
  init: function (config) {
    this.initNavigation();
    this.initHero(config);
    this.bindReviewToggle();
    if ($("#team-container").length > 0) {
      this.initTeam();
    }
    if ($("#reviews-container").length > 0) {
      this.initReviews();
    }
    if ($("#services").length > 0) {
      this.initServices();
    }
    this.initSubscribe(config);
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
      // On desktop, ensure all are visible and tiled (CSS handles the 33% width)
      // We also stop any potential opacity transitions
      heroBgs.css({
        opacity: 1,
        transition: "none",
      }).addClass("active");
    }
  },

  initServices: async function () {
    const services = await Data.fetch("services");
    if (services.length === 0) {
      $(".service-content").html('<p class="text-center section-padding">Service menu is temporarily unavailable. Please check back later.</p>');
      return;
    }

    const categories = [...new Set(services.map((s) => s.category))];

    this.renderServiceTabs(categories);
    this.renderServiceGrids(categories, services);
    this.bindServiceEvents();
    this.handleHashRouting();
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
                            <img src="${service.image_url}" alt="${service.title}" loading="lazy">
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
      // Original code removed: $("#service-details").slideUp();
    });

    $(".service-card").on("click", function () {
      const card = $(this);
      const isAlreadyActive = card.hasClass("active");
      
      if (isAlreadyActive) {
        card.removeClass("active");
        return;
      }

      // 1. Fade out current view briefly to mask layout jump
      card.addClass("card-shifting");
      
      setTimeout(() => {
        $(".service-card").not(card).removeClass("active card-shifting");
        card.addClass("active");
        
        // 2. Scroll to the active card
        const navHeight = $("nav").outerHeight() || 0;
        const extraPadding = CONFIG.SETTINGS.SCROLL_OFFSET;
        const isMobile = window.innerWidth <= 768;
        
        // On mobile, card stays in place. On desktop, it moves to top of grid.
        const scrollTarget = isMobile ? (card.offset().top - (extraPadding * 2)) : card.closest('.services-grid').offset().top;

        setTimeout(() => {
            $("html, body").animate({
                scrollTop: scrollTarget - navHeight
            }, 600);
        }, 200);

        // 3. Fade back in
        setTimeout(() => {
            card.removeClass("card-shifting");
        }, 100);
      }, 300);
    });
  },

  initReviews: async function () {
    const reviews = await Data.fetch("reviews");
    if (reviews.length === 0) {
      $("#reviews-container").html('<p class="text-center">Reviews are currently being updated.</p>');
      return;
    }

    const container = $("#reviews-container");
    reviews.forEach((review) => {
      container.append(`
                <div class="review-card">
                    <span class="review-author">${review.author}</span>
                    <p>"${review.text.replace(/"/g, "")}"</p>
                </div>
            `);
    });
  },

  // Added global review toggle (consistent with initNavigation pattern)
  bindReviewToggle: function() {
    $(document).on("click", ".review-card", function() {
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
            // Reset internal scroll when collapsing
            card.scrollTop(0);
            // Smooth scroll window back to top of card if it was scrolled far down
            $("html, body").animate({
                scrollTop: card.offset().top - navHeight - extraPadding
            }, 200);
        }
    });
  },

  initTeam: async function () {
    const team = await Data.fetch("team");
    const container = $("#team-container");
    
    if (!team || team.length === 0) {
      container.html('<p class="text-center">Team details coming soon.</p>');
      return;
    }

    container.empty(); // Clear placeholder
    team.forEach((person, index) => {
      const isEven = index % 2 === 0;
      const alignmentClass = isEven ? "image-left" : "image-right";
      
      container.append(`
                <div class="profile-card ${alignmentClass}">
                    <div class="profile-image">
                        <img src="${person.imageUrl}" alt="${person.name}" loading="lazy">
                    </div>
                    <div class="profile-text">
                        <h3>${person.name}</h3>
                        <span class="role">${person.role}</span>
                        <p class="bio">${person.bio}</p>
                    </div>
                </div>
            `);
    });
  },

  initSubscribe: function (config) {
    const form = $("#subscribe-form");
    if (form.length === 0) return;

    form.on("submit", function (e) {
      e.preventDefault();

      if (!$("#legal-checkbox").is(":checked")) {
        alert("Please agree to the terms and conditions.");
        return;
      }

      const email = $("#subscriber-email").val();
      const name = $("#subscriber-name").val();
      const actionUrl = config.MAILCHIMP_FORM_ACTION; // Use Mailchimp's action URL
      const emailFieldName = config.MAILCHIMP_EMAIL_FIELD_NAME; // Mailchimp's email field name
      const nameFieldName = config.MAILCHIMP_NAME_FIELD_NAME; // Mailchimp's name field name
      const hiddenFieldName = config.MAILCHIMP_HIDDEN_FIELD_NAME; // Mailchimp's hidden bot-trap field
      const hiddenFieldValue = config.MAILCHIMP_HIDDEN_FIELD_VALUE; // Mailchimp's hidden bot-trap value

      if (!actionUrl || !emailFieldName || !nameFieldName) {
        console.warn("Mailchimp configuration missing.");
        return;
      }

      // Create a temporary form that targets the hidden iframe
      const tempForm = $(`
        <form action="${actionUrl}" method="POST" target="hidden_iframe" style="display:none;">
            <input type="email" name="${emailFieldName}" value="${email}">
            <input type="text" name="${nameFieldName}" value="${name}">
            <input type="text" name="${hiddenFieldName}" value="${hiddenFieldValue}">
        </form>
      `);

      $("body").append(tempForm);
      tempForm.submit();
      
      // Clean up
      setTimeout(() => tempForm.remove(), 500);

      // UI Feedback
      form.fadeOut(function() {
        $("#subscribe-success").fadeIn();
      });
    });
  },
};
