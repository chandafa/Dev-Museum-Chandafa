"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowUpRight, Film, Play, Radio, Search, SlidersHorizontal, X } from "lucide-react";
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
  const [focusedId, setFocusedId] = useState<MuseumProject["id"] | null>(null);
  const [trailerProject, setTrailerProject] = useState<MuseumProject | null>(null);
  const [xrayProjectId, setXrayProjectId] = useState<MuseumProject["id"] | null>(null);
  const [sorting, setSorting] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

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

  useEffect(() => {
    setSorting(true);
    setAnimationKey((value) => value + 1);
    const timer = window.setTimeout(() => setSorting(false), 560);
    return () => window.clearTimeout(timer);
  }, [category, status, sort, query]);

  const visibleProjects = showAll ? filtered : filtered.slice(0, 6);
  const hiddenCount = Math.max(filtered.length - visibleProjects.length, 0);

  return (
    <section id="archive" data-room="Archive" className="museum-room relative px-6 py-14 sm:px-8 md:px-10 md:py-16 lg:px-0">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-museum-line/20 to-transparent" />
      <div className="mx-auto max-w-[960px]">
        <div className="grid gap-5 lg:grid-cols-[0.6fr_1fr] lg:items-end">
          <div>
            <p className="mb-2.5 text-[0.62rem] uppercase tracking-[0.28em] text-museum-acid">Archive / 002</p>
            <h2 className="text-balance text-2xl font-semibold leading-[0.94] tracking-[-0.075em] text-museum-paper sm:text-3xl md:text-4xl">
              Repository shelf with trailer previews.
            </h2>
          </div>
          <div className="max-w-[30rem] text-xs leading-6 text-museum-muted md:text-sm">
            <p>
              Filter changes now run through a sorting ritual, cards slide in like shelves, hover runs a quick scanline, click opens X-Ray metadata, and each repository can play a short cinematic trailer generated from GitHub metadata.
            </p>
            {source === "fallback" && message ? (
              <p className="mt-3 rounded-2xl border border-museum-ember/30 bg-museum-ember/10 p-3 text-xs text-museum-paper">{message}</p>
            ) : null}
          </div>
        </div>

        <div className="sticky top-20 z-20 mt-7 rounded-[1.15rem] border border-museum-line/10 bg-museum-ink/70 p-2 backdrop-blur-2xl">
          <AnimatePresence>
            {sorting ? (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="sorting-ritual absolute -top-10 left-4 right-4 overflow-hidden rounded-full border border-museum-acid/20 bg-museum-ink/90 px-4 py-2 text-[0.52rem] uppercase tracking-[0.18em] text-museum-acid shadow-glass backdrop-blur-xl"
              >
                <span className="relative z-10">Re-indexing artifacts · sorting archive · {filtered.length} matched</span>
              </motion.div>
            ) : null}
          </AnimatePresence>

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

            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
              <CleanSelect
                value={category}
                onChange={(value) => { setCategory(value); setShowAll(false); }}
                label="Museum room"
                icon={<SlidersHorizontal className="size-3" />}
                options={categories.map((item) => ({ value: item, label: roomLabel(item, categoryCounts.get(item) ?? 0) }))}
              />

              <CleanSelect
                value={status}
                onChange={(value) => { setStatus(value as ArchiveStatus | "All"); setShowAll(false); }}
                label="Status"
                options={statusOptions.map((item) => ({ value: item, label: item }))}
              />

              <CleanSelect
                value={sort}
                onChange={(value) => setSort(value as SortMode)}
                label="Sort"
                options={[
                  { value: "score", label: "Score" },
                  { value: "updated", label: "Latest" },
                  { value: "name", label: "A-Z" }
                ]}
              />
            </div>
          </div>
        </div>

        <motion.div
          key={animationKey}
          className="repo-focus-grid mt-6 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3"
          onMouseLeave={() => setFocusedId(null)}
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.055 } }, hidden: {} }}
        >
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              focusedId={focusedId}
              onFocus={setFocusedId}
              xrayActive={xrayProjectId === project.id}
              onToggleXray={() => setXrayProjectId((value) => (value === project.id ? null : project.id))}
              onTrailer={setTrailerProject}
            />
          ))}
        </motion.div>

        {filtered.length > 6 ? (
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="mechanical-button group inline-flex items-center gap-2 rounded-full border border-museum-line/15 bg-museum-paper/[0.04] px-4 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-museum-paper backdrop-blur-xl transition-colors hover:bg-museum-paper/10"
            >
              {showAll ? "Show less" : `Other projects (${hiddenCount})`}
              <ArrowDown className={`size-3.5 transition-transform duration-500 ${showAll ? "rotate-180" : "group-hover:translate-y-1"}`} />
            </button>
          </div>
        ) : null}
      </div>

      <ProjectTrailerModal project={trailerProject} onClose={() => setTrailerProject(null)} />
    </section>
  );
}

