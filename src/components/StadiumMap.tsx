import type { Severity } from "../lib/types";
import {
  SECTORS,
  CX,
  CY,
  RINGS,
  SECTOR_ANGLE,
  ROT,
  polar,
  wedgePath,
  sectorMidAngle,
  fillFor,
  severityLabelColor,
  outerTabColor,
} from "./stadiumGeometry";

type ZoneSeverity = Record<string, Severity | undefined>;
type ZoneCount = Record<string, number>;

type Props = {
  severities: ZoneSeverity;
  counts?: ZoneCount;
};

export default function StadiumMap({ severities, counts = {} }: Props) {
  const zoneSectorMap: Record<string, number[]> = {};
  SECTORS.forEach((s, i) => {
    (zoneSectorMap[s.zoneId] ||= []).push(i);
  });

  return (
    <div className="relative w-full h-full panel rounded-2xl overflow-hidden corner-mark">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 radial-vignette" />
      <div className="absolute inset-0 scanlines pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 px-5 py-3 flex items-start justify-between z-10 panel-heading">
        <div>
          <div className="text-[9px] font-mono tracking-[0.4em] text-brand-gold/80">
            SECTOR MAP · REAL-TIME
          </div>
          <div className="text-sm font-display font-bold tracking-wide text-white">
            NARENDRA MODI STADIUM
            <span className="text-brand-gold ml-2">◆</span>
            <span className="text-slate-400 ml-2 text-xs font-mono font-normal">
              AHM-01
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-sm bg-severity-low shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            CLEAR
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-sm bg-severity-med shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            WATCH
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-sm bg-severity-high shadow-[0_0_10px_rgba(239,68,68,0.9)]" />
            ALERT
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-5 py-2 flex items-center justify-between z-10 border-t border-brand-gold/10 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-4 text-[9px] font-mono text-slate-400 tracking-widest">
          <span>SCALE 1:2400</span>
          <span className="text-brand-gold/60">·</span>
          <span>CAP 132,000</span>
          <span className="text-brand-gold/60">·</span>
          <span>16 SECTORS · 3 TIERS</span>
        </div>
        <div className="text-[9px] font-mono text-slate-400 tracking-widest">
          PROJECTION: ORTHO-TOP
        </div>
      </div>

      <svg
        viewBox="0 0 600 520"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="pitch-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#15803D" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#052E16" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="pitch-stripes" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <filter id="pitch-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <ellipse
          cx={CX}
          cy={CY + 6}
          rx={240}
          ry={185}
          fill="rgba(201,164,73,0.06)"
          filter="url(#pitch-glow)"
        />

        {SECTORS.map((sec, i) => {
          const a0 = ROT + i * SECTOR_ANGLE;
          const a1 = ROT + (i + 1) * SECTOR_ANGLE;
          const sev = severities[sec.zoneId];
          return (
            <g key={sec.letter}>
              {[0, 1, 2].map((ring) => {
                const inner = RINGS[ring];
                const outer = RINGS[ring + 1];
                const pad = 0.35;
                const d = wedgePath(inner, outer, a0 + pad, a1 - pad);
                return (
                  <path
                    key={ring}
                    d={d}
                    fill={fillFor(sev, ring)}
                    stroke="rgba(10,14,22,0.9)"
                    strokeWidth={0.8}
                    className="transition-all duration-500"
                  />
                );
              })}
              {sev === "high" && (
                <g
                  className="animate-ping"
                  style={{ transformOrigin: `${CX}px ${CY}px` }}
                >
                  <path
                    d={wedgePath(RINGS[0], RINGS[3], a0 + 0.35, a1 - 0.35)}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth={1.5}
                    opacity={0.5}
                  />
                </g>
              )}
            </g>
          );
        })}

        {SECTORS.map((sec, i) => {
          const angle = sectorMidAngle(i);
          const labelRx = (RINGS[0].rx + RINGS[1].rx) / 2;
          const labelRy = (RINGS[0].ry + RINGS[1].ry) / 2;
          const [x, y] = polar(labelRx, labelRy, angle);
          const sev = severities[sec.zoneId];
          return (
            <text
              key={`lbl-${sec.letter}`}
              x={x}
              y={y + 3}
              textAnchor="middle"
              className="text-[9px] font-display font-bold"
              fill={severityLabelColor(sev)}
              style={{ pointerEvents: "none" }}
            >
              {sec.letter}
            </text>
          );
        })}

        {SECTORS.map((sec, i) => {
          const a0 = ROT + i * SECTOR_ANGLE + 2;
          const a1 = ROT + (i + 1) * SECTOR_ANGLE - 2;
          const inner = { rx: RINGS[3].rx + 4, ry: RINGS[3].ry + 4 };
          const outer = { rx: RINGS[3].rx + 8, ry: RINGS[3].ry + 8 };
          const d = wedgePath(inner, outer, a0, a1);
          const sev = severities[sec.zoneId];
          return (
            <path
              key={`tab-${sec.letter}`}
              d={d}
              fill={outerTabColor(sev)}
              opacity={sev ? 0.95 : 0.35}
              className="transition-all duration-500"
            />
          );
        })}

        {Object.entries(zoneSectorMap).map(([zoneId, sectorIdxs]) => {
          const count = counts[zoneId] ?? 0;
          if (count === 0) return null;
          const sev = severities[zoneId];
          const midIdx = sectorIdxs[Math.floor(sectorIdxs.length / 2)];
          const angle = sectorMidAngle(midIdx);
          const [x, y] = polar(RINGS[3].rx + 22, RINGS[3].ry + 22, angle);
          return (
            <g
              key={`badge-${zoneId}`}
              transform={`translate(${x.toFixed(1)}, ${y.toFixed(1)})`}
            >
              <circle r={10} fill={outerTabColor(sev)} opacity={0.98} />
              <circle
                r={10}
                fill="none"
                stroke="rgba(10,14,22,0.9)"
                strokeWidth={1}
              />
              <text
                textAnchor="middle"
                y={3.5}
                className="text-[10px] font-mono font-bold"
                fill="#0B0F1A"
              >
                {count}
              </text>
            </g>
          );
        })}

        <g>
          <ellipse
            cx={CX}
            cy={CY}
            rx={RINGS[0].rx - 10}
            ry={RINGS[0].ry - 10}
            fill="url(#pitch-grad)"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1.5}
          />
          {[-1, 0, 1].map((i) => (
            <ellipse
              key={i}
              cx={CX + i * 24}
              cy={CY}
              rx={20}
              ry={RINGS[0].ry - 14}
              fill="url(#pitch-stripes)"
              opacity={0.6}
            />
          ))}
          <rect
            x={CX - 16}
            y={CY - 8}
            width={32}
            height={16}
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={1}
          />
          <line
            x1={CX}
            y1={CY - 8}
            x2={CX}
            y2={CY + 8}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={1}
          />
          <circle cx={CX} cy={CY} r={2.5} fill="rgba(255,255,255,0.8)" />
          <text
            x={CX}
            y={CY + 4}
            textAnchor="middle"
            fill="rgba(255,255,255,0.95)"
            className="text-[18px] font-display font-bold"
            style={{ letterSpacing: "0.05em" }}
          >
            I
          </text>
        </g>

        {[
          { id: "restroom-block-1", label: "RR", side: "W" as const },
          { id: "food-court", label: "FC", side: "E" as const },
        ].map((f) => {
          const angle = f.side === "W" ? 180 : 0;
          const [x, y] = polar(RINGS[3].rx + 38, RINGS[3].ry + 38, angle);
          const sev = severities[f.id];
          const c = counts[f.id] ?? 0;
          return (
            <g key={f.id}>
              <rect
                x={x - 12}
                y={y - 10}
                width={24}
                height={20}
                rx={3}
                fill={sev ? outerTabColor(sev) : "rgba(20,26,42,0.9)"}
                stroke={sev ? "rgba(10,14,22,0.9)" : "rgba(201,164,73,0.35)"}
                strokeWidth={1}
                opacity={sev ? 0.95 : 1}
              />
              <text
                x={x}
                y={y + 3}
                textAnchor="middle"
                className="text-[9px] font-mono font-bold"
                fill={sev ? "#0B0F1A" : "rgba(226,232,240,0.9)"}
              >
                {f.label}
              </text>
              {c > 0 && (
                <g transform={`translate(${x + 12}, ${y - 10})`}>
                  <circle r={6} fill={outerTabColor(sev)} />
                  <text
                    textAnchor="middle"
                    y={2.5}
                    className="text-[8px] font-mono font-bold"
                    fill="#0B0F1A"
                  >
                    {c}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {[
          {
            id: "concourse-upper",
            label: "UPPER CONCOURSE",
            angle: -90,
            offset: -28,
          },
          {
            id: "concourse-lower",
            label: "LOWER CONCOURSE",
            angle: 90,
            offset: 28,
          },
        ].map((c) => {
          const sev = severities[c.id];
          const [x, y] = polar(RINGS[3].rx + 34, RINGS[3].ry + 34, c.angle);
          return (
            <text
              key={c.id}
              x={x}
              y={y + (c.offset > 0 ? 4 : -4)}
              textAnchor="middle"
              fill={severityLabelColor(sev)}
              className="text-[9px] font-mono font-semibold"
              style={{ letterSpacing: "0.25em" }}
            >
              {c.label}
            </text>
          );
        })}

        <g transform="translate(50, 470)">
          <circle
            r={16}
            fill="rgba(11,15,26,0.85)"
            stroke="rgba(201,164,73,0.3)"
            strokeWidth={1}
          />
          <line
            x1={0}
            y1={-14}
            x2={0}
            y2={-6}
            stroke="#C9A449"
            strokeWidth={1.5}
          />
          <line
            x1={0}
            y1={6}
            x2={0}
            y2={14}
            stroke="rgba(201,164,73,0.3)"
            strokeWidth={1}
          />
          <line
            x1={-14}
            y1={0}
            x2={-6}
            y2={0}
            stroke="rgba(201,164,73,0.3)"
            strokeWidth={1}
          />
          <line
            x1={6}
            y1={0}
            x2={14}
            y2={0}
            stroke="rgba(201,164,73,0.3)"
            strokeWidth={1}
          />
          <text
            textAnchor="middle"
            y={-18}
            className="text-[8px] font-mono font-bold"
            fill="#C9A449"
          >
            N
          </text>
        </g>
      </svg>
    </div>
  );
}
