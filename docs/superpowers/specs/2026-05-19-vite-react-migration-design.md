# Vite + React 마이그레이션 디자인

- **날짜**: 2026-05-19
- **대상 저장소**: `myProtfolio` (개인 포트폴리오)
- **현 스택**: Next.js 16.2.1 (App Router), React 19.2.4, Tailwind v4, framer-motion, lucide-react, TypeScript 5
- **목표**: Next.js를 제거하고 Vite + React + React Router v7로 마이그레이션. 모든 기능과 디자인은 동일 유지.

## 동기

Next.js를 깊게 이해하지 못한 상태로 사용한 것이 면접·코드 리뷰에서 약점이 될 우려가 있고, 포트폴리오 사이트 특성상 SSR/SSG의 실익이 작다고 판단. Next.js는 별도의 개인 블로그 프로젝트에서 제대로 학습할 계획.

## 결정 사항

| 항목 | 결정 |
|---|---|
| 배포 타깃 | Vercel 유지 |
| 라우터 | React Router v7 (`BrowserRouter`) |
| 폰트 처리 | `@fontsource/inter`, `@fontsource/jetbrains-mono` |
| 빌드 도구 | Vite |
| 마이그레이션 방식 | in-place, 단계별 커밋 |
| SSG/prerender | 도입하지 않음 (SPA) |

## 타겟 프로젝트 구조

```
myProtfolio/
├── index.html              # Vite 엔트리 (메타 태그, 인라인 테마 스크립트 포함)
├── vite.config.ts          # Vite 설정 (@ alias)
├── tsconfig.json           # Vite/React 기준
├── tsconfig.node.json      # vite.config 전용
├── package.json            # next 제거, vite/react-router-dom/@fontsource 추가
├── public/                 # 그대로
└── src/
    ├── main.tsx            # createRoot + BrowserRouter
    ├── App.tsx             # 라우트 정의 + ThemeToggle 마운트
    ├── globals.css         # 기존 그대로 이동, @fontsource import 추가
    ├── routes/
    │   ├── Home.tsx        # 기존 app/page.tsx
    │   └── ProjectDetail.tsx  # 기존 app/projects/[slug]/page.tsx
    ├── components/         # 기존 components/ 그대로 이동 (ui/, sections/)
    └── data/               # 기존 data/ 그대로 이동
```

제거 대상: `app/`, `next.config.ts`

## Next API → 대체 매핑

| Next | 대체 | 위치 |
|---|---|---|
| `next/font/google` (Inter, JetBrains_Mono) | `@fontsource/inter`, `@fontsource/jetbrains-mono` import + CSS 변수 (`--font-inter`, `--font-jetbrains`)는 `globals.css`에서 직접 정의 | `globals.css`, `main.tsx` |
| `next/link`의 `<Link href="/#projects">` | `react-router-dom`의 `<Link to="/#projects">` | `ProjectDetail.tsx` |
| `useRouter().push(...)` | `useNavigate()` | `components/sections/Projects.tsx` |
| `notFound()` | 컴포넌트 내 조건부 렌더 또는 `<Navigate to="/404" replace />` | `ProjectDetail.tsx` |
| `app/layout.tsx`의 `metadata` export | `index.html`의 `<title>`, `<meta name="description">` | `index.html` |
| 인라인 테마 부트스트랩 스크립트 | `index.html` `<head>` 인라인 (FOUC 방지) | `index.html` |
| `app/page.tsx` (Server Component) | `src/routes/Home.tsx` (일반 함수 컴포넌트) | — |
| `app/projects/[slug]/page.tsx` | `src/routes/ProjectDetail.tsx` (`useParams<{ slug: string }>()`) | — |
| `@/` 절대 import | `vite.config.ts`의 `resolve.alias` + `tsconfig.json`의 `paths`로 동일 유지 | — |

## 단계별 커밋 시퀀스

1. **베이스라인 커밋**: 현재 uncommitted 변경(테마 토글 등) 커밋. 마이그레이션 직전 안전한 롤백 지점 확보.
2. **Vite 스캐폴드 커밋**: `vite`, `@vitejs/plugin-react`, `react-router-dom`, `@fontsource/inter`, `@fontsource/jetbrains-mono` 설치. `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx` 추가. 이 시점에선 Next와 공존 (빌드는 아직 안 함).
3. **이전 + 임포트 교체 커밋**: `app/page.tsx` → `src/routes/Home.tsx`, `app/projects/[slug]/page.tsx` → `src/routes/ProjectDetail.tsx`, `components/`/`data/`/`globals.css` → `src/` 하위로 이동. Next 임포트(`next/link`, `next/navigation`, `next/font/google`) 모두 교체. `npm run dev`(Vite)로 로컬 동작 확인.
4. **Next 제거 커밋**: `next`, `eslint-config-next` 패키지 제거, `next.config.ts`, `app/` 삭제. `package.json` 스크립트를 `vite` / `vite build` / `vite preview`로 교체. `tsconfig.json`을 Vite/React 표준으로 갱신.
5. **배포 검증 커밋**: Vercel preview 배포 후 SPA fallback이 정상 작동하는지 확인. 필요 시 `vercel.json`에 rewrite 한 줄 추가.

## 빌드 & 배포

- **로컬 dev**: `npm run dev` → `http://localhost:5173`
- **빌드**: `npm run build` → `dist/`
- **Vercel**: Framework Preset "Vite" 자동 인식, Output Directory `dist`. SPA fallback 미적용 시 `vercel.json`:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```

## 검증 체크리스트

각 단계 커밋 직후 수동으로 확인:

- [ ] 커밋 3 후: 메인(`/`) 렌더, Hero/Skills/Projects/Career 섹션 정상, 앵커 스크롤(`#skills` 등) 동작
- [ ] 커밋 3 후: `/projects/<slug>` 진입, 뒤로가기(`/#projects`) 동작, 존재하지 않는 slug 시 404 처리
- [ ] 커밋 3 후: 테마 토글(라이트/다크) 즉시 반영, 새로고침 후에도 FOUC 없음
- [ ] 커밋 3 후: framer-motion 애니메이션(`FadeInSection`) 정상
- [ ] 커밋 3 후: 폰트(Inter, JetBrains Mono) 적용 — `var(--font-jetbrains)`를 참조하는 곳들 확인
- [ ] 커밋 5 후: Vercel preview에서 `/projects/<slug>` 직접 URL 접근 새로고침 시 404 안 뜸

## 위험 요소

- **테마 FOUC**: 기존 `app/layout.tsx`의 인라인 스크립트는 `<body>` 렌더 전에 실행되어야 함. `index.html`의 `<head>` 안에 그대로 옮기면 동작.
- **`'use client'` 지시문**: Vite에선 의미 없음. 동작에는 영향 없지만 정리하면 깔끔.
- **`async function Page({ params })`**: Server Component 시그니처. 동기 함수 + `useParams<{ slug: string }>()`로 변환.
- **이미지 처리**: 현재 `next/image` 미사용 — 추가 작업 불필요.
- **`@/` alias**: Vite alias와 tsconfig `paths` 양쪽 모두 설정해야 IDE·빌드 둘 다 동작.

## 비목표

- SSG/prerender 도입 (포트폴리오 SEO 가치 낮음 판단)
- 디자인 변경, 신규 기능 추가 (마이그레이션 외 일체 손대지 않음)
- 테스트 프레임워크 도입 (현재 테스트 없음, 마이그레이션 범위에서 제외)
- 별도 블로그 기능 (별도 프로젝트로 분리)
