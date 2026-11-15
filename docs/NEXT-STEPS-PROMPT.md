# Next steps (prompt)

Everything left to do on the prototype, written as a prompt. Paste it into an AI coding assistant (for example Claude Code, opened in this repository), or use it as the team's checklist. Do the tasks one at a time and check each one in the browser before starting the next.

---

## Prompt

You are working on "What Goes Where", a student prototype for CPSC 481 (HCI) at the University of Calgary: a redesign of the City of Calgary waste sorting guide. Read `docs/PROJECT-GUIDE.md` before you start: it explains how the code is organised.

### Rules

- Plain HTML, CSS and JavaScript only. No framework, no build step, no `import`/`export` (the site must still work when `index.html` is opened from a folder). Load new scripts with a `<script>` tag in `index.html`, in the right order.
- Keep the separation: data in `data/items.js`, saved data in `js/store.js`, search in `js/search.js`, screens (functions that return HTML) in `js/ui.js`, decisions and event handling in `js/app.js`, styles in `css/style.css`.
- The design comes from the team's Figma file `dQzyJqWNUYPQZ1E7ucWEwh` ("What goes where redesign"), page "Redesign (final version)". Each task below names its Figma frame. Use the Figma MCP tools to read the frame, export any icon it uses into `assets/`, and match spacing, sizes, colours and text. Reuse the existing pieces in `ui.js` (nav bar, search field, list row, bin tag, answer box, outline button, pop-up `dialog()`) and the colour tokens at the top of `style.css`.
- Pass all text through `esc()` before putting it into HTML.
- Run `npm test` after each task. Add a test when you add data rules or logic.
- Do not commit or push. When a task needs a decision from the team (marked **Ask first**), stop and ask.
- Cite any new outside material (images, data, libraries) in `docs/CITATIONS.md`.

### 1. Real item data

The answers in `data/items.js` are placeholders copied from our Figma screens.

- **Ask first:** confirm the source with the team: the City of Calgary's official "What Goes Where" guide (on calgary.ca, not the University of Calgary website). Check its terms of use before copying content.
- Collect the real answer for every existing item, plus the most searched common items (aim for about 80–150 items). Prefer copying from a page or an export by hand over automated scraping. For each item, keep: name, category, bin (`blue`, `green`, `black`, `dropoff`), preparation tip (`how`), nicknames (`aliases`), options for "it depends" items, and a warning for hazardous items.
- Add a `source` field to each item with the URL it came from, and mention the source in `docs/CITATIONS.md`.
- Keep "bike tube" and "car parts" out of the data (the tests check this: they demonstrate the no-result screen).
- If the number of items grows a lot, move the list into its own file or split it by category, but keep the same fields.
- Update the categories and sub-categories (`subs` in `CATEGORIES`, `sub` on each item) if the real guide groups items differently. The home screen shows the categories as "Popular Categories".
- Done when: `npm test` passes, every item has a real answer and a source, and searching common words finds sensible results.

### 2. Pictures

Every picture is a grey placeholder box with an X (`placeholder()` in `ui.js`).

