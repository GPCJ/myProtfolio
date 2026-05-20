import { Link, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { projects } from '@/data/projects';
import type {
  Feature,
  Decision,
  Troubleshooting,
} from '@/data/projects';
import FadeInSection from '@/components/ui/FadeInSection';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-10"
        style={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
        }}
      >
        <div className="text-center">
          <h1
            className="text-2xl mb-4"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            404 — Project Not Found
          </h1>
          <Link
            to="/#projects"
            className="text-sm"
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-jetbrains)',
            }}
          >
            ← 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const descriptionLines = project.description.split('\n').filter(Boolean);
  const demoLabel = project.demoUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '');

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
        style={{
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-jetbrains)',
        }}
      >
        ← 돌아가기
      </Link>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 lg:items-start mb-16">
        {/* 좌측: 타이틀 + 메타 + techStack */}
        <div>
          <h1
            className="text-4xl lg:text-5xl font-bold mb-3 tracking-tight"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            {project.title}
          </h1>

          {/* status */}
          {project.status && (
            <div
              className="flex items-center gap-2 mb-6"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              <span
                aria-hidden
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: project.status.active
                    ? 'var(--color-accent)'
                    : 'var(--text-muted)',
                  boxShadow: project.status.active
                    ? '0 0 8px var(--color-accent)'
                    : 'none',
                }}
              />
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {project.status.label}
              </span>
            </div>
          )}

          {/* 설명 (줄별) */}
          {descriptionLines.length > 0 && (
            <div className="flex flex-col gap-2 mb-8 max-w-3xl">
              {descriptionLines.map((line) => (
                <p
                  key={line}
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {line}
                </p>
              ))}
            </div>
          )}

          {/* 외부 링크 */}
          {(project.demoUrl || project.githubUrl) && (
            <div className="flex flex-wrap gap-4 mb-12">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors duration-150"
                  style={{
                    color: 'var(--color-accent)',
                    fontFamily: 'var(--font-jetbrains)',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', marginRight: 8 }}>
                    Deploy:
                  </span>
                  {demoLabel}
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors duration-150"
                  style={{
                    color: 'var(--color-accent)',
                    fontFamily: 'var(--font-jetbrains)',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', marginRight: 8 }}>
                    GitHub:
                  </span>
                  {project.githubUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}
            </div>
          )}

          {/* techStack */}
          <div className="flex flex-col gap-3 mb-16 lg:mb-0">
            {(
              project.techStack ??
              project.tags.map((t) => ({ category: '', items: [t] }))
            ).map(({ category, items }) => (
              <div key={category} className="flex items-start gap-4">
                <span
                  className="text-xs w-24 shrink-0 pt-1.5"
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
        </div>

        {/* 우측: Features */}
        {project.features && project.features.length > 0 && (
          <Section label="Features" title="주요 기능" className="">
            <div className="flex flex-col gap-6 max-w-3xl">
              {project.features.map((f) => (
                <FeatureBlock key={f.title} feature={f} />
              ))}
            </div>
          </Section>
        )}
      </div>


      {project.decisions && project.decisions.length > 0 && (
        <Section label="Decisions" title="기술적 의사결정">
          <div className="flex flex-col gap-10 max-w-3xl">
            {project.decisions.map((d) => (
              <DecisionBlock key={d.topic} decision={d} />
            ))}
          </div>
        </Section>
      )}

      {project.troubleshooting && project.troubleshooting.length > 0 && (
        <Section label="Troubleshooting" title="트러블슈팅 & 회고">
          <div className="flex flex-col gap-10 max-w-3xl">
            {project.troubleshooting.map((t) => (
              <TroubleshootingBlock key={t.title} item={t} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  label,
  title,
  children,
  className = 'mb-16',
}: {
  label: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <FadeInSection>
        <p
          className="text-xs mb-3"
          style={{
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-jetbrains)',
          }}
        >
          <span style={{ color: 'var(--color-accent)' }}>//</span> {label}
        </p>
        <h2
          className="text-2xl font-bold mb-8"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h2>
        {children}
      </FadeInSection>
    </section>
  );
}

function FeatureBlock({ feature }: { feature: Feature }) {
  return (
    <div>
      <h3
        className="text-base font-semibold mb-1"
        style={{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-jetbrains)',
        }}
      >
        {feature.title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        {feature.description}
      </p>
      {feature.screenshot && (
        <img
          src={feature.screenshot}
          alt={feature.title}
          className="mt-3 rounded"
          style={{
            border: '1px solid var(--border-color)',
            maxWidth: '100%',
          }}
        />
      )}
    </div>
  );
}

function DecisionBlock({ decision }: { decision: Decision }) {
  return (
    <div>
      <h3
        className="text-base font-semibold mb-3"
        style={{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-jetbrains)',
        }}
      >
        {decision.topic}
      </h3>
      <DetailRow label="Context" value={decision.context} />
      <DetailRow label="Rationale" value={decision.rationale} />
      {decision.result && <DetailRow label="Result" value={decision.result} />}
    </div>
  );
}

function TroubleshootingBlock({ item }: { item: Troubleshooting }) {
  return (
    <div>
      <h3
        className="text-base font-semibold mb-3"
        style={{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-jetbrains)',
        }}
      >
        {item.title}
      </h3>
      <DetailRow label="Problem" value={item.problem} />
      <DetailRow label="Cause" value={item.cause} />
      <DetailRow label="Solution" value={item.solution} />
      {item.learning && <DetailRow label="Learning" value={item.learning} />}
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | string[];
}) {
  const items = Array.isArray(value) ? value : null;

  return (
    <div className="flex items-start gap-4 mb-2">
      <span
        className="text-xs w-20 shrink-0 pt-1"
        style={{
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-jetbrains)',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </span>
      {items ? (
        <ul className="flex flex-col gap-2 flex-1">
          {items.map((line, i) => (
            <li
              key={i}
              className="text-sm leading-relaxed flex gap-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span
                aria-hidden
                className="shrink-0"
                style={{
                  width: 4,
                  height: 4,
                  marginTop: '0.55rem',
                  backgroundColor: 'var(--color-accent)',
                }}
              />
              <span className="flex-1">{line}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p
          className="text-sm leading-relaxed flex-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          {value}
        </p>
      )}
    </div>
  );
}
