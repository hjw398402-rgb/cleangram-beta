import { useState, useEffect, useRef } from "react";
import BoardPage from "./BoardPage";

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
  { assignment_ID: 3025, report_ID: 8812, status: "대기", assigned_at: "14:00", content: "오늘 길 가다가 진짜 빡.머@가뤼 봄 진짜 실화냐?", image_url: "/images/drunk.png" },
  { assignment_ID: 3027, report_ID: 8818, status: "대기", assigned_at: "14:02", content: "엿먹자 ㅋㅋ맛나겠네", image_url: "/images/yot.png" },
  { assignment_ID: 3028, report_ID: 8819, status: "대기", assigned_at: "14:02", content: "저기 돼지 봐라 ㅋㅋ", image_url: "/images/pig.png" },
];

const HISTORY = [
  { report_ID: 8801, type: "TYPE1", decision: "혐오", agr: true,  completed_at: "오늘 12:33", content: "ㄴㅋㅎ 진짜 개심하네", image_url: "/images/chicken.png", varWord: "ㄴㅋㅎ", bwText: "누칼협", htID: null },
  { report_ID: 8795, type: "TYPE2", decision: "정상", agr: true,  completed_at: "오늘 11:10", content: "하 뭐하지 오늘", image_url: "https://picsum.photos/seed/h2/800/600", varWord: null, bwText: null, htID: 1 },
  { report_ID: 8780, type: "TYPE3", decision: "혐오", agr: false, completed_at: "오늘 10:02", content: "왜 이렇게 까매", image_url: "/images/drogba.png", varWord: null, bwText: null, htID: 3 },
  { report_ID: 8762, type: "TYPE1", decision: "혐오", agr: true,  completed_at: "어제 17:55", content: "엠*생들 진짜", image_url: "/images/fight.png", varWord: "엠*생", bwText: "엠생", htID: null },
  { report_ID: 8741, type: "TYPE2", decision: "정상", agr: true,  completed_at: "어제 15:30", content: "아리랑아리랑", image_url: "https://picsum.photos/seed/h5/800/600", varWord: null, bwText: null, htID: 2 },
  { report_ID: 8720, type: "TYPE3", decision: "혐오", agr: true,  completed_at: "어제 13:12", content: "난 7찍인데 시민이 아니냐 그럼 ㅋㅋ 머리 찍어줄까", image_url: "/images/politics.png", varWord: null, bwText: null, htID: 6 },
  { report_ID: 8705, type: "TYPE1", decision: "혐오", agr: false, completed_at: "20일 16:44", content: "뇌*가*리 인증샷", image_url: "/images/fish.png", varWord: "뇌*가*리", bwText: "뇌가리", htID: null },
];

const HATE_TYPES = [
  { ht_ID: 1, ht_name: "성혐오" },
  { ht_ID: 2, ht_name: "연령" },
  { ht_ID: 3, ht_name: "인종/지역" },
  { ht_ID: 4, ht_name: "장애" },
  { ht_ID: 5, ht_name: "종교" },
  { ht_ID: 6, ht_name: "정치성향" },
  { ht_ID: 7, ht_name: "직업/계층" },
  { ht_ID: 8, ht_name: "기타" },
];

const C = {
  bg:      "#ffffff",
  surface: "#f9f9f9",
  border:  "#e5e5e5",
  muted:   "#f0f0f0",
  text:    "#111111",
  sub:     "#888888",
  ig:      "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
  purple:  "#7c3aed",
  red:     "#ef4444",
  green:   "#10b981",
  yellow:  "#f59e0b",
  blue:    "#3b82f6",
};

const TYPE_CFG = {
  TYPE1: { color: "#7c3aed", bg: "rgba(124,58,237,.08)", short: "T1", label: "우회표현" },
  TYPE2: { color: "#ef4444", bg: "rgba(239,68,68,.08)",  short: "T2", label: "텍스트맥락" },
  TYPE3: { color: "#10b981", bg: "rgba(16,185,129,.08)", short: "T3", label: "이미지+텍스트" },
};

