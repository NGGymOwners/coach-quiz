export type ChapterId = "ch1" | "ch2" | "ch3" | "ch4" | "ch5" | "ch6";
export type ArchetypeId = "operator" | "inspirer" | "firefighter" | "architect";

export type Question = {
  id: number;
  chapter: ChapterId;
  pillar: string;
  prompt: string;
};

export type Chapter = {
  id: ChapterId;
  number: number;
  title: string;
  shortLabel: string;
  questions: number[];
  gapHeadline: string;
  gapActions: [string, string];
};

export type Archetype = {
  id: ArchetypeId;
  name: string;
  tagline: string;
  description: string;
};

export const LIKERT_OPTIONS: { value: 1 | 2 | 3 | 4 | 5; label: string }[] = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neither" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
];

export const QUESTIONS: Question[] = [
  {
    id: 1,
    chapter: "ch1",
    pillar: "Reliability & accountability",
    prompt:
      "My coaches have written standards for punctuality, dress, and accountability — and we actually enforce them.",
  },
  {
    id: 2,
    chapter: "ch1",
    pillar: "Boundaries & professionalism",
    prompt:
      "My coaches know exactly what's appropriate to share with parents and athletes — and what stays internal.",
  },
  {
    id: 3,
    chapter: "ch1",
    pillar: "Communication training",
    prompt:
      "We've explicitly trained our coaches on how to handle hard conversations with parents.",
  },
  {
    id: 4,
    chapter: "ch2",
    pillar: "Role clarity across the gym",
    prompt:
      "Every coach understands how their work connects to front desk, marketing, and ownership decisions.",
  },
  {
    id: 5,
    chapter: "ch3",
    pillar: "Coaching philosophy & values",
    prompt:
      "My coaches can articulate our gym's coaching philosophy and the values behind it.",
  },
  {
    id: 6,
    chapter: "ch3",
    pillar: "Coaching language & mindset",
    prompt:
      "My coaches use deliberate language patterns and growth-mindset framing — not just 'good job' or 'try harder.'",
  },
  {
    id: 7,
    chapter: "ch4",
    pillar: "Burnout & sustainability",
    prompt:
      "I can spot burnout in a coach early, and we have a real plan when it shows up.",
  },
  {
    id: 8,
    chapter: "ch5",
    pillar: "Crisis & safeguarding",
    prompt:
      "If a child disclosed self-harm or abuse to a coach tomorrow, I know exactly what would happen in the first hour.",
  },
  {
    id: 9,
    chapter: "ch6",
    pillar: "Competitive culture",
    prompt:
      "We deliberately train athletes' competitive mindset — not just skills — and our coaches know how to do it.",
  },
];

