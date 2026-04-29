import { useState, useEffect } from "react";

const ME = { bt_ID: 1042, handle: "beta_1042", avatar: "🛡️" };

const METRIC = {
  total_review_cnt: 128,
  decision_agr_rate: 0.82,
  type_agr_rate: 0.78,
  t1_term_agr_rate: 0.91,
  t2_agr_rate: 0.70,
  t3_agr_rate: 0.88,
  avg_review_sec: 47,
  abn_score: 0.05,
};

const QUEUE = [
  { assignment_ID: 3025, report_ID: 8812, status: "진행중",  assigned_at: "14:00", content: "ㄴㅋㅎ들 또 난리남ㅋㅋ 이게 맞냐", image_url: "🖼️" },
  { assignment_ID: 3026, report_ID: 8815, status: "대기",    assigned_at: "14:01", content: "뇌*가*리 인증 레전드 댓글 박제함", image_url: "🖼️" },
  { assignment_ID: 3027, report_ID: 8818, status: "대기",    assigned_at: "14:02", content: "이분 댓글 꾸준히 모아봤는데 매번 이 수준", image_url: "🖼️" },
];

const HISTORY = [
  { report_ID: 8801, type: "TYPE1", decision: "혐오", agr: true,  completed_at: "오늘 12:33" },
  { report_ID: 8795, type: "TYPE2", decision: "정상", agr: true,  completed_at: "오늘 11:10" },
  { report_ID: 8780, type: "TYPE3", decision: "혐오", agr: false, completed_at: "오늘 10:02" },
  { report_ID: 8762, type: "TYPE1", decision: "혐오", agr: true,  completed_at: "어제 17:55" },
  { report_ID: 8741, type: "TYPE2", decision: "정상", agr: true,  completed_at: "어제 15:30" },
  { report_ID: 8720, type: "TYPE3", decision: "혐오", agr: true,  completed_at: "어제 13:12" },
  { report_ID: 8705, type: "TYPE1", decision: "혐오", agr: false, completed_at: "20일 16:44" },
];

const HATE_TYPES = [
  { ht_ID: 1, ht_name: "성혐오" },
  { ht_ID: 2, ht_name: "연령" },
  { ht_ID: 3, ht_name: "인종/지역" },
  { ht_ID: 4, ht_name: "장애" },
  { ht_ID: 5, ht_name: "종교" },
  { ht_ID: 6, ht_name: "정치성향" },
  { ht_ID: 7, ht_name: "직업/계층" },
];

/* ── 라이트 테마 토큰 (어드민 콘솔 기준) ── */
const C = {
  bg:      "#f4f5f7",
  surface: "#ffffff",
  border:  "#e8eaed",
  muted:   "#f0f2f5",
  text:    "#111827",
  sub:     "#6b7280",
  ig:      "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
  purple:  "#7c3aed",
  red:     "#ef4444",
  green:   "#10b981",
  yellow:  "#f59e0b",
  blue:    "#3b82f6",
  sidebar: "#ffffff",
};

const TYPE_CFG = {
  TYPE1: { color: "#7c3aed", bg: "rgba(124,58,237,.08)",  short: "T1", label: "우회표현",      accent: "#7c3aed" },
  TYPE2: { color: "#ef4444", bg: "rgba(239,68,68,.08)",   short: "T2", label: "텍스트맥락",    accent: "#ef4444" },
  TYPE3: { color: "#10b981", bg: "rgba(16,185,129,.08)",  short: "T3", label: "이미지+텍스트", accent: "#10b981" },
};

const cardShadow = "0 1px 4px rgba(0,0,0,.06), 0 2px 12px rgba(0,0,0,.04)";

function IgRing({ size = 56, children }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: C.ig, padding: 2, flexShrink: 0 }}>
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4 }}>
        {children}
      </div>
    </div>
  );
}

function Ring({ rate, color, size = 60, sw = 6 }) {
  const r = (size - sw) / 2, circ = 2 * Math.PI * r;
  const [d, setD] = useState(0);
  useEffect(() => { const t = setTimeout(() => setD(circ * rate), 250); return () => clearTimeout(t); }, []);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e8eaed" strokeWidth={sw} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={`${d} ${circ}`} strokeLinecap="round"
        strokeDashoffset={circ / 4}
        style={{ transition: "stroke-dasharray 1.1s cubic-bezier(.4,0,.2,1)" }} />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em"
        style={{ fontSize: 11, fontWeight: 700, fill: C.text, fontFamily: "inherit" }}>
        {Math.round(rate * 100)}%
      </text>
    </svg>
  );
}

