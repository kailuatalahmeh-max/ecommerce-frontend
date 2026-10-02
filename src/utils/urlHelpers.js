const INVISIBLE_UNICODE_REGEX = /[\u200B-\u200F\u202A-\u202E\uFEFF]/g;

export function cleanUrl(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(INVISIBLE_UNICODE_REGEX, "")
    .trim()
    .replace(/\s+/g, "");
}