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
