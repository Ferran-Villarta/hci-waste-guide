# Project state

Short summary of where the vertical prototype is. For how it works inside, see [PROJECT-GUIDE.md](PROJECT-GUIDE.md).

## What changed from Figma

- **Pictures:** the grey placeholder boxes are now colourful 3D illustrations (Fluent Emoji by Microsoft), on a background tinted with the item's bin colour.
- **Answer box:** filled with the bin's colour (blue, green, black, yellow for drop-off) instead of a black outline, so the answer is clear at a glance.
- **Pressed buttons:** buttons and cards sink a little while you press them.
- **Answers:** now from the City of Calgary guide, so some differ from the Figma screens. For example, foam cups and Ziploc bags now go in the blue bin, and old clothes go to a City Eco Centre. Each item page links to its City page.
- **Home button:** removed from the home screen (it did nothing there) and added to the nav bar of every other screen.
- **Green bin tag:** darker green (#25803f instead of #2e9e4f), so the white text passes the accessibility contrast minimum (WCAG 4.5:1).
- **Grey text on grey boxes:** slightly darker, for the same reason.
- **Sub-categories:** Figma only named "Plastic" and "Cardboard". We made up the groups for all six categories.
- **Bigger tap areas:** nav icons, "← back" and the search field buttons react to a 44 px area. They look the same.
- **A–Z letters:** 7 per row and 44 px tall (Figma had two rows of 13 at 26 px), so they are easy to tap.
- **⊗ remove button in Saved:** 44 px tap area, and moved next to the tick (it was in the row's top corner, where a bigger button would overlap the tick).
- **Font:** the same Inter, but included in the project (`assets/fonts/`) instead of loaded from Google, so it also works offline from the zip.
- **Added:** a footer saying it is a student prototype.
- **Added:** a "Skip to content" link. It's invisible until you press Tab, and it jumps past the nav bar. It's of little use on a phone; it's there for keyboard users when the site is used on a computer.

## Done in the vertical prototype

**Fully working:**
- Search: live suggestions, nicknames ("soda can"), "Did you mean…?" for typos, no-result screen.
- Item page: bin answer in colour, how to prepare it, "it depends" items (pizza box, cup, bakery box), hazard warning first, link to the City page.
- Saving: auto-save, "Saved ✓" pill, Saved panel (TODAY / RECENT), sorted ticks, "All sorted ✓", remove with Undo, auto-save switch.
- Browsing: categories → sub-categories → items, A–Z list with filter, crash course page for each bin, ☰ menu.

**Real data:** 40 items with answers from the City of Calgary "What Goes Where" guide (checked November 2026, shortened), and crash course text from the City's pages on preparing each cart. As agreed with the professor, it's not the whole guide: the walkthrough items plus common ones.

**Pictures:** every item, category, sub-category and bin has one (Fluent Emoji 3D, MIT licence, cited).

**Working as demos** (made-up data in `data/demo.js`, nothing is sent anywhere):
- Photo search (always finds a pop can) and the failed-scan screen.
- Calendar, map of drop-off sites, building guide.
- Help, report missing item, "Report sent", call 311.
- Language (says "coming soon").

## To do from now on

**Check with the team**
- Read through the answers in `data/items.js`. They were shortened from the City pages, so someone should compare a few with calgary.ca.
- Decide the walkthroughs for the markers, and check every item they use is in the data.
- Some pictures are the closest match the set has, not the exact item. Replace them if we find better ones (with our own photos, for example, cited):
  - pop can and tin can share the same can;
  - aerosol can → spray bottle;
  - aluminum foil → foil pan;
  - diaper → baby;
  - car battery → car;
  - toaster or kettle → teapot;
  - hair dryer → razor.

**Team decisions**
- Recent searches: drop them? (Saved already keeps every item looked up.)
- Keep the home button in the nav bar?
- Keep the coloured answer boxes and the new pictures? If so, update Figma to match.
- Who does what.

**Accessibility**
- Test with a screen reader on a real phone (VoiceOver or TalkBack). No keyboard testing: the app is for phones.

**Hand-in**
- Put it on GitHub Pages (Settings → Pages → `main`, root) and test on a real iPhone and Android phone.
- Fill in the names in `docs/CITATIONS.md`.
- Write the markers' instructions for D2L: everyone's full name, the link, and exactly what to tap and type.
- Upload the zip too, and keep the link working until grades are out.
