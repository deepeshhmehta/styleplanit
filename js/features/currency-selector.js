/**
 * currency-selector.js - Dynamic currency dropdown component
 */
const CurrencySelectorFeature = {
    init: function() {
        const currency = Utils.getCurrentCurrency();
        
        // Initialize UI values
        this.updateUI(currency);
        this.bindEvents();
    },

    updateUI: function(currency) {
        $(".active-currency-label").text(currency);
        $(".currency-dropdown-item").removeClass("active");
        $(`.currency-dropdown-item[data-currency="${currency}"]`).addClass("active");
        
        // Update BESPOKE_PRICE dynamically
        const bespokePriceEl = $('[text-config-key="BESPOKE_PRICE"]');
        if (bespokePriceEl.length > 0) {
            if (currency === 'INR') {
                bespokePriceEl.text("Starting at ₹4,999.99");
            } else {
                const basePrice = Data.getConfig('BESPOKE_PRICE') || "Starting at $78";
                bespokePriceEl.text(basePrice);
            }
        }
    },

    bindEvents: function() {
        const self = this;

        // Toggle dropdown open/close
        $(document).on("click", ".currency-dropdown-trigger", function (e) {
            e.stopPropagation();
            const trigger = $(this);
            const dropdown = trigger.closest(".currency-dropdown");
            const expanded = trigger.attr("aria-expanded") === "true";
            
            trigger.attr("aria-expanded", String(!expanded));
            dropdown.toggleClass("open", !expanded);
        });

        // Close on click outside
        $(document).on("click", function (e) {
            if (!$(e.target).closest(".currency-dropdown").length) {
                $(".currency-dropdown-trigger").attr("aria-expanded", "false");
                $(".currency-dropdown").removeClass("open");
            }
        });

        // Select currency item
        $(document).on("click", ".currency-dropdown-item", function () {
            const currency = $(this).attr("data-currency");
            Utils.setCurrency(currency);
            
            $(".currency-dropdown-trigger").attr("aria-expanded", "false");
            $(".currency-dropdown").removeClass("open");
        });

        // Handle currency changes globally
        if (!this.currencyListenerAdded) {
            document.addEventListener('currencyChange', (e) => {
                this.updateUI(e.detail.currency);
            });
            this.currencyListenerAdded = true;
        }
    }
};
