import fs from "fs";
import { mkdir, stat } from "fs/promises";
import path from "path";
import { pipeline } from "stream/promises";

const DEFAULT_OWNER = "googlefonts";
const DEFAULT_BRANCH = "main";
const DEFAULT_DIR = "fonts/otf";

type GhFile = {
  name: string;
  path: string;
  type: string;
  download_url?: string;
};

async function ensureDir(dir: string) {
  try {
    await stat(dir);
  } catch (err) {
    await mkdir(dir, { recursive: true });
  }
}

async function listFiles(
  owner: string,
  repo: string,
  branch: string,
  dir: string,
): Promise<GhFile[]> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dir}?ref=${branch}`;
  console.log({ apiUrl });
  const headers: Record<string, string> = {
    "User-Agent": "download-fonts-script",
  };
  const res = await fetch(apiUrl, { headers });
  if (!res.ok)
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  const body = await res.json();
  return Array.isArray(body) ? (body as GhFile[]) : [];
}

async function downloadFile(url: string, destPath: string, token?: string) {
  const headers: Record<string, string> = {
    "User-Agent": "download-fonts-script",
  };
  if (token) headers["Authorization"] = `token ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok)
    throw new Error(
      `Failed to download ${url}: ${res.status} ${res.statusText}`,
    );
  await pipeline((res as any).body, fs.createWriteStream(destPath));
}

function extractStyle(name: string) {
  const base = name.replace(/\.[^/.]+$/, ""); // remove extension
  const sepIdx = Math.max(
    base.lastIndexOf("-"),
    base.lastIndexOf("_"),
    base.lastIndexOf(" "),
  );
  const style = sepIdx >= 0 ? base.slice(sepIdx + 1) : base;
  return style.toLowerCase().replace(/[^a-z0-9]+/g, ""); // normalize
}

// Accept exact style names (case-insensitive), or wildcard like "Bold*"
// Accept exact font style names (case-insensitive), or wildcard like "Bold*".
// Uses the style extracted from the filename (portion after last -/_/space).
function matchesFonts(name: string, fonts: string[]) {
  if (fonts.length === 0) return true;
  const style = extractStyle(name);
  return fonts.some((w) => {
    const token = w.toLowerCase().replace(/[^a-z0-9*]+/g, "");
    if (token.includes("*")) {
      // convert simple wildcard to regex, ensure full-match
      const re = new RegExp(`^${token.replace(/\*/g, ".*")}$`);
      return re.test(style);
    }
    // exact match only (avoids "italic" matching "ExtraBoldItalic")
    return style === token;
  });
}

export type DownloadOptions = {
  owner?: string;
  repo: string;
  branch?: string;
  dir?: string;
  out?: string;
  fonts?: string[];
};

export async function downloadFonts(opts: DownloadOptions, outBase?: string) {
  const owner = opts.owner ?? DEFAULT_OWNER;
  const repo = opts.repo;
  const branch = opts.branch ?? DEFAULT_BRANCH;
  const dir = opts.dir ?? DEFAULT_DIR;
  const outBaseDir = outBase ?? "public/fonts";
  const out = opts.out ?? path.join(outBaseDir, repo);
  const fonts = opts.fonts ?? [];

  console.log("downloadFonts:", {
    owner,
    repo,
    branch,
    dir,
    out,
    fonts: fonts.length ? fonts : "<all>",
  });
  await ensureDir(out);

  const files = await listFiles(owner, repo, branch, dir);
  const fontFiles = files.filter(
    (f) =>
      f.type === "file" &&
      (f.name.toLowerCase().endsWith(".otf") ||
        f.name.toLowerCase().endsWith(".ttf")),
  );

  const selected = fontFiles.filter((f) => matchesFonts(f.name, fonts));

  if (selected.length === 0) {
    console.log("no matching font files found for fonts filter");
    return;
  }

  for (const f of selected) {
    const downloadUrl = f.download_url;
    if (!downloadUrl) {
      console.warn("no download_url for", f.name, "skipping");
      continue;
    }
    const outPath = path.join(out, f.name);
    if (fs.existsSync(outPath)) {
      console.log("exists, skipping", outPath);
      continue;
    }

    console.log("downloading", f.name);
    try {
      await downloadFile(downloadUrl, outPath);
      console.log("saved to", outPath);
    } catch (err: any) {
      console.error("error downloading", f.name, err.message || err);
    }
  }
  console.log("done");
}

/**
 * Download multiple font families sequentially (safer for rate limits).
 * Each family is a DownloadOptions object; `name` can be provided for logging.
 */
export async function downloadFamilies(
  families: Array<DownloadOptions & { name?: string }>,
  outBase?: string,
) {
  for (const fam of families) {
    const label = fam.name
      ? `${fam.name}`
      : `${fam.owner ?? DEFAULT_OWNER}/${fam.repo}`;
    console.log(`\n=== Family: ${label} ===`);
    try {
      await downloadFonts(fam, outBase);
    } catch (err: any) {
      console.error(`family ${label} failed:`, err?.message ?? err);
    }
  }
}