const NAV = [
  { id: "mywork", icon: "📊", label: "내 현황" },
  { id: "queue",  icon: "📋", label: "할당 목록" },
  { id: "detail", icon: "🔍", label: "판정 내역" },
  { id: "board",  icon: "💬", label: "게시판" },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

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
  useEffect(() => { const t = setTimeout(() => setD(circ * rate), 250); return () => clearTimeout(t); }, [circ, rate]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{Math.round(rate * 100)}%</div>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.muted} strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${d} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.1s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
    </div>
  );
}

function Tag({ label, color, bg }) {
  return <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 6, background: bg, color, fontWeight: 600 }}>{label}</span>;
}

function Btn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{ border: "none", cursor: "pointer", borderRadius: 8, fontSize: 12, fontWeight: 600, padding: "8px 18px", transition: "opacity .15s", ...style }}
      onMouseOver={e => e.currentTarget.style.opacity = ".8"}
      onMouseOut={e => e.currentTarget.style.opacity = "1"}
    >{children}</button>
  );
}

function SectionHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: C.sub, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function BarAnim({ rate, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(rate * 100), delay); return () => clearTimeout(t); }, [rate, delay]);
  return <div style={{ width: `${w}%`, height: "100%", borderRadius: 99, background: color, transition: "width 1.1s cubic-bezier(.4,0,.2,1)" }} />;
}

