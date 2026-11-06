# Rabbitastro

Static web application. Open `index.html` as the entry point.

## Source layout

- `index.html` — page markup and script loading order
- `assets/css/styles.css` — original inline stylesheet
- `assets/js/01-daily-r9.js` — standalone daily-number feature
- `assets/js/02-horakratai-engine.js` — Horakratai calculation engine
- `assets/js/03-daily-element.js` — immediate daily-element renderer
- `assets/js/04-ui-renderers.js` — UI, form handling and result renderers
- `assets/js/05-form-storage.js` — browser Local Storage persistence
- `assets/js/06-subconscious-presentation.js` — prediction presentation layer

## Loading order

The JavaScript files are loaded in their original document order using classic script tags (not modules and without `defer`). Keep this order unchanged because later files use globals defined by earlier files.

This reorganization separates files by responsibility only. It does not intentionally change calculation formulas, prediction content, UI behavior, or browser storage keys.
