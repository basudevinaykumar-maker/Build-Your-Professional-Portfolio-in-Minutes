import { useState } from "react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');`;

const FIELDS = [
  { key: "headline", label: "Current headline", placeholder: "e.g. Marketing Manager at Acme Co.", type: "input" },
  { key: "about", label: "About section", placeholder: "Paste your current About / summary text.", type: "textarea" },
  { key: "skills", label: "Skills", placeholder: "e.g. SQL, Figma, Stakeholder management (comma separated)", type: "input" },
  { key: "experience", label: "Experience", placeholder: "Paste your most recent role(s): title, company, bullet points.", type: "textarea" },
  { key: "education", label: "Education", placeholder: "e.g. B.A. Economics, University of Michigan, 2019", type: "input" },
  { key: "targetJob", label: "Target job", placeholder: "e.g. Senior Product Marketing Manager, B2B SaaS", type: "input" },
];

const EMPTY = { headline: "", about: "", skills: "", experience: "", education: "", targetJob: "" };

function buildPrompt(profile) {
  return `You are a senior LinkedIn profile strategist and technical recruiter. Analyze this LinkedIn profile against the person's target job and return ONLY a JSON object, no markdown fences, no preamble, matching exactly this shape:

{
  "score": <integer 0-100>,
  "scoreSummary": "<one sentence on what's driving the score>",
  "optimizedHeadline": "<a rewritten headline, under 220 characters>",
  "improvedAbout": "<a rewritten About section, 3-5 short paragraphs, first person>",
  "recommendedSkills": ["<skill>", "..."],
  "experienceImprovements": ["<specific, concrete rewrite suggestion tied to their actual experience text>", "..."],
  "missingKeywords": ["<keyword or phrase likely searched by recruiters/ATS for this target role>", "..."],
  "suggestions": ["<other concrete, actionable suggestion>", "..."]
}

Give 4-6 items in each array field. Be specific to the content provided, not generic advice. If a section was left blank, note that gap inside the relevant array rather than inventing content for them.

CURRENT HEADLINE:
${profile.headline || "(not provided)"}

CURRENT ABOUT:
${profile.about || "(not provided)"}

CURRENT SKILLS:
${profile.skills || "(not provided)"}

CURRENT EXPERIENCE:
${profile.experience || "(not provided)"}

EDUCATION:
${profile.education || "(not provided)"}

TARGET JOB:
${profile.targetJob || "(not specified)"}`;
}

