import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";

/* ─── Color Palette ─── */
const C = {
  bg: "#0a0a0b",
  surface: "#111113",
  surface2: "#18181b",
  border: "#27272a",
  text: "#fafafa",
  textSec: "#a1a1aa",
  textMuted: "#71717a",
  accent: "#c4a35a",
  accentSoft: "rgba(196,163,90,0.12)",
  accentGlow: "rgba(196,163,90,0.06)",
};

/* ─── Helpers ─── */
const fadeIn = (frame: number, start: number, dur = 15) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const slideUp = (frame: number, start: number, dur = 15, dist = 30) =>
  interpolate(frame, [start, start + dur], [dist, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const typewriter = (text: string, frame: number, start: number, speed = 1.2) => {
  const charsToShow = Math.floor(
    interpolate(frame, [start, start + text.length / speed], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  return text.slice(0, charsToShow);
};

/* ─── Cursor Component ─── */
const Cursor: React.FC<{ visible: boolean }> = ({ visible }) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 15) % 2 === 0;
  if (!visible) return null;
  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: "1.1em",
        background: C.accent,
        marginLeft: 2,
        opacity: blink ? 1 : 0,
        verticalAlign: "text-bottom",
      }}
    />
  );
};

/* ─── Scene 1: Logo Intro ─── */
const LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const tagOpacity = fadeIn(frame, 30);
  const tagY = slideUp(frame, 30);

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`,
          opacity: interpolate(frame, [0, 40], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 72,
          fontWeight: 700,
          color: C.text,
          letterSpacing: -2,
          transform: `scale(${logoScale})`,
        }}
      >
        Thinkerton<span style={{ color: C.accent }}>.</span>
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 18,
          color: C.textSec,
          fontWeight: 300,
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
        }}
      >
        Decision Intelligence Engine
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Problem Input ─── */
const PROBLEM_TEXT =
  'We have $2M in free cash flow. Should we reinvest in product development, acquire a smaller competitor, or return capital to shareholders?';

const ProblemInput: React.FC = () => {
  const frame = useCurrentFrame();

  const windowOpacity = fadeIn(frame, 0);
  const windowY = slideUp(frame, 0, 20, 40);
  const typed = typewriter(PROBLEM_TEXT, frame, 20, 1.8);
  const typingDone = frame > 20 + PROBLEM_TEXT.length / 1.8;

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          opacity: windowOpacity,
          transform: `translateY(${windowY}px)`,
        }}
      >
        {/* Label */}
        <div
          style={{
            fontSize: 11,
            color: C.accent,
            textTransform: "uppercase",
            letterSpacing: 3,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Describe Your Problem
        </div>

        {/* Window */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              gap: 8,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: C.border,
                }}
              />
            ))}
          </div>

          {/* Body */}
          <div style={{ padding: "36px 40px" }}>
            <div
              style={{
                fontSize: 20,
                color: C.text,
                lineHeight: 1.7,
                minHeight: 80,
                fontWeight: 400,
              }}
            >
              "{typed}"
              <Cursor visible={!typingDone} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: Thinker Selection ─── */
const THINKERS = [
  { name: "Charlie Munger", tag: "Inversion · Latticework" },
  { name: "Henry Singleton", tag: "Capital Allocation" },
  { name: "Daniel Kahneman", tag: "Bias Correction" },
];

const ThinkerSelection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOp = fadeIn(frame, 0);

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div style={{ width: "100%", maxWidth: 900 }}>
        <div
          style={{
            fontSize: 11,
            color: C.accent,
            textTransform: "uppercase",
            letterSpacing: 3,
            fontWeight: 600,
            marginBottom: 16,
            opacity: labelOp,
          }}
        >
          Choose Your Lens
        </div>

        <div
          style={{
            fontSize: 32,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            color: C.text,
            marginBottom: 40,
            opacity: fadeIn(frame, 8),
            transform: `translateY(${slideUp(frame, 8)}px)`,
          }}
        >
          Who should analyze this?
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {THINKERS.map((t, i) => {
            const delay = 20 + i * 12;
            const op = fadeIn(frame, delay);
            const y = slideUp(frame, delay);
            const isSelected = i === 1;
            const selectFrame = 65;
            const selected =
              isSelected && frame > selectFrame
                ? interpolate(frame, [selectFrame, selectFrame + 10], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 0;

            return (
              <div
                key={t.name}
                style={{
                  flex: 1,
                  padding: "32px 28px",
                  background: C.surface,
                  border: `1px solid ${interpolate(selected, [0, 1], [0, 1]) > 0.5 ? C.accent : C.border}`,
                  borderRadius: 16,
                  opacity: op,
                  transform: `translateY(${y}px) scale(${1 + selected * 0.03})`,
                  boxShadow:
                    selected > 0.5
                      ? `0 0 40px rgba(196,163,90,${0.15 * selected})`
                      : "none",
                  transition: "none",
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    color: C.text,
                    marginBottom: 8,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: C.textMuted,
                    fontWeight: 400,
                  }}
                >
                  {t.tag}
                </div>
                {isSelected && selected > 0.5 && (
                  <div
                    style={{
                      marginTop: 16,
                      fontSize: 12,
                      color: C.accent,
                      fontWeight: 500,
                      opacity: fadeIn(frame, selectFrame + 5),
                    }}
                  >
                    &#10003; Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 4: Processing Animation ─── */
const ProcessingScene: React.FC = () => {
  const frame = useCurrentFrame();

  const MODELS = [
    "Opportunistic Capital Allocation",
    "Inversion Thinking",
    "Opportunity Cost Framework",
    "Anti-Bias Correction",
  ];

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Spinning ring */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: `2px solid ${C.border}`,
          borderTopColor: C.accent,
          transform: `rotate(${frame * 8}deg)`,
          marginBottom: 32,
        }}
      />
      <div
        style={{
          fontSize: 14,
          color: C.textMuted,
          textTransform: "uppercase",
          letterSpacing: 3,
          fontWeight: 500,
          marginBottom: 24,
        }}
      >
        Applying Mental Models
      </div>

      {/* Model names cycling */}
      <div style={{ height: 28, overflow: "hidden" }}>
        {MODELS.map((m, i) => {
          const showAt = i * 20;
          const hideAt = showAt + 20;
          const visible = frame >= showAt && frame < hideAt;
          if (!visible) return null;
          return (
            <div
              key={m}
              style={{
                fontSize: 18,
                fontFamily: "'Playfair Display', Georgia, serif",
                color: C.accent,
                fontWeight: 500,
                opacity: fadeIn(frame, showAt, 8),
                transform: `translateY(${slideUp(frame, showAt, 8, 15)}px)`,
              }}
            >
              {m}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 5: Reasoning Output ─── */
const REASONING_SECTIONS = [
  {
    label: "MENTAL MODEL",
    title: "Opportunistic Capital Allocation",
    delay: 0,
  },
  {
    label: "FRAMEWORK",
    content:
      "Singleton never committed to a fixed allocation strategy. He evaluated each option against the current opportunity cost of capital.",
    delay: 25,
  },
  {
    label: "APPLIED TO YOUR SITUATION",
    content:
      'The critical question isn\'t "which category" but "which specific opportunity has the highest risk-adjusted return right now?"',
    delay: 55,
  },
  {
    label: "HISTORICAL PRECEDENT",
    content:
      "At Teledyne, Singleton repurchased 90% of shares when cheap, made 130+ acquisitions when multiples were favorable — never dogmatic, always opportunistic.",
    delay: 85,
  },
  {
    label: "KEY INSIGHT",
    content:
      "The answer changes based on market conditions. Avoid the trap of treating capital allocation as a permanent policy.",
    delay: 120,
    isInsight: true,
  },
];

const ReasoningOutput: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "50px 80px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 900 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
            opacity: fadeIn(frame, 0),
          }}
        >
          <div
            style={{
              padding: "6px 14px",
              background: C.accentSoft,
              borderRadius: 6,
              fontSize: 12,
              color: C.accent,
              fontWeight: 500,
            }}
          >
            &#9670; Think Like: Henry Singleton
          </div>
        </div>

        {/* Window */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: "36px 40px",
            opacity: fadeIn(frame, 0),
            transform: `translateY(${slideUp(frame, 0, 20)}px)`,
          }}
        >
          {REASONING_SECTIONS.map((s, i) => {
            const op = fadeIn(frame, s.delay, 12);
            const y = slideUp(frame, s.delay, 12, 20);
            return (
              <div
                key={i}
                style={{
                  marginBottom: i < REASONING_SECTIONS.length - 1 ? 28 : 0,
                  opacity: op,
                  transform: `translateY(${y}px)`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  {s.label}
                </div>
                {s.title && (
                  <div
                    style={{
                      fontSize: 24,
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: 700,
                      color: C.text,
                    }}
                  >
                    {s.title}
                  </div>
                )}
                {s.content && (
                  <div
                    style={{
                      fontSize: 16,
                      color: s.isInsight ? C.accent : C.textSec,
                      lineHeight: 1.7,
                      fontWeight: s.isInsight ? 500 : 300,
                      fontStyle: s.isInsight ? "italic" : "normal",
                      ...(s.isInsight
                        ? {
                            padding: "16px 20px",
                            background: C.accentSoft,
                            borderRadius: 10,
                            borderLeft: `3px solid ${C.accent}`,
                          }
                        : {}),
                    }}
                  >
                    {s.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 6: Closing CTA ─── */
const ClosingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`,
          opacity: fadeIn(frame, 10, 20),
        }}
      />
      <div
        style={{
          fontSize: 48,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 700,
          color: C.text,
          textAlign: "center",
          lineHeight: 1.3,
          transform: `scale(${scale})`,
          marginBottom: 16,
        }}
      >
        Stop thinking average.
      </div>
      <div
        style={{
          fontSize: 20,
          color: C.textSec,
          fontWeight: 300,
          marginBottom: 40,
          opacity: fadeIn(frame, 20),
          transform: `translateY(${slideUp(frame, 20)}px)`,
        }}
      >
        Think like the greatest minds.
      </div>
      <div
        style={{
          padding: "16px 36px",
          background: C.accent,
          color: C.bg,
          borderRadius: 10,
          fontSize: 16,
          fontWeight: 600,
          opacity: fadeIn(frame, 35),
          transform: `translateY(${slideUp(frame, 35)}px)`,
        }}
      >
        Get Early Access
      </div>
      <div
        style={{
          marginTop: 32,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 24,
          color: C.textMuted,
          opacity: fadeIn(frame, 45),
        }}
      >
        Thinkerton<span style={{ color: C.accent }}>.</span>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Main Composition ─── */
export const ThinkertonDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Scene 1: Logo Intro — 0 to 75 (2.5s) */}
      <Sequence from={0} durationInFrames={75}>
        <LogoIntro />
      </Sequence>

      {/* Scene 2: Problem Input — 75 to 210 (4.5s) */}
      <Sequence from={75} durationInFrames={135}>
        <ProblemInput />
      </Sequence>

      {/* Scene 3: Thinker Selection — 210 to 300 (3s) */}
      <Sequence from={210} durationInFrames={90}>
        <ThinkerSelection />
      </Sequence>

      {/* Scene 4: Processing — 300 to 380 (2.7s) */}
      <Sequence from={300} durationInFrames={80}>
        <ProcessingScene />
      </Sequence>

      {/* Scene 5: Reasoning Output — 380 to 530 (5s) */}
      <Sequence from={380} durationInFrames={150}>
        <ReasoningOutput />
      </Sequence>

      {/* Scene 6: Closing CTA — 530 to 600 (2.3s) */}
      <Sequence from={530} durationInFrames={70}>
        <ClosingCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
