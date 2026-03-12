# StylePlanIt Data Schema

`configs/site-data.json` is the atomic source of truth for the entire website. This document defines its structure.

## 1. Schema Overview

### `version` (Array)
Contains a single object with the `VERSION` key.
*   **Usage:** Used for cache busting. Incrementing this value forces clients to flush `localStorage` and fetch fresh data.

### `config` (Array)
Key-Value pairs for global site settings and text.
*   **Naming Convention:** ALL_CAPS_SNAKE_CASE.
*   **Special Keys:**
    *   `LOGO_TEXT`: The main brand display name.
    *   `GOOGLE_ANALYTICS_ID`: GA4 measurement ID.
    *   `VALUE_*`: Controls the Home Page "Why Styling" section.
    *   `NAV_LINK_*`: Dynamic URLs and labels for the header.

### `articles` (Array)
Dynamic content for the Style Wiki (`/learn`).
*   **Fields:**
    *   `title`: Used as the H1 and for URL slug generation.
    *   `category`: Displayed as a subtitle (e.g., "Foundations").
    *   `read_time`: Manual string (e.g., "5 min").
    *   `content`: Raw HTML string. Use standard semantic tags.

### `categories` (Array)
Top-level service groupings (e.g., "Establish", "Elevate").
*   **Fields:**
    *   `name`: The display name and filter key.
    *   `description`: The card body text.
    *   `showOnHomePage`: "TRUE" or "FALSE" string.

### `services` (Array)
Individual service offerings.
*   **Fields:**
    *   `category`: Must match a name in the `categories` array.
    *   `title`, `short_description`, `long_description`: Content levels.
    *   `image_url`: Path to service visual.
    *   `footer`: Comma-separated list of inclusions.

### `assets_manifest` (Object)
Automatically generated mapping of image folders.
*   **Structure:** `{ "folder/path": ["image1.jpg", "image2.png"] }`.
*   **Generation:** Updated via `scripts/diff_site_data.py`.

## 2. Synchronization Logic
Data flow: **Google Sheets** → **CSV** → **site-data.json** → **Website UI**.

*   Use `scripts/diff_site_data.py` to bridge local changes to the Sheet.
*   Use `scripts/sync_engine.py` to bulk-override local data from the Sheet.
