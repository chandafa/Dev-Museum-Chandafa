"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type CleanSelectOption = {
  value: string;
  label: string;
};

type PanelRect = {
  top: number;
  left: number;
  width: number;
};

export function CleanSelect({
  value,
  options,
  onChange,
  label,
  icon,
  className = ""
}: {
  value: string;
  options: CleanSelectOption[];
  onChange: (value: string) => void;
  label: string;
  icon?: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [panelRect, setPanelRect] = useState<PanelRect>({ top: 0, left: 0, width: 220 });
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const selected = useMemo(() => options.find((option) => option.value === value) ?? options[0], [options, value]);

  useEffect(() => setMounted(true), []);

  const updatePanelPosition = () => {
    const trigger = rootRef.current?.querySelector("button");
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const panelWidth = Math.max(rect.width, Math.min(280, window.innerWidth - 32));
    const left = Math.min(Math.max(16, rect.left), window.innerWidth - panelWidth - 16);
    setPanelRect({ top: rect.bottom + 8, left, width: panelWidth });
  };

  useEffect(() => {
    const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
    setActiveIndex(selectedIndex);
  }, [options, value]);

  useEffect(() => {
    if (!open) return;
    updatePanelPosition();
    const onReposition = () => updatePanelPosition();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeys = (event: KeyboardEvent) => {
      if (!open) {
        if (rootRef.current?.contains(document.activeElement) && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          setOpen(true);
        }
        return;
      }
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => Math.min(options.length - 1, index + 1));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => Math.max(0, index - 1));
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const target = options[activeIndex];
        if (target) {
          onChange(target.value);
          setOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", handleKeys);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", handleKeys);
    };
  }, [activeIndex, onChange, open, options]);

  const panel = mounted ? createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 10, scale: 0.985, clipPath: "inset(0 0 14% 0 round 16px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, clipPath: "inset(0 0 0% 0 round 16px)" }}
          exit={{ opacity: 0, y: 8, scale: 0.985, clipPath: "inset(0 0 18% 0 round 16px)" }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="clean-select-panel clean-select-panel-portal"
          role="listbox"
          style={{ top: panelRect.top, left: panelRect.left, width: panelRect.width }}
        >
          <div className="clean-select-panel-head">
            <span>{label}</span>
            <span className="clean-select-led" />
          </div>
          <div className="clean-select-options">
            {options.map((option, index) => {
              const active = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`clean-select-option ${active ? "is-active" : ""} ${activeIndex === index ? "is-keyboard-active" : ""}`}
                >
                  <span className="truncate">{option.label}</span>
                  {active ? <Check className="size-3.5 shrink-0" /> : <span className="clean-select-dot" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <div ref={rootRef} className={`clean-select group ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="clean-select-trigger mechanical-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
      >
        <span className="clean-select-rail" />
        {icon ? <span className="clean-select-icon">{icon}</span> : null}
        <span className="clean-select-value">{selected?.label ?? label}</span>
        <ChevronDown className={`clean-select-chevron ${open ? "rotate-180" : ""}`} />
      </button>
      {panel}
    </div>
  );
}
