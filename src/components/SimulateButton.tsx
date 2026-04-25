import { Sparkles } from "lucide-react";
import { useState } from "react";
import { ZONES } from "../data/zones";
import { reportIncident } from "../lib/incidents";
import type { IncidentType, Severity } from "../lib/types";

const TYPES: IncidentType[] = ["congestion", "medical", "spill", "security"];
const SEVERITIES: Severity[] = ["low", "medium", "high"];
const NOTES = [
  "Large group blocking pathway",
  "Staff requested backup",
  "Fans waiting >10 min",
  "Barrier pushed over",
  "Need cleanup immediately",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SimulateButton() {
  const [busy, setBusy] = useState(false);

  async function fire() {
    setBusy(true);
    try {
      const zone = pick(ZONES);
      await reportIncident({
        zoneId: zone.id,
        zoneLabel: zone.label,
        type: pick(TYPES),
        severity: pick(SEVERITIES),
        note: pick(NOTES),
        reporterPhone: "+SIM-DEMO",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={fire}
      disabled={busy}
      className="flex items-center gap-2 rounded-lg bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-3 py-2 text-[11px] font-mono font-semibold uppercase tracking-widest transition disabled:opacity-60"
      title="Demo: inject a random incident"
    >
      <Sparkles size={14} />
      Inject Signal
    </button>
  );
}
