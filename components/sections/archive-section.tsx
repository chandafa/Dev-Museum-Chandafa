"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowUpRight, Film, Play, Radar, Radio, RefreshCcw, Search, SlidersHorizontal, X } from "lucide-react";
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
  const [cataloging, setCataloging] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setCataloging(false), 720);
    return () => window.clearTimeout(timer);
  }, []);

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
    if (cataloging) return;
    setSorting(true);
    setAnimationKey((value) => value + 1);
    setXrayProjectId(null);
    const timer = window.setTimeout(() => setSorting(false), 560);
    return () => window.clearTimeout(timer);
  }, [category, status, sort, query, cataloging]);

  const visibleProjects = showAll ? filtered : filtered.slice(0, 6);
  const hiddenCount = Math.max(filtered.length - visibleProjects.length, 0);

  const resetFilters = () => {
    setQuery("");
    setCategory(all);
    setStatus(all);
    setSort("score");
    setShowAll(false);
    setXrayProjectId(null);
  };

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
              Filter changes run through a sorting ritual, cards slide in like shelves, hover runs a quick scanline, click opens temporary X-Ray metadata, and every repository can play a longer cinematic trailer.
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

        {cataloging ? (
          <SkeletonMuseumGrid />
        ) : filtered.length === 0 ? (
          <SmartEmptyState query={query} onReset={resetFilters} />
        ) : (
          <motion.div
            key={animationKey}
            className="repo-focus-grid mt-6 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3"
            onMouseLeave={() => { setFocusedId(null); setXrayProjectId(null); }}
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
                onClearXray={() => setXrayProjectId(null)}
                onTrailer={setTrailerProject}
              />
            ))}
          </motion.div>
        )}

        {!cataloging && filtered.length > 6 ? (
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

function SkeletonMuseumGrid() {
  return (
    <div className="mt-6 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Cataloging archive artifacts">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="museum-skeleton-card relative min-h-[232px] overflow-hidden rounded-[1.15rem] border border-museum-line/10 bg-museum-paper/[0.035] p-3.5 shadow-glass backdrop-blur-xl"
        >
          <div className="skeleton-bar w-24" />
          <div className="mt-6 skeleton-title" />
          <div className="mt-3 skeleton-line w-[86%]" />
          <div className="mt-2 skeleton-line w-[62%]" />
          <div className="absolute bottom-4 left-3.5 right-3.5">
            <div className="skeleton-bar w-28" />
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-museum-paper/10">
              <div className="h-full w-1/2 rounded-full bg-museum-paper/20" />
            </div>
            <p className="mt-3 text-[0.52rem] uppercase tracking-[0.16em] text-museum-muted">Cataloging artifact...</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SmartEmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      className="smart-empty-state relative mt-6 overflow-hidden rounded-[1.25rem] border border-museum-line/10 bg-museum-paper/[0.04] p-6 text-center shadow-glass backdrop-blur-2xl"
    >
      <div className="smart-empty-radar mx-auto mb-5 grid size-28 place-items-center rounded-full border border-museum-line/10 bg-museum-ink/30">
        <Radar className="relative z-10 size-7 text-museum-acid" />
      </div>
      <p className="text-[0.58rem] uppercase tracking-[0.22em] text-museum-acid">No artifacts detected</p>
      <h3 className="mx-auto mt-2 max-w-lg text-2xl font-semibold tracking-[-0.075em] text-museum-paper">Try another signal frequency.</h3>
      <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-museum-muted">
        {query ? `The archive could not match “${query}”.` : "The current room, status, and sort combination returned nothing."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mechanical-button mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-museum-paper px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-museum-ink"
      >
        <RefreshCcw className="size-3.5" /> Reset archive signal
      </button>
    </motion.div>
  );
}

function ProjectCard({
  project,
  index,
  focusedId,
  onFocus,
  xrayActive,
  onToggleXray,
  onClearXray,
  onTrailer
}: {
  project: MuseumProject;
  index: number;
  focusedId: MuseumProject["id"] | null;
  xrayActive: boolean;
  onFocus: (id: MuseumProject["id"] | null) => void;
  onToggleXray: () => void;
  onClearXray: () => void;
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
      onMouseLeave={() => { onFocus(null); onClearXray(); }}
      onFocus={() => onFocus(project.id)}
      onBlur={onClearXray}
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
                <span className="artifact-label rounded-full border border-museum-line/10 px-2 py-0.5 text-[0.48rem] uppercase tracking-[0.13em] text-museum-muted">{project.category}</span>
                <span className="rounded-full px-2 py-0.5 text-[0.48rem] uppercase tracking-[0.13em] text-[#0d0e10]" style={{ backgroundColor: project.accent }}>{project.status}</span>
              </div>
              <h3 className="text-[1.08rem] font-semibold tracking-[-0.075em] text-museum-paper">{project.name}</h3>
            </div>
            <a href={project.url} target="_blank" rel="noreferrer" className="mechanical-button grid size-7 shrink-0 place-items-center rounded-full border border-museum-line/10 text-museum-paper transition-colors hover:bg-museum-paper/10" aria-label={`Open ${project.name} on GitHub`}>
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          <p className="mt-2.5 line-clamp-3 text-[0.72rem] leading-5 text-museum-muted">{project.description}</p>

          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {project.language ? <span className="artifact-label rounded-full bg-museum-paper/10 px-2 py-0.5 text-[0.62rem] text-museum-paper">{project.language}</span> : null}
            {project.topics.slice(0, 3).map((topic) => (
              <span key={topic} className="artifact-label rounded-full border border-museum-line/10 px-2 py-0.5 text-[0.62rem] text-museum-muted">#{topic}</span>
            ))}
          </div>

          <div className="xray-layer mt-3 rounded-[0.95rem] border border-museum-cyan/20 bg-museum-cyan/[0.05] p-2.5">
            <div className="mb-2 flex items-center justify-between text-[0.48rem] uppercase tracking-[0.15em] text-museum-cyan">
              <span>X-Ray scan / click locked</span>
              <span>{project.score}%</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {health.map((item) => (
                <span key={item.label} className="artifact-label flex items-center justify-between rounded-full border border-museum-line/10 px-2 py-1 text-[0.52rem] uppercase tracking-[0.1em] text-museum-muted">
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
            <p className="truncate text-[0.6rem] text-museum-muted">{xrayActive ? "X-Ray opened until pointer leaves" : "Click card for X-Ray"}</p>
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
        { label: "Last signal", value: formatDate(project.updatedAt) },
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
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[820px] overflow-hidden rounded-[1.6rem] border border-museum-line/15 bg-[var(--background)] shadow-glass"
          >
            <div className="trailer-cinema-bars" />
            <div className="trailer-scanline" />
            <div className="trailer-data-cuts" />
            <div className="relative z-10 grid gap-0 md:grid-cols-[1fr_0.78fr]">
              <div className="min-h-[390px] border-b border-museum-line/10 p-5 md:border-b-0 md:border-r md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border border-museum-acid/25 px-3 py-1 text-[0.52rem] uppercase tracking-[0.18em] text-museum-acid"><Film className="size-3" /> Project trailer</span>
                  <button onClick={onClose} className="mechanical-button grid size-8 place-items-center rounded-full border border-museum-line/10 text-museum-paper hover:bg-museum-paper/10" aria-label="Close trailer"><X className="size-4" /></button>
                </div>

                <div className="trailer-stage relative flex min-h-[282px] flex-col justify-end overflow-hidden rounded-[1.2rem] border border-museum-line/10 bg-museum-paper/[0.035] p-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(var(--museum-acid),0.14),transparent_36%),radial-gradient(circle_at_84%_70%,rgba(var(--museum-cyan),0.12),transparent_38%)]" />
                  <motion.p
                    className="relative z-10 text-[0.58rem] uppercase tracking-[0.2em] text-museum-muted"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0, 1, 1, 0.75], y: 0 }}
                    transition={{ duration: 2.4, times: [0, 0.24, 0.72, 1] }}
                  >
                    Now presenting
                  </motion.p>
                  <motion.h3
                    className="relative z-10 mt-3 text-4xl font-semibold leading-[0.9] tracking-[-0.09em] text-museum-paper md:text-6xl"
                    initial={{ opacity: 0, y: 42, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.35, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {project.name}
                  </motion.h3>
                  <motion.div
                    className="relative z-10 mt-4 flex flex-wrap gap-1.5"
                    initial="hidden"
                    animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.16, delayChildren: 1.15 } }, hidden: {} }}
                  >
                    {[project.language || "Unknown", project.status, project.category].map((label) => (
                      <motion.span
                        key={label}
                        variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                        className="rounded-full border border-museum-line/10 bg-museum-paper/[0.06] px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.14em] text-museum-paper"
                      >
                        {label}
                      </motion.span>
                    ))}
                  </motion.div>
                  <motion.p
                    className="relative z-10 mt-4 max-w-[30rem] text-sm leading-6 text-museum-muted"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.72, duration: 0.8 }}
                  >
                    {project.description}
                  </motion.p>
                  <motion.p
                    className="relative z-10 mt-5 text-[0.55rem] uppercase tracking-[0.2em] text-museum-acid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1] }}
                    transition={{ delay: 2.65, duration: 1.2 }}
                  >
                    Artifact indexed · ready for GitHub inspection
                  </motion.p>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <div className="mb-4 flex items-center gap-2 text-[0.56rem] uppercase tracking-[0.18em] text-museum-muted"><Radio className="size-3.5 text-museum-acid" /> Metadata sequence</div>
                <div className="space-y-2.5">
                  {frames.map((frame, index) => (
                    <motion.div
                      key={frame.label}
                      initial={{ x: 26, opacity: 0, filter: "blur(8px)" }}
                      animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                      transition={{ delay: 0.55 + index * 0.28, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                      className="trailer-frame rounded-[1rem] border border-museum-line/10 bg-museum-paper/[0.04] p-3"
                    >
                      <p className="text-[0.5rem] uppercase tracking-[0.16em] text-museum-muted">{frame.label}</p>
                      <p className="mt-1 truncate text-base font-semibold tracking-[-0.055em] text-museum-paper">{frame.value}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.75, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
                  className="mechanical-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-museum-paper px-4 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-museum-ink"
                >
                  Open artifact <ArrowUpRight className="size-4" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
