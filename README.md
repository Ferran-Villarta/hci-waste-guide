# What Goes Where (prototype)

Vertical prototype for **CPSC 481 (Design Portfolio II)**, group "The Sopranos", project 4: Waste Management Guide
(a redesign of the City of Calgary "What Goes Where" guide). It is a student prototype, not an official City service.

It is a **static website**: plain HTML, CSS and JavaScript. No server, no database, no build step, no paid services.
Saved items are kept in the visitor's own browser (localStorage).

## Run it on your computer

Double-click `index.html`. If the page stays blank, use the local server below instead
(it is closer to how the site behaves online, and it is the way this was tested):

```bash
node tools/serve.js
```

Then open http://localhost:8080 . To run the checks:

```bash
npm test
```

## What works now

| Part | State |
|---|---|
| Search with live suggestions, ranking, nicknames ("soda can" finds the pop can) | works |
| "Did you mean...?" for typing mistakes ("cardbord" finds cardboard) | works |
| Item answer page: cart colour + label + icon, preparation advice | works |
| "It depends" items (cup, pizza box): choose the type, then see the answer | works |
| Hazard warning for drop-off items (battery, paint, oil) | works |
| Automatic saving of opened items, "Saved" chip, count in the top bar, Remove + Undo | works |
| Saved page: tick items as sorted, "All sorted" message, remove sorted, remove all (asks first) | works |
| Setting: save automatically on/off | works |
| Animation of the bookmark to the Saved button (can be switched off, honours "reduce motion") | works |
| No-result screen: A-Z list, photo (demo), "tell us what is missing" form, call 311 | works (photo is a demo) |
| A-Z list, categories, "all items for this cart" | works |
| Calendar, Locations, Building guide, Help, Language | stubs ("Under development") |

Two searches are meant to find nothing, to show the no-result screen: **bike tube** and **car parts**.
A test makes sure nobody adds them to the data by accident.

## Files

```
index.html        page shell; loads the scripts in order
css/style.css     all styles; colours are variables at the top
data/items.js     the items, categories and cart names  (EDIT THIS to add or fix answers)
js/config.js      two switches: SAVE_ANIMATION and DEFAULT_AUTOSAVE
js/store.js       saved items + settings (localStorage, with a memory fallback)
js/search.js      search ranking and "did you mean"
js/ui.js          the screens (functions that return HTML)
js/app.js         address routing (#/...), clicks, forms, dialogs, animation
tests/            node tests for data, search, store
tools/serve.js    tiny local server
docs/CITATIONS.md AI use and libraries (course rule: cite everything)
```

Routes (the part after `#`): `/` home, `/search?q=...`, `/item/<id>`, `/saved`, `/az`, `/categories`, `/category/<id>`, `/bin/<blue|green|black|dropoff>`.

## How to change things

- **Add or fix an item:** edit `data/items.js` (the top of the file explains each field), then run `npm test`.
- **Change a colour:** edit the variables at the top of `css/style.css`.
- **Turn the saved animation off, or auto-save off by default:** `js/config.js`.
- Keep scripts as plain `<script>` files (no `import`), or opening `index.html` from a folder stops working.

## Put it online (GitHub Pages, free)

The course needs a live link that stays up until the end of finals week.

1. One team member creates a GitHub repository (for example `hci-waste-guide`). On the free plan it must be **public** for Pages.
2. Push this folder to it (`git remote add origin <url>` then `git push -u origin main`).
3. On GitHub: **Settings > Pages > Build and deployment > Deploy from a branch > `main` / root > Save**.
4. After a minute the site is at `https://<user>.github.io/<repo>/`. Open it in a private window to check it.
5. Hand in the zip as well, and keep a backup copy of the repo. Do not delete or rename the repo before grades are out.

Alternatives with the same effect: Netlify Drop, Cloudflare Pages, Vercel (all free for a static site).

## Team notes

- Work in small commits. Pull before you start and push when you stop.
- Decisions still open from the team meeting: colours, and whether to keep the saved animation.
- Before the demo: check every answer in `data/items.js` against the City guide, and write the markers' instructions
  (every member's full name + an exact walkthrough of what to type) for the D2L upload.
- Cite all AI use and libraries in `docs/CITATIONS.md`.
