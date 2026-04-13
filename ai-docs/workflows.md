# StylePlanIt Business Workflows

This document details the procedures for managing site content and environments.

## 1. Environment Synchronization (CD)

The site uses a tiered deployment model:
1.  **Develop:** Features are merged here via PR.
2.  **Staging:** Merged from `develop`. Triggers a **GitHub Action** to push code to `styleplanit-staging` repo.
3.  **Main:** Merged from `staging` only after visual sign-off.

## 2. Service Bundle Updates (Pick A Journey)

To update the main packages (Establish, Reclaim, Elevate):
1.  Edit `categories` array in `configs/site-data.json`.
2.  **Price Formatting:** Use raw strings (e.g., "$330") as the code automatically handles prefix stripping.
3.  **Inclusions:** Use `|` to separate items (e.g., "Item 1|Item 2").
4.  **Sync:** Run `python3 scripts/diff_site_data.py` to push changes to the Google Sheet.

## 3. Article Publication (Style Wiki)

1.  **Conversion:** Paste draft text into Gemini CLI: *"Convert this to a Style Wiki article. Use semantic HTML."*
2.  **Local Integration:** Append entry to `site-data.json` and increment `VERSION`.
3.  **Sheets Sync:** Run `python3 scripts/diff_site_data.py`, select Local Winner, and paste CSV into the **articles** tab.

## 4. Image Asset Pipeline

1.  **Add:** Drop new images into subfolders (e.g., `assets/images/services-by-category/Reclaim/`).
2.  **Manifest Update:** Run `python3 scripts/diff_site_data.py`. The script scans and updates `assets_manifest` in `site-data.json`.
3.  **Config:** Update the `image_url` field in `site-data.json` to point to the new path.
