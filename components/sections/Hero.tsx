'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { hero } from '@/data/hero';

const TYPING_SPEED = 60;
const BLINK_INTERVAL = 530;

function cleanUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname + u.pathname.replace(/\/$/, '');
  } catch {
    return url;
  }
}

export default function Hero() {
  const [displayedPosition, setDisplayedPosition] = useState('');
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
    const blink = setInterval(
      () => setCursorVisible((v) => !v),
      BLINK_INTERVAL,
    );
    return () => clearInterval(blink);
  }, []);

  return (
    <div>
      {/* 포지션 */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-sm font-medium mb-5 tracking-widest uppercase"
        style={{
          color: 'var(--color-accent)',
          fontFamily: 'var(--font-jetbrains)',
        }}
      >
        {displayedPosition}
        <span style={{ opacity: typingDone ? (cursorVisible ? 1 : 0) : 1 }}>
          |
        </span>
      </motion.p>

      {/* 이름 */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2 }}
        className="text-5xl lg:text-6xl font-bold mb-5 tracking-tight"
        style={{
          fontFamily: 'var(--font-jetbrains)',
          color: 'var(--text-primary)',
        }}
      >
        {hero.name}
      </motion.h1>

      {/* 구분선 */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
        className="mb-5 origin-left"
        style={{
          height: '1px',
          width: '3rem',
          backgroundColor: 'var(--color-accent)',
        }}
      />

      {/* 태그라인 */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="text-base mb-10 leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        {hero.tagline}
      </motion.p>

      {/* 링크 - 주소 텍스트 노출 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="flex flex-col gap-2 items-start"
      >
        {hero.links.github && (
          <a
            href={hero.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-colors duration-150"
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-jetbrains)',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = 'var(--color-accent)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--text-muted)')
            }
          >
            <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>
              GitHub:
            </span>
            {cleanUrl(hero.links.github)}
          </a>
        )}
        {hero.links.email && (
          <a
            href={`mailto:${hero.links.email}`}
            className="text-sm transition-colors duration-150"
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-jetbrains)',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = 'var(--color-accent)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--text-muted)')
            }
          >
            <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>
              Email:
            </span>
            {hero.links.email}
          </a>
        )}
      </motion.div>
    </div>
  );
}
