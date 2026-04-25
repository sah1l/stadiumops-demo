import { useState } from "react";
import {
  AlertTriangle,
  HeartPulse,
  Droplets,
  ShieldAlert,
  Check,
  Radio,
  History,
} from "lucide-react";
import type { Incident, IncidentType, Severity } from "../lib/types";

const ICONS: Record<IncidentType, typeof AlertTriangle> = {
  congestion: AlertTriangle,
  medical: HeartPulse,
  spill: Droplets,
  security: ShieldAlert,
};

const TYPE_CODE: Record<IncidentType, string> = {
  congestion: "CGN",
  medical: "MED",
  spill: "SPL",
  security: "SEC",
};

function severityClasses(s: Severity, muted = false) {
  const op = muted ? "/50" : "";
  if (s === "high")
    return {
      rail: muted
        ? "bg-severity-high/25"
        : "bg-gradient-to-b from-severity-high to-severity-high/30",
      text: `text-severity-high${op}`,
      badge: `bg-severity-high/15 text-severity-high${op} border-severity-high/40`,
      glow: muted ? "" : "shadow-[inset_0_0_0_1px_rgba(239,68,68,0.25)]",
    };
  if (s === "medium")
    return {
      rail: muted
        ? "bg-severity-med/25"
        : "bg-gradient-to-b from-severity-med to-severity-med/30",
      text: `text-severity-med${op}`,
      badge: `bg-severity-med/15 text-severity-med${op} border-severity-med/40`,
      glow: "",
    };
  return {
    rail: muted
      ? "bg-severity-low/25"
      : "bg-gradient-to-b from-severity-low to-severity-low/30",
    text: `text-severity-low${op}`,
    badge: `bg-severity-low/15 text-severity-low${op} border-severity-low/40`,
    glow: "",
  };
}

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function fmtDuration(sec: number): string {
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = sec / 60;
  if (m < 60) return `${m.toFixed(1)}m`;
  return `${(m / 60).toFixed(1)}h`;
}

function shortId(id: string): string {
  return id.slice(-4).toUpperCase();
}

type Tab = "live" | "history";

type Props = {
  incidents: Incident[];
  resolved: Incident[];
  onResolve: (id: string) => void;
};

export default function IncidentFeed({ incidents, resolved, onResolve }: Props) {
  const [tab, setTab] = useState<Tab>("live");
  const list = tab === "live" ? incidents : resolved;

  return (
    <div className="h-full flex flex-col panel rounded-2xl overflow-hidden">
      <div className="panel-heading px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {tab === "live" ? (
            <Radio size={14} className="text-severity-high blink-soft" />
          ) : (
            <History size={14} className="text-brand-gold" />
          )}
          <div>
            <div className="text-[9px] font-mono tracking-[0.3em] text-brand-gold/80">
              {tab === "live" ? "TELEMETRY STREAM" : "ARCHIVE"}
            </div>
            <h3 className="font-display font-bold text-sm tracking-wide">
              {tab === "live" ? "LIVE INCIDENT FEED" : "RESOLVED HISTORY"}
            </h3>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-mono tracking-[0.25em] text-slate-500">
            {tab === "live" ? "ACTIVE" : "RESOLVED"}
          </div>
          <div className="text-xl font-display font-bold tabular text-white leading-none">
            {String(list.length).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex border-b border-brand-gold/10 bg-brand-ink/40">
        <button
          onClick={() => setTab("live")}
          className={`flex-1 px-4 py-2 text-[10px] font-mono font-semibold tracking-[0.25em] uppercase transition ${
            tab === "live"
              ? "text-brand-gold border-b-2 border-brand-gold bg-brand-gold/5"
              : "text-slate-500 border-b-2 border-transparent hover:text-slate-300"
          }`}
        >
          Live · {incidents.length}
        </button>
        <button
          onClick={() => setTab("history")}
          className={`flex-1 px-4 py-2 text-[10px] font-mono font-semibold tracking-[0.25em] uppercase transition ${
            tab === "history"
              ? "text-brand-gold border-b-2 border-brand-gold bg-brand-gold/5"
              : "text-slate-500 border-b-2 border-transparent hover:text-slate-300"
          }`}
        >
          History · {resolved.length}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 scanlines">
        {list.length === 0 && tab === "live" && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 px-6">
            <div className="w-14 h-14 rounded-full border border-severity-low/30 flex items-center justify-center mb-4">
              <Check size={24} className="text-severity-low" />
            </div>
            <div className="text-sm font-display font-semibold text-slate-300">
              All Zones Clear
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-1 tracking-wider">
              NO ACTIVE INCIDENTS
            </div>
          </div>
        )}
        {list.length === 0 && tab === "history" && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 px-6">
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mb-4">
              <History size={22} className="text-slate-500" />
            </div>
            <div className="text-sm font-display font-semibold text-slate-300">
              No History Yet
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-1 tracking-wider">
              RESOLVED INCIDENTS WILL APPEAR HERE
            </div>
          </div>
        )}
        {list.map((i) => {
          const Icon = ICONS[i.type];
          const created = i.createdAt?.toDate?.();
          const resolvedAt = i.resolvedAt?.toDate?.();
          const isHistory = tab === "history";
          const c = severityClasses(i.severity, isHistory);
          const resolutionSec =
            created && resolvedAt
              ? (resolvedAt.getTime() - created.getTime()) / 1000
              : null;
          return (
            <div
              key={i.id}
              className={`relative rounded-lg overflow-hidden border transition-all group ${
                isHistory
                  ? "bg-brand-navy-3/40 border-white/5 opacity-90"
                  : `bg-brand-navy-3/70 border-white/5 hover:border-brand-gold/20 ${c.glow}`
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${c.rail}`} />
              <div className="pl-4 pr-3 py-3">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${c.text}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-display font-bold text-sm capitalize tracking-wide ${isHistory ? "text-slate-300" : ""}`}
                        >
                          {i.type}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                          {TYPE_CODE[i.type]}-{shortId(i.id)}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${c.badge}`}
                      >
                        {i.severity}
                      </span>
                    </div>
                    <div
                      className={`text-[13px] mt-0.5 truncate font-medium ${isHistory ? "text-slate-400" : "text-slate-200"}`}
                    >
                      {i.zoneLabel}
                    </div>
                    {i.note && (
                      <div className="text-xs text-slate-500 mt-1.5 italic line-clamp-2 border-l-2 border-white/10 pl-2">
                        {i.note}
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-2 mt-2.5">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                        <span>{i.reporterPhone}</span>
                        <span className="text-brand-gold/40">·</span>
                        <span>
                          {created ? timeAgo(created) : "…"}
                        </span>
                      </div>
                      {isHistory ? (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold tracking-wider uppercase text-severity-low bg-severity-low/10 border border-severity-low/30 px-2.5 py-1 rounded">
                          <Check size={11} />
                          {resolutionSec != null
                            ? fmtDuration(resolutionSec)
                            : "resolved"}
                        </div>
                      ) : (
                        <button
                          onClick={() => onResolve(i.id)}
                          className="flex items-center gap-1.5 text-[10px] font-mono font-semibold tracking-wider uppercase text-brand-gold hover:text-brand-ink hover:bg-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded border border-brand-gold/30 transition-all"
                        >
                          <Check size={11} /> Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