function ReportCard({ item, onTextSelect }) {
  const handleMouseUp = () => {
    if (!onTextSelect) return;
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : "";
    if (text) onTextSelect(text);
  };
  return (
    <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 12, marginBottom: 20, overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid " + C.border }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>@reported_user</div>
          <div style={{ fontSize: 10, color: C.sub }}>신고 #{item.report_ID}</div>
        </div>
        <span style={{ marginLeft: "auto", fontSize: 11, color: C.sub }}>{item.assigned_at || item.completed_at}</span>
      </div>
      <div style={{ height: 260, overflow: "hidden", background: C.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={item.image_url} alt="신고 콘텐츠" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div style={{ padding: "12px 16px" }}>
        <div onMouseUp={handleMouseUp} style={{ fontSize: 13, color: C.text, lineHeight: 1.6, userSelect: "text", cursor: onTextSelect ? "text" : "default", padding: onTextSelect ? "6px 8px" : "0", borderRadius: 6, background: onTextSelect ? "rgba(124,58,237,.04)" : "transparent", border: onTextSelect ? "1px dashed rgba(124,58,237,.2)" : "none" }}>
          {item.content}
        </div>
        {onTextSelect && <div style={{ fontSize: 10, color: C.purple, marginTop: 6 }}>✏️ 위 텍스트를 드래그하면 우회표현에 자동 입력돼요</div>}
        <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
          {["❤️ 신고됨", "💬 댓글", "📌 저장"].map((t, i) => (
            <span key={i} style={{ fontSize: 11, color: C.sub }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailPage({ records }) {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  const searched = query.trim()
    ? records.filter(h =>
        String(h.report_ID).includes(query.replace("#", "")) ||
        h.content.includes(query) ||
        h.type.includes(query.toUpperCase()) ||
        h.decision.includes(query)
      )
    : records;

  if (selected) {
    const h = selected;
    const tc = TYPE_CFG[h.type];
    const hateName = h.htID ? HATE_TYPES.find(t => t.ht_ID === h.htID)?.ht_name : null;
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.sub, cursor: "pointer", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
          ← 내역 목록으로
        </button>
        <SectionHead title={"신고 #" + h.report_ID + " 상세"} sub={h.completed_at} />
        <ReportCard item={h} />
        <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ padding: "16px 18px", borderBottom: "1px solid " + C.border }}>
            <div style={{ fontSize: 11, color: C.sub, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>판정 결과</div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, background: h.decision === "혐오" ? "rgba(239,68,68,.06)" : "rgba(16,185,129,.06)", border: "1px solid " + (h.decision === "혐오" ? "rgba(239,68,68,.2)" : "rgba(16,185,129,.2)"), borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: C.sub, marginBottom: 6 }}>판정</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: h.decision === "혐오" ? C.red : C.green }}>{h.decision === "혐오" ? "🚫 혐오" : "✅ 정상"}</div>
              </div>
              <div style={{ flex: 1, background: h.agr ? "rgba(16,185,129,.06)" : "rgba(239,68,68,.06)", border: "1px solid " + (h.agr ? "rgba(16,185,129,.2)" : "rgba(239,68,68,.2)"), borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: C.sub, marginBottom: 6 }}>다수 의견과</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: h.agr ? C.green : C.red }}>{h.agr ? "✓ 일치" : "✕ 불일치"}</div>
              </div>
            </div>
          </div>
          {h.decision === "혐오" && (
            <div style={{ padding: "14px 18px", borderBottom: "1px solid " + C.border }}>
              <div style={{ fontSize: 11, color: C.sub, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>혐오 유형</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: tc.color }}>{tc.short}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: tc.color }}>{h.type}</div>
                  <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{tc.label}</div>
                </div>
              </div>
            </div>
          )}
          {h.decision === "혐오" && h.type === "TYPE1" && h.varWord && (
            <div style={{ padding: "14px 18px", borderBottom: "1px solid " + C.border }}>
              <div style={{ fontSize: 11, color: C.sub, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>우회표현 분석</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, background: C.muted, borderRadius: 9, padding: "10px 14px" }}>
                  <div style={{ fontSize: 10, color: C.sub, marginBottom: 4 }}>발견된 우회표현</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.purple }}>{h.varWord}</div>
                </div>
                <div style={{ color: C.sub, fontSize: 18 }}>→</div>
                <div style={{ flex: 1, background: C.muted, borderRadius: 9, padding: "10px 14px" }}>
                  <div style={{ fontSize: 10, color: C.sub, marginBottom: 4 }}>추정 원단어</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.red }}>{h.bwText}</div>
                </div>
              </div>
            </div>
          )}
          {h.decision === "혐오" && (h.type === "TYPE2" || h.type === "TYPE3") && hateName && (
            <div style={{ padding: "14px 18px", borderBottom: "1px solid " + C.border }}>
              <div style={{ fontSize: 11, color: C.sub, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>혐오 카테고리</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: tc.bg, border: "1px solid " + tc.color + "33", borderRadius: 9, padding: "8px 16px" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: tc.color }}>{hateName}</span>
              </div>
            </div>
          )}
          <div style={{ padding: "12px 18px", display: "flex", gap: 24 }}>
            <div><div style={{ fontSize: 10, color: C.sub, marginBottom: 3 }}>완료 시각</div><div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{h.completed_at}</div></div>
            <div><div style={{ fontSize: 10, color: C.sub, marginBottom: 3 }}>신고 ID</div><div style={{ fontSize: 12, color: C.text, fontWeight: 600, fontFamily: "monospace" }}>#{h.report_ID}</div></div>
            {h.elapsed != null && <div><div style={{ fontSize: 10, color: C.sub, marginBottom: 3 }}>판정 소요</div><div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{h.elapsed}초</div></div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHead title="판정 내역 상세" sub={"총 " + records.length + "건"} />
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: C.sub }}>🔍</span>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="#신고번호, 내용, TYPE1, 혐오 등으로 검색"
          style={{ width: "100%", padding: "10px 14px 10px 34px", borderRadius: 10, border: "1px solid " + (query ? C.purple : C.border), background: C.surface, color: C.text, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
        {query && <button onClick={() => setQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.sub, fontSize: 16 }}>✕</button>}
      </div>
      {query && <div style={{ fontSize: 12, color: C.sub, marginBottom: 12 }}>"{query}" 검색 결과 {searched.length}건</div>}
      {searched.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.sub }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14 }}>검색 결과가 없어요</div>
        </div>
      ) : searched.map((h, i) => {
        const tc = TYPE_CFG[h.type];
        const hateName = h.htID ? HATE_TYPES.find(t => t.ht_ID === h.htID)?.ht_name : null;
        return (
          <div key={i} onClick={() => setSelected(h)} style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 12, padding: "16px 18px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
            onMouseOver={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.07)"; e.currentTarget.style.borderColor = "#c4b5fd"; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = C.border; }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: tc.color, flexShrink: 0 }}>{tc.short}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: C.sub }}>#{h.report_ID}</span>
                <span style={{ fontSize: 11, color: tc.color, fontWeight: 600 }}>{h.type}</span>
                {h.type === "TYPE1" && h.varWord && <span style={{ fontSize: 11, color: C.sub }}>· {h.varWord} → {h.bwText}</span>}
                {(h.type === "TYPE2" || h.type === "TYPE3") && hateName && <span style={{ fontSize: 11, color: C.sub }}>· {hateName}</span>}
              </div>
              <div style={{ fontSize: 13, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.content}</div>
              <div style={{ fontSize: 10, color: C.sub, marginTop: 4 }}>{h.completed_at}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
              <Tag label={h.decision} color={h.decision === "혐오" ? C.red : C.green} bg={h.decision === "혐오" ? "rgba(239,68,68,.08)" : "rgba(16,185,129,.08)"} />
              <span style={{ fontSize: 11, color: h.agr ? C.green : C.red }}>{h.agr ? "✓ 일치" : "✕ 불일치"}</span>
            </div>
            <span style={{ color: C.sub, fontSize: 18, flexShrink: 0 }}>›</span>
          </div>
        );
      })}
    </div>
  );
}

