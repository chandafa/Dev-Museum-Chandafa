"use client";

import Lenis from "lenis";
import { ReactNode, useEffect } from "react";

export function SmoothProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchFirst = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      lerp: isTouchFirst ? 0.105 : 0.072,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.11,
      touchInertiaMultiplier: 1.12,
      wheelMultiplier: isTouchFirst ? 0.92 : 0.78,
      touchMultiplier: 1.04,
      infinite: false
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    const refresh = () => lenis.resize();
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return children;
}
