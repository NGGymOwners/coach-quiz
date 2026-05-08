"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, LIKERT_OPTIONS } from "@/lib/content";

export default function QuizPage() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const q = QUESTIONS[idx];
  const total = QUESTIONS.length;
  const progress = ((idx + (answers[q.id] ? 1 : 0)) / total) * 100;
  const current = answers[q.id];

  function pick(value: number) {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (idx + 1 < total) {
      setTimeout(() => setIdx(idx + 1), 180);
    } else {
      const params = new URLSearchParams();
      QUESTIONS.forEach((qq) => {
        const v = next[qq.id];
        if (v) params.set(`q${qq.id}`, String(v));
      });
      router.push(`/result?${params.toString()}`);
    }
  }

  function back() {
    if (idx > 0) setIdx(idx - 1);
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        <div className="flex items-center justify-between mb-8 text-sm text-foreground-muted">
          <span className="font-display tracking-widest">
            QUESTION {idx + 1} / {total}
          </span>
          <button
            onClick={back}
            disabled={idx === 0}
            className="disabled:opacity-30 hover:text-foreground transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="h-1 bg-background-elevated rounded-full mb-12 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-accent font-display tracking-widest text-sm mb-4">
          {q.pillar.toUpperCase()}
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold leading-snug mb-10">
          {q.prompt}
        </h2>

        <div className="space-y-3">
          {LIKERT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => pick(opt.value)}
              className={`w-full text-left px-5 py-4 rounded-md border transition-all ${
                current === opt.value
                  ? "border-accent bg-background-elevated"
                  : "border-border hover:border-border-strong bg-background-elevated/40"
              }`}
            >
              <span className="text-foreground-muted text-sm font-mono mr-4">
                {opt.value}
              </span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
