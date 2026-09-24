// Site-wide constants shared by server and client components.
// Values can be overridden with environment variables without code changes.
export const GITHUB_USERNAME =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME || "mynamethiris";

export const SITE_NAME = "Thiris";
export const SITE_OWNER = "Favian Zufar Niardi";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mynamethiris.github.io";

export const THEME_COLOR = "#0a0a0a";

export const contacts = [
  {
    platform: "GitHub",
    url: `https://github.com/${GITHUB_USERNAME}`,
    username: GITHUB_USERNAME,
  },
  {
    platform: "YouTube",
    url: `https://youtube.com/@${GITHUB_USERNAME}`,
    username: `@${GITHUB_USERNAME}`,
  },
  {
    platform: "Telegram",
    url: `https://t.me/${GITHUB_USERNAME}`,
    username: `@${GITHUB_USERNAME}`,
  },
] as const;
