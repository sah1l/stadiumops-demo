import { Activity, AlertOctagon, Timer } from "lucide-react";

type Props = {
  active: number;
  last15min: number;
  avgResolutionSec: number | null;
};

type Variant = "high" | "gold" | "low";

function fmtDuration(sec: number | null): string {
  if (sec == null) return "—";
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = sec / 60;
  if (m < 60) return `${m.toFixed(1)}m`;
  return `${(m / 60).toFixed(1)}h`;
}

const VARIANT: Record<Variant, {
  rail: string;
  iconBg: string;
  iconText: string;
  glow: string;
}> = {
  high: {
    rail: "bg-severity-high",
    iconBg: "bg-severity-high/10",
    iconText: "text-severity-high",
    glow: "shadow-[0_0_24px_-4px_rgba(239,68,68,0.45)]",
  },
  gold: {
    rail: "bg-brand-gold",
    iconBg: "bg-brand-gold/10",
    iconText: "text-brand-gold",
    glow: "shadow-[0_0_24px_-6px_rgba(201,164,73,0.35)]",
  },
  low: {
    rail: "bg-severity-low",
    iconBg: "bg-severity-low/10",
    iconText: "text-severity-low",
    glow: "shadow-[0_0_24px_-6px_rgba(74,222,128,0.35)]",
  },
};

function StatCard({
  label,
  value,
  sub,
  code,
  Icon,
  variant,
  glowActive,
}: {
  label: string;
  value: string;
  sub: string;
  code: string;
  Icon: typeof Activity;
  variant: Variant;
  glowActive: boolean;
}) {
  const v = VARIANT[variant];
  return (
    <div className="flex-1 relative panel rounded-xl overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${v.rail}`} />
      <div className="absolute top-2 right-3 text-[9px] font-mono tracking-[0.3em] text-slate-500">
        {code}
      </div>
      <div className="px-5 pt-5 pb-4 flex items-center gap-4">
        <div className={`rounded-lg p-3 ${v.iconBg} ring-1 ring-inset ring-white/5 ${glowActive ? v.glow : ""}`}>
          <Icon size={22} className={v.iconText} />
        </div>
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-medium">
            {label}
          </div>
          <div className="text-3xl font-display font-bold tabular text-white leading-none mt-1.5">
            {value}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-1.5">
            {sub}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatsStrip({
  active,
  last15min,
  avgResolutionSec,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <StatCard
        label="Active Incidents"
        value={String(active).padStart(2, "0")}
        sub={active === 0 ? "all clear" : "requires attention"}
        code="MTR-01"
        Icon={AlertOctagon}
        variant="high"
        glowActive={active > 0}
      />
      <StatCard
        label="Last 15 Minutes"
        value={String(last15min).padStart(2, "0")}
        sub="new reports"
        code="MTR-02"
        Icon={Activity}
        variant="gold"
        glowActive={false}
      />
      <StatCard
        label="Avg Resolution"
        value={fmtDuration(avgResolutionSec)}
        sub="rolling window"
        code="MTR-03"
        Icon={Timer}
        variant="low"
        glowActive={false}
      />
    </div>
  );
}
