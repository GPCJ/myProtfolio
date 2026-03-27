import type { Metadata } from 'next';
import { JetBrains_Mono, Inter } from 'next/font/google';
import './globals.css';
import ThemeToggle from '@/components/ui/ThemeToggle';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '진서현 | Portfolio',
  description: '개발자 진서현의 포트폴리오',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('theme')==='light'){var v={'--bg-primary':'#f0f2f5','--bg-secondary':'#e8eaed','--bg-card':'#ffffff','--color-accent':'#006644','--color-accent-dim':'rgba(0,102,68,0.12)','--color-accent-border':'rgba(0,102,68,0.35)','--text-primary':'#0f0f0f','--text-secondary':'#4a4a4a','--text-muted':'#6b6b6b','--border-color':'#d0d0d0'};var r=document.documentElement;Object.keys(v).forEach(function(k){r.style.setProperty(k,v[k]);});}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full">
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
