import { CV, STACK } from '@/lib/data';

export default function ResumeApp() {
  return (
    <div className="app">
      <h2 style={{ marginTop: 0 }}>Curriculum vitae</h2>
      <p style={{ color: 'var(--muted)' }}>Software Developer · Full-stack · Mangalore, India</p>

      <h3>Experience</h3>
      {CV.filter((e) => e.type === 'work').map((e, i) => (
        <div key={i} className="cv-row">
          <div className="when">{e.when}</div>
          <div>
            <div className="role">{e.role}</div>
            <div className="where">{e.where}</div>
            {e.bullets.length > 0 && (
              <ul>{e.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            )}
          </div>
        </div>
      ))}

      <h3>Education</h3>
      {CV.filter((e) => e.type === 'education').map((e, i) => (
        <div key={i} className="cv-row">
          <div className="when">{e.when}</div>
          <div>
            <div className="role">{e.role}</div>
            <div className="where">{e.where}</div>
          </div>
        </div>
      ))}

      <h3>Stack</h3>
      <div className="row">
        {STACK.flatMap((g) => g.items.slice(0, 3).map((item) => (
          <span key={`${g.label}-${item}`} className="tag">{item}</span>
        )))}
      </div>
    </div>
  );
}
