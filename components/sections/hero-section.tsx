"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { ArrowUpRight, Github, Sparkles } from "lucide-react";
import type { ArchivePayload } from "@/types/project";
import { StatPill } from "@/components/ui/stat-pill";

const ThreeMuseumOrb = dynamic(() => import("@/components/canvas/three-museum-orb").then((module) => module.ThreeMuseumOrb), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(var(--museum-paper),0.08),transparent_34%)]" />
});

export function HeroSection({ archive, topLanguages }: { archive: ArchivePayload; topLanguages: [string, number][] }) {
  return (
    <section id="top" data-room="Entrance" className="museum-room relative min-h-0 overflow-hidden px-4 pb-7 pt-[6.25rem] sm:px-6 sm:pb-10 sm:pt-[7.35rem] md:min-h-[86vh] md:px-10 md:pt-28 lg:px-0 lg:pt-[7.9rem]">
      <div className="museum-grid absolute inset-0 opacity-20" />

      <div className="relative z-10 mx-auto grid max-w-[1040px] gap-4 sm:gap-6 lg:grid-cols-[0.92fr_0.78fr] lg:items-center">
        <div className="text-center sm:text-left pt-0 md:pt-2 lg:pt-0">
          <motion.div
            initial={{ y: 35, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-museum-line/10 bg-museum-paper/[0.04] px-2.5 py-1.5 text-[0.5rem] uppercase tracking-[0.18em] text-museum-muted backdrop-blur-xl sm:mb-5 sm:gap-2.5 sm:px-3.5 sm:text-[0.62rem] sm:tracking-[0.24em]"
          >
            <Sparkles className="size-4 text-museum-acid" />
            GitHub-powered archive
          </motion.div>

          <h1 className="mx-auto max-w-2xl text-[clamp(2.35rem,15.5vw,6.35rem)] font-semibold leading-[0.86] tracking-[-0.1em] text-museum-paper sm:mx-0">
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
            className="mx-auto mt-4 max-w-[28rem] text-[0.78rem] leading-relaxed text-museum-muted sm:mx-0 sm:text-sm md:mt-6 md:text-base"
          >
            A cinematic archive that turns repositories into a living museum: projects, stacks, activity, and legacy without manual portfolio maintenance.
          </motion.p>

          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-7 sm:justify-start sm:gap-2.5"
          >
            <a href="#archive" className="mechanical-button group inline-flex items-center gap-2 rounded-full bg-museum-paper px-3.5 py-2.5 text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-museum-ink transition-transform hover:-translate-y-1 sm:gap-2.5 sm:px-4 sm:py-3 sm:text-[0.68rem] sm:tracking-[0.18em]">
              Enter archive
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            <a href={archive.owner.htmlUrl} target="_blank" rel="noreferrer" className="mechanical-button inline-flex items-center gap-2 rounded-full border border-museum-line/15 px-3.5 py-2.5 text-[0.58rem] uppercase tracking-[0.15em] text-museum-paper transition-colors hover:bg-museum-paper/10 sm:gap-2.5 sm:px-4 sm:py-3 sm:text-[0.68rem] sm:tracking-[0.18em]">
              <Github className="size-4" />
              @{archive.owner.login}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto min-h-[205px] w-full max-w-[25rem] overflow-hidden rounded-[1.1rem] border border-museum-line/10 bg-museum-paper/[0.04] p-2.5 shadow-glass backdrop-blur-2xl sm:min-h-[270px] sm:rounded-[1.45rem] sm:p-3.5 md:min-h-[330px] md:max-w-none md:rounded-[1.65rem] md:p-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(var(--museum-acid),0.2),transparent_38%),radial-gradient(circle_at_82%_78%,rgba(var(--museum-cyan),0.16),transparent_34%)]" />
          <ThreeMuseumOrb />

          <div className="relative z-10 flex h-full min-h-[185px] flex-col justify-between sm:min-h-[240px] md:min-h-[298px]">
            <div className="flex items-center justify-between text-[0.5rem] uppercase tracking-[0.18em] text-museum-muted sm:text-[0.62rem] sm:tracking-[0.22em]">
              <span>Live vault</span>
              <span>{archive.source === "github" ? "GitHub sync" : "Fallback data"}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              <StatPill label="Repos" value={archive.stats.total} />
              <StatPill label="Active" value={archive.stats.active} />
              <StatPill label="Stars" value={archive.stats.stars} />
              <StatPill label="Stacks" value={archive.stats.languages} />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto mt-4 flex max-w-[1040px] gap-1.5 overflow-x-auto pb-1 text-[0.48rem] uppercase tracking-[0.12em] text-museum-muted sm:mt-5 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:text-[0.58rem] sm:tracking-[0.18em]">
        {topLanguages.map(([language, total]) => (
          <span key={language} className="shrink-0 rounded-full border border-museum-line/10 px-2.5 py-1 sm:px-3 sm:py-1.5">
            {language} / {total}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto mt-4 max-w-[1040px] overflow-hidden rounded-full border border-museum-line/10 bg-museum-paper/[0.035] py-1.5 backdrop-blur-xl sm:mt-6 sm:py-2">
        <div className="hero-marquee flex w-max items-center gap-6 whitespace-nowrap text-[0.48rem] uppercase tracking-[0.18em] text-museum-muted sm:gap-8 sm:text-[0.56rem] sm:tracking-[0.22em]">
          {[0, 1].map((loop) => (
            <div key={loop} className="flex items-center gap-6 px-3 sm:gap-8 sm:px-4">
              <span className="text-museum-acid">Live GitHub signal</span>
              <span>{archive.stats.total} artifacts indexed</span>
              <span>{archive.stats.languages} stacks detected</span>
              <span>{archive.stats.active} active builds</span>
              <span>{archive.stats.stars} stars collected</span>
              <span>Command: Ctrl + K</span>
              <span>Control Room: triple click DM</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
