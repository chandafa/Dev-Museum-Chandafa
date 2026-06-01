"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type CleanSelectOption = {
  value: string;
  label: string;
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
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = useMemo(() => options.find((option) => option.value === value) ?? options[0], [options, value]);

  useEffect(() => {
    const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
    setActiveIndex(selectedIndex);
  }, [options, value]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
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

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.985, clipPath: "inset(0 0 12% 0 round 16px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, clipPath: "inset(0 0 0% 0 round 16px)" }}
            exit={{ opacity: 0, y: 8, scale: 0.985, clipPath: "inset(0 0 18% 0 round 16px)" }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="clean-select-panel"
            role="listbox"
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
      </AnimatePresence>
    </div>
  );
}
