import { useState } from "react";

const C = {
  bg:      "#ffffff",
  surface: "#f9f9f9",
  border:  "#e5e5e5",
  muted:   "#f0f0f0",
  text:    "#111111",
  sub:     "#888888",
  purple:  "#7c3aed",
  red:     "#ef4444",
  green:   "#10b981",
  yellow:  "#f59e0b",
  blue:    "#3b82f6",
};

const INITIAL_POSTS = [
  {
    id: 1, cat: "공지",
    title: "베타 테스터 월급 인상 임박 공지",
    body: "이번 분기 성과 우수로 인해 월급 인상이 검토되고 있습니다. 공식 발표 전 사전 공지드려요. 정확한 금액은 미정이나 긍정적인 방향으로 논의 중입니다.",
    author: "관리자", views: 204, date: "04.28", reportId: null,
    comments: [
      { id: 1, author: "beta_0391", text: "진짜요?? 기대됩니다!", date: "04.28" },
      { id: 2, author: "beta_1042", text: "얼마나 오를지 궁금하네요", date: "04.28" },
    ],
  },
  {
    id: 2, cat: "공지",
    title: "5월 판정 가이드라인 업데이트 예정",
    body: "TYPE2 기준이 일부 변경됩니다. 텍스트 맥락 판단 시 주변 문맥을 더 넓게 고려하는 방향으로 수정됩니다. 적용 전 필독 부탁드려요.",
    author: "관리자", views: 187, date: "04.27", reportId: null,
    comments: [
      { id: 1, author: "beta_0712", text: "구체적인 변경 내용 공유해주실 수 있나요?", date: "04.27" },
    ],
  },
  {
    id: 3, cat: "자유",
    title: "주말에 롤 하실 분~",
    body: "토요일 저녁 9시쯤 5인큐 맞추려는데 관심 있으신 분 댓글 달아주세요. 티어 무관해요!",
    author: "beta_0391", views: 44, date: "오늘", reportId: null,
    comments: [
      { id: 1, author: "beta_0887", text: "저요! 골드인데 괜찮아요?", date: "오늘" },
      { id: 2, author: "beta_1042", text: "저도 낄게요 ㅋㅋ", date: "오늘" },
    ],
  },
  {
    id: 4, cat: "자유",
    title: "판정하다 웃긴 신고 있으셨어요?",
    body: "오늘 진짜 말이 안 되는 신고 들어왔는데 혼자 웃었네요 ㅋㅋ 다들 비슷한 거 있으면 공유해요",
    author: "beta_1042", views: 38, date: "오늘", reportId: null,
    comments: [
      { id: 1, author: "beta_0299", text: "저도 오늘 진짜 황당한 거 들어왔어요 ㅋㅋㅋ", date: "오늘" },
    ],
  },
  {
    id: 5, cat: "자유",
    title: "스타벅스 신메뉴 추천합니다",
    body: "판정 쉬는 시간에 먹었는데 꿀맛이에요. 오늘 마감 전에 꼭 가보세요",
    author: "beta_0887", views: 29, date: "04.27", reportId: null,
    comments: [],
  },
  {
    id: 6, cat: "억울해요",
    title: "TYPE3 혐오 판정했는데 왜 불일치??",
    body: "이미지+텍스트 조합이 명백히 인종 비하인데 다수가 정상으로 판정한 게 이해가 안 가요. 제 판단이 틀린 건가요 진짜... 어떻게 생각하세요?",
    author: "beta_1042", views: 52, date: "오늘", reportId: "8780",
    comments: [
      { id: 1, author: "beta_0712", text: "저도 비슷한 케이스에서 불일치 받았어요. 이미지 단독으로는 애매하게 판단하는 것 같더라고요", date: "오늘" },
      { id: 2, author: "beta_0391", text: "관리자한테 문의해보는 게 나을 것 같아요", date: "오늘" },
    ],
  },
  {
    id: 7, cat: "억울해요",
    title: "TYPE1 우회표현 ㄴㅋㅎ 혐오 판정했는데 불일치 뜸",
    body: "누칼협 우회인 거 명백하잖아요. 어떻게 이걸 정상으로 보는 거죠? 기준이 뭔지 모르겠어요. 같은 표현을 다른 신고에서 혐오로 처리한 기록도 있는데...",
    author: "beta_0299", views: 41, date: "04.27", reportId: "8762",
    comments: [
      { id: 1, author: "beta_1042", text: "저도 ㄴㅋㅎ 혐오로 판정했는데 일치 받았거든요. 맥락 차이인 것 같기도 해요", date: "04.27" },
    ],
  },
  {
    id: 8, cat: "억울해요",
    title: "같은 표현인데 어제는 일치 오늘은 불일치",
    body: "동일한 우회표현을 어제도 혐오로 판정했는데 일치였고 오늘은 불일치예요. 기준이 날마다 바뀌나요? 아니면 제가 뭔가 놓친 건지...",
    author: "beta_0712", views: 33, date: "04.26", reportId: "8741",
    comments: [],
  },
];

