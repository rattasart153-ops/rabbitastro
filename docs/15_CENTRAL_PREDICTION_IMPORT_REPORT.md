# Central Prediction Import — Engine 1–4 Draft Import Report

- Repository: `rattasart153-ops/rabbitastro`
- Branch: `test-matrix-of-destiny-rhd` only
- Import batches: `engine-1-4-central-draft-2026-11-27`, `engine-1-4-central-draft-2026-11-28`
- Status: imported as Draft; nothing has been published
- Legacy source files inspected:
  - `assets/js/02-horakratai-engine.js`
  - `assets/js/04-ui-renderers.js`

## Current imported record totals

| Collection | Records |
|---|---:|
| Predictions | 785 |
| Categories | 13 |
| Topics | 17 |
| **Total** | **815** |

| Engine | Predictions | Categories | Topics | Total |
|---|---:|---:|---:|---:|
| Engine 1 | 243 | 12 | 11 | 266 |
| Engine 2 | 18 | 0 | 0 | 18 |
| Engine 3 | 343 | 1 | 6 | 350 |
| Engine 4 | 181 | 0 | 0 | 181 |
| **Total** | **785** | **13** | **17** | **815** |

The totals above are the current repository record counts, including records that were already present before the 2026-11-28 follow-up import. They supersede the earlier 712 / 739-record totals in the first report revision.

## Imported source content

The collections contain the authored data objects from the Engine source, including name and element predictions, category/topic predictions, base and ascendant deep readings, Rabbit and RHD interpretations, Engine 2 deity/ritual content, Oraculum question/answer datasets and deep readings, and Engine 4 Tarot, Rune, and Crystal content.

The follow-up import added:
- `SHORT_CATEGORIES`: category codes, main numbers, and subtopic mappings.
- `HOT_TOPICS`: recommended topic and associated code for each category.
- `OREGURAM_UI_GROUPS`: the category group labels used by the Oraculum renderer.
- Eight renderer text groups, containing 184 distinct Thai text literals from `featureDeepTexts`, `rabbitSubconsciousVoice`, `rabbitJointText`, `warmOreguramText`, `oreguramSelfReflection`, `getMatrixNarrative`, `renderMatrixAgeDecades`, and `blendRhdSentence`.

Renderer text groups preserve the authored literal strings and their source-function names. They are not represented as fully evaluated function outputs: dynamic values, conditional branches, and Matrix arcana lookups continue to be composed by the original JavaScript at runtime. These records are for review/editing and traceability, not a replacement for executable renderer logic.

## Generated data parity checks

Two source-generated datasets were checked against the original source logic:

- `OREGU_EXTRA_DEEP`: 93 records for question IDs 33–125. The original loop filters `OREGURAM_QUESTIONS` where `q.id >= 33` and substitutes only `q.topic` into the authored focus template. All 93 imported records were compared against the corresponding imported question topic and the exact fixed template fields; **93/93 matched**.
- `RHD_MATRIX`: all 81 Rabbit × Habit combinations. The original `rhdSynthesis(r,h)` function was reviewed and its complete returned payload was recomputed from the imported `RABBITS` and `RHD_HABITS` source records. **81/81 payloads matched** the imported matrix records.

These checks establish parity for these two materialized datasets. They do not constitute a full end-to-end parity test of every Engine output or every runtime branch.

## Validation performed

- All collection files are valid JSON.
- 815 records found across Predictions, Categories, and Topics.
- All 815 records have status `draft`.
- All 815 record IDs are unique.
- All records contain source-file, source-object, and source-path provenance.
- 59 distinct source-object / renderer-function groups are represented.
- Thai text is present throughout the imported authored content.
- Largest individual record: 18,147 bytes, below the Admin API's 45 KB record limit.
- Engine totals: Engine 1 = 266, Engine 2 = 18, Engine 3 = 350, Engine 4 = 181.
- `OREGU_EXTRA_DEEP`: 93/93 template parity checks passed.
- `RHD_MATRIX`: 81/81 source-function parity checks passed.

## Intentionally retained in JavaScript

The following remain executable calculation or lookup logic and were not converted into editable prediction copy:
- `RHD_CALCULATOR`, `PERSON_FEATURES`, and the date/time, scoring, reduction, selection, and calculation functions.
- `ENG_PYTHAGOREAN`, `THAI_CHAR`, and `THAI_MONTH_NAMES`, which support numerical/date calculations.
- `NINE_STEP_MODE` and intermediate calculation values such as R1–R4.
- `OREGURAM_ADMIN_QUESTIONS`, which is derived from the already imported `OREGURAM_QUESTIONS` plus `OREGURAM_ADMIN_REPLACEMENTS`; a duplicate derived copy was not created.

The `Variables`, `Rules`, and `Mappings` collections remain empty as independent editable rule records. The source currently expresses calculation and conditional selection logic as executable JavaScript. No conditions or calculation formulas were invented or rewritten as part of this content import.

## Runtime and safety

- All imported records remain Draft-only.
- The existing runtime filters Predictions, Rules, and Mappings to published records, so these imports do not change runtime prediction output.
- No formulas or legacy source files were modified.
- No changes were made to `main`, `Admin`, or production.
- This is a content centralization and source-parity check, not approval to publish or switch the runtime to the JSON repository.
