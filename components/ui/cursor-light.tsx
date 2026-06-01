"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CursorLight() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, "x", { duration: 0.7, ease: "power3" });
    const yTo = gsap.quickTo(element, "y", { duration: 0.7, ease: "power3" });

    const move = (event: PointerEvent) => {
      xTo(event.clientX - 180);
      yTo(event.clientY - 180);
    };

    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[1] hidden h-[360px] w-[360px] rounded-full bg-museum-acid/10 blur-3xl md:block"
    />
  );
}
