import { useState } from 'react';

const INITIAL_ITEMS = [
  { name: 'abandoned-redesign-v3.fig', size: '12.4 MB', when: '2 days ago' },
  { name: 'old-portfolio-2019.zip', size: '44.0 MB', when: '11 mo ago' },
  { name: 'ideas/saas-for-cats.md', size: '1 KB', when: '3 mo ago' },
  { name: 'screenshot-final-FINAL-v2.png', size: '988 KB', when: '1 wk ago' },
  { name: '.DS_Store', size: '6 KB', when: '—' },
];

export default function TrashApp() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [emptied, setEmptied] = useState(false);

  if (emptied || items.length === 0) {
    return (
      <div className="app">
        <h2 style={{ marginTop: 0 }}>Trash</h2>
        <div className="trash-empty">
          <div style={{ fontSize: 32 }}>∅</div>
          <div>Empty. Like my Sunday afternoons.</div>
          <button
            className="icon-btn"
            style={{ width: 'auto', padding: '4px 10px', marginTop: 8 }}
            onClick={() => { setItems(INITIAL_ITEMS); setEmptied(false); }}>
            ↺ undo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Trash</h2>
        <button
          className="icon-btn"
          style={{ width: 'auto', padding: '4px 10px', borderColor: 'var(--accent)', color: 'var(--accent)' }}
          onClick={() => setEmptied(true)}>
          empty trash
        </button>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 12.5, fontFamily: 'var(--font-mono)' }}>
        // {items.length} items · selectively retained for nostalgia
      </p>
      <div className="trash-list">
        {items.map((it, i) => (
          <div key={i} className="t-item">
            <span style={{ color: 'var(--muted)' }}>✕</span>
            <span className="strike">{it.name}</span>
            <span className="meta">{it.size} · {it.when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