function Tag({ label, color, bg }) {
  return <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 6, background: bg, color, fontWeight: 600 }}>{label}</span>;
}

function Btn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      border: "none", cursor: "pointer", borderRadius: 8,
      fontSize: 12, fontWeight: 600, padding: "8px 18px",
      transition: "opacity .15s", ...style,
    }}
      onMouseOver={e => e.currentTarget.style.opacity = ".8"}
      onMouseOut={e => e.currentTarget.style.opacity = "1"}
    >{children}</button>
  );
}

function SectionHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function BarAnim({ rate, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(rate * 100), delay); return () => clearTimeout(t); }, []);
  return <div style={{ width: `${w}%`, height: "100%", borderRadius: 99, background: color, transition: "width 1.1s cubic-bezier(.4,0,.2,1)" }} />;
}

/* ── 할당 목록 ── */
function QueuePage({ onStart }) {
  return (
    <div>
      <SectionHead title="할당된 신고" sub={`${QUEUE.length}건 대기 중`} />
      {QUEUE.map((a, i) => (
        <div key={i} style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "16px",
          marginBottom: 10,
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          boxShadow: cardShadow,
          transition: "box-shadow .15s",
        }}
          onMouseOver={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.10)"}
          onMouseOut={e => e.currentTarget.style.boxShadow = cardShadow}
        >
          <div style={{
            width: 52, height: 52, borderRadius: 10, background: C.muted,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0, border: `1px solid ${C.border}`,
          }}>{a.image_url}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: C.sub }}>#{a.report_ID}</span>
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 20,
                background: a.status === "진행중" ? "rgba(245,158,11,.12)" : C.muted,
                color: a.status === "진행중" ? C.yellow : C.sub,
                fontWeight: 600, border: `1px solid ${a.status === "진행중" ? "rgba(245,158,11,.25)" : C.border}`,
              }}>{a.status}</span>
              <span style={{ fontSize: 11, color: C.sub, marginLeft: "auto" }}>{a.assigned_at}</span>
            </div>
            <div style={{ fontSize: 13, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {a.content}
            </div>
          </div>
          <Btn onClick={() => onStart(a)}
            style={{ background: C.purple, color: "#fff", flexShrink: 0, alignSelf: "center", boxShadow: "0 2px 8px rgba(124,58,237,.25)" }}>
            판정 시작
          </Btn>
        </div>
      ))}
    </div>
  );
}

