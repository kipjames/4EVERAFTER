import { useState, useRef, useCallback } from "react";

const GOLD = "#C9941A";
const GOLD_LIGHT = "#F5C842";
const GOLD_DARK = "#8B6310";
const CHARCOAL = "#1a1a1a";

// ── 10 Background Themes ─────────────────────────────────────────────
// Replace the `css` gradient with your actual ghosted image URLs like:
// image: "url('/wp-content/uploads/4everafter/bg-floral.jpg')"

// eslint-disable-next-line no-unused-vars
// ── Demo Mode Content ─────────────────────────────────────────────────
const DEMO_PARAGRAPHS = [
  "Robert James Henderson, known to everyone who loved him simply as Bobby, passed away peacefully on May 15, 2026, in Charlotte, North Carolina, surrounded by the family he cherished above all else. Born on June 12, 1948, in Charleston, South Carolina, Bobby carried with him throughout his life the warmth, the grit, and the quiet dignity of a man who understood that the measure of a life is found not in its length, but in its depth.",

  "For thirty-two years, Bobby dedicated himself to the men and women of Charlotte Fire Station 7, rising through the ranks to become Battalion Chief — a title he wore with pride, but never with arrogance. His colleagues knew him as the kind of leader who remembered every birthday, showed up first at every fire, and stayed last at every scene. His calling was never simply a job; it was a covenant he made with his community and honored every single day.",

  "Bobby's faith was the bedrock of everything he did. A lifelong Methodist and devoted member of Calvary United Methodist Church, he sang in the choir for over twenty years, led the annual Thanksgiving food drive, and was the first to arrive with a casserole when a neighbor fell ill. His pastor once said that Bobby Henderson was the living definition of a servant's heart — and no one who knew him would argue otherwise.",

  "At home, Bobby was at his most magnificent. He was a devoted husband to his beloved wife Carol, his partner of forty-four years and the love of his life. Together they built something rare and beautiful — a home filled with laughter, the smell of Carol's Sunday roast, and a door that was always open. As a father to Michael, Susan, and David, and as a grandfather to seven grandchildren who called him Papa, Bobby was the steady, shining center of his family's universe.",

  "Those who knew Bobby will remember his laugh first — that big, sudden burst of pure joy that could fill a room and make strangers feel like old friends. They will remember his woodworking shop in the garage, the birdhouses he built for every grandchild, his legendary pulled pork, and his absolute inability to pass a stranger without saying hello. He was, in every sense, one of those rare souls who made the world genuinely better simply by being in it.",

  "Robert James Henderson is survived by his beloved wife Carol; his children Michael Henderson, Susan Henderson-Moore, and David Henderson; his seven grandchildren; his sister Patricia Wells; and countless friends who considered themselves family. He was preceded in death by his parents, James and Dorothy Henderson, and his brother William.",

  "A celebration of Bobby's extraordinary life will be held on Saturday, May 22, 2026, at 2:00 PM at Calvary United Methodist Church, Charlotte. Visitation will be held Friday, May 21, from 5:00 to 8:00 PM at Eternal Grace Funeral Home. In lieu of flowers, the family requests donations to the Charlotte Fire Department Benevolent Fund in Bobby's memory. He will be forever in our hearts."
];



