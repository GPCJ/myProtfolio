# Vite + React Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `myProtfolio` 저장소의 Next.js를 제거하고 Vite + React + React Router v7 SPA로 마이그레이션. 디자인·기능은 동일 유지.

**Architecture:** in-place 5단계 커밋 — (1) 베이스라인 (2) Vite 스캐폴드 (Next와 공존) (3) 코드 이전·임포트 교체 (4) Next 제거 (5) 배포 검증. 라우트는 React Router v7의 `BrowserRouter`로 `/`, `/projects/:slug` 두 개만 구성.

**Tech Stack:** Vite, React 19, React Router v7, TypeScript 5, Tailwind v4 (`@tailwindcss/vite`), `@fontsource/inter`, `@fontsource/jetbrains-mono`, framer-motion, lucide-react.

**Spec:** `docs/superpowers/specs/2026-05-19-vite-react-migration-design.md`

**검증 방식:** 프로젝트에 테스트 프레임워크가 없고 도입도 비목표. 각 태스크의 검증은 `vite dev`/`vite build` 결과와 브라우저 수동 확인으로 수행.

---

## File Structure (최종 상태)

```
myProtfolio/
├── index.html                # 신규 (Vite 엔트리)
├── vite.config.ts            # 신규
├── tsconfig.json             # 수정 (Vite/React 기준)
├── tsconfig.node.json        # 신규 (vite.config 전용)
├── package.json              # 수정 (next 제거, vite/RR/@fontsource 추가)
├── eslint.config.mjs         # 수정 (next preset 제거)
├── public/                   # 변경 없음
└── src/
    ├── main.tsx              # 신규
    ├── App.tsx               # 신규
    ├── globals.css           # app/globals.css 이동 + 폰트 변수 추가
    ├── routes/
    │   ├── Home.tsx          # app/page.tsx 이전 (Server Component → 일반 컴포넌트)
    │   └── ProjectDetail.tsx # app/projects/[slug]/page.tsx 이전
    ├── components/           # components/ 이동 (변경 최소)
    │   ├── sections/         # Hero, Skills, Projects(useRouter→useNavigate), Career
    │   └── ui/               # Navbar, Footer, FadeInSection, ThemeToggle
    └── data/                 # data/ 이동 (변경 없음)

삭제: app/, next.config.ts, next-env.d.ts
```

`@/` alias → `./src`로 갱신 (이전: `./*`).

---

## Task 1: 베이스라인 커밋

**목적:** 마이그레이션 직전 안전한 롤백 지점 확보. 현재 uncommitted 상태인 작업(테마 토글 등)을 깔끔하게 커밋해둔다.

**Files:**
- Stage: 현재 modified된 모든 파일
- Skip: `.omc/` (untracked, 마이그레이션 범위 외이므로 그대로 둠)

- [ ] **Step 1: 현재 변경 사항 확인**