function QueuePage({ queue, onStart }) {
  return (
    <div>
      <SectionHead title="할당된 신고" sub={queue.length + "건 대기 중"} />
      {queue.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.sub }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 14 }}>모든 신고 판정을 완료했어요</div>
        </div>
      ) : queue.map((a, i) => (
        <div key={i} style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 12, padding: "16px", marginBottom: 10, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 52, height: 52, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
            <img src={a.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: C.sub }}>#{a.report_ID}</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: a.status === "진행중" ? "rgba(245,158,11,.12)" : C.muted, color: a.status === "진행중" ? C.yellow : C.sub, fontWeight: 600 }}>{a.status}</span>
              <span style={{ fontSize: 11, color: C.sub, marginLeft: "auto" }}>{a.assigned_at}</span>
            </div>
            <div style={{ fontSize: 13, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.content}</div>
          </div>
          <Btn onClick={() => onStart(a)} style={{ background: C.purple, color: "#fff", flexShrink: 0, alignSelf: "center" }}>판정 시작</Btn>
        </div>
      ))}
    </div>
  );
}

function JudgePage({ item, onDone }) {
  const [step, setStep]         = useState(1);
  const [dec, setDec]           = useState(null);
  const [rtype, setRtype]       = useState(null);
  const [varWord, setVar]       = useState("");
  const [bwText, setBw]         = useState("");
  const [htID, setHt]           = useState(null);
  const [etcText, setEtc]       = useState("");
  const [done, setDone]         = useState(false);
  const [dragHint, setDragHint] = useState(null);
  const startTime               = useRef(Date.now());

  const handleTextSelect = (text) => { setVar(text); setDragHint(text); setTimeout(() => setDragHint(null), 2000); };

  const fireComplete = (decision) => {
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);
    onDone({ report_ID: item.report_ID, content: item.content, image_url: item.image_url, type: rtype || "TYPE1", decision, agr: true, completed_at: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }), varWord: varWord || null, bwText: bwText || null, htID: htID || null, elapsed });
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>판정 완료</div>
      <div style={{ fontSize: 13, color: C.sub, marginBottom: 32 }}>신고 #{item.report_ID} 처리됨</div>
      <Btn onClick={() => fireComplete("혐오")} style={{ background: C.purple, color: "#fff" }}>목록으로</Btn>
    </div>
  );

  const steps = ["신고 판단", "유형 선택", "세부 판정"];

  return (
    <div>
      <button onClick={() => onDone(null)} style={{ background: "none", border: "none", color: C.sub, cursor: "pointer", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>← 목록으로</button>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ height: 3, borderRadius: 99, marginBottom: 6, background: step >= i + 1 ? C.purple : C.muted, opacity: step > i + 1 ? 0.4 : 1 }} />
            <div style={{ fontSize: 10, color: step === i + 1 ? C.purple : C.sub, fontWeight: step === i + 1 ? 700 : 400 }}>{i + 1}. {s}</div>
          </div>
        ))}
      </div>
      <ReportCard item={item} onTextSelect={step === 3 && rtype === "TYPE1" ? handleTextSelect : null} />
      {step === 1 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>이 콘텐츠는 신고 감인가요?</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { setDec("Y"); setStep(2); }} style={{ flex: 1, padding: 14, borderRadius: 12, border: "1px solid " + (dec === "Y" ? C.purple : C.border), background: dec === "Y" ? "rgba(124,58,237,.08)" : C.surface, color: dec === "Y" ? C.purple : C.text, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>✓ 맞음 — 신고 진행</button>
            <button onClick={() => { const elapsed = Math.round((Date.now() - startTime.current) / 1000); onDone({ report_ID: item.report_ID, content: item.content, image_url: item.image_url, type: "TYPE1", decision: "정상", agr: true, completed_at: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }), varWord: null, bwText: null, htID: null, elapsed }); }} style={{ flex: 1, padding: 14, borderRadius: 12, border: "1px solid " + C.border, background: C.surface, color: C.sub, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>✕ 부정 신고</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>혐오 유형을 선택하세요</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {Object.entries(TYPE_CFG).map(([k, v]) => (
              <button key={k} onClick={() => setRtype(k)} style={{ padding: "14px 16px", borderRadius: 12, cursor: "pointer", textAlign: "left", border: "1px solid " + (rtype === k ? v.color : C.border), background: rtype === k ? v.bg : C.surface, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: v.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: v.color }}>{v.short}</div>
                <div><div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{k}</div><div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{v.label}</div></div>
                {rtype === k && <span style={{ marginLeft: "auto", color: v.color, fontSize: 16 }}>✓</span>}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => setStep(1)} style={{ background: C.muted, color: C.sub }}>← 이전</Btn>
            <Btn onClick={() => rtype && setStep(3)} style={{ flex: 1, background: rtype ? C.purple : C.muted, color: rtype ? "#fff" : C.sub }}>다음 →</Btn>
          </div>
        </div>
      )}
      {step === 3 && rtype === "TYPE1" && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16 }}>TYPE1 — 원단어 / 우회표현 입력</div>
          <label style={{ fontSize: 11, color: C.sub, display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            우회표현 (발견된 표현)
            {dragHint && <span style={{ color: C.purple, fontWeight: 700, fontSize: 11, background: "rgba(124,58,237,.08)", padding: "2px 8px", borderRadius: 6 }}>✓ "{dragHint}" 입력됨</span>}
          </label>
          <input value={varWord} onChange={e => setVar(e.target.value)} placeholder="위 텍스트를 드래그하거나 직접 입력하세요"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid " + (varWord ? C.purple : C.border), background: varWord ? "rgba(124,58,237,.04)" : C.surface, color: C.text, fontSize: 13, marginBottom: 14, boxSizing: "border-box", outline: "none" }} />
          <label style={{ fontSize: 11, color: C.sub, display: "block", marginBottom: 6 }}>추정 원단어</label>
          <input value={bwText} onChange={e => setBw(e.target.value)} placeholder="예: 누칼협, 엠생"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid " + C.border, background: C.surface, color: C.text, fontSize: 13, marginBottom: 20, boxSizing: "border-box", outline: "none" }} />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => setStep(2)} style={{ background: C.muted, color: C.sub }}>← 이전</Btn>
            <Btn onClick={() => (varWord && bwText) && setDone(true)} style={{ flex: 1, background: (varWord && bwText) ? C.purple : C.muted, color: "#fff" }}>판정 완료</Btn>
          </div>
        </div>
      )}
      {step === 3 && (rtype === "TYPE2" || rtype === "TYPE3") && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16 }}>{rtype} — 혐오 카테고리 선택</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 12 }}>
            {HATE_TYPES.map(ht => (
              <button key={ht.ht_ID} onClick={() => setHt(ht.ht_ID)} style={{ padding: "12px", borderRadius: 10, cursor: "pointer", border: "1px solid " + (htID === ht.ht_ID ? TYPE_CFG[rtype].color : C.border), background: htID === ht.ht_ID ? TYPE_CFG[rtype].bg : C.surface, color: htID === ht.ht_ID ? TYPE_CFG[rtype].color : C.text, fontSize: 13, fontWeight: htID === ht.ht_ID ? 700 : 400 }}>
                {ht.ht_name}
              </button>
            ))}
          </div>
          {htID === 8 && <textarea value={etcText} onChange={e => setEtc(e.target.value)} placeholder="기타 사유를 입력해주세요" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid " + C.border, background: C.surface, color: C.text, fontSize: 13, marginBottom: 12, boxSizing: "border-box", resize: "none", height: 80, outline: "none" }} />}
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => setStep(2)} style={{ background: C.muted, color: C.sub }}>← 이전</Btn>
            <Btn onClick={() => htID && (htID !== 8 || etcText.trim()) && setDone(true)} style={{ flex: 1, background: (htID && (htID !== 8 || etcText.trim())) ? TYPE_CFG[rtype].color : C.muted, color: "#fff" }}>판정 완료</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