const backgrounds = [
  {
    id: "floral",
    label: "Soft Florals",
    icon: "🌸",
    css: "linear-gradient(135deg, #fdf0f5 0%, #fce4ec 40%, #f8d7e3 100%)",
    image: "https://4everafter.cloud/wp-content/uploads/2026/base-options/soft-floral-life-story-base.jpg",
    paperBg: "#fdf6f0",
  },
  {
    id: "autumn",
    label: "Autumn Leaves",
    icon: "🍂",
    css: "linear-gradient(135deg, #fdf3e7 0%, #f5dfc0 40%, #e8c99a 100%)",
    image: "https://4everafter.cloud/wp-content/uploads/2026/base-options/autumn-leaves-life-story-base.jpg",
    paperBg: "#fdf8f2",
  },
  {
    id: "ocean",
    label: "Ocean & Coast",
    icon: "🌊",
    css: "linear-gradient(135deg, #e8f4f8 0%, #c8e6f0 40%, #a8d8ea 100%)",
    image: "https://4everafter.cloud/wp-content/uploads/2026/base-options/ocean-coast-life-story-obit-base.jpg",
    paperBg: "#f4fafc",
  },
  {
    id: "cross",
    label: "Faith & Grace",
    icon: "✝️",
    css: "linear-gradient(135deg, #f5f0e8 0%, #ede0c8 40%, #e0cba8 100%)",
    image: "https://4everafter.cloud/wp-content/uploads/2026/base-options/faith-and-grace-lifestory-obit-base.jpg",
    paperBg: "#faf7f2",
  },
  {
    id: "flag",
    label: "Military Honor",
    icon: "🎖️",
    css: "linear-gradient(135deg, #f0f4f8 0%, #d0dde8 40%, #b8ccd8 100%)",
    image: "https://4everafter.cloud/wp-content/uploads/2026/base-options/military-honor-life-story-obit-base.jpg",
    paperBg: "#f4f7fa",
  },
  {
    id: "garden",
    label: "Garden & Nature",
    icon: "🌿",
    css: "linear-gradient(135deg, #f0f5ec 0%, #d8ecd0 40%, #c0dfb4 100%)",
    image: "https://4everafter.cloud/wp-content/uploads/2026/base-options/garden-nature-life-story-base.jpg",
    paperBg: "#f4faf2",
  },
  {
    id: "linen",
    label: "Elegant Linen",
    icon: "🕊️",
    css: "linear-gradient(135deg, #f8f6f2 0%, #eeebe4 40%, #e4dfd6 100%)",
    image: "https://4everafter.cloud/wp-content/uploads/2026/base-options/elegant-linen-life-story-base.jpg",
    paperBg: "#faf9f7",
  },
  {
    id: "sunset",
    label: "Golden Sunset",
    icon: "🌅",
    css: "linear-gradient(135deg, #fdf4e8 0%, #f5ddb8 40%, #ecc888 100%)",
    image: "https://4everafter.cloud/wp-content/uploads/2026/base-options/golden-sunset-life-story-obit-base.jpg",
    paperBg: "#fdf8f0",
  },
  {
    id: "vintage",
    label: "Vintage Script",
    icon: "📜",
    css: "linear-gradient(135deg, #f5f0e4 0%, #ede4cc 40%, #e0d4b0 100%)",
    image: "https://4everafter.cloud/wp-content/uploads/2026/base-options/vintage-script-life-story-obit-base.jpg",
    paperBg: "#faf7ef",
  },
  {
    id: "candlelight",
    label: "Candlelight",
    icon: "🕯️",
    css: "linear-gradient(135deg, #fdf8f0 0%, #f5e8d0 40%, #ecd8b8 100%)",
    image: "https://4everafter.cloud/wp-content/uploads/2026/base-options/candles-life-story-obit-base.jpg",
    paperBg: "#fdfaf4",
  },
];

const tones = [
  { id: "traditional", label: "Traditional & Dignified", desc: "Classic, formal, timeless" },
  { id: "warm", label: "Warm & Personal", desc: "Intimate, heartfelt, conversational" },
  { id: "celebratory", label: "Celebratory & Uplifting", desc: "Joyful, life-affirming, hopeful" },
  { id: "faith", label: "Faith-Based", desc: "Spiritual, scripturally inspired" },
  { id: "brief", label: "Brief & Elegant", desc: "Concise, poetic, understated" },
];

