"use client";

import { ArrowUpRight, Power } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { GitHubOwner } from "@/types/project";
import { formatDate } from "@/lib/utils";

const shutdownLogs = ["Session archived", "Visitor path cleared", "Museum lights dimmed", "Transmission closed"];
const terminalShutdownLogs = [
  "closing /dev-museum runtime...",
  "saving visitor path to local memory...",
  "disconnecting github signal stream...",
  "dimming archive engine lights...",
  "parking triangular prism core...",
  "flushing command palette cache...",
  "powering down visual modules...",
  "system state: safe to close"
];

export function Footer({ owner, generatedAt }: { owner: GitHubOwner; generatedAt: string }) {
  const [shutdownOpen, setShutdownOpen] = useState(false);

  return (
    <footer id="contact" className="relative px-6 pb-8 pt-16 sm:px-8 md:px-10 md:pt-20 lg:px-0">
      <motion.div
        initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="shutdown-footer mx-auto max-w-[1040px] overflow-hidden rounded-[1.45rem] border border-museum-line/10 bg-museum-paper/[0.04] p-5 backdrop-blur-2xl md:p-6"
      >
        <div className="shutdown-beam" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.3em] text-museum-acid"><Power className="size-3.5" /> Shutdown sequence</p>
            <h2 className="max-w-3xl text-[clamp(2.8rem,7vw,6.5rem)] font-semibold leading-[0.86] tracking-[-0.1em] text-museum-paper">
              Keep building. Let the museum remember.
            </h2>
          </div>
          <div className="grid gap-2.5 text-xs uppercase tracking-[0.18em] text-museum-paper">
            <a className="mechanical-button group flex items-center justify-between gap-8 rounded-full border border-museum-line/10 px-4 py-3 transition-colors hover:bg-museum-paper/10" href={owner.htmlUrl} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            <a className="mechanical-button group flex items-center justify-between gap-8 rounded-full border border-museum-line/10 px-4 py-3 transition-colors hover:bg-museum-paper/10" href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ck271138@gmail.com"}`}>
              Email <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            <button
              type="button"
              onClick={() => setShutdownOpen(true)}
              className="mechanical-button group flex items-center justify-between gap-8 rounded-full border border-museum-acid/25 bg-museum-acid/10 px-4 py-3 text-left transition-colors hover:bg-museum-acid/15"
            >
              Shutdown <Power className="size-4 transition-transform group-hover:rotate-90" />
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-7 grid gap-2 sm:grid-cols-4">
          {shutdownLogs.map((log, index) => (
            <motion.div
              key={log}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 + index * 0.1, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
              className="shutdown-log rounded-[0.9rem] border border-museum-line/10 bg-museum-ink/25 px-3 py-2.5 text-[0.52rem] uppercase tracking-[0.16em] text-museum-muted"
            >
              <span className="mr-2 text-museum-acid">0{index + 1}</span>{log}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-museum-line/10 pt-4 text-[0.62rem] uppercase tracking-[0.18em] text-museum-muted">
          <span>© {new Date().getFullYear()} Dev Museum / Candra Kirana. All rights reserved.</span>
          <span>Generated {formatDate(generatedAt)}</span>
          <a href="#top" className="magnetic-line text-museum-paper">Back to top</a>
        </div>
      </motion.div>

      <AnimatePresence>
        {shutdownOpen && (
          <motion.div
            className="fixed inset-0 z-[140] flex items-center justify-center overflow-hidden bg-black px-5 text-museum-acid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="shutdown-crt absolute inset-0" />
            <motion.div
              className="shutdown-power-line absolute left-0 right-0 top-1/2 h-px bg-museum-acid/70 shadow-[0_0_42px_rgba(215,255,88,0.75)]"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 1, 0.18], opacity: [0, 1, 0.82, 0.35] }}
              transition={{ duration: 2.6, times: [0, 0.25, 0.78, 1], ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="relative z-10 w-full max-w-2xl rounded-[1.4rem] border border-museum-acid/20 bg-black/[0.78] p-5 shadow-[0_0_80px_rgba(215,255,88,0.12)] backdrop-blur-xl md:p-7"
              initial={{ y: 24, opacity: 0, filter: "blur(12px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: 18, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-5 flex items-center justify-between border-b border-museum-acid/15 pb-3 text-[0.58rem] uppercase tracking-[0.24em]">
                <span>Dev Museum Shutdown</span>
                <span className="animate-pulse">Power sequence armed</span>
              </div>
              <motion.h3
                className="text-[clamp(2.3rem,8vw,5.4rem)] font-semibold leading-[0.82] tracking-[-0.1em] text-museum-paper"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                System is shutting down.
              </motion.h3>
              <div className="mt-6 grid gap-2 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-museum-acid/[0.85] sm:text-xs">
                {terminalShutdownLogs.map((log, index) => (
                  <motion.div
                    key={log}
                    className="flex items-center gap-2 rounded-lg border border-museum-acid/10 bg-museum-acid/[0.035] px-3 py-2"
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + index * 0.23, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="text-museum-paper/45">[{String(index + 1).padStart(2, "0")}]</span>
                    <span>{log}</span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="mt-6 h-1 overflow-hidden rounded-full bg-museum-paper/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="h-full rounded-full bg-museum-acid"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.35, duration: 2.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[0.62rem] uppercase tracking-[0.2em] text-museum-muted">
                <span>Display output will fade to black.</span>
                <button
                  type="button"
                  onClick={() => setShutdownOpen(false)}
                  className="mechanical-button rounded-full border border-museum-acid/25 px-4 py-2 text-museum-acid hover:bg-museum-acid/10"
                >
                  Restart session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </footer>
  );
}
