# StylePlanIt AI Encyclopedia

Welcome. This directory serves as the comprehensive source of truth for the StylePlanIt project architecture, tooling, and workflows. It is designed specifically for AI Agents to achieve rapid context parity.

## 1. Directory Map

*   [**Technical Architecture**](architecture.md): Core logic, the recursive component loader, and initialization sequencing.
*   [**Data Schema**](data-schema.md): Structure of `site-data.json` and synchronization logic.
*   [**Tooling & Automation**](tooling.md): CLI tools for data auditing, task management, and local development.
*   [**Business Workflows**](workflows.md): Article publication and synchronization procedures.

## 2. Project Overview

*   **Project:** A portfolio website for StylePlanIt, a premium personal styling consultancy in Toronto.
*   **Founders:** Ayushi Vyas and Deepesh Mehta.
*   **Mission:** To combine the immigrant experience with professional styling.
*   **Stack:** Vanilla HTML/CSS, jQuery, Python (Automation).
*   **Production Domain:** `https://styleplanit.com` (Managed via Cloudflare).

## 3. High-Level Design Standards

*   **Aesthetic:** "Modern Bold," "Luxury Minimalist," "High Impact."
*   **Typography:** 'Bebas Neue' (Headings), 'DM Sans' (Body).
*   **Routing:** Extensionless URLs enforced via Cloudflare/GitHub Pages.
*   **Logic:** Data-driven. Content is managed in Google Sheets and injected via `loader.js`.

## 4. Safety & Governance

*   **CRITICAL: UNLESS EXPLICITLY INSTRUCTED TO PUSH, NEVER PUSH CODE.**
*   **Source Control:** No direct commits to `main`. Every task occurs on a dedicated `feature/` branch. Merge via PR only.
*   **Verification:** Mandatory `test.sh` and `diff_site_data.py` runs before PR creation.
*   **Asana Integration:** Every non-trivial change must be tracked via `scripts/asana_tools.py`.

## 5. Current State (v4.6.4)
The site is production-ready. Recent focus has been on shifting from a "Service Menu" to an **Authority Platform** through the launch of the **Style Wiki** and **Value-Based Storytelling** pillars.
