export interface SkillCategory {
  category: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  {
    category: "Language",
    items: ["TypeScript", "JavaScript"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Vite", "Tailwind CSS", "shadcn/ui"],
  },
  {
    category: "State / Auth",
    items: ["Zustand", "React Router", "JWT", "Google OAuth2"],
  },
  {
    category: "API / Tools",
    items: ["Axios", "MSW", "Docker", "Vercel", "AWS EC2"],
  },
];
