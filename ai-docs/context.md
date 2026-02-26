# StylePlanIt Portfolio Website Project Context

This document provides a summary of the StylePlanIt website project for context continuity.

## 1. Project Overview

*   **Project:** A portfolio website for StylePlanIt, a premium personal styling consultancy in Toronto.
*   **Founders:** Ayushi Vyas and Deepesh Mehta.
*   **Mission:** To combine the immigrant experience with professional styling. The consultancy targets two main audiences:
    1.  Ambitious newcomers needing help to land jobs.
    2.  High-Net-Worth Individuals (HNIs) looking to manage their image.
*   **Production Domain:** `https://styleplanit.com` (Managed via Cloudflare).
*   **Hosting:** GitHub Pages.

*   **Aesthetic & Design System:**
    *   **Images:** Managed via a hybrid model. Static assets like heroes and logos are discovered automatically via the `assets_manifest` (folder-based). Page-specific content (Services, Team) uses relative paths provided in Google Sheets.
    *   **Standardized Assets:** Brand logos are controlled via the `.brand-logo-item` CSS class (fixed `180x80px` container, `object-fit: contain`) ensuring a clean, uniform look across all assets.
    *   **Overall Aesthetic:** "Luxury Minimalist," "Old Money," "Editorial." The design emphasizes clean lines, sharp edges, and generous whitespace.
    *   **Fonts:**
    *   **Headings (Serif):** 'Cormorant Garamond'
    *   **Body (Sans-Serif):** 'Montserrat'
*   **Typography Standards:**
    *   **Em-dashes:** Use actual em-dashes (`—`) instead of unicode escapes (`\u2014`) or multiple hyphens (`--`) to maintain a high-end editorial look.
    *   **Line Breaks:** Use literal `\n` in JSON for intentional multi-line content (e.g., reviews, bios).
*   **Color Palette:**
    *   **Primary Accent (Eucalyptus Green):** `#0c4524` (Used for buttons, links, highlights, and site loader)
    *   **Accent Hover (Darker Green):** `#547c65`
    *   **Background (Lightest Green):** `#e6f0e7`
    *   **Headings (Rich Black):** `#0F0F0F`
    *   **Body Text (Soft Black):** `#2A2A2A`
    *   **White:** `#ffffff`
*   **Styling:**
    *   **Buttons:** Pillar-shaped (200px border-radius) with thin borders and tracking (letter-spacing).
    *   **Section Padding:** Standardized vertical padding of 75px.
    *   **Responsive Layout:** Alternating flex-row-reverse grids for "Meet the Team" and dynamic slideshows for mobile hero sections.

## 3. Tech Stack & File Structure

*   **Frameworks:** jQuery (for event delegation and DOM manipulation).
*   **Core Files:**
    *   `index.html`, `services.html`, `meet-the-team.html`, `icon-service.html`: Page structures.
    *   `js/config.js`: Centralized constants and configuration keys.
    *   `js/utils.js`: Core shared utilities (`parseCSV`, `applyConfig`, `Data` provider).
    *   `js/loader.js`: The system orchestrator. Injects HTML components and dynamically loads required feature modules based on page content.
    *   `js/app.js`: Lightweight global logic (Navigation) and feature initialization coordinator.
    *   **`js/features/` (Feature-Based Plugin Architecture):**
        *   `hero.js`: Hero section slideshow logic.
        *   `services.js`: Universal service grid rendering and category filtering.
        *   `reviews.js`: Testimonial expansion and rendering logic.
        *   `team.js`: Team profile rendering.
        *   `subscribe.js`: Mailchimp integration and success animations.
        *   `auth.js`: "Icon Service" gated access gate and real-time Google Sheets fetching.
        *   `dialogs.js`: Dynamic popup notification system with scheduling and session-based persistence.
    *   `components/`: Reusable HTML snippets (`header.html`, `footer.html`).
    *   `styles/`: Modular CSS structure:
        *   `variables.css`: Design system tokens and luxury theme variables.
        *   `common.css`: Reset, shared components, and core layout.
        *   `desktop.css`: High-end editorial layouts and desktop-specific grids.
        *   `mobile.css`: Responsive overrides and mobile navigation.
        *   `styles.css`: (Deprecated) Entry point for backward compatibility.
    *   `configs/`: Local CSV backups for offline/failover resilience.
    *   `assets/images/`: Local directory for optimized site images.
    *   `test.sh`: Automated health check script for endpoint verification.

## 4. Data & Configuration Layer

The website utilizes a streamlined, atomic data architecture optimized for performance and maintainability.

