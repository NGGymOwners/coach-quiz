import { QUESTIONS } from "./content";

export function parseAnswersFromParams(
  params: URLSearchParams | { get: (k: string) => string | null }
): Record<number, number> {
  const out: Record<number, number> = {};
  for (const q of QUESTIONS) {
    const raw = params.get(`q${q.id}`);
    if (!raw) continue;
    const v = parseInt(raw, 10);
    if (v >= 1 && v <= 5) out[q.id] = v;
  }
  return out;
}

export function letterGrade(score: number): string {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}
