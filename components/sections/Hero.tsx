"use client";

import { useEffect, useState } from "react";
import { GitBranch, Mail, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { hero } from "@/data/hero";

const TYPING_SPEED = 60;
const BLINK_INTERVAL = 530;

export default function Hero() {
  const [displayedPosition, setDisplayedPosition] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < hero.position.length) {
        setDisplayedPosition(hero.position.slice(0, i + 1));
        i++;
      } else {
        setTypingDone(true);
        clearInterval(timer);
      }
    }, TYPING_SPEED);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), BLINK_INTERVAL);
    return () => clearInterval(blink);
  }, []);

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
    <section id="hero" className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">

        {/* 포지션 — 작게, 먼저 */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm font-medium mb-5 tracking-widest uppercase"
          style={{ color: "var(--color-accent)", fontFamily: "var(--font-jetbrains)" }}
        >
          {displayedPosition}
          <span style={{ opacity: typingDone ? (cursorVisible ? 1 : 0) : 1 }}>|</span>
        </motion.p>

        {/* 이름 — 크게 */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="text-6xl sm:text-8xl font-bold mb-6 tracking-tight"
          style={{ fontFamily: "var(--font-jetbrains)", color: "var(--text-primary)" }}
        >
          {hero.name}
        </motion.h1>

        {/* 구분선 */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
          className="mb-6 origin-left"
          style={{ height: "1px", width: "3rem", backgroundColor: "var(--color-accent)" }}
        />

        {/* 태그라인 */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="text-base sm:text-lg mb-12 max-w-md leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {hero.tagline}
        </motion.p>

        {/* 링크 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-wrap gap-3"
        >
          {links.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={label !== "Email" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200"
              style={{
                fontFamily: "var(--font-jetbrains)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                backgroundColor: "var(--bg-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-accent)";
                e.currentTarget.style.borderColor = "var(--color-accent-border)";
                e.currentTarget.style.backgroundColor = "var(--color-accent-dim)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
              }}
            >
              <Icon size={14} />
              {label}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
