# Next Generation Cartographers Website

Static HTML page, online at [next-generation-cartographers.github.io/](https://next-generation-cartographers.github.io/).

The Website is built using [Astro](https://astro.build/), a static site generator.

## Setup

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Start the development server with `pnpm dev`

## Website structure

- `./public/assets`: resources, logos, favicon -> general stuff
- `./src/data`: content embedded in a page
- `./src/pages`: individual subpages, routing through directories, e.g. about.
  - `index.astro` would lead to the about page, terms-of-reference.astro to about/terms-of-reference
  - can have both .astro or .md files, will be transformed into a page
  - `./src/pages/index.astro` is home page
  - `./src/pages/404.astro` is error page
- `./src/content.config.ts`: describes collections for the file generation, the structure of different types of content (e.g. in `./src/data/events`)

## Datetime strings
For date and time information of events, we use the ISO datetime string format, which is based on GMT plus a timezone offset. This offset needs to consider daylight saving time. For example, for CET it would be a 1 hour offset (+01:00), for CEST +02:00.
