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


## Runtime integration (Admin preview branch)

The Admin preview now reads the published repository through `GET /api/predictions`. The endpoint proxies the existing Apps Script Web App using the `predictionRuntime` action and returns published records only; it does not expose drafts, version history, or audit logs.

### Runtime targeting

Create a Prediction, save it as a draft, and set its `data` object to include a target. Supported target fields are:

- `slot`: `engine1.base`, `engine1.asc`, `engine1.rhd`, `engine1.short`, `engine1.month`, `engine2.default`, `engine3.default`, or `engine4.default`.
- `category`: optional Engine 1 category key such as `work`, `money`, `health`, `love`, or `interest`.
- `topic`: optional active Engine 1 subtopic label.

Alternatively, publish a Rule with `data.slot` (and optional `feature`, `category`, `topic`) plus `predictionId` pointing to a published Prediction. The Admin runtime evaluates the Rule's `conditions` using the `AND` / `OR` logic and the operators `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `in`, `between`, `contains`, and `exists`. Published Mappings can target a published Prediction using the same scope and condition fields; the target must belong to the same Engine. Active Variables can define `data.key`, `data.source`, `data.dataType`, and optional `data.defaultValue`, allowing Rule conditions to use a stable variable name while reading from a context path.

For example, a Variable with `data.key = "birthMonth"` and `data.source = "birth.month"` can be referenced in a Rule condition as `birthMonth`. Prediction content can also insert safe plain-text values with placeholders such as `{{person.firstName}}` or `{{birth.month}}`; placeholders are rendered as text, not HTML. Available context paths include `engine`, `feature`, `category`, `topic`, `person.firstName`, `person.lastName`, `birth.day`, `birth.month`, `birth.year`, `birth.hour`, `birth.minute`, `birth.noBirthTime`, and `oreguram.questionId`. Engine calculations are not changed; central readings are rendered as an additional section after the existing Engine result.

### History and preview

The Admin editor includes version history and rollback. A rollback creates a new version rather than deleting intervening history. Rule preview accepts a JSON sample context and tests the selected Rule without publishing it. Publish still validates that a Rule points to an already-published Prediction in the same Engine.

### Deployment sequence

1. Copy the updated `google-apps-script/Code.gs` from this branch into the existing Apps Script project.
2. Update the existing Web App deployment to a new version, keeping the deployment URL unchanged.
3. Deploy this branch as a Vercel preview (do not promote to production).
4. Initialize the repository from the Admin page if it has not already been initialized.
5. Create and publish a test Prediction for one slot, then calculate the corresponding Engine to verify the central section appears.

This integration is currently scoped to the Admin preview branch. Existing built-in prediction text remains in place; central content is additive, so no original calculation formula or built-in interpretation table is replaced automatically.
