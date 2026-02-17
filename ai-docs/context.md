# StylePlanIt Portfolio Website Project Context

This document provides a summary of the StylePlanIt website project for context continuity.

## 1. Project Overview

*   **Project:** A portfolio website for StylePlanIt, a premium personal styling consultancy in Toronto.
*   **Founders:** Deepesh and Ayushi.
*   **Mission:** To combine the immigrant experience with professional styling. The consultancy targets two main audiences:
    1.  Ambitious newcomers needing help to land jobs.
    2.  High-Net-Worth Individuals (HNIs) looking to manage their image.
*   **Hosting:** GitHub Pages.

## 2. Aesthetic & Design System

*   **Overall Aesthetic:** "Luxury Minimalist," "Old Money," "Editorial." The design emphasizes clean lines, sharp edges, and generous whitespace.
*   **Fonts:**
    *   **Headings (Serif):** 'Cormorant Garamond'
    *   **Body (Sans-Serif):** 'Montserrat'
*   **Color Palette (Updated Feb 2026):**
    *   **Primary Accent (Eucalyptus Green):** `#0c4524` (Used for buttons, links, highlights)
    *   **Accent Hover (Darker Green):** `#547c65`
    *   **Background (Lightest Green):** `#e6f0e7`
    *   **Headings (Rich Black):** `#0F0F0F`
    *   **Body Text (Soft Black):** `#2A2A2A`
    *   **White:** `#ffffff`
*   **Styling:**
    *   **Buttons:** Generally have a 200px border-radius, giving them a pill shape. The subscribe button is an exception with a 0px border-radius.
    *   **Section Padding:** Sections have a vertical padding of 75px.
    *   **Services Page:** Features an elegant tab bar and interactive service cards that expand to show details with a smooth-scroll "focus" mechanism.

## 3. Tech Stack & File Structure

*   **Frameworks:** jQuery is used for DOM manipulation and event handling. The project is built with HTML5, CSS3, and JavaScript.
*   **File Structure:**
    *   `index.html`: The main homepage.
    *   `services.html`: A dedicated page for the detailed service menu.
    *   `styles/styles.css`: All styles for the project.
    *   `js/config.js`: Centralized constants, Spreadsheet IDs, and GIDs.
    *   `js/utils.js`: Shared utility object (`Utils`) for CSV parsing and meta-tag optimization, plus the `Data` provider logic.
    *   `js/app.js`: Main application logic (`App`) for UI components (Navigation, Hero Slideshow, Services, Reviews).
    *   `js/loader.js`: Coordinates the injection of HTML components and ensures the app initializes only after data is ready.
    *   `components/header.html` & `footer.html`: Reusable HTML components.
    *   `configs/`: Contains local CSV backups (`config.csv`, `services.csv`, `reviews.csv`).
    *   `ai-docs/context.md`: This file.

## 4. Data & Configuration Layer

The website utilizes a highly resilient data architecture to ensure performance and maintainability.

*   **Primary Source:** Google Sheets (Published to the Web as CSV). This allows for live updates to content, services, and reviews without code changes.
*   **Backup Source:** Local CSV files in the `configs/` directory serve as an automatic fallback if the Google Sheets API is unreachable or times out (5s threshold).
*   **Selective Caching:** 
    *   `config` and `reviews` are cached in `localStorage` for instantaneous page loads.
    *   `services` are always loaded in real-time to ensure clients see current offerings.
*   **Version Control:** A `VERSION` key in the configuration allows for manual cache flushing across all clients whenever significant content updates are deployed.

## 5. SEO & Meta Management

The site is optimized for production-grade SEO:
*   **Dynamic Meta Tags:** `PAGE_TITLE`, `PAGE_DESCRIPTION`, and `OG_IMAGE` are managed via the Google Sheet.
*   **Social Readiness:** Open Graph tags are automatically updated by `Utils.applyConfig` to ensure professional social media previews.
*   **Static Defaults:** Critical SEO tags have sensible defaults in the HTML to support crawlers that do not execute JavaScript.

## 6. Component Features

*   **Hero Section:** A three-image tiled layout on desktop for an editorial feel. On mobile, it automatically switches to a cross-fading slideshow for better use of vertical space.
*   **Service Menu:** Dynamically generated tabs and grids. Cards are interactive, expanding to show long descriptions and prices with a dynamic scroll-to-focus feature.
*   **Reviews:** Dynamically loaded from a dedicated sheet/CSV, supporting unlimited client testimonials in a scrollable grid.
*   **Navigation:** Uses a shared `header.html` component with a responsive mobile toggle implemented via event delegation to support dynamic injection.

