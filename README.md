# What Goes Where (prototype)

Vertical prototype for CPSC 481 (group "The Sopranos", project 4): a redesign of the City of Calgary "What Goes Where" waste sorting guide. Student project, not an official City service.

A static website (plain HTML, CSS and JavaScript). No install, no build step, no server code.

## Team

Group T02-1 "The Sopranos": Oluchukwu Ani, Bianca Asuncion, Ferran Villarta, Ali Awan, Bobby Brar, Xavier Lachance.

## Run

Open `index.html` in a browser, or start the local server:

```bash
node tools/serve.js
```

Then open http://localhost:8080.

## Test

```bash
npm test
```

## Project structure

```
index.html      page shell
css/            styles
js/             app logic (app, ui, search, store, config)
data/           items, categories, bins, and made-up data for the demo screens
assets/         icons from Figma, item pictures (img/), and the font (fonts/)
tests/          automatic checks
tools/          local server, screenshot script (node tools/screenshots.js)
docs/           project guide, project state, marker instructions, video script, citations, screenshots
```

## Documentation

- [Project guide](docs/PROJECT-GUIDE.md): state of the project, open decisions, and how everything works.
- [Project state](docs/PROJECT-STATE.md): what changed from Figma, what is done, what is left.
- [Marker instructions](docs/MARKER-INSTRUCTIONS.md): exact walkthrough for the TA (D2L deliverable).
- [Video script](docs/VIDEO-SCRIPT.md): draft for the 5–8 minute video.
- [Citations](docs/CITATIONS.md): AI use and outside material.

## Live site

https://cpsc481-fall2026-t02-gr1.github.io/

Every push to `main` publishes it automatically after a minute or two (`.github/workflows/pages.yml`, Settings > Pages > Source: GitHub Actions). The workflow also stamps the CSS and JS links with the commit ID, so phones load the newest version right away.

## Clone

```bash
git clone https://github.com/cpsc481-fall2026-t02-gr1/cpsc481-fall2026-t02-gr1.github.io.git
```