const TAG_CFG = {
  "자유":    { color: C.blue,    bg: "rgba(59,130,246,.1)"  },
  "공지":    { color: "#92400e", bg: "rgba(245,158,11,.1)"  },
  "억울해요": { color: "#991b1b", bg: "rgba(239,68,68,.1)"   },
};

const TABS = ["전체", "자유", "공지", "억울해요"];
const CATS = ["자유", "공지", "억울해요"];

function CatTag({ cat }) {
  const t = TAG_CFG[cat];
  return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, fontWeight: 600, background: t.bg, color: t.color, flexShrink: 0 }}>{cat}</span>;
}

/* ── 글쓰기 폼 ── */
function ComposeBox({ onSubmit, onCancel }) {
  const [cat, setCat]         = useState("자유");
  const [title, setTitle]     = useState("");
  const [body, setBody]       = useState("");
  const [reportId, setReport] = useState("");

  const canSubmit = title.trim() && body.trim() && (cat !== "억울해요" || reportId.trim());

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ cat, title: title.trim(), body: body.trim(), reportId: cat === "억울해요" ? reportId.trim() : null });
  };

  return (
    <div style={{ background: "#fff", border: "1.5px dashed #c4b5fd", borderRadius: 10, padding: 18, marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.purple, marginBottom: 12 }}>새 글 작성</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ padding: "5px 14px", borderRadius: 20, border: "1.5px solid " + (cat === c ? TAG_CFG[c].color : C.border), background: cat === c ? TAG_CFG[c].bg : C.surface, color: cat === c ? TAG_CFG[c].color : C.sub, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{c}</button>
        ))}
      </div>
      {cat === "억울해요" && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: C.sub, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
            어떤 판정인가요?
            <span style={{ fontSize: 10, background: "rgba(239,68,68,.1)", color: "#991b1b", padding: "1px 7px", borderRadius: 5, fontWeight: 600 }}>필수</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: C.sub, fontFamily: "monospace" }}>#</span>
            <input value={reportId} onChange={e => setReport(e.target.value.replace(/\D/g, ""))} placeholder="신고 번호 입력 (예: 8780)"
              style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1.5px solid " + (reportId ? C.red : C.border), background: reportId ? "rgba(239,68,68,.04)" : C.surface, color: C.text, fontSize: 13, outline: "none", fontFamily: "monospace" }} />
          </div>
        </div>
      )}
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목을 입력하세요"
        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid " + C.border, background: C.surface, color: C.text, fontSize: 12, marginBottom: 8, boxSizing: "border-box", outline: "none", display: "block" }} />
      <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="내용을 입력하세요..."
        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid " + C.border, background: C.surface, color: C.text, fontSize: 12, height: 80, resize: "none", boxSizing: "border-box", outline: "none", display: "block" }} />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 10 }}>
        <button onClick={onCancel} style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid " + C.border, background: "#fff", fontSize: 11, cursor: "pointer", color: C.sub }}>취소</button>
        <button onClick={handleSubmit} style={{ padding: "6px 14px", borderRadius: 7, border: "none", background: canSubmit ? C.purple : C.muted, color: canSubmit ? "#fff" : C.sub, fontSize: 11, fontWeight: 600, cursor: canSubmit ? "pointer" : "default" }}>등록</button>
      </div>
    </div>
  );
}

