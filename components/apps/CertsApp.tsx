import { COMPLETED_CERTS, PLANNED_CERTS } from '@/lib/data';

export default function CertsApp() {
  return (
    <div className="app">
      <div className="row" style={{ gap: 8, marginBottom: 4 }}>
        <span className="tag accent">// certs</span>
        <span className="tag">{COMPLETED_CERTS.length} completed</span>
      </div>
      <h1 style={{ fontSize: 44 }}>Certs.</h1>
      <p style={{ color: 'var(--muted)', maxWidth: '46ch' }}>
        Courses and certifications — completed and in progress.
      </p>
      <hr className="divider" />

      <h3>Completed</h3>
      {COMPLETED_CERTS.map((c) => (
        <div key={c.title} className="cv-row">
          <div className="when" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>
            {c.issuer}
          </div>
          <div>
            <div className="role" style={{ fontWeight: 500, fontSize: 14 }}>{c.title}</div>
            {c.link && (
              <a
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontFamily: 'var(--font-mono)', fontSize: 11.5,
                  color: 'var(--accent)', textDecoration: 'none', marginTop: 4,
                }}
              >
                ↗ view certificate
              </a>
            )}
          </div>
        </div>
      ))}

      <h3 style={{ marginTop: 24 }}>In Progress / Planned</h3>
      {PLANNED_CERTS.map((c) => (
        <div key={c.title} className="cv-row" style={{ opacity: c.status === 'planned' ? 0.6 : 1 }}>
          <div className="when" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>
            {c.issuer}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 500, fontSize: 14 }}>{c.title}</span>
              <span
                className="tag"
                style={{
                  fontSize: 10,
                  color: c.status === 'in-progress' ? 'var(--accent)' : 'var(--muted)',
                  borderColor: c.status === 'in-progress' ? 'var(--accent)' : undefined,
                }}
              >
                {c.status === 'in-progress' ? '// in progress' : '// planned'}
              </span>
            </div>
            {c.link && (
              <a
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontFamily: 'var(--font-mono)', fontSize: 11.5,
                  color: 'var(--accent)', textDecoration: 'none', marginTop: 4,
                }}
              >
                ↗ view
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