function ProjectCard({
  project,
  index,
  focusedId,
  onFocus,
  xrayActive,
  onToggleXray,
  onTrailer
}: {
  project: MuseumProject;
  index: number;
  focusedId: MuseumProject["id"] | null;
  xrayActive: boolean;
  onFocus: (id: MuseumProject["id"] | null) => void;
  onToggleXray: () => void;
  onTrailer: (project: MuseumProject) => void;
}) {
  const hasReadmeSignal = project.description && !project.description.toLowerCase().includes("no description");
  const dimmed = focusedId !== null && focusedId !== project.id;
  const health = [
    { label: "Label", ok: hasReadmeSignal },
    { label: "Topics", ok: project.topics.length > 0 },
    { label: "Demo", ok: Boolean(project.homepage) },
    { label: "License", ok: Boolean(project.license) }
  ];

  return (
    <motion.article
      variants={{
        hidden: { x: index % 2 === 0 ? -34 : 34, opacity: 0, rotateY: index % 2 === 0 ? -7 : 7, filter: "blur(8px)" },
        show: { x: 0, opacity: dimmed ? 0.34 : 1, rotateY: 0, filter: dimmed ? "blur(2px)" : "blur(0px)" }
      }}
      transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => onFocus(project.id)}
      onFocus={() => onFocus(project.id)}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("a,button")) return;
        onToggleXray();
      }}
      className={`museum-shelf-card xray-card group relative min-h-[256px] cursor-pointer overflow-hidden rounded-[1.15rem] border border-museum-line/10 bg-museum-paper/[0.04] p-3.5 shadow-glass backdrop-blur-xl ${xrayActive ? "is-xray-active" : ""} ${dimmed ? "pointer-events-auto" : ""}`}
    >
      <div className="shelf-slot" />
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
            <a href={project.url} target="_blank" rel="noreferrer" className="mechanical-button grid size-7 shrink-0 place-items-center rounded-full border border-museum-line/10 text-museum-paper transition-colors hover:bg-museum-paper/10" aria-label={`Open ${project.name} on GitHub`}>
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
              <span>X-Ray scan / click locked</span>
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
          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="truncate text-[0.6rem] text-museum-muted">{xrayActive ? "X-Ray opened" : "Click card for X-Ray"}</p>
            <button
              type="button"
              onClick={() => onTrailer(project)}
              className="mechanical-button inline-flex shrink-0 items-center gap-1.5 rounded-full border border-museum-line/10 px-2.5 py-1.5 text-[0.52rem] uppercase tracking-[0.12em] text-museum-paper transition-colors hover:bg-museum-paper/10"
            >
              <Play className="size-3" /> Trailer
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectTrailerModal({ project, onClose }: { project: MuseumProject | null; onClose: () => void }) {
  const frames = project
    ? [
        { label: "Artifact", value: project.name },
        { label: "Primary material", value: project.language || "Unknown stack" },
        { label: "Condition", value: project.status },
        { label: "Museum grade", value: `${project.score}/100` }
      ]
    : [];

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          className="fixed inset-0 z-[85] grid place-items-center bg-museum-ink/70 p-4 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ y: 26, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 18, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[780px] overflow-hidden rounded-[1.6rem] border border-museum-line/15 bg-[var(--background)] shadow-glass"
          >
            <div className="trailer-scanline" />
            <div className="relative z-10 grid gap-0 md:grid-cols-[1fr_0.78fr]">
              <div className="min-h-[360px] border-b border-museum-line/10 p-5 md:border-b-0 md:border-r md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border border-museum-acid/25 px-3 py-1 text-[0.52rem] uppercase tracking-[0.18em] text-museum-acid"><Film className="size-3" /> Project trailer</span>
                  <button onClick={onClose} className="mechanical-button grid size-8 place-items-center rounded-full border border-museum-line/10 text-museum-paper hover:bg-museum-paper/10" aria-label="Close trailer"><X className="size-4" /></button>
                </div>

                <div className="flex min-h-[260px] flex-col justify-end rounded-[1.2rem] border border-museum-line/10 bg-museum-paper/[0.035] p-5">
                  <motion.p
                    className="text-[0.58rem] uppercase tracking-[0.2em] text-museum-muted"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0, 1, 1], y: 0 }}
                    transition={{ duration: 1.4 }}
                  >
                    Now presenting
                  </motion.p>
                  <motion.h3
                    className="mt-3 text-4xl font-semibold leading-[0.9] tracking-[-0.09em] text-museum-paper md:text-6xl"
                    initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {project.name}
                  </motion.h3>
                  <motion.p
                    className="mt-4 max-w-[30rem] text-sm leading-6 text-museum-muted"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.7 }}
                  >
                    {project.description}
                  </motion.p>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <div className="mb-4 flex items-center gap-2 text-[0.56rem] uppercase tracking-[0.18em] text-museum-muted"><Radio className="size-3.5 text-museum-acid" /> Metadata sequence</div>
                <div className="space-y-2.5">
                  {frames.map((frame, index) => (
                    <motion.div
                      key={frame.label}
                      initial={{ x: 22, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.18, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="rounded-[1rem] border border-museum-line/10 bg-museum-paper/[0.04] p-3"
                    >
                      <p className="text-[0.5rem] uppercase tracking-[0.16em] text-museum-muted">{frame.label}</p>
                      <p className="mt-1 truncate text-base font-semibold tracking-[-0.055em] text-museum-paper">{frame.value}</p>
                    </motion.div>
                  ))}
                </div>
                <a href={project.url} target="_blank" rel="noreferrer" className="mechanical-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-museum-paper px-4 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-museum-ink">
                  Open artifact <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
