# StylePlanIt Portfolio Website Project Context

This document provides a summary of the StylePlanIt website project for context continuity.

## 1. Project Overview

*   **Project:** A portfolio website for StylePlanIt, a premium personal styling consultancy in Toronto.
*   **Founders:** Ayushi Vyas and Deepesh Mehta.
*   **Mission:** To combine the immigrant experience with professional styling. The consultancy targets two main audiences:
    1.  Ambitious newcomers needing help to land jobs.
    2.  High-Net-Worth Individuals (HNIs) looking to manage their image.
*   **Hosting:** GitHub Pages.

## 2. Aesthetic & Design System

*   **Overall Aesthetic:** "Luxury Minimalist," "Old Money," "Editorial." The design emphasizes clean lines, sharp edges, and generous whitespace.
*   **Fonts:**
    *   **Headings (Serif):** 'Cormorant Garamond'
    *   **Body (Sans-Serif):** 'Montserrat'
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
    *   `index.html`, `services.html`, `meet-the-team.html`: Main page structures.
    *   `js/config.js`: Centralized constants and Google Sheets IDs.
    *   `js/utils.js`: Shared `Utils` (CSV parsing, Meta management) and `Data` (Primary/Backup fetching logic).
    *   `js/app.js`: Application-specific UI logic (Services, Team, Hero, Reviews).
    *   `js/loader.js`: Manages component injection and the "Luxury Minimalist" fade-out loading screen.
    *   `components/`: Reusable HTML snippets (`header.html`, `footer.html`).
    *   `styles/`: Modular CSS structure:
        *   `common.css`: Reset, variables, typography, and shared components.
        *   `desktop.css`: High-end editorial layouts and desktop-specific grids.
        *   `mobile.css`: Responsive overrides and mobile navigation.
        *   `styles.css`: (Deprecated) Entry point for backward compatibility.
    *   `configs/`: Local CSV backups for offline/failover resilience.
    *   `test.sh`: Automated health check script for endpoint verification.

## 4. Data & Configuration Layer

The website utilizes a streamlined, atomic data architecture optimized for performance and maintainability.

*   **Atomic Source:** All site data (config, services, reviews, team, version) is consolidated into a single `configs/site-data.json` file.
*   **Sync Workflow:** Data is updated from Google Sheets via the `sync-styleplanit.command` tool in the root directory. 
    *   **Architecture:** The core synchronization logic resides in `scripts/sync_engine.py` with shared utilities in `scripts/data_utils.py`.
    *   **Key Parameters:**
        *   `--no-push`: Commits updates locally without pushing to remote.
        *   `--no-branch-switch`: Allows synchronization directly on the active feature branch (bypassing the default `main` checkout).
    *   **Audit Tool:** `scripts/diff_site_data.py` helps identify discrepancies between local `site-data.json` and remote Google Sheets before merging.
    *   **User-Friendly Design:** The tool is double-clickable and searchable via macOS Spotlight. It automatically installs any missing dependencies (Homebrew, Git, Python 3) to ensure a seamless experience for non-technical users.
*   **Performance:** The site implements a **Stale-While-Revalidate** pattern. It loads instantly from `site_data_cache` in `localStorage` and performs a silent background refresh from the server to ensure future visits are up to date.
*   **Resilience:** The repository version of `site-data.json` serves as the ultimate fallback, ensuring the site remains functional even if the Google Sheets API is unreachable.

## 5. SEO & Social Optimization

*   **Meta Engine:** `Utils.applyConfig` dynamically updates `PAGE_DESCRIPTION`, `OG_IMAGE`, and `PAGE_TITLE` based on sheet values.
*   **Clean URLs:** Navigation is configured for extensionless URLs (e.g., `/services`, `/meet-the-team`) where host-compatible.

## 6. Component Features

*   **Integrated Featured Services:**
    *   **Filtering Logic:** The rendering engine supports `exclude` or `include` filters. Regular service pages hide the "Icon Service" category, which is reserved for the private collection.
    *   **Exclusive Access (Icon Service):** A gated, invitation-only collection (`icon-service.html`) utilizing a "Luxury Minimalist" authentication overlay.
        *   **Verification:** Email/OTP lookup against the `access` data source.
        *   **Session Management:** Uses `sessionStorage` to maintain access during the browser session.
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
        4.  **User Verification:** Present changes to the user for live testing and feedback.
        5.  **Data Audit (Mandatory Wrap-Up):** Before finalizing, use `scripts/diff_site_data.py` to compare local `site-data.json` with remote Google Sheets. 
            *   If differences are detected, present them to the user and offer a sync via `scripts/sync_engine.py --no-push`.
            *   Run `test.sh` to ensure site health.
        6.  **Pull Request & Merge:** Once verified, push the feature branch and merge into `main` via a Pull Request. Commit with a meaningful message.
*   **Data Integrity:** All fetch operations default to safe empty arrays `[]` upon dual-source failure to prevent application crashes.
