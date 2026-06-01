import type { ReactNode } from "react";

export function StatPill({ label, value, icon }: { label: string; value: string | number; icon?: ReactNode }) {
  return (
    <div className="glass-panel rounded-[0.8rem] px-2.5 py-2 sm:rounded-[0.95rem] sm:px-3.5 sm:py-2.5">
      <div className="flex items-center gap-1.5 text-[0.48rem] uppercase tracking-[0.14em] text-museum-muted sm:text-[0.58rem] sm:tracking-[0.18em]">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-base font-semibold tracking-[-0.06em] text-museum-paper sm:mt-1.5 sm:text-xl">{value}</div>
    </div>
  );
}
