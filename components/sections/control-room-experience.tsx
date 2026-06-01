"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Activity, Database, Gauge, GitBranch, Radio, RefreshCcw, ShieldCheck, SquareTerminal, Wrench, Zap } from "lucide-react";
import type { ArchivePayload } from "@/types/project";
import { formatDate, timeAgo } from "@/lib/utils";

type ControlMode = "diagnostics" | "restoration" | "transmission";
type PowerMode = "stable" | "boost" | "stealth";

export function ControlRoomExperience({ archive }: { archive: ArchivePayload }) {
  const [mode, setMode] = useState<ControlMode>("diagnostics");
  const [powerMode, setPowerMode] = useState<PowerMode>("stable");
  const [scanProgress, setScanProgress] = useState(42);
  const [scanCount, setScanCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    "Control room unlocked.",
    "GitHub archive feed connected.",
    "Waiting for operator command."
  ]);

  const latest = archive.projects.slice().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 8);
  const missingDescriptions = archive.projects.filter((project) => project.description.toLowerCase().includes("no description")).length;
  const missingDemo = archive.projects.filter((project) => !project.homepage).length;
  const dormant = archive.projects.filter((project) => project.status === "Dormant" || project.status === "Archived").length;
  const average = Math.round(archive.projects.reduce((total, project) => total + project.score, 0) / Math.max(archive.projects.length, 1));
  const strongest = archive.projects.slice().sort((a, b) => b.score - a.score)[0];

  const restorationQueue = useMemo(() => {
    return archive.projects
      .map((project) => ({
        ...project,
        issues: [
          project.description.toLowerCase().includes("no description") ? "description" : null,
          !project.homepage ? "demo" : null,
          project.topics.length === 0 ? "topics" : null,
          project.status === "Dormant" || project.status === "Archived" ? "activity" : null
        ].filter(Boolean) as string[]
      }))
      .filter((project) => project.issues.length > 0)
      .sort((a, b) => b.issues.length - a.issues.length)
      .slice(0, 6);
  }, [archive.projects]);

  const pushLog = (message: string) => {
    setLogs((items) => [message, ...items].slice(0, 7));
  };

  const runScan = () => {
    setScanCount((value) => value + 1);
    setScanProgress(0);
    pushLog("Deep scan started: indexing artifacts...");
    [20, 44, 71, 100].forEach((value, index) => {
      window.setTimeout(() => {
        setScanProgress(value);
        if (value === 100) pushLog(`Scan complete: ${archive.stats.total} artifacts verified.`);
        else pushLog(`Scan pulse ${index + 1}: ${value}% integrity mapped.`);
      }, 260 + index * 420);
    });
  };

  const stabilize = () => {
    setPowerMode("stable");
    setScanProgress((value) => Math.min(100, value + 8));
    pushLog("Stabilizer engaged: orbit drift reduced.");
  };

  const boost = () => {
    setPowerMode("boost");
    setScanProgress((value) => Math.max(8, value - 6));
    pushLog("Boost mode armed: transmission speed increased.");
  };

  const stealth = () => {
    setPowerMode("stealth");
    pushLog("Stealth mode enabled: archive lights dimmed.");
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 md:px-10 lg:px-0">
      <div className="museum-grid absolute inset-0 opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(var(--museum-acid),0.12),transparent_36%),radial-gradient(circle_at_80%_15%,rgba(var(--museum-cyan),0.13),transparent_34%)]" />
      <div className="relative z-10 mx-auto max-w-[1040px]">
        <header className="flex items-center justify-between gap-4">
          <a href="/" className="inline-flex items-center gap-2 rounded-full border border-museum-line/15 bg-museum-paper/[0.04] px-4 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-museum-paper backdrop-blur-xl transition-colors hover:bg-museum-paper/10">
            <ArrowLeft className="size-4" /> Back to museum
          </a>
          <span className="rounded-full border border-museum-line/15 bg-museum-ink/50 px-4 py-2 text-[0.58rem] uppercase tracking-[0.2em] text-museum-acid backdrop-blur-xl">Secret room unlocked</span>
        </header>

        <section className="pt-16">
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-3 text-[0.64rem] uppercase tracking-[0.34em] text-museum-acid">Control Room</motion.p>
          <motion.h1 initial={{ y: 60, opacity: 0, filter: "blur(10px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="max-w-4xl text-[clamp(3.4rem,9vw,8rem)] font-semibold leading-[0.82] tracking-[-0.11em] text-museum-paper">
            Archive systems behind the wall.
          </motion.h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-museum-muted">
            This hidden page opens only after clicking the DM logo three times. Now it behaves like a real operator room: scan, stabilize, boost, and inspect archive signals.
          </p>
        </section>

        <section className="mt-8 grid gap-3 md:grid-cols-4">
          <ControlMetric icon={<Database className="size-4" />} label="Repos" value={archive.stats.total} />
          <ControlMetric icon={<Activity className="size-4" />} label="Active" value={archive.stats.active} />
          <ControlMetric icon={<Gauge className="size-4" />} label="Avg score" value={average} />
          <ControlMetric icon={<GitBranch className="size-4" />} label="Forks" value={archive.stats.forks} />
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[0.88fr_1fr]">
          <div className="rounded-[1.35rem] border border-museum-line/10 bg-museum-paper/[0.04] p-4 shadow-glass backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between text-[0.58rem] uppercase tracking-[0.2em] text-museum-muted">
              <span>Operator console</span>
              <SquareTerminal className="size-4 text-museum-acid" />
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2 rounded-[1rem] border border-museum-line/10 bg-museum-ink/30 p-1.5">
              <ModeButton active={mode === "diagnostics"} onClick={() => { setMode("diagnostics"); pushLog("Diagnostics panel opened."); }} icon={<Gauge className="size-3.5" />} label="Diag" />
              <ModeButton active={mode === "restoration"} onClick={() => { setMode("restoration"); pushLog("Restoration queue opened."); }} icon={<Wrench className="size-3.5" />} label="Repair" />
              <ModeButton active={mode === "transmission"} onClick={() => { setMode("transmission"); pushLog("Transmission monitor opened."); }} icon={<Radio className="size-3.5" />} label="Signal" />
            </div>

            <div className="rounded-[1.1rem] border border-museum-line/10 bg-museum-ink/35 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.54rem] uppercase tracking-[0.18em] text-museum-muted">Integrity scan</p>
                  <p className="mt-1 text-2xl font-semibold tracking-[-0.075em] text-museum-paper">{scanProgress}%</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[0.56rem] uppercase tracking-[0.16em] ${powerMode === "boost" ? "bg-museum-ember/20 text-museum-ember" : powerMode === "stealth" ? "bg-museum-cyan/15 text-museum-cyan" : "bg-museum-acid text-museum-ink"}`}>{powerMode}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-museum-paper/10">
                <motion.div className="h-full rounded-full bg-museum-acid" animate={{ width: `${scanProgress}%` }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <ActionButton onClick={runScan} icon={<RefreshCcw className="size-4" />} label={scanCount > 0 ? "Run again" : "Run scan"} />
                <ActionButton onClick={stabilize} icon={<ShieldCheck className="size-4" />} label="Stabilize" />
                <ActionButton onClick={boost} icon={<Zap className="size-4" />} label="Boost" />
                <ActionButton onClick={stealth} icon={<Radio className="size-4" />} label="Stealth" />
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {logs.map((log, index) => (
                <motion.p key={`${log}-${index}`} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="rounded-[0.9rem] border border-museum-line/10 bg-museum-ink/30 px-3 py-2 text-[0.62rem] uppercase tracking-[0.12em] text-museum-muted">
                  &gt; {log}
                </motion.p>
              ))}
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-museum-line/10 bg-museum-paper/[0.04] p-4 shadow-glass backdrop-blur-2xl">
            {mode === "diagnostics" ? (
              <Panel title="Maintenance signals" icon={<ShieldCheck className="size-4 text-museum-acid" />}>
                <div className="space-y-2">
                  <Signal label="Missing descriptions" value={missingDescriptions} tone={missingDescriptions > 0 ? "warn" : "ok"} />
                  <Signal label="Missing demo links" value={missingDemo} tone={missingDemo > 0 ? "warn" : "ok"} />
                  <Signal label="Dormant / archived" value={dormant} tone={dormant > 0 ? "warn" : "ok"} />
                  <Signal label="Strongest artifact" value={strongest?.name || "None"} tone="ok" />
                </div>
              </Panel>
            ) : null}

            {mode === "restoration" ? (
              <Panel title="Restoration queue" icon={<Wrench className="size-4 text-museum-acid" />}>
                <div className="space-y-2">
                  {restorationQueue.length ? restorationQueue.map((project) => (
                    <div key={project.id} className="rounded-[1rem] border border-museum-line/10 bg-museum-ink/35 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate text-base font-semibold tracking-[-0.06em] text-museum-paper">{project.name}</h3>
                        <span className="rounded-full border border-museum-line/10 px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.14em] text-museum-acid">{project.score}/100</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {project.issues.map((issue) => <span key={issue} className="rounded-full bg-museum-ember/15 px-2.5 py-1 text-[0.52rem] uppercase tracking-[0.12em] text-museum-ember">needs {issue}</span>)}
                      </div>
                    </div>
                  )) : <p className="text-sm text-museum-muted">No artifacts need restoration. Clean museum. Suspiciously clean.</p>}
                </div>
              </Panel>
            ) : null}

            {mode === "transmission" ? (
              <Panel title="Latest transmissions" icon={<Radio className="size-4 text-museum-acid" />}>
                <div className="space-y-2">
                  {latest.map((project) => (
                    <div key={project.id} className="grid gap-2 rounded-[1rem] border border-museum-line/10 bg-museum-ink/35 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <h3 className="text-base font-semibold tracking-[-0.06em] text-museum-paper">{project.name}</h3>
                        <p className="mt-1 text-[0.62rem] uppercase tracking-[0.14em] text-museum-muted">{project.language || "Unknown"} / {project.status} / {timeAgo(project.updatedAt)}</p>
                      </div>
                      <span className="rounded-full border border-museum-line/10 px-3 py-1 text-[0.56rem] uppercase tracking-[0.16em] text-museum-acid">{project.score}/100</span>
                    </div>
                  ))}
                </div>
              </Panel>
            ) : null}
          </div>
        </section>

        <footer className="mt-10 border-t border-museum-line/10 pt-5 text-[0.62rem] uppercase tracking-[0.18em] text-museum-muted">
          Generated {formatDate(archive.generatedAt)} / @{archive.owner.login}
        </footer>
      </div>
    </main>
  );
}

function ControlMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-[1.15rem] border border-museum-line/10 bg-museum-paper/[0.04] p-4 shadow-glass backdrop-blur-2xl">
      <div className="mb-4 text-museum-acid">{icon}</div>
      <p className="text-[0.54rem] uppercase tracking-[0.18em] text-museum-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-[-0.08em] text-museum-paper">{value}</p>
    </div>
  );
}

function ModeButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[0.55rem] font-semibold uppercase tracking-[0.14em] transition-colors ${active ? "bg-museum-paper text-museum-ink" : "text-museum-muted hover:bg-museum-paper/10 hover:text-museum-paper"}`}>
      {icon} {label}
    </button>
  );
}

function ActionButton({ onClick, icon, label }: { onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center justify-center gap-2 rounded-full border border-museum-line/10 bg-museum-paper/[0.04] px-3 py-2.5 text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-museum-paper transition-colors hover:border-museum-acid/30 hover:bg-museum-paper/10">
      {icon} {label}
    </button>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <motion.div initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <div className="mb-4 flex items-center justify-between text-[0.58rem] uppercase tracking-[0.2em] text-museum-muted">
        <span>{title}</span>
        {icon}
      </div>
      {children}
    </motion.div>
  );
}

function Signal({ label, value, tone }: { label: string; value: string | number; tone: "ok" | "warn" }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1rem] border border-museum-line/10 bg-museum-ink/35 p-3">
      <span className="text-sm text-museum-paper">{label}</span>
      <span className={`max-w-[55%] truncate rounded-full px-3 py-1 text-[0.56rem] uppercase tracking-[0.16em] ${tone === "ok" ? "bg-museum-acid text-museum-ink" : "bg-museum-ember/20 text-museum-ember"}`}>{value}</span>
    </div>
  );
}