Run:
```bash
git status
git diff --stat
```
Expected: AGENTS.md, CLAUDE.md, README.md, app/*, components/*, data/*, eslint.config.mjs, next.config.ts, package*.json, postcss.config.mjs, tsconfig.json 등 modified.

- [ ] **Step 2: 명시적으로 modified 파일만 스테이징**

Run:
```bash
git add .gitignore AGENTS.md CLAUDE.md README.md \
        app components data \
        eslint.config.mjs next.config.ts postcss.config.mjs tsconfig.json \
        package.json package-lock.json
```
(`.omc/`는 스테이지하지 않음.)

- [ ] **Step 3: 커밋**

Run:
```bash
git commit -m "chore: baseline before Vite migration"
```
Expected: 커밋 성공, `[main <hash>] chore: baseline before Vite migration`.

- [ ] **Step 4: 워킹 트리 깨끗한지 확인**

Run:
```bash
git status
```
Expected: `nothing to commit, working tree clean` (단 `.omc/`는 untracked로 남아도 OK).

---

## Task 2: Vite + 의존성 스캐폴드 (Next와 공존)

**목적:** Vite/React Router v7/@fontsource를 설치하고 `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx` 플레이스홀더를 추가한다. **이 시점에 `app/`는 그대로 있고 Next도 그대로 동작**. Vite로도 빈 페이지가 뜨는지만 확인.

**Files:**
- Create: `vite.config.ts`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Modify: `package.json` (의존성만 추가, 스크립트는 그대로 둠)

- [ ] **Step 1: 의존성 설치**

Run:
```bash
npm install -D vite @vitejs/plugin-react @tailwindcss/vite
npm install react-router-dom @fontsource/inter @fontsource/jetbrains-mono
```
Expected: 설치 성공, peer dep 경고는 무시 가능.

- [ ] **Step 2: `vite.config.ts` 작성**

Create `vite.config.ts`:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 3: `tsconfig.node.json` 작성**

Create `tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: `index.html` 작성 (FOUC 방지 인라인 테마 스크립트 포함)**

Create `index.html`:
```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>진서현 | Portfolio</title>
    <meta name="description" content="개발자 진서현의 포트폴리오" />
    <script>
      (function(){try{if(localStorage.getItem('theme')==='light'){var v={'--bg-primary':'#f0f2f5','--bg-secondary':'#e8eaed','--bg-card':'#ffffff','--color-accent':'#006644','--color-accent-dim':'rgba(0,102,68,0.12)','--color-accent-border':'rgba(0,102,68,0.35)','--text-primary':'#0f0f0f','--text-secondary':'#4a4a4a','--text-muted':'#6b6b6b','--border-color':'#d0d0d0'};var r=document.documentElement;Object.keys(v).forEach(function(k){r.style.setProperty(k,v[k]);});}}catch(e){}})();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: `src/main.tsx` 플레이스홀더 작성**

Create `src/main.tsx`:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 6: `src/App.tsx` 플레이스홀더 작성**

Create `src/App.tsx`:
```tsx
export default function App() {
  return <div style={{ padding: 24, color: '#888' }}>Vite scaffold OK</div>;
}
```

- [ ] **Step 7: 파일이 `app/` 안에 안 들어가 있는지 그리고 favicon은 public에 있는지 확인**

Run:
```bash
ls public/favicon.ico || cp app/favicon.ico public/favicon.ico
ls src/
```
Expected: `public/favicon.ico` 존재. `src/`에 `main.tsx`, `App.tsx` 있음.

- [ ] **Step 8: Vite dev 서버로 플레이스홀더 확인**

Run:
```bash
npx vite
```
Expected: `Local: http://localhost:5173/` 출력. 브라우저에서 열면 "Vite scaffold OK" 텍스트가 보임. 콘솔에 에러 없음.

확인 후 Ctrl+C로 서버 종료.

- [ ] **Step 9: 커밋**

Run:
```bash
git add vite.config.ts tsconfig.node.json index.html src/ public/favicon.ico package.json package-lock.json
git commit -m "feat: scaffold Vite + React Router + @fontsource (coexists with Next)"
```

---

## Task 3: 코드 이전 + 임포트 교체

**목적:** `app/`/`components/`/`data/`를 `src/` 하위로 옮기고 모든 Next API를 React Router/@fontsource로 교체. 이 태스크 끝나면 Vite로 메인 페이지·상세 페이지가 풀 동작해야 함. (`app/`는 비어있어 Next 빌드는 깨지지만 다음 태스크에서 제거 예정.)

**Files:**
- Move: `components/` → `src/components/` (git mv)
- Move: `data/` → `src/data/` (git mv)
- Move: `app/globals.css` → `src/globals.css` (git mv)
- Create: `src/routes/Home.tsx`
- Create: `src/routes/ProjectDetail.tsx`
- Modify: `src/components/sections/Projects.tsx` (Next 임포트 교체)
- Modify: `src/main.tsx` (router, globals.css, fonts)
- Modify: `src/App.tsx` (실제 라우트)
- Modify: `src/globals.css` (폰트 family 정의 추가)
- Delete: `app/page.tsx`, `app/layout.tsx`, `app/projects/` (다음 태스크에서 디렉토리 자체 삭제)

- [ ] **Step 1: 디렉토리 이동**

Run:
```bash
git mv components src/components
git mv data src/data
git mv app/globals.css src/globals.css
```
Expected: 이동 성공, `git status`에서 renamed로 표시.

- [ ] **Step 2: `src/globals.css` 상단에 폰트 family 정의 추가**

Edit `src/globals.css` — `@import "tailwindcss";` 줄 바로 아래에 삽입:
```css
@import "tailwindcss";

:root {
  --font-inter: 'Inter', system-ui, sans-serif;
  --font-jetbrains: 'JetBrains Mono', ui-monospace, monospace;
}
```
(기존 `:root { --bg-primary... }` 블록은 그 아래에 그대로 둔다. CSS는 같은 셀렉터를 여러 번 선언해도 머지된다.)

- [ ] **Step 3: `src/main.tsx`를 실제 라우터·CSS·폰트로 교체**

Replace contents of `src/main.tsx`:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './globals.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

- [ ] **Step 4: `src/routes/Home.tsx` 생성 (구 `app/page.tsx`)**

Create `src/routes/Home.tsx`:
```tsx
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Hero from '@/components/sections/Hero';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Career from '@/components/sections/Career';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="md:flex">
        <aside
          id="hero"
          className="md:w-1/3 md:sticky md:top-0 md:h-screen flex flex-col justify-between px-10 lg:px-16 py-16 md:border-r"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <Hero />
          <nav>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Skills', href: '#skills' },
                { label: 'Projects', href: '#projects' },
                { label: 'Career', href: '#career' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm transition-colors duration-200 hover:text-[var(--color-accent)]"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="md:w-2/3">
          <Skills />
          <Projects />
          <Career />
          <Footer />
        </main>
      </div>
    </>
  );
}
```

- [ ] **Step 5: `src/routes/ProjectDetail.tsx` 생성 (구 `app/projects/[slug]/page.tsx`)**

Create `src/routes/ProjectDetail.tsx`:
```tsx
import { Link, useParams } from 'react-router-dom';
import { projects } from '@/data/projects';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-10"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <div className="text-center">
          <h1 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-jetbrains)' }}>
            404 — Project Not Found
          </h1>
          <Link
            to="/#projects"
            className="text-sm"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
          >
            ← 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-10 lg:px-24 py-16"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      <Link
        to="/#projects"
        className="inline-flex items-center gap-2 text-sm mb-12 transition-colors duration-150"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}
      >
        ← 돌아가기
      </Link>

      <h1
        className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight"
        style={{ fontFamily: 'var(--font-jetbrains)' }}
      >
        {project.title}
      </h1>

      <div className="flex flex-col gap-3 mb-16">
        {(
          project.techStack ??
          project.tags.map((t) => ({ category: '', items: [t] }))
        ).map(({ category, items }) => (
          <div key={category} className="flex items-start gap-4">
            <span
              className="text-xs w-20 shrink-0 pt-1.5"
              style={{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-jetbrains)',
                letterSpacing: '0.05em',
              }}
            >
              {category}
            </span>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 text-sm"
                  style={{
                    fontFamily: 'var(--font-jetbrains)',
                    color: 'var(--color-accent)',
                    backgroundColor: 'var(--color-accent-dim)',
                    borderRadius: '3px',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="py-24 text-center"
        style={{
          border: '1px dashed var(--border-color)',
          borderRadius: '6px',
          color: 'var(--text-muted)',
        }}
      >
        <p style={{ fontFamily: 'var(--font-jetbrains)' }}>준비 중</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: `src/App.tsx`를 실제 라우트와 ThemeToggle로 교체**

Replace contents of `src/App.tsx`:
```tsx
import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import ProjectDetail from './routes/ProjectDetail';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
      </Routes>
      <ThemeToggle />
    </>
  );
}
```

- [ ] **Step 7: `src/components/sections/Projects.tsx`의 Next 임포트 교체**

Edit `src/components/sections/Projects.tsx`:

찾을 부분 (line 1–3):
```tsx
"use client";

import { useRouter } from "next/navigation";
```

교체:
```tsx
import { useNavigate } from "react-router-dom";
```

찾을 부분 (ProjectCard 함수 내부, line 40 부근):
```tsx
  const router = useRouter();
```
교체:
```tsx
  const navigate = useNavigate();
```

찾을 부분:
```tsx
      onClick={() => router.push(`/projects/${project.slug}`)}
```
교체:
```tsx
      onClick={() => navigate(`/projects/${project.slug}`)}
```

- [ ] **Step 8: `src/components/ui/ThemeToggle.tsx`에서 `"use client"` 줄 제거**

Edit `src/components/ui/ThemeToggle.tsx`:

찾을 부분 (line 1–2):
```tsx
"use client";

import { useEffect, useState } from "react";
```
교체:
```tsx
import { useEffect, useState } from "react";
```

- [ ] **Step 9: 나머지 컴포넌트의 `"use client"` 지시문 일괄 제거 (있다면)**

Run:
```bash
grep -rln '"use client"' src/ || echo "no use client directives left"
```
Expected: 결과가 비었거나 "no use client directives left". 만약 결과가 있으면 해당 파일의 첫 줄 `"use client";` 와 그 다음 빈 줄을 제거.

- [ ] **Step 10: TypeScript `paths` alias를 `./src/*`로 갱신**

Edit `tsconfig.json`:

찾을 부분:
```json
    "paths": {
      "@/*": ["./*"]
    }
```
교체:
```json
    "paths": {
      "@/*": ["./src/*"]
    }
```

(나머지 tsconfig 정리는 Task 4에서 한다.)

- [ ] **Step 11: Vite dev 서버 띄우고 수동 검증**

Run:
```bash
npx vite
```
브라우저에서 `http://localhost:5173`을 열고 다음을 확인:

- [ ] `/` (메인) — Hero/Skills/Projects/Career 네 섹션이 그대로 보인다
- [ ] 좌측 nav의 `Skills`, `Projects`, `Career` 앵커 클릭 시 스무스 스크롤
- [ ] 프로젝트 카드 클릭 시 `/projects/<slug>`로 이동, 페이지가 정상 렌더
- [ ] 상세 페이지의 "← 돌아가기" → `/#projects`로 복귀
- [ ] 우상단 테마 토글 클릭 시 라이트/다크 즉시 전환, 새로고침 후에도 유지
- [ ] 새로고침 시 FOUC(빈 깜빡임) 없음
- [ ] 폰트가 Inter (본문) / JetBrains Mono (코드 느낌)로 적용됨
- [ ] framer-motion `FadeInSection` 페이드인 동작
- [ ] 콘솔에 에러 없음

확인 후 Ctrl+C로 서버 종료.

- [ ] **Step 12: 커밋**

Run:
```bash
git add -A
git commit -m "feat: migrate routes/components/data to src/, replace Next APIs"
```

---

## Task 4: Next.js 제거

**목적:** `app/`, `next.config.ts`, `next-env.d.ts`, Next 패키지, Next 관련 설정을 모두 걷어낸다. `package.json` 스크립트를 Vite로 교체. 빌드와 미리보기가 동작하는 것까지 확인.

**Files:**
- Delete: `app/` (디렉토리 전체)
- Delete: `next.config.ts`
- Delete: `next-env.d.ts` (있다면)
- Delete: `postcss.config.mjs` (Tailwind v4는 `@tailwindcss/vite` 플러그인으로 대체)
- Modify: `package.json` (next/eslint-config-next 제거, scripts 교체)
- Modify: `tsconfig.json` (Next plugin/include 정리)
- Modify: `eslint.config.mjs` (next preset 제거)
- Modify: `.gitignore` (.next 등 Next 산출물 항목 제거, dist 추가)

- [ ] **Step 1: `app/`, `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs` 삭제**

Run:
```bash
rm -rf app next.config.ts next-env.d.ts postcss.config.mjs
```
Expected: 에러 없이 삭제.

- [ ] **Step 2: Next 의존성 제거**

Run:
```bash
npm uninstall next eslint-config-next @tailwindcss/postcss
```
Expected: `package.json`에서 해당 항목 사라짐.

- [ ] **Step 3: `package.json` scripts를 Vite로 교체**

Edit `package.json` — `"scripts"` 블록을 다음으로 교체:
```json
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint"
  },
```

- [ ] **Step 4: `tsconfig.json`을 Vite/React 기준으로 갱신**

Replace contents of `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "vite.config.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 5: `eslint.config.mjs`를 Next 의존성 없이 갱신**

Replace contents of `eslint.config.mjs`:
```js
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  globalIgnores(["dist/**", "node_modules/**"]),
]);

export default eslintConfig;
```
(린트 규칙은 추후에 보강해도 됨. 일단 빌드 막히지 않도록 최소만.)

- [ ] **Step 6: `.gitignore`에서 Next 산출물 정리, `dist/` 추가**

Edit `.gitignore` — 다음 항목이 있으면 제거: `.next`, `out`, `next-env.d.ts`.
다음 줄이 없으면 추가:
```
dist
```

- [ ] **Step 7: 빌드 확인**

Run:
```bash
npm run build
```
Expected: TypeScript 에러 없음, `vite build`가 `dist/` 출력. 마지막 줄에 `✓ built in <시간>` 비슷한 메시지.

- [ ] **Step 8: `vite preview`로 프로덕션 번들 수동 검증**

Run:
```bash
npm run preview
```
브라우저에서 출력된 URL(보통 `http://localhost:4173`)을 열어:

- [ ] `/` 정상 렌더
- [ ] `/projects/<실제 slug>`로 직접 URL 접근해도 페이지 렌더 (preview는 SPA fallback 처리)
- [ ] 새로고침 시에도 페이지 유지
- [ ] 콘솔 에러 없음

확인 후 Ctrl+C.

- [ ] **Step 9: dev 모드 한 번 더 확인**

Run:
```bash
npm run dev
```
Expected: 5173에서 정상 동작. Ctrl+C로 종료.

- [ ] **Step 10: 커밋**

Run:
```bash
git add -A
git commit -m "chore: remove Next.js, switch package scripts/tsconfig/eslint to Vite"
```

---

## Task 5: Vercel 배포 검증 + (필요 시) SPA fallback 추가

**목적:** Vercel preview에서 직접 URL 접근 시 SPA fallback이 동작하는지 검증. 안 되면 `vercel.json`을 추가.

**Files:**
- Conditionally create: `vercel.json` (오직 SPA fallback이 자동으로 안 잡힐 때)

- [ ] **Step 1: 원격 push**

Run:
```bash
git push origin main
```
Expected: Vercel이 자동 빌드 시작. 대시보드 또는 GitHub 코멘트에서 preview URL 확인.

- [ ] **Step 2: Vercel preview URL에서 SPA fallback 검증**

Vercel preview URL을 열고:

- [ ] `/` 접근 → 정상 렌더
- [ ] `/projects/<실제 slug>` **직접 URL 입력** → 정상 렌더 (404가 아니어야 함)
- [ ] 그 페이지에서 새로고침 → 여전히 렌더

모두 OK면 **Step 4로 건너뜀**.

- [ ] **Step 3: (Step 2가 404를 보일 때만) `vercel.json` 추가**

Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Run:
```bash
git add vercel.json
git commit -m "fix: add SPA rewrite fallback for Vercel"
git push origin main
```

Vercel 빌드 후 다시 Step 2의 체크리스트 확인.

- [ ] **Step 4: 마이그레이션 완료**

Run:
```bash
git log --oneline -10
```
Expected: 다음과 같은 커밋들이 보임:
```
<hash> fix: add SPA rewrite fallback for Vercel        (있을 수도, 없을 수도)
<hash> chore: remove Next.js, switch package scripts/tsconfig/eslint to Vite
<hash> feat: migrate routes/components/data to src/, replace Next APIs
<hash> feat: scaffold Vite + React Router + @fontsource (coexists with Next)
<hash> chore: baseline before Vite migration
<hash> docs: add Vite + React migration design spec
```

`package.json`에 `next` 항목이 없는 것 확인:
```bash
grep -E '"next"' package.json || echo "no next dependency — migration complete"
```
Expected: `no next dependency — migration complete`.

---

## 롤백 절차

문제가 생기면 단계별로 되돌릴 수 있다.

- 가장 안전: `git reset --hard <Task 1의 베이스라인 커밋 hash>` — 전체 마이그레이션 되돌리고 베이스라인으로 복귀. **확신이 있을 때만** 실행.
- 직전 단계만 되돌리기: `git reset --hard HEAD~1`.

베이스라인 hash는 Task 1 직후 `git log --oneline -3`으로 확인해두면 좋다.
