import type { HomeSectionContent } from "@/types/cms";

export function asRecord(v: unknown): HomeSectionContent | null {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    return v as HomeSectionContent;
  }
  return null;
}

export function getString(obj: HomeSectionContent | null, key: string): string | undefined {
  if (!obj) return undefined;
  const v = obj[key];
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}

export function getRecordArray(
  obj: HomeSectionContent | null,
  key: string
): HomeSectionContent[] {
  if (!obj) return [];
  const v = obj[key];
  if (!Array.isArray(v)) return [];
  return v.filter(
    (x): x is HomeSectionContent =>
      x !== null && typeof x === "object" && !Array.isArray(x)
  );
}
