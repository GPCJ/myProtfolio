import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Career from "@/components/sections/Career";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="md:flex">
        {/* 왼쪽: 고정 Hero 패널 */}
        <aside
          id="hero"
          className="md:w-1/3 md:sticky md:top-0 md:h-screen flex flex-col justify-between px-10 lg:px-16 py-16 md:border-r"
          style={{ borderColor: "var(--border-color)" }}
        >
          <Hero />
          <nav>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Skills", href: "#skills" },
                { label: "Projects", href: "#projects" },
                { label: "Career", href: "#career" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm transition-colors duration-200 hover:text-[var(--color-accent)]"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* 오른쪽: 스크롤 섹션 */}
        <main className="md:w-2/3">
          <Skills />
          <Projects />
          <Career />
          <Footer />
        </main>
      </div>
    </>
  );
}
