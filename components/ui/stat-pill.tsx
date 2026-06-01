import { ReactNode } from "react";

export function StatPill({ label, value, icon }: { label: string; value: string | number; icon?: ReactNode }) {
  return (
    <div className="glass-panel rounded-[0.95rem] px-3.5 py-2.5">
      <div className="flex items-center gap-1.5 text-[0.58rem] uppercase tracking-[0.18em] text-museum-muted">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 text-xl font-semibold tracking-[-0.06em] text-museum-paper">{value}</div>
    </div>
  );
}
