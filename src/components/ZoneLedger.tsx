import type { Severity } from "../lib/types";
import { ZONES } from "../data/zones";

type Props = {
  severities: Record<string, Severity | undefined>;
  counts: Record<string, number>;
};

function dotColor(s: Severity | undefined): string {
  if (s === "high") return "bg-severity-high shadow-[0_0_8px_rgba(239,68,68,0.9)]";
  if (s === "medium") return "bg-severity-med shadow-[0_0_8px_rgba(245,158,11,0.8)]";
  if (s === "low") return "bg-severity-low shadow-[0_0_8px_rgba(74,222,128,0.7)]";
  return "bg-slate-600";
}

function statusText(s: Severity | undefined): string {
  if (s === "high") return "ALERT";
  if (s === "medium") return "WATCH";
  if (s === "low") return "MINOR";
  return "CLEAR";
}

function statusColor(s: Severity | undefined): string {
  if (s === "high") return "text-severity-high";
  if (s === "medium") return "text-severity-med";
  if (s === "low") return "text-severity-low";
  return "text-slate-500";
}

const CATEGORY_CODE: Record<string, string> = {
  gate: "GT",
  stand: "ST",
  concourse: "CN",
  facility: "FC",
};

export default function ZoneLedger({ severities, counts }: Props) {
  return (
    <div className="panel rounded-2xl overflow-hidden">
      <div className="panel-heading px-4 py-2.5 flex items-center justify-between">
        <div>
          <div className="text-[9px] font-mono tracking-[0.3em] text-brand-gold/80">
            SECTOR INDEX
          </div>
          <h3 className="font-display font-bold text-xs tracking-wide">
            ZONE TELEMETRY
          </h3>
        </div>
        <div className="text-[9px] font-mono text-slate-500 tracking-widest">
          {ZONES.length} ZONES
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-brand-gold/5">
        {ZONES.map((z, idx) => {
          const s = severities[z.id];
          const c = counts[z.id] ?? 0;
          return (
            <div
              key={z.id}
              className="bg-brand-navy-3/70 px-3 py-2.5 flex items-center gap-2.5 hover:bg-brand-navy-2/80 transition"
            >
              <div className="text-[9px] font-mono text-slate-600 w-6">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className={`w-2 h-2 rounded-full ${dotColor(s)} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-slate-200 truncate">
                  {z.label}
                </div>
                <div className="text-[9px] font-mono text-slate-500 tracking-widest">
                  {CATEGORY_CODE[z.category]} · <span className={statusColor(s)}>{statusText(s)}</span>
                </div>
              </div>
              {c > 0 && (
                <div className="text-[10px] font-mono font-bold text-brand-gold tabular">
                  ×{c}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
