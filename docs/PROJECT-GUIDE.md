# Project guide: state, next steps and how it works

Read this first if you are in the team. Section 0 says where the project stands and what is left. The rest explains how the prototype is built and how its parts connect: the big picture, each part in detail, a few real user actions followed from start to finish, and questions and answers you can use when someone asks you about it.

---

## 0. State of the project and what to do

### Where we are (November 2026)

**Built and working** (follows the Figma page "Redesign (final version)"):
- Home: search with live suggestions, crash course buttons for the three bins, popular categories, A–Z button.
- Search: ranked results, nicknames ("soda can" finds the pop can), "Did you mean…?" for typos, and the no-result screen with four ways out.
- Item page: the bin answer, preparation tip, "it depends" items (pizza box, cup), hazard warning first for drop-off items.
- Saving: auto-save when an item is opened, "Saved ✓" / "+ Save" pill, Saved panel with TODAY / RECENT, sorted ticks, "All sorted ✓", remove with Undo, auto-save switch, "How saving works".
- A–Z list with letter index and filter, category pages, crash course pages, ☰ menu, "Next item" screen.

**Demo only** (the screen opens but does nothing real): photo search (camera pop-up), "Report missing item" (nothing is sent).

**Not built** (open an "Under development" pop-up): Calendar, Locations / map, Building guide, Help, Language.

