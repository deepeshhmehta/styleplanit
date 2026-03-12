# StylePlanIt Business Workflows

This document details the step-by-step procedures for managing site content and synchronization.

## 1. Article Publication (Doc-to-Wiki)

To add a new article to the Style Wiki (`/learn`):

1.  **Draft:** Create the article in Google Docs.
2.  **Conversion:** Paste the text into the Gemini CLI with the prompt: *"Follow Style Wiki guidelines to convert this text into a new article entry. Use semantic HTML and include a Style Tip box."*
3.  **Local Integration:**
    *   AI appends the new entry to `site-data.json`.
    *   AI increments the `VERSION` in `site-data.json`.
4.  **Sheets Sync (Crucial):**
    *   Run `python3 scripts/diff_site_data.py`.
    *   Select `1` (Winner: Local).
    *   Paste the generated CSV from `scripts/diff_outputs/articles_to_paste_in_sheets.csv` into the **articles** tab of the Google Sheet.

## 2. Dynamic Content Updates (Sheets-to-Site)

To update prices, reviews, or existing service descriptions:

1.  **Edit:** Modify the data in the relevant Google Sheet tab.
2.  **Deploy:**
    *   **Automated:** Run `scripts/sync-styleplanit.command`.
    *   **Manual:** Run `python3 scripts/sync_engine.py --no-push`.
3.  **Verify:** View the local site to confirm changes.
4.  **Version Bump:** If changes are not visible due to caching, manually increment the `VERSION` in `configs/site-data.json`.

## 3. Image Asset Pipeline

1.  **Add:** Drop new images into the correct subfolder in `assets/images/`.
2.  **Manifest Update:**
    *   Run `python3 scripts/diff_site_data.py`.
    *   The script automatically scans folders and updates the `assets_manifest` in `site-data.json`.
3.  **Commit:** Stage and commit the new images and the updated JSON.
