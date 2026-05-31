import type { Metadata } from 'next';
import { Instrument_Serif, JetBrains_Mono, Inter_Tight } from 'next/font/google';
import '../styles/globals.scss';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aneeshram Bhat — Software Developer',
  description:
    'Full-stack Software Engineer building production web apps and cloud-native systems. React specialist with Azure and AI platform experience. Based in Mangalore, India.',
  keywords: [
    'software developer', 'React', 'ASP.NET Core', 'Azure',
    'Semantic Kernel', 'full-stack', 'Mangalore',
  ],
  openGraph: {
    title: 'Aneeshram Bhat — Software Developer',
    description: 'Full-stack engineer · React · Azure · AI platforms · Mangalore, India',
    type: 'website',
  },
};

// Anti-flash inline script: applies stored theme/variant/accent before React hydrates
// to prevent a flash of default theme on first load.
const antiFlashScript = `
try {
  var s = localStorage.getItem('aneesh:tweaks');
  var el = document.documentElement;
  if (s) {
    var p = JSON.parse(s);
    if (p.dark !== undefined) el.dataset.theme = p.dark ? 'dark' : 'light';
    if (p.variant) el.dataset.variant = p.variant;
    if (p.accent) el.style.setProperty('--accent', p.accent);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    el.dataset.theme = 'light';
  }
} catch(e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-variant="glass"
      className={`${instrumentSerif.variable} ${jetBrainsMono.variable} ${interTight.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFlashScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
