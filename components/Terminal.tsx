import { useState, useEffect, useRef } from 'react';
import { complete } from '@/lib/claude';
import type { DesktopApi } from '@/lib/types';

const FS: Record<string, string> = {
  'about.txt': [
    'name: P Aneeshram Bhat',
    'role: Software Developer · Full-stack · React specialist',
    'loc:  Mangalore, IN',
    '',
    'Full-stack engineer with ~2 years of experience building production',
    'web apps and cloud-native systems. React.js specialist with hands-on',
    'Azure and AI platform experience.',
    '',
    'Currently co-building a multi-tenant AI platform using Semantic',
    'Kernel, pgvector, and ASP.NET Core 10.',
  ].join('\n'),

  'projects.txt': [
    '01  AI Platform (Central)  2025  multi-tenant AI search & doc ingestion (EG)',
    '02  ArcSync                2025  Electron+React desktop agent — AI Build Challenge prize',
    '03  QMS                    2025  React micro-frontend, Turbo Repo monorepo (EG)',
    '04  Legacy System Revival  2024  .NET Web API rebuild, clean repository pattern (EG)',
  ].join('\n'),

  'resume.txt': [
    'EXPERIENCE',
    '  Aug 2024 — Present   Software Developer @ EG, Mangalore',
    '',
    '  - Co-architected multi-tenant AI platform (ASP.NET Core 10,',
    '    Semantic Kernel, pgvector, Azure Service Bus).',
    '  - Built ArcSync: Electron+React desktop agent integrating Figma MCP,',
    '    Jira, Confluence, and Azure OpenAI. Won AI Build Challenge.',
    '  - Built async document translation pipeline (Azure Document Intelligence).',
    '  - Worked across 4 codebases with 93% merge rate.',
    '',
    'EDUCATION',
    '  Dec 2020 — 2024   B.E. Computer Science, NMAMIT, Nitte — CGPA: 9.06',
    '',
    'STACK',
    '  React.js, TypeScript, .NET 10, ASP.NET Core, Azure OpenAI,',
    '  Semantic Kernel, pgvector, Zustand, TanStack, shadcn/ui, Docker.',
  ].join('\n'),

  'contact.txt': [
    'email     aneeshram19@gmail.com',
    'github    github/aneeshram-01',
    'linkedin  linkedin/aneeshram',
    'phone     +91 7204713308',
  ].join('\n'),

  '.secrets': 'nice try.',
};

const ASCII =
` █████  ███▄    █ ▓█████ ▓█████   ██████  ██░ ██
▒██▀ ██▒██ ▀█   █ ▓█   ▀ ▓█   ▀ ▒██    ▒ ▓██░ ██▒
▒██    ▀▓██  ▀█ ██▒▒███   ▒███   ░ ▓██▄   ▒██▀▀██░
░██████░▒██░   ▓██░░▒████▒░▒████▒▒██████▒▒░▓█ ░██
░ ▒░▓  ░░ ▒░   ▒ ▒ ░░ ▒░ ░░░ ▒░ ░▒ ▒▓▒ ▒ ░ ▒ ░░`;

const HELP = [
  'available commands',
  '  help              show this',
  '  about             who is this guy',
  '  projects          list selected work',
  '  resume            cv / experience',
  '  contact           how to reach me',
  '  ls                list files',
  '  cat <file>        print file',
  '  whoami            user info',
  '  date              current time',
  '  theme [light|dark]    toggle theme',
  '  mode  [os|web]        switch mode',
  '  ask <question>    ask the AI about Aneesh (offline in this build)',
  '  sudo <anything>   nope',
  '  clear             clear screen',
  '  exit              close window',
];

interface HistoryLine { kind: string; text: string; }

interface Props { themeApi: DesktopApi; }

