import { PROFILE, HERO } from "@/lib/data";
import Headshot from "@/components/Headshot";

export default function AboutApp() {
  return (
    <div className="app">
      <div className="row" style={{ gap: 8, marginBottom: 6 }}>
        <span className="tag accent">// hello</span>
        <span className="tag">v2.0</span>
        <span className="tag">Mangalore, IN</span>
      </div>
      <h1>Aneesh.</h1>
      <p className="lede">{HERO}</p>
      <hr className="divider" />
      <div className="about-grid">
        <div>
          <h3>What I work on</h3>
          <p>
            Full-stack web applications with a React.js specialty — scalable
            micro-frontend architectures, clean .NET backend services, and
            cloud-native AI pipelines on Azure.
          </p>
          <h3>Currently</h3>
          <p>
            Co-building a multi-tenant AI platform at EG using Semantic Kernel,
            pgvector, and ASP.NET Core 10. Also shipping ArcSync; an Electron
            desktop agent for AI-assisted engineering workflow automation.
          </p>
        </div>
        <div className="col">
          <Headshot variant="desktop" />
          <dl className="fact-list">
            <dt>Role</dt>
            <dd>Software Developer</dd>
            <dt>Loc</dt>
            <dd>Mangalore, IN</dd>
            <dt>Exp</dt>
            <dd>~2 years, professionally</dd>
            <dt>Email</dt>
            <dd>{PROFILE.email}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
