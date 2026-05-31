import { useState } from 'react';
import { complete } from '@/lib/claude';
import {
  PROFILE, HERO, CV, STACK, CERTS, PERSONAL_PROJECTS, WORK_PROJECTS,
  COMPLETED_CERTS, PLANNED_CERTS,
} from '@/lib/data';
import type { ThemeApi } from '@/lib/types';

// ── Ask widget ────────────────────────────────────────────────────
type HistLine = { kind: 'out' | 'q' | 'a' | 'thinking' | 'err'; text: string };

const ASK_SUGGESTIONS = [
  'What does Aneesh do?',
  "What's his stack?",
  'Tell me about ArcSync.',
  'Why hire him?',
];

function AskWidget() {
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [hist, setHist] = useState<HistLine[]>([
    { kind: 'out', text: '// ask me anything about Aneesh — work, stack, experience.' },
  ]);

  async function ask(question: string) {
    if (!question.trim() || busy) return;
    setHist((h) => [...h, { kind: 'q', text: question }, { kind: 'thinking', text: 'thinking…' }]);
    setBusy(true);
    setQ('');
    try {
      const reply = await complete(question);
      setHist((h) => h.filter((it) => it.kind !== 'thinking').concat({ kind: 'a', text: reply.trim() }));
    } catch {
      setHist((h) => h.filter((it) => it.kind !== 'thinking').concat({ kind: 'err', text: '// model unreachable. email aneeshram19@gmail.com' }));
    }
    setBusy(false);
  }

  return (
    <div className="ask">
      <div className="ask-bar">
        <span className="lights"><span className="l1" /><span className="l2" /><span className="l3" /></span>
        <span>aneesh@dev — ask</span>
        <span style={{ opacity: 0.55 }}>stub · offline</span>
      </div>
      <div className="ask-body">
        {hist.map((it, i) => {
          if (it.kind === 'q')        return <div key={i} className="ask-line"><span className="p">›</span>{it.text}</div>;
          if (it.kind === 'a')        return <div key={i} className="ask-line ask-out">↳ {it.text}</div>;
          if (it.kind === 'thinking') return <div key={i} className="ask-line" style={{ opacity: 0.6 }}>{it.text}</div>;
          if (it.kind === 'err')      return <div key={i} className="ask-line" style={{ color: '#ff9b85' }}>{it.text}</div>;
          return <div key={i} className="ask-line ask-out">{it.text}</div>;
        })}
      </div>
      <div className="ask-suggest">
        {ASK_SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => ask(s)} disabled={busy}>{s}</button>
        ))}
      </div>
      <form className="ask-form" onSubmit={(e) => { e.preventDefault(); ask(q); }}>
        <span className="p">›</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={busy ? 'thinking…' : 'type a question and hit enter'}
          disabled={busy}
          aria-label="ask question"
        />
        <button type="submit" disabled={busy || !q.trim()}>ask</button>
      </form>
    </div>
  );
}

// ── Cert card styles (inlined to avoid editing Phase 2 SCSS) ───────
const certCardBase: React.CSSProperties = {
  padding: '14px 16px',
  borderRadius: 'var(--radius)',
};
const certCardDone: React.CSSProperties = {
  ...certCardBase,
  border: '1px solid var(--line)',
  background: 'var(--paper-2)',
};
const certCardPending: React.CSSProperties = {
  ...certCardBase,
  border: '1px dashed var(--rule)',
  background: 'transparent',
};
const certGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: 12,
};
const certIssuerStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10.5,
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: 4,
};
const certSubLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  color: 'var(--accent)',
  marginLeft: 6,
};

// ── Web ────────────────────────────────────────────────────────────
interface Props { themeApi: ThemeApi; }

