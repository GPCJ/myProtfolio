# Mellti 프로젝트 콘텐츠 채우기 + Hero 태그라인 재작성 설계

날짜: 2026-05-20
범위: `src/data/projects.ts`, `src/routes/ProjectDetail.tsx`, `src/data/hero.ts`, `public/projects/mellti/`(신규)

## 배경

Vite + React 마이그레이션이 끝났지만 콘텐츠는 마이그레이션 이전 상태 그대로다.

- `projects.ts`에는 한 줄 설명만 있고, 상세 페이지는 "준비 중" 자리표시자
- 사용자는 면접 준비 중이며, 채용 담당자가 카드 → 상세 페이지로 들어왔을 때 비어 있으면 인상이 나빠짐
- 사용자 본인이 노션에 정리해둔 컨텍스트 문서(`포트폴리오context.txt`)를 콘텐츠 원본으로 사용 — 본인이 면접에서 직접 설명할 수 있는 내용임이 보장됨
- 브랜드명이 **MelloMe → Mellti** 로 변경되어 표시명과 슬러그 모두 교체 필요
- Hero 태그라인은 직관으로 적은 문구라 근거가 약함. 프로젝트 콘텐츠를 먼저 채워 본인 캐릭터를 드러내고, 그 결과를 토대로 태그라인을 재작성

## 목표

1. 브랜드명을 Mellti로 통일하고 URL slug도 `mellti`로 변경한다
2. 카드 설명을 노션 컨텍스트의 A안 3문장 구조로 교체한다
3. 상세 페이지에 주요 기능 / 기술적 의사결정 / 트러블슈팅 & 회고 세 섹션을 노션 컨텍스트 원문 기반으로 채운다
4. 채워진 Mellti 콘텐츠를 근거로 Hero `tagline`을 재작성한다

## 비목표

- 다른 프로젝트(이 포폴 사이트 자체 포함) 추가 — 별도 작업
- Skills / Career 섹션 최신화 — 별도 작업
- 상세 페이지에 "개요·역할·기간·팀 구성" 별도 섹션 — 사용자가 의도적으로 제외 (역할/팀은 카드 설명 A안 문장에 녹임)
- GitHub 레포명 변경(`MelloMe_FE_Backup`) — 실제 원격 레포명이라 URL은 그대로 유지
- 스크린샷 실제 파일 추가 — 디렉토리만 자리잡고 사용자가 추후 직접 채움

## 설계

### 1. 데이터 스키마 확장 — `src/data/projects.ts`

기존 `Project` 인터페이스를 유지하면서 옵셔널 필드 3개를 추가한다. 다른 프로젝트에서는 비어 있어도 동작해야 하므로 모두 옵셔널.

```ts
export interface Feature {
  title: string;
  description: string;
  screenshot?: string; // 예: "/projects/mellti/login.png" — public/ 기준 절대경로
}

export interface Decision {
  topic: string;       // 한눈에 보이는 결정 제목
  context: string;     // 배경 / 무엇이 문제였는가
  rationale: string;   // 어떻게 결정했고 왜 그게 옳은가
  result?: string;     // (선택) 결과 / 트레이드오프
}

export interface Troubleshooting {
  problem: string;     // 현상
  cause: string;       // 원인 분석
  solution: string;    // 해결책
  learning?: string;   // (선택) 학습 / 한계 박제
}

export interface Project {
  // 기존 필드
  title: string;
  slug: string;
  description: string;
  tags: string[];
  techStack?: TechCategory[];
  githubUrl?: string;
  demoUrl?: string;
  // 신규
  features?: Feature[];
  decisions?: Decision[];
  troubleshooting?: Troubleshooting[];
}
```

스크린샷 경로는 Vite가 `public/`을 그대로 서빙하므로 `/projects/mellti/<파일명>` 형식의 절대경로를 사용한다. 파일이 없어도 컴포넌트는 깨지지 않도록 옵셔널.

`Decision`에 `result` 필드를 추가한 이유: 노션 컨텍스트의 React Query 의사결정 항목에 "결과: production 검증 통과" 같은 결과 한 줄이 따로 정리되어 있어, context/rationale와 구분되는 별도 라인이 필요.

### 2. MelloMe → Mellti 브랜드 교체 — `src/data/projects.ts`

