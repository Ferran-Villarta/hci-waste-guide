# Project state

Short summary of where the vertical prototype is. For how it works inside, see [PROJECT-GUIDE.md](PROJECT-GUIDE.md).

- **Live site:** https://cpsc481-fall2026-t02-gr1.github.io/ (updates a minute or two after each push to `main`).
- **Repository:** https://github.com/cpsc481-fall2026-t02-gr1/cpsc481-fall2026-t02-gr1.github.io, owned by our team's GitHub organisation (not a personal account).

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
- **Saved rows:** the ⊗ remove button is bigger (24 px icon, 44 px tap area) and sits in its own column, well apart from the tick, so you don't remove an item when you meant to tick it (in Figma it was in the row's top corner).
- **Font:** the same Inter, but included in the project (`assets/fonts/`) instead of loaded from Google, so it also works offline from the zip.
- **Added:** searchable help tips (Figma's Help was only a contact form).
- **Changed:** Language shows "English for now" with the others marked "coming soon", instead of letting you pick one that doesn't work.
- **Added:** typing an item's exact name and pressing search opens its answer directly (shortcut for regular users).
- **Added:** a footer saying it is a student prototype.
- **Added:** a "Skip to content" link. It's invisible until you press Tab, and it jumps past the nav bar. It's of little use on a phone; it's there for keyboard users when the site is used on a computer.

## Done in the vertical prototype

**Fully working:**
- Search: live suggestions, nicknames ("soda can"), "Did you mean…?" for typos, no-result screen. Shortcut: typing an item's exact name opens its answer directly.
- Item page: bin answer in colour, how to prepare it, "it depends" items (pizza box, cup, bakery box), hazard warning first, link to the City page.
- Saving: auto-save, "Saved ✓" pill, Saved panel (TODAY / RECENT), sorted ticks, "All sorted ✓", remove with Undo, auto-save switch.
- Browsing: categories → sub-categories → items, A–Z list with filter, crash course page for each bin, ☰ menu.
- Help: searchable tips (how to search, "It depends", saving, drop-offs, Eco Centres, shortcuts), then the contact form and Call 311.

**Real data:** 40 items with answers from the City of Calgary "What Goes Where" guide (checked November 2026, shortened), and crash course text from the City's pages on preparing each cart. As agreed with the professor, it's not the whole guide: the walkthrough items plus common ones.

**Pictures:** every item, category, sub-category and bin has one (Fluent Emoji 3D, MIT licence, cited).

**Online:** the site is on GitHub Pages, in the team organisation's repository (links at the top).

**Working as demos** (made-up data in `data/demo.js`, nothing is sent anywhere):
- Photo search (always finds a pop can) and the failed-scan screen.
- Calendar, map of drop-off sites, building guide.
- Help, report missing item, "Report sent", call 311.
- Language (English for now; the other languages are marked "coming soon").

## Final deliverable: Design Portfolio II (due Dec 4, 2026, 11:59 PM)

From the assignment brief and the D2L rubric. Grades reward quality and polish over size: "a modest carefully implemented project often scores much higher".

**1. PDF portfolio** (Part II, with Part I as an appendix, and a full table of contents)
- [ ] Cover page: course, group T02-1 "The Sopranos", project title, all full names, date.
- [ ] Illustrations of the final implementation with **new screenshots**, each tied to a design decision. All screens are ready in `docs/screenshots/` (re-take them with `node tools/screenshots.js` after any change).
- [ ] **Heuristic evaluation:** problems listed by heuristic, each with a severity rating.
- [ ] **Summary of the main findings**, with next steps clear enough for someone outside the team.
- [ ] **Final design rationale and discussion (2–3 pages):** quality of the design, what works and what needs improvement, whether it would work for our users and tasks, strengths and weaknesses, justified. Raw material: "What changed from Figma" above. It must show how we fixed the flaws of the horizontal prototype.
- [ ] Link to the video.
- [ ] Appendices: Part I, and screenshots of the progression from low to medium to high fidelity (Figma pages "Faithful copy" → "Manual changes" → "Redesign" → the live app).

**2. Code and demo**
- [x] Live link: https://cpsc481-fall2026-t02-gr1.github.io/. Keep it working from the end of classes to the end of finals: don't rename or delete the repo.
- [ ] Zip of the HTML, CSS and JS (download the repo as a zip from GitHub just before submitting).

**3. Instructions for the markers**
- [x] Draft: [`MARKER-INSTRUCTIONS.md`](MARKER-INSTRUCTIONS.md), an exact walkthrough of what to tap and type.
- [ ] Fill in everyone's full name and UCID, then export it to PDF/Word for D2L. Put the UCIDs only in the D2L copy, not in this public repo.

**4. Video (5–8 min, every member takes part)**
- [x] Draft script: [`VIDEO-SCRIPT.md`](VIDEO-SCRIPT.md), one part per member: overview, design considerations, walkthrough, reflection from the heuristic evaluation.
- [ ] Record, edit, upload (YuJa or D2L), and put the link in the portfolio.

**Suggested order:** heuristic evaluation first (its fixes must be in the app and in the video) → fixes → screenshots and rationale → video → assemble the PDF → submit.

**What the rubric checks in the app, and where we are**
- Help, searchable and in context: searchable tips at the top of Help, contact form below.
- No dead ends: Language now says "English for now" before you pick; Directions opens a real map search.
- Shortcuts for experts: typing an item's exact name opens its answer directly; suggestions; A–Z letters; Next item. Show them in the video.
- Error handling, exits, feedback, memory load, consistency: in place (Did you mean, no-result screen, Undo, back and close everywhere, Saved).
- Stability: test every walkthrough on a real iPhone and Android phone.

## To do from now on

**Check with the team**
- Read through the answers in `data/items.js`. They were shortened from the City pages, so someone should compare a few with calgary.ca.
- Check the walkthrough in `MARKER-INSTRUCTIONS.md` on a phone, and change it if the team wants other examples.
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
- Who does what. Everyone needs to be a member of the organisation to push.

**Accessibility**
- Test with a screen reader on a real phone (VoiceOver or TalkBack). No keyboard testing: the app is for phones.

**Names** (fill in once, then copy)
- Full names: README "Team", `CITATIONS.md` "Who checked it", `MARKER-INSTRUCTIONS.md`, the portfolio cover, the video title card.
- UCIDs: only in the D2L copies (instructions document and portfolio cover), not in this public repo.
