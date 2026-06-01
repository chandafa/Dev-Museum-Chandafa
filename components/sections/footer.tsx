"use client";

import { ArrowUpRight, Power } from "lucide-react";
import { motion } from "motion/react";
import type { GitHubOwner } from "@/types/project";
import { formatDate } from "@/lib/utils";

const shutdownLogs = ["Session archived", "Visitor path cleared", "Museum lights dimmed", "Transmission closed"];

export function Footer({ owner, generatedAt }: { owner: GitHubOwner; generatedAt: string }) {
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
    </footer>
  );
}