- `title`: `MelloMe` → `Mellti`
- `slug`: `mellome` → `mellti`
- `demoUrl`: `https://www.melonnetherapists.com` 추가 (현재 `undefined`)
- `githubUrl`: 그대로 유지 (`MelloMe_FE_Backup`은 실제 원격 레포명)

slug 변경으로 기존 URL `/projects/mellome` 은 404가 되지만, 외부 공유한 적 없는 사이드 프로젝트라 리다이렉트 불필요.

### 3. 카드 설명 — A안 3문장 교체

`description` 필드를 노션 컨텍스트의 A안으로 교체:

```
발달장애 아동 치료사들이 임상 고민을 나누는 커뮤니티 서비스 (실 배포).
React Query 무한 스크롤·뒤로가기 복원, 낙관적 업데이트, PC/모바일 UX 분기 설계.
7인 팀(FE 1·BE 2·CE 2·PD 1·PM 1)에서 디자이너 시안 기반 프론트엔드 구현부터 Vercel 배포까지 단독 담당.
```

카드 컴포넌트(`src/components/sections/Projects.tsx`)는 줄바꿈을 그대로 렌더하지 않으므로(현재 `<p>` 단일 블록), 카드에서는 한 문단으로 합쳐 보이고 상세 페이지 헤더에서만 줄바꿈 보존이 필요. 카드는 그대로 두고 상세 페이지에서 `description`을 `\n` 기준 분리해 줄별로 렌더한다.

### 4. techStack 카테고리 재정리

노션 컨텍스트의 기술 스택 표 기준으로 교체:

```ts
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
]
```

카드용 `tags`는 표시 공간이 좁아 핵심만 추림:

```ts
tags: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Zustand", "React Query", "MSW", "Vercel"]
```

### 5. 상세 페이지 재구성 — `src/routes/ProjectDetail.tsx`

기존 헤더(제목 + techStack)와 뒤로가기 링크는 유지. "준비 중" 자리표시자를 제거하고 그 자리에 3개 섹션 + 카드 설명(헤더 아래 줄별 렌더)을 추가.

레이아웃 스케치:

```
← 돌아가기

Mellti                           (기존 헤더)
[techStack 카테고리별 뱃지들]

[설명 3문장 — 줄별 렌더, demoUrl 링크 강조]

// Features
주요 기능
  ▸ 회원가입 / 로그인 — JWT 이중 토큰 (AT body + RT httpOnly Cookie)
  ▸ 치료사 인증 — 면허증 제출 → 즉시 권한 부여 (MVP 정책)
  ... (10개)

// Decisions
기술적 의사결정
  ▸ React Query useInfiniteQuery 도입
      Context / Rationale / Result
  ▸ 댓글 리액션 B 패턴 (페이지 레벨 단일 진실)
  ▸ PC 모달 / 모바일 라우트 분기
  ▸ MSW로 백엔드 독립 개발 환경

// Troubleshooting
트러블슈팅 & 회고
  ▸ 댓글 중복 POST — IME 이중 발화 방어
      Problem / Cause / Solution / Learning
  ▸ React Query staleTime 함정 — 뒤로가기 복원 깨짐
  ▸ vite-prerender-plugin + React 19 빌드 hang
  ▸ MIME 타입 불일치 — 한컴 PDF 업로드 400 에러
  ▸ S3 다운로드 — axios 인터셉터 + presigned URL 충돌
```

각 항목 본문은 노션 컨텍스트의 원문 그대로 사용 (사용자 본인 표현 보존). 면접에서 본인이 말로 옮길 수 있는 문장이라는 점이 핵심.

스타일은 기존 컨벤션 유지:
- 섹션 헤더: `// section-name` 라벨 (jetbrains 폰트, muted)
- 큰 제목: `text-primary`
- 본문: `text-secondary`
- 카테고리/메타: `text-muted`
- 강조/링크: `--color-accent`
- 섹션 진입 시 `FadeInSection`

각 섹션은 해당 배열이 비어 있거나 `undefined`면 통째로 렌더하지 않는다.

내부 컴포넌트 분할: `ProjectDetail.tsx` 안에 `FeatureBlock`, `DecisionBlock`, `TroubleshootingBlock` 세 개의 내부 컴포넌트로 분리(같은 파일 내). 라우트 전용 코드라 파일을 쪼개진 않음.

스크린샷은 모든 Feature 항목에서 옵셔널이며, 사용자가 추후 `public/projects/mellti/` 에 파일을 두고 `screenshot: "/projects/mellti/<파일명>"` 만 채우면 자동으로 렌더되도록 컴포넌트 측에서 지원.

