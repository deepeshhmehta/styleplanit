/**
 * subscribe.js - Mailchimp subscription and animations
 */
const SubscribeFeature = {
  init: function (config) {
    const container = $("#subscribe-container");
    const form = $("#mc-embedded-subscribe-form, .subscribe-form");
    const success = $("#subscribe-success");

    if (form.length === 0) return;

    // 1. Mailchimp validation configuration
    window.fnames = new Array();
    window.ftypes = new Array();
    fnames[0] = "EMAIL"; ftypes[0] = "email";
    fnames[2] = "NAME"; ftypes[2] = "text";

    // 2. Defer loading validation script
    if (!$('script[src*="mc-validate.js"]').length) {
      $(document).on('appReady', function() {
        const script = document.createElement("script");
        script.src = "//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js";
        script.type = "text/javascript";
        script.async = true;
        document.body.appendChild(script);
      });
    }

    // 3. Handle submission
    form.off("submit").on("submit", function (e) {
      if (!$("#legal-checkbox").is(":checked")) {
        e.preventDefault();
        e.stopPropagation();
        alert("Please agree to the terms and conditions to subscribe.");
        return false;
      }

      setTimeout(() => {
        container.fadeOut(600, function() {
          success.fadeIn(600);
          setTimeout(() => {
            success.fadeOut(600, function() {
              form[0].reset();
              container.fadeIn(600);
            });
          }, 20000);
        });
      }, 500);
    });
  }
};
