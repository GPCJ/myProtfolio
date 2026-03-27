import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <div
      className="min-h-screen px-10 lg:px-24 py-16"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* 뒤로가기 */}
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-sm mb-12 transition-colors duration-150"
        style={{
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-jetbrains)',
        }}
      >
        ← 돌아가기
      </Link>

      {/* 제목 */}
      <h1
        className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight"
        style={{ fontFamily: 'var(--font-jetbrains)' }}
      >
        {project.title}
      </h1>

      {/* 기술 스택 */}
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

      {/* 내용 영역 — 추후 작성 */}
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
