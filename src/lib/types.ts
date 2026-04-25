import type { Timestamp } from "firebase/firestore";

export type Role = "steward" | "admin";

export type UserRecord = {
  phone: string;
  role: Role;
  displayName?: string;
  createdAt?: Timestamp;
};

export type IncidentType = "congestion" | "medical" | "spill" | "security";
export type Severity = "low" | "medium" | "high";
export type IncidentStatus = "active" | "resolved";

export type Incident = {
  id: string;
  zoneId: string;
  zoneLabel: string;
  type: IncidentType;
  severity: Severity;
  note?: string;
  reporterPhone: string;
  status: IncidentStatus;
  createdAt: Timestamp | null;
  resolvedAt?: Timestamp | null;
  resolvedBy?: string | null;
};

export type Session = {
  phone: string;
  role: Role;
};
