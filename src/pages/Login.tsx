import { useNavigate } from "react-router-dom";
import { ShieldCheck, Users, ArrowRight, Radio } from "lucide-react";
import { setSession } from "../lib/session";
import type { Role } from "../lib/types";

export default function Login() {
  const nav = useNavigate();

  function pick(role: Role) {
    const phone = role === "admin" ? "+DEMO-ADMIN" : "+DEMO-STEWARD";
    setSession({ phone, role });
    nav(role === "admin" ? "/admin" : "/steward");
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-10 bg-brand-ink overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(201,164,73,0.1),transparent_60%)]" />
      <div className="absolute inset-0 scanlines pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-brand-gold/25 bg-brand-gold/5 mb-6">
            <Radio size={12} className="text-severity-high blink-soft" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-brand-gold/90">
              GUJARAT TITANS · OPS COMMAND
            </span>
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tight">
            Stadium<span className="text-brand-gold">Ops</span>
          </h1>
          <p className="text-slate-400 mt-3 text-sm font-mono tracking-wider">
            REAL-TIME CROWD OPERATIONS · MATCH DAY CONTROL
          </p>
        </div>

        <div className="panel rounded-2xl corner-mark p-6 sm:p-8 relative">
          <div className="text-center mb-6">
            <div className="text-[10px] font-mono tracking-[0.35em] text-brand-gold/80">
              SELECT ROLE
            </div>
            <div className="text-slate-400 text-xs mt-2 font-mono">
              Choose how you want to enter the demo
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => pick("steward")}
              className="group relative text-left panel rounded-xl p-5 hover:border-brand-gold/50 transition-all overflow-hidden"
            >
              <div className="absolute top-3 right-3 text-[9px] font-mono tracking-[0.3em] text-slate-500">
                ROLE-01
              </div>
              <div className="w-11 h-11 rounded-lg bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center text-brand-gold mb-4">
                <Users size={20} />
              </div>
              <div className="font-display font-bold text-lg tracking-wide">
                Steward
              </div>
              <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                On-ground staff. Report incidents from any zone with type,
                severity and notes.
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold tracking-[0.2em] text-brand-gold mt-4 group-hover:translate-x-0.5 transition-transform">
                ENTER FIELD VIEW <ArrowRight size={12} />
              </div>
            </button>

            <button
              onClick={() => pick("admin")}
              className="group relative text-left panel rounded-xl p-5 hover:border-brand-gold/50 transition-all overflow-hidden"
            >
              <div className="absolute top-3 right-3 text-[9px] font-mono tracking-[0.3em] text-slate-500">
                ROLE-02
              </div>
              <div className="w-11 h-11 rounded-lg bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center text-brand-gold mb-4">
                <ShieldCheck size={20} />
              </div>
              <div className="font-display font-bold text-lg tracking-wide">
                Ops Admin
              </div>
              <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Command center. Watch the live stadium map, monitor
                telemetry and resolve incidents.
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold tracking-[0.2em] text-brand-gold mt-4 group-hover:translate-x-0.5 transition-transform">
                ENTER CONTROL ROOM <ArrowRight size={12} />
              </div>
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-brand-gold/10 text-center text-[10px] font-mono text-slate-500 tracking-widest">
            DEMO MODE · NO AUTHENTICATION
          </div>
        </div>

        <div className="text-center text-[10px] font-mono text-slate-600 mt-6 tracking-widest">
          V1.0 · DEMO BUILD · NARENDRA MODI STADIUM AHM-01
        </div>
      </div>
    </div>
  );
}