const sections = [
  {
    title: "Core Identity", icon: "✦",
    fields: [
      { id: "fullName", label: "Full Legal Name", placeholder: "e.g. Margaret Ann Williams", required: true },
      { id: "nickname", label: "Preferred Name / Nickname", placeholder: "e.g. Peggy" },
      { id: "dob", label: "Date of Birth", placeholder: "e.g. March 3, 1945", required: true },
      { id: "dod", label: "Date of Passing", placeholder: "e.g. April 18, 2026", required: true },
      { id: "birthCity", label: "City / State of Birth", placeholder: "e.g. Savannah, Georgia" },
      { id: "passingCity", label: "City / State of Passing", placeholder: "e.g. Atlanta, Georgia" },
    ],
  },
  {
    title: "Family & Relationships", icon: "❧",
    fields: [
      { id: "spouse", label: "Spouse / Partner Name(s)", placeholder: "e.g. Robert Williams (husband of 42 years)" },
      { id: "children", label: "Children & Grandchildren", placeholder: "e.g. Son James, daughters Sara and Beth; grandchildren Lily and Noah" },
      { id: "siblings", label: "Surviving Siblings", placeholder: "e.g. Brother Larry, sister Sandra" },
      { id: "preceded", label: "Preceded in Death By", placeholder: "e.g. Parents John and Ruth Smith; brother Michael" },
      { id: "parents", label: "Parents Names", placeholder: "e.g. John and Ruth Smith" },
    ],
  },
  {
    title: "Life & Career", icon: "◈",
    fields: [
      { id: "education", label: "Education / Degrees", placeholder: "e.g. B.S. Nursing, University of Georgia, 1967" },
      { id: "career", label: "Career / Profession", placeholder: "e.g. Registered Nurse for 35 years at Grady Memorial Hospital" },
      { id: "military", label: "Military Service", placeholder: "e.g. U.S. Army, 1968–1972, Vietnam veteran" },
      { id: "faith", label: "Faith / Religious Affiliation", placeholder: "e.g. Lifelong Baptist, member of First Baptist Church" },
      { id: "church", label: "Church or Congregation", placeholder: "e.g. First Baptist Church of Atlanta" },
    ],
  },
  {
    title: "Personality & Legacy", icon: "✿",
    fields: [
      { id: "hobbies", label: "Hobbies & Passions", placeholder: "e.g. Gardening, quilting, Sunday dinners with family" },
      { id: "personality", label: "Personality in 3–5 Words", placeholder: "e.g. Kind, stubborn, hilarious, generous" },
      { id: "proudest", label: "Proudest Accomplishment", placeholder: "e.g. Raising four children as a single mother" },
      { id: "quote", label: "Favorite Quote or Saying", placeholder: "e.g. 'Do unto others as you would have them do unto you'" },
      { id: "missedFor", label: "What Will People Miss Most", placeholder: "e.g. Her laugh, her cooking, always knowing the right thing to say" },
      { id: "memory", label: "A Warm or Funny Memory", placeholder: "e.g. She once drove four hours to bring soup to a sick friend" },
      { id: "causes", label: "Causes or Charities They Supported", placeholder: "e.g. American Cancer Society, local food bank" },
    ],
  },
  {
    title: "Service Details", icon: "✠",
    fields: [
      { id: "funeralHome", label: "Funeral Home Name", placeholder: "e.g. Eternal Peace Funeral Home" },
      { id: "serviceDate", label: "Service Date, Time & Location", placeholder: "e.g. Saturday, April 26, 2026 at 2:00 PM, First Baptist Church" },
      { id: "visitation", label: "Visitation Details", placeholder: "e.g. Friday, April 25, 5–8 PM at the funeral home" },
      { id: "specialRequests", label: "Special Requests or Notes", placeholder: "e.g. In lieu of flowers, donations to St. Jude's Children's Hospital" },
    ],
  },
];

const labelStyle = {
  display: "block", fontFamily: "'Playfair Display', serif",
  fontSize: 13, fontWeight: 600, color: GOLD_DARK, marginBottom: 6,
};

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  border: "1.5px solid rgba(201,148,26,0.25)", background: "rgba(255,255,255,0.85)",
  fontFamily: "Georgia, serif", fontSize: 14, color: CHARCOAL,
  outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
};

// ── Logo ─────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div style={{ textAlign: "center", padding: "30px 20px 10px" }}>
      <img
        src="https://4everafter.cloud/wp-content/uploads/2026/05/%C2%A92026-4EVERAFTER-LOGO-HDR517-scaled.png"
        alt="4EverAfter - Turning Farewells Into Meaningful Memories"
        style={{
          maxWidth: "clamp(280px, 70vw, 560px)",
          height: "auto",
          display: "block",
          margin: "0 auto",
          filter: "drop-shadow(0 0 20px rgba(201,148,26,0.3))",
        }}
      />
    </div>
  );
}

