# CLAUDE.md — eleventy-service

Development memory for AI-assisted sessions on this template.

## Overview

Service business landing page template, Eleventy v3, dev port **8091**.
Repo will live at tepiton/eleventy-service (GitHub template repo, topics
`eleventy, mimeo, mimeo-template, template`). Built and maintained as
part of the kincaid project alongside eleventy-product; sibling
conventions in ~/projects/mimeo-sites/TEMPLATES/CLAUDE.md.

## Essential commands

```bash
npm install
npm run start     # http://localhost:8091
npm run build     # _site/
node scripts/generate-icons.mjs   # regenerate favicon/apple-touch/og images
```

## The section engine

- Homepage = `content/sections/*.md`, sorted by frontmatter `order`
  (then filename) into the `sections` collection; `content/index.njk`
  loops and includes `_includes/sections/<type>.njk`.
- Section partials pull their own styles:
  `<style>{% include "css/sections/<type>.css" %}</style>` — swept into
  the inline page bundle by `addBundle("css")`.
- Sections never emit standalone pages: `permalink: false` +
  `tags: ["sections"]` in `content/sections/sections.11tydata.js`.
- Front matter is validated by a zod schema (`eleventyDataSchema` key in
  the same file, validator in `_config/section-schema.js`). Unknown
  type, missing arrays (services/steps/quotes/items), or a contact
  section without `email` fails the build naming the file.
- Section palette: hero, services, process, testimonials, faq, contact.
  The contact band is mailto/form-endpoint only — no form backend.

### Gotchas learned the hard way

- **Directory data files must export ONLY a default export.** Adding a
  named export breaks Eleventy's ESM import so the whole data file
  silently stops applying (permalink: false stops working). Keep shared
  constants in `_config/` files and import them.
- **A default-exported function in `_data/*.js` is called once with the
  global data**, so a global `eleventyDataSchema.js` file does NOT
  validate per-template data. The `eleventyDataSchema` KEY on a
  directory data file's default export is the mechanism that runs per
  template.
- YAML front matter: no tabs in indentation; quote any value containing
  `: ` (colon+space).
- Nunjucks filter arguments are call syntax:
  `{{ url | absoluteUrl(metadata.url) }}`, not `filter: arg`.
- Images referenced with `<img>` or `![]()` must live in `content/img/`
  and be referenced root-absolute (`/img/photo.jpg`); the image
  transform then optimizes them. Root-absolute src paths pointing into
  `public/` get rewritten to broken relative paths by
  InputPathToUrlTransformPlugin. `public/` is for favicon/OG head links
  only - `<link>` hrefs pass through untouched.

## Subpage layout

`layouts/page.njk` (default via content.11tydata.js; index.njk pins
base.njk explicitly) renders subpages with a page hero band plus
optional frontmatter blocks: eyebrow, description (also the lede),
wide, stats, cards, projects. Page CSS lives in the PAGES section of
css/index.css. Keep page.njk and that CSS block identical between
eleventy-product and eleventy-service.

## Theme system

Same contract family-wide: localStorage key `theme`
(`light|dark|system`), `html[data-force-theme]` + `body.*-mode`, 3-state
dropdown. **This template inverts the family default: dark is `:root`**,
light arrives via `prefers-color-scheme: light`; an inline `<head>`
script in base.njk applies the saved preference pre-paint.

This template's palette is the warm variant (amber accent #e0a370 /
#b06a2e, cream light bg #faf8f3); eleventy-product uses the cool
variant. Keep the engine and theme mechanics identical between the two.

## Conventions

- `pages.yml` must stay byte-identical to the family (md5
  7e3dcd553014363159c47601218637d3); package-lock.json is tracked
  (workflow runs `npm ci`).
- Fonts only ever via `--font-body` / `--font-heading` (never hardcode).
- No emojis in files. Commit messages `type: description`, plain
  hyphens only (em dashes break bash heredocs). `git pull --rebase`
  before pushing.
- Changes that apply to "all eleventy templates" must eventually touch
  all seven dirs (five siblings + product + service).

## Related

- eleventy-product — same engine, product palette; keep the section
  engine and theme system in sync between the two.
- mimeo (~/projects/mimeo) — stamps out sites from this template; no
  mimeo changes needed.