function MyWorkPage({ newRecords, stats }) {
  const isMobile = useIsMobile();
  const agreeItems = [
    { label: "판정",  rate: METRIC.decision_agr_rate, color: C.purple },
    { label: "유형",  rate: METRIC.type_agr_rate,     color: C.red    },
    { label: "TYPE1", rate: METRIC.t1_term_agr_rate,  color: C.purple },
    { label: "TYPE2", rate: METRIC.t2_agr_rate,       color: C.red    },
    { label: "TYPE3", rate: METRIC.t3_agr_rate,       color: C.green  },
  ];
  const [tab, setTab] = useState("전체");
  const tabs = ["전체","TYPE1","TYPE2","TYPE3"];
  const allHistory = [...newRecords, ...HISTORY];
  const filtered = tab === "전체" ? allHistory : allHistory.filter(h => h.type === tab);
  const ringSize = isMobile ? 48 : 60;

  return (
    <div>
      <SectionHead title="내 업무 현황" sub={"beta_" + ME.bt_ID} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", background: C.surface, border: "1px solid " + C.border, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
        {[{ v: stats.total, u: "건", l: "전체 검토" }, { v: stats.weekly, u: "건", l: "이번 주" }, { v: stats.avgSec, u: "초", l: "평균 검토" }].map((s, i) => (
          <div key={i} style={{ padding: "16px 0", textAlign: "center", borderRight: i < 2 ? "1px solid " + C.border : "none" }}>
            <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 800, letterSpacing: -1, color: C.text }}>{s.v}<span style={{ fontSize: 11, color: C.sub, fontWeight: 400, marginLeft: 2 }}>{s.u}</span></div>
            <div style={{ fontSize: 10, color: C.sub, marginTop: 3 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 12, padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(16,185,129,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: C.green, fontSize: 16 }}>✓</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.green }}>이상 점수 {(METRIC.abn_score * 100).toFixed(0)}점 — 정상</div>
          <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>판정 패턴이 안정적이에요</div>
        </div>
      </div>
      <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 14, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.sub, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>동의율</div>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 20 }}>
          {agreeItems.map((a, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <Ring rate={a.rate} color={a.color} size={ringSize} />
              <div style={{ fontSize: 10, color: C.sub, marginTop: 5 }}>{a.label}</div>
            </div>
          ))}
        </div>
        {agreeItems.map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, fontSize: 11, color: C.sub }}>{a.label}</div>
            <div style={{ flex: 1, height: 3, background: C.muted, borderRadius: 99, overflow: "hidden" }}><BarAnim rate={a.rate} color={a.color} delay={i * 80} /></div>
            <div style={{ width: 30, fontSize: 11, color: a.color, fontWeight: 700, textAlign: "right" }}>{Math.round(a.rate * 100)}%</div>
          </div>
        ))}
      </div>
      <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 14, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.sub, letterSpacing: "1px", textTransform: "uppercase" }}>최근 판정</div>
          <div style={{ display: "flex", gap: 3, background: C.muted, borderRadius: 9, padding: 3 }}>
            {tabs.map(t => <button key={t} onClick={() => setTab(t)} style={{ padding: "3px 8px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, background: tab === t ? "#fff" : "transparent", color: tab === t ? C.text : C.sub, boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,.08)" : "none" }}>{t}</button>)}
          </div>
        </div>
        {filtered.map((h, i) => {
          const tc = TYPE_CFG[h.type];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < filtered.length - 1 ? "1px solid " + C.border : "none" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: tc.color, flexShrink: 0 }}>{tc.short}</div>
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

export default function BetaTesterApp() {
  const isMobile = useIsMobile();
  const [page, setPage]             = useState("queue");
  const [judging, setJudging]       = useState(null);
  const [newRecords, setNewRecords] = useState([]);
  const [queue, setQueue]           = useState(QUEUE);
  const [stats, setStats]           = useState({ total: METRIC.total_review_cnt, weekly: HISTORY.length, avgSec: METRIC.avg_review_sec });

  const handleJudgeDone = (result) => {
    if (result) {
      setStats(prev => {
        const newTotal  = prev.total + 1;
        const newWeekly = prev.weekly + 1;
        const newAvg    = result.elapsed != null ? Math.round((prev.avgSec * prev.total + result.elapsed) / newTotal) : prev.avgSec;
        return { total: newTotal, weekly: newWeekly, avgSec: newAvg };
      });
      setNewRecords(prev => [result, ...prev]);
      setQueue(prev => prev.filter(q => q.report_ID !== result.report_ID));
    }
    setJudging(null);
  };

  const mainContent = (
    <main style={{ flex: 1, padding: isMobile ? "20px 16px 80px" : "28px 32px", maxWidth: 760, overflowY: "auto", width: "100%" }}>
      {page === "queue" && !judging && <QueuePage queue={queue} onStart={item => setJudging(item)} />}
      {page === "queue" &&  judging && <JudgePage item={judging} onDone={handleJudgeDone} />}
      {page === "detail" && <DetailPage records={[...newRecords, ...HISTORY]} />}
      {page === "mywork" && <MyWorkPage newRecords={newRecords} stats={stats} />}
      {page === "board"  && <BoardPage />}
    </main>
  );

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, fontFamily: "'Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif", color: C.text,overflowX: "hidden", width: "100vw", position: "relative" }}>
        <header style={{ background: "#fff", borderBottom: "1px solid " + C.border, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 100 }}>
          <img src="/images/nullhate.png" style={{ height: 20, objectFit: "contain" }} alt="nullhate" />
          <div style={{ fontSize: 13, fontWeight: 800, background: C.ig, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>(null)hate</div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <IgRing size={28}>{ME.avatar}</IgRing>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>beta_{ME.bt_ID}</div>
          </div>
        </header>

        {mainContent}

        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid " + C.border, display: "flex", zIndex: 100 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setJudging(null); }} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "10px 4px 8px", border: "none", background: "none", cursor: "pointer",
              color: page === n.id && !judging ? C.purple : C.sub,
              borderTop: page === n.id && !judging ? "2px solid " + C.purple : "2px solid transparent",
              transition: "all .15s", position: "relative",
            }}>
              <span style={{ fontSize: 20 }}>{n.icon}</span>
              <span style={{ fontSize: 10, fontWeight: page === n.id ? 700 : 400, marginTop: 2 }}>{n.label}</span>
              {n.id === "queue" && queue.length > 0 && (
                <span style={{ position: "absolute", top: 6, right: "calc(50% - 18px)", fontSize: 9, background: C.purple, color: "#fff", borderRadius: 20, padding: "1px 5px", fontWeight: 700 }}>{queue.length}</span>
              )}
              {n.id === "detail" && newRecords.length > 0 && (
                <span style={{ position: "absolute", top: 6, right: "calc(50% - 18px)", fontSize: 9, background: C.green, color: "#fff", borderRadius: 20, padding: "1px 5px", fontWeight: 700 }}>N</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    );
  }

  // admin 스타일 CSS 변수
  const SB = {
    bg:      "#fafafa",
    border:  "#e8eaed",
    text:    "#1a1d23",
    sub:     "#6b7280",
    sub2:    "#9ca3af",
    p:       "#6d28d9",
    pl:      "rgba(109,40,217,.08)",
    g:       "#16a34a",
    r:       "#dc2626",
    s2:      "#f3f4f6",
    ig:      "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
  };

  const navStyle = (isActive) => ({
    width: "100%", display: "flex", alignItems: "center", gap: 7,
    padding: "8px 9px", borderRadius: 7, border: "none", cursor: "pointer",
    background: isActive ? SB.pl : "transparent",
    color: isActive ? SB.p : SB.sub,
    fontSize: 11, fontFamily: "inherit", fontWeight: isActive ? 700 : 500,
    transition: "all .12s", marginBottom: 1, textAlign: "left",
  });

  const badgeStyle = (bg) => ({
    marginLeft: "auto", fontSize: 9, background: bg, color: "#fff",
    borderRadius: 10, padding: "1px 5px", fontWeight: 700,
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif", color: C.text }}>
      <aside style={{ width: 196, flexShrink: 0, background: SB.bg, borderRight: "1px solid " + SB.border, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>

        {/* 로고 */}
        <div style={{ padding: "16px 14px 12px", borderBottom: "1px solid " + SB.border, display: "flex", alignItems: "center", gap: 9 }}>
          <img src="/images/nullhate.png" style={{ height: 24, objectFit: "contain", display: "block" }} alt="nullhate" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, background: SB.ig, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>(null)hate</div>
            <div style={{ fontSize: 9, color: SB.sub2 }}>beta test</div>
          </div>
        </div>

        {/* 유저 */}
        <div style={{ padding: "10px 14px", borderBottom: "1px solid " + SB.border, display: "flex", alignItems: "center", gap: 8, cursor: "default" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: SB.ig, padding: 1.5, flexShrink: 0 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
              {ME.avatar}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: SB.text }}>beta_{ME.bt_ID}</div>
            <div style={{ fontSize: 9, color: SB.sub, marginTop: 1, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: SB.g, display: "inline-block" }} />
              활동 중
            </div>
          </div>
        </div>

        {/* 네비 */}
        <nav style={{ padding: "8px 8px", flex: 1, overflowY: "auto" }}>
          {NAV.map(n => {
            const isActive = page === n.id && !judging;
            return (
              <button key={n.id} onClick={() => { setPage(n.id); setJudging(null); }} style={navStyle(isActive)}
                onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = SB.s2; e.currentTarget.style.color = SB.text; }}}
                onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = SB.sub; }}}
              >
                <span style={{ fontSize: 14 }}>{n.icon}</span>
                {n.label}
                {n.id === "queue" && queue.length > 0 && <span style={badgeStyle(SB.p)}>{queue.length}</span>}
                {n.id === "detail" && newRecords.length > 0 && <span style={badgeStyle(SB.g)}>N</span>}
              </button>
            );
          })}
        </nav>

        {/* 하단 동의율 */}
        <div style={{ padding: "10px 14px", borderTop: "1px solid " + SB.border }}>
          <div style={{ fontSize: 9, color: SB.sub2, letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 7, fontWeight: 600 }}>이번 주 동의율</div>
          {[
            { l: "판정", v: METRIC.decision_agr_rate, c: SB.p },
            { l: "유형", v: METRIC.type_agr_rate,     c: C.red },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
              <div style={{ fontSize: 9, color: SB.sub, width: 20 }}>{r.l}</div>
              <div style={{ flex: 1, height: 3, background: SB.border, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: (r.v * 100) + "%", height: "100%", background: r.c, borderRadius: 99 }} />
              </div>
              <div style={{ fontSize: 9, color: r.c, fontWeight: 700, width: 22, textAlign: "right" }}>{Math.round(r.v * 100)}%</div>
            </div>
          ))}
        </div>

      </aside>
      {mainContent}
    </div>
  );
}