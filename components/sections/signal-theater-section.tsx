"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Radio, ScanLine } from "lucide-react";
import type { ArchivePayload } from "@/types/project";
import { timeAgo } from "@/lib/utils";

export function SignalTheaterSection({ archive }: { archive: ArchivePayload }) {
  const channels = useMemo(() => {
    return archive.projects
      .slice()
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [archive.projects]);

  const [activeIndex, setActiveIndex] = useState(0);
  const active = channels[activeIndex] ?? archive.projects[0];
  const dominantStack = active?.language || "Unknown";
  const signalStrength = Math.min(100, Math.max(24, active?.score ?? 50));

  return (
    <section id="signal-theater" data-room="Signal Theater" className="museum-room relative px-6 py-14 sm:px-8 md:px-10 md:py-16 lg:px-0">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-museum-line/15 to-transparent" />
      <div className="mx-auto grid max-w-[960px] gap-5 lg:grid-cols-[0.62fr_1fr] lg:items-center">
        <motion.div
          initial={{ y: 34, opacity: 0, filter: "blur(8px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-2.5 text-[0.62rem] uppercase tracking-[0.28em] text-museum-acid">Signal Theater / 006</p>
          <h2 className="text-balance text-3xl font-semibold leading-[0.94] tracking-[-0.075em] text-museum-paper md:text-4xl">
            Latest repositories broadcast like museum signals.
          </h2>
          <p className="mt-4 max-w-[27rem] text-xs leading-6 text-museum-muted md:text-sm">
            Pick a channel and the theater decodes the newest artifact into signal strength, stack identity, and repository condition before the visitor receives their exit ticket.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 34, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.08, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[1.45rem] border border-museum-line/10 bg-museum-paper/[0.035] p-3.5 shadow-glass backdrop-blur-2xl"
        >
          <div className="museum-grid absolute inset-0 opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(var(--museum-acid),0.14),transparent_34%),radial-gradient(circle_at_82%_68%,rgba(var(--museum-cyan),0.12),transparent_38%)]" />
          <div className="relative z-10 grid gap-3 md:grid-cols-[1fr_0.55fr]">
            <div className="relative min-h-[260px] overflow-hidden rounded-[1.15rem] border border-museum-line/10 bg-museum-ink/35 p-4">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-museum-acid/60 to-transparent" />
              <motion.div
                key={active?.id}
                className="pointer-events-none absolute inset-0 opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45 }}
              >
                <div className="signal-scanline" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(var(--museum-paper),0.04),transparent)]" />
              </motion.div>

              <div className="relative z-10 flex h-full min-h-[228px] flex-col justify-between">
                <div className="flex items-center justify-between gap-3 text-[0.56rem] uppercase tracking-[0.18em] text-museum-muted">
                  <span className="inline-flex items-center gap-2"><Radio className="size-3.5 text-museum-acid" /> Live channel</span>
                  <span>{timeAgo(active?.updatedAt ?? new Date().toISOString())}</span>
                </div>

                <motion.div
                  key={active?.slug}
                  initial={{ y: 18, opacity: 0, filter: "blur(7px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="mb-2 text-[0.55rem] uppercase tracking-[0.18em] text-museum-acid">Decoded artifact</p>
                  <h3 className="text-[clamp(2rem,5vw,4.6rem)] font-semibold leading-[0.82] tracking-[-0.1em] text-museum-paper">
                    {active?.name ?? "No signal"}
                  </h3>
                  <p className="mt-4 max-w-xl text-xs leading-6 text-museum-muted">{active?.description ?? "Waiting for GitHub sync."}</p>
                </motion.div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <SignalMetric label="Stack" value={dominantStack} />
                  <SignalMetric label="Status" value={active?.status ?? "Unknown"} />
                  <SignalMetric label="Signal" value={`${signalStrength}%`} />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="rounded-[1.1rem] border border-museum-line/10 bg-museum-paper/[0.04] p-3">
                <div className="mb-3 flex items-center justify-between text-[0.54rem] uppercase tracking-[0.16em] text-museum-muted">
                  <span>Frequency</span>
                  <ScanLine className="size-3.5 text-museum-acid" />
                </div>
                <div className="space-y-1.5">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <motion.div
                      key={index}
                      className="h-1 rounded-full bg-museum-acid/70"
                      animate={{ width: [`${20 + ((index * 13) % 70)}%`, `${34 + ((index * 17) % 60)}%`, `${20 + ((index * 13) % 70)}%`] }}
                      transition={{ duration: 1.8 + index * 0.05, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[1.1rem] border border-museum-line/10 bg-museum-paper/[0.04] p-2.5">
                <p className="mb-2 px-1 text-[0.54rem] uppercase tracking-[0.16em] text-museum-muted">Channels</p>
                <div className="space-y-1.5">
                  {channels.map((project, index) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`flex w-full items-center justify-between gap-2 rounded-full px-3 py-2 text-left text-[0.58rem] uppercase tracking-[0.13em] transition-colors ${index === activeIndex ? "bg-museum-paper text-museum-ink" : "text-museum-muted hover:bg-museum-paper/10 hover:text-museum-paper"}`}
                    >
                      <span className="truncate">{project.name}</span>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </button>
                  ))}
                </div>
              </div>

              <a href={active?.url ?? archive.owner.htmlUrl} target="_blank" rel="noreferrer" className="group inline-flex items-center justify-center gap-2 rounded-full bg-museum-acid px-4 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-museum-ink transition-opacity hover:opacity-85">
                Open signal <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SignalMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[0.9rem] border border-museum-line/10 bg-museum-paper/[0.04] p-2.5 backdrop-blur-xl">
      <p className="text-[0.5rem] uppercase tracking-[0.16em] text-museum-muted">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold tracking-[-0.05em] text-museum-paper">{value}</p>
    </div>
  );
}
