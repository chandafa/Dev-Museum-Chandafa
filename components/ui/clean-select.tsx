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
  icon
}: {
  value: string;
  options: CleanSelectOption[];
  onChange: (value: string) => void;
  label: string;
  icon?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = useMemo(() => options.find((option) => option.value === value) ?? options[0], [options, value]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="clean-select group">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="clean-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
      >
        {icon ? <span className="clean-select-icon">{icon}</span> : null}
        <span className="clean-select-value">{selected?.label ?? label}</span>
        <ChevronDown className={`clean-select-chevron ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="clean-select-panel"
            role="listbox"
          >
            <div className="clean-select-panel-head">{label}</div>
            <div className="clean-select-options">
              {options.map((option) => {
                const active = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`clean-select-option ${active ? "is-active" : ""}`}
                  >
                    <span className="truncate">{option.label}</span>
                    {active ? <Check className="size-3.5 shrink-0" /> : null}
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
