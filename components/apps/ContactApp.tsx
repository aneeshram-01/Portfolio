import { PROFILE } from '@/lib/data';

export default function ContactApp() {
  return (
    <div className="app">
      <h2 style={{ marginTop: 0 }}>Get in touch</h2>
      <p className="lede">
        Open to good problems, interesting collaborations, and well-structured pull requests.
      </p>
      <div className="contact-card" style={{ marginTop: 16 }}>
        <a className="contact-link" href={`mailto:${PROFILE.email}`}>
          <span className="key">email</span>
          <span>{PROFILE.email}</span>
        </a>
        <a className="contact-link" href={PROFILE.github} target="_blank" rel="noopener noreferrer">
          <span className="key">github</span>
          <span>{PROFILE.githubLabel}</span>
        </a>
        <a className="contact-link" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
          <span className="key">linkedin</span>
          <span>{PROFILE.linkedinLabel}</span>
        </a>
      </div>
      <p style={{ marginTop: 18, color: 'var(--muted)', fontSize: 12.5, fontFamily: 'var(--font-mono)' }}>
        // typically replies within 24h on weekdays
      </p>
    </div>
  );
}
