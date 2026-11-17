# Citations (AI use and outside material)

CPSC 481 rule: cite all generative-AI use and all external libraries, including images.
Keep this file up to date. Copy it into the final portfolio.

## Generative AI

| What | Tool | Who checked it |
|---|---|---|
| Starter code for this site (HTML, CSS, JavaScript, tests, README) | Claude Code, model Claude Sonnet 5.5 (Anthropic), started 2026-11-12 | *(add the name of the team member who reviewed it)* |
| Item data in `data/items.js`: answers collected from the City of Calgary pages and shortened, plus the choice of pictures | Claude Code | *(add name)* |
| Help tips text, the screenshot script (`tools/screenshots.js`), and the drafts of `MARKER-INSTRUCTIONS.md` and `VIDEO-SCRIPT.md` | Claude Code | *(add name)* |
| Crash course text (`BIN_INFO` in `data/items.js`, summarised from the City's cart pages), the sub-category groups, and made-up demo data in `data/demo.js` (sites, addresses) | Claude Code | *(add name)* |

The AI was used for programming only. The design (screens, layout, colours, flows) comes from the team's own
Figma file. Check with the TA that the final wording of this section is what the course expects.

## External libraries and fonts

| Item | Use | Source |
|---|---|---|
| Inter (font), files in `assets/fonts/` | Text | The Inter Project Authors, https://github.com/rsms/inter (SIL Open Font License, copy in `assets/fonts/OFL.txt`). Files from the Fontsource package `@fontsource/inter` 5.0.18 |
| Icons and bin cart drawings in `assets/` | All icons | Exported from the team's own Figma file ("What goes where redesign", page Components) |
| Item and category pictures in `assets/img/` | Item pages, lists, tiles, banners | Fluent Emoji (3D style) by Microsoft, https://github.com/microsoft/fluentui-emoji (MIT licence, copy in `assets/img/LICENSE-fluentui-emoji.txt`). Files from commit `1ffb34c` |
| City of Calgary logo (`assets/calgary.png`) | Top bar of the home screen, as in the Figma design | © City of Calgary, https://www.calgary.ca. Used to show the redesign idea; allowed by the professor as long as it is cited |

No JavaScript libraries are used. Icons are simple SVG shapes written inside `js/ui.js`.

## Data

The answers (which cart an item goes in) come from the City of Calgary "What Goes Where" guide,
https://www.calgary.ca/waste/what-goes-where/default.html, checked in November 2026. They are shortened for the app,
and each item links to the City page it comes from (`source` in `data/items.js`). The crash course text is summarised
from the City's pages "Preparing your recyclables", "Preparing your food and yard waste" and "Preparing your garbage"
(https://www.calgary.ca/waste/residential/). As agreed with the professor, only the items the walkthroughs need plus
some common ones are included, not the whole guide. Everything in `data/demo.js` (map sites, addresses, schedule) is made up.
