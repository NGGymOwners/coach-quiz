import {
  CHAPTERS,
  type ArchetypeId,
  type ChapterId,
  SUB_SCORE,
  TOTAL_SCORE,
} from "./content";

export type ResultBundle = {
  total: number;
  subScores: Record<ChapterId, number>;
  archetype: ArchetypeId;
  topGaps: ChapterId[];
  topStrengths: ChapterId[];
  hasMeaningfulGaps: boolean;
};

const CHAPTER_IDS: ChapterId[] = ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6"];

const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

export function scoreQuiz(answers: Record<number, number>): ResultBundle {
  const subScores = Object.fromEntries(
    CHAPTER_IDS.map((id) => [id, SUB_SCORE(answers, CHAPTERS[id].questions)])
  ) as Record<ChapterId, number>;

  const total = TOTAL_SCORE(answers);

  const sortedAsc = CHAPTER_IDS.slice().sort((a, b) => subScores[a] - subScores[b]);
  const topGaps = sortedAsc.slice(0, 2);
  const topStrengths = sortedAsc.slice(-2).reverse();

  const archetype = assignArchetype(total, subScores);

  const gapAvg = (subScores[topGaps[0]] + subScores[topGaps[1]]) / 2;
  const strengthAvg =
    (subScores[topStrengths[0]] + subScores[topStrengths[1]]) / 2;
  const hasMeaningfulGaps = gapAvg < 70 || strengthAvg - gapAvg >= 10;

  return {
    total,
    subScores,
    archetype,
    topGaps,
    topStrengths,
    hasMeaningfulGaps,
  };
}

export function assignArchetype(
  total: number,
  s: Record<ChapterId, number>
): ArchetypeId {
  if (total < 40) return "firefighter";

  const values = CHAPTER_IDS.map((id) => s[id]);
  const spread = Math.max(...values) - Math.min(...values);
  if (total >= 85 && spread < 25) return "architect";

  const structureAvg = avg([s.ch1, s.ch2]);
  const cultureAvg = avg([s.ch3, s.ch5]);
  if (structureAvg - cultureAvg > 15) return "operator";

  const inspirerAvg = avg([s.ch3, s.ch6]);
  const systemsAvg = avg([s.ch1, s.ch2, s.ch5]);
  if (inspirerAvg - systemsAvg > 15) return "inspirer";

  if (total >= 85) return "architect";
  if (structureAvg >= cultureAvg) return "operator";
  return "inspirer";
}
