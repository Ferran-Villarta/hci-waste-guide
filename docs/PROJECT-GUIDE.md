# Project guide: state, next steps and how it works

Read this first if you are in the team. Section 0 says where the project stands and what is left. The rest explains how the prototype is built and how its parts connect: the big picture, each part in detail, a few real user actions followed from start to finish, and questions and answers you can use when someone asks you about it.

---

## 0. State of the project and what to do

### Where we are (November 2026)

**Built and working** (follows the Figma page "Redesign (final version)"):
- Home: search with live suggestions, crash course buttons for the three bins, popular categories, A–Z button.
- Search: ranked results, nicknames ("soda can" finds the pop can), "Did you mean…?" for typos, and the no-result screen with four ways out.
- Item page: the bin answer (in the bin's colour), preparation tip, "it depends" items (pizza box, cup, bakery box), hazard warning first for hazardous items, and a link to the City page the answer comes from.
- Saving: auto-save when an item is opened, "Saved ✓" / "+ Save" pill, Saved panel with TODAY / RECENT, sorted ticks, "All sorted ✓", remove with Undo, auto-save switch, "How saving works".
- A–Z list with letter index and filter, category pages with sub-categories (Food Packaging → Plastic → items), crash course pages (with text for each bin), ☰ menu, "Next item" screen.

**Built as demos** (every screen from Figma works and every button does something, but there is no real data or backend behind it):
- Photo search: the capture button always "finds" a pop can and opens the photo result page; "Browse device" shows the "We couldn't recognise this item" screen.
- Calendar: an example collection schedule for the current month.
- Map of drop-off sites: filters, pins, and an info card when you tap a pin. "Find a drop-off near me" on hazardous items opens it.
- Help form, "Report missing item" (with attached photo after a failed scan), "Report sent" with an example notification, and the "Call 311" confirmation. Nothing is sent anywhere.
- Language: picking a language says "coming soon" (the prototype is in English only).
- Building guide: address with suggestions, "your building" page, building-specific item pages, and "details unavailable" for unknown addresses.

**Real data and pictures**: 40 items with answers from the City of Calgary guide (shortened), crash course text from the City's pages, and a picture for every item, category and bin (Fluent Emoji 3D).

**Placeholders**: the sub-category groups (made up by us) and everything in `data/demo.js` (sites, addresses, schedule).

### Open decisions for the team

| Question | Proposal |
|---|---|
| Do we need a "recent searches" list? | No. Saved already keeps every item looked up (auto-save), so a second list would repeat it. The leftover code that still records searches can be removed. |
| Home button | Done in code, to confirm: the house was on the home screen, where it did nothing. It is now in the nav bar of every other screen. Update Figma if we keep it. |
| Auto-save on by default? Save animation on? | Both on now. Easy to switch in `js/config.js`. |
| Green bin tag | Done in code, to confirm: white text on the Figma green (#2e9e4f) was 3.4:1, below the WCAG 4.5:1 minimum for text. The tag now uses a darker green (#25803f, 5.0:1). Update the Figma colour if we keep it. |
| Sub-categories | Done in code, to confirm: every category has sub-categories, chosen by us (Figma only names "Plastic" and "Cardboard"). Rethink the groups when the real data comes in. |
| Coloured answers and pictures | Done in code, to confirm: the answer box takes the bin's colour, and pictures sit on a background in the bin's colour. Update Figma if we keep them. |
| Who does what next | Checking the answers, the walkthroughs, testing on phones. To split in the next meeting. |

### What to do next

A short summary (changes from Figma, what is done, what is left) is in [`PROJECT-STATE.md`](PROJECT-STATE.md). In short:
1. Check a few answers against calgary.ca, and make sure every item the walkthroughs use is in the data.
2. Replace the pictures that are only close matches, if we find better ones (list in `PROJECT-STATE.md`).
3. The decisions in the table above.
4. Accessibility checks with a screen reader on a real phone.
5. Test the live site (https://cpsc481-fall2026-t02-gr1.github.io/) on real phones.

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

### 3.2 The data (`data/items.js` and `data/demo.js`)

`data/demo.js` holds the made-up data for the demo screens: drop-off sites on the map, building addresses and the list of languages. The rest of this section is about `data/items.js`.

A list of 40 items. Each item has:
- a **name** ("Pizza box"),
- a **category** ("Paper and Cardboard") and, if that category has sub-categories, a **sub** ("Cardboard"),
- a **bin**: blue, green, black or drop-off,
- **how**: a short preparation tip ("Flatten it first"),
- **aliases**: other words people type ("soda can" for the pop can),
- sometimes **options**, for "it depends" items (the pizza box can be greasy or clean, each with its own bin),
- sometimes a **warning**, for hazardous items (battery, paint, oil),
- a **picture** (`img`, a file in `assets/img/`),
- a **source**: the City of Calgary page the answer comes from, linked at the bottom of the item page.

There are also 6 categories and the 4 bins with their labels ("BLUE BIN", "Recycling"). Every category has sub-categories:
- Food Packaging: Plastic, Metal, Glass, Cartons and cups
- Paper and Cardboard: Cardboard, Paper
- Food Scraps: Fruit and vegetables, Other food
- Household Items: Kitchen, Bathroom, Clothing and textiles
- Hazardous: Batteries, Paint and oil
- Electronics: Phones and computers, Small appliances

So when the real data is imported, each item only needs a category and a sub. The code still accepts a category without sub-categories (it then lists its items directly), in case the real guide has a small one.

The answers come from the City of Calgary "What Goes Where" guide (calgary.ca, checked November 2026), shortened to a sentence or two. Categories, sub-categories and bins have a picture too. `npm test` checks that every item has a calgary.ca source and that every picture file exists.

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

One function per screen: home, search results, item page, saved panel, A–Z list, category (grid of sub-categories), sub-category (list of items), bin ("crash course"), building guide, page not found, and the pop-ups (menu, camera, failed scan, how saving works, help, report missing item, report sent, call 311, language, calendar, map, building address, confirm, and a "coming soon" fallback for anything not built).

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
   | `#/category/paper` | One category: its sub-categories (or its items, if it has none) |
   | `#/category/paper/cardboard` | Items in one sub-category |
   | `#/bin/blue` | Crash course for one bin |
   | `#/scan/pop-can` | Result of a (demo) photo search |
   | `#/building/123-example-st-nw` | Building guide for one address (`…/food-scraps` for one item, `#/building/unknown` when there are no details) |

   The calendar, map, help, language, camera and report screens are pop-ups, not addresses: `app.js` opens them on top of the current screen.

   When the address changes, the browser tells the app, and the app draws the new screen. Because the screen lives in the address, **the browser's Back button works**, and you can copy a link to a specific item.

2. **Reacting to clicks, typing and form sends.** Instead of attaching a reaction to every button, it listens once to the whole page and checks what was clicked. This works even for buttons that were drawn a second ago.

3. **Pop-ups and messages.** It opens and closes pop-ups, keeps keyboard focus inside an open pop-up, closes it with Escape, and shows the short toast messages (with an Undo button when something was removed).

4. **The save animation.** When an item gets saved, a small black circle with a bookmark flies from the "Saved ✓" pill to the bookmark icon at the top, and the icon pulses. If the setting is off, or the person's system says "reduce motion", it skips the flight and just shows a message.

### 3.8 The look (`css/style.css`)

All values come from the Figma frames: 390 px wide screens, 20 px side margins, 18 px between blocks, Inter font, the colours of the bin tags (except the green, made darker for contrast), the border thicknesses and corner roundings. Colours are defined once at the top as named tokens (`--blue`, `--green`, …), so changing a colour is a one-line change.

On a big screen the content stays a phone-width column in the middle, because the design is for phones.

### 3.9 Things around the app

- **`assets/`**: icons, bin cart drawings and the logo, exported from the Figma file; the item pictures (`assets/img/`); and the Inter font files (`assets/fonts/`).
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

### Story E: the ☰ menu and the demo screens

Tapping ☰ opens the "More" pop-up (Calendar Schedule, Special Disposal Centres, Building waste guide, Need Help, Language); the same five are the icons on Home. Each opens its Figma screen, filled with made-up data from `data/demo.js`. For example, on the map you can switch the filters on and off, and tapping a pin shows that site's card. These screens show the design working; there is no real data behind them.

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
A: From the City of Calgary "What Goes Where" guide (calgary.ca), checked in November 2026 and shortened. Each item page links to the City page it comes from. We only include the walkthrough items and common ones, not the whole guide (agreed with the professor). The footer says it is a student prototype and to check the City guide for real decisions.

**Q: How do I add an item?**
A: Add one entry to `data/items.js` (the top of that file explains every field), then run `npm test`. The test catches mistakes like a misspelled bin or category.

**Q: How do sub-categories work?**
A: Figma frame "03" shows a category as a grid of sub-categories, and frame "04" shows a list of items. Right now every category has sub-categories, so every category opens "03". The code also supports a category without them (its items show directly), for a small category in the real data. When an item is added to a category with sub-categories it needs a `sub`, and `npm test` checks it and also that no sub-category is empty.

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

**Q: Where do the pictures come from?**
A: They are Fluent Emoji (3D style) by Microsoft, free under the MIT licence and cited in `docs/CITATIONS.md`. The City's guide has no item photos, and photos from different websites would all look different; one illustration set looks consistent and colourful. Each picture sits on a background tinted with the item's bin colour. A few are the closest match the set has (for example, the aerosol can is a spray bottle); `PROJECT-STATE.md` lists them. The grey box with an X only appears where there is no picture (the camera view and the attached scan photo).

**Q: Which parts are not built?**
A: Every Figma screen is built. But the calendar, map, building guide, photo search, help and report screens are demos: they use made-up data (`data/demo.js`), the photo is never really read (the capture button always finds a pop can), and nothing is ever sent anywhere.

**Q: Why is the green tag darker than in Figma?**
A: Accessibility. The WCAG guidelines (the international web accessibility standard, success criterion 1.4.3, level AA) ask for a contrast of at least 4.5:1 between normal-size text and its background. White text on the Figma green was 3.4:1; the darker green is 5.0:1. You can check any pair of colours at webaim.org/resources/contrastchecker.

**Q: Is it accessible?**
A: It was built with this in mind: every icon button has a spoken name for screen readers, pop-ups keep the keyboard inside them and close with Escape, there is a "Skip to content" link (invisible until you press Tab; it jumps past the nav bar, useful mainly on a computer), each new screen starts the keyboard at the top, focus is clearly outlined, and the animation is skipped for people who ask their system to reduce motion.

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

**Q: Where does the font come from?**
A: CSS can only say which font to use ("Inter"); the font file itself has to come from somewhere. We include it in the project (`assets/fonts/`, four weights, about 90 KB) instead of loading it from Google Fonts. That way it works offline (for example from the zip we hand in), looks the same everywhere, and sends nothing to Google. Inter's licence (SIL Open Font License) allows this; the licence text is in `assets/fonts/OFL.txt`.

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
- No server, nothing is sent anywhere. Answers come from the City of Calgary guide (shortened), with a source link on each item.
