# Central Prediction Import — Engine 1–4 Draft Import Report

- Repository: `rattasart153-ops/rabbitastro`
- Branch: `test-matrix-of-destiny-rhd` only
- Import batch: `engine-1-4-central-draft-2026-11-27`
- Status: imported as Draft; nothing has been published
- Legacy source files inspected:
  - `assets/js/02-horakratai-engine.js`
  - `assets/js/04-ui-renderers.js`

## Imported record totals

| Collection | Records |
|---|---:|
| Predictions | 712 |
| Categories | 11 |
| Topics | 16 |
| **Total** | **739** |

| Engine | Predictions | Categories | Topics | Total |
|---|---:|---:|---:|---:|
| Engine 1 | 223 | 11 | 10 | 244 |
| Engine 2 | 18 | 0 | 0 | 18 |
| Engine 3 | 340 | 0 | 6 | 346 |
| Engine 4 | 131 | 0 | 0 | 131 |
| **Total** | **712** | **11** | **16** | **739** |

## Import coverage

The import includes the authored data objects from both source files, including the full question bank and its admin replacements, the Engine 1 deep-reading datasets, Engine 2 deity and ritual content, Engine 3 Oreguram question/answer datasets, and Engine 4 Tarot, Rune, and Crystal datasets.

Two generated datasets were also materialized from the original source logic:
- `OREGU_EXTRA_DEEP`: 93 records for question IDs 33–125, using the original per-question topic substitution.
- `RHD_MATRIX`: all 81 Rabbit × Habit combinations, generated using the original `rhdSynthesis` behavior and the imported `RABBITS` and `RHD_HABITS` source records.

Every imported record carries `legacySourceFile`, `legacySourceObject`, and `legacySourcePath` metadata. The payload preserves the source object's structured fields; the `content` field contains its text values for convenient review/editing.

## Validation performed

- All six collection files parse as valid JSON.
- 739 records found across Predictions, Categories, and Topics.
- All 739 records have status `draft`.
- All record IDs are unique.
- All imported records contain source traceability metadata.
- Thai text is present in the imported payloads.
- Largest individual record: 18,147 bytes, below the Admin API's 45 KB record limit.
- Engine totals match the imported records: Engine 1 = 244, Engine 2 = 18, Engine 3 = 346, Engine 4 = 131.

## Intentionally not imported as editable prediction text

- `ENG_PYTHAGOREAN`, `THAI_CHAR`, and `THAI_MONTH_NAMES`: calculation lookup tables, not authored prediction content.
- `RHD_CALCULATOR` and `PERSON_FEATURES`: executable functions/function references.
- Date/time calculations, scoring, reduction, selection, and other executable algorithms: remain in the original JavaScript and have not been rewritten.
- `OREGURAM_ADMIN_QUESTIONS` is derived from the imported `OREGURAM_QUESTIONS` plus `OREGURAM_ADMIN_REPLACEMENTS`; both source datasets are imported, avoiding duplicate derived copies.
- `OREGU_EXTRA_DEEP` was empty at declaration time and populated by a loop; its 93 generated entries are imported individually.

The `Variables`, `Rules`, and `Mappings` collections remain empty. The current legacy source expresses those calculations and selection conditions in executable JavaScript rather than as independent, declarative records. They must be modeled and parity-tested separately; no conditions or mappings were invented during this content import.

## Runtime and safety

The imported content is Draft-only. The existing runtime filters Predictions, Rules, and Mappings to published records, so this import does not change the live prediction output. No formulas were modified, no legacy source data was deleted, and no changes were made to `main`, `Admin`, or production.

This completes the content-copy/import portion only. It does not yet establish calculation parity or approve publication. Review and comparison against the legacy Engine outputs are still required before any record is published.