### 6. 스크린샷 보관소 — `public/projects/mellti/`

새 디렉토리를 만들어 `.gitkeep` 한 줄만 두고 시작. 사용자가 추후 직접 스크린샷 파일을 추가.

### 7. Hero 태그라인 재작성 — `src/data/hero.ts`

위 1~6이 끝난 뒤 마지막 단계.

1. 채워진 Mellti 콘텐츠(features / decisions / troubleshooting)를 종합해서, **"Mellti에서 드러난 너는 어떤 개발자인가" 한 줄 평가**를 제시한다. 평가에는 콘텐츠 어느 부분이 근거인지 인용을 붙인다.
   - 노션 컨텍스트에서 보이는 패턴 후보:
     - 트러블슈팅 5건 모두 "현상 → 원인 좁히기 → 해결 → 학습" 구조 — 디버깅 원칙주의자
     - 댓글 리액션 B 패턴 / RQ staleTime 함정 — 진실 출처 / 캐시 모델을 의식하는 사고
     - PC 모달 vs 모바일 라우트 / IME 이중 발화 — 사용자 환경의 디테일을 코드로 박제
     - 직접 작성한 abort 패턴을 useInfiniteQuery로 교체 — 직접 만든 코드를 버릴 줄 아는 판단력
   - 위 후보 중 1~2개를 한 줄로 압축
2. 평가를 근거로 `tagline` 후보 2~3개를 만들어 보여준다. 현재 태그라인 `"왜를 먼저 묻고, 그다음을 만듭니다"`도 비교 대상으로 함께 둔다.
3. 사용자가 고르거나 직접 수정한 문구를 `hero.tagline`에 반영.

`hero.ts`의 다른 필드(name, position, links)는 손대지 않는다.

## 변경 파일 정리

| 파일 | 변경 내용 |
|---|---|
| `src/data/projects.ts` | 인터페이스 확장 + Mellti 콘텐츠 전체 채움(title/slug/description/tags/techStack/demoUrl/features/decisions/troubleshooting) |
| `src/routes/ProjectDetail.tsx` | "준비 중" 자리표시자 제거 + description 줄별 렌더 + 3개 섹션 렌더 추가 |
| `src/data/hero.ts` | `tagline` 문자열 교체 |
| `public/projects/mellti/.gitkeep` | 신규 (스크린샷 보관소 자리잡기) |
| `src/components/sections/Projects.tsx` | 변경 없음 |

## 검증

- `npm run build` 성공 (TypeScript 타입 검증 포함)
- `npm run dev` 후 브라우저에서:
  - 메인 페이지 카드: 제목 `Mellti`, 새 description 보임, tags 8개 보임
  - 카드 클릭 → `/projects/mellti` 로 이동, 상세 페이지 정상 렌더
  - 헤더 아래 description 3문장이 줄바꿈으로 보임 (demoUrl 링크 클릭 가능)
  - Features / Decisions / Troubleshooting 3개 섹션이 순서대로 보임
  - 빈 섹션은 렌더되지 않음 (스크린샷이 비어 있어도 텍스트만 보임)
  - Hero 영역의 태그라인이 새 문구로 바뀜
- 404 경로(`/projects/없는슬러그`)는 기존처럼 404 화면
- 기존 `/projects/mellome` 도 404 (의도된 결과)

## 위험 / 주의

- **콘텐츠 변형 위험**: 노션 원문에서 의미를 미묘하게 바꾸면 면접에서 사용자가 본인 말로 변환할 때 어색해짐. 원문 표현(예: "한계 박제", "단일 진실", "B 패턴") 그대로 사용.
- **태그라인 추상화 함정**: "왜를 먼저 묻고…"처럼 어떤 개발자든 갖다 붙일 수 있는 문구가 되지 않도록, 후보를 만들 때 반드시 Mellti 콘텐츠 안의 구체 사례를 1~2개 인용한다.
- **slug 변경의 사이드이펙트**: 기존 `/projects/mellome` 외부 공유 링크가 있다면 깨짐. 사용자 확인 결과 외부 공유 이력 없음 → 리다이렉트 미설치로 진행.
- 스크린샷 경로 오타는 빌드가 잡지 못한다 (런타임 404). 사용자가 스크린샷을 추가하는 시점에 브라우저에서 직접 확인.
