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
    *   `configs/`: Local CSV backups for offline/failover resilience.
    *   `test.sh`: Automated health check script for endpoint verification.

## 4. Data & Configuration Layer

The website utilizes a streamlined, atomic data architecture optimized for performance and maintainability.

*   **Atomic Source:** All site data (config, services, reviews, team, version) is consolidated into a single `configs/site-data.json` file.
*   **Sync Workflow:** Data is updated from Google Sheets via the `./sync.sh` (or `sync_data.py`) script. This script stashes local work, pulls from main, fetches all GIDs from Google Sheets, regenerates the master JSON, and commits the update locally.
*   **Performance:** The site implements a **Stale-While-Revalidate** pattern. It loads instantly from `site_data_cache` in `localStorage` and performs a silent background refresh from the server to ensure future visits are up to date.
*   **Resilience:** The repository version of `site-data.json` serves as the ultimate fallback, ensuring the site remains functional even if the Google Sheets API is unreachable.

## 5. SEO & Social Optimization

*   **Meta Engine:** `Utils.applyConfig` dynamically updates `PAGE_DESCRIPTION`, `OG_IMAGE`, and `PAGE_TITLE` based on sheet values.
*   **Clean URLs:** Navigation is configured for extensionless URLs (e.g., `/services`, `/meet-the-team`) where host-compatible.

## 6. Component Features

*   **Hero Section:** Editorial tiled layout on desktop; auto-fading slideshow on mobile.
*   **Team Collective:** Alternating "Profile Cards" with grayscale-to-color hover effects.
*   **Service Menu:** Dynamic tab grouping with interactive cards and "Scroll-to-Focus" details.
*   **Site Loader:** A full-screen branded overlay that ensures a seamless, "no-flash" experience by waiting for all dynamic content to render.

## 7. Development & Safety

*   **Version Control:** Active development follows a `feature/branching` model (e.g., `feature/google-form-subscription`).
*   **Local Security:** `.env.asana` and sensitive tokens are strictly ignored by `.gitignore`. 
    *   **AI Protocol:** AI assistants must NEVER read or output the contents of `.env.asana`. To interact with the Asana API, use a subshell to source the token directly into the command (e.g., `(source .env.asana && curl -H "Authorization: Bearer $ASANA_PAT" ...)`). This ensures the token remains invisible to logs and outputs.
*   **Data Integrity:** All fetch operations default to safe empty arrays `[]` upon dual-source failure to prevent application crashes.
