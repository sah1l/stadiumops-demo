import type { Severity } from "../lib/types";

/* 16 radial sectors around a green pitch.
   Sector -> zoneId mapping from src/data/zones.ts:
     N Stand (A,B,C)  · Gate B (D)  · E Stand (E,F,G)  · Gate C (H)
     S Stand (I,J,K)  · Gate D (L)  · W Stand (M,N,O)  · Gate A (P) */
export const SECTORS: { letter: string; zoneId: string }[] = [
  { letter: "A", zoneId: "stand-north-a" },
  { letter: "B", zoneId: "stand-north-b" },
  { letter: "C", zoneId: "stand-north-c" },
  { letter: "D", zoneId: "gate-b" },
  { letter: "E", zoneId: "stand-east-e" },
  { letter: "F", zoneId: "stand-east-f" },
  { letter: "G", zoneId: "stand-east-g" },
  { letter: "H", zoneId: "gate-c" },
  { letter: "I", zoneId: "stand-south-i" },
  { letter: "J", zoneId: "stand-south-j" },
  { letter: "K", zoneId: "stand-south-k" },
  { letter: "L", zoneId: "gate-d" },
  { letter: "M", zoneId: "stand-west-m" },
  { letter: "N", zoneId: "stand-west-n" },
  { letter: "O", zoneId: "stand-west-o" },
  { letter: "P", zoneId: "gate-a" },
];

export const CX = 300;
export const CY = 260;

export const RINGS = [
  { rx: 118, ry: 90 },
  { rx: 152, ry: 118 },
  { rx: 186, ry: 144 },
  { rx: 222, ry: 170 },
];

export const SECTOR_COUNT = 16;
export const SECTOR_ANGLE = 360 / SECTOR_COUNT;
export const ROT = -90 - SECTOR_ANGLE / 2;

export function polar(rx: number, ry: number, angleDeg: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [CX + rx * Math.cos(rad), CY + ry * Math.sin(rad)];
}

export function wedgePath(
  rInner: { rx: number; ry: number },
  rOuter: { rx: number; ry: number },
  a0: number,
  a1: number,
): string {
  const [x0o, y0o] = polar(rOuter.rx, rOuter.ry, a0);
  const [x1o, y1o] = polar(rOuter.rx, rOuter.ry, a1);
  const [x0i, y0i] = polar(rInner.rx, rInner.ry, a0);
  const [x1i, y1i] = polar(rInner.rx, rInner.ry, a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return [
    `M ${x0o.toFixed(2)} ${y0o.toFixed(2)}`,
    `A ${rOuter.rx} ${rOuter.ry} 0 ${large} 1 ${x1o.toFixed(2)} ${y1o.toFixed(2)}`,
    `L ${x1i.toFixed(2)} ${y1i.toFixed(2)}`,
    `A ${rInner.rx} ${rInner.ry} 0 ${large} 0 ${x0i.toFixed(2)} ${y0i.toFixed(2)}`,
    "Z",
  ].join(" ");
}

export function sectorMidAngle(i: number): number {
  return ROT + (i + 0.5) * SECTOR_ANGLE;
}

export function fillFor(sev: Severity | undefined, ring: number): string {
  if (sev === "high") {
    return ring === 0 ? "#7F1D1D" : ring === 1 ? "#B91C1C" : "#EF4444";
  }
  if (sev === "medium") {
    return ring === 0 ? "#78350F" : ring === 1 ? "#B45309" : "#F59E0B";
  }
  if (sev === "low") {
    return ring === 0 ? "#166534" : ring === 1 ? "#15803D" : "#22C55E";
  }
  return ring === 0 ? "#0F2540" : ring === 1 ? "#13345A" : "#1E4975";
}

export function severityLabelColor(sev: Severity | undefined): string {
  if (sev === "high") return "#FCA5A5";
  if (sev === "medium") return "#FCD34D";
  if (sev === "low") return "#86EFAC";
  return "rgba(226,232,240,0.75)";
}

export function outerTabColor(sev: Severity | undefined): string {
  if (sev === "high") return "#EF4444";
  if (sev === "medium") return "#F59E0B";
  if (sev === "low") return "#4ADE80";
  return "#475569";
}