/* ── 판정 플로우 ── */
function JudgePage({ item, onDone }) {
  const [step, setStep]   = useState(1);
  const [dec, setDec]     = useState(null);
  const [rtype, setRtype] = useState(null);
  const [varWord, setVar] = useState("");
  const [bwText, setBw]   = useState("");
  const [htID, setHt]     = useState(null);
  const [done, setDone]   = useState(false);

  if (done) return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>판정 완료</div>
      <div style={{ fontSize: 13, color: C.sub, marginBottom: 32 }}>신고 #{item.report_ID} 처리됨</div>
      <Btn onClick={onDone} style={{ background: C.purple, color: "#fff" }}>목록으로</Btn>
    </div>
  );

  const steps = ["신고 판단", "유형 선택", "세부 판정"];

  return (
    <div>
      <button onClick={onDone} style={{ background: "none", border: "none", color: C.sub, cursor: "pointer", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        ← 목록으로
      </button>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{
              height: 3, borderRadius: 99, marginBottom: 6,
              background: step > i + 1 ? C.purple : step === i + 1 ? C.purple : C.border,
              opacity: step > i + 1 ? 0.35 : 1,
              transition: "background .3s",
            }} />
            <div style={{ fontSize: 10, color: step === i + 1 ? C.purple : C.sub, fontWeight: step === i + 1 ? 700 : 400 }}>
              {i + 1}. {s}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 20, overflow: "hidden", boxShadow: cardShadow }}>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>@reported_user</div>
            <div style={{ fontSize: 10, color: C.sub }}>신고 #{item.report_ID}</div>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 11, color: C.sub }}>{item.assigned_at}</span>
        </div>
        <div style={{ height: 120, background: C.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
          {item.image_url}
        </div>
        <div style={{ padding: "12px 16px" }}>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{item.content}</div>
          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            {["❤️ 신고됨", "💬 댓글", "📌 저장"].map((t, i) => (
              <span key={i} style={{ fontSize: 11, color: C.sub }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {step === 1 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>이 콘텐츠는 신고 감인가요?</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { setDec("Y"); setStep(2); }}
              style={{ flex: 1, padding: 14, borderRadius: 12, border: `1.5px solid ${dec === "Y" ? C.purple : C.border}`, background: dec === "Y" ? "rgba(124,58,237,.06)" : C.surface, color: dec === "Y" ? C.purple : C.text, fontWeight: 600, cursor: "pointer", fontSize: 13, boxShadow: cardShadow }}>
              ✓ 맞음 — 신고 진행
            </button>
            <button onClick={() => { setDec("N"); setDone(true); }}
              style={{ flex: 1, padding: 14, borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.surface, color: C.sub, fontWeight: 600, cursor: "pointer", fontSize: 13, boxShadow: cardShadow }}>
              ✕ 부정 신고
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>혐오 유형을 선택하세요</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {Object.entries(TYPE_CFG).map(([k, v]) => (
              <button key={k} onClick={() => setRtype(k)} style={{
                padding: "14px 16px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                border: `1.5px solid ${rtype === k ? v.color : C.border}`,
                background: rtype === k ? v.bg : C.surface,
                display: "flex", alignItems: "center", gap: 12,
                boxShadow: cardShadow,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: v.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: v.color }}>
                  {v.short}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{k}</div>
                  <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{v.label}</div>
                </div>
                {rtype === k && <span style={{ marginLeft: "auto", color: v.color, fontSize: 16 }}>✓</span>}
              </button>
            ))}
          </div>
          <Btn onClick={() => rtype && setStep(3)}
            style={{ width: "100%", background: rtype ? C.purple : C.muted, color: rtype ? "#fff" : C.sub }}>
            다음 →
          </Btn>
        </div>
      )}

      {step === 3 && rtype === "TYPE1" && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16 }}>TYPE1 — 원단어 / 우회표현 입력</div>
          <label style={{ fontSize: 11, color: C.sub, display: "block", marginBottom: 6 }}>우회표현 (발견된 표현)</label>
          <input value={varWord} onChange={e => setVar(e.target.value)}
            placeholder="예: ㄴㅋㅎ, 엠*생"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, color: C.text, fontSize: 13, marginBottom: 14, boxSizing: "border-box", outline: "none" }} />
          <label style={{ fontSize: 11, color: C.sub, display: "block", marginBottom: 6 }}>추정 원단어</label>
          <input value={bwText} onChange={e => setBw(e.target.value)}
            placeholder="예: 누칼협, 엠생"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, color: C.text, fontSize: 13, marginBottom: 20, boxSizing: "border-box", outline: "none" }} />
          <Btn onClick={() => (varWord && bwText) && setDone(true)}
            style={{ width: "100%", background: (varWord && bwText) ? C.purple : C.muted, color: (varWord && bwText) ? "#fff" : C.sub }}>
            판정 완료
          </Btn>
        </div>
      )}

      {step === 3 && (rtype === "TYPE2" || rtype === "TYPE3") && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16 }}>{rtype} — 혐오 카테고리 선택</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 20 }}>
            {HATE_TYPES.map(ht => (
              <button key={ht.ht_ID} onClick={() => setHt(ht.ht_ID)} style={{
                padding: "12px", borderRadius: 10, cursor: "pointer",
                border: `1.5px solid ${htID === ht.ht_ID ? TYPE_CFG[rtype].color : C.border}`,
                background: htID === ht.ht_ID ? TYPE_CFG[rtype].bg : C.surface,
                color: htID === ht.ht_ID ? TYPE_CFG[rtype].color : C.text,
                fontSize: 13, fontWeight: htID === ht.ht_ID ? 700 : 400,
                boxShadow: cardShadow,
              }}>
                {ht.ht_name}
              </button>
            ))}
          </div>
          <Btn onClick={() => htID && setDone(true)}
            style={{ width: "100%", background: htID ? TYPE_CFG[rtype].color : C.muted, color: "#fff" }}>
            판정 완료
          </Btn>
        </div>
      )}
    </div>
  );
}

