import { CHAPTERS, type ChapterId } from "@/lib/content";

const CHAPTER_ORDER: ChapterId[] = ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6"];

type Props = {
  subScores: Record<ChapterId, number>;
  topGaps?: ChapterId[];
};

const SIZE = 360;
const CENTER = SIZE / 2;
const RADIUS = 130;
const LABEL_RADIUS = RADIUS + 26;
const RINGS = [25, 50, 75, 100];

function pointFor(idx: number, value: number, total: number, r: number = RADIUS) {
  const angle = (Math.PI * 2 * idx) / total - Math.PI / 2;
  const distance = (value / 100) * r;
  return {
    x: CENTER + Math.cos(angle) * distance,
    y: CENTER + Math.sin(angle) * distance,
    angle,
  };
}

export default function RadarChart({ subScores, topGaps = [] }: Props) {
  const total = CHAPTER_ORDER.length;

  const polygonPoints = CHAPTER_ORDER.map((id, i) => {
    const p = pointFor(i, subScores[id], total);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-md mx-auto"
      role="img"
      aria-label="Coach development radar chart"
    >
      {RINGS.map((r) => (
        <polygon
          key={r}
          points={CHAPTER_ORDER.map((_, i) => {
            const p = pointFor(i, r, total);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray={r === 100 ? "0" : "2 3"}
        />
      ))}

      {CHAPTER_ORDER.map((_, i) => {
        const outer = pointFor(i, 100, total);
        return (
          <line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={outer.x}
            y2={outer.y}
            stroke="var(--border)"
            strokeWidth={1}
          />
        );
      })}

      <polygon
        points={polygonPoints}
        fill="var(--accent)"
        fillOpacity={0.18}
        stroke="var(--accent)"
        strokeWidth={2}
      />

      {CHAPTER_ORDER.map((id, i) => {
        const p = pointFor(i, subScores[id], total);
        const isGap = topGaps.includes(id);
        return (
          <circle
            key={id}
            cx={p.x}
            cy={p.y}
            r={isGap ? 6 : 4}
            fill={isGap ? "var(--accent)" : "var(--accent)"}
            stroke={isGap ? "var(--background)" : "none"}
            strokeWidth={isGap ? 2 : 0}
          />
        );
      })}

      {CHAPTER_ORDER.map((id, i) => {
        const p = pointFor(i, 100, total, LABEL_RADIUS);
        const ch = CHAPTERS[id];
        const isGap = topGaps.includes(id);
        const score = subScores[id];
        return (
          <g key={id}>
            <text
              x={p.x}
              y={p.y - 4}
              textAnchor="middle"
              fontSize={13}
              fontWeight={700}
              fill={isGap ? "var(--accent)" : "var(--foreground-muted)"}
              fontFamily="var(--font-bebas)"
              style={{ letterSpacing: "0.1em" }}
            >
              PILLAR {ch.number}
            </text>
            <text
              x={p.x}
              y={p.y + 11}
              textAnchor="middle"
              fontSize={13}
              fontWeight={600}
              fill={isGap ? "var(--accent)" : "var(--foreground-muted)"}
            >
              {score}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
