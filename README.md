# CleanGram — BetaTesterApp.jsx

베타테스터용 화면 컴포넌트입니다.
디자인 컨셉: **APITable 레이아웃 + 인스타그램 UI 요소**

---

## 📁 파일 적용 방법

### 1. 파일 복사
```
BetaTesterApp.jsx
→ C:\Users\asia\hateguard\src\pages\BetaTesterApp.jsx
```

### 2. App.jsx에 라우트 추가
```jsx
import BetaTesterApp from "./pages/BetaTesterApp";

// <Routes> 안에 추가
<Route path="/beta" element={<BetaTesterApp />} />
```

### 3. 로컬 실행
```bash
cd C:\Users\asia\hateguard
npm run dev
# → http://localhost:5174/beta
```

---

## 🗂️ 컴포넌트 구조

```
BetaTesterApp (루트)
├── Sidebar          ← 사이드바 (로고, 프로필, 네비, 미니 통계)
├── QueuePage        ← 할당 목록 페이지
├── JudgePage        ← 판정 플로우 (3단계)
│   ├── IgPost       ← 인스타 포스트 UI
│   ├── Step1        ← 신고 판단 (Y/N)
│   ├── Step2        ← 유형 선택 (TYPE1/2/3)
│   └── Step3        ← 세부 판정
│       ├── TYPE1    ← 원단어 + 우회표현 입력
│       ├── TYPE2    ← 혐오 카테고리 선택
│       └── TYPE3    ← 혐오 카테고리 선택
└── MyWorkPage       ← 내 업무 현황
    ├── StatCards    ← 인스타 스타일 숫자 3개
    ├── AbnBanner    ← 이상 점수 배너
    ├── RingCharts   ← 동의율 링 차트
    └── HistoryList  ← 최근 판정 내역
```

---

## 📊 더미 데이터 위치 & 수정 방법

### 할당 목록 수정
```jsx
const QUEUE = [
  {
    report_ID: 8812,
    status: "진행중",
    assigned_at: "14:00",
    username: "@travel_seoul_kr",   // 인스타 계정명
    avatar: "✈️",                   // 아바타 이모지
    image_bg: "linear-gradient(...)", // 이미지 배경색
    image_emoji: "🌃",              // 이미지 대표 이모지
    image_label: "서울 야경 카페",  // 이미지 설명
    caption: "오늘 을지로 카페...", // 게시글 본문
    comments: [
      { user: "@user_29k", text: "저도 가보고싶어요!", reported: false },
      { user: "@anon_user", text: "신고된 댓글 내용", reported: true }, // ← 신고된 댓글
    ]
  },
  // 항목 추가...
];
```
> ⚠️ `reported: true` 인 댓글이 신고 대상으로 빨간 테두리 표시됩니다.

### 판정 내역 수정
```jsx
const HISTORY = [
  {
    report_ID: 8801,
    type: "TYPE1",        // "TYPE1" | "TYPE2" | "TYPE3"
    decision: "혐오",     // "혐오" | "정상"
    agr: true,            // 다수 동의 여부 (true/false)
    completed_at: "오늘 12:33"
  },
  // ...
];
```

### 혐오 카테고리 수정
```jsx
const HATE_TYPES = [
  { ht_ID: 1, ht_name: "성혐오" },
  { ht_ID: 2, ht_name: "연령" },
  { ht_ID: 3, ht_name: "인종/지역" },
  { ht_ID: 4, ht_name: "장애" },
  { ht_ID: 5, ht_name: "종교" },
  { ht_ID: 6, ht_name: "정치성향" },
  { ht_ID: 7, ht_name: "직업/계층" },
];
```

### 내 업무 지표 수정
```jsx
const METRIC = {
  bt_ID: 1042,
  total_review_cnt: 128,       // 전체 검토 건수
  decision_agr_rate: 0.82,     // 판정 동의율 (0~1)
  type_agr_rate: 0.78,         // 유형 동의율
  t1_term_agr_rate: 0.91,      // TYPE1 동의율
  t2_agr_rate: 0.70,           // TYPE2 동의율
  t3_agr_rate: 0.88,           // TYPE3 동의율
  avg_review_sec: 47,          // 평균 검토 시간 (초)
  abn_score: 0.05,             // 이상 점수 (0~1, 낮을수록 정상)
  last_updated_at: "2026-04-22 13:41",
};
```

---

## 🎨 색상 토큰

```jsx
const C = {
  bg:      "#0d0d0d",   // 전체 배경
  surface: "#161616",   // 카드 배경
  border:  "#222",      // 테두리
  muted:   "#2a2a2a",   // 비활성 배경
  text:    "#e8e8e8",   // 기본 텍스트
  sub:     "#666",      // 보조 텍스트
  ig:      "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", // 인스타 그라디언트
  purple:  "#a78bfa",   // TYPE1 색상
  red:     "#f87171",   // TYPE2 색상
  green:   "#34d399",   // TYPE3 / 정상 색상
  yellow:  "#fcb045",   // 경고 / 진행중 색상
  blue:    "#60a5fa",   // 보조 색상
};
```

---

## 🔌 DB 연결 시 수정 포인트

나중에 실제 DB 붙일 때 아래 부분을 API 호출로 교체하면 됩니다.

```jsx
// 현재 (더미)
const QUEUE = [ ... ];

// DB 연결 후
const [queue, setQueue] = useState([]);
useEffect(() => {
  fetch("/api/assignments?bt_id=1042&status=배정됨")
    .then(r => r.json())
    .then(setQueue);
}, []);
```

관련 ERD 테이블:
| 화면 | 연결 테이블 |
|---|---|
| 할당 목록 | `REPORT_ASSIGNMENT`, `REPORT`, `CONTENT_ITEM` |
| 판정 Step1 | `REPORT_DECISION_VOTE` |
| 판정 Step2 | `REPORT_TYPE_VOTE` |
| 판정 Step3-T1 | `TYPE1_TERM_VOTE` |
| 판정 Step3-T2 | `TYPE2_CLASSIFICATION_VOTE` |
| 판정 Step3-T3 | `TYPE3_CLASSIFICATION_VOTE` |
| 내 업무 현황 | `BETA_TESTER_METRIC`, `REPORT_ASSIGNMENT` |

---

## ⚙️ 의존성

추가 설치 필요 없음. 기존 hateguard 프로젝트 그대로 사용 가능.

```json
"dependencies": {
  "react": "^18",
  "react-dom": "^18"
}
```

---

## 📝 개발 시 참고

- 모든 스타일은 인라인 style로 작성되어 있습니다 (CSS 파일 없음)
- 색상은 상단 `const C = { ... }` 에서 일괄 관리
- 더미 데이터는 상단 `const QUEUE`, `METRIC`, `HISTORY` 에서 수정
- 페이지 전환은 `useState`로 관리 (react-router 미사용)
