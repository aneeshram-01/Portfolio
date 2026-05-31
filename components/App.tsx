import { useState, useEffect, useMemo } from 'react';
import Desktop from './Desktop';
import Web from './Web';
import {
  TweaksPanel, useTweaks,
  TweakSection, TweakRadio, TweakToggle, TweakSelect, TweakColor,
} from './TweaksPanel';
import type { TweakValues, ThemeApi } from '@/lib/types';

const TWEAK_DEFAULTS: TweakValues = {
  variant: 'glass',
  dark: true,
  wallpaper: 'dots',
  accent: '#D94D2A',
  dockPosition: 'bottom',
  showGrid: false,
};

// ── Small UI sub-components ───────────────────────────────────────

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  const t = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const d = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  return <span className="clock">{d} · {t}</span>;
}

function ModeSwitch({ mode, setMode }: { mode: string; setMode: (m: 'os' | 'web') => void }) {
  return (
    <div className="modes" role="tablist" aria-label="View mode">
      <button role="tab" aria-selected={mode === 'os'} className={mode === 'os' ? 'active' : ''}
        onClick={() => setMode('os')}>
        <svg className="ico" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="1.5" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="3" y="3.5" width="3" height="2" fill="currentColor"/>
        </svg>
        Desktop
      </button>
      <button role="tab" aria-selected={mode === 'web'} className={mode === 'web' ? 'active' : ''}
        onClick={() => setMode('web')}>
        <svg className="ico" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M1.5 6h9M6 1.5c1.5 1.5 1.5 7.5 0 9M6 1.5c-1.5 1.5-1.5 7.5 0 9" stroke="currentColor" strokeWidth="1"/>
        </svg>
        Web
      </button>
    </div>
  );
}

function MobileNudge({ onDismiss, onSwitchToWeb }: { onDismiss: () => void; onSwitchToWeb: () => void }) {
  return (
    <div className="nudge" role="status">
      <span>Best on a desktop.</span>
      <button onClick={onSwitchToWeb} style={{ textDecoration: 'underline', opacity: 0.9 }}>switch to web</button>
      <button onClick={onDismiss} aria-label="Dismiss">✕</button>
    </div>
  );
}

function CookieBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie notice">
      <span className="cookie-text">
        <strong>Mandatory cookie notice.</strong>{' '}
        This site uses zero cookies, stores no data, and tracks nothing whatsoever.
        We were legally required to show this. Or maybe not. Either way — hi.
      </span>
      <button className="cookie-btn" onClick={onDismiss}>Got it, obviously</button>
    </div>
  );
}

function SystemNotif({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="sys-notif" role="dialog" aria-label="System notification">
      <div className="sys-notif-header">
        <div className="sys-notif-icon">A</div>
        <div className="sys-notif-appname">aneesh.dev</div>
        <div className="sys-notif-time">now</div>
        <button className="sys-notif-close" onClick={onDismiss} aria-label="Dismiss">✕</button>
      </div>
      <div className="sys-notif-body">
        <div className="sys-notif-title">System check complete</div>
        <div className="sys-notif-msg">
          All systems nominal. No issues detected. This notification is entirely
          ceremonial. You may dismiss it at any time. We recommend doing so immediately.
        </div>
      </div>
    </div>
  );
}

