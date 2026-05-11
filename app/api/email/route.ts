import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import {
  ARCHETYPES,
  CHAPTERS,
  type ArchetypeId,
  type ChapterId,
} from "@/lib/content";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GHL_TIMEOUT_MS = 5000;
const MIN_PHONE_DIGITS = 10;

const ARCHETYPE_IDS = new Set<string>([
  "operator",
  "inspirer",
  "firefighter",
  "architect",
]);
const CHAPTER_IDS = new Set<string>([
  "ch1",
  "ch2",
  "ch3",
  "ch4",
  "ch5",
  "ch6",
]);

type Payload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email: string;
  score?: number;
  archetype?: string;
  topGap?: string;
  topStrength?: string;
};

function normalizePhone(raw: string): { display: string; digits: string } {
  const digits = raw.replace(/\D+/g, "");
  return { display: raw.trim(), digits };
}

function scoreBand(score: number): string {
  if (score >= 85) return "85-100";
  if (score >= 70) return "70-84";
  if (score >= 55) return "55-69";
  if (score >= 40) return "40-54";
  return "0-39";
}

function chapterLabel(id: string | null | undefined): string | null {
  if (!id || !CHAPTER_IDS.has(id)) return null;
  return CHAPTERS[id as ChapterId].shortLabel;
}

function archetypeName(id: string | null | undefined): string | null {
  if (!id || !ARCHETYPE_IDS.has(id)) return null;
  return ARCHETYPES[id as ArchetypeId].name;
}

async function forwardToGHL(payload: Record<string, unknown>) {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return { skipped: true };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GHL_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 }
    );
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 }
    );
  }

  const firstName = (body.firstName ?? "").trim();
  const lastName = (body.lastName ?? "").trim();
  if (!firstName || !lastName) {
    return NextResponse.json(
      { ok: false, error: "invalid_name" },
      { status: 400 }
    );
  }

  const phoneRaw = (body.phone ?? "").trim();
  const { display: phoneDisplay, digits: phoneDigits } =
    normalizePhone(phoneRaw);
  if (phoneDigits.length < MIN_PHONE_DIGITS) {
    return NextResponse.json(
      { ok: false, error: "invalid_phone" },
      { status: 400 }
    );
  }

  const score = typeof body.score === "number" ? body.score : null;
  const archetype =
    typeof body.archetype === "string" && ARCHETYPE_IDS.has(body.archetype)
      ? body.archetype
      : null;
  const topGap =
    typeof body.topGap === "string" && CHAPTER_IDS.has(body.topGap)
      ? body.topGap
      : null;
  const topStrength =
    typeof body.topStrength === "string" && CHAPTER_IDS.has(body.topStrength)
      ? body.topStrength
      : null;

  const record = {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    phone: phoneDisplay,
    phoneDigits,
    email,
    score,
    scoreBand: score !== null ? scoreBand(score) : null,
    archetype,
    archetypeName: archetypeName(archetype),
    topGap,
    topGapLabel: chapterLabel(topGap),
    topStrength,
    topStrengthLabel: chapterLabel(topStrength),
    source: "coach-quiz",
    capturedAt: new Date().toISOString(),
    ua: request.headers.get("user-agent") ?? null,
  };

  console.log("[coach-quiz/email]", JSON.stringify(record));

  if (!process.env.VERCEL) {
    try {
      const dir =
        process.env.COACH_QUIZ_LOG_DIR ?? path.join(os.tmpdir(), "coach-quiz");
      await fs.mkdir(dir, { recursive: true });
      const logPath = path.join(dir, "emails.jsonl");
      await fs.appendFile(logPath, JSON.stringify(record) + "\n", "utf8");
    } catch (err) {
      console.error("[coach-quiz/api/email] local log write failed", err);
    }
  }

  const ghlResult = await forwardToGHL(record);
  console.log("[coach-quiz/email/ghl]", JSON.stringify(ghlResult));

  return NextResponse.json({ ok: true });
}