- **Ask first:** where pictures come from (team photos, free stock with a licence that allows it, or the City's images if allowed).
- Put them in `assets/items/`, `assets/categories/` and `assets/bins/`. Use small files (WebP or JPEG, about 600 px wide at most for the big item picture).
- Add an `image` field to items and categories. In `ui.js`, show the image when it exists and the placeholder when it does not. Give real pictures a short `alt` text (the item name is enough).
- Places that use pictures: item page (big picture), list rows (56 px), saved rows (52 px), category and sub-category tiles, category page banner, crash course banner.
- Done when: items with a picture show it everywhere, items without one still show the placeholder, and nothing is stretched.

### 3. Crash course text (done, to check)

Done: `BIN_INFO` in `data/items.js` has, for each bin, what goes in, what never goes in, and a tip, shown on the crash course page. It is placeholder text: check it against the City guide together with the item answers (task 1).

### 4. Missing screens (from Figma) (done)

Done: all the screens below are built (the demos use made-up data in `data/demo.js` and send nothing anywhere). The table stays as a map from each screen to its Figma frame.

| Screen | Figma frame (node id) | Notes |
|---|---|---|
| Calendar pop-up | "10 Calendar pop-up" (`116:613`) | Address field, "Find me!" link, month grid with collection days per bin. Use made-up days. |
| Map pop-up | "11 Map pop-up" (`116:726`) and "11b … Pin info card" (`116:2139`) | Filters, a static map picture with pins, tapping a pin shows the info card. The hazard warning's "Find a drop-off near me" should open this. |
| Help pop-up | "12 Help pop-up" (`116:780`) | Issue dropdown, field, details, Submit, "Call helpline". |
| Report missing item flow | "12b Report missing item (from failed scan)" (`116:2335`), "12c Report sent + notification" (`116:2363`), "12d call confirmation" (`158:915`) | Replace our simple report form with this flow: attached photo, reply time, confirmation, example notification, call confirmation. |
| Camera: scan failed | "09b Camera pop-up – Scan failed (next steps)" (`116:2410`) | After "Take a photo", show this instead of the "demo only" message. |
| Image search result | "06 Search - Image result page" (`116:563`) | What a successful photo search would show (for the demo, pretend the photo was a pop can). |
| Language pop-up | "13 Language pop-up" (`116:789`) | List of languages. Picking one shows "Coming soon" (the prototype stays in English). |
| Building guide | "18 … Where do you live?" (`162:889`), "18b … Your building" (`164:1009`), "18c/18d/18e" item pages (`164:1072`, `164:1114`, `164:1156`), "18f … details unavailable" (`162:936`) | New routes, e.g. `#/building` and `#/building/<item>`. Address autocomplete with a few fake addresses. |
| Category page with sub-categories | "03 Category page" (`116:529`) | Done: `#/category/<id>` shows the sub-category grid, `#/category/<id>/<sub>` the items (frame "04"). Every category has sub-categories now (a category without `subs` would skip the grid). The groups are ours; check them against the real data. |

For each screen: read the frame with the Figma tools, export its icons, add the HTML function to `ui.js`, wire it in `app.js` (a route for full screens, `openModal()` for pop-ups), connect the existing buttons (home tiles, ☰ menu rows) to it, and check it at 390 px wide.

### 5. Clean-ups

- **Recent searches:** the team proposal is to not have this feature (Saved already keeps every item looked up). **Ask first**, then remove `recent`, `addRecent`, `getRecent` and `clearRecent` from `js/store.js`, the call in `js/app.js`, the related lines in `tests/store.test.js`, and update `docs/PROJECT-GUIDE.md`.
- **Home button:** the house moved from the home screen to the nav bar of the other screens (not in Figma). If the team keeps it, update the Figma "Nav bar" component; if not, revert it in `navBar()` and `home()` in `ui.js`.
- **Font:** **Ask first.** If the team agrees, download Inter (400, 500, 600, 700) into `assets/fonts/`, load it with `@font-face` in `style.css`, and remove the Google Fonts links from `index.html`.
- **Tap targets (done):** the nav bar icons, "← back" and the search field buttons now have a 44 px tap area. Still small: the A–Z letters (26 px, from Figma) and the ⊗ remove button in Saved.
- **Contrast (done):** grey text on white passes (4.7:1). Grey text on the light grey boxes did not (4.2:1) and now uses the darker grey. White text on the green bin tag was 3.4:1 (Figma #2e9e4f); `--green` is now #25803f (5.0:1). Update the Figma colour to match.
- **Accessibility check:** test with a keyboard only (Tab, Enter, Escape) and with a screen reader (VoiceOver on iPhone or TalkBack on Android).
- **Logo:** **Ask the TA** whether the City of Calgary logo may be shown on the public demo. If not, replace it with a neutral title.

### 6. Online and final checks

- Put the site on GitHub Pages (steps in `README.md`) and open the link in a private window.
- Test on at least one real iPhone and one real Android phone: search, open items, save, sort, undo, A–Z, every pop-up.
- Fill in the names in `docs/CITATIONS.md` (who reviewed the AI-generated code and data).
- Write the markers' instructions for the D2L upload: every member's full name, the live link, and an exact walkthrough of what to tap and type (for example: search "pizza box", choose "Greasy", open Saved, tick it, search "bike tube").
- Hand in the zip as well, and keep a backup copy of the repository.
- Keep the link working until the end of finals week. Do not rename or delete the repository before grades are out.
