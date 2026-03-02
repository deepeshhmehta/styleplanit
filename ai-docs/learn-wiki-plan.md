# Plan: StylePlanIt Learn Section (The Style Wiki)

## 1. Objective
Create a "Luxury Editorial Wiki" called **Learn**, where Ayushi can share styling basics and deep-dives. The focus is on a high-end reading experience and a friction-less writing workflow.

## 2. Architecture: "The Editorial Workflow"
To avoid the limitations of Google Sheets for long-form content, we will use a **Markdown-First** approach.

*   **Content Source:** `/content/learn/` (directory of `.md` files).
*   **Metadata:** Use YAML Frontmatter at the top of each Markdown file for titles, categories, and read times.
*   **Auto-Discovery:** Update `sync_engine.py` to scan the `/content/learn/` directory and inject a `learn_manifest` into `site-data.json`.
*   **Dynamic Reader:** A single `article.html` that fetches the `.md` file based on a URL parameter (`?id=filename`) and renders it via `marked.js`.

## 3. UI/UX Strategy
*   **Library View (`learn.html`):** A minimalist grid of editorial cards showcasing different styling categories.
*   **Reader View (`article.html`):** Clean, typography-focused layout using **Cormorant Garamond** for body text. Includes a "Book Now" CTA at the end of every article.
*   **Performance:** Lightweight rendering using a CDN-hosted Markdown parser.

## 4. Future Expansion: Markdown in Sheets
While long-form lives in files, we will implement a lightweight parser to support **Markdown-lite** (bolding, italics, links) for text stored in `site-data.json`. This will allow Ayushi to control styling for:
*   Hero box text.
*   Luxury dialog popups.
*   Service descriptions.

## 5. Implementation Phases
### Phase 1: Scaffolding
*   Create `/content/learn/` directory.
*   Add 2 starter articles (e.g., `the-3-color-rule.md`, `body-shape-basics.md`).
*   Implement `learn.html` landing page.

### Phase 2: The Reader Engine
*   Integrate `marked.js`.
*   Create `js/features/learn.js` to handle dynamic fetching and rendering.
*   Implement `article.html` template.

### Phase 3: Integration
*   Update `sync_engine.py` for manifest generation.
*   Add "Learn" to main navigation.

---
**Note:** This is a surprise feature. No Asana tracking. Work stays on `feature/learn-wiki` until ready for the big reveal.
