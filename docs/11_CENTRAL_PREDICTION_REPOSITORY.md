# Central Prediction Repository — superseded

The spreadsheet-backed implementation described in this document has been retired on this branch.

The active implementation stores prediction data in JSON files in the GitHub repository and keeps Google Apps Script only for Admin authentication and session management.

See [12_GITHUB_JSON_PREDICTION_REPOSITORY.md](12_GITHUB_JSON_PREDICTION_REPOSITORY.md) for the current architecture, environment variables, deployment steps, security boundaries, and test checklist.

Do not initialize or use the old Google Sheets repository. Existing built-in Engine calculation modules and their prediction datasets remain unchanged.
