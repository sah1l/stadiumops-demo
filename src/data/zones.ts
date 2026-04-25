export type Zone = {
  id: string;
  label: string;
  category: "gate" | "concourse" | "stand" | "facility";
};

export const ZONES: Zone[] = [
  // Gates — one sector each
  { id: "gate-a", label: "Gate A (NW)", category: "gate" },
  { id: "gate-b", label: "Gate B (NE)", category: "gate" },
  { id: "gate-c", label: "Gate C (SE)", category: "gate" },
  { id: "gate-d", label: "Gate D (SW)", category: "gate" },

  // Stands — three sectors each
  { id: "stand-north-a", label: "North Stand · A", category: "stand" },
  { id: "stand-north-b", label: "North Stand · B", category: "stand" },
  { id: "stand-north-c", label: "North Stand · C", category: "stand" },
  { id: "stand-east-e", label: "East Pavilion · E", category: "stand" },
  { id: "stand-east-f", label: "East Pavilion · F", category: "stand" },
  { id: "stand-east-g", label: "East Pavilion · G", category: "stand" },
  { id: "stand-south-i", label: "South Stand · I", category: "stand" },
  { id: "stand-south-j", label: "South Stand · J", category: "stand" },
  { id: "stand-south-k", label: "South Stand · K", category: "stand" },
  { id: "stand-west-m", label: "West Stand · M", category: "stand" },
  { id: "stand-west-n", label: "West Stand · N", category: "stand" },
  { id: "stand-west-o", label: "West Stand · O", category: "stand" },

  // Concourses & facilities — off-ring
  { id: "concourse-upper", label: "Upper Concourse", category: "concourse" },
  { id: "concourse-lower", label: "Lower Concourse", category: "concourse" },
  { id: "restroom-block-1", label: "Restroom Block 1", category: "facility" },
  { id: "food-court", label: "Food Court", category: "facility" },
];

export function zoneById(id: string): Zone | undefined {
  return ZONES.find((z) => z.id === id);
}
