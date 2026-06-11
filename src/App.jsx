import { useState, useRef, useCallback } from "react";

// ── Brand Colors ─────────────────────────────────────────────────────
const G = {
  gold: "#C9941A", goldLight: "#F5C842", goldDark: "#8B6310",
  goldDeep: "#5C3D08", black: "#000000", nearBlack: "#0a0800",
  darkBrown: "#1a0d00", cream: "#FDF8F0", charcoal: "#1a1a1a",
  gray: "#666", inputBg: "rgba(255,250,240,0.9)", inputBorder: "rgba(139,99,16,0.3)",
  formBg: "rgba(253,248,235,0.97)",
};

// Parchment texture SVG as data URL
const PARCHMENT_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeBlend in='SourceGraphic' mode='multiply'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E"), linear-gradient(135deg, #fdf5e0 0%, #faf0d0 25%, #fdf5e0 50%, #f8edc8 75%, #fdf5e0 100%)`;

// ── 15 Background Themes ─────────────────────────────────────────────
const BASE = "https://4everafter.cloud/wp-content/uploads/2026/base-options";
const backgrounds = [
  { id: "floral",    label: "Soft Florals",              icon: "🌸", image: `${BASE}/soft-floral-life-story-base.jpg`,                          paperBg: "rgba(253,246,240,0.93)" },
  { id: "autumn",   label: "Autumn Leaves",              icon: "🍂", image: `${BASE}/autumn-leaves-life-story-base.jpg`,                        paperBg: "rgba(253,248,242,0.93)" },
  { id: "ocean",    label: "Misty Ocean Coast",          icon: "🌊", image: `${BASE}/misty-ocean-coast-life-story-obit-base.jpg`,               paperBg: "rgba(244,250,253,0.93)" },
  { id: "faith",    label: "Faith & Grace",              icon: "✝",  image: `${BASE}/faith-and-grace-lifestory-obit-base.jpg`,                 paperBg: "rgba(250,247,242,0.93)" },
  { id: "military", label: "Military Honor",             icon: "🎖", image: `${BASE}/military-honor-life-story-obit-base.jpg`,                 paperBg: "rgba(244,247,250,0.93)" },
  { id: "garden",   label: "Natural Garden",             icon: "🌿", image: `${BASE}/garden-nature-life-story-base.jpg`,                       paperBg: "rgba(244,250,242,0.93)" },
  { id: "linen",    label: "Elegant White Linen",        icon: "🕊", image: `${BASE}/elegant-linen-life-story-base.jpg`,                       paperBg: "rgba(250,249,247,0.93)" },
  { id: "sunset",   label: "Golden Sunset",              icon: "🌅", image: `${BASE}/golden-sunset-life-story-obit-base.jpg`,                  paperBg: "rgba(253,248,240,0.93)" },
  { id: "vintage",  label: "Vintage Script",             icon: "📜", image: `${BASE}/vintage-script-life-story-obit-base.jpg`,                 paperBg: "rgba(250,247,239,0.93)" },
  { id: "candle",   label: "Candlelight",                icon: "🕯", image: `${BASE}/candles-life-story-obit-base.jpg`,                        paperBg: "rgba(253,250,244,0.93)" },
  { id: "oceanlife",label: "Ocean Life",                 icon: "🐠", image: `${BASE}/ocean-life-animals-story-obit-base.jpg`,                  paperBg: "rgba(240,250,253,0.93)" },
  { id: "sunrise",  label: "Golden Sunrise",             icon: "🌄", image: `${BASE}/golden-sunrise-life-story-obit-base.jpg`,                 paperBg: "rgba(253,250,240,0.93)" },
  { id: "soldiers", label: "Military Soldiers",          icon: "🪖", image: `${BASE}/military-honor-soldiers-life-story-obit-base.jpg`,        paperBg: "rgba(244,247,250,0.93)" },
  { id: "shabbat",  label: "Shabbat Candles",            icon: "✡",  image: `${BASE}/shabbat-candles-life-story-obit-base.jpg`,               paperBg: "rgba(253,250,244,0.93)" },
  { id: "heaven",   label: "Spray from Heaven",          icon: "✨", image: `${BASE}/black-light-spray-from-heaven-life-story-obit-base.jpg`,  paperBg: "rgba(245,240,255,0.93)" },
];

// ── Tones ─────────────────────────────────────────────────────────────
const tones = [
  { id: "traditional",  label: "Traditional & Dignified", desc: "Classic, formal, timeless" },
  { id: "warm",         label: "Warm & Personal",         desc: "Intimate, heartfelt, conversational" },
  { id: "celebratory",  label: "Celebratory & Uplifting", desc: "Joyful, life-affirming, hopeful" },
  { id: "faith",        label: "Faith-Based",             desc: "Spiritual, scripturally inspired" },
  { id: "brief",        label: "Brief & Elegant",         desc: "Concise, poetic, understated" },
];

