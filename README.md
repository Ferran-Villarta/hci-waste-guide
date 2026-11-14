# What Goes Where (prototype)

Vertical prototype for CPSC 481 (group "The Sopranos", project 4): a redesign of the City of Calgary "What Goes Where" waste sorting guide. Student project, not an official City service.

A static website (plain HTML, CSS and JavaScript). No install, no build step, no server code.

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
data/           items, categories and bins
assets/         icons and images exported from Figma
tests/          automatic checks
tools/          local server
docs/           project guide, next steps, citations
```

## Documentation

- [Project guide](docs/PROJECT-GUIDE.md): state of the project, open decisions, and how everything works.
- [Next steps](docs/NEXT-STEPS-PROMPT.md): everything left to do.
- [Citations](docs/CITATIONS.md): AI use and outside material.

## Deploy

GitHub: **Settings > Pages > Deploy from a branch > `main` / root**. The site appears at `https://<user>.github.io/<repo>/`.
