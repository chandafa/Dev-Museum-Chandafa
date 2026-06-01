export type ArchiveStatus = "Active" | "Maintained" | "Dormant" | "Archived";

export type MuseumProject = {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  url: string;
  homepage?: string | null;
  language?: string | null;
  topics: string[];
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  license?: string | null;
  createdAt: string;
  updatedAt: string;
  pushedAt?: string | null;
  archived: boolean;
  fork: boolean;
  private: boolean;
  defaultBranch: string;
  category: string;
  status: ArchiveStatus;
  score: number;
  accent: string;
};

export type GitHubOwner = {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
};

export type ArchivePayload = {
  owner: GitHubOwner;
  projects: MuseumProject[];
  stats: {
    total: number;
    active: number;
    languages: number;
    stars: number;
    forks: number;
    topics: number;
  };
  generatedAt: string;
  source: "github" | "fallback";
  message?: string;
};