// ── Form Sections ─────────────────────────────────────────────────────
const sections = [
  { title: "Core Identity", icon: "✦", fields: [
    { id: "fullName",    label: "Full Legal Name",           placeholder: "e.g. Margaret Ann Williams", required: true },
    { id: "nickname",    label: "Preferred Name / Nickname", placeholder: "e.g. Peggy" },
    { id: "dob",         label: "Date of Birth",             placeholder: "e.g. March 3, 1945",         required: true },
    { id: "dod",         label: "Date of Passing",           placeholder: "e.g. April 18, 2026",        required: true },
    { id: "birthCity",   label: "City / State of Birth",     placeholder: "e.g. Savannah, Georgia" },
    { id: "passingCity", label: "City / State of Passing",   placeholder: "e.g. Atlanta, Georgia" },
  ]},
  { title: "Family & Relationships", icon: "❧", fields: [
    { id: "spouse",   label: "Spouse / Partner Name(s)",  placeholder: "e.g. Robert Williams (husband of 42 years)" },
    { id: "children", label: "Children & Grandchildren",  placeholder: "e.g. Son James, daughters Sara and Beth; grandchildren Lily and Noah" },
    { id: "siblings", label: "Surviving Siblings",        placeholder: "e.g. Brother Larry, sister Sandra" },
    { id: "preceded", label: "Preceded in Death By",      placeholder: "e.g. Parents John and Ruth Smith; brother Michael" },
    { id: "parents",  label: "Parents Names",             placeholder: "e.g. John and Ruth Smith" },
  ]},
  { title: "Life & Career", icon: "◈", fields: [
    { id: "education", label: "Education / Degrees",          placeholder: "e.g. B.S. Nursing, University of Georgia, 1967" },
    { id: "career",    label: "Career / Profession",          placeholder: "e.g. Registered Nurse for 35 years", limit: 40 },
    { id: "military",  label: "Military Service",             placeholder: "e.g. U.S. Army, 1968–1972, Vietnam veteran" },
    { id: "faith",     label: "Faith / Religious Affiliation",placeholder: "e.g. Lifelong Baptist" },
    { id: "church",    label: "Church or Congregation",       placeholder: "e.g. First Baptist Church of Atlanta" },
  ]},
  { title: "Personality & Legacy", icon: "✿", fields: [
    { id: "hobbies",     label: "Hobbies & Passions",         placeholder: "e.g. Gardening, quilting, Sunday dinners",      limit: 30 },
    { id: "personality", label: "Personality in 3–5 Words",  placeholder: "e.g. Kind, stubborn, hilarious, generous" },
    { id: "proudest",    label: "Proudest Accomplishment",    placeholder: "e.g. Raising four children as a single mother", limit: 30 },
    { id: "quote",       label: "Favorite Quote or Saying",   placeholder: "e.g. 'Do unto others...'" },
    { id: "missedFor",   label: "What Will People Miss Most", placeholder: "e.g. Her laugh, her cooking",                   limit: 30 },
    { id: "memory",      label: "A Warm or Funny Memory",     placeholder: "e.g. She once drove four hours to bring soup",  limit: 50 },
    { id: "causes",      label: "Causes or Charities",        placeholder: "e.g. American Cancer Society, local food bank", limit: 25 },
  ]},
  { title: "Service Details", icon: "✠", fields: [
    { id: "funeralHome",     label: "Funeral Home Name",            placeholder: "e.g. Eternal Peace Funeral Home" },
    { id: "serviceDate",     label: "Service Date, Time & Location",placeholder: "e.g. Saturday, April 26, 2026 at 2:00 PM" },
    { id: "visitation",      label: "Visitation Details",           placeholder: "e.g. Friday, April 25, 5–8 PM" },
    { id: "specialRequests", label: "Special Requests or Notes",    placeholder: "e.g. Donations to St. Jude's",            limit: 40 },
  ]},
];

// ── Demo Fallback ─────────────────────────────────────────────────────
const DEMO_PARAGRAPHS = [
  "Robert James Henderson, known to everyone who loved him simply as Bobby, passed away peacefully on May 15, 2026, in Charlotte, North Carolina, surrounded by the family he cherished above all else. Born on June 12, 1948, in Charleston, South Carolina, Bobby carried with him throughout his life the warmth, the grit, and the quiet dignity of a man who understood that the measure of a life is found not in its length, but in its depth.",
  "For thirty-two years, Bobby dedicated himself to the men and women of Charlotte Fire Station 7, rising through the ranks to become Battalion Chief — a title he wore with pride, but never with arrogance. His colleagues knew him as the kind of leader who remembered every birthday, showed up first at every fire, and stayed last at every scene. His calling was never simply a job; it was a covenant he made with his community and honored every single day.",
  "Bobby's faith was the bedrock of everything he did. A lifelong Methodist and devoted member of Calvary United Methodist Church, he sang in the choir for over twenty years, led the annual Thanksgiving food drive, and was the first to arrive with a casserole when a neighbor fell ill. His pastor once said that Bobby Henderson was the living definition of a servant's heart — and no one who knew him would argue otherwise.",
  "At home, Bobby was at his most magnificent. He was a devoted husband to his beloved wife Carol, his partner of forty-four years and the love of his life. Together they built something rare and beautiful — a home filled with laughter, the smell of Carol's Sunday roast, and a door that was always open. As a father to Michael, Susan, and David, and as a grandfather to seven grandchildren who called him Papa, Bobby was the steady, shining center of his family's universe.",
  "Those who knew Bobby will remember his laugh first — that big, sudden burst of pure joy that could fill a room and make strangers feel like old friends. They will remember his woodworking shop in the garage, the birdhouses he built for every grandchild, his legendary pulled pork, and his absolute inability to pass a stranger without saying hello. He was, in every sense, one of those rare souls who made the world genuinely better simply by being in it.",
  "Robert James Henderson is survived by his beloved wife Carol; his children Michael Henderson, Susan Henderson-Moore, and David Henderson; his seven grandchildren; and his sister Patricia Wells. He was preceded in death by his parents, James and Dorothy Henderson, and his brother William.",
  "A celebration of Bobby's extraordinary life will be held on Saturday, May 22, 2026, at 2:00 PM at Calvary United Methodist Church, Charlotte. Visitation will be held Friday, May 21, from 5:00 to 8:00 PM at Eternal Grace Funeral Home. In lieu of flowers, the family requests donations to the Charlotte Fire Department Benevolent Fund in Bobby's memory. He will be forever in our hearts."
];

