"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { Moon, Sun } from "lucide-react";
import type { GitHubOwner } from "@/types/project";

const navItems = [
  { label: "Engine", href: "#engine" },
  { label: "Archive", href: "#archive" },
  { label: "Timeline", href: "#timeline" },
  { label: "System", href: "#system" },
  { label: "Signal", href: "#signal-theater" },
  { label: "Exit Gift", href: "#exit-gift" },
  { label: "Contact", href: "#contact" }
];

type ThemeMode = "dark" | "light";

export function Navigation({ owner }: { owner: GitHubOwner }) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const logoClicks = useRef(0);
  const logoTimer = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("dev-museum-theme") as ThemeMode | null;
    const nextTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("dev-museum-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!open || !menuRef.current) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".menu-reveal",
        { y: 80, opacity: 0, rotateX: -20 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.08, ease: "power4.out" }
      );
    }, menuRef);

    return () => context.revert();
  }, [open]);

  useEffect(() => {
    return () => {
      if (logoTimer.current) window.clearTimeout(logoTimer.current);
    };
  }, []);

  const close = () => setOpen(false);

  const toggleTheme = () => {
    setTheme((value) => (value === "dark" ? "light" : "dark"));
  };

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    logoClicks.current += 1;
    if (logoTimer.current) window.clearTimeout(logoTimer.current);

    logoTimer.current = window.setTimeout(() => {
      logoClicks.current = 0;
    }, 850);

    if (logoClicks.current >= 3) {
      event.preventDefault();
      logoClicks.current = 0;
      router.push("/control-room");
    }
  };

  return (
    <>

      <header className="fixed left-0 right-0 top-0 z-[60] flex items-center justify-between px-4 py-4 md:px-8">
        <a href="#top" onClick={handleLogoClick} className="group flex items-center gap-3 text-museum-paper" aria-label="Dev Museum home, triple click to open Control Room">
          <span className="grid size-10 place-items-center rounded-full border border-museum-line/25 bg-museum-ink/35 text-xs font-bold tracking-[-0.04em] backdrop-blur-xl transition-transform duration-500 group-hover:rotate-45">DM</span>
          <span className="hidden text-xs uppercase tracking-[0.28em] md:block">Dev Museum</span>
        </a>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="group grid size-11 place-items-center rounded-full border border-museum-line/20 bg-museum-ink/35 text-museum-paper backdrop-blur-xl transition-colors hover:bg-museum-paper/10"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -35, scale: 0.65, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 35, scale: 0.65, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </motion.span>
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="group relative flex h-11 items-center gap-3 rounded-full border border-museum-line/20 bg-museum-ink/35 px-4 text-xs uppercase tracking-[0.24em] text-museum-paper backdrop-blur-xl transition-colors hover:bg-museum-paper/10"
            aria-expanded={open}
            aria-label="Open navigation menu"
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="relative h-3 w-6">
              <span className="absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-300 group-hover:translate-x-1" />
              <span className="absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-300 group-hover:-translate-x-1" />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            className="fixed inset-0 z-[55] overflow-hidden bg-museum-ink px-5 py-24 md:px-10"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="museum-grid absolute inset-0 opacity-25" />
            <div className="relative z-10 grid h-full grid-rows-[1fr_auto]">
              <nav className="flex flex-col justify-center">
                {navItems.map((item, index) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="menu-reveal group flex items-center justify-between border-t border-museum-line/10 py-3 text-[clamp(3rem,10vw,7rem)] font-semibold leading-[0.84] tracking-[-0.11em] text-museum-paper last:border-b md:py-4"
                  >
                    <span className="transition-transform duration-500 ease-out group-hover:translate-x-6 group-hover:text-museum-acid">{item.label}</span>
                    <span className="text-sm font-normal tracking-[0.25em] text-museum-muted">0{index + 1}</span>
                  </a>
                ))}
              </nav>

              <div className="menu-reveal grid gap-8 border-t border-museum-line/10 pt-8 text-sm text-museum-muted md:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-museum-paper">{owner.name}</p>
                  <p className="mt-1 max-w-xl">{owner.bio}</p>
                  <p className="mt-2 text-[0.62rem] uppercase tracking-[0.22em] text-museum-acid">Triple click DM logo to enter Control Room</p>
                </div>
                <div className="flex flex-wrap gap-5 text-museum-paper">
                  <a className="magnetic-line" href={owner.htmlUrl} target="_blank" rel="noreferrer">GitHub</a>
                  <a className="magnetic-line" href={process.env.NEXT_PUBLIC_LINKEDIN_URL || "#"} target="_blank" rel="noreferrer">LinkedIn</a>
                  <a className="magnetic-line" href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ck271138@gmail.com"}`}>Email</a>
                  <a className="magnetic-line" href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#"} target="_blank" rel="noreferrer">Instagram</a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