*   **Atomic Source:** All site data (config, services, reviews, team, version) is consolidated into a single `configs/site-data.json` file.
*   **Sync Workflow:** Data is updated from Google Sheets via the `sync-styleplanit.command` tool in the root directory. 
    *   **Architecture:** The core synchronization logic resides in `scripts/sync_engine.py` with shared utilities in `scripts/data_utils.py`.
    *   **All-in-One Integration:** The script automatically scans the `assets/images/` directory tree and generates an `assets_manifest` within `site-data.json`. This allows the frontend to dynamically discover local images without manual entry in Google Sheets.
    *   **Key Parameters:**
        *   `--no-push`: Commits updates locally without pushing to remote.
        *   `--no-branch-switch`: Allows synchronization directly on the active feature branch (bypassing the default `main` checkout).
    *   **Audit Tool:** `scripts/diff_site_data.py` is an interactive 3-way resolution engine (Local vs. Sheets vs. Manual) used to identify and resolve discrepancies.
        *   **Resolution Matrix:**
            1.  **Mismatch:** Choose between Local (keeps local, updates Sheets via CSV), Sheets (updates local), or Manual (updates both).
            2.  **Sheets Only:** Choose Local (adds to a manual deletion list for Sheets) or Sheets (adds to local site-data.json).
            3.  **Local Only:** Choose Local (keeps local, adds to Sheets update CSV) or Sheets (deletes from local site-data.json).
        *   **Efficiency:** Only prompts for local saves or generates update CSVs if actionable changes are made during the session.
*   **Performance & Caching:** The site implements a robust **Stale-While-Revalidate** pattern with active enforcement:
    *   **Instant Load:** Content is served immediately from `site_data_cache` in `localStorage`.
    *   **Active Versioning:** On every load, the system fetches fresh data in the background. If the server version differs from the local `app_version`, the cache is purged and the page is hard-reloaded.
    *   **24-Hour TTL:** The cache is automatically invalidated and refreshed if the `cache_timestamp` is older than 24 hours, ensuring data doesn't grow stale.
*   **Resilience:** The repository version of `site-data.json` serves as the ultimate fallback, ensuring the site remains functional even if the Google Sheets API is unreachable.

## 5. SEO & Social Optimization

*   **Meta Engine:** `Utils.applyConfig` dynamically updates `PAGE_DESCRIPTION`, `OG_IMAGE`, and `PAGE_TITLE` based on sheet values.
*   **Clean URLs:** Navigation is configured for extensionless URLs (e.g., `/services`, `/meet-the-team`) where host-compatible.

## 6. Component Features

*   **Integrated Featured Services:**
    *   **Filtering Logic:** The rendering engine supports `exclude` or `include` filters. It also supports `autoExpand` (to force a card open) and `noScroll` (to prevent layout jumps).
    *   **Exclusive Access (Icon Service):** A simplified, invitation-only collection (`icon-service.html`).
        *   **UI:** Renders only the "By Invitation Only" subtitle and a single, non-collapsible, auto-expanded service card.
        *   **Verification:** Real-time Email/OTP lookup directly against Google Sheets.
    *   **Desktop:** Active cards expand to full-width and move to the top row (`order: -1`) using a flex-row editorial layout.
    *   **Mobile:** Active cards expand in-place to `80vh` with a vertically stacked layout to maintain grid stability.
    *   **Content Swapping:** Uses a dual-description model (`short-desc` vs `long-desc`) to provide a precis in grid view and detail in featured view.
*   **Service Chips:** Footer keywords are rendered as FontAwesome icons with a custom CSS-based "Luxury Minimalist" tooltip system.
*   **Hero Section:** Editorial tiled layout on desktop; auto-fading slideshow on mobile.
*   **Team Collective:** Alternating "Profile Cards" with grayscale-to-color hover effects.
*   **Review Cards:** Expandable cards with a luxury fade-out for long content and internal scroll-reset logic.
*   **Site Loader:** A full-screen branded overlay ensuring a seamless transition by waiting for dynamic data.

## 7. Development & Safety

*   **Version Control:** Active development follows a `feature/branching` model (e.g., `feature/google-form-subscription`).
*   **Local Security:** `.env.asana` and sensitive tokens are strictly ignored by `.gitignore`. 
    *   **AI Protocol:** AI assistants must NEVER read or output the contents of `.env.asana`. To interact with the Asana API, use a subshell to source the token directly into the command (e.g., `(source .env.asana && curl -H "Authorization: Bearer $ASANA_PAT" ...)`). This ensures the token remains invisible to logs and outputs.
    *   **Asana Workflow:**
        1.  **Project Identification:** Identify the "Style Plan-It Launch Plan" project (`gid: 1212636326772928`).
        2.  **Secure Task Management:** Use `curl` to fetch tasks/subtasks and update their status (e.g., `setParent`, `PUT` status).
        3.  **Mandatory User Confirmation:** An AI assistant must NEVER mark a task as complete without the user's explicit confirmation of the implementation.
    *   **Development Lifecycle:**
        1.  **Research & Strategy:** Map the codebase and propose a plan before implementation.
        2.  **Feature Branching:** All non-trivial changes must be developed on a dedicated `feature/` branch.
        3.  **Surgical Execution:** Apply precise changes that follow "Luxury Minimalist" aesthetics.
        4.  **User Verification (Mandatory):** AI assistants must NEVER commit changes without presenting the specific code diff to the user and receiving explicit confirmation to proceed with the commit.
        5.  **Data Audit (Mandatory Wrap-Up):** Before finalizing, use `scripts/diff_site_data.py` to compare local `site-data.json` with remote Google Sheets. 
            *   If differences are detected, present them to the user and offer a sync via `scripts/sync_engine.py --no-push`.
            *   Run `test.sh` to ensure site health.
        6.  **Pull Request & Merge:** Once verified, push the feature branch and merge into `main` via a Pull Request. Commit with a meaningful message.
*   **Data Integrity:** All fetch operations default to safe empty arrays `[]` upon dual-source failure to prevent application crashes.
