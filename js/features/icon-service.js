/**
 * icon-service.js - Icon Service gated collection logic
 */
const IconServiceFeature = {
  init: async function () {
    console.log("🔍 [IconService] Init started...");
    const container = $("#icon-service-container");
    if (container.length === 0) {
        console.warn("⚠️ [IconService] Container #icon-service-container not found.");
        return;
    }

    const isAuthenticated = sessionStorage.getItem("icon_service_auth") === "true";
    console.log("🔍 [IconService] Authenticated:", isAuthenticated);
    
    if (!isAuthenticated) {
        console.log("🔍 [IconService] Rendering Gate...");
        const configArray = await Data.fetch('config');
        const config = {};
        configArray.forEach(item => config[item.key] = item.value);
        this.renderGate(container, config);
        return;
    }

    console.log("🔍 [IconService] User authorized, setting up template...");
    document.body.classList.add("icon-service-page");
    
    container.html(`
        <section class="section-padding" style="padding-top: 140px;">
            <div class="container text-center">
                <span class="section-subtitle" text-config-key="ICON_SUBTITLE"></span>
                <h2 class="section-title" id="active-category-title" style="display: none;"></h2>
                
                <!-- Hidden grid for Icon Service (we only want the expanded card) -->
                <div class="service-content" style="display: none;"></div>
                
                <!-- The main content -->
                <div id="service-details-container" class="service-details-container" style="display: block;"></div>
            </div>
        </section>
    `);
    
    // Refresh master data specifically here since access state might have changed data access needs
    const configArray = await Data.fetch('config');
    const config = {};
    configArray.forEach(item => config[item.key] = item.value);
    Utils.applyConfig(config);

    if (typeof ServicesFeature !== 'undefined') {
        console.log("🔍 [IconService] Calling ServicesFeature.init with filter 'Icon Service'...");
        await ServicesFeature.init({ filter: "Icon Service", mode: "include", autoExpand: true, noScroll: true });
    } else {
        console.error("❌ [IconService] ServicesFeature is undefined!");
    }
  },

  renderGate: function (container, config) {
    container.html(`
        <section class="section-padding hni-section" style="min-height: 80vh; display: flex; align-items: center;">
            <div class="container text-center">
                <span class="section-subtitle">Invitation Only</span>
                <h2 class="section-title">Exclusive Access</h2>
                <p>${config.ICON_AUTH_TEXT || "Please enter your registered email to unlock."}</p>
                <form id="icon-gate-form" class="subscribe-form" style="max-width: 400px; margin: 40px auto;">
                    <input type="email" id="icon-gate-email" placeholder="Email Address" required style="border-color: var(--white); color: var(--white);">
                    <button type="submit" class="btn" style="border-color: var(--white); color: var(--white); width: 100%;">Unlock Collection</button>
                    <p id="icon-gate-error" style="color: #ff6b6b; margin-top: 20px; display: none;"></p>
                </form>
            </div>
        </section>
    `);

    $("#icon-gate-form").on("submit", async (e) => {
        e.preventDefault();
        const email = $("#icon-gate-email").val().toLowerCase().trim();
        const errorEl = $("#icon-gate-error");
        
        errorEl.hide();
        
        try {
            const spreadsheetId = config.ACCESS_SPREADSHEET_ID;
            const gid = config.ACCESS_GID;

            if (!spreadsheetId || !gid) {
                console.error("Access config missing", config);
                throw new Error("Access configuration missing");
            }

            const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/pub?gid=${gid}&output=csv&t=${new Date().getTime()}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch live access list");
            
            const csvText = await response.text();
            const accessList = Utils.parseCSV(csvText);
            
            // Check only for email validity
            const user = accessList.find(u => u.email && u.email.toLowerCase().trim() === email);

            if (user) {
                sessionStorage.setItem("icon_service_auth", "true");
                this.init();
            } else {
                // If user is not in list, show message and redirect to cal.com
                errorEl.text("Access denied. Opening request access form...").fadeIn();
                setTimeout(() => {
                    window.open(config.ICON_CAL_HREF || "https://cal.com/styleplanit/the-icon-service", "_blank");
                    errorEl.text("Request form opened in new tab. Please register to continue.");
                }, 2000);
            }
        } catch (error) {
            console.error("Access error:", error);
            errorEl.text("System error. Please try again later.").fadeIn();
        }
    });
  }
};
