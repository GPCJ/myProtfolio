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
    items: ["React", "Next.js", "Tailwind CSS", "shadcn/ui"],
  },
  {
    category: "State",
    items: ["Zustand"],
  },
  {
    category: "HTTP",
    items: ["Axios"],
  },
  {
    category: "Deploy",
    items: ["Vercel"],
  },
];
