import { ImageResponse } from "next/og";

export const alt = "What's Your Coach Development Style? — Next Generation Gym Owners quiz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#0b0d12",
          padding: 80,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            color: "#d4a635",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 6,
            marginBottom: 32,
          }}
        >
          NEXT GENERATION GYM OWNERS
        </div>
        <div
          style={{
            color: "#f5f5f5",
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1,
            textAlign: "center",
            letterSpacing: -2,
          }}
        >
          What&apos;s Your
        </div>
        <div
          style={{
            color: "#d4a635",
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1,
            textAlign: "center",
            letterSpacing: -2,
            marginTop: 8,
          }}
        >
          Coach Development
        </div>
        <div
          style={{
            color: "#f5f5f5",
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1,
            textAlign: "center",
            letterSpacing: -2,
            marginTop: 8,
          }}
        >
          Style?
        </div>
        <div
          style={{
            color: "#a1a5ad",
            fontSize: 28,
            marginTop: 48,
            textAlign: "center",
          }}
        >
          A 9-question diagnostic for cheer gym owners
        </div>
      </div>
    ),
    { ...size }
  );
}
