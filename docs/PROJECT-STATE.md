# Project state

Short summary of where the vertical prototype is. For how it works inside, see [PROJECT-GUIDE.md](PROJECT-GUIDE.md).

## What changed from Figma

- **Home button:** removed from the home screen (it did nothing there) and added to the nav bar of every other screen.
- **Green bin tag:** darker green (#25803f instead of #2e9e4f), so the white text passes the accessibility contrast minimum (WCAG 4.5:1).
- **Grey text on grey boxes:** slightly darker, for the same reason.
- **Sub-categories:** Figma only named "Plastic" and "Cardboard". We made up the groups for all six categories.
- **Bigger tap areas:** nav icons, "← back" and the search field buttons react to a 44 px area. They look the same.
- **Added:** a footer saying it is a student prototype.
- **Font:** the same Inter, but included in the project (`assets/fonts/`) instead of loaded from Google, so it also works offline from the zip.
- **Added:** a "Skip to content" link. It's invisible until you press Tab, and it jumps past the nav bar. It's of little use on a phone; it's there for keyboard users when the site is used on a computer.

## Done in the vertical prototype

**Fully working:**
- Search: live suggestions, nicknames ("soda can"), "Did you mean…?" for typos, no-result screen.
- Item page: bin answer, how to prepare it, "it depends" items (pizza box, cup), hazard warning first.
- Saving: auto-save, "Saved ✓" pill, Saved panel (TODAY / RECENT), sorted ticks, "All sorted ✓", remove with Undo, auto-save switch.
- Browsing: categories → sub-categories → items, A–Z list with filter, crash course page for each bin, ☰ menu.

**Working as demos** (made-up data in `data/demo.js`, nothing is sent anywhere):
- Photo search (always finds a pop can) and the failed-scan screen.
- Calendar, map of drop-off sites, building guide.
- Help, report missing item, "Report sent", call 311.
- Language (says "coming soon").

**Placeholders:** all item answers, the crash course text, the sub-category groups, and all pictures (grey boxes).

## To do from now on

**Content** (agreed with the professor)
- We don't copy the whole City of Calgary guide. Take the real answers (calgary.ca) for:
  - every item used in the walkthroughs;
  - enough extra common items that categories and lists don't look empty.
- Cite the source of each item. Images and the City logo can be used as long as they are cited.
- Check the sub-categories and crash course text against the real guide.

**Pictures: proposal**
- **Where from**, in this order:
  1. **City of Calgary** (calgary.ca: What Goes Where pages, waste and recycling pages). Allowed if cited, and they match the real service.
  2. **Our own photos** for anything missing: real items, same plain background and light, so they look consistent.
  3. **Free photo sites** if still missing: Unsplash or Pexels (free to use), or Wikimedia Commons (check each picture's licence; many ask for the author's name).
- **Rules:**
  - Square crop, about 600 px wide, WebP or JPEG.
  - Saved in `assets/items/`, `assets/categories/`, `assets/bins/`.
  - One line per picture in `docs/CITATIONS.md` with where it came from (link and author).
- **Where they go:** item page, list rows, saved rows, category and sub-category tiles, category banner, crash course banner.

**Design: more colour and feedback**
- The bin colours are only on the small tags right now. Use them more, so the answer is clear at a glance:
  - The answer box takes the bin's colour (blue box for the blue bin, green for green, black for black, yellow for drop-off).
  - The item page shows the bin picture in its colour next to the answer.
  - When an item is marked as sorted in Saved, the tick and row take that bin's colour.
  - The crash course buttons on Home and the main buttons get colour, not only black outlines.
- Clearer feedback when something happens: a coloured confirmation when saving or sorting, and a visible pressed state on buttons.
- Keep text readable on every colour (contrast 4.5:1), and never use colour alone: keep the bin name as text.
- Update Figma to match whatever we change.

**Team decisions**
- Recent searches: drop them? (Saved already keeps every item looked up.)
- Keep the home button in the nav bar?
- Which walkthroughs we show, so we know which items need real data.
- Who does what.

**Accessibility**
- The A–Z letters and the ⊗ remove button in Saved are still small to tap.
- Test with a screen reader on a real phone (VoiceOver or TalkBack). No keyboard testing: the app is for phones.

**Hand-in**
- Put it on GitHub Pages and test on a real iPhone and Android phone.
- Fill in the names in `docs/CITATIONS.md`.
- Write the markers' instructions for D2L: everyone's full name, the link, and exactly what to tap and type.
- Upload the zip too, and keep the link working until grades are out.
