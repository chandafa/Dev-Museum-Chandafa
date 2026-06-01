"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, CalendarDays } from "lucide-react";
import { CleanSelect } from "@/components/ui/clean-select";
import type { MuseumProject } from "@/types/project";
import { formatDate, timeAgo } from "@/lib/utils";

const latestPeriod = "Latest";

type Period = typeof latestPeriod | string;

export function TimelineSection({ projects }: { projects: MuseumProject[] }) {
  const sorted = useMemo(
    () => [...projects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [projects]
  );

  const years = useMemo(() => {
    const uniqueYears = new Set(sorted.map((project) => new Date(project.updatedAt).getFullYear().toString()));
    return [latestPeriod, ...uniqueYears];
  }, [sorted]);

  const [period, setPeriod] = useState<Period>(latestPeriod);
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const periodProjects = useMemo(() => {
    if (period === latestPeriod) return sorted;
    return sorted.filter((project) => new Date(project.updatedAt).getFullYear().toString() === period);
  }, [period, sorted]);

  const frames = expanded ? periodProjects.slice(0, 16) : periodProjects.slice(0, 8);
  const activeProject = frames[activeIndex] ?? frames[0] ?? sorted[0];
  const hiddenCount = Math.max(periodProjects.length - frames.length, 0);

  const filmStats = useMemo(() => {
    const active = projects.filter((project) => project.status === "Active").length;
    const latest = sorted[0];
    const averageScore = projects.length
      ? Math.round(projects.reduce((total, project) => total + project.score, 0) / projects.length)
      : 0;
    return { active, latest, averageScore };
  }, [projects, sorted]);

  return (
    <section id="timeline" data-room="Timeline" className="museum-room relative px-6 py-14 sm:px-8 md:px-10 md:py-16 lg:px-0">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-museum-line/15 to-transparent" />
      <div className="mx-auto max-w-[960px]">
        <div className="grid gap-5 lg:grid-cols-[0.62fr_1fr] lg:items-end">
          <motion.div
            initial={{ y: 36, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-2.5 text-[0.62rem] uppercase tracking-[0.28em] text-museum-acid">Timeline / 003</p>
            <h2 className="text-balance text-2xl font-semibold leading-[0.94] tracking-[-0.075em] text-museum-paper sm:text-3xl md:text-4xl">
              Timeline as a moving film strip.
            </h2>
            <p className="mt-4 max-w-[27rem] text-xs leading-6 text-museum-muted md:text-sm">
              Updates are treated as frames. Choose a year, hover a frame, and the projector displays the selected repository without forcing a long vertical stack.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 34, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-3 gap-1.5"
          >
            <TimelineMetric label="Active" value={filmStats.active} />
            <TimelineMetric label="Avg Score" value={filmStats.averageScore} />
            <TimelineMetric label="Frames" value={periodProjects.length} />
          </motion.div>
        </div>

        <div className="relative z-10 mt-7 overflow-visible rounded-[1.35rem] border border-museum-line/10 bg-museum-paper/[0.03] p-3 shadow-glass backdrop-blur-2xl md:p-4">
          <div className="relative min-h-[260px] overflow-visible rounded-[1.15rem] border border-museum-line/10 bg-museum-ink/35 p-4 md:p-5">
            <div className="museum-grid absolute inset-0 opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(var(--museum-acid),0.11),transparent_32%),radial-gradient(circle_at_86%_70%,rgba(var(--museum-cyan),0.10),transparent_36%)]" />

            <div className="relative z-10 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.54rem] uppercase tracking-[0.18em] text-museum-muted">Now projecting</p>
                <h3 className="mt-1 max-w-[36rem] truncate text-2xl font-semibold tracking-[-0.075em] text-museum-paper md:text-3xl">
                  {activeProject?.name || "No repository signal"}
                </h3>
              </div>
              <div className="relative z-50 w-full sm:w-[180px]">
                <CleanSelect
                  value={period}
                  onChange={(value) => { setPeriod(value); setExpanded(false); setActiveIndex(0); }}
                  label="Film year"
                  icon={<CalendarDays className="size-3" />}
                  options={years.map((year) => ({ value: year, label: year === latestPeriod ? "Latest pulse" : year }))}
                />
              </div>
            </div>

            <div className="relative z-10 grid gap-4 lg:grid-cols-[0.86fr_1.14fr]">
              <motion.div
                key={activeProject?.id}
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[1.05rem] border border-museum-line/10 bg-museum-paper/[0.045] p-4 backdrop-blur-xl"
              >
                <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[0.5rem] uppercase tracking-[0.14em] text-museum-muted">
                  <span>{activeProject ? formatDate(activeProject.updatedAt) : "No date"}</span>
                  <span>/</span>
                  <span>{activeProject?.status || "Waiting"}</span>
                  <span>/</span>
                  <span>{activeProject?.language || "Unknown stack"}</span>
                </div>
                <p className="line-clamp-5 text-xs leading-6 text-museum-muted md:text-sm">{activeProject?.description || "Waiting for GitHub sync."}</p>
                <div className="mt-4 flex items-center justify-between border-t border-museum-line/10 pt-3 text-[0.58rem] uppercase tracking-[0.16em] text-museum-muted">
                  <span>{activeProject ? timeAgo(activeProject.updatedAt) : "Idle"}</span>
                  <span className="text-museum-acid">{activeProject?.score ?? 0}/100</span>
                </div>
              </motion.div>

              <div className="film-strip relative overflow-x-auto rounded-[1.05rem] border border-museum-line/10 bg-museum-paper/[0.035] p-3">
                <motion.div
                  className="flex min-w-max gap-2.5"
                  initial={{ x: 36, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {frames.map((project, index) => (
                    <button
                      key={project.id}
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => setActiveIndex(index)}
                      className={`film-frame mechanical-button relative w-[164px] shrink-0 overflow-hidden rounded-[0.85rem] border p-3 text-left transition-colors ${activeProject?.id === project.id ? "border-museum-acid/45 bg-museum-acid/10" : "border-museum-line/10 bg-museum-ink/20 hover:bg-museum-paper/[0.06]"}`}
                    >
                      <span className="film-perf film-perf-top" />
                      <span className="film-perf film-perf-bottom" />
                      <span className="relative z-10 block text-[0.48rem] uppercase tracking-[0.14em] text-museum-muted">Frame {String(index + 1).padStart(2, "0")}</span>
                      <span className="relative z-10 mt-5 block line-clamp-2 text-sm font-semibold leading-tight tracking-[-0.05em] text-museum-paper">{project.name}</span>
                      <span className="relative z-10 mt-3 block truncate text-[0.6rem] text-museum-muted">{formatDate(project.updatedAt)}</span>
                    </button>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {hiddenCount > 0 || expanded ? (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="mechanical-button group inline-flex items-center gap-2 rounded-full border border-museum-line/15 bg-museum-paper/[0.04] px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-museum-paper backdrop-blur-xl transition-colors hover:bg-museum-paper/10"
              >
                {expanded ? "Compress film strip" : `Load older frames (${hiddenCount})`}
                <ArrowDown className={`size-3.5 transition-transform duration-500 ${expanded ? "rotate-180" : "group-hover:translate-y-1"}`} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function TimelineMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[0.8rem] border border-museum-line/10 bg-museum-paper/[0.04] p-2.5">
      <p className="text-[0.48rem] uppercase tracking-[0.16em] text-museum-muted">{label}</p>
      <p className="mt-1 text-base font-semibold tracking-[-0.06em] text-museum-paper">{value}</p>
    </div>
  );
}
