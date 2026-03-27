"use client";

import { ExternalLink, GitBranch } from "lucide-react";
import { projects } from "@/data/projects";
import FadeInSection from "@/components/ui/FadeInSection";

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        {/* 섹션 헤더 */}
        <p
          className="text-xs mb-3"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}
        >
          <span style={{ color: "var(--color-accent)" }}>//</span> Projects
        </p>
        <h2
          className="text-2xl font-bold mb-12"
          style={{ color: "var(--text-primary)" }}
        >
          프로젝트
        </h2>

        {/* 카드 그리드 */}
        <FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <div
      className="flex flex-col p-5 transition-all duration-200 group"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "6px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-accent-border)";
        e.currentTarget.style.boxShadow = "0 0 16px var(--color-accent-dim)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-color)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* 제목 */}
      <h3
        className="text-base font-semibold mb-3"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-jetbrains)" }}
      >
        {project.title}
      </h3>

      {/* 설명 */}
      <p
        className="text-sm leading-relaxed mb-4 flex-1"
        style={{ color: "var(--text-secondary)" }}
      >
        {project.description}
      </p>

      {/* 기술 태그 */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs"
            style={{
              fontFamily: "var(--font-jetbrains)",
              color: "var(--text-muted)",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "3px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 링크 */}
      <div className="flex gap-3">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs transition-colors duration-150"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <GitBranch size={12} />
            GitHub
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs transition-colors duration-150"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <ExternalLink size={12} />
            Demo
          </a>
        )}
      </div>
    </div>
  );
}
