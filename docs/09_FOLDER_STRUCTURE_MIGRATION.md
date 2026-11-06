# Folder Structure Migration

## Scope

Reorganize the single-page source into folders and files by responsibility. The original HTML document was the source of truth on branch `index`.

## Changes

- Moved the original inline CSS into `assets/css/styles.css`.
- Split the six original inline JavaScript blocks into six files under `assets/js/`, preserving their original order.
- Replaced inline blocks in the HTML with relative stylesheet/script references.
- Renamed the root entry file from `index (1).html` to `index.html`.
- Added a root README describing the layout and script-order dependency.

## Compatibility decisions

- Classic script tags remain classic scripts; no `type="module"` or `defer` was added.
- Script order and positions in the document are preserved.
- No calculation logic, prediction text, styles, form fields, Local Storage keys, or UI flow were intentionally changed.
- The original two external LINE links remain unchanged.

## Verification

- Source inspection confirmed one inline style block and six inline script blocks before extraction.
- All six JavaScript blocks passed V8 syntax compilation before extraction.
- CSS contained no `@import` or `url(...)` references.
- No external script or stylesheet dependencies were present.
- Browser/runtime regression testing is not represented as passed by this migration record and remains to be performed.