/* ── 내 업무 현황 ── */
function MyWorkPage() {
  const agreeItems = [
    { label: "판정",  rate: METRIC.decision_agr_rate, color: C.purple },
    { label: "유형",  rate: METRIC.type_agr_rate,     color: C.red    },
    { label: "TYPE1", rate: METRIC.t1_term_agr_rate,  color: C.purple },
    { label: "TYPE2", rate: METRIC.t2_agr_rate,        color: C.red    },
    { label: "TYPE3", rate: METRIC.t3_agr_rate,        color: C.green  },
  ];

  const [tab, setTab] = useState("전체");
  const tabs = ["전체","TYPE1","TYPE2","TYPE3"];
  const filtered = tab === "전체" ? HISTORY : HISTORY.filter(h => h.type === tab);

  /* 상단 요약 카드 — 어드민 콘솔처럼 컬러 상단 보더 */
  const statCards = [
    { v: METRIC.total_review_cnt, u: "건", l: "전체 검토",  accent: C.purple },
    { v: HISTORY.length,          u: "건", l: "이번 주",    accent: C.blue   },
    { v: METRIC.avg_review_sec,   u: "초", l: "평균 검토",  accent: C.green  },
  ];

  return (
    <div>
      <SectionHead title="내 업무 현황" sub={`beta_${ME.bt_ID}`} />

      {/* 상단 카드 3개 — 컬러 상단 라인 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            borderTop: `3px solid ${s.accent}`,
            padding: "18px 20px",
            boxShadow: cardShadow,
          }}>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1, color: C.text }}>
              {s.v}<span style={{ fontSize: 12, color: C.sub, fontWeight: 400, marginLeft: 2 }}>{s.u}</span>
            </div>
            <div style={{ fontSize: 11, color: C.sub, marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* 이상 점수 */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${C.green}`,
        borderRadius: 12, padding: "14px 18px", marginBottom: 14,
        display: "flex", alignItems: "center", gap: 12,
        boxShadow: cardShadow,
      }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(16,185,129,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: C.green, fontSize: 16 }}>✓</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.green }}>이상 점수 {(METRIC.abn_score * 100).toFixed(0)}점 — 정상</div>
          <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>판정 패턴이 안정적이에요</div>
        </div>
      </div>

      {/* 동의율 */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 14, boxShadow: cardShadow }}>
        <div style={{ fontSize: 11, color: C.sub, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>동의율</div>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 20 }}>
          {agreeItems.map((a, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <Ring rate={a.rate} color={a.color} />
              <div style={{ fontSize: 10, color: C.sub, marginTop: 5 }}>{a.label}</div>
            </div>
          ))}
        </div>
        {agreeItems.map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, fontSize: 11, color: C.sub }}>{a.label}</div>
            <div style={{ flex: 1, height: 4, background: C.muted, borderRadius: 99, overflow: "hidden" }}>
              <BarAnim rate={a.rate} color={a.color} delay={i * 80} />
            </div>
            <div style={{ width: 30, fontSize: 11, color: a.color, fontWeight: 700, textAlign: "right" }}>{Math.round(a.rate * 100)}%</div>
          </div>
        ))}
      </div>

      {/* 최근 판정 */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, boxShadow: cardShadow }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.sub, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 600 }}>최근 판정</div>
          <div style={{ display: "flex", gap: 3, background: C.muted, borderRadius: 9, padding: 3 }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "3px 10px", borderRadius: 7, border: "none", cursor: "pointer",
                fontSize: 11, fontWeight: 600,
                background: tab === t ? "#fff" : "transparent",
                color: tab === t ? C.text : C.sub,
                boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,.08)" : "none",
                transition: "all .15s",
              }}>{t}</button>
            ))}
          </div>
        </div>
        {filtered.map((h, i) => {
          const tc = TYPE_CFG[h.type];
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 0",
              borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: tc.color, flexShrink: 0 }}>
                {tc.short}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.text }}>신고 #{h.report_ID}</div>
                <div style={{ fontSize: 10, color: C.sub, marginTop: 2 }}>{h.completed_at}</div>
              </div>
              <Tag label={h.decision} color={h.decision === "혐오" ? C.red : C.green} bg={h.decision === "혐오" ? "rgba(239,68,68,.08)" : "rgba(16,185,129,.08)"} />
              <span style={{ fontSize: 11, color: h.agr ? C.green : C.red }}>{h.agr ? "✓ 일치" : "✕ 불일치"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const NAV = [
  { id: "queue",  icon: "📋", label: "할당 목록" },
  { id: "mywork", icon: "📊", label: "내 현황"   },
];

export default function BetaTesterApp() {
  const [page, setPage]       = useState("queue");
  const [judging, setJudging] = useState(null);

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: C.bg,
      fontFamily: "'Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif",
      color: C.text,
    }}>

      {/* ── 사이드바 ── */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: C.sidebar,
        borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
        boxShadow: "2px 0 8px rgba(0,0,0,.04)",
      }}>
        {/* 로고 */}
        <div style={{ padding: "18px 18px 14px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: C.ig, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🛡</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.3, color: C.text }}>CleanGram</div>
              <div style={{ fontSize: 10, color: C.sub }}>Beta Tester</div>
            </div>
          </div>
        </div>

        {/* 프로필 */}
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <IgRing size={38}>{ME.avatar}</IgRing>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>beta_{ME.bt_ID}</div>
            <div style={{ fontSize: 10, color: C.sub, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, display: "inline-block" }} />
              활동 중
            </div>
          </div>
        </div>

        {/* 네비 */}
        <nav style={{ padding: "10px 10px", flex: 1 }}>
          {NAV.map(n => {
            const isActive = page === n.id && !judging;
            return (
              <button key={n.id} onClick={() => { setPage(n.id); setJudging(null); }} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 9, border: "none", cursor: "pointer",
                marginBottom: 3, textAlign: "left",
                /* 어드민 콘솔처럼 선택 시 왼쪽 강조 바 + 배경 */
                background: isActive ? "rgba(124,58,237,.07)" : "transparent",
                color: isActive ? C.purple : C.sub,
                fontSize: 13, fontWeight: isActive ? 700 : 400,
                transition: "all .15s",
                borderLeft: isActive ? `3px solid ${C.purple}` : "3px solid transparent",
              }}
                onMouseOver={e => { if (!isActive) e.currentTarget.style.background = C.muted; }}
                onMouseOut={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 16 }}>{n.icon}</span>
                {n.label}
                {n.id === "queue" && (
                  <span style={{ marginLeft: "auto", fontSize: 10, background: C.purple, color: "#fff", borderRadius: 20, padding: "1px 7px", fontWeight: 700 }}>
                    {QUEUE.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 하단 통계 */}
        <div style={{ padding: "14px 18px", borderTop: `1px solid ${C.border}`, background: C.muted }}>
          <div style={{ fontSize: 10, color: C.sub, marginBottom: 10, letterSpacing: "0.8px", textTransform: "uppercase", fontWeight: 600 }}>이번 주 동의율</div>
          {[
            { l: "판정", v: METRIC.decision_agr_rate, c: C.purple },
            { l: "유형", v: METRIC.type_agr_rate,     c: C.red    },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <div style={{ fontSize: 10, color: C.sub, width: 28 }}>{r.l}</div>
              <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 99 }}>
                <div style={{ width: `${r.v * 100}%`, height: "100%", background: r.c, borderRadius: 99 }} />
              </div>
              <div style={{ fontSize: 10, color: r.c, fontWeight: 700 }}>{Math.round(r.v * 100)}%</div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── 메인 콘텐츠 ── */}
      <main style={{ flex: 1, padding: "28px 32px", maxWidth: 760, overflowY: "auto" }}>
        {page === "queue" && !judging && <QueuePage onStart={item => setJudging(item)} />}
        {page === "queue" &&  judging && <JudgePage item={judging} onDone={() => setJudging(null)} />}
        {page === "mywork" && <MyWorkPage />}
      </main>
    </div>
  );
}
