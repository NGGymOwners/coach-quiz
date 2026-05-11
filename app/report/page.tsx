"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, Suspense, useState, useEffect } from "react";
import { ARCHETYPES, CHAPTERS, type ChapterId } from "@/lib/content";
import { scoreQuiz } from "@/lib/archetypes";
import { parseAnswersFromParams, letterGrade } from "@/lib/parse-answers";
import RadarChart from "@/components/RadarChart";

const CHAPTER_ORDER: ChapterId[] = ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6"];

function ReportInner() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, [searchParams]);

  const result = useMemo(() => {
    const answers = parseAnswersFromParams(searchParams);
    if (Object.keys(answers).length < 9) return null;
    return scoreQuiz(answers);
  }, [searchParams]);

  async function copyShareLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (!result) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="text-center">
          <p className="text-foreground-muted mb-6">
            No result found. Take the quiz to see your report.
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

  return (
    <main className="flex-1 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <p className="font-display text-accent tracking-[0.3em] text-sm mb-2">
            YOUR FULL REPORT
          </p>
          <h1 className="font-display text-5xl sm:text-6xl mb-3">
            {archetype.name}
          </h1>
          <p className="text-foreground-muted">
            Score <span className="text-accent font-semibold">{result.total}</span> · Grade {letterGrade(result.total)}
          </p>
        </div>

        <section className="mb-12">
          <h2 className="font-display text-3xl tracking-widest text-accent mb-6 text-center">
            PILLAR BREAKDOWN
          </h2>
          <div className="bg-background-elevated rounded-lg p-6 border border-border mb-4">
            <RadarChart
              subScores={result.subScores}
              topGaps={result.hasMeaningfulGaps ? result.topGaps : []}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-base">
            {CHAPTER_ORDER.map((id) => {
              const ch = CHAPTERS[id];
              const score = result.subScores[id];
              const isGap =
                result.hasMeaningfulGaps && result.topGaps.includes(id);
              return (
                <div
                  key={id}
                  className={`px-4 py-3 rounded-md border ${
                    isGap
                      ? "border-accent bg-background-elevated"
                      : "border-border bg-background-elevated/50"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-foreground-muted text-sm">
                      Pillar {ch.number}
                    </span>
                    <span
                      className={`font-display text-2xl ${
                        isGap ? "text-accent" : "text-foreground-muted"
                      }`}
                    >
                      {score}
                    </span>
                  </div>
                  <div className="text-sm leading-tight">{ch.shortLabel}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-display text-3xl tracking-widest text-accent mb-6">
            {result.hasMeaningfulGaps
              ? "FOCUS HERE FIRST"
              : "AREAS TO DEEPEN"}
          </h2>
          {!result.hasMeaningfulGaps && (
            <p className="text-foreground-muted mb-6 text-lg">
              Your scores are well-balanced across the six pillars — there&apos;s no
              dominant gap. Two areas worth deepening anyway:
            </p>
          )}
          <div className="space-y-6">
            {result.topGaps.map((id) => {
              const ch = CHAPTERS[id];
              return (
                <div
                  key={id}
                  className="bg-background-elevated rounded-lg p-6 border border-border"
                >
                  <p className="font-display text-accent tracking-widest text-sm mb-2">
                    PILLAR {ch.number}
                  </p>
                  <h3 className="font-display text-3xl mb-3">{ch.title}</h3>
                  <p className="text-foreground-muted mb-5 leading-relaxed text-lg">
                    {ch.gapHeadline}
                  </p>
                  <ol className="space-y-4">
                    {ch.gapActions.map((action, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="font-display text-accent text-3xl leading-none">
                          0{i + 1}
                        </span>
                        <p className="leading-relaxed text-lg">{action}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </section>

        {/* "Get the book" CTA temporarily removed — restore this section to bring it back.
        <section className="bg-background-elevated rounded-lg p-8 border border-accent-dim text-center mb-8">
          <h3 className="font-display text-3xl mb-3">Want the full playbook?</h3>
          <p className="text-foreground-muted mb-6 max-w-lg mx-auto text-lg">
            This report previews two pillars. Next Generation Gym Owners covers all
            six pillars in depth, with worksheets you can run with your staff.
          </p>
          <a
            href="https://cheerhandbooks.com"
            className="inline-block bg-accent hover:bg-accent-hover text-background font-semibold px-8 py-3 rounded-md transition-colors"
          >
            Get the book
          </a>
        </section>
        */}

        <section className="text-center mt-8">
          <p className="font-display text-foreground-muted tracking-widest text-xs mb-4">
            SHARE YOUR RESULT
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={copyShareLink}
              className="inline-flex items-center gap-2 border border-border hover:border-accent text-foreground-muted hover:text-foreground px-5 py-2.5 rounded-md text-sm transition-colors"
            >
              {copied ? "✓ Copied" : "Copy link"}
            </button>
            {shareUrl && (
              <>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `I'm "${archetype.name}" — scored ${result.total}/100 on the Coach Development Style quiz.`
                  )}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border hover:border-accent text-foreground-muted hover:text-foreground px-5 py-2.5 rounded-md text-sm transition-colors"
                >
                  Share on X
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border hover:border-accent text-foreground-muted hover:text-foreground px-5 py-2.5 rounded-md text-sm transition-colors"
                >
                  Share on Facebook
                </a>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <ReportInner />
    </Suspense>
  );
}
