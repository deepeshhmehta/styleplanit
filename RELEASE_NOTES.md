# Style Plan(it) Release Notes

All notable changes to this project will be documented in this file.

## [2.2.0] - 2026-09-02
### Added & Changed
- **Unified CAD Packages**: Standardized homepage journey bundles to `Align` ($168), `Refine` ($402), and `Visionary` ($627) priced in CAD.
- **Single Currency Architecture**: Reverted multi-currency switching and country-specific package toggles, standardizing all services and packages in CAD across the platform.

## [2.1.1] - 2026-06-21
### Added
- **Country-Based Category Filtering**: Implemented dynamic category swapping on the homepage "Pick a Journey" packages section based on the user's location/currency. INR preference loads Indian categories (`Align`, `Refine`, `Visionary`) and default/CAD loads default categories (`Establish`, `Reclaim`, `Elevate`).
- **Dynamic Grid Reset**: Configured the package grid to instantly reset any expanded or active card states when toggling currency, preventing layout alignment issues.
- **Unit and E2E Tests Support**: Updated mock data structures in existing test files (`test_journeys.py`, `test_features_v1_2.py`) to align with the new country/location logic, ensuring 100% automated test compliance.

## [2.1.0] - 2026-06-19
### Added
- **Indian Pricing (INR)**: Integrated Indian Pricing support from the Google Sheets, syncing `price_inr` for all categories and services.
- **Dynamic Currency Switcher**: Implemented a luxury-minimalist custom currency dropdown switcher next to the shop icon in the top header.
- **Location-Based Detection**: Added automatic currency auto-detection defaulting to `INR` for Indian users (via timezone and locale flags) and `CAD` for all others.
- **URL Overrides**: Added support for URL parameters (`?currency=INR` or `?currency=CAD`) to override location defaults.
- **Automated Tests**: Added E2E Playwright tests verifying currency location-detection, URL overrides, and precedence logic.

## [2.0.4] - 2026-06-14
### Added
- **Father's Day Promotion**: Added and activated the Father's Day promo modal with updated copy ("To the man beneath the title of Dad"), CTA ("Celebrate Him ✨"), background image asset (`fathers-day-bg.jpg`), and pricing ($114) targeting Father's Day 2026.
- **Promo Persistence**: Configured the promotion modal with `"persist": "TRUE"` to convert the modal into a persistent floating gift icon upon dismissal, allowing users to easily re-trigger the offer.

### Changed
- **Mother's Day Archive**: Preserved the expired Mother's Day promotion configuration in `site-data.json` for historical/audit purposes.

## [2.0.3] - 2026-05-31
### Added
- **Data Sync Robustness**: Updated `diff_site_data.py` to support partial key matching (`any` vs `all`), improving the reliability of the Google Sheets to JSON sync engine.

### Changed
- **Service Catalog Refinement**:
  - Updated "30 Min Style Revamp" with a price reduction ($114 -> $87) and focused footer scope (removed Color Analysis).
  - Normalized `site-data.json` schema by moving the `price` field to a consistent position across all service entries.

## [2.0.2] - 2026-05-06
### Added
- **Analytics Architecture v2**: Transitioned from basic click tracking to high-fidelity business intelligence.
- **Funnel Progression Tracking**: Implemented `funnel_step` events to measure conversion health (Journey Selection -> Service View -> Lead Initiation).
- **Outbound Link Monitoring**: Centralized tracking for all external redirects (ShopMy, Cal.com, WhatsApp, Socials) with domain-level attribution.
- **Session Attribution**: Implemented a persistence layer to attribute leads to the last interacted marketing promotion.

## [2.0.1] - 2026-05-05
### Added
- **ShopMy Integration**: Added a dedicated shopping cart icon to the navigation bar, providing direct access to Ayushi Vyas's curated ShopMy storefront.
- **Security Enhancements**: Implemented `rel="noopener noreferrer"` for all external storefront redirects.

## [2.0.0] - 2026-05-03 (Milestone: Platform Governance & v2 Architecture)
### Added
- **Self-Healing QA Engine**: Implemented tiered parallel execution (50% faster) and automatic sequential retries to eliminate environmental flakiness.
- **PR Audit Workflow**: Integrated GitHub Actions to enforce semantic version jumps for all PRs targeting `staging` or `main`.
- **Architectural Integrity Tests**: Added automated verification for security headers, data schema validity, and responsive UX ordering.

### Changed
- **Smart Data Normalization**: Improved the diff engine to recursively handle Google Sheets numerical formatting (e.g., treating `2.0.0` and `2` as equivalent).
- **Context Evolution**: Updated project governance docs to reflect the new Tiered Promotion Model.

## [1.2.0] - 2026-05-03 (Project Milestone: Demographic Expansion)
### Added
- **Alternating Category Imagery**: Implemented a dynamic demographic rotation system (Male/Female) for 'Pick Your Journey' cards to broaden customer appeal.
- **Cross-Fade Transition**: Smooth 1.2s visual tempo for image rotation using a layered CSS opacity system.
- **New Male Assets**: Integrated 3 high-fidelity male hero images generated via Nano Banana.
- **Configurable Timing**: Added `CATEGORY_IMAGE_ROTATION_INTERVAL` to `site-config.json` for centralized UI control.

### Removed
- **Sync Engine Purge**: Deleted the deprecated `scripts/sync_engine.py` to enforce strict 'No direct to Main' governance and PR-only deployments.

### Changed
- **Data Schema**: Refactored `categories` to support `image_urls` (pipe-separated) instead of a single `image_url`.
- **Tooling**: Refactored `sync-styleplanit.command` to utilize the `diff_site_data.py` auditor as the primary local data tool.

### Fixed
- **JS Error**: Resolved a `Data.loadMasterData` TypeError in `home-services.js` that occurred during feature initialization.

## [1.1.1] - 2026-05-03 (UX: Social Footprint)
### Added
- **Social Links**: Integrated TikTok (@ayushivyasofficial) and LinkedIn (/ayushi-vyas) to the footer.
- **Email Migration**: Updated primary contact email to `info@styleplanit.com`.

### Changed
- **Responsive Footer**: Implemented a dual-row layout for mobile and tablet devices:
  - Row 1: Grouped social icons (IG, TT, Email, LI) with pipe separators.
  - Row 2: Centered and expanded phone number for high-visibility contact.
- **UI Polish**: Migrated from inline `&nbsp;` to CSS-driven spacing for icons.

## [1.1.0] - 2026-04-26 (Infrastructure: Marketing & Stability)
### Added
- **Unified Promotion System**: Automated Mother's Day promo with expiry logic and persistent trigger support.
- **QA Engine (v1.0)**: Introduced an automated E2E testing suite using Playwright.

### Fixed
- **Mobile Stabilization**: Optimized modal proportions and safe-area alignment specifically for iPhone viewports.

## [1.0.0] - 2026-04-24 (The Go-Live Baseline)
### Added
- **Official Production Launch**: Initial release of the Style Plan(it) Toronto consultancy site.
- **Core Experience**: "Pick a Journey" (Establish, Reclaim, Elevate) and the modular Styling Menu.
- **Data-Driven Core**: Implementation of the atomic split configuration (`site-data.json` and `site-config.json`).
