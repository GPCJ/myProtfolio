"use client";

import { GitBranch, Mail, BookOpen } from "lucide-react";
import { hero } from "@/data/hero";

export default function Footer() {
  const links = [
    { label: "GitHub", href: hero.links.github, icon: GitBranch, show: !!hero.links.github },
    { label: "Email", href: `mailto:${hero.links.email}`, icon: Mail, show: !!hero.links.email },
    {
      label: "Blog",
      href: (hero.links as { blog?: string }).blog ?? "",
      icon: BookOpen,
      show: !!(hero.links as { blog?: string }).blog,
    },
  ].filter((l) => l.show);

  return (
    <footer
      className="py-10 px-6 text-center"
      style={{ borderTop: "1px solid var(--border-color)" }}
    >
      {/* 소셜 링크 */}
      <div className="flex justify-center gap-5 mb-4">
        {links.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={label !== "Email" ? "_blank" : undefined}
            rel="noopener noreferrer"
            aria-label={label}
            className="transition-colors duration-200"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <Icon size={16} />
          </a>
        ))}
      </div>

      {/* 카피라이트 */}
      <p
        className="text-xs"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}
      >
        © {new Date().getFullYear()} {hero.name}
      </p>
    </footer>
  );
}
