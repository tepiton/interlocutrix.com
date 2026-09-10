# Phase 0: Foundation

## Session 1 — 2026-09-08

- Cloned the proven section engine, infra files, and design system from
  eleventy-product; adapted to port 8091.
- Service section palette: hero, services, process, testimonials, faq,
  contact. New partials: testimonials (quote cards), contact (details
  card with email/phone/location/response + mailto CTA). services and
  process reuse the card-grid and steps patterns under service names.
- Palette swapped to the warm variant: amber accent, cream light
  background, warm neutrals; token names and theme mechanics unchanged.
- Demo brand Harborlight Studio; about + work subpages; beacon mark
  icons generated with sharp.
- Carrying over the product template's engine gotchas into CLAUDE.md
  (directory data file named-export trap, YAML tab/colon rules, Nunjucks
  filter call syntax).

## Session 2 - 2026-09-09

- Subpages had no styling beyond the base skeleton. Added a shared
  layouts/page.njk (page hero band with eyebrow/title/lede, prose
  measure body) plus frontmatter-driven blocks: stats row, cards grid,
  projects list with tag chips, wide mode.
- Default layout switched to page.njk via content.11tydata.js;
  index.njk already pinned base.njk explicitly, so homepages are
  unchanged. 404 inherits the page treatment too.
- Rewrote all four subpages with real frontmatter and demo copy
  (keeping eleventyNavigation - YAML object form works fine).
- Verified in-browser: hero bands centered with border, 3-column
  contact cards, 4 project rows with 9 tag chips, nav intact, no
  horizontal overflow.
