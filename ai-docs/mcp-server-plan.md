# Plan: StylePlanIt MCP Server

## 1. Objective
Design and implement a Model Context Protocol (MCP) server for StylePlanIt to formalize the data-sync workflow, automate Google Sheets write-backs, and provide structured AI tools for codebase management.

## 2. Architecture
*   **Host:** Local Docker instance (Node.js or Python).
*   **Protocol:** Model Context Protocol (MCP).
*   **Client:** Gemini CLI (as a lead agent).

## 3. Core Features
### Tool Layer
*   `sync_data`: Automated fetch from Google Sheets and consolidation into `site-data.json`.
*   `audit_assets`: Scan `assets/images` and update the manifest.
*   `write_back`: Formalize the "Local-to-Sheets" sync (replaces manual CSV copy-pasting).
*   `health_check`: Run `test.sh` and return structured JSON reports.

### Resource Layer
*   `site_schema`: Provides the latest JSON schema for `site-data.json`.
*   `project_context`: A dynamic view of `ai-docs/context.md`.
*   `sheets_manifest`: A list of GIDs and Sheets managed by the system.

## 4. Implementation Phases

### Phase 1: Environment & Scaffolding (Target: Late Sept)
*   Create Dockerfile and MCP server scaffold.
*   Define tool/resource schemas.
*   Setup authentication for Google Sheets API (moving beyond public CSVs).

### Phase 2: Logic Integration (Target: Early Oct)
*   Port `sync_engine.py` and `diff_site_data.py` logic into the MCP server.
*   Implement the Google Sheets write-back tool.
*   Verify asset manifest generation.

### Phase 3: Validation & Deployment (Target: Oct 31, 2026)
*   Integrate MCP server with Gemini CLI.
*   Full end-to-end sync testing.
*   Final documentation update.

## 5. Security
*   Secrets managed via environment variables (Docker Secrets).
*   Asana/Sheets tokens injected into the container at runtime.
