import { WORK_PROJECTS } from '@/lib/data';

interface Props { openWindow?: (id: string) => void; }

export default function ProjectsApp({ openWindow }: Props) {
  return (
    <div className="app">
      <h2 style={{ marginTop: 0 }}>Work projects</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 18 }}>
        Internal projects built at EG — production systems shipped and maintained.
      </p>
      <div className="proj-list">
        {WORK_PROJECTS.map((p) => (
          <div key={p.id} className="proj" onClick={() => openWindow?.('project:' + p.num)}>
            <div className="num">{p.num}</div>
            <div>
              <div className="title">{p.title}</div>
              <div className="desc">{p.desc}</div>
              {p.award && (
                <div style={{ marginTop: 4 }}>
                  <span className="tag accent" style={{ fontSize: 10 }}>★ {p.award}</span>
                </div>
              )}
            </div>
            <div className="col" style={{ alignItems: 'flex-end', gap: 4 }}>
              <span className="tag">{p.tag}</span>
              <span className="year">{p.year}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
