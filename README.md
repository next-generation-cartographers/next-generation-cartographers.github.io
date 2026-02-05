# Next Generation Cartographers Website

Static HTML page, online at [next-generation-cartographers.github.io/](https://next-generation-cartographers.github.io/).

The Website is built using [Astro](https://astro.build/), a static site generator.

## Setup

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Start the development server with `pnpm dev`

## Website Structure

- `./public/assets`: resources, logos, favicon -> general stuff
- `./src/data`: content embedded in a page
- `./src/pages`: individual subpages, routing through directories, e.g. about.
  - `index.astro` would lead to the about page, `terms-of-reference.astro` to `about/terms-of-reference`
  - can have both `.astro` or `.md` files, will be transformed into a page
  - `./src/pages/index.astro` is home page
  - `./src/pages/404.astro` is error page
- `./src/content.config.ts`: describes collections for the file generation, the structure of different types of content (e.g. in `./src/data/events`)

## Datetime Strings

For date and time information of events, we use the ISO datetime string format, which is based on GMT plus a timezone offset. This offset needs to consider daylight saving time. For example, for CET it would be a 1 hour offset (+01:00), for CEST +02:00.

## Image optimization script

Please optimize images before adding them to the github repository. You can optimize images with the TypeScript script at `scripts/optimize-images.ts` that converts image files to the WebP format using sharp.

### Usage

- Run via the included pnpm script:

  ```sh
  pnpm run optimize-images [options] [dir|file]`
  ```

#### Options

- `--dir=PATH` or pass `PATH` as the first positional argument — default: `./images`
- `--quality=N` — WebP quality (default: `80`)
- `--delete` — remove original files after successful conversion
- `--dry-run` — simulate conversions; no files are written
- `--no-recursive` — do not recurse into subdirectories (default: recursive)

#### Examples

- Dry run for default directory: `pnpm run optimize-images --dry-run`
- Convert and delete originals in `public/assets`: `pnpm run optimize-images --dir=public/assets --quality=75 --delete`
- Convert a single file: `pnpm run optimize-images path/to/photo.jpg --quality=85`

### Behavior

- Processes files with extensions: `jpg, jpeg, png, tiff, gif, avif, bmp`
- Skips files already ending in `.webp`
- If a file path is passed instead of a directory, only that file is processed (if supported)
- Creates a `.webp` sibling file for each converted image; deletes the original only if `--delete` is set
