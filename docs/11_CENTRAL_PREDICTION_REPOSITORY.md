# Central Prediction Repository

Branch: `test-matrix-of-destiny-rhd`

## Purpose

This module adds a central, Admin-managed data repository for Rabbitastro prediction content. It reuses the existing Vercel `/api/admin` route, the existing Google Apps Script deployment, and the existing Admin session. It does not change any calculation function or replace the current Engine datasets.

## Storage initialization

1. Update the existing Google Apps Script project with `google-apps-script/Code.gs` from this branch.
2. Deploy a new version of the existing Web App deployment. Keep its existing deployment URL so the Vercel `GAS_WEB_APP_URL` setting does not need to change.
3. Sign in to Rabbitastro Admin.
4. Open **คลังคำทำนายส่วนกลาง** and click **สร้างคลังคำทำนาย**.
5. The authenticated initialization action creates a Google Spreadsheet named `Rabbitastro Prediction Repository`, stores its ID in Script Properties as `PREDICTION_SPREADSHEET_ID`, and creates the required tabs.
6. The first initialization seeds Engine 1–4 metadata. It does not migrate or delete existing prediction datasets.

The spreadsheet is created only after an Admin explicitly clicks the initialization button. The Apps Script deployment runs with the deployment owner's authorization; review the Google authorization prompt before approving.

## Sheets and record shape

All collection sheets use a common envelope:

- `id`: stable record identifier
- `engineId`: `engine1` through `engine4`
- `parentId`: optional parent record identifier
- `name`, `title`, `description`, `content`
- `dataJson`: collection-specific structured data
- `priority`, `status`, `version`, `sortOrder`
- `createdAt`, `updatedAt`, `updatedBy`

Collections:

- `Engines`
- `Categories`
- `Topics`
- `Variables`
- `Predictions`
- `Rules`
- `Mappings`
- `Versions`
- `Audit_Logs`

Example prediction:

```json
{
  "engineId": "engine1",
  "name": "love-overview",
  "title": "คำทำนายด้านความรัก",
  "description": "ภาพรวมความสัมพันธ์",
  "content": "เนื้อหาคำทำนาย",
  "data": {
    "source": "horakratai",
    "tags": ["love", "overview"]
  },
  "priority": 100,
  "status": "draft",
  "sortOrder": 100
}
```

Example rule:

```json
{
  "engineId": "engine1",
  "name": "love-rule-example",
  "title": "กฎตัวอย่างด้านความรัก",
  "status": "draft",
  "data": {
    "logic": "AND",
    "predictionId": "PREDICTION_RECORD_ID",
    "conditions": [
      { "variable": "exampleVariable", "operator": "eq", "value": "exampleValue" }
    ]
  }
}
```

Supported rule operators: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `in`, `between`, `contains`, `exists`.

## Security and lifecycle

- Every repository action requires a valid existing Admin session token.
- The API gateway accepts only the explicit prediction action allowlist.
- Writes use Apps Script LockService to reduce concurrent update collisions.
- Saves create a version snapshot and an audit event.
- Archive is soft-delete; the row is retained with status `archived`.
- Publish validates Rule records before marking them published.
- Admin JSON is parsed as data; it is never evaluated as JavaScript.

## Current scope and limitations

This is the central repository and initial Admin CRUD foundation. It is not yet the live source for Engine output. The current Engine datasets remain in their existing JavaScript files until P2/P3 validation and later Engine-by-Engine integration are complete.

The initial Admin editor exposes structured records through JSON to support the full flexible data model. A more guided form editor can be added after the field contracts for each collection have been confirmed.

## Next steps

1. Deploy the updated existing Apps Script version and initialize the spreadsheet.
2. Verify initialize/list/save/archive/publish through Admin.
3. Add guided schema validation and Rule preview.
4. Create baseline fixtures for every existing Engine calculation and prediction output.
5. Integrate repository reads into Engine rendering incrementally, preserving calculation outputs and keeping a safe fallback to existing datasets.