function MobileBlockModal({ onSwitchToWeb }: { onSwitchToWeb: () => void }) {
  return (
    <div className="mobile-block-overlay">
      <div className="mobile-block-card" role="dialog" aria-modal aria-label="Desktop mode unavailable">
        <div className="mobile-block-header">
          <div className="mobile-block-icon">A</div>
          <div className="mobile-block-appname">aneesh.dev</div>
          <div className="mobile-block-badge">system</div>
        </div>
        <div className="mobile-block-body">
          <div className="mobile-block-title">Desktop mode unavailable</div>
          <div className="mobile-block-msg">
            The desktop experience requires a larger screen. On mobile, the web view has
            everything — including the full CV, work, and the ask widget.
          </div>
        </div>
        <div className="mobile-block-actions">
          <button className="mobile-block-btn" onClick={onSwitchToWeb}>
            Switch to Web mode
            <svg viewBox="0 0 12 12" fill="none" width="12" height="12" style={{ marginLeft: 6, verticalAlign: 'middle' }}>
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M1.5 6h9M6 1.5c1.5 1.5 1.5 7.5 0 9M6 1.5c-1.5 1.5-1.5 7.5 0 9" stroke="currentColor" strokeWidth="1.1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── App (root) ────────────────────────────────────────────────────
export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Hydration-safe: default to 'web', switch in useEffect
  const [mode, _setMode] = useState<'os' | 'web'>('web');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth <= 720;
    setIsMobile(mobile);
    if (!mobile) {
      const saved = localStorage.getItem('aneesh:mode');
      _setMode(saved === 'web' ? 'web' : 'os');
    }
  }, []);

  const setMode = (m: 'os' | 'web') => {
    _setMode(m);
    try { localStorage.setItem('aneesh:mode', m); } catch {}
  };

  const [showNudge, setShowNudge] = useState(false);
  const [showCookie, setShowCookie] = useState(false);
  const [showSysNotif, setShowSysNotif] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth <= 720;
    if (mobile && localStorage.getItem('aneesh:nudged') !== '1') setShowNudge(true);
    if (localStorage.getItem('aneesh:cookie') !== '1') setShowCookie(true);
    if (localStorage.getItem('aneesh:sysnotif') !== '1') setShowSysNotif(true);
  }, []);

  // Apply theme/variant/accent to <html>, mode to <body>, wallpaper to <body> in web mode
  useEffect(() => {
    document.documentElement.dataset.theme = t.dark ? 'dark' : 'light';
    document.documentElement.dataset.variant = t.variant;
    document.documentElement.style.setProperty('--accent', t.accent);
    document.body.dataset.mode = mode;
    // Wallpaper pattern only in web mode (desktop renders its own .wallpaper div)
    const wp = t.showGrid ? 'grid' : t.wallpaper;
    document.body.className = mode === 'web' ? `wp-${wp}` : '';
  }, [t.dark, t.variant, t.accent, t.wallpaper, t.showGrid, mode]);

  const themeApi = useMemo<ThemeApi>(() => ({
    setTheme: (v) => setTweak('dark', v === 'dark'),
    getTheme: () => (t.dark ? 'dark' : 'light'),
    setMode, getMode: () => mode,
    setWallpaper: (v) => setTweak('wallpaper', v),
    getWallpaper: () => t.wallpaper,
    setVariant: (v) => setTweak('variant', v as 'paper' | 'glass'),
    getVariant: () => t.variant,
    setAccent: (v) => setTweak('accent', v),
    getAccent: () => t.accent,
  }), [t, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts
  useEffect(() => {
    function closeTopWindow() {
      const wins = Array.from(document.querySelectorAll<HTMLElement>('.window'));
      let top: HTMLElement | null = null, topZ = -1;
      for (const w of wins) {
        const z = parseInt(w.style.zIndex || '0', 10);
        if (z > topZ) { topZ = z; top = w; }
      }
      top?.querySelector<HTMLButtonElement>('.tlight.close')?.click();
    }

    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      const tag = (e.target as HTMLElement)?.tagName ?? '';
      const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;

      // Escape — close top window in desktop mode (no modifier, not in input)
      if (e.key === 'Escape' && mode === 'os' && !inInput) {
        closeTopWindow();
        return;
      }

      if (inInput) {
        // Allow ⌘E (mode toggle) and ⌘. (reorganize) even inside inputs
        if (!(mod && (e.key === 'e' || e.key === '.'))) return;
      }

      if (!mod) return;
      const k = e.key.toLowerCase();

      if (k === 'e') { e.preventDefault(); setMode(mode === 'os' ? 'web' : 'os'); }
      else if (k === 'd') { e.preventDefault(); setTweak('dark', !t.dark); }
      // Ctrl+` — open Terminal (avoids browser ⌘T conflict)
      else if (e.key === '`' && mode === 'os') { e.preventDefault(); window.__desktopApi?.openApp('terminal'); }
      else if (k === ',' && mode === 'os') { e.preventDefault(); window.__desktopApi?.openApp('settings'); }
      else if (k === '.' && mode === 'os') { e.preventDefault(); window.__desktopApi?.reorganizeIcons(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, t.dark]); // eslint-disable-line react-hooks/exhaustive-deps

  const wallpaper = t.showGrid ? 'grid' : t.wallpaper;

  return (
    <>
      <div className="topbar" data-screen-label="Topbar">
        <div className="topbar-left">
          <div className="topbar-brand">
            <span className="dot" />
            <span className="name">aneesh.dev</span>
          </div>
          <ModeSwitch mode={mode} setMode={setMode} />
        </div>
        <div className="topbar-right">
          <Clock />
          <button
            className="icon-btn"
            onClick={() => setTweak('dark', !t.dark)}
            title={t.dark ? 'Switch to light' : 'Switch to dark'}
            aria-label="Toggle theme"
          >
            {t.dark ? '☼' : '☾'}
          </button>
        </div>
      </div>

      {mode === 'os' && !isMobile
        ? <Desktop wallpaper={wallpaper} themeApi={themeApi} />
        : <Web themeApi={themeApi} />}

      {isMobile && mode === 'os' && (
        <MobileBlockModal onSwitchToWeb={() => setMode('web')} />
      )}

      {showNudge && (
        <MobileNudge
          onDismiss={() => { setShowNudge(false); localStorage.setItem('aneesh:nudged', '1'); }}
          onSwitchToWeb={() => { setMode('web'); setShowNudge(false); localStorage.setItem('aneesh:nudged', '1'); }}
        />
      )}

      {mode === 'web' && showCookie && (
        <CookieBanner onDismiss={() => { setShowCookie(false); localStorage.setItem('aneesh:cookie', '1'); }} />
      )}

      {mode === 'os' && showSysNotif && (
        <SystemNotif onDismiss={() => { setShowSysNotif(false); localStorage.setItem('aneesh:sysnotif', '1'); }} />
      )}

      {mode === 'web' && <TweaksPanel title="Tweaks">
        <TweakSection label="Variant" />
        <TweakRadio
          label="Style"
          value={t.variant}
          options={[
            { value: 'paper', label: 'Paper' },
            { value: 'glass', label: 'Glass' },
          ]}
          onChange={(v) => setTweak('variant', v as 'paper' | 'glass')}
        />
        <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak('dark', v)} />

        <TweakSection label="Wallpaper" />
        <TweakSelect
          label="Pattern"
          value={t.wallpaper}
          options={[
            { value: 'dots',  label: 'Dots' },
            { value: 'grid',  label: 'Grid' },
            { value: 'paper', label: 'Ruled paper' },
            { value: 'warm',  label: 'Warm halo' },
          ]}
          onChange={(v) => setTweak('wallpaper', v)}
        />

        <TweakSection label="Accent" />
        <TweakColor
          label="Color"
          value={t.accent}
          options={['#D94D2A', '#2A6FDB', '#1F8A5B', '#7A5AE0', '#C98A23']}
          onChange={(v) => setTweak('accent', v)}
        />

        <TweakSection label="View" />
        <TweakRadio
          label="Mode"
          value={mode}
          options={[
            { value: 'os',  label: 'Desktop' },
            { value: 'web', label: 'Web' },
          ]}
          onChange={(v) => setMode(v as 'os' | 'web')}
        />
      </TweaksPanel>}
    </>
  );
}
