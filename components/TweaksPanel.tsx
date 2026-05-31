'use client';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { TweakValues, SetTweak } from '@/lib/types';

// ── useTweaks hook ──────────────────────────────────────────────
// SSR-safe: renders defaults on server, reads localStorage after mount.
// Removed: window.parent.postMessage Labs host protocol (not needed standalone).
export function useTweaks(defaults: TweakValues): [TweakValues, SetTweak] {
  const [values, setValues] = useState<TweakValues>(defaults);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('aneesh:tweaks');
      if (raw) setValues((prev) => ({ ...prev, ...JSON.parse(raw) }));
    } catch {}
  }, []);

  const setTweak = useCallback<SetTweak>((keyOrEdits, val?) => {
    const edits =
      typeof keyOrEdits === 'object' && keyOrEdits !== null
        ? (keyOrEdits as Partial<TweakValues>)
        : ({ [keyOrEdits as string]: val } as Partial<TweakValues>);
    setValues((prev) => {
      const next = { ...prev, ...edits };
      try { localStorage.setItem('aneesh:tweaks', JSON.stringify(next)); } catch {}
      return next;
    });
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);

  return [values, setTweak];
}

// ── Sub-controls ─────────────────────────────────────────────────

interface RowProps { label: string; value?: string | number | null; children?: React.ReactNode; inline?: boolean; }
function TweakRow({ label, value, children, inline = false }: RowProps) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

export function TweakSection({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

interface SliderProps { label: string; value: number; min?: number; max?: number; step?: number; unit?: string; onChange: (v: number) => void; }
export function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }: SliderProps) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

interface ToggleProps { label: string; value: boolean; onChange: (v: boolean) => void; }
export function TweakToggle({ label, value, onChange }: ToggleProps) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

type OptionValue = string | number | boolean;
interface RadioOption { value: OptionValue; label: string; }
interface RadioProps { label: string; value: OptionValue; options: (OptionValue | RadioOption)[]; onChange: (v: OptionValue) => void; }
export function TweakRadio({ label, value, options, onChange }: RadioProps) {
  const opts = options.map((o): RadioOption =>
    typeof o === 'object' && o !== null && 'value' in o ? o : { value: o, label: String(o) }
  );
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);
  valueRef.current = value;
  const [dragging, setDragging] = useState(false);

  const segAt = (clientX: number) => {
    if (!trackRef.current) return opts[0].value;
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev: PointerEvent) => {
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => { setDragging(false); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`, width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={String(o.value)} type="button" role="radio" aria-checked={o.value === value}>{o.label}</button>
        ))}
      </div>
    </TweakRow>
  );
}

interface SelectProps { label: string; value: OptionValue; options: (OptionValue | RadioOption)[]; onChange: (v: string) => void; }
export function TweakSelect({ label, value, options, onChange }: SelectProps) {
  const opts = options.map((o): RadioOption =>
    typeof o === 'object' && o !== null && 'value' in o ? o : { value: o, label: String(o) }
  );
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={String(value)} onChange={(e) => onChange(e.target.value)}>
        {opts.map((o) => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
      </select>
    </TweakRow>
  );
}

interface ColorProps { label: string; value: string; options?: string[]; onChange: (v: string) => void; }
function isLight(hex: string): boolean {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const CheckMark = ({ light }: { light: boolean }) => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          stroke={light ? 'rgba(0,0,0,.78)' : '#fff'} />
  </svg>
);
export function TweakColor({ label, value, options, onChange }: ColorProps) {
  if (!options?.length) {
    return (
      <div className="twk-row twk-row-h">
        <div className="twk-lbl"><span>{label}</span></div>
        <input type="color" className="twk-swatch" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  const cur = value.toLowerCase();
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o) => {
          const on = o.toLowerCase() === cur;
          return (
            <button key={o} type="button" className="twk-chip" role="radio"
                    aria-checked={on} data-on={on ? '1' : '0'}
                    title={o} style={{ background: o }}
                    onClick={() => onChange(o)}>
              {on && <CheckMark light={isLight(o)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

export function TweakButton({ label, onClick, secondary = false }: { label: string; onClick: () => void; secondary?: boolean }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'} onClick={onClick}>{label}</button>
  );
}

// ── TweaksPanel shell ──────────────────────────────────────────────
interface PanelProps { title?: string; children?: React.ReactNode; }

export function TweaksPanel({ title = 'Tweaks', children }: PanelProps) {
  const [open, setOpen] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(clampToViewport);
      ro.observe(document.documentElement);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', clampToViewport);
    return () => window.removeEventListener('resize', clampToViewport);
  }, [open, clampToViewport]);

  const onDragStart = (e: React.MouseEvent) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev: MouseEvent) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) {
    return (
      <button
        style={{
          position: 'fixed', right: 16, bottom: 16, zIndex: 2147483646,
          width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line)',
          background: 'var(--paper-2)', cursor: 'pointer', fontFamily: 'var(--font-mono)',
          fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="Open tweaks"
        onClick={() => setOpen(true)}
        aria-label="Open tweaks"
      >⚙</button>
    );
  }

  return (
    <div ref={dragRef} className="twk-panel"
         style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
      <div className="twk-hd" onMouseDown={onDragStart}>
        <b>{title}</b>
        <button className="twk-x" aria-label="Close tweaks"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => setOpen(false)}>✕</button>
      </div>
      <div className="twk-body">{children}</div>
    </div>
  );
}
