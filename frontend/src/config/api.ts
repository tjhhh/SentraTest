export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Builds a full API URL for a given path, ensuring /api prefix is present.
 */
export const buildApiUrl = (path: string) => {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  
  if (base.endsWith("/api")) {
    return `${base}${normalizedPath}`;
  }
  return `${base}/api${normalizedPath}`;
};
