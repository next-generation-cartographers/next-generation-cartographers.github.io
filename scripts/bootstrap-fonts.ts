import { downloadFamilies, type DownloadOptions } from "./download-fonts";

const FAMILIES: Array<DownloadOptions & { name?: string }> = [
  {
    name: "Space Grotesk",
    repo: "space-grotesk",
    owner: "floriankarsten",
    branch: "master",
    dir: "fonts/ttf/static",
    fonts: ["Light"],
  },
  {
    name: "Source Sans 3",
    repo: "source-sans",
    owner: "adobe-fonts",
    branch: "release",
    dir: "TTF",
    fonts: ["Regular", "Black"],
  },
];

async function main() {
  console.log(
    "downloading fonts …",
    FAMILIES.map((f) => f.name ?? `${f.owner}/${f.repo}`),
  );
  try {
    await downloadFamilies(FAMILIES, "public/fonts");
    console.log("pre-download-fonts: finished");
  } catch (err: any) {
    console.error("pre-download-fonts: error", err?.message ?? err);
  }
}

main();
