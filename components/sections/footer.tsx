"use client";

import { ArrowUpRight, Power } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { GitHubOwner } from "@/types/project";
import { formatDate } from "@/lib/utils";

const shutdownLogs = ["Session archived", "Signal locked", "Lights dimmed", "Memory sealed"];
const shutdownPhases = [
  { code: "01", title: "Freeze interface layer", copy: "Pausing motion systems and cursor telemetry." },
  { code: "02", title: "Seal repository vault", copy: "Closing GitHub signal channels and preserving indexed artifacts." },
  { code: "03", title: "Dim archive engine", copy: "Reducing glass panels, grids, and prism emission to zero." },
  { code: "04", title: "Commit session memory", copy: "Saving visitor path locally before the display fades." },
  { code: "05", title: "Standby protocol", copy: "Museum core is ready for a clean restart." }
];

export function Footer({ owner, generatedAt }: { owner: GitHubOwner; generatedAt: string }) {
  const [shutdownOpen, setShutdownOpen] = useState(false);

  const restartSession = () => {
    window.location.reload();
  };

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
            className="fixed inset-0 z-[140] overflow-hidden bg-[#030405] text-museum-paper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(var(--museum-acid),0.18),transparent_28%),radial-gradient(circle_at_78%_72%,rgba(var(--museum-cyan),0.12),transparent_32%),linear-gradient(135deg,#030405,#0d0e10_44%,#07080a)]" />
            <div className="shutdown-grid-modern absolute inset-0 opacity-45" />
            <motion.div
              className="shutdown-aperture absolute left-1/2 top-1/2 aspect-square w-[44rem] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-museum-line/10"
              initial={{ scale: 1.15, opacity: 0.1, rotate: 0 }}
              animate={{ scale: [1.15, 0.78, 0.36], opacity: [0.18, 0.62, 0.08], rotate: 18 }}
              transition={{ duration: 3.2, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="shutdown-scan-modern absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-museum-acid to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 0.72, 0.08], opacity: [0, 0.85, 0.55, 0] }}
              transition={{ duration: 3.1, ease: [0.76, 0, 0.24, 1] }}
            />

            <motion.div
              className="relative z-10 mx-auto flex min-h-screen w-full max-w-[980px] flex-col justify-center px-5 py-10"
              initial={{ y: 26, opacity: 0, filter: "blur(14px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: 18, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-[1.7rem] border border-museum-line/10 bg-museum-paper/[0.045] p-5 shadow-[0_40px_140px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-7">
                <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-museum-line/10 bg-museum-ink/35 px-3 py-2 text-[0.56rem] uppercase tracking-[0.24em] text-museum-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-museum-acid shadow-[0_0_18px_rgba(215,255,88,0.65)]" />
                    Dev Museum Core
                  </div>
                  <div className="rounded-full border border-museum-acid/20 bg-museum-acid/10 px-3 py-2 text-[0.56rem] uppercase tracking-[0.24em] text-museum-acid">
                    Shutdown protocol active
                  </div>
                </div>

                <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                  <div>
                    <motion.p
                      className="mb-3 text-[0.64rem] uppercase tracking-[0.34em] text-museum-acid"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.55 }}
                    >
                      Ending current session
                    </motion.p>
                    <motion.h3
                      className="text-[clamp(3rem,9vw,7.2rem)] font-semibold leading-[0.8] tracking-[-0.105em] text-museum-paper"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18, duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
                    >
                      Museum is powering down.
                    </motion.h3>
                    <motion.p
                      className="mt-5 max-w-md text-sm leading-6 text-museum-muted"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.32, duration: 0.65 }}
                    >
                      The archive display is closing safely. Restarting will reload the full boot sequence and sync the interface again.
                    </motion.p>
                  </div>

                  <div className="grid gap-2.5">
                    {shutdownPhases.map((phase, index) => (
                      <motion.div
                        key={phase.code}
                        className="shutdown-phase-card rounded-[1rem] border border-museum-line/10 bg-museum-paper/[0.045] p-3.5 backdrop-blur-xl"
                        initial={{ opacity: 0, x: 18, filter: "blur(8px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        transition={{ delay: 0.42 + index * 0.2, duration: 0.54, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 rounded-full border border-museum-acid/20 bg-museum-acid/10 px-2 py-1 text-[0.54rem] uppercase tracking-[0.18em] text-museum-acid">{phase.code}</span>
                          <div>
                            <p className="text-[0.66rem] uppercase tracking-[0.19em] text-museum-paper">{phase.title}</p>
                            <p className="mt-1 text-xs leading-5 text-museum-muted">{phase.copy}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  className="mt-7 h-1 overflow-hidden rounded-full bg-museum-paper/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-museum-acid via-museum-cyan to-museum-acid"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.35, duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                </motion.div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-museum-line/10 pt-5 text-[0.62rem] uppercase tracking-[0.2em] text-museum-muted">
                  <span>Display fades after protocol completion.</span>
                  <button
                    type="button"
                    onClick={restartSession}
                    className="mechanical-button rounded-full border border-museum-acid/25 bg-museum-acid/10 px-4 py-2 text-museum-acid hover:bg-museum-acid/15"
                  >
                    Restart session
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </footer>
  );
}
