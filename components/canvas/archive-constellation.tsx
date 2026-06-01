"use client";

import { useEffect, useRef } from "react";

function cssRgb(name: string, alpha: number) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "244 240 232";
  return `rgb(${value} / ${alpha})`;
}

export function ArchiveConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const particles = Array.from({ length: 96 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0007,
      vy: (Math.random() - 0.5) * 0.0007,
      size: Math.random() * 1.8 + 0.4
    }));

    let frame = 0;
    let animation = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      frame += 0.008;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      context.clearRect(0, 0, width, height);
      context.fillStyle = cssRgb("--museum-paper", 0.55);

      particles.forEach((particle) => {
        particle.x += particle.vx + Math.sin(frame + particle.y * 6) * 0.00015;
        particle.y += particle.vy + Math.cos(frame + particle.x * 6) * 0.00015;

        if (particle.x < 0) particle.x = 1;
        if (particle.x > 1) particle.x = 0;
        if (particle.y < 0) particle.y = 1;
        if (particle.y > 1) particle.y = 0;

        context.beginPath();
        context.arc(particle.x * width, particle.y * height, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      for (let index = 0; index < particles.length; index += 1) {
        for (let next = index + 1; next < particles.length; next += 1) {
          const a = particles[index];
          const b = particles[next];
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.13;
            context.strokeStyle = cssRgb("--museum-acid", opacity);
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(a.x * width, a.y * height);
            context.lineTo(b.x * width, b.y * height);
            context.stroke();
          }
        }
      }

      // Keep the background clean: no oversized orbital ring near the language chips.

      animation = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" aria-hidden="true" />;
}
