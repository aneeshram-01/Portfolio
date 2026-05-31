import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { ThemeApi, DesktopApi } from '@/lib/types';
import Terminal from './Terminal';
import AboutApp from './apps/AboutApp';
import ProjectsApp from './apps/ProjectsApp';
import ProjectDetail from './apps/ProjectDetail';
import ResumeApp from './apps/ResumeApp';
import ContactApp from './apps/ContactApp';
import SettingsApp from './apps/SettingsApp';
import TrashApp from './apps/TrashApp';

declare global {
  interface Window { __desktopApi?: DesktopApi; }
}

// ── App registry ──────────────────────────────────────────────────
const APPS = [
  { id: 'about',    name: 'About',    glyph: 'A',  size: { w: 720, h: 520 } },
  { id: 'projects', name: 'Work',     glyph: '▤',  size: { w: 720, h: 560 } },
  { id: 'resume',   name: 'Resume',   glyph: 'CV', size: { w: 640, h: 580 } },
  { id: 'contact',  name: 'Contact',  glyph: '@',  size: { w: 520, h: 460 } },
  { id: 'terminal', name: 'Terminal', glyph: '_',  size: { w: 680, h: 440 } },
  { id: 'settings', name: 'Settings', glyph: '⚙',  size: { w: 540, h: 580 } },
  { id: 'trash',    name: 'Trash',    glyph: '✕',  size: { w: 540, h: 440 } },
] as const;

type AppId = (typeof APPS)[number]['id'] | `project:${string}`;

const DESKTOP_ICON_IDS: string[] = ['about', 'projects', 'resume', 'contact', 'trash'];

// ── Grid constants ────────────────────────────────────────────────
const GRID_COL = 90, GRID_ROW = 92, GRID_PAD_X = 18, GRID_PAD_Y = 18;

function snapToGrid(x: number, y: number) {
  const col = Math.max(0, Math.round((x - GRID_PAD_X) / GRID_COL));
  const row = Math.max(0, Math.round((y - GRID_PAD_Y) / GRID_ROW));
  return { x: GRID_PAD_X + col * GRID_COL, y: GRID_PAD_Y + row * GRID_ROW };
}

function findFreeCell(px: number, py: number, iconPos: Record<string, { x: number; y: number }>, excludeId: string) {
  const toCell = (x: number, y: number) => [
    Math.max(0, Math.round((x - GRID_PAD_X) / GRID_COL)),
    Math.max(0, Math.round((y - GRID_PAD_Y) / GRID_ROW)),
  ] as [number, number];
  const toPos = (c: number, r: number) => ({ x: GRID_PAD_X + c * GRID_COL, y: GRID_PAD_Y + r * GRID_ROW });
  const occupied = new Set(
    Object.entries(iconPos)
      .filter(([id]) => id !== excludeId)
      .map(([, p]) => toCell(p.x, p.y).join(','))
  );
  const [pc, pr] = toCell(px, py);
  for (let radius = 0; radius <= 12; radius++) {
    for (let dc = -radius; dc <= radius; dc++) {
      for (let dr = -radius; dr <= radius; dr++) {
        if (radius > 0 && Math.abs(dc) !== radius && Math.abs(dr) !== radius) continue;
        const nc = pc + dc, nr = pr + dr;
        if (nc < 0 || nr < 0) continue;
        if (!occupied.has(`${nc},${nr}`)) return toPos(nc, nr);
      }
    }
  }
  return toPos(pc, pr);
}

function defaultIconPositions(): Record<string, { x: number; y: number }> {
  const out: Record<string, { x: number; y: number }> = {};
  let row = 0;
  for (const id of DESKTOP_ICON_IDS) {
    if (id === 'trash') continue;
    out[id] = { x: GRID_PAD_X, y: GRID_PAD_Y + row * GRID_ROW };
    row++;
  }
  const deskH = (typeof window !== 'undefined' ? window.innerHeight : 768) - 36 - 100;
  const trashRow = Math.floor((deskH - GRID_PAD_Y) / GRID_ROW);
  out['trash'] = { x: GRID_PAD_X, y: GRID_PAD_Y + trashRow * GRID_ROW };
  return out;
}