**Placeholders**: all item answers (taken from our Figma, not checked against the City's guide), all pictures (grey boxes with an X), the crash course text.

### Open decisions for the team

| Question | Proposal |
|---|---|
| Do we need a "recent searches" list? | No. Saved already keeps every item looked up (auto-save), so a second list would repeat it. The leftover code that still records searches can be removed. |
| Home button | Done in code, to confirm: the house was on the home screen, where it did nothing. It is now in the nav bar of every other screen. Update Figma if we keep it. |
| City of Calgary logo on a public site | Ask the TA if it is allowed on the demo link. |
| Auto-save on by default? Save animation on? | Both on now. Easy to switch in `js/config.js`. |
| Font from Google or from our own files | Now from Google Fonts. Copying the font into the project makes it work offline and sends nothing to Google. |
| Who builds which missing part | To split in the next meeting. |

### What to do next

The full list, written so it can be pasted into an AI coding assistant (or used as a checklist), is in [`NEXT-STEPS-PROMPT.md`](NEXT-STEPS-PROMPT.md). In short:
1. Replace the placeholder answers with real data from the City of Calgary "What Goes Where" guide.
2. Add real pictures (items, categories, bins).
3. Write the crash course text for each bin.
4. Build the missing screens from Figma (calendar, map, help, report flow, language, building guide, image search result).
5. Small clean-ups and checks (recent searches code, accessibility, tap sizes).
6. Put it online on GitHub Pages and test it on real phones.

---

## 1. The big picture in one minute

- **It is a website made of plain files.** HTML, CSS and JavaScript only. No framework (no React), no build step, no database, no server code.
- **Everything happens in the visitor's browser.** The browser downloads the files once, and from then on all the work (searching, showing screens, saving items) happens on the visitor's phone or computer.
- **The whole app is one page.** There is only one HTML file. When you "go to another screen", the JavaScript erases the middle of the page and draws the new screen in its place. The page never really reloads.
- **Saved items stay in the browser.** They are kept in the browser's own small storage (called *localStorage*), so they survive closing the tab, but they belong to that one browser on that one device.
- **The look comes from the team's Figma file**, page "Redesign (final version)". The icons were exported from Figma, not redrawn.

A good one-sentence explanation: *"It's a single-page web app: one HTML page, a list of items as data, and JavaScript that draws the right screen depending on the address, with saved items kept in the browser's local storage."*

---

## 2. The parts and how they connect

Think of the app as six parts, each with one job:

| Part | File | Its one job | Comparison |
|---|---|---|---|
| The shell | `index.html` | An empty page that loads everything else | The empty theatre stage |
| The data | `data/items.js` | The list of items, categories and bins | The script / the facts |
| The settings | `js/config.js` | Two on/off switches for the team | The light switches |
| The memory | `js/store.js` | Remembers saved items and settings | The notebook |
| The search | `js/search.js` | Finds items that match what you typed | The librarian |
| The screens | `js/ui.js` | Turns data into the HTML of a screen | The set designer |
| The conductor | `js/app.js` | Decides which screen to show and reacts to clicks | The director |
| The look | `css/style.css` | Colours, sizes, spacing (from Figma) | The costumes and paint |

**How they talk to each other:**

```
            you click or type
                   │
                   ▼
              app.js  (the conductor)
   ┌───────────┼─────────────┬──────────────┐
   ▼           ▼             ▼              ▼
search.js    store.js      ui.js         items.js
"what        "what is      "draw this    "the facts
 matches?"    saved?"       screen"       about items"
                   │
                   ▼
        the new screen appears on the page
        (style.css makes it look like Figma)
```

The important rule: **only `app.js` makes decisions.** The other files never call each other on their own. `ui.js` only draws, `store.js` only remembers, `search.js` only searches. `app.js` asks each of them for what it needs and puts the answers together.

This separation is why the code is easy to change: you can fix an answer in the data without touching the screens, or change a colour without touching the logic.

---

## 3. Each part in more detail

### 3.1 The shell (`index.html`)

It is almost empty. It contains:
- an empty box where every screen is drawn,
- an empty box for the small black message at the bottom ("the toast"),
- an empty box for pop-ups ("the modal"),
- the list of scripts, loaded **in a fixed order**: config, data, store, search, ui, app.

The order matters because each file uses the ones loaded before it. `app.js` is last because it needs all the others.

### 3.2 The data (`data/items.js`)

A list of 26 items. Each item has:
- a **name** ("Pizza box"),
- a **category** ("Paper and Cardboard"),
- a **bin**: blue, green, black or drop-off,
- **how**: a short preparation tip ("Flatten it first"),
- **aliases**: other words people type ("soda can" for the pop can),
- sometimes **options**, for "it depends" items (the pizza box can be greasy or clean, each with its own bin),
- sometimes a **warning**, for hazardous items (battery, paint, oil).

There are also 6 categories and the 4 bins with their labels ("BLUE BIN", "Recycling").

The answers are **placeholders** taken from the Figma screens. They are not checked against the City's real guide.

### 3.3 The settings (`js/config.js`)

Two switches the team can flip without touching the rest of the code:
- **Save animation on/off**: the little bookmark that flies to the Saved icon.
- **Auto-save on/off by default**: whether opening an item saves it automatically.

### 3.4 The memory (`js/store.js`)

It remembers three things:
1. **The saved list.** For each saved item: which item, when it was saved (a timestamp), whether it is ticked as "sorted", and, for "it depends" items, which option the person picked.
2. **The auto-save setting** (on or off).
3. **Recent search words** (still recorded, but no screen shows them: the proposal is to remove this, see section 0).

It offers simple actions: save, remove, restore (for Undo), tick as sorted, remove all sorted, remove everything, turn auto-save on/off.

Every time something changes, it writes everything to the browser's localStorage, under one name (`wgw.v1`), and tells anyone listening that something changed (that is how the number on the bookmark icon updates).

**If the browser blocks storage** (some private windows do), it keeps everything in memory instead, so the app still works until the tab is closed, and the Saved screen shows a warning.

### 3.5 The search (`js/search.js`)

Two jobs: **find matches** and **suggest a correction**.

**Finding matches.** First it cleans up the text: lowercase, no accents, no punctuation, single spaces. So "  Café-Cup! " becomes "cafe cup". Then it gives every item a score:

| What matched | Score |
|---|---|
| The name is exactly what you typed | 100 |
| The name starts with what you typed | 80 |
| A word in the name starts with it | 60 |
| The name contains it somewhere | 40 |
| Same, but in a nickname (alias) | 10 less than the name would get |
| Several words, each found somewhere | 20 |

Items with score 0 are dropped, the rest are sorted best first (and alphabetically when tied).

**Suggesting a correction ("Did you mean…?").** Only used when nothing matched. It collects every word that appears in item names and aliases, and for each word you typed that it doesn't recognise, it looks for the closest known word. "Closest" means the fewest letter changes (adding, removing, replacing a letter, or swapping two neighbours). Short words may be off by 1 letter, longer words by 2. "carboard" → "cardboard". It only suggests the correction if the corrected search actually finds something.

### 3.6 The screens (`js/ui.js`)

One function per screen: home, search results, item page, saved panel, A–Z list, category, bin ("crash course"), page not found, and the pop-ups (menu, camera, how saving works, report missing item, confirm, "under development").

Each function receives data and returns the HTML of that screen as text. It does not react to clicks itself. Instead, buttons are labelled with what they should do (for example "this button means *save item pizza-box*"), and `app.js` reads those labels when they are clicked.

It also has small reusable pieces that appear on many screens, exactly like Figma components: the nav bar ("← back", home, bookmark, menu), the search field (with camera and search buttons), the list row (picture, name, bin tag), the bin tag, the answer box, the Save pill.

Every text that comes from data or from the user goes through an "escape" step so that typing something like `<script>` in the search box shows as text and can't run as code.

### 3.7 The conductor (`js/app.js`)

It does four things:

1. **Routing: picks the screen from the address.** The part of the address after `#` says which screen to show:

   | Address | Screen |
   |---|---|
   | `#/` | Home |
   | `#/search?q=pizza` | Search results for "pizza" |
   | `#/search` (nothing typed) | "Next item" screen |
   | `#/item/pizza-box` | The answer for the pizza box |
   | `#/saved` | Saved panel |
   | `#/az` | A–Z list |
   | `#/category/paper` | Items in one category |
   | `#/bin/blue` | Crash course for one bin |

   When the address changes, the browser tells the app, and the app draws the new screen. Because the screen lives in the address, **the browser's Back button works**, and you can copy a link to a specific item.

2. **Reacting to clicks, typing and form sends.** Instead of attaching a reaction to every button, it listens once to the whole page and checks what was clicked. This works even for buttons that were drawn a second ago.

3. **Pop-ups and messages.** It opens and closes pop-ups, keeps keyboard focus inside an open pop-up, closes it with Escape, and shows the short toast messages (with an Undo button when something was removed).

4. **The save animation.** When an item gets saved, a small black circle with a bookmark flies from the "Saved ✓" pill to the bookmark icon at the top, and the icon pulses. If the setting is off, or the person's system says "reduce motion", it skips the flight and just shows a message.

### 3.8 The look (`css/style.css`)

All values come from the Figma frames: 390 px wide screens, 20 px side margins, 18 px between blocks, Inter font, the exact colours of the bin tags, the border thicknesses and corner roundings. Colours are defined once at the top as named tokens (`--blue`, `--green`, …), so changing a colour is a one-line change.

On a big screen the content stays a phone-width column in the middle, because the design is for phones.

### 3.9 Things around the app

- **`assets/`**: icons, bin cart drawings and the logo, exported from the Figma file.
- **`tests/`**: three automatic checks (`npm test`): the data is complete and consistent, the search finds what it should, and the memory saves and restores correctly.
- **`tools/serve.js`**: a tiny local web server, only for testing on your computer (`node tools/serve.js`, then open http://localhost:8080).
- **`docs/CITATIONS.md`**: AI use and outside material, as the course requires.

---

## 4. Following a user, step by step

These are the best stories to tell when explaining the app, because they show all the parts working together.

### Story A: searching "pizza" and opening the answer

1. On Home, you type "pi". As soon as there are 2 letters, `app.js` asks `search.js` for matches and shows up to 5 suggestions under the field (`ui.js` draws the list).
2. You press Enter. `app.js` changes the address to `#/search?q=pizza`.
3. The address changed, so `app.js` runs the routing again: it asks `search.js` for all matches, then asks `ui.js` to draw the results screen ("Results for "pizza"") with one list row per item.
4. You tap "Pizza box (it depends)". The address becomes `#/item/pizza-box`.
5. `app.js` finds the item in the data and asks `ui.js` to draw the item page. Because the pizza box has options, the page shows the question "Which one is yours?" and two option cards, each with its bin tag.

### Story B: auto-save on an item

1. You open "Bakery box" (a normal one-answer item).
2. Before drawing, `app.js` checks: is auto-save on, and is this item not saved yet? Yes → it tells `store.js` to save it.
3. `store.js` adds the item with the current time, writes to localStorage and announces the change. The number on the bookmark icon goes up.
4. `ui.js` draws the page with the black **"Saved ✓"** pill on the photo.
5. Right after drawing, the bookmark flies to the top icon.

For "it depends" items it waits: the item is saved only once you pick an option, because before that there is no answer to remember.

If auto-save is off, the pill says **"+ Save"** instead, and tapping it saves.

### Story C: the Saved panel and "All sorted"

1. You tap the bookmark. Address: `#/saved`.
2. `app.js` gets the saved list from `store.js` (newest first) and gives it to `ui.js`.
3. `ui.js` splits it in two groups: **TODAY** (saved since midnight) and **RECENT** (older).
4. You tick the box on a row. `app.js` tells `store.js` "this one is sorted", then redraws the panel. The box turns green with a tick.
5. When every item of today is ticked, the green **"All sorted ✓"** banner appears.
6. You tap ⊗ on a row. The item is removed and a message appears with **Undo**. Undo puts the exact same entry back (same time, same tick).

### Story D: a typo and a dead end

1. You search "carboard". `search.js` finds nothing, so `app.js` asks it for a suggestion: "cardboard".
2. The screen shows the blue **"Did you mean… cardboard?"** box and, under **CLOSE MATCHES**, the results for "cardboard".
3. If that is still not it, "Show 'We couldn't find it' options" leads to the no-result screen.
4. You search "bike tube" (deliberately missing from the data). No matches and no suggestion, so you get **"We couldn't find "bike tube""** with four ways out: A–Z list, take a photo (demo), report the missing item (form, nothing is really sent), call 311.

### Story E: the ☰ menu and the parts that are not built

Tapping ☰ opens the "More" pop-up (Calendar Schedule, Special Disposal Centres, Building waste guide, Need Help, Language). Each opens a short "Under development" pop-up that explains what it would do in the real service. These parts exist in the Figma file but are outside this vertical prototype.

---

## 5. Questions and answers

### About the overall design

**Q: Why no framework like React?**
A: The app is small, and plain files mean no installation, no build step, and the site can be opened by double-clicking `index.html`. Anyone in the team can read and change it.

**Q: What does "single-page app" mean here?**
A: There is only one HTML page. Changing screens means JavaScript replaces the content of the page, instead of the browser downloading a new page. That makes moving between screens instant.

**Q: How does the Back button work if there is only one page?**
A: Each screen has its own address (the part after `#`). Changing that part adds a step to the browser history without reloading, so Back goes to the previous address and the app draws that screen again. The "← back" link in the app does the same thing, and if you arrived directly from a link, it takes you Home instead.

**Q: Why is the code split into so many files?**
A: Each file has one job (data, memory, search, drawing, deciding). You can change one without breaking the others. For example, the team can fix an answer in `items.js` without reading any other code.

### About the data

**Q: Where do the answers come from? Are they correct?**
A: From the team's Figma screens. They are placeholders and have not been checked against the City of Calgary guide. The footer of every page says so.

**Q: How do I add an item?**
A: Add one entry to `data/items.js` (the top of that file explains every field), then run `npm test`. The test catches mistakes like a misspelled bin or category.

**Q: How does "soda can" find the pop can?**
A: The pop can has "soda can" in its list of aliases (nicknames). The search looks at names and aliases, and ranks a nickname match just below a name match.

### About saving

**Q: Where are saved items stored? On a server?**
A: No server. They are stored in the visitor's browser (localStorage). They stay after closing the tab, but they are only on that browser and device, and are gone if the browser data is cleared.

**Q: Is this private?**
A: Yes, nothing leaves the device. Nothing is sent anywhere, not even the "Report missing item" form (it only shows a thank-you message, since it is a prototype).

**Q: What is the difference between TODAY and RECENT?**
A: TODAY is what was saved since midnight. Everything older is RECENT. It uses the time stored when the item was saved.

**Q: Why are "it depends" items not saved right away?**
A: Because the answer depends on the option. The app waits until you pick "greasy" or "clean", then saves the item together with your choice, so the Saved panel can show the right bin tag.

**Q: What happens if I pick a different option for an item I already saved?**
A: The saved entry is updated with the new choice, and its "sorted" tick is cleared, because a different answer means you have to sort it again.

**Q: How does Undo work?**
A: When an item is removed, the memory hands back the removed entry. The message keeps it for 6 seconds. If you tap Undo, the exact same entry (same time, same tick, same choice) is put back.

### About search

**Q: How does it decide the order of results?**
A: Each item gets a score: exact name 100, name starts with your words 80, a word starts with them 60, contains them 40. Nicknames score 10 less. Best scores first, then alphabetical.

**Q: How does "Did you mean" work?**
A: It compares each unknown word you typed with all the words used in item names and nicknames, and picks the one that needs the fewest letter changes (at most 1 for short words, 2 for longer ones). It only suggests it if the corrected search finds something.

**Q: Why do "bike tube" and "car parts" find nothing?**
A: On purpose, to demonstrate the no-result screen. A test makes sure nobody adds them to the data by accident.

### About the screens and the design

**Q: How does the app match the Figma design?**
A: The screens were rebuilt from the Figma page "Redesign (final version)": same sizes, spacing, fonts, colours and components (nav bar, list row, bin tag, answer box, Save pill). The icons are the exact exports from the Figma Components page.

**Q: Why are there grey boxes with an X instead of photos?**
A: They are the image placeholders from the Figma design. Real photos would go there.

**Q: Which parts are not built?**
A: Calendar, Locations (map), Building guide, Help and Language. They open an "Under development" pop-up. Photo search is a demo: the camera pop-up opens, but it doesn't read the photo.

**Q: Is it accessible?**
A: It was built with this in mind: every icon button has a spoken name for screen readers, pop-ups keep the keyboard inside them and close with Escape, there is a "Skip to content" link, focus is clearly outlined, and the animation is skipped for people who ask their system to reduce motion.

### About how it works inside

**Q: How does the page change screen without reloading?**
A: The page has one empty box (`<div id="app">`). To show a screen, `app.js` gets the screen's HTML as text from `ui.js` and puts it into that box, replacing what was there. The browser then shows the new content immediately. Nothing is downloaded, because all the files were already loaded at the start.

**Q: When I tap an item, what makes it open? Is that Node?**
A: No, Node is not involved. Node only runs on your computer for two things: the small test server (`tools/serve.js`) and the tests. On the real site, everything runs in the visitor's browser. The item row is a normal link to `#/item/pizza-box`. Tapping it changes the address, the browser announces "the address changed" (the `hashchange` event), `app.js` hears it, finds the pizza box in the data, and asks `ui.js` to draw the item page.

**Q: What makes `app.js` the "conductor"?**
A: Three things. It is loaded last, so all the other parts already exist. It is the only file that listens to the browser (address changes, clicks, typing, form sends). And it is the only file that calls the others: it asks the data for the item, the memory whether it is saved, the search for matches, and the screens for the HTML. The other files never call each other.

**Q: Can the user change the settings in `config.js`?**
A: No. `config.js` is for the team, not for the user. It sets the starting point. The user has one switch, "AUTO-SAVE SEARCH" in the Saved panel, and their choice is remembered in their browser (it overrides `DEFAULT_AUTOSAVE`). The animation follows the "reduce motion" setting of their phone or computer. A user switch for the animation could be added if the team wants one.

**Q: Why does a button change colour when the mouse is over it?**
A: It is a CSS rule called `:hover`, in `style.css`. For example, outline buttons, menu rows and icon buttons get a light grey background (`--soft`), the black "NEXT ITEM" button gets darker, and the camera's capture button gets slightly transparent. The mouse pointer becomes a hand because of `cursor: pointer`. On phones there is no hover, so this only shows with a mouse.

**Q: Why is there a link to Google in `index.html`? Can't CSS do it?**
A: CSS can only say which font to use ("Inter"). The font file itself has to be downloaded from somewhere. Right now it comes from Google Fonts. The alternative is to copy the font files into the project and load them from there: it works offline and sends nothing to Google. If the font cannot load, the page falls back to the system font, so it still works.

### About running and testing

**Q: How do I run it?**
A: Double-click `index.html`, or, closer to how it behaves online, run `node tools/serve.js` and open http://localhost:8080.

**Q: What do the tests check?**
A: `npm test` runs three checks: the data is complete (every item has a valid bin, category and tip, "it depends" items have at least two options, hazardous items have a warning), the search finds the expected items and corrections, and the memory saves, ticks, removes and restores correctly.

**Q: How does it get online?**
A: Because it is only plain files, any free static host works. The README explains GitHub Pages step by step.

---

## 6. Cheat sheet

- **One HTML page**, screens drawn by JavaScript, chosen by the address after `#`.
- **Data** in `items.js`, **memory** in `store.js` (browser localStorage), **search** in `search.js`, **drawing** in `ui.js`, **decisions** in `app.js`, **look** in `style.css` (from Figma).
- Only `app.js` makes decisions; the others each do one job.
- Opening an item **auto-saves** it ("it depends" items: after choosing an option).
- Saved panel: **TODAY / RECENT**, tick when **sorted**, **All sorted ✓** when done, ⊗ to remove with **Undo**.
- Search: scores names and nicknames, **"Did you mean"** for typos, a helpful **no-result** screen as the last resort.
- No server, nothing is sent anywhere, answers are placeholders.
