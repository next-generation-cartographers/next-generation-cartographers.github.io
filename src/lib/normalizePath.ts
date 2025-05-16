const normalizePath = (path: string) => {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
};

export default normalizePath;