function getAppMeta(id: string) {
  if (id.startsWith('project:')) {
    const num = id.split(':')[1];
    return { id, name: `Project ${num}`, glyph: num, size: { w: 620, h: 480 } };
  }
  return APPS.find((a) => a.id === id);
}

// ── Window chrome ─────────────────────────────────────────────────
interface WinState {
  id: string; x: number; y: number; w: number; h: number; z: number;
  minimized: boolean; zoomed: boolean;
  _x?: number; _y?: number; _w?: number; _h?: number;
}
interface WindowProps {
  win: WinState; focused: boolean;
  onFocus: () => void; onClose: () => void; onMinimize: () => void;
  onResize: () => void; onMove: (x: number, y: number) => void;
  children: React.ReactNode;
}

function AppWindow({ win, focused, onFocus, onClose, onMinimize, onResize, onMove, children }: WindowProps) {
  function startDrag(e: React.MouseEvent | React.TouchEvent, isTouch: boolean) {
    if ((e.target as HTMLElement).closest('.tlight')) return;
    onFocus();
    const p0 = isTouch ? (e as React.TouchEvent).touches[0] : (e as React.MouseEvent);
    const startX = p0.clientX, startY = p0.clientY;
    const ox = win.x, oy = win.y;
    function move(ev: MouseEvent | TouchEvent) {
      const p = isTouch ? (ev as TouchEvent).touches[0] : (ev as MouseEvent);
      onMove(Math.max(0, ox + p.clientX - startX), Math.max(0, oy + p.clientY - startY));
    }
    function up() {
      window.removeEventListener(isTouch ? 'touchmove' : 'mousemove', move as EventListener);
      window.removeEventListener(isTouch ? 'touchend' : 'mouseup', up);
    }
    window.addEventListener(isTouch ? 'touchmove' : 'mousemove', move as EventListener, isTouch ? { passive: true } : undefined);
    window.addEventListener(isTouch ? 'touchend' : 'mouseup', up);
    if (!isTouch) (e as React.MouseEvent).preventDefault();
  }

  const meta = getAppMeta(win.id);
  const metaLabel = win.id.startsWith('project:') ? 'case-study' : win.id;

  return (
    <div
      className={'window' + (focused ? ' focused' : '') + (win.minimized ? ' minimized' : '')}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }}
      onMouseDown={onFocus}
      data-screen-label={`Window: ${meta?.name ?? win.id}`}
    >
      <div className="titlebar"
        onMouseDown={(e) => startDrag(e, false)}
        onTouchStart={(e) => startDrag(e, true)}>
        <div className="tlights">
          <button className="tlight close" title="close" onClick={(e) => { e.stopPropagation(); onClose(); }}>×</button>
          <button className="tlight min"   title="minimize" onClick={(e) => { e.stopPropagation(); onMinimize(); }}>–</button>
          <button className="tlight zoom"  title="zoom" onClick={(e) => { e.stopPropagation(); onResize(); }}>+</button>
        </div>
        <div className="title">{meta?.name ?? win.id}</div>
        <div className="meta">{metaLabel}.app</div>
      </div>
      <div className="window-body">{children}</div>
    </div>
  );
}

