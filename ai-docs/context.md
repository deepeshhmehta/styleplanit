# StylePlanIt Portfolio Website Project Context

This document provides a summary of the StylePlanIt website project for context continuity.

## 1. Project Overview

*   **Project:** A portfolio website for StylePlanIt, a premium personal styling consultancy in Toronto.
*   **Founders:** Ayushi Vyas and Deepesh Mehta.
*   **Mission:** To combine the immigrant experience with professional styling.
*   **Production Domain:** `https://styleplanit.com` (Managed via Cloudflare).
*   **Hosting:** GitHub Pages.

## 2. Technical Philosophy

*   **Aesthetic & Design System:**
    *   **Images:** Managed via a hybrid model. Static assets are discovered via `assets_manifest`. Page-specific content uses relative paths from Google Sheets.
    *   **Folder Structure:** Assets are organized by logical function (e.g., `assets/images/services-by-category/`, `assets/images/portfolio/`).
    *   **Standardized Assets:** Brand logos use the `.brand-logo-item` class (`180x80px` desktop / `120x50px` mobile, `object-fit: contain`).
    *   **Overall Aesthetic:** "Modern Bold," "Luxury Minimalist," "High Impact." Clean lines, sharp edges, and high-contrast typography.
    *   **Color Palette:**
        *   **Primary Accent:** `#0c4524`
        *   **Background (Cream):** `rgb(240 238 230 / 90%)` (Variable: `--cream`)
        *   **Text:** `#0F0F0F` (Headings), `#2A2A2A` (Body)
*   **Typography Standards:**
    *   **Headings (Primary):** 'Bebas Neue' (Sans-Serif, High Impact)
    *   **Body (Secondary):** 'DM Sans' (Sans-Serif, Modern Readability)
    *   **Special Characters:** Use literal symbols (e.g., `©`, `—`, `🩷`) in `site-data.json` instead of unicode escapes.
*   **Styling Standards:**
    *   **No Inline Styles:** All styling must reside in CSS files.
    *   **Placeholders:** HTML templates use `[PLACEHOLDER]` text for any element controlled by a `*-config-key`.
*   **URL & Routing Policy:**
    *   **Clean URLs:** The site uses extensionless URLs (e.g., `/services`, `/reviews`).
    *   **Home Path:** Use `/` instead of `index.html`.
    *   **Local Parity:** Use `scripts/dev_server.py` for local development.

## 3. Tech Stack & File Structure

*   **Frameworks:** jQuery.
*   **Core Logic:**
    *   **`js/loader.js`:** Recursive component loading and visual stability preloading.
    *   **`js/app.js`:** Global feature initialization.
*   **Plugin Features (`js/features/`):**
    *   `services.js`: Guided Experience journey with parallel data fetching.
    *   `portfolio.js`: Side-by-side "Before/After" transformation pairing.
    *   `reviews.js`: Randomized 3-review preview with horizontal scroll indicators.
    *   `icon-service.js`: Component-based gated collection management.
*   **Tooling:**
    *   **`scripts/dev_server.py`:** Multi-threaded local server with interactive port handling.
    *   **`scripts/diff_site_data.py`:** Interactive 3-way sync engine.
    *   **`scripts/sync_engine.py`:** Assets manifest generator and Sheets aggregator.

## 4. Data & Configuration Layer

*   **Atomic Source:** `configs/site-data.json` is the single source of truth.
*   **Data Audit Workflow:**
    1.  Run `scripts/diff_site_data.py` to compare local vs. remote.
    2.  Update Google Sheets using generated CSVs.
    3.  Bump the major version (e.g., `4.6.0`) in `site-data.json` to force-flush client-side caches.
*   **Caching:** Stale-While-Revalidate pattern with 24-hour TTL and active version enforcement.

## 5. Component Features & Design Patterns

*   **Guided Services Experience:** A multi-stage journey (Category Pillars → Filtered Grid → Detached Details Box).
*   **Brand Pillars:** Replaced imagery in deep-dives with branded, primary-accent blocks and SP watermark.
*   **Secondary Actions:** Unified minimalist link style (`.btn-secondary`).
*   **Expandable CTAs:** Global floating buttons (Book Now, WhatsApp) with "Collapse & Expand" pattern.
*   **Horizontal Affordance:** Space-saving horizontal scrollers for Logo Bands and Reviews with dynamic scroll indicators.
*   **Icon Service:** Premium, component-based gated section with full-page immersive background.

## 6. Development & Safety

*   **Asana Integration:** Mandatory task creation and status management. Project: "Style Plan-It Launch Plan" (`1212636326772928`).
*   **Token Extraction:** Use subshells to keep tokens out of logs.
*   **Source Control:** No direct commits to `main`. Every task occurs on a dedicated `feature/` branch. Merge via PR only.
*   **Verification:** Mandatory `test.sh` and `diff_site_data.py` runs before PR creation.

## 7. Current Project State (March 2026)

*   **Status:** Production-ready (Version 4.6.0).
*   **Recent Wins:**
    *   **Image Optimization:** Transitioned from `.png` to `.jpg`/`.jpeg` formats for service imagery to improve load performance.
    *   **Automation:** Enhanced `diff_site_data.py` to automatically scan `assets/images` and generate the `assets_manifest` in `site-data.json`.
    *   **Data Integrity:** Synchronized local `site-data.json` with Google Sheets source of truth for config and dialogs.
    *   **Typography Overhaul:** Transitioned to 'Bebas Neue' and 'DM Sans' for a more modern, bold aesthetic.
    *   **Experience Refactor:** Staged services journey with detached details box.
    *   **Component Refactor:** Icon Service refactored to use dynamic component loading.
*   **Next Priorities:**
    1.  **Architecture:** Decouple config into a dedicated `style-planit-config` repository (Asana: `1213485094305648`).
    2.  **Automation:** Implement script-based write-back to Google Sheets.
    3.  **Refactor:** Explore build-time static site generation (Vite/11ty).
