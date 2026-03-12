# StylePlanIt Technical Architecture

This document details the core logic and orchestration patterns of the StylePlanIt website.

## 1. Orchestration Philosophy
StylePlanIt uses a **Single-Page Initialization (SPI)** pattern. While the site has multiple HTML files, the logic is unified through a central loader and orchestrator.

## 2. Core Components

### `js/loader.js` (The Engine)
The loader is the first script executed. It handles:
*   **Recursive Component Loading:** Scans the DOM for `[data-component]` attributes, fetches the corresponding `.html` from `/components/`, and injects it. If a loaded component contains further `[data-component]` tags, it recurses.
*   **Dynamic Feature Detection:** Based on the presence of specific IDs or classes (e.g., `#portfolio-carousel`), it dynamically injects the required feature script (e.g., `js/features/portfolio.js`).
*   **Visual Stability:** Preloads critical background images defined by `style-bg-config-key` before hiding the loading overlay.
*   **Async Sequencing:** Uses `Promise.all` and `await` to ensure scripts are fully executed before application-wide initialization begins.

### `js/app.js` (The Orchestrator)
The orchestrator initializes global UI behaviors:
*   **Navigation:** Mobile menu toggles and smooth scroll offsets.
*   **Feature Lifecycle:** Calls `.init()` on all detected features (e.g., `HeroFeature.init()`).
*   **Lead Tracking:** Attaches global event listeners for standard conversion actions (WhatsApp, Booking).

## 3. Initialization Lifecycle
1.  **DOM Content Loaded:** `loader.js` starts.
2.  **Phase 1 (Data):** Fetch `site-data.json` and check version.
3.  **Phase 2 (Components):** Recursively fetch and inject HTML components.
4.  **Phase 3 (Features):** Inject feature-specific JS files based on DOM requirements.
5.  **Phase 4 (Configuration):** Apply `site-data.json` values to placeholders using `Utils.getConfig()`.
6.  **Phase 5 (App Init):** Call `App.init()` to start animations and event listeners.
7.  **Phase 6 (Preload):** Wait for critical visuals to load.
8.  **Finalize:** Hide loader and enable scrolling.

## 4. Stability Best Practices
*   **Absolute Paths:** Always use absolute paths (starting with `/`) for AJAX calls and script injections to ensure deep-linked routes (like `/learn#slug`) resolve resources correctly.
*   **Defensive Data Access:** Always use `await Data.loadMasterData()` and verify its existence before accessing properties like `assets_manifest`.
