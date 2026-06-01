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

  const periodProjects = useMemo(() => {
    if (period === latestPeriod) return sorted;
    return sorted.filter((project) => new Date(project.updatedAt).getFullYear().toString() === period);
  }, [period, sorted]);

  const timeline = expanded ? periodProjects.slice(0, 12) : periodProjects.slice(0, 5);
  const hiddenCount = Math.max(periodProjects.length - timeline.length, 0);

  const latest = sorted[0];
  const active = projects.filter((project) => project.status.toLowerCase() === "active").length;
  const averageScore = projects.length
    ? Math.round(projects.reduce((total, project) => total + project.score, 0) / projects.length)
    : 0;

  const monthlyGroups = useMemo(() => {
    const groups = new Map<string, number>();
    periodProjects.forEach((project) => {
      const date = new Date(project.updatedAt);
      const key = date.toLocaleString("en-US", { month: "short", year: "numeric" });
      groups.set(key, (groups.get(key) ?? 0) + 1);
    });
    return [...groups.entries()].slice(0, 6);
  }, [periodProjects]);

  return (
    <section id="timeline" data-room="Timeline" className="museum-room relative px-6 py-14 sm:px-8 md:px-10 md:py-16 lg:px-0">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-museum-line/15 to-transparent" />
      <div className="mx-auto max-w-[960px]">
        <div className="grid gap-5 lg:grid-cols-[0.58fr_1fr]">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <motion.div
              initial={{ y: 36, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mb-2.5 text-[0.62rem] uppercase tracking-[0.28em] text-museum-acid">Timeline / 003</p>
              <h2 className="text-balance text-3xl font-semibold leading-[0.94] tracking-[-0.075em] text-museum-paper md:text-4xl">
                Build pulse, grouped by period.
              </h2>
              <p className="mt-4 max-w-[26rem] text-xs leading-6 text-museum-muted md:text-sm">
                Instead of rendering every repository into one endless wall, the timeline now works as a digest: choose a year, see the latest pulse, then expand only when needed.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 42, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 overflow-hidden rounded-[1.15rem] border border-museum-line/10 bg-museum-paper/[0.04] p-3 backdrop-blur-xl"
            >
              <div className="timeline-orb relative min-h-[166px] overflow-hidden rounded-[1rem] border border-museum-line/10 p-3">
                <div className="museum-grid absolute inset-0 opacity-25" />
                <motion.div
                  className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-museum-line/15"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                >
                  <span className="absolute -right-1 top-1/2 size-2.5 rounded-full bg-museum-acid shadow-glow" />
                </motion.div>
                <motion.div
                  className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-museum-cyan/20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <span className="absolute left-8 top-5 size-1.5 rounded-full bg-museum-cyan" />
                </motion.div>

                <div className="relative z-10 flex h-full min-h-[142px] flex-col justify-between">
                  <div className="flex items-center justify-between text-[0.52rem] uppercase tracking-[0.18em] text-museum-muted">
                    <span>Activity radar</span>
                    <span>{periodProjects.length} matched</span>
                  </div>
                  <div>
                    <p className="text-[0.56rem] uppercase tracking-[0.16em] text-museum-muted">Latest artifact</p>
                    <h3 className="mt-1.5 text-lg font-semibold tracking-[-0.075em] text-museum-paper">
                      {latest?.name || "No project yet"}
                    </h3>
                    <p className="mt-1.5 text-[0.68rem] text-museum-muted">{latest ? `${timeAgo(latest.updatedAt)} / ${latest.language || "Unknown stack"}` : "Waiting for GitHub sync."}</p>
                  </div>
                </div>
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                <TimelineMetric label="Active" value={active} />
                <TimelineMetric label="Avg" value={averageScore} />
                <TimelineMetric label="Shown" value={timeline.length} />
              </div>
            </motion.div>
          </div>

          <div className="relative rounded-[1.25rem] border border-museum-line/10 bg-museum-paper/[0.025] p-3 backdrop-blur-xl md:p-3.5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(var(--museum-acid),0.08),transparent_30%),radial-gradient(circle_at_88%_55%,rgba(var(--museum-cyan),0.08),transparent_34%)]" />

            <div className="relative z-10 mb-3 grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
              <div className="flex flex-wrap items-center gap-1.5">
                {monthlyGroups.map(([month, count]) => (
                  <span key={month} className="rounded-full border border-museum-line/10 px-2.5 py-1 text-[0.52rem] uppercase tracking-[0.14em] text-museum-muted">
                    {month} / {count}
                  </span>
                ))}
              </div>
              <CleanSelect
                value={period}
                onChange={(value) => { setPeriod(value); setExpanded(false); }}
                label="Filter timeline by year"
                icon={<CalendarDays className="size-3" />}
                options={years.map((year) => ({ value: year, label: year === latestPeriod ? "Latest pulse" : year }))}
              />
            </div>

            <motion.div
              className="absolute left-6 top-[5.6rem] h-[calc(100%-6.4rem)] w-px origin-top bg-museum-line/15 md:left-7"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />

            <div className="relative z-10">
              {timeline.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{ x: 36, opacity: 0, filter: "blur(6px)" }}
                  whileInView={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.68, delay: index * 0.055, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pl-9 md:pl-11"
                >
                  <motion.div
                    className="absolute left-[0.05rem] top-5 size-5 rounded-full border border-museum-line/20 bg-museum-ink p-1.5 md:left-[0.13rem]"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.12 + index * 0.055, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.div
                      className="h-full w-full rounded-full"
                      style={{ backgroundColor: project.accent }}
                      animate={{ scale: [1, 1.16, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.2 }}
                    />
                  </motion.div>

                  <div className="mb-2.5 rounded-[1.05rem] border border-museum-line/10 bg-museum-paper/[0.04] p-3 backdrop-blur-xl duration-500 hover:bg-museum-paper/[0.07] md:p-3.5">
                    <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[0.5rem] uppercase tracking-[0.14em] text-museum-muted">
                      <span>{formatDate(project.updatedAt)}</span>
                      <span>/</span>
                      <span>{project.status}</span>
                      <span>/</span>
                      <span>{project.language || "Unknown stack"}</span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-[-0.075em] text-museum-paper md:text-2xl">{project.name}</h3>
                    <p className="mt-2 max-w-2xl text-[0.72rem] leading-5 text-museum-muted">{project.description}</p>
                  </div>
                </motion.article>
              ))}
            </div>

            {hiddenCount > 0 || expanded ? (
              <div className="relative z-10 mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  className="group inline-flex items-center gap-2 rounded-full border border-museum-line/15 bg-museum-paper/[0.04] px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-museum-paper backdrop-blur-xl transition-colors hover:bg-museum-paper/10"
                >
                  {expanded ? "Compress timeline" : `Load older pulse (${hiddenCount})`}
                  <ArrowDown className={`size-3.5 transition-transform duration-500 ${expanded ? "rotate-180" : "group-hover:translate-y-1"}`} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[0.8rem] border border-museum-line/10 bg-museum-paper/[0.04] p-2">
      <p className="text-[0.48rem] uppercase tracking-[0.16em] text-museum-muted">{label}</p>
      <p className="mt-1 text-base font-semibold tracking-[-0.06em] text-museum-paper">{value}</p>
    </div>
  );
}
