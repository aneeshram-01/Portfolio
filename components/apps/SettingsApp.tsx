import { useReducer } from 'react';
import type { DesktopApi } from '@/lib/types';

interface Props { api: DesktopApi; }

const WP_OPTS = [
  { v: 'dots',  label: 'Dots' },
  { v: 'grid',  label: 'Grid' },
  { v: 'paper', label: 'Ruled' },
  { v: 'warm',  label: 'Warm halo' },
];
const ACCENT_OPTS = ['#D94D2A', '#C98A23', '#2A6FDB', '#1F8A5B', '#7A5AE0'];

export default function SettingsApp({ api }: Props) {
  const [, force] = useReducer((x: number) => x + 1, 0);
  const wp = api.getWallpaper();
  const variant = api.getVariant();
  const accent = api.getAccent();
  const dark = api.getTheme() === 'dark';

  return (
    <div className="app settings">
      <div className="row" style={{ gap: 8, marginBottom: 4 }}>
        <span className="tag accent">// settings</span>
        <span className="tag">live</span>
      </div>
      <h1 style={{ fontSize: 44 }}>Display.</h1>
      <p style={{ color: 'var(--muted)', maxWidth: '42ch' }}>
        Customize how the workstation looks. Changes save automatically and apply
        across both Desktop and Web modes.
      </p>
      <hr className="divider" />

      <div className="settings-row">
        <div className="settings-label">
          <h3 style={{ margin: 0 }}>Color mode</h3>
          <div className="settings-hint">Light or dark surface.</div>
        </div>
        <div className="seg">
          <button className={!dark ? 'on' : ''} onClick={() => { api.setTheme('light'); force(); }}>Light</button>
          <button className={dark ? 'on' : ''} onClick={() => { api.setTheme('dark'); force(); }}>Dark</button>
        </div>
      </div>

      <div className="settings-row">
        <div className="settings-label">
          <h3 style={{ margin: 0 }}>Style</h3>
          <div className="settings-hint">Window chrome treatment.</div>
        </div>
        <div className="seg">
          <button className={variant === 'paper' ? 'on' : ''} onClick={() => { api.setVariant('paper'); force(); }}>Paper</button>
          <button className={variant === 'glass' ? 'on' : ''} onClick={() => { api.setVariant('glass'); force(); }}>Glass</button>
        </div>
      </div>

      <div className="settings-row column">
        <div className="settings-label">
          <h3 style={{ margin: 0 }}>Wallpaper</h3>
          <div className="settings-hint">Pattern behind everything.</div>
        </div>
        <div className="wp-grid">
          {WP_OPTS.map((o) => (
            <button key={o.v} className={'wp-card' + (wp === o.v ? ' on' : '')}
              onClick={() => { api.setWallpaper(o.v); force(); }}>
              <div className={'wp-preview wp-prev-' + o.v} />
              <div className="wp-name">{o.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="settings-row column">
        <div className="settings-label">
          <h3 style={{ margin: 0 }}>Accent</h3>
          <div className="settings-hint">A single hue used across selection, links and badges.</div>
        </div>
        <div className="accent-row">
          {ACCENT_OPTS.map((c) => (
            <button key={c}
              className={'accent-swatch' + (accent.toLowerCase() === c.toLowerCase() ? ' on' : '')}
              style={{ background: c }}
              onClick={() => { api.setAccent(c); force(); }}
              aria-label={c} title={c} />
          ))}
        </div>
      </div>

      <hr className="divider" />
      <h3>Keyboard shortcuts</h3>
      <dl className="fact-list">
        <dt>⌘ E</dt><dd>Toggle Desktop / Web mode</dd>
        <dt>⌘ D</dt><dd>Toggle dark / light</dd>
        <dt>Ctrl `</dt><dd>Open Terminal</dd>
        <dt>⌘ ,</dt><dd>Open Settings</dd>
        <dt>⌘ .</dt><dd>Reorganize desktop icons</dd>
        <dt>Esc</dt><dd>Close focused window</dd>
      </dl>
    </div>
  );
}
