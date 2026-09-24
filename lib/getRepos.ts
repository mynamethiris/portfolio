// GitHub repository fetching with embeddability check for live previews.
import { GITHUB_USERNAME } from "./site";

export interface Repo {
  id: number;
  name: string;
  description: string;
  language: string;
  url: string;
  homepage: string;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
  // true when the homepage allows iframe embedding (not blocked by X-Frame-Options / CSP).
  // Checked automatically at build time, never set manually.
  embeddable: boolean;
}

export interface GitHubProfile {
  avatar_url?: string;
  bio?: string | null;
  followers?: number;
  following?: number;
  public_repos?: number;
}

const GITHUB_API = "https://api.github.com";
const FETCH_TIMEOUT_MS = 8000;
const EMBED_CHECK_TIMEOUT_MS = 3500;

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "User-Agent": "portfolio-builder",
    Accept: "application/vnd.github+json",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// Fetch with a timeout so a hanging upstream cannot block the page forever.
async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toRepo(raw: unknown): Repo | null {
  if (!isRecord(raw)) return null;
  const id = raw.id;
  const name = raw.name;
  const htmlUrl = raw.html_url;
  if (typeof id !== "number" || typeof name !== "string" || typeof htmlUrl !== "string") {
    return null;
  }
  const homepage = typeof raw.homepage === "string" ? raw.homepage.trim() : "";
  const topics = Array.isArray(raw.topics)
    ? raw.topics.filter((t): t is string => typeof t === "string")
    : [];
  return {
    id,
    name,
    description: typeof raw.description === "string" ? raw.description : "",
    language: typeof raw.language === "string" ? raw.language : "",
    url: htmlUrl,
    homepage,
    stars: typeof raw.stargazers_count === "number" ? raw.stargazers_count : 0,
    forks: typeof raw.forks_count === "number" ? raw.forks_count : 0,
    topics,
    updatedAt: typeof raw.updated_at === "string" ? raw.updated_at : "",
    embeddable: false,
  };
}

// Check whether a URL allows iframe embedding by reading response headers.
// Fail-closed: timeout, network error, or a method rejection means "not
// embeddable", so the UI falls back to a screenshot instead of a dead iframe.
async function isEmbeddable(url: string): Promise<boolean> {
  try {
    let res: Response;
    try {
      res = await fetchWithTimeout(
        url,
        { method: "HEAD", redirect: "follow", headers: { "User-Agent": "portfolio-builder" } },
        EMBED_CHECK_TIMEOUT_MS
      );
    } catch {
      return false;
    }
    // Some servers reject HEAD (405/501). Retry once with a ranged GET.
    if (res.status === 405 || res.status === 501) {
      try {
        res = await fetchWithTimeout(
          url,
          {
            method: "GET",
            redirect: "follow",
            headers: { "User-Agent": "portfolio-builder", Range: "bytes=0-0" },
          },
          EMBED_CHECK_TIMEOUT_MS
        );
      } catch {
        return false;
      }
    }
    if (!res.ok && res.status !== 206) return false;

    const xfo = (res.headers.get("x-frame-options") || "").toLowerCase();
    if (xfo.includes("deny") || xfo.includes("sameorigin")) return false;

    const csp = res.headers.get("content-security-policy") || "";
    const match = csp.match(/frame-ancestors([^;]*)/i);
    if (match) {
      const value = match[1].trim().toLowerCase();
      if (!value || value === "'none'") return false;
      const allowsAnyone =
        value.includes("*") || value.includes("https:") || value.includes("http:");
      if (!allowsAnyone) return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Fetch public repositories, newest first. Returns [] on any failure.
export async function getRepos(): Promise<Repo[]> {
  try {
    const res = await fetchWithTimeout(
      `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`,
      { headers: buildHeaders(), next: { revalidate: 3600 } },
      FETCH_TIMEOUT_MS
    );

    if (res.status === 403 || res.status === 429) {
      console.warn(`[getRepos] GitHub rate limit hit (status ${res.status}).`);
      return [];
    }
    if (!res.ok) {
      console.warn(`[getRepos] GitHub API responded with status ${res.status}.`);
      return [];
    }

    const data: unknown = await res.json();
    if (!Array.isArray(data)) {
      console.warn("[getRepos] Unexpected GitHub API response shape.");
      return [];
    }

    const filtered = data.filter(
      (r): r is Record<string, unknown> =>
        isRecord(r) && r.fork !== true && r.name !== GITHUB_USERNAME
    );

    return await Promise.all(
      filtered.map(async (r) => {
        const repo = toRepo(r);
        if (!repo) return null;
        repo.embeddable = repo.homepage.startsWith("http")
          ? await isEmbeddable(repo.homepage)
          : false;
        return repo;
      })
    ).then((repos) => repos.filter((r): r is Repo => r !== null));
  } catch (err) {
    console.warn("[getRepos] Failed to fetch repositories:", err);
    return [];
  }
}

// Fetch the public GitHub profile. Returns null on any failure.
export async function getGitHubProfile(): Promise<GitHubProfile | null> {
  try {
    const res = await fetchWithTimeout(
      `${GITHUB_API}/users/${GITHUB_USERNAME}`,
      { headers: buildHeaders(), next: { revalidate: 3600 } },
      FETCH_TIMEOUT_MS
    );

    if (!res.ok) {
      console.warn(`[getGitHubProfile] GitHub API responded with status ${res.status}.`);
      return null;
    }

    const data: unknown = await res.json();
    if (!isRecord(data)) return null;
    return {
      avatar_url: typeof data.avatar_url === "string" ? data.avatar_url : undefined,
      bio: typeof data.bio === "string" ? data.bio : null,
      followers: typeof data.followers === "number" ? data.followers : 0,
      following: typeof data.following === "number" ? data.following : 0,
      public_repos: typeof data.public_repos === "number" ? data.public_repos : 0,
    };
  } catch (err) {
    console.warn("[getGitHubProfile] Failed to fetch profile:", err);
    return null;
  }
}
