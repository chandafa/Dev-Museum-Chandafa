"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Database, Github, Layers3, RefreshCcw } from "lucide-react";
import type { ArchivePayload } from "@/types/project";

export function SystemSection({ archive, topLanguages }: { archive: ArchivePayload; topLanguages: [string, number][] }) {
  return (
    <section id="system" data-room="System" className="museum-room relative px-6 py-16 sm:px-8 md:px-10 md:py-20 lg:px-0">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-museum-line/15 to-transparent" />
      <div className="mx-auto max-w-[1040px]">
        <div className="grid gap-4 md:grid-cols-4">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel rounded-[1.35rem] p-5 md:col-span-2 md:row-span-2"
          >
            <p className="mb-3 text-[0.68rem] uppercase tracking-[0.3em] text-museum-acid">System / 005</p>
            <h2 className="max-w-xl text-3xl font-semibold leading-[0.94] tracking-[-0.075em] text-museum-paper md:text-5xl">
              Manual input is dead. Long live the sync.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-museum-muted">
              Dev Museum reads your GitHub profile, converts repositories into museum objects, calculates showcase score, and groups them by project intent.
            </p>

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              <SystemStep icon={<Github />} label="GitHub API" value="Repos + profile" />
              <SystemStep icon={<Database />} label="Transform" value="Category + score" />
              <SystemStep icon={<Layers3 />} label="Render" value="Cards + timeline" />
              <SystemStep icon={<RefreshCcw />} label="Refresh" value="No manual data" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel rounded-[1.35rem] p-5 md:col-span-2"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-museum-muted">Stack distribution</p>
            <div className="mt-5 space-y-3">
              {topLanguages.map(([language, total]) => {
                const percent = Math.max(8, (total / Math.max(archive.stats.total, 1)) * 100);
                return (
                  <div key={language}>
                    <div className="mb-1.5 flex items-center justify-between text-xs text-museum-muted">
                      <span>{language}</span>
                      <span>{total}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-museum-paper/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-museum-acid"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[1.35rem] border border-museum-line/10 bg-museum-acid p-5 text-museum-ink md:col-span-1"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.22em] opacity-70">Total repos</p>
            <p className="mt-5 text-5xl font-semibold tracking-[-0.1em]">{archive.stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel rounded-[1.6rem] p-6 md:col-span-1"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-museum-muted">Source</p>
            <p className="mt-5 text-2xl font-semibold tracking-[-0.075em] text-museum-paper">{archive.source}</p>
            <p className="mt-3 text-xs leading-5 text-museum-muted">Add a GitHub token in production for safer rate limits.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SystemStep({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[0.95rem] border border-museum-line/10 bg-museum-paper/[0.04] p-3">
      <div className="mb-4 size-4 text-museum-acid">{icon}</div>
      <p className="text-[0.6rem] uppercase tracking-[0.18em] text-museum-muted">{label}</p>
      <p className="mt-1.5 text-sm font-semibold tracking-[-0.04em] text-museum-paper">{value}</p>
    </div>
  );
}
