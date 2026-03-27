export interface Project {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export const projects: Project[] = [
  {
    title: "MelloMe",
    description:
      "발달장애 아동 치료사 커뮤니티 플랫폼. JWT 이중 토큰 보안 설계, Tiptap 기반 Rich Text Editor, 피그마 와이어프레임 기반 전체 UI를 프론트엔드 단독 개발.",
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Zustand", "Axios", "Vercel"],
    githubUrl: "https://github.com/GPCJ/MelloMe_FE_Backup",
    demoUrl: undefined,
  },
];
