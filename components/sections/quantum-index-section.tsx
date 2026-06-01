"use client";

import { motion } from "motion/react";
import { Activity, Boxes, Fingerprint, Gauge, Radar, Sparkles } from "lucide-react";
import type { ArchivePayload } from "@/types/project";

export function QuantumIndexSection({ archive }: { archive: ArchivePayload }) {
  const activeRatio = archive.stats.total ? Math.round((archive.stats.active / archive.stats.total) * 100) : 0;
  const readyCount = archive.projects.filter((project) => project.score >= 70).length;
  const dormantCount = archive.projects.filter((project) => project.status === "Dormant").length;
  const missingDocs = archive.projects.filter((project) => !project.description || project.description.toLowerCase().includes("no description")).length;
  const topProject = [...archive.projects].sort((a, b) => b.score - a.score)[0];

  const nodes = [
    { label: "Active Pulse", value: `${activeRatio}%`, icon: Activity, copy: "Activity density across your indexed repositories." },
    { label: "Showcase Ready", value: readyCount, icon: Gauge, copy: "Artifacts with strong metadata and display potential." },
    { label: "Dormant Drift", value: dormantCount, icon: Radar, copy: "Projects waiting for a restoration pass." },
    { label: "Doc Debt", value: missingDocs, icon: Fingerprint, copy: "Repositories that need a better story or README." }
  ];

  return (
    <section id="quantum-index" data-room="Quantum Index" className="museum-room relative px-6 py-14 sm:px-8 md:px-10 md:py-16 lg:px-0">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-museum-line/15 to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
        className="quantum-index-panel relative mx-auto max-w-[1040px] overflow-hidden rounded-[1.5rem] border border-museum-line/10 bg-museum-paper/[0.04] p-5 shadow-glass backdrop-blur-2xl md:p-6"
      >
        <div className="museum-grid absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_24%,rgba(var(--museum-acid),0.16),transparent_30%),radial-gradient(circle_at_78%_64%,rgba(var(--museum-cyan),0.14),transparent_32%)]" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-center">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.3em] text-museum-acid">
              <Sparkles className="size-3.5" /> Quantum Index / 006
            </p>
            <h2 className="text-balance text-3xl font-semibold leading-[0.9] tracking-[-0.085em] text-museum-paper md:text-5xl">
              A living intelligence layer for the archive.
            </h2>
            <p className="mt-4 max-w-[31rem] text-sm leading-6 text-museum-muted">
              This section reads the museum as a living system: activity, documentation debt, dormant projects, and showcase readiness become one clean operational signal.
            </p>

            <div className="mt-6 rounded-[1.15rem] border border-museum-line/10 bg-museum-ink/25 p-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full border border-museum-acid/20 bg-museum-acid/10 text-museum-acid">
                  <Boxes className="size-4" />
                </div>
                <div>
                  <p className="text-[0.58rem] uppercase tracking-[0.22em] text-museum-muted">Prime artifact</p>
                  <p className="mt-1 text-lg font-semibold tracking-[-0.05em] text-museum-paper">{topProject?.name ?? "Archive Core"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[23rem] overflow-hidden rounded-[1.25rem] border border-museum-line/10 bg-museum-ink/25 p-4">
            <div className="quantum-rings absolute left-1/2 top-1/2 aspect-square w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
            <div className="relative z-10 grid gap-3 sm:grid-cols-2">
              {nodes.map((node, index) => {
                const Icon = node.icon;
                return (
                  <motion.div
                    key={node.label}
                    className="quantum-node-card rounded-[1rem] border border-museum-line/10 bg-museum-paper/[0.055] p-4 backdrop-blur-xl"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="mb-7 flex items-center justify-between">
                      <Icon className="size-4 text-museum-acid" />
                      <span className="text-[0.5rem] uppercase tracking-[0.18em] text-museum-muted">0{index + 1}</span>
                    </div>
                    <p className="text-3xl font-semibold tracking-[-0.08em] text-museum-paper">{node.value}</p>
                    <p className="mt-2 text-[0.58rem] uppercase tracking-[0.18em] text-museum-muted">{node.label}</p>
                    <p className="mt-3 text-xs leading-5 text-museum-muted">{node.copy}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
