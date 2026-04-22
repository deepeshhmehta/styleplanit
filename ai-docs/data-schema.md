# StylePlanIt Data Schema

The platform uses a **Split-Atom** data model to separate UI metadata from structured content.

## 1. `configs/site-config.json` (Flat Metadata)

This file contains all flattened Key-Value pairs for UI strings, URLs, and environment settings.
*   **`VERSION`**: Core production baseline (e.g., "1.0.0").
*   **`LOADER_*`**: Text and progress settings for the loading sequence.
*   **`HERO_*`**: High-impact titles, mantra, and button text.
*   **`VALUE_*`**: Storytelling pillars for the "Why Styling" section.
*   **`NAV_*`**: Navigation text and destination anchors (e.g., `/#services`).
*   **`ICON_*`**: Metadata for the invitation-only collection.

## 2. `configs/site-data.json` (Structured Content)

This file houses high-volume data arrays managed via Google Sheets.

### `categories` (Array)
Defines the **Service Bundles** shown in "Pick A Journey."
*   `name`: Display title (Establish, Reclaim, Elevate).
*   `short_description`: Minimized state teaser.
*   `description`: Full expanded copy.
*   `price`: Formatted string (e.g., "$330").
*   `inclusions`: Pipe-separated string (`|`) for list generation.
*   `booking_link`: Direct Cal.com path.

### `services` (Array)
Individual **À La Carte** offerings.
*   `footer`: Comma-separated tags for icon generation.

### `team` (Array)
Profiles for "The Collective."
*   `imageUrl`: Precise path to the optimized team photo.

### `articles` (Array)
Style Wiki content.
*   `id`: Immutable routing key (e.g., `privacy-policy`).
*   `content`: Semantic HTML block.

### `assets_manifest` (Object)
Automatically generated index of all site images, grouped by page context.

## 3. Synchronization Logic
Data flow: **Google Sheets** → **CSV** → **Local JSON** → **Website UI**.

*   Use `scripts/diff_site_data.py` to reconcile both local JSON files with their respective Google Sheet tabs.