/* ── 글 상세 페이지 ── */
function PostDetail({ post, onBack, onAddComment }) {
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText("");
  };

  return (
    <div>
      {/* 뒤로가기 */}
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.sub, cursor: "pointer", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        ← 목록으로
      </button>

      {/* 글 본문 */}
      <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        {/* 헤더 */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid " + C.border }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <CatTag cat={post.cat} />
            {post.cat === "억울해요" && post.reportId && (
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "#991b1b", background: "rgba(239,68,68,.08)", padding: "1px 7px", borderRadius: 5, fontWeight: 600 }}>#{post.reportId}</span>
            )}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: -0.3, marginBottom: 10 }}>{post.title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>👤</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{post.author}</div>
              <div style={{ fontSize: 10, color: C.sub }}>{post.date}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 10, fontSize: 11, color: C.sub }}>
              <span>👁 {post.views}</span>
              <span>💬 {post.comments.length}</span>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: "20px", fontSize: 14, color: C.text, lineHeight: 1.8 }}>
          {post.body}
        </div>
      </div>

      {/* 댓글 목록 */}
      <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid " + C.border }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>댓글 {post.comments.length}개</div>
        </div>

        {post.comments.length === 0 ? (
          <div style={{ padding: "28px", textAlign: "center", color: C.sub, fontSize: 13 }}>
            첫 댓글을 달아보세요!
          </div>
        ) : (
          post.comments.map((c, i) => (
            <div key={c.id} style={{ padding: "14px 20px", borderBottom: i < post.comments.length - 1 ? "1px solid " + C.border : "none", display: "flex", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{c.author}</span>
                  <span style={{ fontSize: 10, color: C.sub }}>{c.date}</span>
                </div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{c.text}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 댓글 입력 */}
      <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginTop: 2 }}>🛡️</div>
          <div style={{ flex: 1 }}>
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="댓글을 입력하세요..."
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmitComment(); } }}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid " + (commentText ? C.purple : C.border), background: "#fff", color: C.text, fontSize: 13, resize: "none", height: 70, boxSizing: "border-box", outline: "none", transition: "border-color .2s", fontFamily: "inherit" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <span style={{ fontSize: 10, color: C.sub }}>Enter로 등록, Shift+Enter로 줄바꿈</span>
              <button onClick={handleSubmitComment} style={{ padding: "6px 16px", borderRadius: 7, border: "none", background: commentText.trim() ? C.purple : C.muted, color: commentText.trim() ? "#fff" : C.sub, fontSize: 11, fontWeight: 600, cursor: commentText.trim() ? "pointer" : "default", transition: "background .15s" }}>
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 게시판 메인 ── */
export default function BoardPage() {
  const [posts, setPosts]         = useState(INITIAL_POSTS);
  const [tab, setTab]             = useState("전체");
  const [composing, setComposing] = useState(false);
  const [selected, setSelected]   = useState(null);

  const selectedPost = selected ? posts.find(p => p.id === selected) : null;

  const filtered = tab === "전체" ? posts : posts.filter(p => p.cat === tab);

  const handleSubmit = ({ cat, title, body, reportId }) => {
    const fullTitle = cat === "억울해요" && reportId ? "신고 #" + reportId + " — " + title : title;
    const newPost = {
      id: posts.length + 1, cat, title: fullTitle, body,
      author: "beta_1042", views: 1, date: "방금", reportId,
      comments: [],
    };
    setPosts(prev => [newPost, ...prev]);
    setComposing(false);
    setTab("전체");
  };

  const handleAddComment = (postId, text) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: [...p.comments, {
          id: p.comments.length + 1,
          author: "beta_1042",
          text,
          date: "방금",
        }],
      };
    }));
  };

  if (selectedPost) {
    return (
      <PostDetail
        post={selectedPost}
        onBack={() => setSelected(null)}
        onAddComment={handleAddComment}
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>자유게시판</div>
        <div style={{ fontSize: 12, color: C.sub, marginTop: 3 }}>베타 테스터 전용 커뮤니티</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 2, background: C.muted, borderRadius: 8, padding: 3 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: tab === t ? "#fff" : "transparent", color: tab === t ? C.text : C.sub, boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,.08)" : "none", transition: "all .15s" }}>{t}</button>
          ))}
        </div>
        <button onClick={() => setComposing(v => !v)} style={{ marginLeft: "auto", padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: composing ? C.muted : C.purple, color: composing ? C.sub : "#fff", fontSize: 11, fontWeight: 600 }}>
          {composing ? "✕ 닫기" : "+ 글쓰기"}
        </button>
      </div>

      {composing && <ComposeBox onSubmit={handleSubmit} onCancel={() => setComposing(false)} />}

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.sub }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 13 }}>아직 글이 없어요</div>
        </div>
      ) : filtered.map(p => (
        <div key={p.id} onClick={() => setSelected(p.id)} style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 10, padding: "14px 16px", marginBottom: 8, cursor: "pointer", transition: "border-color .15s" }}
          onMouseOver={e => e.currentTarget.style.borderColor = "#c4b5fd"}
          onMouseOut={e => e.currentTarget.style.borderColor = C.border}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <CatTag cat={p.cat} />
            {p.cat === "억울해요" && p.reportId && (
              <span style={{ fontSize: 10, fontFamily: "monospace", color: "#991b1b", background: "rgba(239,68,68,.08)", padding: "1px 7px", borderRadius: 5, fontWeight: 600 }}>#{p.reportId}</span>
            )}
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</span>
          </div>
          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 8 }}>{p.body}</div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: C.sub }}>{p.author}</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, fontSize: 10, color: "#aaa" }}>
              <span>👁 {p.views}</span>
              <span>💬 {p.comments.length}</span>
              <span>{p.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
