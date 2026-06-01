"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { Cpu, GitBranch, Layers3, RadioTower } from "lucide-react";
import type { ArchivePayload } from "@/types/project";

const ThreeArchiveCore = dynamic(() => import("@/components/canvas/three-archive-core").then((module) => module.ThreeArchiveCore), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(var(--museum-acid),0.09),transparent_34%)]" />
});

export function ArchiveEngineSection({ archive, topLanguages }: { archive: ArchivePayload; topLanguages: [string, number][] }) {
  const featured = archive.projects.slice(0, 16);

  return (
    <section id="engine" data-room="Archive Engine" className="museum-room relative px-6 py-14 sm:px-8 md:px-10 md:py-16 lg:px-0">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-museum-line/15 to-transparent" />
      <div className="mx-auto grid max-w-[960px] gap-5 lg:grid-cols-[0.62fr_1fr] lg:items-center">
        <motion.div
          initial={{ y: 36, opacity: 0, filter: "blur(8px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-2.5 text-[0.62rem] uppercase tracking-[0.28em] text-museum-acid">Engine / 001</p>
          <h2 className="text-balance text-2xl font-semibold leading-[0.94] tracking-[-0.075em] text-museum-paper sm:text-3xl md:text-4xl">
            The Archive Engine becomes a rotating triangular prism.
          </h2>
          <p className="mt-4 max-w-[28rem] text-xs leading-6 text-museum-muted md:text-sm">
            Repositories are decoded into a clean rotating triangular prism: thick wireframe edges, inner structural lines, glowing vertices, and compact data chips around the form.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <EngineMetric icon={<RadioTower className="size-4" />} label="Signals" value={archive.stats.total} />
            <EngineMetric icon={<GitBranch className="size-4" />} label="Forks" value={archive.stats.forks} />
            <EngineMetric icon={<Cpu className="size-4" />} label="Stacks" value={archive.stats.languages} />
            <EngineMetric icon={<Layers3 className="size-4" />} label="Topics" value={archive.stats.topics} />
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[310px] overflow-hidden md:min-h-[410px] rounded-[1.4rem] border border-museum-line/10 bg-museum-paper/[0.035] p-4 shadow-glass backdrop-blur-2xl"
        >
          <div className="museum-grid absolute inset-0 opacity-18" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--museum-acid),0.12),transparent_35%),radial-gradient(circle_at_75%_20%,rgba(var(--museum-cyan),0.1),transparent_32%)]" />
          <ThreeArchiveCore projects={featured} />

          <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-museum-line/10 bg-museum-ink/50 px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.18em] text-museum-muted backdrop-blur-xl">
            Three.js prism core
          </div>
          <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-full border border-museum-line/10 bg-museum-ink/50 px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.18em] text-museum-acid backdrop-blur-xl">
            {featured.length} signals
          </div>
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-1.5">
            {topLanguages.slice(0, 5).map(([language, count]) => (
              <span key={language} className="rounded-full border border-museum-line/10 bg-museum-ink/50 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.13em] text-museum-muted backdrop-blur-xl">
                {language} / {count}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function EngineMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-[1rem] border border-museum-line/10 bg-museum-paper/[0.04] p-3 backdrop-blur-xl">
      <div className="mb-3 text-museum-acid">{icon}</div>
      <p className="text-[0.52rem] uppercase tracking-[0.16em] text-museum-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-[-0.075em] text-museum-paper">{value}</p>
    </div>
  );
}