export const CHAPTERS: Record<ChapterId, Chapter> = {
  ch1: {
    id: "ch1",
    number: 1,
    title: "You're Not Just Here to Coach",
    shortLabel: "Coach as Employee",
    questions: [1, 2, 3],
    gapHeadline:
      "Your coaches are operating without the basics: written standards, clear boundaries, and the language to handle hard parent conversations.",
    gapActions: [
      "Put your standards in writing — punctuality, dress, accountability, boundaries with families. Make it part of onboarding, not a Slack message after the fact.",
      "Run a 30-minute monthly 'hard conversation' rehearsal with your staff. Practice talking to a frustrated parent or a struggling athlete out loud — under pressure is the wrong place to learn.",
    ],
  },
  ch2: {
    id: "ch2",
    number: 2,
    title: "Understanding the Big Picture",
    shortLabel: "Role Clarity",
    questions: [4],
    gapHeadline:
      "Your coaches see their team and their team only. They don't understand how front desk, marketing, custodial, and ownership all feed each other.",
    gapActions: [
      "In your next staff meeting, have each role explain — out loud — how their work depends on every other role. The first time this is awkward; that's how you know it's needed.",
      "Walk every coach through your gym's vision and how their team contributes to it. If they can't restate it in 30 seconds, you haven't trained it.",
    ],
  },
  ch3: {
    id: "ch3",
    number: 3,
    title: "Coaching With Purpose",
    shortLabel: "Philosophy & Mindset",
    questions: [5, 6],
    gapHeadline:
      "Your coaches don't have a coaching philosophy — they have habits. And the language they default to under pressure reinforces a fixed mindset, not a growth one.",
    gapActions: [
      "Have every coach write their coaching philosophy and top five values in plain language. Review them as a staff. Discrepancies between what they say and how they coach are the work.",
      "Pick one feedback habit to replace this month. Stop 'good job' and 'you're so talented.' Start naming the specific effort, technique, or decision you actually saw.",
    ],
  },
  ch4: {
    id: "ch4",
    number: 4,
    title: "Avoiding Burnout",
    shortLabel: "Burnout & Sustainability",
    questions: [7],
    gapHeadline:
      "Burnout in your gym is treated as a crisis after the fact, not something you spot and prevent. By the time it shows up, the coach is already gone — emotionally, then literally.",
    gapActions: [
      "Build a quarterly 1-on-1 with every coach focused on workload, recovery, and life outside the gym. Not a survey — a real conversation, on the calendar, recurring.",
      "Define what 'off the clock' actually means at your gym. Protect at least one weeknight per coach as non-negotiable. Model it yourself — coaches copy what owners do, not what owners say.",
    ],
  },
  ch5: {
    id: "ch5",
    number: 5,
    title: "Protecting Athletes Beyond the Mat",
    shortLabel: "Crisis & Safeguarding",
    questions: [8],
    gapHeadline:
      "If a real crisis hit your gym tomorrow — a disclosure, a self-harm comment, a parent emergency — your coaches would improvise. That's the gap.",
    gapActions: [
      "Write your three core response plans this week: allegations of harm, self-harm situations, and major external events. Run a 30-minute staff walkthrough — paper plans don't survive contact with stress unless you've practiced them.",
      "Lock in your two-adult policy and digital communication policy. Both protect athletes and protect coaches. Neither is optional.",
    ],
  },
  ch6: {
    id: "ch6",
    number: 6,
    title: "Building a Competitive Spirit",
    shortLabel: "Competitive Culture",
    questions: [9],
    gapHeadline:
      "Your coaches train skills well. Mindset, grit, and competitive spirit are treated as things athletes either have or don't — instead of things you build.",
    gapActions: [
      "Add micro-competitions to weekly practice: head-to-head drills, 'next skill is mine' cues, pressure reps after conditioning. Discomfort is part of the program, not a problem.",
      "Recognize grit publicly every week. Pick one athlete who showed competitive spirit — not necessarily a win — and call it out in front of the team. What you celebrate is what gets repeated.",
    ],
  },
};

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  operator: {
    id: "operator",
    name: "The Operator",
    tagline: "You've built the machine. Now build the soul of it.",
    description:
      "You run a tight ship. Standards are clear, systems work, expectations are written down — and that's no small feat. But the parts of coaching that don't show up on a checklist (philosophy, mindset language, the human side of crisis response) haven't gotten the same investment. Your gym performs. The next move is making sure it also forms athletes who'll remember why they came.",
  },
  inspirer: {
    id: "inspirer",
    name: "The Inspirer",
    tagline: "Your coaches feel something — but they're flying without instruments.",
    description:
      "Your gym has heart. Coaches care, athletes feel seen, and culture is real — not a poster on the wall. The risk is that without systems, standards, and crisis preparation, all of that depends on individual people staying motivated forever. The day a key coach leaves — or burns out — the magic is fragile. Your work is to build the structure underneath the inspiration.",
  },
  firefighter: {
    id: "firefighter",
    name: "The Firefighter",
    tagline: "You're putting out fires daily. Let's build the fire department.",
    description:
      "Right now most of your week is reactive. Standards aren't written, philosophy is implicit, crisis response is improvised, burnout is dealt with after the fact. None of this means you're a bad owner — it usually means you're carrying too much yourself. The honest news: every gap in this report is fixable, and the order of operations matters. Start with the two flagged below. Don't try to fix everything at once.",
  },
  architect: {
    id: "architect",
    name: "The Architect",
    tagline: "You've cracked it. Here's how to stay there.",
    description:
      "You're in the top tier — roughly 1 in 10 owners who scored this high with this little skew. Your coaches are trained across systems, philosophy, mindset, crisis, and competitive culture. The risk now isn't gaps; it's drift. Standards slip when you stop noticing them. Use this report to spot which pillar is the first to soften, and put your annual review there.",
  },
};

export const NORMALIZE = (raw: number, max: number) =>
  Math.round(((raw - 1) / (max - 1)) * 100);

export const SUB_SCORE = (answers: Record<number, number>, qIds: number[]) => {
  const vals = qIds.map((q) => answers[q] ?? 3);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return NORMALIZE(avg, 5);
};

export const TOTAL_SCORE = (answers: Record<number, number>) => {
  const raw = QUESTIONS.reduce((acc, q) => acc + (answers[q.id] ?? 3), 0);
  return Math.round(((raw - 9) / 36) * 100);
};
