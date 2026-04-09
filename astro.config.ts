// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://next-generation-cartographers.github.io/",
  integrations: [mdx(), icon()],
});