// ── Desktop icon ──────────────────────────────────────────────────
interface IconProps {
  app: { id: string; name: string; glyph: string };
  pos: { x: number; y: number };
  active: boolean; selected: boolean;
  onSelect: (id: string) => void; onOpen: (id: string) => void;
  onDrop: (id: string, x: number, y: number) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
}
function DesktopIcon({ app, pos, active, selected, onSelect, onOpen, onDrop, onContextMenu }: IconProps) {
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

  function startDrag(e: React.MouseEvent | React.TouchEvent, isTouch: boolean) {
    onSelect(app.id);
    const p0 = isTouch ? (e as React.TouchEvent).touches[0] : (e as React.MouseEvent);
    const startX = p0.clientX, startY = p0.clientY;
    const ox = pos.x, oy = pos.y;
    let moved = false, lastSnapped = { x: ox, y: oy };
    function move(ev: MouseEvent | TouchEvent) {
      const p = isTouch ? (ev as TouchEvent).touches[0] : (ev as MouseEvent);
      const dx = p.clientX - startX, dy = p.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < 4) return;
      moved = true;
      const nx = Math.max(GRID_PAD_X, Math.min(window.innerWidth - 90, ox + dx));
      const ny = Math.max(GRID_PAD_Y, Math.min(window.innerHeight - 36 - 130, oy + dy));
      lastSnapped = snapToGrid(nx, ny);
      setDragPos(lastSnapped);
    }
    function up() {
      window.removeEventListener(isTouch ? 'touchmove' : 'mousemove', move as EventListener);
      window.removeEventListener(isTouch ? 'touchend' : 'mouseup', up);
      if (moved) onDrop(app.id, lastSnapped.x, lastSnapped.y);
      setDragPos(null);
    }
    window.addEventListener(isTouch ? 'touchmove' : 'mousemove', move as EventListener, isTouch ? { passive: true } : undefined);
    window.addEventListener(isTouch ? 'touchend' : 'mouseup', up);
    if (!isTouch) (e as React.MouseEvent).preventDefault();
  }

  const dp = dragPos ?? pos;
  return (
    <div
      className={'dicon' + (active ? ' active' : '') + (selected ? ' selected' : '') + (dragPos ? ' dragging' : '')}
      style={{ position: 'absolute', left: dp.x, top: dp.y, zIndex: dragPos ? 50 : undefined }}
      onDoubleClick={() => onOpen(app.id)}
      onMouseDown={(e) => { if (e.button === 0) startDrag(e, false); }}
      onTouchStart={(e) => startDrag(e, true)}
      onContextMenu={(e) => onContextMenu(e, app.id)}
      title={`Double-click to open ${app.name}`}
    >
      <div className="glyph" aria-hidden="true">
        <span style={{ fontSize: app.id === 'trash' ? 22 : 18 }}>{app.glyph}</span>
      </div>
      <div className="name">{app.name}</div>
    </div>
  );
}

// ── Context Menu ──────────────────────────────────────────────────
type MenuItem = '---' | { label: string; shortcut?: string; onClick?: () => void; disabled?: boolean };
interface ContextMenuProps { menu: { x: number; y: number; items: MenuItem[] }; onClose: () => void; }

function ContextMenu({ menu, onClose }: ContextMenuProps) {
  useEffect(() => {
    function close(e: MouseEvent | KeyboardEvent) {
      if (e.type === 'keydown' && (e as KeyboardEvent).key !== 'Escape') return;
      onClose();
    }
    window.addEventListener('mousedown', close);
    window.addEventListener('keydown', close as EventListener);
    return () => {
      window.removeEventListener('mousedown', close);
      window.removeEventListener('keydown', close as EventListener);
    };
  }, [onClose]);

  return (
    <div className="ctxmenu" style={{ left: menu.x, top: menu.y }} onMouseDown={(e) => e.stopPropagation()}>
      {menu.items.map((it, i) => it === '---' ? (
        <div key={i} className="ctxmenu-sep" />
      ) : (
        <button key={i} className={'ctxmenu-item' + (it.disabled ? ' disabled' : '')}
          disabled={it.disabled}
          onClick={() => { it.onClick?.(); onClose(); }}>
          <span>{it.label}</span>
          {it.shortcut && <span className="ctxmenu-shortcut">{it.shortcut}</span>}
        </button>
      ))}
    </div>
  );
}

// ── Dock ──────────────────────────────────────────────────────────
const DOCK_APPS = APPS.filter((a) => !['trash', 'settings'].includes(a.id));

function Dock({ openApp, runningIds }: { openApp: (id: string) => void; runningIds: string[] }) {
  return (
    <div className="dock" role="toolbar" aria-label="Dock">
      {DOCK_APPS.map((a) => (
        <div key={a.id}
          className={'dock-item' + (runningIds.includes(a.id) ? ' running' : '')}
          onClick={() => openApp(a.id)} title={a.name}>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{a.glyph}</span>
          <span className="label">{a.name}</span>
        </div>
      ))}
      <div className="dock-sep" />
      <div
        className={'dock-item' + (runningIds.includes('settings') ? ' running' : '')}
        onClick={() => openApp('settings')} title="Settings">
        <span style={{ fontFamily: 'var(--font-mono)' }}>⚙</span>
        <span className="label">Settings</span>
      </div>
    </div>
  );
}

