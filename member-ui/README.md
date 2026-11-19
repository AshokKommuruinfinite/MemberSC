# MemberSC — React Member Portal UI

An attractive **frontend-only React** UI built to demonstrate MemberSC/SenzAI JSON configuration changes. No API server, database, or login is needed.

## Add to the existing MemberSC repository

1. Extract this ZIP. Copy the enclosed `member-ui` folder into the **root** of your existing `MemberSC` checkout, beside `MemberPortal`.
2. Open a terminal in `MemberSC/member-ui`.
3. Install dependencies: `npm install`.
4. Start: `npm run dev`.
5. Open the localhost URL printed by Vite (normally **http://localhost:5173**).

This project checks for `../MemberPortal/Data/content/**/*.json` (also accepts lowercase `data` or `../data/content`). It **reads the current repository JSON**; it never modifies those JSON files. If the folder isn't available, it uses `sample-content/` fixtures so you can see the design immediately. The header clearly identifies *Connected to MemberSC JSON* vs *Sample JSON mode*.

## Demo: before and after a SenzAI commit

1. Open the UI and **My Resources**. Select the state and plan to demo. Verify the document list is shown.
2. In a terminal inside `MemberSC/member-ui`, run **`npm run baseline`** to save the current original JSON state. Do this **before** the SenzAI change.
3. Create a Jira story targeting a JSON document entry, for example `MemberPortal/Data/content/MyResources/Documents/CA/MarketPlace/en.json` (use only a path that actually exists in your checkout).
4. Have SenzAI propose the update and approve its GitHub commit.
5. In your MemberSC checkout, check out and pull **the same branch SenzAI changed** (`git pull origin <branch>`).
6. The Vite dev server watches the JSON directory; it should refresh automatically. If not, run `npm run sync` and refresh the browser.
7. Show the **new/updated resource** in My Resources, toggle **Preview baseline** for a quick visual before/after, then open **Change Preview** to see a file-by-file JSON difference.

**Important:** Do **not** run `npm run baseline` after the commit/pull until you've finished your comparison, or you will overwrite your saved before-state. Run `npm run check` before and after the commit to identify invalid JSON and incorrect paths. A newly added standalone detail JSON will appear in Change Preview but does not automatically create a resource card unless its parent `itemLevelList` references it.

## UI features

- Responsive member dashboard and navigation
- My Coverage, Find Care, Health Records, Messages, Resources, Wellness sections
- JSON-backed resource cards and search; state, plan and English/Spanish controls
- Resource details with source file / JSON ID for traceability
- Before/after JSON comparison with added, updated and removed file counts
- Local-only sample data for independent preview; no member or health data requests
- Accessible buttons, mobile navigation and keyboard focus styling

## Commands

| Command | Purpose |
|---|---|
| `npm install` | Install React + Vite dependencies |
| `npm run dev` | Start local dev UI; sync current JSON before start |
| `npm run build` | Generate static production build in `dist/` |
| `npm run preview` | Preview built website |
| `npm run baseline` | Capture current JSON as *before* state |
| `npm run sync` | Re-read repository JSON into app manifest |
| `npm run check` | Check required files, parse JSON, confirm resource paths and source mode (no npm dependencies required) |
| `npm run test:config` | Run an isolated JSON-sync/baseline/update/remove regression test (no npm dependencies required) |

## Scope and limitations

The UI is a **demonstration shell**, not the original MemberSC member portal (which is not included in this deliverable). Section summaries and resource cards come from JSON; billing, claims, coverage verification, authentication and document downloads are **not** connected to a backend. A document is only clickable when its JSON includes a valid HTTP(S) URL. Existing MemberSC JSON is never modified by the UI.

The source GitHub repository was not directly retrievable in the generation environment. Thus this ZIP is **an additive `member-ui` implementation**, not a verified checkout or replacement of the live repository. The included sample JSON data is a working fixture drawn from a prior MemberSC-style demo package, **not a guarantee of current GitHub state**. Copy this folder into the repo to use its actual configuration data.

## Tech

React 18, Vite 5, CSS3, Node 18+ recommended. No backend dependencies.

## File completeness / QA

The archive includes Windows and macOS/Linux launcher scripts, the complete React/Vite source, sample data, manifest generation and baseline scripts, and offline checks. Run `npm run check` and `npm run test:config` directly with Node.js even before installing npm packages. `npm run build` requires installing React and Vite via `npm install` and is the final compilation check to run on your computer.

**Integration cannot be guaranteed until the actual MemberSC checkout is available:** the original GitHub repository was not retrievable when this package was authored and audited. The package handles the documented `MemberPortal/Data/content` directory, but it cannot validate every real JSON schema or state/plan path without those files.
