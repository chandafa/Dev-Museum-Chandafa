"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

const messages = ["opening route", "checking archive access", "loading diagnostics", "index complete"];

export function PageIndexingTransition() {
  const pathname = usePathname();
  const [active, setActive] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setActive(true);
    setStep(0);
    const stepTimer = window.setInterval(() => {
      setStep((value) => Math.min(messages.length - 1, value + 1));
    }, 180);
    const closeTimer = window.setTimeout(() => {
      window.clearInterval(stepTimer);
      setActive(false);
    }, 760);
    return () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(closeTimer);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="page-indexing fixed inset-x-0 top-0 z-[95] pointer-events-none"
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -72, opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mx-auto mt-3 flex w-[min(92vw,520px)] items-center justify-between gap-3 rounded-full border border-museum-line/10 bg-museum-ink/80 px-4 py-2.5 text-[0.55rem] uppercase tracking-[0.16em] text-museum-paper shadow-glass backdrop-blur-2xl">
            <span className="truncate">/dev-museum{pathname === "/" ? "/home" : pathname}</span>
            <span className="text-museum-acid">{messages[step]}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
