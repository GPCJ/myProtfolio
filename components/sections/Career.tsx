import { career } from "@/data/career";
import FadeInSection from "@/components/ui/FadeInSection";

export default function Career() {
  if (career.length === 0) return null;

  return (
    <section id="career" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        {/* 섹션 헤더 */}
        <p
          className="text-xs mb-3"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}
        >
          <span style={{ color: "var(--color-accent)" }}>//</span> Career
        </p>
        <h2
          className="text-2xl font-bold mb-12"
          style={{ color: "var(--text-primary)" }}
        >
          이력
        </h2>

        {/* 타임라인 */}
        <div className="relative">
          {/* 세로 라인 */}
          <div
            className="absolute left-0 top-2 bottom-2 w-px"
            style={{ backgroundColor: "var(--border-color)" }}
          />

          <div className="flex flex-col gap-8">
            {career.map((item, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
              <div className="relative pl-8">
                {/* 타임라인 점 */}
                <div
                  className="absolute left-0 top-1.5 w-2 h-2 rounded-full -translate-x-1/2"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />

                {/* 날짜 */}
                <p
                  className="text-xs mb-1"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-jetbrains)",
                  }}
                >
                  {item.date}
                </p>

                {/* 회사/학교 + 역할 */}
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.company}
                  <span
                    className="font-normal ml-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    / {item.role}
                  </span>
                </p>

                {/* 설명 */}
                {item.description && (
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
