"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Github, Sparkles } from "lucide-react";
import type { ArchivePayload } from "@/types/project";
import { ArchiveConstellation } from "@/components/canvas/archive-constellation";
import { ThreeMuseumOrb } from "@/components/canvas/three-museum-orb";
import { StatPill } from "@/components/ui/stat-pill";

export function HeroSection({ archive, topLanguages }: { archive: ArchivePayload; topLanguages: [string, number][] }) {
  return (
    <section id="top" data-room="Entrance" className="museum-room relative min-h-[88vh] overflow-hidden px-6 pb-10 pt-[8rem] sm:px-8 md:px-10 md:pt-28 lg:px-0 lg:pt-28">
      <ArchiveConstellation />
      <div className="museum-grid absolute inset-0 opacity-20" />

      <div className="relative z-10 mx-auto grid max-w-[1040px] translate-y-2 gap-7 lg:grid-cols-[0.92fr_0.78fr] lg:items-center">
        <div className="pt-0 md:pt-2 lg:pt-0">
          <motion.div
            initial={{ y: 35, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-museum-line/10 bg-museum-paper/[0.04] px-3.5 py-1.5 text-[0.62rem] uppercase tracking-[0.24em] text-museum-muted backdrop-blur-xl"
          >
            <Sparkles className="size-4 text-museum-acid" />
            GitHub-powered archive
          </motion.div>

          <h1 className="max-w-2xl text-[clamp(3.1rem,7.7vw,6.55rem)] font-semibold leading-[0.86] tracking-[-0.1em] text-museum-paper">
            <motion.span className="block" initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>Dev</motion.span>
            <motion.span
              className="relative block h-[0.98em] w-full max-w-[6.35em] overflow-visible"
              initial={{ y: 140, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.08, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <svg className="hero-drawable-museum absolute left-0 top-[-0.06em] h-[1.08em] w-full overflow-visible" viewBox="0 0 760 150" role="img" aria-label="Museum">
                <text x="0" y="118" className="hero-drawable-fill">Museum</text>
                <motion.text
                  x="0"
                  y="118"
                  className="hero-drawable-stroke"
                  initial={{ strokeDashoffset: 1250, opacity: 0.35 }}
                  animate={{ strokeDashoffset: [1250, 0, 0], opacity: [0.35, 1, 0.82] }}
                  transition={{ delay: 0.68, duration: 3.2, times: [0, 0.72, 1], ease: [0.16, 1, 0.3, 1] }}
                >Museum</motion.text>
              </svg>
              <span className="sr-only">Museum</span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.22, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-[30rem] text-sm leading-relaxed text-museum-muted md:text-base"
          >
            A cinematic archive that turns repositories into a living museum: projects, stacks, activity, and legacy without manual portfolio maintenance.
          </motion.p>

          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 flex flex-wrap items-center gap-2.5"
          >
            <a href="#archive" className="group inline-flex items-center gap-2.5 rounded-full bg-museum-paper px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-museum-ink transition-transform hover:-translate-y-1">
              Enter archive
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            <a href={archive.owner.htmlUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 rounded-full border border-museum-line/15 px-4 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-museum-paper transition-colors hover:bg-museum-paper/10">
              <Github className="size-4" />
              @{archive.owner.login}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[305px] overflow-hidden rounded-[1.65rem] border border-museum-line/10 bg-museum-paper/[0.04] p-3.5 shadow-glass backdrop-blur-2xl md:min-h-[330px] md:p-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(var(--museum-acid),0.2),transparent_38%),radial-gradient(circle_at_82%_78%,rgba(var(--museum-cyan),0.16),transparent_34%)]" />
          <ThreeMuseumOrb />

          <div className="relative z-10 flex h-full min-h-[275px] flex-col justify-between md:min-h-[298px]">
            <div className="flex items-center justify-between text-[0.62rem] uppercase tracking-[0.22em] text-museum-muted">
              <span>Live vault</span>
              <span>{archive.source === "github" ? "GitHub sync" : "Fallback data"}</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <StatPill label="Repos" value={archive.stats.total} />
              <StatPill label="Active" value={archive.stats.active} />
              <StatPill label="Stars" value={archive.stats.stars} />
              <StatPill label="Stacks" value={archive.stats.languages} />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto mt-5 flex max-w-[1040px] flex-wrap gap-1.5 text-[0.58rem] uppercase tracking-[0.18em] text-museum-muted">
        {topLanguages.map(([language, total]) => (
          <span key={language} className="rounded-full border border-museum-line/10 px-3 py-1.5">
            {language} / {total}
          </span>
        ))}
      </div>
    </section>
  );
}