function parseResult(raw) {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

function ScoreRing({ score }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const offset = c - (pct / 100) * c;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" style={{ flexShrink: 0 }}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="#DCD5C7" strokeWidth="8" />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="#B08D57"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 70 70)"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="70" y="66" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="34" fontWeight="600" fill="#1C2321">
        {pct}
      </text>
      <text x="70" y="88" textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif" fontSize="11" fill="#4A5859">
        out of 100
      </text>
    </svg>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ position: "relative", paddingLeft: 28, paddingBottom: 36 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 4,
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: "#B08D57",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 4,
          top: 14,
          bottom: 0,
          width: 1,
          background: "#DCD5C7",
        }}
      />
      <h3
        style={{
          fontFamily: "Fraunces, serif",
          fontWeight: 500,
          fontSize: 19,
          color: "#1C2321",
          margin: "0 0 10px 0",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function ListBlock({ items }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            fontFamily: "IBM Plex Sans, sans-serif",
            fontSize: 14.5,
            lineHeight: 1.55,
            color: "#33403F",
            marginBottom: 8,
            paddingLeft: 14,
            position: "relative",
          }}
        >
          <span style={{ position: "absolute", left: 0, color: "#B08D57" }}>—</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function TagBlock({ items }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((item, i) => (
        <span
          key={i}
          style={{
            fontFamily: "IBM Plex Sans, sans-serif",
            fontSize: 13,
            color: "#1C2321",
            background: "#EFE9DA",
            border: "1px solid #DCD5C7",
            borderRadius: 4,
            padding: "5px 10px",
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function LinkedInOptimizer() {
  const [profile, setProfile] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const update = (key) => (e) => setProfile((p) => ({ ...p, [key]: e.target.value }));

  const hasContent = Object.values(profile).some((v) => v.trim().length > 0);

  const analyze = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt(profile) }],
        }),
      });
      const data = await response.json();
      const textBlock = (data.content || []).find((b) => b.type === "text");
      if (!textBlock) throw new Error("No response text returned.");
      const parsed = parseResult(textBlock.text);
      setResult(parsed);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong while analyzing your profile.");
      setStatus("error");
    }
  };

  const reset = () => {
    setProfile(EMPTY);
    setResult(null);
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <div
      style={{
        background: "#F6F3EC",
        minHeight: "100%",
        padding: "48px 20px 80px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <style>{FONT_IMPORT}</style>
      <div style={{ width: "100%", maxWidth: 640 }}>
        <div style={{ marginBottom: 44 }}>
          <div
            style={{
              fontFamily: "IBM Plex Sans, sans-serif",
              fontSize: 13,
              color: "#4A5859",
              marginBottom: 8,
            }}
          >
            Profile audit
          </div>
          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 600,
              fontSize: 40,
              lineHeight: 1.1,
              color: "#1C2321",
              margin: 0,
            }}
          >
            Get your LinkedIn profile ready for the job you actually want.
          </h1>
          <p
            style={{
              fontFamily: "IBM Plex Sans, sans-serif",
              fontSize: 15,
              color: "#4A5859",
              marginTop: 14,
              lineHeight: 1.6,
              maxWidth: 520,
            }}
          >
            Paste in what you have today. We'll score it against your target role and rewrite the
            parts that are holding you back.
          </p>
        </div>

        {status !== "done" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "IBM Plex Sans, sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#1C2321",
                    marginBottom: 6,
                  }}
                >
                  {f.label}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    value={profile[f.key]}
                    onChange={update(f.key)}
                    placeholder={f.placeholder}
                    rows={4}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      fontFamily: "IBM Plex Sans, sans-serif",
                      fontSize: 14.5,
                      color: "#1C2321",
                      background: "#FFFFFF",
                      border: "1px solid #DCD5C7",
                      borderRadius: 6,
                      padding: "10px 12px",
                      resize: "vertical",
                      lineHeight: 1.5,
                    }}
                  />
                ) : (
                  <input
                    value={profile[f.key]}
                    onChange={update(f.key)}
                    placeholder={f.placeholder}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      fontFamily: "IBM Plex Sans, sans-serif",
                      fontSize: 14.5,
                      color: "#1C2321",
                      background: "#FFFFFF",
                      border: "1px solid #DCD5C7",
                      borderRadius: 6,
                      padding: "10px 12px",
                    }}
                  />
                )}
              </div>
            ))}

            <button
              onClick={analyze}
              disabled={!hasContent || status === "loading"}
              style={{
                marginTop: 8,
                alignSelf: "flex-start",
                fontFamily: "IBM Plex Sans, sans-serif",
                fontSize: 14.5,
                fontWeight: 500,
                color: "#F6F3EC",
                background: hasContent ? "#1C2321" : "#A9A296",
                border: "none",
                borderRadius: 6,
                padding: "12px 22px",
                cursor: hasContent && status !== "loading" ? "pointer" : "not-allowed",
              }}
            >
              {status === "loading" ? "Analyzing your profile…" : "Analyze my profile"}
            </button>

            {status === "error" && (
              <div
                style={{
                  fontFamily: "IBM Plex Sans, sans-serif",
                  fontSize: 13.5,
                  color: "#8A3B2E",
                  background: "#F6E9E5",
                  border: "1px solid #E0C3BA",
                  borderRadius: 6,
                  padding: "10px 14px",
                }}
              >
                {errorMsg} Try again in a moment.
              </div>
            )}
          </div>
        )}

        {status === "done" && result && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                background: "#FFFFFF",
                border: "1px solid #DCD5C7",
                borderRadius: 10,
                padding: "24px 28px",
                marginBottom: 40,
              }}
            >
              <ScoreRing score={result.score} />
              <div>
                <div
                  style={{
                    fontFamily: "IBM Plex Sans, sans-serif",
                    fontSize: 13,
                    color: "#4A5859",
                    marginBottom: 6,
                  }}
                >
                  Profile score
                </div>
                <div
                  style={{
                    fontFamily: "IBM Plex Sans, sans-serif",
                    fontSize: 14.5,
                    color: "#33403F",
                    lineHeight: 1.5,
                  }}
                >
                  {result.scoreSummary}
                </div>
              </div>
            </div>

            <Section title="Optimized headline">
              <p
                style={{
                  fontFamily: "IBM Plex Sans, sans-serif",
                  fontSize: 15,
                  color: "#1C2321",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {result.optimizedHeadline}
              </p>
            </Section>

            <Section title="Improved About">
              {result.improvedAbout.split("\n").filter(Boolean).map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "IBM Plex Sans, sans-serif",
                    fontSize: 14.5,
                    color: "#33403F",
                    lineHeight: 1.6,
                    margin: "0 0 12px 0",
                  }}
                >
                  {para}
                </p>
              ))}
            </Section>

            <Section title="Recommended skills">
              <TagBlock items={result.recommendedSkills} />
            </Section>

            <Section title="Experience improvements">
              <ListBlock items={result.experienceImprovements} />
            </Section>

            <Section title="Missing keywords">
              <TagBlock items={result.missingKeywords} />
            </Section>

            <Section title="Other suggestions">
              <ListBlock items={result.suggestions} />
            </Section>

            <button
              onClick={reset}
              style={{
                fontFamily: "IBM Plex Sans, sans-serif",
                fontSize: 13.5,
                fontWeight: 500,
                color: "#1C2321",
                background: "transparent",
                border: "1px solid #DCD5C7",
                borderRadius: 6,
                padding: "10px 18px",
                cursor: "pointer",
                marginTop: 8,
              }}
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
