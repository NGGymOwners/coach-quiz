import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  email: string;
  score?: number;
  archetype?: string;
  topGap?: string;
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const record = {
    email,
    score: typeof body.score === "number" ? body.score : null,
    archetype: typeof body.archetype === "string" ? body.archetype : null,
    topGap: typeof body.topGap === "string" ? body.topGap : null,
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

  return NextResponse.json({ ok: true });
}
