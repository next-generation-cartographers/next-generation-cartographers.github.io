// 1. Import utilities from `astro:content`
import { defineCollection, reference, z } from "astro:content";

// 2. Import loader(s)
import { glob } from "astro/loaders";

// 3. Define your collection(s)
const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/events" }),
  schema: z.object({
    title: z.string(),
    dateTime: z
      .object({
        start: z.string(),
        end: z.string(),
      })
      .optional(),
    type: z.string(),
    index: z.number().optional(),
    url: z.string().url().optional(),
  }),
});

const papers = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/resources/papers" }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    publicationDate: z.date(),
    summary: z.string(),
    doi: z.string().url().optional(),
    url: z.string().url().optional(),
  }),
});

const updates = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/updates" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
    papers: z.array(reference("papers")).optional(),
  }),
});

const tutorials = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/data/resources/tutorials",
  }),
  schema: z.object({
    title: z.string(),
    authors: z.array(reference("authors")),
    keywords: z.array(z.string()).optional(),
    publicationDate: z.date(),
    summary: z.string(),
    bannerImage: z.string().optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: "**/*.yml", base: "./src/data/authors" }),
  schema: z.object({
    name: z.string(),
    pronouns: z.string().optional(),
    affiliation: z.string().optional(),
    avatar: z.string().optional(),
    bio: z.string().optional(),
    website: z.string().url().optional(),
    socials: z.array(z.string().url()).optional(),
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { events, updates, papers, tutorials, authors };
