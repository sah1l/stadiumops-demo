import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { clearSession, getSession } from "../lib/session";
import { higherSeverity, resolveIncident } from "../lib/incidents";
import type { Incident, Severity } from "../lib/types";
import StadiumMap from "../components/StadiumMap";
import IncidentFeed from "../components/IncidentFeed";
import StatsStrip from "../components/StatsStrip";
import SimulateButton from "../components/SimulateButton";
import ZoneLedger from "../components/ZoneLedger";
import LiveClock from "../components/LiveClock";

export default function AdminView() {
  const nav = useNavigate();
  const session = getSession();

  const [active, setActive] = useState<Incident[]>([]);
  const [recentResolved, setRecentResolved] = useState<Incident[]>([]);

  useEffect(() => {
    if (!session) {
      nav("/login", { replace: true });
    }
  }, [session, nav]);

  useEffect(() => {
    const qActive = query(
      collection(db, "incidents"),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(qActive, (snap) => {
      const arr: Incident[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Incident, "id">),
      }));
      setActive(arr);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const qResolved = query(
      collection(db, "incidents"),
      where("status", "==", "resolved"),
      orderBy("resolvedAt", "desc"),
    );
    const unsub = onSnapshot(qResolved, (snap) => {
      const arr: Incident[] = snap.docs.slice(0, 50).map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Incident, "id">),
      }));
      setRecentResolved(arr);
    });
    return () => unsub();
  }, []);

  const zoneSeverities = useMemo(() => {
    const m: Record<string, Severity | undefined> = {};
    for (const i of active) {
      m[i.zoneId] = m[i.zoneId]
        ? higherSeverity(m[i.zoneId]!, i.severity)
        : i.severity;
    }
    return m;
  }, [active]);

  const zoneCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const i of active) {
      m[i.zoneId] = (m[i.zoneId] ?? 0) + 1;
    }
    return m;
  }, [active]);

  const last15min = useMemo(() => {
    const cutoff = Date.now() - 15 * 60 * 1000;
    const count = (list: Incident[]) =>
      list.filter((i) => {
        const t = i.createdAt?.toDate?.()?.getTime() ?? 0;
        return t >= cutoff;
      }).length;
    return count(active) + count(recentResolved);
  }, [active, recentResolved]);

  const avgResolutionSec = useMemo(() => {
    const times = recentResolved
      .map((i) => {
        const c = i.createdAt?.toDate?.()?.getTime();
        const r = i.resolvedAt?.toDate?.()?.getTime();
        if (!c || !r) return null;
        return (r - c) / 1000;
      })
      .filter((x): x is number => x != null && x >= 0);
    if (times.length === 0) return null;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }, [recentResolved]);

  const threatLevel = useMemo<Severity | null>(() => {
    const vals = Object.values(zoneSeverities).filter(Boolean) as Severity[];
    if (vals.length === 0) return null;
    return vals.reduce((acc, s) => higherSeverity(acc, s), vals[0]);
  }, [zoneSeverities]);

  async function handleResolve(id: string) {
    if (!session) return;
    await resolveIncident(id, session.phone);
  }

  function logout() {
    clearSession();
    nav("/login", { replace: true });
  }

  if (!session) return null;

  const threatClass =
    threatLevel === "high"
      ? "text-severity-high border-severity-high/40 bg-severity-high/10"
      : threatLevel === "medium"
        ? "text-severity-med border-severity-med/40 bg-severity-med/10"
        : threatLevel === "low"
          ? "text-severity-low border-severity-low/40 bg-severity-low/10"
          : "text-severity-low border-severity-low/30 bg-severity-low/5";

  const threatLabel =
    threatLevel === "high"
      ? "CRITICAL"
      : threatLevel === "medium"
        ? "ELEVATED"
        : threatLevel === "low"
          ? "GUARDED"
          : "NOMINAL";

  return (
    <div className="min-h-screen flex flex-col bg-brand-ink relative">
      {/* ambient backdrop */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(201,164,73,0.08),transparent_60%)]" />

      <header className="sticky top-0 z-20 bg-brand-ink/90 backdrop-blur-md border-b border-brand-gold/15">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-gold to-brand-gold-3 flex items-center justify-center shadow-[0_0_16px_-4px_rgba(201,164,73,0.6)]">
                <ShieldCheck size={18} className="text-brand-ink" />
              </div>
              <div>
                <div className="text-[9px] tracking-[0.35em] text-brand-gold/80 font-mono font-semibold">
                  OPS COMMAND · GUJARAT TITANS
                </div>
                <div className="text-lg font-display font-bold leading-tight">
                  Stadium<span className="text-brand-gold">Ops</span>
                  <span className="ml-2 text-[10px] font-mono text-slate-500 font-normal tracking-widest">
                    v1.0
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border ${threatClass}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" />
              <div>
                <div className="text-[8px] font-mono tracking-[0.3em] opacity-70">
                  THREAT LEVEL
                </div>
                <div className="text-[11px] font-mono font-bold tracking-widest">
                  {threatLabel}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LiveClock />
            <div className="w-px h-10 bg-brand-gold/15" />
            <SimulateButton />
            <div className="hidden sm:block text-right">
              <div className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-mono">
                OPERATOR
              </div>
              <div className="font-mono text-[11px] text-slate-300">
                {session.phone}
              </div>
            </div>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-brand-gold p-2 border border-white/5 hover:border-brand-gold/30 rounded transition"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-5 space-y-4 relative z-10">
        <StatsStrip
          active={active.length}
          last15min={last15min}
          avgResolutionSec={avgResolutionSec}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="h-[560px]">
              <StadiumMap severities={zoneSeverities} counts={zoneCounts} />
            </div>
            <ZoneLedger severities={zoneSeverities} counts={zoneCounts} />
          </div>
          <div className="min-h-[60vh] lg:h-[calc(560px+theme(spacing.4)+192px)]">
            <IncidentFeed
              incidents={active}
              resolved={recentResolved}
              onResolve={handleResolve}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-brand-gold/10 bg-brand-ink/80 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500 tracking-widest">
          <div className="flex items-center gap-4">
            <span>SYS: ONLINE</span>
            <span className="text-brand-gold/40">·</span>
            <span>FIRESTORE: SYNCED</span>
            <span className="text-brand-gold/40">·</span>
            <span className="hidden md:inline">STREAM: REAL-TIME</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-severity-low blink-soft" />
            <span>ALL SYSTEMS NOMINAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
