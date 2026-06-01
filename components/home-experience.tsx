"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ArchivePayload } from "@/types/project";
import { Navigation } from "@/components/sections/navigation";
import { HeroSection } from "@/components/sections/hero-section";
import { ArchiveEngineSection } from "@/components/sections/archive-engine-section";
import { ArchiveSection } from "@/components/sections/archive-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { SystemSection } from "@/components/sections/system-section";
import { SignalTheaterSection } from "@/components/sections/signal-theater-section";
import { ExitGiftSection } from "@/components/sections/exit-gift-section";
import { Footer } from "@/components/sections/footer";
import { CursorLight } from "@/components/ui/cursor-light";
import { InteractionGuard } from "@/components/ui/interaction-guard";

export function HomeExperience({ archive }: { archive: ArchivePayload }) {
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    const bootTimer = window.setTimeout(() => {
      setShowBoot(false);
    }, 1650);

    return () => window.clearTimeout(bootTimer);
  }, []);

  const topLanguages = useMemo(() => {
    const map = new Map<string, number>();
    archive.projects.forEach((project) => {
      if (!project.language) return;
      map.set(project.language, (map.get(project.language) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
  }, [archive.projects]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <InteractionGuard />
      <CursorLight />
      <AnimatePresence mode="wait">
        {showBoot && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 1.15, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-museum-ink"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <p className="mb-5 text-xs uppercase tracking-[0.55em] text-museum-muted">syncing archive</p>
              <h1 className="text-5xl font-semibold tracking-[-0.08em] text-museum-paper md:text-8xl">Dev Museum</h1>
              <p className="mt-4 text-[0.62rem] uppercase tracking-[0.42em] text-museum-muted">Candra Kirana / chandafa</p>
              <div className="mx-auto mt-8 h-px w-56 overflow-hidden bg-museum-paper/10">
                <motion.div
                  className="h-full bg-museum-acid"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation owner={archive.owner} />
      <HeroSection archive={archive} topLanguages={topLanguages} />
      <ArchiveEngineSection archive={archive} topLanguages={topLanguages} />
      <ArchiveSection projects={archive.projects} source={archive.source} message={archive.message} />
      <TimelineSection projects={archive.projects} />
      <SystemSection archive={archive} topLanguages={topLanguages} />
      <SignalTheaterSection archive={archive} />
      <ExitGiftSection archive={archive} />
      <Footer owner={archive.owner} generatedAt={archive.generatedAt} />
    </main>
  );
}
