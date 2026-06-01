import type { ArchivePayload, MuseumProject } from "@/types/project";

const now = new Date().toISOString();

export const fallbackProjects: MuseumProject[] = [
  {
    id: "tasklyn",
    name: "Tasklyn",
    slug: "tasklyn",
    description: "A productivity command center for students and small teams with clean planning, deadlines, workspace flow, and focused task rituals.",
    url: "https://github.com/chandafa/tasklyn",
    homepage: "",
    language: "TypeScript",
    topics: ["productivity", "dashboard", "workspace", "student"],
    stars: 12,
    forks: 2,
    watchers: 4,
    openIssues: 0,
    license: "MIT",
    createdAt: "2025-05-01T00:00:00.000Z",
    updatedAt: now,
    pushedAt: now,
    archived: false,
    fork: false,
    private: false,
    defaultBranch: "main",
    category: "Productivity",
    status: "Active",
    score: 92,
    accent: "#d7ff58"
  },
  {
    id: "chanxos",
    name: "ChanxOS",
    slug: "chanxos",
    description: "A clean Linux-based operating system concept with liquid glass visual direction, custom wallpaper, branding, and desktop experience.",
    url: "https://github.com/chandafa/chanxOS",
    homepage: "",
    language: "Shell",
    topics: ["linux", "os", "desktop", "branding"],
    stars: 8,
    forks: 1,
    watchers: 3,
    openIssues: 0,
    license: null,
    createdAt: "2025-05-31T00:00:00.000Z",
    updatedAt: now,
    pushedAt: now,
    archived: false,
    fork: false,
    private: false,
    defaultBranch: "main",
    category: "Operating System",
    status: "Active",
    score: 88,
    accent: "#80f7ff"
  },
  {
    id: "e-course-api",
    name: "E-Course API",
    slug: "e-course-api",
    description: "A role-based learning platform backend with courses, lessons, quizzes, enrollment, progress tracking, and certificate logic.",
    url: "https://github.com/chandafa/e-course-api",
    homepage: "",
    language: "Go",
    topics: ["e-learning", "api", "mysql", "backend"],
    stars: 17,
    forks: 4,
    watchers: 6,
    openIssues: 2,
    license: "MIT",
    createdAt: "2025-04-18T00:00:00.000Z",
    updatedAt: "2026-05-20T00:00:00.000Z",
    pushedAt: "2026-05-20T00:00:00.000Z",
    archived: false,
    fork: false,
    private: false,
    defaultBranch: "main",
    category: "Education",
    status: "Maintained",
    score: 84,
    accent: "#ff7144"
  },
  {
    id: "pixel-office-manager",
    name: "Pixel Office Manager",
    slug: "pixel-office-manager",
    description: "A cozy office simulation concept with missions, NPC dialogue, coins, furniture upgrades, and top-down pixel art production notes.",
    url: "https://github.com/chandafa/pixel-office-manager",
    homepage: "",
    language: "C#",
    topics: ["pixel-art", "simulation", "unity", "gdd"],
    stars: 21,
    forks: 3,
    watchers: 8,
    openIssues: 1,
    license: null,
    createdAt: "2026-05-18T00:00:00.000Z",
    updatedAt: "2026-05-27T00:00:00.000Z",
    pushedAt: "2026-05-27T00:00:00.000Z",
    archived: false,
    fork: false,
    private: false,
    defaultBranch: "main",
    category: "Concept Archive",
    status: "Active",
    score: 90,
    accent: "#f4f0e8"
  }
];

export function fallbackArchive(message = "Using curated fallback data. Add a GitHub username to sync live repositories."): ArchivePayload {
  const languages = new Set(fallbackProjects.map((project) => project.language).filter(Boolean));
  const topics = new Set(fallbackProjects.flatMap((project) => project.topics));

  return {
    owner: {
      login: "chandafa",
      name: process.env.NEXT_PUBLIC_OWNER_NAME || "Candra Kirana",
      avatarUrl: "https://github.com/identicons/chandafa.png",
      bio: "Creative Developer crafting immersive web systems, product interfaces, and digital experiments.",
      htmlUrl: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/chandafa",
      publicRepos: fallbackProjects.length,
      followers: 0,
      following: 0
    },
    projects: fallbackProjects,
    stats: {
      total: fallbackProjects.length,
      active: fallbackProjects.filter((project) => project.status === "Active").length,
      languages: languages.size,
      stars: fallbackProjects.reduce((total, project) => total + project.stars, 0),
      forks: fallbackProjects.reduce((total, project) => total + project.forks, 0),
      topics: topics.size
    },
    generatedAt: new Date().toISOString(),
    source: "fallback",
    message
  };
}
