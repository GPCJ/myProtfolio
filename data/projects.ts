export interface TechCategory {
  category: string;
  items: string[];
}

export interface Project {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  techStack?: TechCategory[];
  githubUrl?: string;
  demoUrl?: string;
}

export const projects: Project[] = [
  {
    title: "MelloMe",
    slug: "mellome",
    description:
      "발달장애 아동 치료사 커뮤니티 플랫폼. JWT 이중 토큰 보안 설계, Tiptap 기반 Rich Text Editor, 피그마 와이어프레임 기반 전체 UI를 프론트엔드 단독 개발.",
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Zustand", "Axios", "Vercel"],
    techStack: [
      { category: "Frontend", items: ["React", "TypeScript", "Vite", "Tailwind CSS"] },
      { category: "State", items: ["Zustand"] },
      { category: "Auth", items: ["JWT", "Google OAuth2"] },
      { category: "API", items: ["Axios"] },
      { category: "Tools", items: ["MSW", "Vercel"] },
    ],
    githubUrl: "https://github.com/GPCJ/MelloMe_FE_Backup",
    demoUrl: undefined,
  },
];
