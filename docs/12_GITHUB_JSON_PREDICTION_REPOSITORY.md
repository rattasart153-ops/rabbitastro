# Rabbitastro GitHub JSON Prediction Repository

Branch: `test-matrix-of-destiny-rhd`

## Purpose and safety boundaries

The prediction repository is stored as JSON files in this GitHub repository. Vercel serverless API routes perform authenticated reads and writes. Google Apps Script remains only as the Admin authentication/session service.

This migration does not modify the existing calculation modules in `assets/js/`. The built-in prediction datasets remain the active baseline; GitHub-managed published predictions are additive through the existing central prediction renderer. Formula changes and genuinely new executable Engines/Features still require reviewed code changes and regression tests.

All work is limited to `test-matrix-of-destiny-rhd`. Do not merge to `main` or `Admin`, and do not promote a production deployment without separate approval.

## JSON collections

| File | Collection |
| --- | --- |
| `data/predictions/engines.json` | Engines and enabled/disabled state |
| `data/predictions/features.json` | Engine Features and enabled/disabled state |
| `data/predictions/categories.json` | Categories |
| `data/predictions/topics.json` | Topics |
| `data/predictions/variables.json` | Runtime variables |
| `data/predictions/predictions.json` | Prediction content |
| `data/predictions/rules.json` | Conditional rules |
| `data/predictions/mappings.json` | Rule-to-prediction mappings |

Each file has `schemaVersion`, `collection`, `updatedAt`, and `records`. Records keep the existing Admin shape: `id`, `engineId`, `parentId`, `name`, `title`, `description`, `content`, `data`, `priority`, `status`, `version`, `sortOrder`, timestamps, and actor. A bounded per-record history is retained in the same JSON file; Git commits also preserve the complete file history.

## Vercel Preview environment

Set these variables for the Preview environment and specifically for Git branch `test-matrix-of-destiny-rhd`:

- `GAS_WEB_APP_URL`: existing Apps Script Web App URL. Keep this for login, session validation, logout, and rotating the two Admin credentials.
- `GITHUB_TOKEN`: a fine-grained GitHub token stored as an encrypted Vercel environment variable. It must have Contents: Read and write for only `rattasart153-ops/rabbitastro`. Never put this token in browser code, HTML, or client storage.
- `GITHUB_REPOSITORY`: optional; defaults to `rattasart153-ops/rabbitastro`.
- `PREDICTION_BRANCH`: optional; defaults to `test-matrix-of-destiny-rhd`. Keep this pinned to the test branch for this work.

After adding or changing environment variables, redeploy the Preview deployment. Do not add these settings to Production.

## API behavior

- `POST /api/admin` proxies only authentication actions to Apps Script.
- Prediction list/save/archive/publish/history/rollback actions are handled by `api/_prediction-store.js` and GitHub Contents API.
- Each write includes the current file SHA. A stale SHA returns a conflict response rather than overwriting another administrator's newer change.
- Full Admin can mutate collections. Read-Only Admin can list records but cannot mutate them.
- `GET /api/predictions` validates the Admin session through Apps Script and returns only published content plus active Engines, Features, and Variables.
- The browser never receives the GitHub token.

## Apps Script

The branch's `google-apps-script/Code.gs` now contains authentication/session functions only. It does not use Google Sheets, SpreadsheetApp, or LockService. Copy this file into the existing Apps Script project and deploy a new Web App version while keeping the existing deployment URL. No spreadsheet initialization is required.

The existing Script Properties for the two Admin accounts remain in use. Do not rerun account initialization unless you intentionally want to reset both credentials.

## Data migration note

The previous documentation described a spreadsheet-backed central repository. That storage path has been retired. The spreadsheet was documented as being created only after an explicit initialization action; this branch's current migration starts with empty JSON collections for Categories, Topics, Variables, Predictions, Rules, and Mappings. The four Engine records and eight existing Feature records were seeded from the prior Apps Script initializer.

Engine 1 has now had a first-pass, non-destructive extraction into JSON draft records on branch `test-matrix-of-destiny-rhd` (2026-11-28). The copied content includes its category/topic metadata, core and detailed interpretations, ascendant layers, Rabbit/RHD content, Matrix Destiny Arcana meanings, the level scale, and age-cycle interpretation profiles. All imported records remain `draft`; none has been published or activated. Source JavaScript and calculation formulas remain unchanged. The first pass preserves exact source literals in the record `content` field; normalization, compatibility overlay, Admin write testing, and parity checks are still required. Engines 2–4 have not been migrated in this pass.

## Test checklist

1. Confirm Vercel Preview has `GAS_WEB_APP_URL` and `GITHUB_TOKEN` scoped only to `test-matrix-of-destiny-rhd`.
2. Update the Apps Script Web App deployment with this branch's auth-only `Code.gs`.
3. Sign in with Full Admin; verify Read-Only Admin can sign in but cannot write.
4. Open Engine/Feature management; toggle one item off and back on.
5. Create a draft Prediction, save it, publish it, and confirm it appears in the central prediction section for its matching slot.
6. Inspect history and rollback. Confirm each write creates a Git commit on the test branch.
7. Verify all four built-in Engines still calculate using the unchanged original JavaScript modules.
8. Confirm `main`, `Admin`, and Production remain unchanged.
