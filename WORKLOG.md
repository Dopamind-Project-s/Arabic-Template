# ZAHA RTL Theme - Work Log

## 2026-04-22

1. Reviewed repository structure and confirmed source template folder plus ZAHA brand assets.
2. Copied ZAHA logo assets into template image directory:
   - `Nozha-rtl-Dashboard-master/img/zaha-logo.png`
   - `Nozha-rtl-Dashboard-master/img/zaha-logo-alt.png`
3. Added Arabic/English translation dictionaries:
   - `Nozha-rtl-Dashboard-master/locales/ar/common.json`
   - `Nozha-rtl-Dashboard-master/locales/en/common.json`
4. Created dedicated ZAHA theme stylesheet with:
   - Brand color tokens.
   - Light/Dark theme variables.
   - RTL/LTR utility handling.
   - Calendar theme adjustments.
5. Created app controller script to handle:
   - i18n language switching (AR default, EN optional).
   - RTL/LTR direction switching.
   - Dark/Light mode persistence.
   - FullCalendar initialization.
   - Flatpickr datetime input.
   - Toastr and SweetAlert notifications.
6. Added new demo dashboard page:
   - `Nozha-rtl-Dashboard-master/zaha-dashboard.html`
   - Includes responsive layout, calendar, date-time, notifications, Bootstrap modal/tabs.
7. Kept Bootstrap as the primary UI framework and avoided replacing Bootstrap modal/tab systems.

## 2026-04-22 (update)

8. Renamed custom files to generic names as requested:
   - `zaha-dashboard.html` -> `index.html`
   - `css/zaha-theme.css` -> `css/Theme.css`
   - `js/zaha-app.js` -> `js/app.js`
9. Added `css/Style.css` and split structural styles from core theme tokens.
10. Updated HTML references and class names to generic naming (e.g., `topbar`, `btn-theme`, `mainTab`).
11. Updated localStorage keys in JS to generic keys (`app_locale`, `app_theme`).

## 2026-04-22 (stability fix)

12. Fixed runtime stability in `js/app.js` by adding locale fetch fallback logic to avoid breaking when JSON files are not reachable.
13. Localized notification messages through dictionary keys instead of hardcoded strings.
14. Removed remaining ZAHA-specific labels from UI text to keep naming generic.

## 2026-04-22 (major enhancement)

15. Upgraded template shell to Bootstrap 5.3 with dynamic RTL/LTR stylesheet switching through `#bootstrapCss`.
16. Expanded layout with KPI cards, responsive offcanvas menu, task table, and improved sections for dashboard usability.
17. Migrated Bootstrap interactions to v5 data attributes (`data-bs-*`) and removed jQuery dependency.
18. Added mobile controls for language and theme to keep behavior consistent across screen sizes.
19. Extended translation dictionaries (AR/EN) to cover full UI labels and notification payload text.
20. Added warning notification action and synchronized theme toggle labels between desktop/mobile controls.

## 2026-04-23 (progress + QA support)

21. Added localized dark/light toggle labels for AR/EN and synchronized theme button text updates.
22. Added system theme preference fallback (`prefers-color-scheme`) when no saved preference exists.
23. Added i18n validation script: `scripts/validate_i18n.py` to verify all `data-i18n` keys exist in both locale files.
24. Added `PROGRESS.md` with completion percentage and remaining milestones.

## 2026-04-23 (binary compatibility fix)

25. Removed newly introduced binary logo files from tracked changes:
    - `Nozha-rtl-Dashboard-master/img/logo.png`
    - `Nozha-rtl-Dashboard-master/img/logo-alt.png`
26. Switched template branding image source to existing text-based SVG asset:
    - `./svg/logo.svg`
27. This keeps PR diff binary-free for newly introduced assets and avoids upload blockers in platforms that reject binary diffs.
