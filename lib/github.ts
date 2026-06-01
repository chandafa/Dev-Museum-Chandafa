import { fallbackArchive } from "@/lib/fallback";
import { slugify } from "@/lib/utils";
import type { ArchivePayload, ArchiveStatus, MuseumProject } from "@/types/project";

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  license: { spdx_id: string; name: string } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  archived: boolean;
  fork: boolean;
  private: boolean;
  default_branch: string;
};

type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
};

const LANGUAGE_ACCENTS: Record<string, string> = {
  TypeScript: "#80f7ff",
  JavaScript: "#d7ff58",
  PHP: "#a78bfa",
  Go: "#6ee7f9",
  Rust: "#ff7144",
  Java: "#fbbf24",
  Python: "#86efac",
  Shell: "#f4f0e8",
  CSS: "#fb7185",
  HTML: "#ff7144",
  C: "#93c5fd",
  "C#": "#c084fc"
};

function requestHeaders() {
  const token = process.env.GITHUB_TOKEN;

  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "dev-museum-showcase",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

function resolveUsername() {
  return process.env.GITHUB_USERNAME || process.env.NEXT_PUBLIC_GITHUB_USERNAME || "chandafa";
}

function detectCategory(repo: GitHubRepo) {
  const text = `${repo.name} ${repo.description ?? ""} ${(repo.topics ?? []).join(" ")} ${repo.language ?? ""}`.toLowerCase();

  if (text.match(/course|learning|lesson|quiz|education|cbt|school|student/)) return "Education";
  if (text.match(/task|productivity|kanban|workspace|planner|todo/)) return "Productivity";
  if (text.match(/os|linux|desktop|kernel|iso|distro/)) return "Operating System";
  if (text.match(/portfolio|showcase|museum|archive|visual|brand|design/)) return "Creative System";
  if (text.match(/api|backend|fiber|laravel|spring|mysql|auth/)) return "Backend Lab";
  if (text.match(/mobile|flutter|android|expo|react-native/)) return "Mobile";
  if (text.match(/game|pixel|unity|godot|simulation/)) return "Game Archive";
  return "Experiment";
}

function getStatus(repo: GitHubRepo): ArchiveStatus {
  if (repo.archived) return "Archived";

  const updated = new Date(repo.pushed_at ?? repo.updated_at).getTime();
  const days = (Date.now() - updated) / 86400000;

  if (days <= 90) return "Active";
  if (days <= 365) return "Maintained";
  return "Dormant";
}

function getScore(repo: GitHubRepo) {
  let score = 35;
  if (repo.description) score += 15;
  if (repo.homepage) score += 12;
  if ((repo.topics ?? []).length >= 3) score += 12;
  if (repo.stargazers_count > 0) score += Math.min(10, repo.stargazers_count);
  if (repo.forks_count > 0) score += Math.min(6, repo.forks_count * 2);
  if (repo.license) score += 5;

  const updated = new Date(repo.pushed_at ?? repo.updated_at).getTime();
  const days = (Date.now() - updated) / 86400000;
  if (days <= 30) score += 15;
  else if (days <= 90) score += 10;
  else if (days <= 365) score += 5;

  if (repo.archived) score -= 20;
  if (repo.fork) score -= 8;

  return Math.max(20, Math.min(100, Math.round(score)));
}

function transformRepo(repo: GitHubRepo): MuseumProject {
  const category = detectCategory(repo);
  const status = getStatus(repo);

  return {
    id: repo.id,
    name: repo.name,
    slug: slugify(repo.name),
    description: repo.description || "No description yet. This repository is still waiting for its museum label.",
    url: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    topics: repo.topics ?? [],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.watchers_count,
    openIssues: repo.open_issues_count,
    license: repo.license?.spdx_id || repo.license?.name || null,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    archived: repo.archived,
    fork: repo.fork,
    private: repo.private,
    defaultBranch: repo.default_branch,
    category,
    status,
    score: getScore(repo),
    accent: repo.language ? LANGUAGE_ACCENTS[repo.language] ?? "#d7ff58" : "#f4f0e8"
  };
}

export async function getGithubArchive(): Promise<ArchivePayload> {
  const username = resolveUsername();
  const headers = requestHeaders();

  try {
    const [userResponse, repoResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers,
        next: { revalidate: 300 }
      }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100`, {
        headers,
        next: { revalidate: 300 }
      })
    ]);

    if (!userResponse.ok || !repoResponse.ok) {
      return fallbackArchive(`GitHub sync failed for @${username}. Check username or token, then reload.`);
    }

    const user = (await userResponse.json()) as GitHubUser;
    const repos = (await repoResponse.json()) as GitHubRepo[];

    const projects = repos
      .filter((repo) => !repo.private)
      .map(transformRepo)
      .sort((a, b) => {
        const scoreDiff = b.score - a.score;
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

    const languages = new Set(projects.map((project) => project.language).filter(Boolean));
    const topics = new Set(projects.flatMap((project) => project.topics));

    return {
      owner: {
        login: user.login,
        name: user.name || process.env.NEXT_PUBLIC_OWNER_NAME || user.login,
        avatarUrl: user.avatar_url,
        bio: user.bio || "Creative Developer crafting immersive web systems, experiments, and product interfaces.",
        htmlUrl: user.html_url,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following
      },
      projects,
      stats: {
        total: projects.length,
        active: projects.filter((project) => project.status === "Active").length,
        languages: languages.size,
        stars: projects.reduce((total, project) => total + project.stars, 0),
        forks: projects.reduce((total, project) => total + project.forks, 0),
        topics: topics.size
      },
      generatedAt: new Date().toISOString(),
      source: "github"
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown GitHub sync error.";
    return fallbackArchive(message);
  }
}
