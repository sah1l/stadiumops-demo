import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { IncidentType, Role, Severity, UserRecord } from "./types";

export async function getUser(phone: string): Promise<UserRecord | null> {
  const snap = await getDoc(doc(db, "users", phone));
  return snap.exists() ? (snap.data() as UserRecord) : null;
}

export async function createUser(phone: string, role: Role): Promise<void> {
  await setDoc(doc(db, "users", phone), {
    phone,
    role,
    createdAt: serverTimestamp(),
  });
}

export async function reportIncident(input: {
  zoneId: string;
  zoneLabel: string;
  type: IncidentType;
  severity: Severity;
  note?: string;
  reporterPhone: string;
}): Promise<void> {
  await addDoc(collection(db, "incidents"), {
    ...input,
    note: input.note ?? "",
    status: "active",
    createdAt: serverTimestamp(),
    resolvedAt: null,
    resolvedBy: null,
  });
}

export async function resolveIncident(
  incidentId: string,
  adminPhone: string
): Promise<void> {
  await updateDoc(doc(db, "incidents", incidentId), {
    status: "resolved",
    resolvedAt: serverTimestamp(),
    resolvedBy: adminPhone,
  });
}

export const SEVERITY_RANK: Record<Severity, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export function higherSeverity(a: Severity, b: Severity): Severity {
  return SEVERITY_RANK[a] >= SEVERITY_RANK[b] ? a : b;
}
