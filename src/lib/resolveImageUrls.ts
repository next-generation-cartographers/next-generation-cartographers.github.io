export function resolveImageUrl(pathOrUrl: string, format = "png"): string {
  const withExtensions = `${pathOrUrl}.${format}`;
  const isDev = import.meta.env.MODE === "development";
  if (isDev) {
    const devOrigin = (
      process.env.DEV_ORIGIN ?? "http://localhost:4321"
    ).replace(/\/$/, "");
    return `${devOrigin}${pathOrUrl.startsWith("/") ? withExtensions : `/${withExtensions}`}`;
  }

  const site = (import.meta.env.SITE as string) ?? "";
  if (site) return new URL(withExtensions, site).toString();

  return pathOrUrl;
}
