"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Code2, Eye, Sparkles } from "lucide-react";

function cssColor(name: string, alpha: number) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "244 240 232";
  return `rgb(${value} / ${alpha})`;
}

function EvilEyeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let frame = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      frame += 0.018;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;

      context.clearRect(0, 0, w, h);
      context.globalCompositeOperation = "lighter";

      const rays = 360;
      for (let i = 0; i < rays; i += 1) {
        const angle = (i / rays) * Math.PI * 2;
        const wobble = Math.sin(frame * 2.2 + i * 0.06) * 0.22 + Math.sin(frame + i * 0.17) * 0.14;
        const eyeShape = Math.pow(Math.abs(Math.cos(angle)), 0.34) * 0.74 + 0.16;
        const radius = (w * 0.18 + Math.sin(i * 12.7 + frame * 2) * 18) * eyeShape + wobble * 22;
        const x1 = cx + Math.cos(angle) * 34;
        const y1 = cy + Math.sin(angle) * 12;
        const x2 = cx + Math.cos(angle) * (radius + w * 0.15);
        const y2 = cy + Math.sin(angle) * (radius * 0.5 + h * 0.09);

        const gradient = context.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, "rgba(255, 236, 128, 0.88)");
        gradient.addColorStop(0.45, "rgba(255, 120, 42, 0.46)");
        gradient.addColorStop(1, "rgba(255, 62, 32, 0)");
        context.strokeStyle = gradient;
        context.lineWidth = 1.4 + Math.random() * 0.25;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
      }

      context.globalCompositeOperation = "source-over";
      const iris = context.createRadialGradient(cx, cy, 4, cx, cy, w * 0.11);
      iris.addColorStop(0, "rgba(0,0,0,1)");
      iris.addColorStop(0.38, "rgba(12,10,8,0.94)");
      iris.addColorStop(1, "rgba(255,180,60,0.22)");
      context.fillStyle = iris;
      context.beginPath();
      context.ellipse(cx, cy, w * 0.085, h * 0.17, 0, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = cssColor("--museum-acid", 0.35);
      context.lineWidth = 1;
      context.beginPath();
      context.ellipse(cx, cy, w * 0.36, h * 0.22, 0, 0, Math.PI * 2);
      context.stroke();

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}

export function EvilEyeSection() {
  return (
    <section id="evil-eye" data-room="Evil Eye" className="museum-room relative px-6 py-14 sm:px-8 md:px-10 md:py-16 lg:px-0">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-museum-line/15 to-transparent" />
      <div className="mx-auto max-w-[960px]">
        <div className="mb-5 grid gap-4 lg:grid-cols-[0.65fr_1fr] lg:items-end">
          <div>
            <p className="mb-2.5 text-[0.62rem] uppercase tracking-[0.28em] text-museum-acid">Evil Eye / 007</p>
            <h2 className="text-balance text-3xl font-semibold leading-[0.94] tracking-[-0.075em] text-museum-paper md:text-4xl">
              A living background experiment before the exit.
            </h2>
          </div>
          <p className="max-w-[31rem] text-xs leading-6 text-museum-muted md:text-sm">
            The final room is not a contact block. It is a tiny React Bits inspired lab: burning eye canvas, SVG line drawing, and kinetic label motion.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
          <motion.div
            initial={{ y: 34, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-[360px] overflow-hidden rounded-[1.35rem] border border-museum-line/10 bg-museum-ink/70 p-3 shadow-glass backdrop-blur-2xl"
          >
            <div className="absolute left-4 top-4 z-10 flex gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-museum-line/10 bg-museum-paper/[0.06] px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.16em] text-museum-paper backdrop-blur-xl"><Eye className="size-3" /> Preview</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-museum-line/10 bg-museum-paper/[0.06] px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.16em] text-museum-muted backdrop-blur-xl"><Code2 className="size-3" /> Canvas</span>
            </div>
            <EvilEyeCanvas />
          </motion.div>

          <motion.div
            initial={{ y: 34, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.08, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[1.35rem] border border-museum-line/10 bg-museum-paper/[0.04] p-4 shadow-glass backdrop-blur-2xl"
          >
            <div className="mb-5 flex items-center justify-between text-[0.58rem] uppercase tracking-[0.2em] text-museum-muted">
              <span>createDrawable</span>
              <Sparkles className="size-4 text-museum-acid" />
            </div>

            <div className="drawable-stage relative grid min-h-[210px] place-items-center overflow-hidden rounded-[1.1rem] border border-museum-line/10 bg-museum-cyan/[0.06]">
              <svg viewBox="0 0 640 220" className="w-full px-4" role="img" aria-label="archive drawable animation">
                <text x="30" y="150" className="drawable-text">archive</text>
              </svg>
            </div>

            <div className="mt-4 rounded-[1rem] border border-museum-line/10 bg-museum-ink/45 p-3 font-mono text-[0.68rem] leading-5 text-museum-muted">
              <span className="text-museum-acid">const</span> [ drawable ] = svg.<span className="text-museum-cyan">createDrawable</span>(target);
            </div>
            <p className="mt-3 text-xs leading-6 text-museum-muted">
              The line is drawn with SVG stroke dash animation, so it feels like Anime.js createDrawable without adding another dependency.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
