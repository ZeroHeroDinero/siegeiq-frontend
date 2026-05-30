// SiegeIQ — Complete Frontend
// Next.js 14 + Tailwind. This file shows all screens.
// Split into pages/ when deploying: index.jsx, dashboard.jsx, review/[id].jsx, pricing.jsx
// Auth via Clerk — wrap layout with <ClerkProvider> and use useUser() hook

import { useState, useEffect, useRef } from "react";

// ─── Design tokens ────────────────────────────────────────────────
// In Next.js, put these in globals.css
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Barlow:wght@300;400;500&display=swap');

  :root {
    --bg:        #0A0C0F;
    --bg2:       #111418;
    --bg3:       #181C22;
    --border:    rgba(255,255,255,0.07);
    --border2:   rgba(255,255,255,0.12);
    --accent:    #FF6B35;
    --accent2:   #FF8C5A;
    --gold:      #E8B84B;
    --text:      #F0EEE8;
    --text2:     #9B9890;
    --text3:     #5C5A55;
    --success:   #3ECF8E;
    --danger:    #FF4444;
    --warn:      #F59E0B;
    --radius:    6px;
    --font-head: 'Barlow Condensed', sans-serif;
    --font-body: 'Barlow', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: .6; }
    100% { transform: scale(1.4); opacity: 0; }
  }
  @keyframes scan {
    0%   { top: 0%; }
    100% { top: 100%; }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
`;

// ─── Shared components ─────────────────────────────────────────────

function Nav({ page, setPage }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10,12,15,0.85)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px", height: 56,
    }}>
      <button onClick={() => setPage("landing")} style={{
        fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700,
        color: "var(--text)", letterSpacing: "0.04em", background: "none", border: "none", cursor: "pointer",
      }}>
        SIEGE<span style={{ color: "var(--accent)" }}>IQ</span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {["Dashboard", "Upload", "Pricing"].map(p => (
          <button key={p} onClick={() => setPage(p.toLowerCase())} style={{
            fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
            color: page === p.toLowerCase() ? "var(--text)" : "var(--text2)",
            background: page === p.toLowerCase() ? "var(--bg3)" : "none",
            border: "1px solid " + (page === p.toLowerCase() ? "var(--border2)" : "transparent"),
            borderRadius: "var(--radius)", padding: "5px 14px", cursor: "pointer",
            transition: "all .15s",
          }}>{p}</button>
        ))}
        <button onClick={() => setPage("upload")} style={{
          fontFamily: "var(--font-head)", fontSize: 14, fontWeight: 600,
          letterSpacing: "0.06em", color: "#fff",
          background: "var(--accent)", border: "none",
          borderRadius: "var(--radius)", padding: "7px 18px", cursor: "pointer",
        }}>ANALYZE CLIP</button>
      </div>
    </nav>
  );
}

// ─── Landing Page ──────────────────────────────────────────────────

function LandingPage({ setPage }) {
  const stats = [
    { val: "10s", label: "avg time to insights" },
    { val: "94%", label: "accuracy vs human coach" },
    { val: "2.3×", label: "faster rank progression" },
    { val: "50k+", label: "rounds analyzed" },
  ];
  const features = [
    { icon: "⬡", title: "Frame-by-frame breakdown", desc: "Every key decision timestamped and explained. Know exactly what cost you the round." },
    { icon: "◈", title: "Operator-specific coaching", desc: "Ash advice isn't Thermite advice. Context-aware feedback for your specific role and playstyle." },
    { icon: "◉", title: "Scored across 5 dimensions", desc: "Game sense, positioning, utility, decision-making, rotation. Know your actual weak points." },
    { icon: "◎", title: "YouTube & clip upload", desc: "Paste a YouTube link or upload directly. MP4, MOV, MKV up to 500MB, up to 10 minutes." },
  ];

  return (
    <div style={{ paddingTop: 56 }}>
      {/* Hero */}
      <div style={{
        minHeight: "92vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "80px 24px",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,107,53,0.08) 0%, transparent 70%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Grid texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "linear-gradient(var(--border2) 1px, transparent 1px), linear-gradient(90deg, var(--border2) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--bg3)", border: "1px solid var(--border2)",
          borderRadius: 40, padding: "5px 16px", marginBottom: 32,
          animation: "fadeUp .5s ease both",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", display: "inline-block" }} />
          <span style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500 }}>AI coaching — no coach required</span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-head)", fontSize: "clamp(52px, 9vw, 96px)",
          fontWeight: 700, lineHeight: 0.92, letterSpacing: "-0.01em",
          marginBottom: 24, animation: "fadeUp .5s .1s ease both", opacity: 0,
          animationFillMode: "forwards",
        }}>
          STOP<br />
          <span style={{ color: "var(--accent)" }}>GUESSING</span><br />
          WHY YOU LOST
        </h1>

        <p style={{
          fontSize: 18, color: "var(--text2)", maxWidth: 480, lineHeight: 1.7,
          marginBottom: 40, animation: "fadeUp .5s .2s ease both", opacity: 0,
          animationFillMode: "forwards",
        }}>
          Upload any Rainbow Six Siege clip. SiegeIQ's AI analyzes every decision,
          flags every mistake, and tells you exactly what to fix.
        </p>

        <div style={{
          display: "flex", gap: 12, animation: "fadeUp .5s .3s ease both",
          opacity: 0, animationFillMode: "forwards",
        }}>
          <button onClick={() => setPage("upload")} style={{
            fontFamily: "var(--font-head)", fontSize: 16, fontWeight: 700,
            letterSpacing: "0.08em", color: "#fff", background: "var(--accent)",
            border: "none", borderRadius: "var(--radius)", padding: "14px 32px",
            cursor: "pointer",
          }}>ANALYZE FREE CLIP →</button>
          <button onClick={() => setPage("dashboard")} style={{
            fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text2)",
            background: "var(--bg3)", border: "1px solid var(--border2)",
            borderRadius: "var(--radius)", padding: "14px 24px", cursor: "pointer",
          }}>See sample review</button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        background: "var(--bg2)",
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            padding: "28px 24px", textAlign: "center",
            borderRight: i < 3 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 36, fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ padding: "80px 32px", maxWidth: 960, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "var(--font-head)", fontSize: 48, fontWeight: 700,
          letterSpacing: "-0.01em", marginBottom: 48, textAlign: "center",
        }}>HOW IT WORKS</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              padding: "32px", background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: i === 0 ? "var(--radius) 0 0 0" : i === 1 ? "0 var(--radius) 0 0" :
                           i === 2 ? "0 0 0 var(--radius)" : "0 0 var(--radius) 0",
            }}>
              <div style={{ fontSize: 28, marginBottom: 16, color: "var(--accent)" }}>{f.icon}</div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 600, marginBottom: 10 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        textAlign: "center", padding: "80px 24px",
        borderTop: "1px solid var(--border)",
        background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(255,107,53,0.06) 0%, transparent 70%)",
      }}>
        <h2 style={{ fontFamily: "var(--font-head)", fontSize: 52, fontWeight: 700, marginBottom: 16 }}>
          3 FREE REVIEWS.<br /><span style={{ color: "var(--accent)" }}>START TODAY.</span>
        </h2>
        <p style={{ color: "var(--text2)", marginBottom: 32 }}>No credit card. No coach to schedule. Results in minutes.</p>
        <button onClick={() => setPage("upload")} style={{
          fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700,
          letterSpacing: "0.08em", color: "#fff", background: "var(--accent)",
          border: "none", borderRadius: "var(--radius)", padding: "16px 48px", cursor: "pointer",
        }}>UPLOAD YOUR FIRST CLIP →</button>
      </div>
    </div>
  );
}

// ─── Upload Page ───────────────────────────────────────────────────

function UploadPage({ setPage, setActiveReview }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState("file"); // "file" | "url"
  const [operator, setOperator] = useState("");
  const [map, setMap] = useState("");
  const [rank, setRank] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef();

  const OPERATORS = ["Ash","Thermite","Sledge","Thatcher","Twitch","Lion","Nomad","Hibana","Zofia","Iana","Ace","Zero","Flores","Sens","Grim","Brava","Ram","Deimos","Jäger","Bandit","Caveira","Echo","Lesion","Ela","Vigil","Mozzie","Warden","Goyo","Melusi","Thunderbird","Thorn","Azami","Solis","Fenrir","Tubarão"];
  const MAPS = ["Oregon","Chalet","House","Border","Plane","Consulate","Bank","Yacht","Coastline","Clubhouse","Skyscraper","Hereford","Outback","Fortress","Theme Park","Tower","Emerald Plains","Stadium","Lair","Nighthaven Labs"];
  const RANKS = ["Copper","Bronze","Silver","Gold","Platinum","Diamond","Champion"];

  const startAnalysis = () => {
    if (!file && !url) return;
    setAnalyzing(true);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 8 + 2;
      if (p >= 95) { clearInterval(iv); p = 95; }
      setProgress(Math.min(95, p));
    }, 300);
    setTimeout(() => {
      clearInterval(iv);
      setProgress(100);
      setTimeout(() => { setPage("dashboard"); }, 400);
    }, 5000);
  };

  if (analyzing) return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 24,
      paddingTop: 56,
    }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        {/* Scanning animation */}
        <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 40px" }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1px solid var(--accent)", opacity: 0.3,
            animation: "pulse-ring 1.5s ease-out infinite",
          }} />
          <div style={{
            position: "absolute", inset: 8, borderRadius: "50%",
            border: "1px solid var(--accent)", opacity: 0.5,
            animation: "pulse-ring 1.5s .3s ease-out infinite",
          }} />
          <div style={{
            position: "absolute", inset: 16, borderRadius: "50%",
            background: "var(--bg3)", border: "1px solid var(--border2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 32 }}>◉</span>
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          ANALYZING CLIP
        </div>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 32, lineHeight: 1.6 }}>
          {progress < 30 ? "Extracting key frames..." :
           progress < 55 ? "Identifying decision points..." :
           progress < 75 ? "Analyzing tactical positioning..." :
           progress < 90 ? "Scoring your performance..." :
           "Generating coaching report..."}
        </div>
        <div style={{ height: 3, background: "var(--bg3)", borderRadius: 2 }}>
          <div style={{
            height: 3, background: "var(--accent)", borderRadius: 2,
            width: progress + "%", transition: "width .3s ease",
          }} />
        </div>
        <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>{Math.round(progress)}%</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80, padding: "80px 24px 60px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: "var(--font-head)", fontSize: 48, fontWeight: 700, lineHeight: 1, marginBottom: 10 }}>
            SUBMIT<br /><span style={{ color: "var(--accent)" }}>YOUR CLIP</span>
          </h1>
          <p style={{ color: "var(--text2)", fontSize: 15 }}>3 free reviews remaining this month.</p>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: "flex", background: "var(--bg2)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: 3, marginBottom: 24, width: "fit-content",
        }}>
          {["file","url"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
              padding: "7px 20px", borderRadius: 4, border: "none", cursor: "pointer",
              background: mode === m ? "var(--bg3)" : "transparent",
              color: mode === m ? "var(--text)" : "var(--text3)",
              transition: "all .15s",
            }}>{m === "file" ? "Upload file" : "YouTube / link"}</button>
          ))}
        </div>

        {/* Drop zone */}
        {mode === "file" ? (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); setFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current.click()}
            style={{
              border: `1px dashed ${dragOver ? "var(--accent)" : file ? "var(--success)" : "var(--border2)"}`,
              borderRadius: "var(--radius)", padding: "56px 24px", textAlign: "center",
              background: dragOver ? "rgba(255,107,53,0.04)" : "var(--bg2)",
              cursor: "pointer", marginBottom: 20, transition: "all .15s",
            }}>
            <input ref={fileRef} type="file" accept="video/*" style={{ display: "none" }}
              onChange={e => setFile(e.target.files[0])} />
            <div style={{ fontSize: 40, marginBottom: 16 }}>{file ? "✓" : "↑"}</div>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
              {file ? file.name : "DROP CLIP HERE"}
            </div>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>
              {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "MP4 · MOV · MKV · up to 500MB · max 10 min"}
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 20 }}>
            <input
              placeholder="https://youtube.com/watch?v=..."
              value={url} onChange={e => setUrl(e.target.value)}
              style={{
                width: "100%", background: "var(--bg2)", border: "1px solid var(--border2)",
                borderRadius: "var(--radius)", padding: "14px 16px",
                color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)",
                outline: "none",
              }}
            />
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>YouTube and Twitch VOD links supported (Pro plan)</div>
          </div>
        )}

        {/* Metadata */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Operator", val: operator, set: setOperator, opts: OPERATORS },
            { label: "Map", val: map, set: setMap, opts: MAPS },
            { label: "Your rank", val: rank, set: setRank, opts: RANKS },
          ].map(({ label, val, set, opts }) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
              <select value={val} onChange={e => set(e.target.value)} style={{
                width: "100%", background: "var(--bg2)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", padding: "9px 12px",
                color: val ? "var(--text)" : "var(--text3)", fontSize: 13,
                fontFamily: "var(--font-body)", cursor: "pointer",
              }}>
                <option value="">Select…</option>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <button
          onClick={startAnalysis}
          disabled={!file && !url}
          style={{
            width: "100%", fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700,
            letterSpacing: "0.08em", color: "#fff",
            background: (file || url) ? "var(--accent)" : "var(--bg3)",
            border: "none", borderRadius: "var(--radius)", padding: "16px",
            cursor: (file || url) ? "pointer" : "not-allowed",
            opacity: (file || url) ? 1 : 0.4, transition: "all .15s",
          }}>
          {(file || url) ? "ANALYZE CLIP →" : "ADD A CLIP ABOVE"}
        </button>

        <div style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", marginTop: 12 }}>
          Free plan: ~15 min processing · Pro plan: ~2 min priority processing
        </div>
      </div>
    </div>
  );
}

// ─── Review Dashboard ──────────────────────────────────────────────

function Dashboard({ setPage }) {
  const [activeObs, setActiveObs] = useState(0);

  const observations = [
    { time: "0:27", cat: "positioning", sev: "critical", obs: "Held the wrong wall on Border armory — Jäger always spawns window-side here, not door-side. Pre-aiming the door gave up a free kill.", fix: "Pre-aim the armory window from the doorway. Use your drone to confirm which side he's anchoring before you enter." },
    { time: "0:54", cat: "utility", sev: "warning", obs: "Thermite charge placed before Thatcher confirmed the ADS was destroyed. The charge was immediately eaten.", fix: "Wait for the EMP audio confirmation before placing. Comm 'ADS clear' or watch for the gadget destroyed notification." },
    { time: "1:24", cat: "decision", sev: "critical", obs: "Wide-peeked a 1v1 with 2 teammates alive and 1:20 remaining — a winning position with no reason to push.", fix: "Hold your position and force the defender to come to you. Every second on the clock is a free advantage when you're winning." },
    { time: "1:54", cat: "game_sense", sev: "tip", obs: "Correctly anticipated the rotate through Kids Room and pre-aimed the corner before the enemy rounded it.", fix: "This is the right read on this site. Keep building this habit — map knowledge is converting into kills." },
    { time: "2:54", cat: "utility", sev: "critical", obs: "Last drone burned on spawn-rush intel at 2:54, leaving no coverage for the plant at 1:30.", fix: "Always save minimum one drone for plant phase. Spawn drone for early info, then hold the second for site coverage." },
  ];

  const scores = { overall: 61, cats: [
    { name: "Game Sense", val: 55, col: "#FF4444" },
    { name: "Positioning", val: 70, col: "#3ECF8E" },
    { name: "Utility", val: 48, col: "#FF4444" },
    { name: "Decision", val: 52, col: "#F59E0B" },
    { name: "Rotation", val: 78, col: "#3ECF8E" },
  ]};

  const history = [
    { map: "Border", op: "Ash", score: 61, date: "Today" },
    { map: "Oregon", op: "Thermite", score: 74, date: "Yesterday" },
    { map: "Chalet", op: "Ash", score: 68, date: "2 days ago" },
  ];

  const SEV_COLOR = { critical: "#FF4444", warning: "#F59E0B", tip: "#3ECF8E" };
  const SEV_BG = { critical: "rgba(255,68,68,0.08)", warning: "rgba(245,158,11,0.08)", tip: "rgba(62,207,142,0.08)" };

  return (
    <div style={{ paddingTop: 56, display: "grid", gridTemplateColumns: "1fr 300px", minHeight: "100vh", gap: 0 }}>

      {/* Main panel */}
      <div style={{ borderRight: "1px solid var(--border)", overflowY: "auto" }}>

        {/* Review header */}
        <div style={{ padding: "28px 28px 0", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 600,
              letterSpacing: "0.06em", color: "var(--accent)",
            }}>BORDER · ASH · GOLD III · ROUND 4</div>
            <div style={{ flex: 1 }} />
            <div style={{
              fontSize: 11, background: "rgba(62,207,142,0.12)", color: "var(--success)",
              border: "1px solid rgba(62,207,142,0.2)", borderRadius: 4, padding: "3px 10px",
            }}>COMPLETE</div>
          </div>

          {/* Video placeholder */}
          <div style={{
            background: "var(--bg3)", borderRadius: "var(--radius)",
            height: 220, display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16, position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.4,
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, var(--border) 39px, var(--border) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, var(--border) 39px, var(--border) 40px)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 8, opacity: 0.4 }}>▶</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>Oregon_Ranked_Round4.mp4 · 3:42</div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Timeline</span>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>5 moments flagged</span>
            </div>
            <div style={{ position: "relative", height: 4, background: "var(--bg3)", borderRadius: 2, marginBottom: 8 }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 4, width: "38%", background: "var(--accent)", borderRadius: 2 }} />
            </div>
            <div style={{ position: "relative", height: 16 }}>
              {observations.map((o, i) => {
                const pct = ["12%","24%","38%","52%","78%"][i];
                return (
                  <button key={i} onClick={() => setActiveObs(i)} style={{
                    position: "absolute", left: pct, top: 2,
                    width: 12, height: 12, borderRadius: "50%",
                    background: SEV_COLOR[o.sev],
                    border: activeObs === i ? "2px solid #fff" : "2px solid var(--bg)",
                    cursor: "pointer", transform: "translateX(-50%)",
                    transition: "all .15s",
                  }} />
                );
              })}
            </div>
          </div>
        </div>

        {/* Observations list */}
        <div style={{ padding: "16px 28px" }}>
          {observations.map((o, i) => (
            <div key={i} onClick={() => setActiveObs(i)} style={{
              display: "flex", gap: 12, padding: "14px 16px",
              borderRadius: "var(--radius)", marginBottom: 6, cursor: "pointer",
              background: activeObs === i ? SEV_BG[o.sev] : "transparent",
              border: `1px solid ${activeObs === i ? SEV_COLOR[o.sev] + "40" : "transparent"}`,
              transition: "all .15s",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: SEV_COLOR[o.sev], minWidth: 36, fontFamily: "var(--font-head)" }}>{o.time}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: SEV_COLOR[o.sev], textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                  {o.sev} · {o.cat.replace("_", " ")}
                </div>
                <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5, marginBottom: activeObs === i ? 8 : 0 }}>{o.obs}</div>
                {activeObs === i && (
                  <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, padding: "10px 12px",
                    background: "var(--bg3)", borderRadius: 4, borderLeft: `2px solid ${SEV_COLOR[o.sev]}` }}>
                    <strong style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text3)" }}>Fix: </strong>
                    {o.fix}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Score card */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Round score</div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 52, fontWeight: 700, lineHeight: 1, color: "#F59E0B" }}>{scores.overall}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>out of 100</div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>Needs work</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {scores.cats.map(c => (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: "var(--text2)" }}>{c.name}</span>
                  <span style={{ color: c.col, fontWeight: 600 }}>{c.val}</span>
                </div>
                <div style={{ height: 3, background: "var(--bg3)", borderRadius: 2 }}>
                  <div style={{ height: 3, width: c.val + "%", background: c.col, borderRadius: 2, transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 fixes */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px" }}>
          <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Top 3 things to fix</div>
          {[
            "Stop peeking in winning rounds — you died twice when holding would have won the game.",
            "Save your last drone for plant cover — never burn it on spawn entry.",
            "Learn Jäger's default angles on Border — you're being caught off-guard from the same spot repeatedly.",
          ].map((fix, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700, color: "var(--accent)", lineHeight: 1, minWidth: 20 }}>{i + 1}</div>
              <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{fix}</div>
            </div>
          ))}
        </div>

        {/* Review history */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px" }}>
          <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Recent reviews</div>
          {history.map((h, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "8px 0", borderBottom: i < history.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{h.map} · {h.op}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{h.date}</div>
              </div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700, color: h.score >= 70 ? "var(--success)" : h.score >= 55 ? "#F59E0B" : "#FF4444" }}>{h.score}</div>
            </div>
          ))}
        </div>

        {/* Upgrade CTA */}
        <div style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: "var(--radius)", padding: "16px" }}>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>2 free reviews left</div>
          <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, marginBottom: 14 }}>
            Go Pro for unlimited reviews, priority processing, operator coaching, and weekly trend reports.
          </div>
          <button onClick={() => setPage("pricing")} style={{
            width: "100%", fontFamily: "var(--font-head)", fontSize: 14, fontWeight: 700,
            letterSpacing: "0.06em", color: "#fff", background: "var(--accent)",
            border: "none", borderRadius: "var(--radius)", padding: "10px", cursor: "pointer",
          }}>GO PRO — $9.99/MO →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Pricing Page ──────────────────────────────────────────────────

function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    { name: "ROOKIE", tag: "Free", price: 0, annualPrice: 0, color: "var(--text3)",
      features: ["3 VOD reviews / month", "Timestamped feedback", "Basic 5-category scoring", "~15 min processing"],
      missing: ["Operator-specific coaching", "Weekly trend reports", "Priority processing", "YouTube links", "Team features"],
    },
    { name: "DIAMOND", tag: "Pro", price: 9.99, annualPrice: 7.99, color: "var(--accent)", featured: true,
      features: ["Unlimited VOD reviews", "Priority processing (~2 min)", "Full 5-category scoring", "Operator-specific coaching", "Weekly trend reports", "YouTube & Twitch links"],
      missing: ["Team features"],
    },
    { name: "SQUAD", tag: "Team", price: 29.99, annualPrice: 23.99, color: "var(--gold)",
      features: ["Everything in Pro", "Up to 5 team members", "Shared team review feed", "IGL strategy notes", "Discord bot integration", "Monthly team PDF report"],
      missing: [],
    },
  ];

  return (
    <div style={{ paddingTop: 56, padding: "80px 24px 60px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ fontFamily: "var(--font-head)", fontSize: 56, fontWeight: 700, lineHeight: 1, marginBottom: 12 }}>
            SIMPLE,<br /><span style={{ color: "var(--accent)" }}>HONEST</span> PRICING
          </h1>
          <p style={{ color: "var(--text2)", marginBottom: 28 }}>Start free. Upgrade when SiegeIQ proves its value.</p>

          {/* Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: annual ? "var(--text3)" : "var(--text)" }}>Monthly</span>
            <div onClick={() => setAnnual(!annual)} style={{
              width: 40, height: 22, background: annual ? "var(--accent)" : "var(--bg3)",
              border: "1px solid var(--border2)", borderRadius: 11, cursor: "pointer",
              position: "relative", transition: "background .2s",
            }}>
              <div style={{
                position: "absolute", top: 2, left: annual ? 18 : 2,
                width: 16, height: 16, borderRadius: "50%", background: "#fff",
                transition: "left .2s",
              }} />
            </div>
            <span style={{ fontSize: 13, color: annual ? "var(--text)" : "var(--text3)" }}>Annual</span>
            {annual && <span style={{ fontSize: 11, fontWeight: 600, background: "rgba(62,207,142,0.12)", color: "var(--success)", border: "1px solid rgba(62,207,142,0.2)", borderRadius: 20, padding: "2px 10px" }}>Save 20%</span>}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {plans.map(p => (
            <div key={p.name} style={{
              background: p.featured ? "var(--bg2)" : "var(--bg2)",
              border: `1px solid ${p.featured ? "var(--accent)" : "var(--border)"}`,
              borderRadius: "var(--radius)", padding: "24px 20px",
              position: "relative",
            }}>
              {p.featured && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  background: "var(--accent)", fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.08em", color: "#fff", padding: "3px 12px",
                  borderRadius: "0 0 6px 6px",
                }}>MOST POPULAR</div>
              )}
              <div style={{ fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 600, color: p.color, letterSpacing: "0.08em", marginBottom: 4 }}>{p.tag}</div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 700, marginBottom: 16 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-head)", fontSize: 40, fontWeight: 700 }}>
                  ${annual ? p.annualPrice : p.price}
                </span>
                <span style={{ fontSize: 13, color: "var(--text3)" }}>/mo</span>
              </div>
              {annual && p.price > 0 && (
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 16 }}>
                  billed ${(p.annualPrice * 12).toFixed(2)}/yr
                </div>
              )}
              <div style={{ height: "1px", background: "var(--border)", margin: "16px 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text2)" }}>
                    <span style={{ color: "var(--success)", flexShrink: 0 }}>✓</span>{f}
                  </div>
                ))}
                {p.missing.map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text3)" }}>
                    <span style={{ flexShrink: 0 }}>✕</span>{f}
                  </div>
                ))}
              </div>
              <button style={{
                width: "100%", fontFamily: "var(--font-head)", fontSize: 14, fontWeight: 700,
                letterSpacing: "0.06em", color: p.featured ? "#fff" : "var(--text)",
                background: p.featured ? "var(--accent)" : "var(--bg3)",
                border: `1px solid ${p.featured ? "var(--accent)" : "var(--border2)"}`,
                borderRadius: "var(--radius)", padding: "11px", cursor: "pointer",
              }}>
                {p.price === 0 ? "GET STARTED FREE" : "START 7-DAY TRIAL"}
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text3)" }}>
          All paid plans include a 7-day free trial. No credit card required for free tier. Cancel anytime.
        </div>
      </div>
    </div>
  );
}

// ─── App shell ─────────────────────────────────────────────────────

export default function SiegeIQApp() {
  const [page, setPage] = useState("landing");

  return (
    <>
      <style>{STYLES}</style>
      <Nav page={page} setPage={setPage} />
      {page === "landing"    && <LandingPage setPage={setPage} />}
      {page === "upload"     && <UploadPage setPage={setPage} />}
      {page === "dashboard"  && <Dashboard setPage={setPage} />}
      {page === "pricing"    && <PricingPage />}
    </>
  );
}
