"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import { ARCHETYPES, CHAPTERS } from "@/lib/content";
import { scoreQuiz } from "@/lib/archetypes";
import { parseAnswersFromParams, letterGrade } from "@/lib/parse-answers";

function ResultInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const result = useMemo(() => {
    const answers = parseAnswersFromParams(searchParams);
    if (Object.keys(answers).length < 9) return null;
    return scoreQuiz(answers);
  }, [searchParams]);

  if (!result) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="text-center">
          <p className="text-foreground-muted mb-6">
            We couldn&apos;t find your quiz answers. Take the quiz to see your result.
          </p>
          <a
            href="/quiz"
            className="inline-block bg-accent hover:bg-accent-hover text-background font-semibold px-8 py-3 rounded-md"
          >
            Start the quiz
          </a>
        </div>
      </main>
    );
  }

  const archetype = ARCHETYPES[result.archetype];

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!result) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          score: result.total,
          archetype: result.archetype,
          topGap: result.topGaps[0],
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setSubmitError(
          data.error === "invalid_email"
            ? "That email doesn't look right. Try again?"
            : "Something went wrong. Try again?"
        );
        setSubmitting(false);
        return;
      }
    } catch {
      setSubmitError("Couldn't reach the server. Check your connection.");
      setSubmitting(false);
      return;
    }
    const reportParams = new URLSearchParams(searchParams.toString());
    router.push(`/report?${reportParams.toString()}`);
  }

  return (
    <main className="flex-1 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-display text-accent tracking-[0.3em] text-sm mb-4">
            YOUR RESULT
          </p>
          <div className="flex items-baseline justify-center gap-3 mb-2">
            <span className="font-display text-8xl sm:text-9xl text-accent">
              {result.total}
            </span>
            <span className="font-display text-3xl text-foreground-muted">
              / 100
            </span>
          </div>
          <p className="text-foreground-muted text-lg">
            Grade: <span className="text-foreground font-semibold">{letterGrade(result.total)}</span>
          </p>
        </div>

        <div className="bg-background-elevated rounded-lg p-8 mb-10 border border-border">
          <p className="font-display text-accent tracking-widest text-base mb-2">
            ARCHETYPE
          </p>
          <h2 className="font-display text-5xl sm:text-6xl mb-3">
            {archetype.name}
          </h2>
          <p className="text-accent text-xl italic mb-5">{archetype.tagline}</p>
          <p className="text-foreground-muted leading-relaxed text-lg">
            {archetype.description}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div>
            <p className="font-display text-accent tracking-widest text-sm mb-3">
              TOP STRENGTHS
            </p>
            <ul className="space-y-2">
              {result.topStrengths.map((id) => (
                <li
                  key={id}
                  className="bg-background-elevated px-4 py-3 rounded-md border border-border text-lg"
                >
                  <span className="text-foreground-muted text-sm mr-2">
                    Pillar {CHAPTERS[id].number}
                  </span>
                  {CHAPTERS[id].shortLabel}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-accent tracking-widest text-sm mb-3">
              {result.hasMeaningfulGaps ? "TOP GAPS" : "AREAS TO DEEPEN"}
            </p>
            <ul className="space-y-2">
              {result.topGaps.map((id) => (
                <li
                  key={id}
                  className="bg-background-elevated px-4 py-3 rounded-md border border-border relative overflow-hidden text-lg"
                >
                  <span className="text-foreground-muted text-sm mr-2">
                    Pillar {CHAPTERS[id].number}
                  </span>
                  <span className="blur-sm select-none">
                    {CHAPTERS[id].shortLabel}
                  </span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-accent">
                    🔒
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-background-elevated rounded-lg p-8 border border-border">
          <h3 className="font-display text-3xl mb-2">
            Unlock your personalized report
          </h3>
          <p className="text-foreground-muted mb-6 text-lg">
            Get the full pillar-by-pillar breakdown plus 2 specific actions for each gap.
          </p>
          <form onSubmit={unlock} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gym.com"
              className="flex-1 bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-accent hover:bg-accent-hover text-background font-semibold px-6 py-3 rounded-md disabled:opacity-50 transition-colors"
            >
              {submitting ? "Unlocking…" : "Unlock report →"}
            </button>
          </form>
          {submitError && (
            <p className="text-red-400 text-sm mt-3">{submitError}</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <ResultInner />
    </Suspense>
  );
}
