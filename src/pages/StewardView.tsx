import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  HeartPulse,
  Droplets,
  ShieldAlert,
  CheckCircle2,
  LogOut,
  Send,
  Clock,
} from "lucide-react";
import { clearSession, getSession } from "../lib/session";
import { ZONES, zoneById } from "../data/zones";
import { reportIncident } from "../lib/incidents";
import type { IncidentType, Severity, Incident } from "../lib/types";
import StadiumMapPicker from "../components/StadiumMapPicker";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const TYPES: { id: IncidentType; label: string; Icon: typeof AlertTriangle }[] =
  [
    { id: "congestion", label: "Congestion", Icon: AlertTriangle },
    { id: "medical", label: "Medical", Icon: HeartPulse },
    { id: "spill", label: "Spill", Icon: Droplets },
    { id: "security", label: "Security", Icon: ShieldAlert },
  ];

const SEVERITIES: Severity[] = ["low", "medium", "high"];

function typeMeta(t: IncidentType) {
  return TYPES.find((x) => x.id === t)!;
}

function severityClass(s: Severity): string {
  return s === "high"
    ? "bg-severity-high/20 text-severity-high border-severity-high/30"
    : s === "medium"
      ? "bg-severity-med/20 text-severity-med border-severity-med/30"
      : "bg-severity-low/20 text-severity-low border-severity-low/30";
}

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function StewardView() {
  const nav = useNavigate();
  const session = getSession();

  const [zoneId, setZoneId] = useState(ZONES[0].id);
  const [type, setType] = useState<IncidentType>("congestion");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [justSent, setJustSent] = useState<string | null>(null);
  const [mine, setMine] = useState<Incident[]>([]);

  useEffect(() => {
    if (!session) {
      nav("/login", { replace: true });
    }
  }, [session, nav]);

  useEffect(() => {
    if (!session) return;
    const q = query(
      collection(db, "incidents"),
      where("reporterPhone", "==", session.phone),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      const arr: Incident[] = snap.docs.slice(0, 10).map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Incident, "id">),
      }));
      setMine(arr);
    });
    return () => unsub();
  }, [session?.phone]);

  const zoneLabel = useMemo(
    () => zoneById(zoneId)?.label ?? "",
    [zoneId]
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setBusy(true);
    try {
      await reportIncident({
        zoneId,
        zoneLabel,
        type,
        severity,
        note: note.trim(),
        reporterPhone: session.phone,
      });
      setJustSent(`${severity.toUpperCase()} ${type} at ${zoneLabel}`);
      setNote("");
      setTimeout(() => setJustSent(null), 3000);
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    clearSession();
    nav("/login", { replace: true });
  }

  if (!session) return null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-brand-ink/90 backdrop-blur border-b border-white/5">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-brand-gold font-semibold">
              STEWARD · GT
            </div>
            <div className="font-mono text-sm">{session.phone}</div>
          </div>
          <button
            onClick={logout}
            className="text-slate-400 hover:text-white p-2"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-5 space-y-6 pb-20">
        <section>
          <h2 className="text-lg font-semibold mb-3">Report Incident</h2>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-sm text-slate-300 block mb-2">
                Zone
              </label>
              <StadiumMapPicker
                selectedZoneId={zoneId}
                onSelect={setZoneId}
              />
            </div>

            <div>
              <label className="text-sm text-slate-300 block mb-2">
                Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map(({ id, label, Icon }) => {
                  const active = type === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setType(id)}
                      className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-4 transition ${
                        active
                          ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                          : "border-white/10 bg-brand-ink hover:border-white/30"
                      }`}
                    >
                      <Icon size={22} />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 block mb-2">
                Severity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SEVERITIES.map((s) => {
                  const active = severity === s;
                  const activeCls =
                    s === "high"
                      ? "border-severity-high bg-severity-high/20 text-severity-high"
                      : s === "medium"
                        ? "border-severity-med bg-severity-med/20 text-severity-med"
                        : "border-severity-low bg-severity-low/20 text-severity-low";
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeverity(s)}
                      className={`rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wider border transition ${
                        active
                          ? activeCls
                          : "border-white/10 bg-brand-ink text-slate-300 hover:border-white/30"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 block mb-2">
                Note <span className="text-slate-500">(optional)</span>
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. 20+ people, no staff visible"
                maxLength={120}
                className="w-full rounded-lg bg-brand-ink border border-white/10 px-4 py-3 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-gold hover:bg-brand-gold-2 disabled:opacity-60 text-brand-ink font-bold py-4 text-lg transition"
            >
              <Send size={18} />
              Submit Report
            </button>

            {justSent && (
              <div className="flex items-center gap-2 rounded-lg bg-severity-low/15 border border-severity-low/30 text-severity-low px-4 py-3 text-sm">
                <CheckCircle2 size={18} />
                Reported: {justSent}
              </div>
            )}
          </form>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock size={18} className="text-brand-gold" />
            My Recent Reports
          </h2>
          {mine.length === 0 && (
            <div className="text-slate-500 text-sm italic">
              No reports yet — submit one above.
            </div>
          )}
          <ul className="space-y-2">
            {mine.map((i) => {
              const meta = typeMeta(i.type);
              const t = i.createdAt?.toDate?.();
              return (
                <li
                  key={i.id}
                  className="rounded-xl border border-white/5 bg-brand-navy-2 p-3 flex items-center gap-3"
                >
                  <div
                    className={`rounded-lg border p-2 ${severityClass(i.severity)}`}
                  >
                    <meta.Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {meta.label} · {i.zoneLabel}
                    </div>
                    <div className="text-xs text-slate-400">
                      {i.severity.toUpperCase()} ·{" "}
                      {t ? timeAgo(t) : "sending…"}
                    </div>
                  </div>
                  <div
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      i.status === "active"
                        ? "bg-severity-high/20 text-severity-high"
                        : "bg-severity-low/20 text-severity-low"
                    }`}
                  >
                    {i.status}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
