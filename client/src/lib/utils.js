import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import API_BASE from "../config/api.js";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getAvatarUrl(url) {
  if (!url) return null;
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  if (API_BASE.startsWith("http://") || API_BASE.startsWith("https://")) {
    const origin = API_BASE.replace(/\/api\/?$/, "");
    return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
  }
  return url;
}