// ── Helpers ───────────────────────────────────────────────────────────
function wordCount(text) {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

const labelStyle = {
  display: "block",
  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  fontSize: 11, fontWeight: 600, color: G.goldDark,
  marginBottom: 4, letterSpacing: "0.8px", textTransform: "uppercase",
};

function getInputStyle(warn) {
  return {
    width: "100%", padding: "10px 13px", borderRadius: 8,
    border: `1.5px solid ${warn ? "#e67e00" : G.inputBorder}`,
    background: G.inputBg, fontFamily: "Georgia, serif",
    fontSize: 13, color: G.charcoal, outline: "none",
    transition: "all 0.2s", boxSizing: "border-box",
  };
}

// ── Logo ──────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div style={{ textAlign: "center", padding: "20px 20px 10px", background: G.black }}>
      <img
        src="https://4everafter.cloud/wp-content/uploads/2026/05/%C2%A92026-4EVERAFTER-LOGO-HDR517-scaled.png"
        alt="4EverAfter"
        style={{
          maxWidth: "clamp(200px, 50vw, 400px)",
          height: "auto", display: "block", margin: "0 auto",
          filter: "drop-shadow(0 0 24px rgba(201,148,26,0.45))",
        }}
      />
    </div>
  );
}

// ── Gold Divider ──────────────────────────────────────────────────────
function GoldLine() {
  return <div style={{ height: 1, background: `linear-gradient(to right, transparent, rgba(201,148,26,0.5), transparent)`, margin: "0 0 20px" }} />;
}

// ── Section Header ────────────────────────────────────────────────────
function SectionHeader({ title, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid rgba(201,148,26,0.2)` }}>
      <span style={{ color: G.gold, fontSize: 14 }}>{icon}</span>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: G.goldDark, margin: 0, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, rgba(201,148,26,0.25), transparent)` }} />
    </div>
  );
}

