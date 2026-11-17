# What Goes Where: instructions for the markers

CPSC 481 Foundations of HCI, Fall 2026 · Design Portfolio II · Group T02-1 "The Sopranos"

| Full name | UCID |
|---|---|
| Ferran Villarta | *(UCID)* |
| *(full name)* | *(UCID)* |
| *(full name)* | *(UCID)* |
| *(full name)* | *(UCID)* |
| *(full name)* | *(UCID)* |
| *(full name)* | *(UCID)* |

**Live demo:** https://cpsc481-fall2026-t02-gr1.github.io/
**Code:** the zip in this D2L submission (also at https://github.com/cpsc481-fall2026-t02-gr1/cpsc481-fall2026-t02-gr1.github.io)

---

## 1. Before you start

- The app is designed for a **phone**. Open the link on a phone, or on a computer in Chrome with the phone view: press F12, then Ctrl+Shift+M (Cmd+Shift+M on a Mac), and pick an iPhone or Android phone at the top.
- Nothing needs installing, and there is no login.
- What you save is kept in your browser. To start again from zero: open **Saved** (bookmark icon, top right) and tap **Remove everything**.
- Item answers come from the City of Calgary "What Goes Where" guide (shortened). The map sites, addresses, collection schedule and photo recognition are **demo data**: they work, but the content is made up.

## 2. What is implemented

| Feature | How complete |
|---|---|
| Search (suggestions while typing, nicknames, "Did you mean…?", no-result screen) | Full |
| Item answers (bin in colour, how to prepare it, "It depends" choices, hazard warning, bottle depot, City source link) | Full, 40 items |
| Saved list (auto-save, sorted ticks, "All sorted", remove with Undo, auto-save switch) | Full |
| Browse (categories → sub-categories → items, A–Z with letters and filter, crash course for each bin) | Full |
| Help (searchable tips, contact form, call 311) | Full (the form sends nothing) |
| Photo search, Calendar, Locations map, Building guide, Report missing item | Demo with made-up data |
| Language | Shows that the guide is in English for now |

## 3. Walkthrough

Follow the steps in order. **Bold** is what to tap; "quotes" is what to type.

### A. Find where an item goes ("It depends")
1. On Home, tap the search box and type "piz".
2. Tap the suggestion **Pizza box**.
3. The question "It depends on the box. Which one is yours?" appears. Tap **Greasy or has food on it**.
4. You see **GREEN BIN**, with how to prepare it, and the item is saved: the bookmark at the top shows **1**.
5. Tap the other option, **Clean or a little grease**. The answer changes to **BLUE BIN**.

### B. Shortcut: go straight to the answer
1. Tap **NEXT ITEM →**.
2. Type "rinsed glass jar" and tap the **search** (magnifier) button.
3. The answer opens directly, without the results list: a blue **BLUE BIN!** box. At the bottom, **Source: City of Calgary** links to the City page.

### C. A typo
1. Tap **NEXT ITEM →**, type "cardbord" and tap the **search** button.
2. Under "Did you mean", tap **cardboard**.
3. Tap **Cardboard box**. The answer is **BLUE BIN!**.

### D. An item that isn't in the guide
1. Tap **NEXT ITEM →**, type "bike tube" and tap the **search** button.
2. The page "We couldn't find 'bike tube'" offers four ways out: **See all items A–Z**, **Take a photo instead**, **Report missing item** and **Call 311**.
3. Tap **Report missing item**. The item is already filled in; tap **Submit**. You see **Report sent** with an example notification. Tap **Done**.
4. Tap **Call 311**. A confirmation appears before calling; tap **Cancel**.

### E. A hazardous item and the map
1. Search "battery" and tap **Battery (household)**.
2. The hazard warning comes first, then **DROP-OFF ONLY**.
3. In the warning, tap **Find a drop-off near me**. The map opens with only hazardous waste sites.
4. Tap a **pin**. Its card shows what it accepts, hours, fees and distance. **Directions** opens a real map search.
5. Switch the filters (**Electronic**, **Bottle Depot**, **Landfill**) on and off to see the pins change. Close with **✕**.

### F. A drink container (two answers)
1. Search "pop can" and tap **Pop can (aluminum)**.
2. You see **BLUE BIN!** and **BOTTLE DEPOT** (deposit refund). **Find location near me!** opens the map with bottle depots.

### G. Saved list and sorting
1. Tap the **bookmark** at the top. Saved shows the items you opened, under **TODAY**.
2. Tick **SORTED** next to each item once "it is in its bin". When all of today's items are ticked, **All sorted ✓** appears.
3. Tap **⊗** next to an item. It is removed, and a message offers **Undo**; tap it to bring the item back.
4. Tap **Remove sorted items** to clear the ticked ones in one tap.
5. Tap **How saving works** for a short explanation. The **AUTO-SAVE SEARCH** switch turns auto-save off (then items have a **+ Save** button instead).

### H. Browse
1. Go **Home** (house icon). Under Popular Categories tap **Food Packaging**, then **Metal**, then **Tin can**.
2. Go back Home and tap **See all items listed A–Z**. Tap the letter **P** to jump. Type "bat" in **Filter the list…**.
3. Go Home and tap the **Blue** bin under CRASH COURSE ON BINS!: what goes in, what never goes in, a tip, and the items in our guide.

### I. Search with a photo (demo)
1. On Home, tap the **camera** in the search box, then the round **capture** button. The photo "is recognised" as a pop can and the answer opens.
2. Tap the camera again and choose **BROWSE DEVICE**. You see "We couldn't recognise this item" with next steps. Tap **Report missing item (photo attached)**.

### J. Calendar, Building guide, Help and Language (from Home)
1. **Calendar:** type "123 Example St NW" and tap the **search** button, or tap **Find me!**. An example month shows which cart goes out on which day.
2. **Building:** type "123", pick **123 Example St NW** and tap **GET GUIDANCE →**. You see where your building's bins are, and the items for your building. Tap **Change**, type "1 Unknown Rd" and **GET GUIDANCE →** for the "details unavailable" page.
3. **Help:** type "drop" in the help search. Only the matching tips stay, opened. Below, the contact form: tap **Submit** with the fields empty to see the error message.
4. **Language:** English is selected; the other languages are marked "coming soon".

## 4. Shortcuts for regular users
- Type the exact name of an item and press search to open its answer directly (walkthrough B).
- Pick a suggestion while typing instead of finishing the word.
- In A–Z, tap a letter to jump, or filter the list.
- **NEXT ITEM →** after every answer goes straight back to an empty search.
- Saved works as your personal quick list: every item you looked up is there.
