import { useMemo } from "react";
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
} from "./stadiumGeometry";
import { ZONES, zoneById } from "../data/zones";

type Props = {
  selectedZoneId: string;
  onSelect: (zoneId: string) => void;
};

const SECTOR_ZONE_IDS = Array.from(new Set(SECTORS.map((s) => s.zoneId)));
const FACILITY_ZONES = ZONES.filter(
  (z) => !SECTOR_ZONE_IDS.includes(z.id),
);

function pickerFill(active: boolean, ring: number): string {
  if (active) {
    return ring === 0 ? "#8A6F2C" : ring === 1 ? "#C9A449" : "#E6C76A";
  }
  return ring === 0 ? "#0F2540" : ring === 1 ? "#13345A" : "#1E4975";
}

function hoverFill(ring: number): string {
  return ring === 0 ? "#1A3759" : ring === 1 ? "#224979" : "#2D6096";
}

export default function StadiumMapPicker({ selectedZoneId, onSelect }: Props) {
  const selectedLabel = useMemo(
    () => zoneById(selectedZoneId)?.label ?? "",
    [selectedZoneId],
  );

  const isFacilitySelected = FACILITY_ZONES.some(
    (z) => z.id === selectedZoneId,
  );

  return (
    <div className="space-y-3">
      <div className="relative panel rounded-2xl overflow-hidden corner-mark">
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
        <div className="absolute inset-0 radial-vignette pointer-events-none" />
        <div className="absolute inset-0 scanlines pointer-events-none" />

        <div className="absolute top-0 left-0 right-0 px-4 py-2.5 flex items-start justify-between z-10 panel-heading pointer-events-none">
          <div>
            <div className="text-[9px] font-mono tracking-[0.35em] text-brand-gold/80">
              TAP A SECTOR
            </div>
            <div className="text-xs font-display font-bold tracking-wide text-white">
              {isFacilitySelected ? "— " : ""}
              {selectedLabel || "SELECT ZONE"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-mono tracking-[0.3em] text-slate-500">
              SELECTED
            </div>
            <div className="text-[10px] font-mono font-bold text-brand-gold">
              {isFacilitySelected ? "FACILITY" : selectedZoneId.toUpperCase()}
            </div>
          </div>
        </div>

        <svg
          viewBox="0 0 600 520"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="picker-pitch-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#15803D" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#052E16" stopOpacity="1" />
            </radialGradient>
            <linearGradient
              id="picker-pitch-stripes"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* each sector becomes a button group */}
          {SECTORS.map((sec, i) => {
            const a0 = ROT + i * SECTOR_ANGLE;
            const a1 = ROT + (i + 1) * SECTOR_ANGLE;
            const active = selectedZoneId === sec.zoneId;
            return (
              <g
                key={sec.letter}
                onClick={() => onSelect(sec.zoneId)}
                className="cursor-pointer group"
                role="button"
                aria-label={`Sector ${sec.letter} · ${zoneById(sec.zoneId)?.label}`}
              >
                {[0, 1, 2].map((ring) => {
                  const inner = RINGS[ring];
                  const outer = RINGS[ring + 1];
                  const pad = 0.35;
                  const d = wedgePath(inner, outer, a0 + pad, a1 - pad);
                  return (
                    <path
                      key={ring}
                      d={d}
                      fill={pickerFill(active, ring)}
                      stroke="rgba(10,14,22,0.9)"
                      strokeWidth={0.8}
                      className="transition-all duration-200"
                      onMouseOver={(e) => {
                        if (!active) {
                          (e.currentTarget as SVGPathElement).setAttribute(
                            "fill",
                            hoverFill(ring),
                          );
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!active) {
                          (e.currentTarget as SVGPathElement).setAttribute(
                            "fill",
                            pickerFill(false, ring),
                          );
                        }
                      }}
                    />
                  );
                })}
                {active && (
                  <path
                    d={wedgePath(RINGS[0], RINGS[3], a0 + 0.35, a1 - 0.35)}
                    fill="none"
                    stroke="#E6C76A"
                    strokeWidth={2}
                    opacity={0.9}
                    pointerEvents="none"
                  />
                )}
              </g>
            );
          })}

          {/* sector letters */}
          {SECTORS.map((sec, i) => {
            const angle = sectorMidAngle(i);
            const labelRx = (RINGS[0].rx + RINGS[1].rx) / 2;
            const labelRy = (RINGS[0].ry + RINGS[1].ry) / 2;
            const [x, y] = polar(labelRx, labelRy, angle);
            const active = selectedZoneId === sec.zoneId;
            return (
              <text
                key={`lbl-${sec.letter}`}
                x={x}
                y={y + 3}
                textAnchor="middle"
                className="text-[9px] font-display font-bold"
                fill={active ? "#0B0F1A" : "rgba(226,232,240,0.8)"}
                style={{ pointerEvents: "none" }}
              >
                {sec.letter}
              </text>
            );
          })}

          {/* pitch */}
          <g pointerEvents="none">
            <ellipse
              cx={CX}
              cy={CY}
              rx={RINGS[0].rx - 10}
              ry={RINGS[0].ry - 10}
              fill="url(#picker-pitch-grad)"
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
                fill="url(#picker-pitch-stripes)"
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
          </g>

          {/* N compass */}
          <text
            x={CX}
            y={RINGS[3].ry * 0 + 30}
            textAnchor="middle"
            fill="#C9A449"
            className="text-[9px] font-mono font-bold"
            style={{ letterSpacing: "0.3em" }}
            pointerEvents="none"
          >
            N ▲
          </text>
        </svg>
      </div>

      {/* Facility pills for zones not on the ring */}
      <div>
        <div className="text-[9px] font-mono tracking-[0.3em] text-slate-500 mb-2">
          OR PICK A FACILITY
        </div>
        <div className="grid grid-cols-2 gap-2">
          {FACILITY_ZONES.map((z) => {
            const active = selectedZoneId === z.id;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => onSelect(z.id)}
                className={`rounded-lg px-3 py-2.5 text-xs font-mono font-semibold tracking-wider uppercase border transition text-left ${
                  active
                    ? "border-brand-gold bg-brand-gold/15 text-brand-gold"
                    : "border-white/10 bg-brand-ink text-slate-300 hover:border-white/30"
                }`}
              >
                {z.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
