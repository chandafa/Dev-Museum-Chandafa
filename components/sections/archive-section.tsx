"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import type { ArchiveStatus, MuseumProject } from "@/types/project";
import { formatDate, timeAgo } from "@/lib/utils";
import { CleanSelect } from "@/components/ui/clean-select";

const all = "All";
const statusOptions: Array<ArchiveStatus | "All"> = ["All", "Active", "Maintained", "Dormant", "Archived"];

type SortMode = "score" | "updated" | "name";

function roomLabel(label: string, count: number) {
  if (label === all) return `All rooms · ${count}`;

  const compact: Record<string, string> = {
    "Creative System": "Creative",
    "Backend Lab": "Backend",
    Education: "Education",
    "Operating System": "OS",
    "Game Archive": "Game",
    Productivity: "Productivity",
    Experiment: "Experiment",
    Mobile: "Mobile",
    "Concept Archive": "Concept"
  };

  return `${compact[label] || label} · ${count}`;
}

export function ArchiveSection({ projects, source, message }: { projects: MuseumProject[]; source: "github" | "fallback"; message?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(all);
  const [status, setStatus] = useState<ArchiveStatus | "All">(all);
  const [sort, setSort] = useState<SortMode>("score");
  const [showAll, setShowAll] = useState(false);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((project) => counts.set(project.category, (counts.get(project.category) ?? 0) + 1));
    return [all, ...[...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name)];
  }, [projects]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>([[all, projects.length]]);
    projects.forEach((project) => counts.set(project.category, (counts.get(project.category) ?? 0) + 1));
    return counts;
  }, [projects]);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();

    return projects
      .filter((project) => {
        const matchesCategory = category === all || project.category === category;
        const matchesStatus = status === all || project.status === status;
        const text = `${project.name} ${project.description} ${project.language} ${project.topics.join(" ")} ${project.category}`.toLowerCase();
        const matchesSearch = !normalized || text.includes(normalized);
        return matchesCategory && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "updated") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        if (sort === "name") return a.name.localeCompare(b.name);
        return b.score - a.score;
      });
  }, [category, projects, query, sort, status]);

  const visibleProjects = showAll ? filtered : filtered.slice(0, 6);
  const hiddenCount = Math.max(filtered.length - visibleProjects.length, 0);

  return (
    <section id="archive" data-room="Archive" className="museum-room relative px-6 py-14 sm:px-8 md:px-10 md:py-16 lg:px-0">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-museum-line/20 to-transparent" />
      <div className="mx-auto max-w-[960px]">
        <div className="grid gap-5 lg:grid-cols-[0.6fr_1fr] lg:items-end">
          <div>
            <p className="mb-2.5 text-[0.62rem] uppercase tracking-[0.28em] text-museum-acid">Archive / 002</p>
            <h2 className="text-balance text-3xl font-semibold leading-[0.94] tracking-[-0.075em] text-museum-paper md:text-4xl">
              Repository artifacts with X-Ray inspection.
            </h2>
          </div>
          <div className="max-w-[30rem] text-xs leading-6 text-museum-muted md:text-sm">
            <p>
              Cards no longer jump on hover. They switch into X-Ray mode, revealing metadata layers, condition signals, and repository fingerprints without making the layout noisy.
            </p>
            {source === "fallback" && message ? (
              <p className="mt-3 rounded-2xl border border-museum-ember/30 bg-museum-ember/10 p-3 text-xs text-museum-paper">{message}</p>
            ) : null}
          </div>
        </div>

        <div className="sticky top-20 z-20 mt-7 rounded-[1.15rem] border border-museum-line/10 bg-museum-ink/70 p-2 backdrop-blur-2xl">
          <div className="grid gap-2 lg:grid-cols-[1fr_0.9fr]">
            <label className="flex h-9 min-w-0 items-center gap-2 rounded-full border border-museum-line/10 bg-museum-paper/[0.04] px-3 text-museum-muted transition-colors focus-within:border-museum-acid/40 focus-within:bg-museum-paper/[0.07]">
              <Search className="size-3.5 shrink-0" />
              <input
                value={query}
                onChange={(event) => { setQuery(event.target.value); setShowAll(false); }}
                placeholder="Search repo, stack, topic..."
                className="w-full min-w-0 bg-transparent text-[0.68rem] text-museum-paper outline-none placeholder:text-museum-muted"
              />
            </label>

            <div className="grid grid-cols-3 gap-1.5">
              <CleanSelect
                value={category}
                onChange={(value) => { setCategory(value); setShowAll(false); }}
                label="Filter by museum room"
                icon={<SlidersHorizontal className="size-3" />}
                options={categories.map((item) => ({ value: item, label: roomLabel(item, categoryCounts.get(item) ?? 0) }))}
              />

              <CleanSelect
                value={status}
                onChange={(value) => { setStatus(value as ArchiveStatus | "All"); setShowAll(false); }}
                label="Filter by status"
                options={statusOptions.map((item) => ({ value: item, label: item }))}
              />

              <CleanSelect
                value={sort}
                onChange={(value) => setSort(value as SortMode)}
                label="Sort projects"
                options={[
                  { value: "score", label: "Score" },
                  { value: "updated", label: "Latest" },
                  { value: "name", label: "A-Z" }
                ]}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {filtered.length > 6 ? (
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="group inline-flex items-center gap-2 rounded-full border border-museum-line/15 bg-museum-paper/[0.04] px-4 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-museum-paper backdrop-blur-xl transition-colors hover:bg-museum-paper/10"
            >
              {showAll ? "Show less" : `Other projects (${hiddenCount})`}
              <ArrowDown className={`size-3.5 transition-transform duration-500 ${showAll ? "rotate-180" : "group-hover:translate-y-1"}`} />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: MuseumProject; index: number }) {
  const hasReadmeSignal = project.description && !project.description.toLowerCase().includes("no description");
  const health = [
    { label: "Label", ok: hasReadmeSignal },
    { label: "Topics", ok: project.topics.length > 0 },
    { label: "Demo", ok: Boolean(project.homepage) },
    { label: "License", ok: Boolean(project.license) }
  ];

  return (
    <motion.article
      initial={{ y: 26, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.03, 0.2), ease: [0.16, 1, 0.3, 1] }}
      className="xray-card group relative min-h-[252px] overflow-hidden rounded-[1.15rem] border border-museum-line/10 bg-museum-paper/[0.04] p-3.5 shadow-glass backdrop-blur-xl"
    >
      <div className="xray-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${project.accent}24, transparent 48%)` }} />
      <div className="xray-scan" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-2 flex flex-wrap gap-1.5">
                <span className="rounded-full border border-museum-line/10 px-2 py-0.5 text-[0.48rem] uppercase tracking-[0.13em] text-museum-muted">{project.category}</span>
                <span className="rounded-full px-2 py-0.5 text-[0.48rem] uppercase tracking-[0.13em] text-museum-ink" style={{ backgroundColor: project.accent }}>{project.status}</span>
              </div>
              <h3 className="text-[1.08rem] font-semibold tracking-[-0.075em] text-museum-paper">{project.name}</h3>
            </div>
            <a href={project.url} target="_blank" rel="noreferrer" className="grid size-7 shrink-0 place-items-center rounded-full border border-museum-line/10 text-museum-paper transition-colors hover:bg-museum-paper/10" aria-label={`Open ${project.name} on GitHub`}>
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          <p className="mt-2.5 line-clamp-3 text-[0.72rem] leading-5 text-museum-muted">{project.description}</p>

          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {project.language ? <span className="rounded-full bg-museum-paper/10 px-2 py-0.5 text-[0.62rem] text-museum-paper">{project.language}</span> : null}
            {project.topics.slice(0, 3).map((topic) => (
              <span key={topic} className="rounded-full border border-museum-line/10 px-2 py-0.5 text-[0.62rem] text-museum-muted">#{topic}</span>
            ))}
          </div>

          <div className="xray-layer mt-3 rounded-[0.95rem] border border-museum-cyan/20 bg-museum-cyan/[0.05] p-2.5">
            <div className="mb-2 flex items-center justify-between text-[0.48rem] uppercase tracking-[0.15em] text-museum-cyan">
              <span>X-Ray scan</span>
              <span>{project.score}%</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {health.map((item) => (
                <span key={item.label} className="flex items-center justify-between rounded-full border border-museum-line/10 px-2 py-1 text-[0.52rem] uppercase tracking-[0.1em] text-museum-muted">
                  {item.label}
                  <b className={item.ok ? "text-museum-acid" : "text-museum-ember"}>{item.ok ? "OK" : "MISS"}</b>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-museum-line/10 pt-3">
          <div className="mb-2.5 flex items-center justify-between text-[0.52rem] uppercase tracking-[0.15em] text-museum-muted">
            <span>Showcase score</span>
            <span className="text-museum-paper">{project.score}/100</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-museum-paper/10">
            <div className="h-full rounded-full" style={{ width: `${project.score}%`, backgroundColor: project.accent }} />
          </div>
          <div className="mt-2.5 grid grid-cols-3 gap-2 text-[0.6rem] text-museum-muted">
            <span>★ {project.stars}</span>
            <span>⑂ {project.forks}</span>
            <span>{timeAgo(project.updatedAt)}</span>
          </div>
          <p className="mt-2.5 text-[0.6rem] text-museum-muted">Updated {formatDate(project.updatedAt)}</p>
        </div>
      </div>
    </motion.article>
  );
}