// ── Desktop (main) ─────────────────────────────────────────────────
interface Props { wallpaper: string; themeApi: ThemeApi; }

export default function Desktop({ wallpaper, themeApi }: Props) {
  const [windows, setWindows] = useState<WinState[]>([]);
  const zRef = useRef(10);

  const [iconPos, setIconPos] = useState<Record<string, { x: number; y: number }>>(() => defaultIconPositions());
  useEffect(() => {
    try {
      const raw = localStorage.getItem('aneesh:iconPos');
      if (raw) setIconPos((prev) => ({ ...prev, ...JSON.parse(raw) }));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem('aneesh:iconPos', JSON.stringify(iconPos)); } catch {}
  }, [iconPos]);

  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; items: MenuItem[] } | null>(null);
  const [bumpKey, setBumpKey] = useState(0);

  const dropIcon = useCallback((id: string, x: number, y: number) => {
    setIconPos((p) => ({ ...p, [id]: findFreeCell(x, y, p, id) }));
  }, []);

  const reorganizeIcons = useCallback(() => setIconPos(defaultIconPositions()), []);

  const openApp = useCallback((id: string) => {
    setWindows((ws) => {
      const existing = ws.find((w) => w.id === id);
      const z = ++zRef.current;
      if (existing) return ws.map((w) => w.id === id ? { ...w, z, minimized: false } : w);
      const meta = getAppMeta(id);
      if (!meta) return ws;
      const offset = ws.length * 24;
      const cx = Math.max(120, (window.innerWidth  - meta.size.w) / 2 + offset);
      const cy = Math.max(60,  (window.innerHeight - meta.size.h) / 2 - 60 + offset);
      return [...ws, { id, x: cx, y: cy, w: meta.size.w, h: meta.size.h, z, minimized: false, zoomed: false }];
    });
  }, []);

  const closeApp = useCallback((id: string) => setWindows((ws) => ws.filter((w) => w.id !== id)), []);
  const closeAllWindows = useCallback(() => setWindows([]), []);

  const focusApp = useCallback((id: string) => {
    const z = ++zRef.current;
    setWindows((ws) => ws.map((w) => w.id === id ? { ...w, z, minimized: false } : w));
  }, []);

  const moveApp = useCallback((id: string, x: number, y: number) =>
    setWindows((ws) => ws.map((w) => w.id === id ? { ...w, x, y } : w)), []);

  const minApp = useCallback((id: string) =>
    setWindows((ws) => ws.map((w) => w.id === id ? { ...w, minimized: true } : w)), []);

  const zoomApp = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => {
      if (w.id !== id) return w;
      if (w.zoomed) return { ...w, zoomed: false, x: w._x ?? w.x, y: w._y ?? w.y, w: w._w ?? w.w, h: w._h ?? w.h };
      return { ...w, zoomed: true, _x: w.x, _y: w.y, _w: w.w, _h: w.h,
               x: 12, y: 12, w: window.innerWidth - 24, h: window.innerHeight - 36 - 100 };
    }));
  }, []);

  const refreshDesktop = useCallback(() => setBumpKey((k) => k + 1), []);

  const api = useMemo<DesktopApi>(() => ({
    openApp, closeApp, reorganizeIcons, refreshDesktop, closeAllWindows,
    setTheme: themeApi.setTheme, getTheme: themeApi.getTheme,
    setMode: themeApi.setMode,   getMode: themeApi.getMode,
    setWallpaper: themeApi.setWallpaper, getWallpaper: themeApi.getWallpaper,
    setVariant: themeApi.setVariant,     getVariant: themeApi.getVariant,
    setAccent: themeApi.setAccent,       getAccent: themeApi.getAccent,
  }), [openApp, closeApp, reorganizeIcons, refreshDesktop, closeAllWindows, themeApi]);

  // Expose imperative API for keyboard shortcuts in App.tsx
  useEffect(() => {
    window.__desktopApi = api;
    return () => { delete window.__desktopApi; };
  }, [api]);

  // Open About on first load
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    if (window.innerWidth > 720) setTimeout(() => openApp('about'), 250);
  }, [openApp]);

  function renderContent(id: string) {
    if (id === 'about')    return <AboutApp />;
    if (id === 'projects') return <ProjectsApp openWindow={openApp} />;
    if (id === 'resume')   return <ResumeApp />;
    if (id === 'contact')  return <ContactApp />;
    if (id === 'trash')    return <TrashApp />;
    if (id === 'terminal') return <Terminal themeApi={api} />;
    if (id === 'settings') return <SettingsApp api={api} />;
    if (id.startsWith('project:')) return <ProjectDetail id={id} />;
    return <div className="app">Unknown app: {id}</div>;
  }

  function onDesktopContextMenu(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('.window, .dock, .dicon')) return;
    e.preventDefault();
    setSelectedIcon(null);
    setMenu({
      x: Math.min(e.clientX, window.innerWidth - 230),
      y: Math.min(e.clientY, window.innerHeight - 240),
      items: [
        { label: 'Refresh desktop', shortcut: '⌘R', onClick: refreshDesktop },
        { label: 'Reorganize icons', shortcut: '⌘.', onClick: reorganizeIcons },
        '---',
        { label: 'Open Settings…', shortcut: '⌘,', onClick: () => openApp('settings') },
        { label: 'Open Terminal', shortcut: '⌘T', onClick: () => openApp('terminal') },
        '---',
        { label: themeApi.getTheme() === 'dark' ? 'Switch to Light' : 'Switch to Dark',
          shortcut: '⌘D', onClick: () => themeApi.setTheme(themeApi.getTheme() === 'dark' ? 'light' : 'dark') },
        { label: 'Switch to Web mode', shortcut: '⌘E', onClick: () => themeApi.setMode('web') },
        '---',
        { label: 'Close all windows', onClick: closeAllWindows, disabled: windows.length === 0 },
      ],
    });
  }

  function onIconContextMenu(e: React.MouseEvent, id: string) {
    e.preventDefault(); e.stopPropagation();
    setSelectedIcon(id);
    const app = APPS.find((a) => a.id === id);
    setMenu({
      x: Math.min(e.clientX, window.innerWidth - 230),
      y: Math.min(e.clientY, window.innerHeight - 200),
      items: [
        { label: `Open ${app?.name ?? id}`, shortcut: '⏎', onClick: () => openApp(id) },
        '---',
        { label: 'Reset icon position', onClick: () => setIconPos((p) => ({ ...p, [id]: defaultIconPositions()[id] })) },
        { label: 'Reorganize all icons', onClick: reorganizeIcons },
        '---',
        { label: 'Get info', disabled: true },
      ],
    });
  }

  const openIds = windows.map((w) => w.id);
  const topZ = windows.length ? Math.max(...windows.map((x) => x.z)) : 0;

  return (
    <div className={'desktop' + (bumpKey ? ' refreshing' : '')} key={bumpKey} onContextMenu={onDesktopContextMenu}>
      <div className={'wallpaper wp-' + wallpaper} />
      {DESKTOP_ICON_IDS.map((id) => {
        const app = APPS.find((a) => a.id === id);
        if (!app) return null;
        const pos = iconPos[id] ?? defaultIconPositions()[id];
        return (
          <DesktopIcon
            key={id} app={app} pos={pos}
            active={openIds.includes(id)} selected={selectedIcon === id}
            onSelect={setSelectedIcon} onOpen={openApp}
            onDrop={dropIcon} onContextMenu={onIconContextMenu}
          />
        );
      })}
      {windows.map((w) => (
        <AppWindow key={w.id} win={w} focused={w.z === topZ}
          onFocus={() => focusApp(w.id)} onClose={() => closeApp(w.id)}
          onMinimize={() => minApp(w.id)} onResize={() => zoomApp(w.id)}
          onMove={(x, y) => moveApp(w.id, x, y)}>
          {renderContent(w.id)}
        </AppWindow>
      ))}
      <Dock openApp={openApp} runningIds={openIds} />
      {menu && <ContextMenu menu={menu} onClose={() => setMenu(null)} />}
    </div>
  );
}
