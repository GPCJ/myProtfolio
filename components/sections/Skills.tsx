import { skills } from "@/data/skills";
import FadeInSection from "@/components/ui/FadeInSection";

export default function Skills() {
  return (
    <section id="skills" className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* 섹션 헤더 */}
        <FadeInSection>
          <p
            className="text-xs mb-3"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}
          >
            <span style={{ color: "var(--color-accent)" }}>//</span> Skills
          </p>
          <h2
            className="text-3xl font-bold mb-8"
            style={{ color: "var(--text-primary)" }}
          >
            기술 스택
          </h2>
        </FadeInSection>

        {/* 카테고리별 목록 */}
        <div className="flex flex-col gap-6">
          {skills.map(({ category, items }, i) => (
            <FadeInSection key={category} delay={i * 0.08}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                {/* 카테고리 레이블 */}
                <span
                  className="text-sm w-28 shrink-0 pt-1"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-jetbrains)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {category}
                </span>

                {/* 뱃지 목록 */}
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="px-4 py-1.5 text-sm"
                      style={{
                        fontFamily: "var(--font-jetbrains)",
                        color: "var(--color-accent)",
                        backgroundColor: "var(--color-accent-dim)",
                        border: "1px solid var(--color-accent-border)",
                        borderRadius: "3px",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
