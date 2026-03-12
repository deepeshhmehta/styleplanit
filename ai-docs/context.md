# StylePlanIt Context & Governance

This document provides the high-level project summary and critical safety mandates. For deep-dives into architecture, data, or workflows, consult the [**Encyclopedia Index**](index.md).

## 1. Project Overview

*   **Project:** A portfolio website for StylePlanIt, a premium personal styling consultancy in Toronto.
*   **Founders:** Ayushi Vyas and Deepesh Mehta.
*   **Mission:** To combine the immigrant experience with professional styling.
*   **Stack:** Vanilla HTML/CSS, jQuery, Python (Automation).
*   **Production Domain:** `https://styleplanit.com` (Managed via Cloudflare).

## 2. High-Level Design Standards

*   **Aesthetic:** "Modern Bold," "Luxury Minimalist," "High Impact."
*   **Typography:** 'Bebas Neue' (Headings), 'DM Sans' (Body).
*   **Routing:** Extensionless URLs enforced via Cloudflare/GitHub Pages.
*   **Logic:** Data-driven. Content is managed in Google Sheets and injected via `loader.js`.

## 3. Safety & Governance

*   **CRITICAL: UNLESS EXPLICITLY INSTRUCTED TO PUSH, NEVER PUSH CODE.**
*   **Source Control:** No direct commits to `main`. Every task occurs on a dedicated `feature/` branch. Merge via PR only.
*   **Verification:** Mandatory `test.sh` and `diff_site_data.py` runs before PR creation.
*   **Asana Integration:** Every non-trivial change must be tracked via `scripts/asana_tools.py`.

## 4. Current State (v4.6.4)
The site is production-ready. Recent focus has been on shifting from a "Service Menu" to an **Authority Platform** through the launch of the **Style Wiki** and **Value-Based Storytelling** pillars. For upcoming roadmap items, see the `Next Priorities` section in the deep-dive docs.

