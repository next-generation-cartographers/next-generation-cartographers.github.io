// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";

// 2. Import loader(s)
import { glob, file } from "astro/loaders";

// 3. Define your collection(s)
const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/events" }),
  schema: z.object({
    title: z.string(),
    dateTime: z.object({
      start: z.string(),
      end: z.string(),
    }),
    type: z.string(),
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { events };
