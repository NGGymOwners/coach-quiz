import Link from "next/link";

export default function Landing() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full text-center">
        <p className="font-display text-accent text-xl tracking-[0.3em] mb-6">
          NEXT GENERATION GYM OWNERS
        </p>
        <h1 className="font-display text-6xl sm:text-8xl leading-[0.95] mb-6">
          Staff Development
          <br />
          <span className="text-accent">Audit</span>
        </h1>
        <p className="text-foreground-muted text-xl mb-10 max-w-xl mx-auto">
          A 9-question diagnostic for cheer gym owners. Score how well you train
          your coaches across the six pillars that separate good programs from
          great ones — and find out where to focus next.
        </p>
        <Link
          href="/quiz"
          className="inline-block bg-accent hover:bg-accent-hover text-background font-semibold px-10 py-4 rounded-md transition-colors text-xl"
        >
          Start the quiz
        </Link>
        <p className="text-foreground-dim text-base mt-6">
          ~90 seconds · No email required to start
        </p>
      </div>
    </main>
  );
}
