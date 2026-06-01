"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, Sparkles, Ticket } from "lucide-react";
import type { ArchivePayload } from "@/types/project";

function ticketCode() {
  const array = new Uint32Array(2);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    array[0] = Math.floor(Math.random() * 0xffffffff);
    array[1] = Date.now();
  }
  const raw = `${array[0].toString(16)}${array[1].toString(16)}${Date.now().toString(16)}`;
  return `DM-${raw.slice(-8).toUpperCase()}`;
}

function pdfEscape(value: string | number) {
  return String(value).replace(/[^\x20-\x7E]/g, "?").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function makeTicketPdf({ code, owner, total, dominantLanguage, featuredArtifact }: { code: string; owner: string; total: number; dominantLanguage: string; featuredArtifact: string }) {
  const width = 760;
  const height = 330;
  const year = new Date().getFullYear();
  const truncate = (value: string, limit = 34) => (value.length > limit ? `${value.slice(0, limit - 3)}...` : value);
  const qrSquares = [
    [568, 140, 8], [580, 140, 8], [592, 140, 8], [616, 140, 8], [640, 140, 8],
    [568, 152, 8], [592, 152, 8], [604, 152, 8], [628, 152, 8], [652, 152, 8],
    [580, 164, 8], [604, 164, 8], [616, 164, 8], [640, 164, 8],
    [568, 176, 8], [592, 176, 8], [628, 176, 8], [652, 176, 8],
    [580, 188, 8], [604, 188, 8], [616, 188, 8], [640, 188, 8], [652, 188, 8]
  ];

  const barcode = Array.from({ length: 18 }, (_, index) => {
    const x = 560 + index * 6;
    const w = index % 3 === 0 ? 2.4 : index % 3 === 1 ? 1.1 : 3.2;
    const h = 34 + (index % 4) * 3;
    return `0.055 0.058 0.066 rg ${x.toFixed(1)} 74 ${w.toFixed(1)} ${h} re f`;
  });

  const lines = [
    "q",
    "0.965 0.953 0.918 rg 0 0 760 330 re f",
    "0.992 0.984 0.958 rg 34 34 692 262 re f",
    "0.055 0.058 0.066 RG 1.2 w 34 34 692 262 re S",
    "0.055 0.058 0.066 rg 34 268 692 28 re f",
    "0.843 1 0.345 rg 34 264 692 4 re f",
    "0.7 0.68 0.62 RG 0.65 w [4 5] 0 d 528 50 m 528 280 l S [] 0 d",
    "0.965 0.953 0.918 rg 516 25 24 24 re f 516 281 24 24 re f",
    "0.992 0.984 0.958 rg 48 48 456 204 re f",
    "0.055 0.058 0.066 rg",
    "BT /F2 10 Tf 54 278 Td (DEV MUSEUM / LIVING ARCHIVE) Tj ET",
    "BT /F1 44 Tf 54 216 Td (VISITOR TICKET) Tj ET",
    `BT /F2 12 Tf 56 184 Td (PASS CODE    ${pdfEscape(code)}) Tj ET`,
    `BT /F2 10 Tf 56 158 Td (VISITOR     @${pdfEscape(owner)}) Tj ET`,
    `BT /F2 10 Tf 56 138 Td (ARTIFACTS   ${pdfEscape(total)}) Tj ET`,
    `BT /F2 10 Tf 56 118 Td (STACK       ${pdfEscape(dominantLanguage)}) Tj ET`,
    `BT /F2 10 Tf 56 98 Td (FEATURED    ${pdfEscape(truncate(featuredArtifact, 40))}) Tj ET`,
    "0.72 0.70 0.64 RG 0.55 w 56 72 m 488 72 l S",
    "BT /F2 8 Tf 56 56 Td (Valid for one visit through the archive. Keep building. Keep returning.) Tj ET",
    "0.055 0.058 0.066 rg 558 224 112 34 re f",
    "0.992 0.984 0.958 rg",
    `BT /F2 13 Tf 575 236 Td (${pdfEscape(code)}) Tj ET`,
    "0.055 0.058 0.066 rg",
    "BT /F2 8 Tf 558 212 Td (CONTROL ROOM ACCESS / TRIPLE CLICK DM) Tj ET",
    "0.055 0.058 0.066 rg",
    ...qrSquares.map(([x, y, size]) => `0.055 0.058 0.066 rg ${x} ${y} ${size} ${size} re f`),
    ...barcode,
    `BT /F2 8 Tf 558 52 Td (ISSUED ${year} / DEV MUSEUM) Tj ET`,
    "0.055 0.058 0.066 RG 0.8 w 54 252 m 504 252 l S",
    "0.72 0.70 0.64 RG 0.6 w 558 126 m 678 126 l S",
    "Q"
  ];

  const stream = lines.join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj",
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj`,
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj",
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj",
    `6 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`
  ];

  let pdf = "%PDF-1.4\n% Dev Museum Ticket\n";
  const offsets = [0];
  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

const printSteps = ["Preparing paper stock", "Drawing ticket layout", "Embedding archive data", "Cutting PDF edges", "Ready to download"];

export function ExitGiftSection({ archive }: { archive: ArchivePayload }) {
  const [generated, setGenerated] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [printStep, setPrintStep] = useState(0);
  const [code, setCode] = useState("DM-READY");
  const dominantLanguage = useMemo(() => {
    const map = new Map<string, number>();
    archive.projects.forEach((project) => {
      if (project.language) map.set(project.language, (map.get(project.language) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";
  }, [archive.projects]);

  const best = archive.projects.slice().sort((a, b) => b.score - a.score)[0];

  const downloadTicket = (targetCode = code) => {
    const blob = makeTicketPdf({
      code: targetCode,
      owner: archive.owner.login,
      total: archive.stats.total,
      dominantLanguage,
      featuredArtifact: best?.name || "No artifact"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dev-museum-ticket-${targetCode.toLowerCase()}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printTicket = () => {
    if (printing) return;
    setPrinting(true);
    setGenerated(false);
    setPreviewReady(false);
    const nextCode = ticketCode();
    setCode(nextCode);
    setPrintStep(0);

    let step = 0;
    const interval = window.setInterval(() => {
      step += 1;
      setPrintStep(Math.min(step, printSteps.length - 1));
    }, 460);

    window.setTimeout(() => {
      window.clearInterval(interval);
      setPrintStep(printSteps.length - 1);
      setGenerated(true);
      setPreviewReady(true);
      setPrinting(false);
    }, 3150);
  };

  return (
    <section id="exit-gift" data-room="Exit Gift" className="museum-room relative px-6 py-14 sm:px-8 md:px-10 md:py-16 lg:px-0">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-museum-line/15 to-transparent" />
      <div className="mx-auto grid max-w-[960px] gap-5 lg:grid-cols-[0.68fr_1fr] lg:items-center">
        <motion.div
          initial={{ y: 34, opacity: 0, filter: "blur(8px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-2.5 text-[0.62rem] uppercase tracking-[0.28em] text-museum-acid">Exit Gift / 007</p>
          <h2 className="text-balance text-2xl font-semibold leading-[0.94] tracking-[-0.075em] text-museum-paper sm:text-3xl md:text-4xl">
            Every visitor leaves with a clean PDF museum ticket.
          </h2>
          <p className="mt-4 max-w-[28rem] text-xs leading-6 text-museum-muted md:text-sm">
            A printable souvenir generated from your GitHub archive: artifact count, dominant stack, strongest repository, owner identity, and a unique visit code.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 34, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.08, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[1.45rem] border border-museum-line/10 bg-museum-paper/[0.04] p-4 shadow-glass backdrop-blur-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(var(--museum-acid),0.12),transparent_36%),radial-gradient(circle_at_80%_70%,rgba(var(--museum-cyan),0.11),transparent_36%)]" />
          <div className="ticket-printer relative z-10 rounded-[1.15rem] border border-dashed border-museum-line/20 bg-museum-paper/[0.035] p-4 backdrop-blur-xl">
            <div className="ticket-printer-mouth" />
            <div className="absolute -right-3 top-1/2 size-7 -translate-y-1/2 rounded-full bg-[var(--background)]" />
            <div className="absolute -left-3 top-1/2 size-7 -translate-y-1/2 rounded-full bg-[var(--background)]" />
            <div className="flex items-center justify-between gap-3 border-b border-dashed border-museum-line/15 pb-3">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-museum-paper text-museum-ink"><Ticket className="size-4" /></span>
                <div>
                  <p className="text-[0.56rem] uppercase tracking-[0.22em] text-museum-muted">Visitor ticket</p>
                  <h3 className="text-xl font-semibold tracking-[-0.075em] text-museum-paper">Dev Museum Pass</h3>
                </div>
              </div>
              <span className="rounded-full border border-museum-line/10 px-3 py-1 text-[0.55rem] uppercase tracking-[0.18em] text-museum-acid">{code}</span>
            </div>

            <div className="grid gap-2.5 py-4 sm:grid-cols-2">
              <TicketField label="Artifacts" value={archive.stats.total} />
              <TicketField label="Dominant stack" value={dominantLanguage} />
              <TicketField label="Featured artifact" value={best?.name || "No artifact"} />
              <TicketField label="Owner" value={`@${archive.owner.login}`} />
            </div>

            <AnimatePresence>
              {printing ? (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-3 overflow-hidden rounded-[1rem] border border-museum-acid/20 bg-museum-acid/10 p-2.5"
                >
                  <div className="ticket-print-head mb-2 flex items-center justify-between text-[0.52rem] uppercase tracking-[0.16em] text-museum-acid">
                    <span>{printSteps[printStep]}</span>
                    <span>{Math.min(100, Math.round(((printStep + 1) / printSteps.length) * 100))}%</span>
                  </div>
                  <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-museum-paper/10">
                    <motion.div
                      className="h-full rounded-full bg-museum-acid"
                      initial={false}
                      animate={{ width: `${Math.min(100, Math.round(((printStep + 1) / printSteps.length) * 100))}%` }}
                      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <div className="ticket-print-preview">
                    <span className="ticket-print-feed" />
                    <span>Printing visitor pass</span>
                    <b>{code}</b>
                  </div>
                  <div className="mt-2 grid grid-cols-5 gap-1">
                    {printSteps.map((step, index) => (
                      <span key={step} className={`h-1 rounded-full ${index <= printStep ? "bg-museum-acid" : "bg-museum-paper/10"}`} />
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {previewReady ? (
                <motion.div
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="ticket-pdf-preview mb-3 overflow-hidden rounded-[1rem] border border-museum-line/10 bg-museum-paper/[0.06] p-3"
                >
                  <div className="ticket-preview-paper">
                    <div>
                      <p>Dev Museum Pass</p>
                      <h4>{code}</h4>
                    </div>
                    <span>{archive.stats.total} artifacts</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadTicket(code)}
                    className="mechanical-button mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-museum-line/10 bg-museum-paper px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-museum-ink transition-opacity hover:opacity-85"
                  >
                    Download previewed PDF <Download className="size-3.5" />
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <button
              type="button"
              onClick={printTicket}
              disabled={printing}
              className="mechanical-button group inline-flex w-full items-center justify-center gap-2 rounded-full bg-museum-paper px-4 py-3 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-museum-ink transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-70"
            >
              {printing ? "Printing PDF preview..." : generated ? "Generate another random ticket" : "Generate PDF ticket"}
              {generated && !printing ? <Sparkles className="size-4" /> : <Download className="size-4 transition-transform group-hover:translate-y-0.5" />}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TicketField({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[0.95rem] border border-museum-line/10 bg-museum-paper/[0.04] p-3">
      <p className="text-[0.52rem] uppercase tracking-[0.16em] text-museum-muted">{label}</p>
      <p className="mt-1.5 truncate text-base font-semibold tracking-[-0.055em] text-museum-paper">{value}</p>
    </div>
  );
}
