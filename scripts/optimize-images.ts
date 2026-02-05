import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

type Opts = {
  dir: string;
  delete: boolean;
  quality: number;
  dryRun: boolean;
  recursive: boolean;
};

function parseArgs(argv: string[]): Opts {
  const opts: Opts = {
    dir: "./images",
    delete: false,
    quality: 80,
    dryRun: false,
    recursive: true,
  };
  const rest: string[] = [];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--delete") opts.delete = true;
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a.startsWith("--quality=")) opts.quality = Number(a.split("=")[1]);
    else if (a === "--no-recursive") opts.recursive = false;
    else if (a.startsWith("--dir=")) opts.dir = a.split("=")[1];
    else rest.push(a);
  }
  if (rest[0]) opts.dir = rest[0];
  return opts;
}

async function findFiles(
  dir: string,
  exts: string[],
  recursive = true,
): Promise<string[]> {
  const results: string[] = [];

  async function walk(current: string) {
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch (err) {
      return;
    }

    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (recursive) await walk(full);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase().replace(/^\./, "");
      if (exts.includes(ext)) results.push(full);
    }
  }

  // if the provided path is a file, check its extension
  try {
    const stat = await fs.stat(dir);
    if (stat.isFile()) {
      const ext = path.extname(dir).toLowerCase().replace(/^\./, "");
      if (exts.includes(ext)) return [dir];
      return [];
    }
  } catch (e) {
    // ignore
  }

  await walk(dir);
  return results;
}

(async () => {
  const opts = parseArgs(process.argv);
  const exts = ["jpg", "jpeg", "png", "tiff", "gif", "avif", "bmp", "webp"];
  const files = await findFiles(opts.dir, exts, opts.recursive);

  if (!files.length) {
    console.log("No images found for", opts.dir);
    return;
  }

  console.log(
    `Found ${files.length} files. quality=${opts.quality} delete=${opts.delete} dryRun=${opts.dryRun}`,
  );
  let converted = 0;
  let skipped = 0;
  let simulated = 0;
  let errors = 0;

  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (ext === ".webp") {
      skipped++;
      console.log("SKIP (already webp):", f);
      continue;
    }
    const out = f.replace(/\.[^/.]+$/, ".webp");

    try {
      if (opts.dryRun) {
        console.log("[DRY]", f, "->", out);
        simulated++;
        continue;
      }

      await sharp(f).webp({ quality: opts.quality }).toFile(out);
      converted++;
      if (opts.delete) await fs.unlink(f);
      console.log("OK", f, "->", out);
    } catch (e: unknown) {
      errors++;
      const err = e as Error;
      console.error("ERR", f, err.message);
    }
  }

  console.log(
    `Done. converted=${converted} skipped=${skipped} simulated=${simulated} errors=${errors}`,
  );
})();