// ── Background Selector — Hover Preview ──────────────────────────────
function BackgroundSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(null);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e, bgId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPreviewPos({ x: rect.left + rect.width / 2, y: rect.top });
    setHovered(bgId);
  };

  const hoveredBg = backgrounds.find(b => b.id === hovered);

  return (
    <div style={{ marginBottom: 28 }}>
      <label style={{ ...labelStyle, marginBottom: 10 }}>
        Choose Memorial Background <span style={{ color: G.gold }}>*</span>
      </label>
      <p style={{ fontSize: 11, color: G.gray, fontStyle: "italic", margin: "0 0 14px", fontFamily: "Georgia, serif" }}>
        Hover any thumbnail to preview full background · Click to select
      </p>

      {/* Full Portrait Hover Preview */}
      {hovered && hoveredBg && (
        <div style={{
          position: "fixed",
          left: Math.min(previewPos.x - 95, window.innerWidth - 200),
          top: Math.max(previewPos.y - 330, 10),
          width: 190, height: 253,
          borderRadius: 12, overflow: "hidden",
          border: `3px solid ${G.goldLight}`,
          boxShadow: `0 0 0 2px ${G.gold}, 0 24px 60px rgba(0,0,0,0.8)`,
          zIndex: 9999, pointerEvents: "none",
          background: "#1a0d00",
        }}>
          <img
            src={hoveredBg.image}
            alt={hoveredBg.label}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
            padding: "24px 10px 10px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontWeight: 700, color: G.goldLight, letterSpacing: "0.5px" }}>
              {hoveredBg.label}
            </div>
          </div>
        </div>
      )}

      {/* 5 x 3 compact grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {backgrounds.map(bg => (
          <button
            key={bg.id}
            onClick={() => onChange(bg.id)}
            onMouseEnter={e => handleMouseEnter(e, bg.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: "transparent", border: "none",
              padding: 0, cursor: "pointer",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4,
            }}
          >
            <div style={{
              width: "100%", paddingBottom: "75%",
              position: "relative", borderRadius: 8, overflow: "hidden",
              border: value === bg.id
                ? `3px solid ${G.goldLight}`
                : hovered === bg.id
                  ? `3px solid rgba(201,148,26,0.6)`
                  : "3px solid rgba(201,148,26,0.15)",
              boxShadow: value === bg.id
                ? `0 0 0 2px ${G.gold}, 0 4px 16px rgba(201,148,26,0.5)`
                : hovered === bg.id
                  ? `0 4px 16px rgba(0,0,0,0.5)`
                  : "0 2px 6px rgba(0,0,0,0.4)",
              transition: "all 0.15s ease",
              transform: hovered === bg.id ? "scale(1.08)" : "scale(1)",
            }}>
              <img
                src={bg.image}
                alt={bg.label}
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover", display: "block",
                }}
                onError={e => {
                  e.target.style.display = "none";
                  e.target.parentElement.style.background = "rgba(201,148,26,0.08)";
                }}
              />
              {value === bg.id && (
                <div style={{
                  position: "absolute", top: 3, right: 3,
                  width: 18, height: 18, borderRadius: "50%",
                  background: G.gold,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: "#1a0d00", fontWeight: 700,
                }}>✓</div>
              )}
            </div>
            <span style={{
              fontSize: 8.5,
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: value === bg.id ? 700 : 400,
              color: value === bg.id ? G.goldLight : hovered === bg.id ? G.gold : G.gray,
              textAlign: "center", lineHeight: 1.2,
              transition: "color 0.15s",
            }}>{bg.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Tone Selector ─────────────────────────────────────────────────────
function ToneSelector({ value, onChange }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ ...labelStyle, marginBottom: 10 }}>
        Select Obituary Tone <span style={{ color: G.gold }}>*</span>
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
        {tones.map(t => (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            background: value === t.id
              ? `linear-gradient(135deg, ${G.goldDeep}, ${G.goldDark}, ${G.gold})`
              : "rgba(255,250,235,0.8)",
            border: value === t.id ? `1.5px solid ${G.goldLight}` : "1.5px solid rgba(201,148,26,0.2)",
            borderRadius: 10, padding: "12px 10px", cursor: "pointer", textAlign: "left",
            transition: "all 0.2s",
            boxShadow: value === t.id ? `0 4px 20px rgba(201,148,26,0.3)` : "none",
          }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontWeight: 700, color: value === t.id ? G.cream : G.goldDark, marginBottom: 3, letterSpacing: "0.5px" }}>{t.label}</div>
            <div style={{ fontSize: 10, color: value === t.id ? "rgba(253,248,240,0.75)" : "#7a6040", fontStyle: "italic", fontFamily: "Georgia, serif" }}>{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────
function Field({ field, value, onChange }) {
  const limit = field.limit;
  const wc = limit ? wordCount(value) : 0;
  const isOver = limit && wc > limit;
  const isWarn = limit && wc >= limit * 0.8 && !isOver;

  return (
    <div style={{ marginBottom: 15 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <label style={labelStyle}>
          {field.label}{field.required && <span style={{ color: G.gold, marginLeft: 4 }}>*</span>}
        </label>
        {limit && (
          <span style={{ fontSize: 10, fontFamily: "Georgia, serif", color: isOver ? "#ff4444" : isWarn ? "#e67e00" : G.gray, fontStyle: "italic" }}>
            {isOver ? `⚠ ${wc - limit} over` : `${wc}/${limit}`}
          </span>
        )}
      </div>
      <input
        style={getInputStyle(isOver || isWarn)}
        placeholder={field.placeholder}
        value={value || ""}
        onChange={e => onChange(field.id, e.target.value)}
        onFocus={e => { e.target.style.borderColor = G.goldLight; e.target.style.boxShadow = `0 0 0 3px rgba(201,148,26,0.15)`; }}
        onBlur={e => { e.target.style.borderColor = (isOver || isWarn) ? "#e67e00" : G.inputBorder; e.target.style.boxShadow = "none"; }}
      />
      {isOver && (
        <div style={{ marginTop: 4, padding: "5px 10px", background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.25)", borderRadius: 6, fontSize: 11, color: "#ff6666", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          🔔 Please trim to {limit} words for best results
        </div>
      )}
    </div>
  );
}

// ── Photo Upload — Multiple Photos ────────────────────────────────────
function PhotoUpload({ photos, onChange }) {
  const fileRef = useRef();
  const addPhotos = (files) => {
    Array.from(files).slice(0, 5 - photos.length).forEach(file => {
      const r = new FileReader();
      r.onload = ev => onChange(prev => [...prev, ev.target.result]);
      r.readAsDataURL(file);
    });
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ ...labelStyle, marginBottom: 8 }}>
        Photos of Loved One
        <span style={{ color: G.gray, fontWeight: 400, marginLeft: 8, textTransform: "none", fontSize: 10 }}>Up to 5 photos — first appears in memorial</span>
      </label>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {photos.map((p, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img src={p} alt={`Memorial ${i + 1}`} style={{ width: 65, height: 78, objectFit: "cover", borderRadius: 7, border: `2px solid ${G.gold}`, boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }} />
            <button onClick={() => onChange(prev => prev.filter((_, j) => j !== i))} style={{
              position: "absolute", top: -6, right: -6, width: 18, height: 18,
              borderRadius: "50%", background: "#cc3333", border: "none",
              cursor: "pointer", color: "#fff", fontSize: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
            {i === 0 && <div style={{ position: "absolute", bottom: 2, left: 2, background: "rgba(201,148,26,0.9)", borderRadius: 3, fontSize: 8, color: "#1a0d00", padding: "1px 4px", fontFamily: "Georgia, serif", fontWeight: 700 }}>MAIN</div>}
          </div>
        ))}
        {photos.length < 5 && (
          <div onClick={() => fileRef.current.click()} style={{
            width: 65, height: 78, border: `2px dashed rgba(201,148,26,0.35)`,
            borderRadius: 7, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            cursor: "pointer", background: "rgba(201,148,26,0.05)", gap: 3,
          }}>
            <span style={{ fontSize: 18 }}>📷</span>
            <span style={{ fontSize: 8, color: G.gray, fontFamily: "Georgia, serif" }}>Add Photo</span>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }}
        onChange={e => addPhotos(e.target.files)} />
    </div>
  );
}

// ── Editable Paragraph ────────────────────────────────────────────────
function EditableParagraph({ text, index, onEdit, onRewrite, rewriting, isMobile }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const [hovered, setHovered] = useState(false);

  const save = () => { onEdit(index, draft); setEditing(false); };
  const cancel = () => { setDraft(text); setEditing(false); };

  return (
    <div
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      style={{
        position: "relative", borderRadius: 6,
        padding: isMobile ? "4px 6px 30px" : "4px 6px",
        margin: "0 -6px 12px",
        background: hovered && !editing ? "rgba(201,148,26,0.04)" : "transparent",
        transition: "background 0.2s",
      }}
    >
      {editing ? (
        <div>
          <textarea value={draft} onChange={e => setDraft(e.target.value)} autoFocus style={{
            width: "100%", minHeight: 90, padding: "10px 12px",
            fontFamily: "Georgia, serif", fontSize: 14, lineHeight: 1.85,
            color: G.charcoal, border: `2px solid ${G.gold}`, borderRadius: 8,
            resize: "vertical", outline: "none", background: "#fffdf7", boxSizing: "border-box",
          }} />
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button onClick={save} style={{ padding: "7px 18px", background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`, border: "none", borderRadius: 7, cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 12, color: "#1a0d00", fontWeight: 600 }}>✓ Save</button>
            <button onClick={cancel} style={{ padding: "7px 14px", background: "transparent", border: `1px solid rgba(201,148,26,0.3)`, borderRadius: 7, cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 12, color: G.gray }}>✕ Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 14, lineHeight: 1.88, color: "#2a2a2a", margin: 0, textAlign: "justify" }}>{text}</p>
          {isMobile ? (
            <div style={{ position: "absolute", bottom: 2, right: 4, display: "flex", gap: 4 }}>
              <button onClick={() => { setDraft(text); setEditing(true); }} style={{ padding: "3px 8px", fontSize: 10, borderRadius: 5, background: "rgba(253,248,240,0.95)", border: `1px solid rgba(201,148,26,0.3)`, cursor: "pointer", color: G.goldDark, fontFamily: "Georgia, serif" }}>✏️</button>
              <button onClick={() => onRewrite(index, text)} disabled={rewriting === index} style={{ padding: "3px 8px", fontSize: 10, borderRadius: 5, background: rewriting === index ? "#eee" : G.gold, border: "none", cursor: "pointer", color: "#1a0d00", fontFamily: "Georgia, serif", fontWeight: 600 }}>{rewriting === index ? "⟳" : "✦"}</button>
            </div>
          ) : hovered && (
            <div style={{ position: "absolute", top: 2, right: 2, display: "flex", gap: 5 }}>
              <button onClick={() => { setDraft(text); setEditing(true); }} style={{ padding: "3px 10px", fontSize: 10, borderRadius: 5, background: "rgba(253,248,240,0.97)", border: `1px solid rgba(201,148,26,0.3)`, cursor: "pointer", color: G.goldDark, fontFamily: "Georgia, serif", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>✏️ Edit</button>
              <button onClick={() => onRewrite(index, text)} disabled={rewriting === index} style={{ padding: "3px 10px", fontSize: 10, borderRadius: 5, background: rewriting === index ? "#eee" : G.gold, border: "none", cursor: rewriting === index ? "not-allowed" : "pointer", color: "#1a0d00", fontFamily: "Georgia, serif", fontWeight: 600, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>{rewriting === index ? "⟳ Rewriting..." : "✦ AI Rewrite"}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Obituary Output ───────────────────────────────────────────────────
function ObituaryOutput({ paragraphs, setParagraphs, formData, photos, bgId, buildContext, isMobile }) {
  const [rewriting, setRewriting] = useState(null);
  const bg = backgrounds.find(b => b.id === bgId) || backgrounds[0];
  const name = formData.fullName || "Beloved";
  const totalWords = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  const wcOk = totalWords >= 420 && totalWords <= 580;
  const wcOver = totalWords > 580;
  const mainPhoto = photos[0] || null;
  const extraPhotos = photos.slice(1);

  const handleEdit = (i, t) => setParagraphs(prev => prev.map((p, j) => j === i ? t : p));

  const handleRewrite = async (index, originalText) => {
    setRewriting(index);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Rewrite this single obituary paragraph with completely fresh wording while preserving all facts and tone. Return ONLY the rewritten paragraph.\n\nContext:\n${buildContext()}\n\nParagraph:\n${originalText}` }),
      });
      const data = await res.json();
      const newText = data.text?.trim() || "";
      if (newText) handleEdit(index, newText);
    } catch (e) {}
    setRewriting(null);
  };

  const handlePrint = () => {
    const printContent = `<html><head>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Dancing+Script:wght@700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400" rel="stylesheet">
      <style>
        @page { margin: 0; size: 8in 10in; }
        body { margin: 0; padding: 0; font-family: 'Cormorant Garamond', Georgia, serif; }
        .bg { background-image: url('${bg.image}'); background-size: cover; background-position: center; width: 8in; height: 10in; padding: 0.5in; box-sizing: border-box; }
        .paper { background: ${bg.paperBg}; border-radius: 8px; padding: 0.35in 0.4in; height: 9in; box-sizing: border-box; overflow: hidden; }
        .flowers { text-align:center; color:#C9941A; font-size:14px; letter-spacing:5px; margin:0 0 5px; }
        .in-loving { text-align:center; font-size:10px; color:#888; letter-spacing:4px; text-transform:uppercase; font-style:italic; }
        .name { font-family:'Dancing Script',cursive; font-size:42px; text-align:center; color:#8B6310; margin:3px 0 14px; line-height:1.2; }
        /* Photo floats top left - 2.5 x 3.5 inches */
        .photo-wrap { float:left; margin: 0 16px 10px 0; }
        .photo-main { width:2.5in; height:3.5in; object-fit:cover; border-radius:6px; border:2px solid rgba(201,148,26,0.45); box-shadow:0 4px 16px rgba(0,0,0,0.15); display:block; }
        .photo-extras { display:flex; gap:4px; margin-top:6px; flex-wrap:wrap; max-width:2.5in; }
        .photo-extra { width:1.2in; height:1.2in; object-fit:cover; border-radius:4px; border:2px solid rgba(201,148,26,0.35); }
        p { font-size:13px; line-height:1.85; margin:0 0 10px; text-align:justify; color:#2a2a2a; }
        .clearfix::after { content:""; display:table; clear:both; }
        .footer { text-align:center; margin-top:16px; padding-top:12px; border-top:1px solid rgba(201,148,26,0.2); }
        .f-logo { font-family:'Playfair Display',serif; font-size:15px; color:#8B6310; font-weight:700; }
        .f-tag { font-size:8px; color:#aaa; font-style:italic; margin-top:2px; }
      </style></head><body>
      <div class="bg"><div class="paper">
      <div class="flowers">✿ ✦ ✿</div>
      <div class="in-loving">In Loving Memory of</div>
      <div class="name">${name}</div>
      <div class="clearfix">
        ${mainPhoto ? `
        <div class="photo-wrap">
          <img class="photo-main" src="${mainPhoto}" alt="${name}" />
          ${extraPhotos.length > 0 ? `<div class="photo-extras">${extraPhotos.map(ep => `<img class="photo-extra" src="${ep}" alt="" />`).join("")}</div>` : ""}
        </div>` : ""}
        ${paragraphs.map(p => `<p>${p}</p>`).join("")}
      </div>
      <div class="footer">
        <div class="f-logo">4EverAfter™</div>
        <div class="f-tag">"Turning Farewells Into Meaningful Memories"</div>
      </div>
      </div></div></body></html>`;
    const win = window.open("", "_blank");
    win.document.write(printContent);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 900);
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        background: "rgba(10,5,0,0.97)", borderRadius: "14px 14px 0 0",
        padding: isMobile ? "11px 14px" : "13px 22px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 8,
        border: `1px solid rgba(201,148,26,0.22)`, borderBottom: "none",
      }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 12, color: wcOver ? "#ff4444" : wcOk ? "#4ade80" : G.gold, fontWeight: 600 }}>
          {wcOver ? `⚠ ${totalWords} words — trim needed` : wcOk ? `✓ ${totalWords} words — perfect` : `${totalWords} words`}
        </div>
        <button onClick={handlePrint} style={{
          padding: "8px 18px",
          background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`,
          border: "none", borderRadius: 8, cursor: "pointer",
          fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontWeight: 700,
          color: "#1a0d00", boxShadow: `0 3px 12px rgba(201,148,26,0.4)`,
          letterSpacing: "0.5px",
        }}>⬇ Download / Print — 8×10</button>
      </div>

      {/* Memorial Card */}
      <div style={{
        backgroundImage: `url(${bg.image})`,
        backgroundSize: "cover", backgroundPosition: "center",
        borderRadius: "0 0 14px 14px",
        border: `1px solid rgba(201,148,26,0.2)`, borderTop: "none",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        padding: isMobile ? "10px" : "16px",
      }}>
        <div style={{
          background: bg.paperBg, borderRadius: 10,
          padding: isMobile ? "22px 16px" : "36px 40px",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          position: "relative",
        }}>
          {/* Corner decorations */}
          {["top-left","top-right","bottom-left","bottom-right"].map(pos => (
            <div key={pos} style={{
              position: "absolute",
              [pos.includes("top") ? "top" : "bottom"]: 10,
              [pos.includes("left") ? "left" : "right"]: 10,
              width: 24, height: 24,
              borderTop: pos.includes("top") ? `2px solid rgba(201,148,26,0.3)` : "none",
              borderBottom: pos.includes("bottom") ? `2px solid rgba(201,148,26,0.3)` : "none",
              borderLeft: pos.includes("left") ? `2px solid rgba(201,148,26,0.3)` : "none",
              borderRight: pos.includes("right") ? `2px solid rgba(201,148,26,0.3)` : "none",
            }} />
          ))}

          <div style={{ textAlign: "center", marginBottom: 5 }}>
            <span style={{ color: G.gold, fontSize: 14, opacity: 0.65, letterSpacing: 6 }}>✿ ✦ ✿</span>
          </div>
          <div style={{ textAlign: "center", marginBottom: 3 }}>
            <div style={{ fontSize: 11, color: "#888", fontStyle: "italic", letterSpacing: "3px", textTransform: "uppercase" }}>In Loving Memory of</div>
          </div>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 14 : 18 }}>
            <div style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: isMobile ? "clamp(26px, 7vw, 36px)" : "clamp(28px, 4vw, 44px)",
              background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold}, ${G.goldLight})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              lineHeight: 1.2,
            }}>{name}</div>
          </div>

          {/* Photo floats top left — text wraps around */}
          {mainPhoto && !isMobile ? (
            <div>
              <div style={{
                float: "left",
                margin: "2px 18px 10px 0",
                width: "180px", // ~2.5 inches at 72dpi screen
              }}>
                <img src={mainPhoto} alt={name} style={{
                  width: "180px", height: "252px", // 2.5:3.5 ratio
                  objectFit: "cover", borderRadius: 7,
                  border: `2px solid rgba(201,148,26,0.45)`,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  display: "block",
                }} />
                {extraPhotos.length > 0 && (
                  <div style={{ display: "flex", gap: 4, marginTop: 5, flexWrap: "wrap", maxWidth: "180px" }}>
                    {extraPhotos.map((ep, i) => (
                      <img key={i} src={ep} alt="" style={{ width: 84, height: 84, objectFit: "cover", borderRadius: 5, border: `2px solid rgba(201,148,26,0.35)` }} />
                    ))}
                  </div>
                )}
              </div>
              {paragraphs.map((para, i) => (
                <EditableParagraph key={i} text={para} index={i} onEdit={handleEdit} onRewrite={handleRewrite} rewriting={rewriting} isMobile={false} />
              ))}
              <div style={{ clear: "both" }} />
            </div>
          ) : (
            <>
              {mainPhoto && isMobile && (
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                  <img src={mainPhoto} alt={name} style={{ width: 110, height: 154, objectFit: "cover", borderRadius: 7, border: `2px solid rgba(201,148,26,0.4)` }} />
                </div>
              )}
              {paragraphs.map((para, i) => (
                <EditableParagraph key={i} text={para} index={i} onEdit={handleEdit} onRewrite={handleRewrite} rewriting={rewriting} isMobile={isMobile} />
              ))}
            </>
          )}

          <div style={{ textAlign: "center", marginTop: 22, paddingTop: 14, borderTop: `1px solid rgba(201,148,26,0.2)` }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold}, ${G.goldLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>4EverAfter™</div>
            <div style={{ fontSize: 9, color: "#aaa", fontStyle: "italic", marginTop: 2 }}>"Turning Farewells Into Meaningful Memories"</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────
export default function App() {
  const [formData, setFormData] = useState({});
  const [tone, setTone] = useState("");
  const [bgId, setBgId] = useState("floral");
  const [photos, setPhotos] = useState([]);
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("form");
  const [isMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 600);

  const updateField = (id, value) => setFormData(p => ({ ...p, [id]: value }));

  const buildContext = useCallback(() => {
    const fields = sections.flatMap(s => s.fields);
    return fields.filter(f => formData[f.id]).map(f => `${f.label}: ${formData[f.id]}`).join("\n");
  }, [formData]);

  const buildPrompt = () => {
    const toneLabel = tones.find(t => t.id === tone)?.label || "Warm & Personal";
    return `You are writing a beautiful, dignified obituary for a printed 8x10 memorial program.

Tone: ${toneLabel}

Information provided:
${buildContext()}

Write a heartfelt, flowing obituary of approximately 500 words. Use natural paragraph breaks — separate each paragraph with a blank line. Do not use headers or bullet points. Begin with a warm memorable opening sentence. Weave in their life story, relationships, career, faith, personality and legacy. End gracefully with service details if provided. Write as if you truly knew this person — personal, dignified, deeply human. Return only the obituary text with no preamble or commentary.`;
  };

  const generate = async () => {
    if (!formData.fullName || !formData.dob || !formData.dod) {
      setError("Please fill in Full Name, Date of Birth, and Date of Passing at minimum.");
      return;
    }
    if (!tone) { setError("Please select a tone for the tribute."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const text = data.text || "";
      const paras = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
      if (paras.length > 0) {
        setParagraphs(paras);
        setStep("result");
      } else throw new Error("Empty response");
    } catch (e) {
      // Demo fallback — personalizes with entered data
      setParagraphs(DEMO_PARAGRAPHS.map(p =>
        p.replace(/Robert James Henderson/g, formData.fullName || "Robert James Henderson")
         .replace(/Bobby/g, formData.nickname || (formData.fullName ? formData.fullName.split(" ")[0] : "Bobby"))
         .replace(/May 15, 2026/g, formData.dod || "May 15, 2026")
         .replace(/June 12, 1948/g, formData.dob || "June 12, 1948")
         .replace(/Charlotte, North Carolina/g, formData.passingCity || "Charlotte, North Carolina")
         .replace(/Charleston, South Carolina/g, formData.birthCity || "Charleston, South Carolina")
      ));
      setStep("result");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: PARCHMENT_BG, fontFamily: "Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Dancing+Script:wght@600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(201,148,26,0.3); font-style: italic; }
        button { transition: transform 0.1s, box-shadow 0.1s; }
        button:active { transform: scale(0.97); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f5e8c8; }
        ::-webkit-scrollbar-thumb { background: #8B6310; border-radius: 3px; }
        @media (max-width:500px) { input { font-size: 16px !important; } }
      `}</style>

      <Logo />
      <GoldLine />

      <div style={{ maxWidth: 920, margin: "0 auto", padding: isMobile ? "12px 12px 60px" : "20px 20px 80px" }}>

        {step === "form" && (
          <div style={{
            background: "rgba(253,248,235,0.97)",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeBlend in='SourceGraphic' mode='multiply'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
            borderRadius: 20,
            padding: isMobile ? "20px 16px" : "36px 38px",
            boxShadow: "0 20px 60px rgba(139,99,16,0.15), 0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(245,200,66,0.3)",
            border: `1px solid rgba(201,148,26,0.25)`,
          }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 20 : 26, color: G.goldDeep, margin: "0 0 6px", fontWeight: 600, letterSpacing: "1px" }}>
                Create a Meaningful Tribute
              </h1>
              <div style={{ height: 1, background: `linear-gradient(to right, transparent, rgba(201,148,26,0.35), transparent)`, margin: "10px 0 8px" }} />
              <p style={{ color: "#7a6040", fontSize: 12, margin: 0, fontStyle: "italic" }}>
                Share what made your loved one extraordinary — we'll craft their life's story with care and dignity
              </p>
            </div>

            <BackgroundSelector value={bgId} onChange={setBgId} />
            <ToneSelector value={tone} onChange={setTone} />
            <PhotoUpload photos={photos} onChange={setPhotos} />

            <div style={{ height: 1, background: `linear-gradient(to right, transparent, rgba(201,148,26,0.25), transparent)`, margin: "4px 0 24px" }} />

            {sections.map(section => (
              <div key={section.title} style={{ marginBottom: 26 }}>
                <SectionHeader title={section.title} icon={section.icon} />
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(265px, 1fr))", gap: "0 22px" }}>
                  {section.fields.map(f => <Field key={f.id} field={f} value={formData[f.id]} onChange={updateField} />)}
                </div>
              </div>
            ))}

            {error && (
              <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: 10, padding: "11px 16px", color: "#fca5a5", fontSize: 13, marginBottom: 18, fontFamily: "Georgia, serif" }}>
                {error}
              </div>
            )}

            {/* THE BUTTON */}
            <button
              onClick={generate}
              disabled={loading}
              style={{
                width: "100%",
                padding: isMobile ? "18px 16px" : "22px 16px",
                background: loading
                  ? "rgba(80,60,20,0.4)"
                  : `linear-gradient(180deg, ${G.goldLight} 0%, ${G.gold} 40%, ${G.goldDark} 100%)`,
                border: loading ? `1px solid rgba(201,148,26,0.2)` : `1px solid ${G.goldLight}`,
                borderRadius: 14,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? 16 : 20,
                fontWeight: 700,
                color: loading ? "rgba(201,148,26,0.4)" : G.darkBrown,
                letterSpacing: "2px",
                textTransform: "uppercase",
                boxShadow: loading ? "none" : `
                  0 8px 0 ${G.goldDeep},
                  0 12px 20px rgba(0,0,0,0.5),
                  0 2px 0 rgba(245,200,66,0.6) inset,
                  0 -2px 0 rgba(92,61,8,0.8) inset
                `,
                transform: loading ? "none" : "translateY(0)",
                transition: "all 0.15s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseDown={e => { if (!loading) e.currentTarget.style.transform = "translateY(4px)"; e.currentTarget.style.boxShadow = `0 4px 0 ${G.goldDeep}, 0 6px 12px rgba(0,0,0,0.4), 0 2px 0 rgba(245,200,66,0.4) inset`; }}
              onMouseUp={e => { if (!loading) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 0 ${G.goldDeep}, 0 12px 20px rgba(0,0,0,0.5), 0 2px 0 rgba(245,200,66,0.6) inset, 0 -2px 0 rgba(92,61,8,0.8) inset`; }}}
            >
              {loading ? "✦  Crafting Their Life's Story..." : "✦  Create Your Life's Story Tribute  ✦"}
            </button>

            <p style={{ textAlign: "center", fontSize: 10, color: "rgba(139,99,16,0.5)", margin: "10px 0 0", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
              Powered by AI · 4EverAfter™ · Secure & Confidential
            </p>
          </div>
        )}

        {step === "result" && paragraphs.length > 0 && (
          <div>
            <div style={{
              background: "rgba(253,245,220,0.9)", border: `1px solid rgba(201,148,26,0.3)`,
              borderRadius: 10, padding: "10px 16px", marginBottom: 12,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 13 }}>✏️</span>
              <div style={{ fontFamily: "Georgia, serif", fontSize: isMobile ? 11 : 12, color: G.goldDark }}>
                <strong>Your tribute is ready.</strong> {isMobile ? "Tap ✏️ or ✦ below each paragraph." : "Hover any paragraph to edit directly or request an AI rewrite."}
              </div>
            </div>

            <ObituaryOutput
              paragraphs={paragraphs} setParagraphs={setParagraphs}
              formData={formData} photos={photos} bgId={bgId}
              buildContext={buildContext} isMobile={isMobile}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button onClick={() => { setStep("form"); setParagraphs([]); }} style={{
                flex: 1, padding: "13px 8px",
                background: "rgba(255,250,235,0.8)",
                border: `1px solid rgba(201,148,26,0.25)`,
                borderRadius: 10, cursor: "pointer",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? 12 : 13, color: G.goldLight, letterSpacing: "0.5px",
              }}>← Edit Information</button>
              <button onClick={generate} disabled={loading} style={{
                flex: 2, padding: "13px",
                background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`,
                border: "none", borderRadius: 10, cursor: "pointer",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? 12 : 14, fontWeight: 700,
                color: "#1a0d00", letterSpacing: "1px",
                boxShadow: `0 4px 18px rgba(201,148,26,0.3)`,
              }}>{loading ? "⟳ Regenerating..." : "↻ Regenerate Tribute"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
