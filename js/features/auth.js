/**
 * auth.js - Icon Service gated collection logic
 */
const AuthFeature = {
  init: async function () {
    const container = $("#icon-service-container");
    if (container.length === 0) return;

    const isAuthenticated = sessionStorage.getItem("icon_service_auth") === "true";
    if (!isAuthenticated) {
        const configArray = await Data.fetch('config');
        const config = {};
        configArray.forEach(item => config[item.key] = item.value);
        this.renderAuthGate(container, config);
        return;
    }

    container.html(`
        <section class="section-padding" style="padding-top: 140px;">
            <div class="container text-center">
                <span class="section-subtitle" text-config-key="ICON_SUBTITLE"></span>
                <div class="service-content" style="margin-top: 40px;"></div>
            </div>
        </section>
    `);
    
    // Refresh master data specifically here since auth state might have changed data access needs
    const configArray = await Data.fetch('config');
    const config = {};
    configArray.forEach(item => config[item.key] = item.value);
    Utils.applyConfig(config);

    if (typeof ServicesFeature !== 'undefined') {
        await ServicesFeature.init({ filter: "Icon Service", mode: "include", autoExpand: true, noScroll: true });
    }
  },

  renderAuthGate: function (container, config) {
    container.html(`
        <section class="section-padding hni-section" style="min-height: 80vh; display: flex; align-items: center;">
            <div class="container text-center">
                <span class="section-subtitle">Invitation Only</span>
                <h2 class="section-title">Exclusive Access</h2>
                <p>Please enter your credentials to view the Icon Collection.</p>
                <form id="auth-gate-form" class="subscribe-form" style="max-width: 400px; margin: 40px auto;">
                    <input type="email" id="auth-email" placeholder="Email Address" required style="border-color: var(--white); color: var(--white);">
                    <input type="text" id="auth-otp" placeholder="Access Code" required style="border-color: var(--white); color: var(--white);">
                    <button type="submit" class="btn" style="border-color: var(--white); color: var(--white); width: 100%;">Unlock Collection</button>
                    <p id="auth-error" style="color: #ff6b6b; margin-top: 20px; display: none;">Invalid email or access code.</p>
                </form>
            </div>
        </section>
    `);

    $("#auth-gate-form").on("submit", async (e) => {
        e.preventDefault();
        const email = $("#auth-email").val().toLowerCase().trim();
        const otp = $("#auth-otp").val().trim();
        
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
            
            const user = accessList.find(u => u.email.toLowerCase().trim() === email && u.otp === otp);

            if (user) {
                sessionStorage.setItem("icon_service_auth", "true");
                this.init();
            } else {
                $("#auth-error").text("Invalid email or access code.").fadeIn();
            }
        } catch (error) {
            console.error("Auth error:", error);
            $("#auth-error").text("System error. Please try again later.").fadeIn();
        }
    });
  }
};
