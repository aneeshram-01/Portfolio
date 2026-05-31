import { WORK_PROJECTS } from '@/lib/data';

interface Props { id: string; }

export default function ProjectDetail({ id }: Props) {
  const num = id.split(':')[1];
  const p = WORK_PROJECTS.find((x) => x.num === num) ?? WORK_PROJECTS[0];

  return (
    <div className="app">
      <div className="row" style={{ marginBottom: 4 }}>
        <span className="tag">{p.num}</span>
        <span className="tag">{p.year}</span>
        <span className="tag accent">{p.tag}</span>
        {p.award && <span className="tag accent">★ {p.award}</span>}
      </div>
      <h1>{p.title}</h1>
      <p className="lede">{p.desc}</p>
      <hr className="divider" />
      <h3>Stack</h3>
      <div className="row">
        {p.tech.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
      <hr className="divider" />
      <h3>Notes</h3>
      <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>
        // Internal project — no public link. Details available on request.
      </p>
    </div>
  );
}
