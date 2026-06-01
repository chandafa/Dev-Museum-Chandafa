"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Command, CornerDownLeft, Github, Search, Sparkles } from "lucide-react";
import type { ArchivePayload, MuseumProject } from "@/types/project";
import { timeAgo } from "@/lib/utils";

const actions = [
  { id: "top", label: "Jump to entrance", hint: "Hero", href: "#top" },
  { id: "engine", label: "Open archive engine", hint: "Room 001", href: "#engine" },
  { id: "archive", label: "Inspect repository archive", hint: "Room 002", href: "#archive" },
  { id: "timeline", label: "Watch timeline film strip", hint: "Room 003", href: "#timeline" },
  { id: "system", label: "Open system overview", hint: "Room 004", href: "#system" },
  { id: "signal-theater", label: "Tune signal theater", hint: "Room 006", href: "#signal-theater" },
  { id: "exit-gift", label: "Print exit gift", hint: "PDF", href: "#exit-gift" }
];

export function CommandPalette({ archive }: { archive: ArchivePayload }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const projectResults = archive.projects
      .filter((project) => {
        const haystack = `${project.name} ${project.description} ${project.language ?? ""} ${project.category} ${project.topics.join(" ")}`.toLowerCase();
        return !normalized || haystack.includes(normalized);
      })
      .slice(0, 6)
      .map((project) => ({ type: "project" as const, project }));

    const actionResults = actions
      .filter((action) => !normalized || `${action.label} ${action.hint}`.toLowerCase().includes(normalized))
      .map((action) => ({ type: "action" as const, action }));

    return [...actionResults, ...projectResults].slice(0, 9);
  }, [archive.projects, query]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (!isTyping && event.key === "/") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => setActive(0), [query, open]);

  useEffect(() => {
    if (!open) return;
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((index) => Math.min(results.length - 1, index + 1));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((index) => Math.max(0, index - 1));
      }
      if (event.key === "Enter") {
        event.preventDefault();
        openResult(results[active]);
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [active, open, results]);

  const openResult = (result: (typeof results)[number] | undefined) => {
    if (!result) return;
    if (result.type === "action") {
      document.querySelector(result.action.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
      return;
    }
    window.open(result.project.url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="sr-only"
        aria-label="Open command palette"
      >
        <Command className="size-3.5" />
        Command
        <span className="rounded-full border border-museum-line/10 px-1.5 py-0.5 text-[0.48rem] text-museum-muted">Ctrl K</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[90] bg-museum-ink/55 p-4 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 18, opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-[12vh] max-w-[680px] overflow-hidden rounded-[1.4rem] border border-museum-line/15 bg-[var(--background)]/92 shadow-glass"
            >
              <div className="flex items-center gap-3 border-b border-museum-line/10 px-4 py-3">
                <Search className="size-4 text-museum-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search repository, room, stack, action..."
                  className="h-10 flex-1 bg-transparent text-sm text-museum-paper outline-none placeholder:text-museum-muted"
                />
                <span className="rounded-full border border-museum-line/10 px-2 py-1 text-[0.52rem] uppercase tracking-[0.14em] text-museum-muted">Esc</span>
              </div>

              <div className="max-h-[58vh] overflow-y-auto p-2">
                {results.length ? results.map((result, index) => (
                  <button
                    key={result.type === "action" ? result.action.id : result.project.id}
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onClick={() => openResult(result)}
                    className={`group flex w-full items-center justify-between gap-4 rounded-[1rem] px-3 py-3 text-left transition-colors ${active === index ? "bg-museum-paper text-museum-ink" : "text-museum-paper hover:bg-museum-paper/10"}`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className={`grid size-8 shrink-0 place-items-center rounded-full ${active === index ? "bg-museum-ink/10" : "bg-museum-paper/10"}`}>
                        {result.type === "action" ? <Sparkles className="size-3.5" /> : <Github className="size-3.5" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold tracking-[-0.04em]">
                          {result.type === "action" ? result.action.label : result.project.name}
                        </span>
                        <span className={`mt-0.5 block truncate text-[0.62rem] uppercase tracking-[0.13em] ${active === index ? "text-museum-ink/60" : "text-museum-muted"}`}>
                          {result.type === "action" ? result.action.hint : `${result.project.category} / ${result.project.language ?? "Unknown"} / ${timeAgo(result.project.updatedAt)}`}
                        </span>
                      </span>
                    </span>
                    <CornerDownLeft className="size-3.5 shrink-0 opacity-45" />
                  </button>
                )) : (
                  <div className="px-4 py-10 text-center text-sm text-museum-muted">No archive signal found.</div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-museum-line/10 px-4 py-3 text-[0.55rem] uppercase tracking-[0.16em] text-museum-muted">
                <span>{archive.stats.total} artifacts indexed</span>
                <span>Command Palette Overlay</span>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