export default function Terminal({ themeApi }: Props) {
  const [history, setHistory] = useState<HistoryLine[]>([
    { kind: 'ascii', text: ASCII },
    { kind: 'out', text: 'Aneesh.term v2.0 — type `help` for commands, or `ask <question>` to chat.' },
    { kind: 'out', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [past, setPast] = useState<string[]>([]);
  const [pIdx, setPIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 60); }, []);

  function push(...items: HistoryLine[]) { setHistory((h) => [...h, ...items]); }

  async function run(rawIn: string) {
    const raw = rawIn.trim();
    if (!raw) { push({ kind: 'prompt', text: '' }); return; }
    push({ kind: 'prompt', text: raw });
    setPast((p) => [...p, raw]); setPIdx(-1);

    const [cmd, ...rest] = raw.split(/\s+/);
    const arg = rest.join(' ');

    switch (cmd) {
      case 'help':
      case '?':
        HELP.forEach((l) => push({ kind: 'out', text: l }));
        break;
      case 'about':    push({ kind: 'out', text: FS['about.txt'] }); break;
      case 'projects': push({ kind: 'out', text: FS['projects.txt'] }); break;
      case 'resume':   push({ kind: 'out', text: FS['resume.txt'] }); break;
      case 'contact':  push({ kind: 'out', text: FS['contact.txt'] }); break;
      case 'ls':
        push({ kind: 'out', text: Object.keys(FS).join('   ') });
        break;
      case 'cat':
        if (!arg) { push({ kind: 'err', text: 'cat: missing file' }); break; }
        if (FS[arg] === undefined) { push({ kind: 'err', text: `cat: ${arg}: no such file` }); break; }
        push({ kind: 'out', text: FS[arg] });
        break;
      case 'whoami':
        push({ kind: 'out', text: 'guest@aneesh.dev — drop a note: aneeshram19@gmail.com' });
        break;
      case 'date':
        push({ kind: 'out', text: new Date().toString() });
        break;
      case 'theme': {
        const t = arg || (themeApi.getTheme() === 'dark' ? 'light' : 'dark');
        if (t !== 'light' && t !== 'dark') { push({ kind: 'err', text: 'theme: light|dark' }); break; }
        themeApi.setTheme(t as 'light' | 'dark');
        push({ kind: 'ok', text: `theme set: ${t}` });
        break;
      }
      case 'mode': {
        const m = arg || (themeApi.getMode() === 'os' ? 'web' : 'os');
        if (m !== 'os' && m !== 'web') { push({ kind: 'err', text: 'mode: os|web' }); break; }
        themeApi.setMode(m as 'os' | 'web');
        push({ kind: 'ok', text: `mode: ${m}` });
        break;
      }
      case 'sudo':
        push({ kind: 'err', text: 'sudo: aneesh is not in the sudoers file. This incident will be reported.' });
        break;
      case 'clear': setHistory([]); break;
      case 'exit': themeApi.closeApp('terminal'); break;
      case 'ask': {
        if (!arg) { push({ kind: 'err', text: 'ask: usage: ask <question>' }); break; }
        push({ kind: 'dim', text: 'thinking…' });
        setBusy(true);
        try {
          const reply = await complete(arg);
          setHistory((h) => h.filter((it) => it.text !== 'thinking…'));
          push({ kind: 'accent', text: '↳ ' + reply.trim() });
        } catch {
          setHistory((h) => h.filter((it) => it.text !== 'thinking…'));
          push({ kind: 'err', text: 'ask: model unreachable. (email aneeshram19@gmail.com)' });
        }
        setBusy(false);
        break;
      }
      default:
        push({ kind: 'err', text: `${cmd}: command not found. try \`help\`.` });
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const v = input;
      setInput('');
      run(v);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (past.length === 0) return;
      const next = pIdx < 0 ? past.length - 1 : Math.max(0, pIdx - 1);
      setPIdx(next); setInput(past[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (pIdx < 0) return;
      const next = pIdx + 1;
      if (next >= past.length) { setPIdx(-1); setInput(''); }
      else { setPIdx(next); setInput(past[next]); }
    } else if (e.key === 'Escape') {
      themeApi.closeApp('terminal');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault(); setHistory([]);
    }
  }

  return (
    <div className="term" ref={scrollRef} onClick={() => inputRef.current?.focus()}>
      {history.map((it, i) => {
        if (it.kind === 'ascii') return <pre key={i} className="line ascii" style={{ margin: 0 }}>{it.text}</pre>;
        if (it.kind === 'prompt') return (
          <div key={i} className="line prompt-line">
            <span className="prompt">aneesh@dev:~$</span>
            <span>{it.text}</span>
          </div>
        );
        return <div key={i} className={`line ${it.kind || 'out'}`}>{it.text}</div>;
      })}
      <div className="prompt-line">
        <span className="prompt">aneesh@dev:~$</span>
        <input
          ref={inputRef}
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          disabled={busy}
          aria-label="terminal input"
        />
      </div>
    </div>
  );
}
