export interface TechCategory {
  category: string;
  items: string[];
}

export interface Feature {
  title: string;
  description: string;
  screenshot?: string;
}

export interface Decision {
  topic: string;
  context: string | string[];
  rationale: string | string[];
  result?: string | string[];
}

export interface Troubleshooting {
  title: string;
  problem: string | string[];
  cause: string | string[];
  solution: string | string[];
  learning?: string | string[];
}

export interface ProjectStatus {
  label: string;     // 예: "Active · MVP 완료, 다음 단계 준비 중"
  active?: boolean;  // true → accent 컬러 dot, false → muted dot
}

export interface Project {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  status?: ProjectStatus;
  techStack?: TechCategory[];
  githubUrl?: string;
  demoUrl?: string;
  features?: Feature[];
  decisions?: Decision[];
  troubleshooting?: Troubleshooting[];
}

export const projects: Project[] = [
  {
    title: "Mellti",
    slug: "mellti",
    status: {
      label: "Active · MVP 완료, 다음 단계 준비 중",
      active: true,
    },
    description: [
      "발달장애 아동 치료사들이 임상 고민을 나누는 커뮤니티 서비스 (실 배포·MVP 완료, 다음 단계 준비 중).",
      "React Query 무한 스크롤·뒤로가기 복원, 낙관적 업데이트, PC/모바일 UX 분기 설계.",
      "7인 팀(FE 1·BE 2·CE 2·PD 1·PM 1)에서 디자이너 시안 기반 프론트엔드 구현부터 Vercel 배포까지 단독 담당.",
    ].join("\n"),
    tags: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Zustand",
      "React Query",
      "MSW",
      "Vercel",
    ],
    techStack: [
      { category: "Framework", items: ["React 19", "TypeScript"] },
      { category: "Build", items: ["Vite"] },
      { category: "Styling", items: ["Tailwind CSS", "shadcn/ui"] },
      { category: "State", items: ["Zustand", "React Query (TanStack Query v5)"] },
      { category: "Router", items: ["React Router"] },
      { category: "HTTP", items: ["Axios"] },
      { category: "Mock", items: ["MSW"] },
      { category: "Deploy", items: ["Vercel"] },
      { category: "Analytics", items: ["GA4", "Microsoft Clarity"] },
      { category: "SEO", items: ["vite-prerender-plugin"] },
    ],
    githubUrl: "https://github.com/GPCJ/MelloMe_FE_Backup",
    demoUrl: "https://www.melonnetherapists.com",
    features: [
      {
        title: "회원가입 / 로그인",
        description: "JWT 이중 토큰 (AT body + RT httpOnly Cookie)",
      },
      {
        title: "치료사 인증",
        description: "면허증 제출 → 즉시 권한 부여 (MVP 정책)",
      },
      {
        title: "게시글 CRUD + 첨부파일",
        description: "이미지/PDF 업로드, S3 presigned URL",
      },
      {
        title: "무한 스크롤 피드",
        description: "뒤로가기 시 스크롤·필터 복원",
      },
      {
        title: "댓글/대댓글 시스템",
        description: "flat 2레벨",
      },
      {
        title: "리액션",
        description: "게시글(스크랩), 댓글 3종 (LIKE / CURIOUS / USEFUL)",
      },
      {
        title: "프로필 편집",
        description: "프사·닉네임, 탭별 작성글·스크랩",
      },
      {
        title: "반응형 UI",
        description:
          "SideNav(PC) + BottomNav(모바일), PageHeader 단일 컴포넌트 통일",
      },
      {
        title: "SEO",
        description: "vite-prerender-plugin 정적 사전 렌더링",
      },
      {
        title: "분석 이벤트",
        description: "GA4 커스텀 이벤트 7종 + Microsoft Clarity",
      },
    ],
    decisions: [
      {
        topic: "Next.js 채택 보류 — Vite + vite-prerender-plugin 유지",
        context: [
          "프로젝트 초반: 동시에 새로 배워야 할 도구가 5개(TypeScript · Tailwind · Zustand · TanStack Query · React Router). 여기에 App Router · 서버 컴포넌트 · 서버 액션을 같이 얹으면 생산성이 무너진다고 판단해 SPA(React + Vite)로 출발.",
          "MVP 안정화 단계: SEO 압박이 올라와 \"결국 Next.js로 가야 하지 않나\" 의문을 정량 비교로 끊기 위해 마이그레이션 비용을 직접 산출.",
          "산출 결과: 14개 작업 항목(app 디렉토리 매핑 · react-router-dom 24파일 치환 · middleware 재설계 · 'use client' 경계와 Hydration mismatch · MSW Next 통합 · RQ·Zustand SSR · 환경변수 14곳 · 회귀 테스트 등) 합계 약 53시간(사이드 작업 병행 시 2~3주).",
        ],
        rationale: [
          "서비스 특성: 멜로미는 로그인 전용 회원 커뮤니티 → 비로그인 크롤러가 도달하는 페이지가 /, /login, /signup, /privacy, /terms 5개뿐. Next.js의 강점인 동적 SSR 활용처 자체가 없음.",
          "유입 경로: 치료사 간 링크 공유 · 브랜드 직접 검색 · 단체 채널 중심 유입. 일반 검색엔진 SEO 가중치가 낮음.",
          "체감 성능: SPA 초기 로딩과 라우트 전환이 사용자 경험을 해치는 수준이 아님.",
          "결정타: 공개 페이지 5개에 한해 정적 HTML만 필요하다면 vite-prerender-plugin으로 약 1/10 비용에 동일 효용 달성 가능.",
        ],
        result: [
          "구현: vite-prerender-plugin으로 /, /privacy, /terms 3개 라우트를 빌드 타임 정적 HTML로 산출 — 실측 약 1.5시간.",
          "비침투성: 핵심 의존성(Vite · React Router · plugin-react) 무변경. prerender 진입점 분리(src/prerender.tsx)로 MSW worker · GA4 · Zustand persist의 SSR 가드 작업도 회피.",
          "성능: 로컬 빌드 9초 / Vercel 배포 14초로 안정화.",
          "재검토 트리거: 게시글 비로그인 공개 정책 변경 · prerender 타깃이 동적 페이지로 확장 · 일반 검색 유입이 직접 검색·링크 공유 유입을 추월하는 시점.",
        ],
      },
      {
        topic: "React Query useInfiniteQuery 도입",
        context: [
          "수동 abort 패턴(requestIdRef + inflightRef)으로 약 40줄의 stale 응답 방어 코드 직접 관리 중.",
        ],
        rationale: [
          "useInfiniteQuery의 signal 자동 처리로 교체 → 직접 관리하던 abort 방어 코드 약 40줄 제거.",
          "핵심 트레이드오프: staleTime: Infinity + initialData 주입 조합으로 뒤로가기 스크롤 복원 구현. 기본 staleTime=0이면 마운트 직후 백그라운드 refetch가 initialData를 덮어 스크롤 복원이 깨짐 → Infinity로 명시 필요.",
        ],
        result: [
          "무한 스크롤 / 뒤로가기 복원 / 필터 변경 깜빡임 없음 / 에러 폴백 전환 — 모두 production 검증 통과.",
        ],
      },
      {
        topic: "댓글 리액션 B 패턴 (페이지 레벨 단일 진실)",
        context: [
          "A 패턴 (각 카드에 리액션 toggle hook을 둠): 진실이 2곳(부모 comments[] + 카드 내부 state)으로 분산됨.",
          "분산된 진실을 맞추려면 stale sync용 useEffect 필요 → 버그 자석.",
        ],
        rationale: [
          "부모(PostDetailPage)가 comments[] 단일 진실 보유, hook은 setComments 콜백으로만 갱신 (B 패턴).",
          "게시글 리액션도 동일 컨벤션 통일 — RQ 캐시 패치 위치를 hook 내부(A)가 아닌 부모 콜백(B)으로 일관 적용.",
        ],
      },
      {
        topic: "PC 모달 / 모바일 라우트 분기",
        context: ["답글 작성 동선을 PC와 모바일에서 다르게 처리해야 함."],
        rationale: [
          "window.matchMedia('(min-width: 768px)') 런타임 분기.",
          "PC: CommentReplyModal 오버레이로 페이지 컨텍스트(스크롤 위치) 유지.",
          "모바일: 기존 /posts/:id/comments/:cid 풀스크린 라우트 유지로 좁은 화면 + 키보드 UX 보존.",
        ],
      },
      {
        topic: "MSW로 백엔드 독립 개발 환경 구성",
        context: ["백엔드 배포 대기 시 프론트 작업이 막힘."],
        rationale: [
          "백엔드 권한·정책 변경을 MSW 핸들러에서 시뮬레이션 → 백엔드 배포 대기 없이 프론트 독립 개발.",
          "백엔드 API 완성 시 핸들러 제거만으로 실서버 전환.",
        ],
      },
    ],
    troubleshooting: [
      {
        title: "무한 스크롤 API 500 에러 — offset 기반 페이지네이션 자동 폴백",
        problem: [
          "커서 기반 /posts/feed 무한 스크롤 API가 백엔드에서 막 구현된 시점이라 불안정 — 500 에러 지속 발생.",
          "피드 화면 자체가 깨지는 걸 막아야 했음.",
        ],
        cause: [
          "신규 커서 기반 피드 API의 안정화 전 상태.",
          "단일 API에 화면 전체가 묶여 있어 한 곳이 죽으면 피드 전체가 무너지는 구조였음.",
        ],
        solution: [
          "이미 안정 동작 중이던 offset 기반 /posts API를 폴백 경로로 활용.",
          "useInfiniteFeed의 onError에서 feedFailed=true 세팅 → isInfiniteMode = !therapyArea && activeTab === 'all' && !feedFailed 조건이 자동으로 꺼지며 기존 offset 모드로 전환.",
          "사용자에게는 \"최신 피드를 불러오지 못해 페이지 모드로 전환했어요\" 배너 표시.",
          "이후 React Query 도입 시 RQ 기본 retry: 3이 500 에러 이후 ~7초간 isError=false를 유지해 폴백이 지연되는 문제를 발견 → retry: false 명시로 즉시 전환 보장.",
        ],
        learning: [
          "타임라인: 폴백 구현(2026-04-15, 커스텀 훅 단계) → React Query 마이그레이션(2026-04-27) → retry: false 추가(2026-04-27).",
          "MVP 단계에서 과투자였을 수 있지만, API 한 곳이 죽었을 때 서비스 전체를 내리지 않고 degraded 상태로 유지하는 패턴을 직접 설계해본 경험.",
        ],
      },
      {
        title: "React Query staleTime 함정 — 뒤로가기 복원 깨짐",
        problem: [
          "initialData로 스냅샷 주입했는데 뒤로가기 직후 첫 페이지가 새 데이터로 덮힘.",
        ],
        cause: [
          "RQ 기본 staleTime=0 → 마운트 직후 백그라운드 refetch 발동 → initialData 덮어쓰기.",
        ],
        solution: ["staleTime: Infinity + refetchOnWindowFocus: false 명시."],
        learning: [
          'initialData는 "초기값"일 뿐, staleTime 없이는 즉시 stale로 간주됨.',
        ],
      },
      {
        title: "vite-prerender-plugin + React 19 빌드 hang",
        problem: ["vite build 완료 후 프로세스가 종료되지 않고 무한 대기."],
        cause: [
          "React 19 환경에서 react-dom/server 잔류 핸들이 Node.js 이벤트 루프를 붙잡음 (upstream Issue).",
        ],
        solution: [
          "Vite closeBundle 훅 + process.exit(0) 패턴으로 빌드 완료 시점에 프로세스 강제 종료.",
          "apply: 'build' + enforce: 'post' 조합으로 dev 서버에선 차단(HMR 보호), 모든 산출물 기록·다른 플러그인 cleanup이 끝난 마지막 시점에만 종료 신호.",
          "결과: prerender 산출물 3개 정상 생성, 로컬 빌드 9초 / Vercel 배포 14초로 안정화.",
        ],
        learning: [
          "잔여 risk 박제: process.exit(0)은 종료 코드 0을 무조건 반환하므로, 향후 closeBundle 이후 후속 hook(Sentry release 업로드, sourcemap 외부 전송 등)을 추가하면 그 작업을 silent하게 건너뛸 수 있음 — 새 plugin 도입 시 enforce 순서 재조정 필요.",
        ],
      },
      {
        title: "MIME 타입 불일치 — 한컴 PDF 업로드 400 에러",
        problem: ["특정 PDF 파일 업로드 시 400 에러."],
        cause: [
          "한컴 뷰어로 열어서 저장된 PDF의 MIME 타입이 application/haansoftpdf로 지정 → 백엔드 PDF validation 실패.",
        ],
        solution: [
          "new Blob([file], { type: 'application/pdf' })로 전송 전 MIME 강제 교체.",
        ],
        learning: [
          "파일 확장자와 실제 MIME 타입은 다를 수 있음. 업로드 전 클라이언트 단에서 정규화 필요.",
        ],
      },
      {
        title: "S3 이미지 다운로드 — 브라우저 CORS 에러",
        problem: ["S3 presigned URL로 파일 다운로드 시 브라우저에서 CORS 에러."],
        cause: [
          "이미지 미리보기를 위해 img 태그의 src 속성으로 origin 헤더 없이 GET 요청을 보냈는데, 브라우저가 그 응답을 캐싱 → 이후 다운로드 요청을 미리보기 요청의 응답(origin 헤더 없는 응답)과 같은 응답으로 반환 → 다운로드 요청 시점에 브라우저가 CORS 위반으로 차단.",
        ],
        solution: [
          "img 태그에 crossorigin 속성을 추가해 src 주소 GET 요청에 origin 헤더를 포함시킴.",
          "미리보기 요청과 다운로드 요청의 헤더 조건이 일치 → 캐시 응답이 CORS 조건을 만족.",
        ],
        learning: [
          "진단 과정: 다운로드가 미리보기 렌더링 직후에는 실패하고 일정 시간이 지나면 정상 작동하는 패턴을 보고 크롬의 동일 URL 응답 캐싱을 의심 → crossorigin 속성 추가로 가설 검증.",
        ],
      },
    ],
  },
];