// ── Background Selector ──────────────────────────────────────────────
function BackgroundSelector({ value, onChange }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <label style={labelStyle}>Choose Memorial Background <span style={{ color: GOLD }}>*</span></label>
      <p style={{ fontSize: 12, color: "#999", fontStyle: "italic", margin: "0 0 12px", fontFamily: "Georgia, serif" }}>
        Select the background that best honors your loved one's spirit
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 10,
      }}>
        {backgrounds.map(bg => (
          <button
            key={bg.id}
            onClick={() => onChange(bg.id)}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            {/* Thumbnail */}
            <div style={{
              width: "100%",
              height: 80,
              borderRadius: 10,
              overflow: "hidden",
              border: value === bg.id ? `3px solid ${GOLD_LIGHT}` : "3px solid transparent",
              boxShadow: value === bg.id
                ? `0 0 0 2px ${GOLD}, 0 6px 20px rgba(201,148,26,0.4)`
                : "0 2px 8px rgba(0,0,0,0.15)",
              transition: "all 0.2s ease",
              position: "relative",
              background: bg.css,
            }}>
              {bg.image && (
                <img
                  src={bg.image}
                  alt={bg.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              )}
              {value === bg.id && (
                <div style={{
                  position: "absolute", top: 4, right: 4,
                  width: 20, height: 20, borderRadius: "50%",
                  background: GOLD,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: "#1a0d00", fontWeight: 700,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}>✓</div>
              )}
            </div>
            {/* Label below thumbnail */}
            <span style={{
              fontSize: 10,
              fontFamily: "'Playfair Display', serif",
              fontWeight: value === bg.id ? 700 : 500,
              color: value === bg.id ? GOLD_DARK : "#666",
              textAlign: "center",
              lineHeight: 1.3,
              transition: "color 0.2s",
            }}>{bg.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Tone Selector ────────────────────────────────────────────────────
function ToneSelector({ value, onChange }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <label style={labelStyle}>Select Obituary Tone <span style={{ color: GOLD }}>*</span></label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, marginTop: 8 }}>
        {tones.map(t => (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            background: value === t.id ? `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})` : "rgba(255,255,255,0.7)",
            border: value === t.id ? `2px solid ${GOLD_LIGHT}` : "2px solid rgba(201,148,26,0.2)",
            borderRadius: 10, padding: "12px 10px", cursor: "pointer", textAlign: "left",
            transition: "all 0.2s",
            boxShadow: value === t.id ? `0 4px 16px rgba(201,148,26,0.3)` : "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 700, color: value === t.id ? "#fff" : CHARCOAL, marginBottom: 3 }}>{t.label}</div>
            <div style={{ fontSize: 11, color: value === t.id ? "rgba(255,255,255,0.75)" : "#999", fontStyle: "italic" }}>{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ field, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{field.label}{field.required && <span style={{ color: GOLD, marginLeft: 4 }}>*</span>}</label>
      <input style={inputStyle} placeholder={field.placeholder} value={value || ""}
        onChange={e => onChange(field.id, e.target.value)}
        onFocus={e => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = "0 0 0 3px rgba(201,148,26,0.12)"; }}
        onBlur={e => { e.target.style.borderColor = "rgba(201,148,26,0.25)"; e.target.style.boxShadow = "none"; }} />
    </div>
  );
}

function PhotoUpload({ photo, onChange }) {
  const fileRef = useRef();
  return (
    <div style={{ marginBottom: 28 }}>
      <label style={labelStyle}>Photo of Loved One</label>
      <div onClick={() => fileRef.current.click()} style={{
        border: `2px dashed rgba(201,148,26,0.4)`, borderRadius: 12, padding: "20px",
        cursor: "pointer", background: "rgba(255,255,255,0.6)",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        {photo ? (
          <>
            <img src={photo} alt="Preview" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: `2px solid ${GOLD}`, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "Georgia, serif", color: GOLD_DARK, fontSize: 14 }}>Photo uploaded ✓</div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 3 }}>Tap to change</div>
            </div>
          </>
        ) : (
          <div style={{ width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
            <div style={{ fontFamily: "Georgia, serif", color: GOLD_DARK, fontSize: 14 }}>Tap to upload a photo</div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 3 }}>JPG or PNG</div>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => {
          const file = e.target.files[0];
          if (file) { const r = new FileReader(); r.onload = ev => onChange(ev.target.result); r.readAsDataURL(file); }
        }} />
    </div>
  );
}

// ── Editable Paragraph (mobile-friendly) ────────────────────────────
function EditableParagraph({ text, index, onEdit, onRewrite, rewriting, isMobile }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const [hovered, setHovered] = useState(false);

  const save = () => { onEdit(index, draft); setEditing(false); };
  const cancel = () => { setDraft(text); setEditing(false); };
  const showControls = isMobile || hovered;

  return (
    <div
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      style={{
        position: "relative", borderRadius: 8,
        padding: isMobile ? "6px 8px 36px" : "6px 8px",
        margin: "0 -8px 14px",
        background: showControls && !editing ? "rgba(201,148,26,0.05)" : "transparent",
        transition: "background 0.2s",
      }}
    >
      {editing ? (
        <div>
          <textarea value={draft} onChange={e => setDraft(e.target.value)} autoFocus style={{
            width: "100%", minHeight: 100, padding: "10px 12px",
            fontFamily: "Georgia, serif", fontSize: 14, lineHeight: 1.8, color: CHARCOAL,
            border: `2px solid ${GOLD}`, borderRadius: 8, resize: "vertical",
            outline: "none", background: "#fffdf7", boxSizing: "border-box",
          }} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={save} style={{
              padding: "8px 18px", background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`,
              border: "none", borderRadius: 8, cursor: "pointer",
              fontFamily: "Georgia, serif", fontSize: 13, color: "#1a0d00", fontWeight: 600,
            }}>✓ Save</button>
            <button onClick={cancel} style={{
              padding: "8px 14px", background: "transparent",
              border: `1px solid rgba(201,148,26,0.3)`, borderRadius: 8,
              cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 13, color: "#888",
            }}>✕ Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p style={{ fontSize: isMobile ? 14 : 15, lineHeight: 1.85, color: "#2a2a2a", margin: 0, textAlign: "justify" }}>{text}</p>
          {/* On mobile: always-visible buttons below. On desktop: hover buttons top-right */}
          {isMobile ? (
            <div style={{ display: "flex", gap: 6, marginTop: 6, position: "absolute", bottom: 6, right: 6 }}>
              <button onClick={() => { setDraft(text); setEditing(true); }} style={{
                padding: "4px 10px", fontSize: 11, borderRadius: 6,
                background: "rgba(253,248,240,0.95)", border: `1px solid rgba(201,148,26,0.35)`,
                cursor: "pointer", color: GOLD_DARK, fontFamily: "Georgia, serif",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}>✏️ Edit</button>
              <button onClick={() => onRewrite(index, text)} disabled={rewriting === index} style={{
                padding: "4px 10px", fontSize: 11, borderRadius: 6,
                background: rewriting === index ? "#eee" : GOLD,
                border: "none", cursor: rewriting === index ? "not-allowed" : "pointer",
                color: rewriting === index ? "#999" : "#1a0d00",
                fontFamily: "Georgia, serif", fontWeight: 600,
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}>{rewriting === index ? "⟳..." : "✦ AI"}</button>
            </div>
          ) : (
            showControls && (
              <div style={{ position: "absolute", top: 4, right: 4, display: "flex", gap: 5 }}>
                <button onClick={() => { setDraft(text); setEditing(true); }} style={{
                  padding: "4px 10px", fontSize: 11, borderRadius: 6,
                  background: "rgba(253,248,240,0.95)", border: `1px solid rgba(201,148,26,0.35)`,
                  cursor: "pointer", color: GOLD_DARK, fontFamily: "Georgia, serif",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}>✏️ Edit</button>
                <button onClick={() => onRewrite(index, text)} disabled={rewriting === index} style={{
                  padding: "4px 10px", fontSize: 11, borderRadius: 6,
                  background: rewriting === index ? "#eee" : GOLD,
                  border: "none", cursor: rewriting === index ? "not-allowed" : "pointer",
                  color: rewriting === index ? "#999" : "#1a0d00",
                  fontFamily: "Georgia, serif", fontWeight: 600,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}>{rewriting === index ? "⟳ Rewriting..." : "✦ AI Rewrite"}</button>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}

// ── Obituary Output ──────────────────────────────────────────────────
function ObituaryOutput({ paragraphs, setParagraphs, formData, photo, bgId, buildContext, isMobile }) {
  const [rewriting, setRewriting] = useState(null);
  const bg = backgrounds.find(b => b.id === bgId) || backgrounds[0];
  const name = formData.fullName || "Beloved";
  const wordCount = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  const wcOk = wordCount >= 450 && wordCount <= 580;

  const handleEdit = (index, newText) => setParagraphs(prev => prev.map((p, i) => i === index ? newText : p));

  const handleRewrite = async (index, originalText) => {
    setRewriting(index);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 400,
          messages: [{ role: "user", content: `Rewrite this single obituary paragraph with completely fresh wording while preserving all facts and tone. Return ONLY the rewritten paragraph.\n\nContext:\n${buildContext()}\n\nParagraph:\n${originalText}` }],
        }),
      });
      const data = await res.json();
      const newText = data.content?.map(b => b.text || "").join("").trim();
      if (newText) handleEdit(index, newText);
    } catch (e) {}
    setRewriting(null);
  };

  const handlePrint = () => {
    const bgStyle = bg.image
      ? `background-image: url('${bg.image}'); background-size: cover; background-position: center;`
      : `background: ${bg.css};`;
    const printContent = `<html><head>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Dancing+Script:wght@700" rel="stylesheet">
      <style>
        @page { margin: 0; size: letter; }
        body { margin: 0; padding: 0; font-family: Georgia, serif; }
        .bg { ${bgStyle} min-height: 100vh; padding: 48px 56px; box-sizing: border-box; }
        .paper { background: rgba(${bg.paperBg === "#fdf6f0" ? "253,246,240" : "253,249,242"},0.92); border-radius: 12px; padding: 44px 48px; }
        .flowers { text-align:center; color:#C9941A; font-size:18px; letter-spacing:6px; margin:0 0 8px; }
        .in-loving { text-align:center; font-size:12px; color:#888; letter-spacing:3px; text-transform:uppercase; font-style:italic; }
        .name { font-family:'Dancing Script',cursive; font-size:44px; text-align:center; color:#8B6310; margin:4px 0 22px; line-height:1.2; }
        .layout { display:flex; gap:22px; align-items:flex-start; margin-bottom:12px; }
        img { width:148px; height:178px; object-fit:cover; border-radius:8px; border:3px solid rgba(201,148,26,0.4); flex-shrink:0; }
        p { font-size:13.5px; line-height:1.85; margin:0 0 13px; text-align:justify; color:#2a2a2a; }
        .footer { text-align:center; margin-top:26px; padding-top:14px; border-top:1px solid rgba(201,148,26,0.2); }
        .f-logo { font-family:'Playfair Display',serif; font-size:16px; color:#8B6310; font-weight:700; }
        .f-tag { font-size:9px; color:#aaa; font-style:italic; margin-top:2px; }
      </style></head><body>
      <div class="bg"><div class="paper">
      <div class="flowers">✿ ✦ ✿</div>
      <div class="in-loving">In Loving Memory of</div>
      <div class="name">${name}</div>
      <div class="layout">
        ${photo ? `<img src="${photo}" alt="${name}" />` : ""}
        <div>${paragraphs.slice(0, photo ? 2 : 0).map(p => `<p>${p}</p>`).join("")}</div>
      </div>
      ${paragraphs.slice(photo ? 2 : 0).map(p => `<p>${p}</p>`).join("")}
      <div class="footer"><div class="f-logo">4EverAfter™</div><div class="f-tag">"Turning Farewells Into Meaningful Memories"</div></div>
      </div></div></body></html>`;
    const win = window.open("", "_blank");
    win.document.write(printContent);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 900);
  };

  const paperPad = isMobile ? "28px 20px" : "48px 48px";

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        background: "rgba(253,248,240,0.97)", borderRadius: "14px 14px 0 0",
        padding: isMobile ? "12px 14px" : "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 8,
        border: "1px solid rgba(201,148,26,0.2)", borderBottom: "none",
      }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 13 }}>
          <span style={{ color: wcOk ? "#16a34a" : GOLD, fontWeight: 700 }}>{wordCount} words</span>
          <span style={{ color: "#bbb", marginLeft: 6, fontStyle: "italic", fontSize: 12 }}>
            {wcOk ? "✓ Perfect" : wordCount < 450 ? "— a little short" : "— a little long"}
          </span>
        </div>
        <button onClick={handlePrint} style={{
          padding: isMobile ? "9px 14px" : "9px 20px",
          background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`,
          border: "none", borderRadius: 9, cursor: "pointer",
          fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 12 : 13, fontWeight: 700,
          color: "#1a0d00", boxShadow: `0 3px 12px rgba(201,148,26,0.35)`,
          whiteSpace: "nowrap",
        }}>⬇ Download / Print PDF</button>
      </div>

      {/* Card with background */}
      <div style={{
        background: bg.image ? `url(${bg.image}) center/cover` : bg.css,
        borderRadius: "0 0 18px 18px",
        border: "1px solid rgba(201,148,26,0.2)", borderTop: "none",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        padding: isMobile ? "12px" : "20px",
      }}>
        {/* Paper layer */}
        <div style={{
          background: `rgba(253,249,242,0.93)`,
          borderRadius: 12, padding: paperPad,
          fontFamily: "Georgia, serif",
          position: "relative",
        }}>
          {/* Corner marks */}
          {["top-left","top-right","bottom-left","bottom-right"].map(pos => (
            <div key={pos} style={{
              position: "absolute",
              [pos.includes("top") ? "top" : "bottom"]: 12,
              [pos.includes("left") ? "left" : "right"]: 12,
              width: 28, height: 28,
              borderTop: pos.includes("top") ? `2px solid rgba(201,148,26,0.35)` : "none",
              borderBottom: pos.includes("bottom") ? `2px solid rgba(201,148,26,0.35)` : "none",
              borderLeft: pos.includes("left") ? `2px solid rgba(201,148,26,0.35)` : "none",
              borderRight: pos.includes("right") ? `2px solid rgba(201,148,26,0.35)` : "none",
            }} />
          ))}

          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <span style={{ color: GOLD, fontSize: 18, opacity: 0.65, letterSpacing: 6 }}>✿ ✦ ✿</span>
          </div>
          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <div style={{ fontSize: isMobile ? 11 : 13, color: "#888", fontStyle: "italic", letterSpacing: "2px", textTransform: "uppercase" }}>In Loving Memory of</div>
          </div>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 18 : 26 }}>
            <div style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: isMobile ? "clamp(26px, 7vw, 40px)" : "clamp(32px, 5vw, 50px)",
              background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              lineHeight: 1.2,
            }}>{name}</div>
          </div>

          {/* Photo + paragraphs */}
          {photo && !isMobile ? (
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <img src={photo} alt={name} style={{ width: 155, height: 185, objectFit: "cover", borderRadius: 8, border: `3px solid rgba(201,148,26,0.4)`, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                {paragraphs.slice(0, 2).map((para, i) => (
                  <EditableParagraph key={i} text={para} index={i} onEdit={handleEdit} onRewrite={handleRewrite} rewriting={rewriting} isMobile={isMobile} />
                ))}
              </div>
            </div>
          ) : photo && isMobile ? (
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <img src={photo} alt={name} style={{ width: 120, height: 144, objectFit: "cover", borderRadius: 8, border: `3px solid rgba(201,148,26,0.4)`, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }} />
            </div>
          ) : null}

          {paragraphs.slice(photo && !isMobile ? 2 : 0).map((para, i) => (
            <EditableParagraph key={i + (photo && !isMobile ? 2 : 0)} text={para} index={i + (photo && !isMobile ? 2 : 0)} onEdit={handleEdit} onRewrite={handleRewrite} rewriting={rewriting} isMobile={isMobile} />
          ))}

          <div style={{ textAlign: "center", marginTop: 28, paddingTop: 16, borderTop: `1px solid rgba(201,148,26,0.2)` }}>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700,
              background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>4EverAfter™</div>
            <div style={{ fontSize: 10, color: "#aaa", fontStyle: "italic", marginTop: 2 }}>"Turning Farewells Into Meaningful Memories"</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────
export default function App() {
  const [formData, setFormData] = useState({});
  const [tone, setTone] = useState("");
  const [bgId, setBgId] = useState("floral");
  const [photo, setPhoto] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("form");
  const [isMobile] = useState(() => window.innerWidth < 600);

  const updateField = (id, value) => setFormData(p => ({ ...p, [id]: value }));

  const buildContext = useCallback(() => {
    const fields = sections.flatMap(s => s.fields);
    return fields.filter(f => formData[f.id]).map(f => `${f.label}: ${formData[f.id]}`).join("\n");
  }, [formData]);

  const buildPrompt = () => {
    const toneLabel = tones.find(t => t.id === tone)?.label || "Warm & Personal";
    return `You are writing a beautiful, dignified obituary for a funeral memorial program.

Tone: ${toneLabel}

Information provided:
${buildContext()}

Write a heartfelt, flowing obituary of approximately 500 words. Use natural paragraph breaks — separate each paragraph with a blank line. Do not use headers or bullet points. Begin with a warm opening sentence. Include life story, relationships, career, personality, and legacy. End with service details if provided. Write as if you truly knew this person — personal, dignified, deeply human. Do not add any commentary, preamble, or closing note — just the obituary itself.`;
  };

  const generate = async () => {
    if (!formData.fullName || !formData.dob || !formData.dod) {
      setError("Please fill in Full Name, Date of Birth, and Date of Passing at minimum."); return;
    }
    if (!tone) { setError("Please select a tone for the obituary."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("\n") || "";
      const paras = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
      setParagraphs(paras); setStep("result");
    } catch (e) {
      // Demo fallback - personalizes with real entered data
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

  const cardPad = isMobile ? "24px 18px" : "40px 40px";

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, #1a1200 0%, #0d0900 40%, #1a1200 100%)`, fontFamily: "Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Dancing+Script:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #bbb; }
        textarea { font-family: Georgia, serif; }
        button { transition: transform 0.1s, box-shadow 0.1s; }
        button:active { transform: scale(0.97); }
        @media (max-width: 500px) {
          input, textarea { font-size: 16px !important; }
        }
      `}</style>

      <Logo />

      <div style={{ maxWidth: 880, margin: "0 auto", padding: isMobile ? "0 12px 48px" : "0 20px 60px" }}>

        {step === "form" && (
          <div style={{
            background: "rgba(253,248,240,0.97)", borderRadius: 20,
            padding: cardPad, boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
            border: "1px solid rgba(201,148,26,0.2)",
          }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 20 : 24, color: CHARCOAL, margin: "0 0 6px", fontWeight: 600 }}>
                Create a Meaningful Tribute
              </h1>
              <p style={{ color: "#999", fontSize: 13, margin: 0, fontStyle: "italic" }}>
                Share what made your loved one extraordinary — we'll craft their story with care
              </p>
            </div>

            <BackgroundSelector value={bgId} onChange={setBgId} />
            <ToneSelector value={tone} onChange={setTone} />
            <PhotoUpload photo={photo} onChange={setPhoto} />

            {sections.map(section => (
              <div key={section.title} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid rgba(201,148,26,0.18)` }}>
                  <span style={{ color: GOLD, fontSize: 16 }}>{section.icon}</span>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: GOLD_DARK, margin: 0, fontWeight: 700 }}>{section.title}</h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", gap: "0 22px" }}>
                  {section.fields.map(f => <Field key={f.id} field={f} value={formData[f.id]} onChange={updateField} />)}
                </div>
              </div>
            ))}

            {error && (
              <div style={{ background: "#fff5f5", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 18 }}>
                {error}
              </div>
            )}

            <button onClick={generate} disabled={loading} style={{
              width: "100%", padding: isMobile ? "16px" : "18px",
              background: loading ? "#ccc" : `linear-gradient(135deg, ${GOLD_DARK} 0%, ${GOLD} 50%, ${GOLD_LIGHT} 100%)`,
              border: "none", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 16 : 18, fontWeight: 700,
              color: loading ? "#888" : "#1a0d00", letterSpacing: "0.5px",
              boxShadow: loading ? "none" : `0 8px 28px rgba(201,148,26,0.4)`,
            }}>
              {loading ? "✦  Crafting Their Story..." : "✦  Generate Obituary  ✦"}
            </button>
          </div>
        )}

        {step === "result" && paragraphs.length > 0 && (
          <div>
            <div style={{
              background: "rgba(201,148,26,0.1)", border: `1px solid rgba(201,148,26,0.28)`,
              borderRadius: 10, padding: "11px 16px", marginBottom: 12,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 15 }}>✏️</span>
              <div style={{ fontFamily: "Georgia, serif", fontSize: isMobile ? 12 : 13, color: GOLD_LIGHT }}>
                <strong>Obituary ready.</strong> {isMobile ? "Tap Edit or AI below each paragraph." : "Hover any paragraph to edit directly or request an AI rewrite."}
              </div>
            </div>

            <ObituaryOutput
              paragraphs={paragraphs} setParagraphs={setParagraphs}
              formData={formData} photo={photo} bgId={bgId}
              buildContext={buildContext} isMobile={isMobile}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button onClick={() => { setStep("form"); setParagraphs([]); }} style={{
                flex: 1, padding: "13px 8px",
                background: "rgba(255,255,255,0.07)", border: `1px solid rgba(201,148,26,0.4)`,
                borderRadius: 10, cursor: "pointer",
                fontFamily: "Georgia, serif", fontSize: isMobile ? 13 : 14, color: GOLD_LIGHT,
              }}>← Edit Info</button>
              <button onClick={generate} disabled={loading} style={{
                flex: 2, padding: "13px",
                background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`,
                border: "none", borderRadius: 10, cursor: "pointer",
                fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 13 : 15,
                fontWeight: 700, color: "#1a0d00",
                boxShadow: `0 4px 18px rgba(201,148,26,0.3)`,
              }}>{loading ? "⟳ Regenerating..." : "↻ Regenerate All"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