export default function Web({ themeApi }: Props) {
  return (
    <div className="web" data-screen-label="Web Mode">

      {/* ── Hero ── */}
      <header className="web-hero">
        <div className="web-eyebrow">Software Developer · Full-stack · Mangalore, IN</div>
        <h1>
          Aneesh builds <em>production systems</em>,<br />
          with <em>clarity</em>.
        </h1>
        <p className="lede">{HERO}</p>
        <div className="meta">
          <span>
            <span style={{ width: 8, height: 8, background: 'var(--good)', borderRadius: 2, display: 'inline-block' }} />
            {' '}open to opportunities
          </span>
          <span>· {PROFILE.email}</span>
          <span>· <button
            onClick={() => themeApi.setMode('os')}
            style={{ background: 'transparent', border: 0, color: 'var(--accent)', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}>
            try the desktop version ↗
          </button></span>
        </div>
      </header>

      {/* ── 01 Personal Projects ── */}
      <section className="web-section">
        <div className="web-section-h">
          <div className="num">01 — Personal Projects</div>
          <h2>Things I&apos;ve built.</h2>
        </div>
        <div className="web-projects">
          {PERSONAL_PROJECTS.map((p) => {
            const isPlaceholder = p.id.startsWith('soon');
            return (
              <div key={p.id} className="web-proj"
                   style={isPlaceholder ? { opacity: 0.35, cursor: 'default', pointerEvents: 'none' } : {}}>
                <div className="web-proj-num" style={isPlaceholder ? { color: 'var(--muted)' } : {}}>{p.num}</div>
                <div>
                  <div className="web-proj-title" style={isPlaceholder ? { fontFamily: 'var(--font-mono)', fontStyle: 'normal', fontSize: 16 } : {}}>
                    {isPlaceholder ? '// coming soon' : p.title}
                  </div>
                  {!isPlaceholder && <div style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 2 }}>{p.desc}</div>}
                  {p.award && !isPlaceholder && (
                    <div style={{ marginTop: 4 }}>
                      <span className="tag accent" style={{ fontSize: 10.5 }}>★ {p.award}</span>
                    </div>
                  )}
                </div>
                <div className="web-proj-tag">{isPlaceholder ? '' : p.tag}</div>
                <div className="web-proj-year">{isPlaceholder ? '' : p.year}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 02 Experience ── */}
      <section className="web-section">
        <div className="web-section-h">
          <div className="num">02 — Experience</div>
          <h2>Where I&apos;ve been.</h2>
        </div>
        <div className="web-cv">
          {CV.map((row, i) => (
            <div className="web-cv-row" key={i}>
              <div className="when">{row.when}</div>
              <div>
                <div className="role">{row.role}</div>
                <div className="where">{row.where}</div>
                {row.bullets.length > 0 && (
                  <ul>{row.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                )}
                {/* Work project cards nested under EG entry */}
                {row.type === 'work' && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted)', marginBottom: 10 }}>
                      Selected Projects
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {WORK_PROJECTS.map((p) => (
                        <div key={p.id} style={{ padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'var(--paper)' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent)' }}>{p.num}</span>
                            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20 }}>{p.title}</span>
                            {p.award && <span className="tag accent" style={{ fontSize: 10, marginLeft: 'auto' }}>★ {p.award.split(' · ')[0]}</span>}
                          </div>
                          <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}>{p.desc}</div>
                          <div className="row" style={{ gap: 4 }}>
                            {p.tech.map((t) => <span key={t} className="tag" style={{ fontSize: 10.5 }}>{t}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 03 Stack ── */}
      <section className="web-section">
        <div className="web-section-h">
          <div className="num">03 — Stack</div>
          <h2>What I reach for.</h2>
        </div>
        <div className="web-stack">
          {STACK.map((group) => (
            <div key={group.label} className="stack-card" tabIndex={0}>
              <h4>{group.label}</h4>
              <p>{group.items.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 04 Certifications ── */}
      <section className="web-section">
        <div className="web-section-h">
          <div className="num">04 — Certifications</div>
          <h2>What I&apos;ve learned.</h2>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
          Completed
        </div>
        <div style={{ ...certGridStyle, marginBottom: 24 }}>
          {COMPLETED_CERTS.map((c) => (
            <div key={c.title} style={certCardDone}>
              <div style={certIssuerStyle}>{c.issuer}</div>
              <div style={{ fontSize: 13.5 }}>{c.title}</div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
          In progress / planned
        </div>
        <div style={certGridStyle}>
          {PLANNED_CERTS.map((c) => (
            <div key={c.title} style={certCardPending}>
              <div style={certIssuerStyle}>
                {c.issuer}
                <span style={certSubLabel}>{c.status === 'in-progress' ? '// in progress' : '// planned'}</span>
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>{c.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 05 Ask me ── */}
      <section className="web-section">
        <div className="web-section-h">
          <div className="num">05 — Ask me</div>
          <h2>Questions, in plain text.</h2>
        </div>
        <p style={{ color: 'var(--muted)', maxWidth: '52ch', marginTop: -8, marginBottom: 18 }}>
          A tiny terminal that knows my CV. Ask anything about what I&apos;ve built,
          what I&apos;d reach for, or why you should hire me.
          (AI assistant is offline in this build — coming soon.)
        </p>
        <AskWidget />
      </section>

      {/* ── Footer ── */}
      <footer className="web-footer">
        <div>
          <p className="big">
            Got a problem worth<br />
            solving? <a href={`mailto:${PROFILE.email}`} className="contact">say hi</a>.
          </p>
        </div>
        <div className="links">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">{PROFILE.githubLabel}</a>
          <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">{PROFILE.linkedinLabel}</a>
          <span style={{ color: 'var(--muted)', marginTop: 12 }}>© {new Date().getFullYear()} — built by hand</span>
        </div>
      </footer>
    </div>
  );
}
