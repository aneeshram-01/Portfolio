# Portfolio Migration — Claude Code Execution Plan

> **Aneeshram Bhat · portfolio.vercel.app**  
> Use this document in Claude Code (Opus mode) to plan and implement the migration end-to-end.

---

## Context

An existing portfolio has been prototyped as a zero-toolchain Claude Labs artifact (plain HTML + UMD React + Babel Standalone, no npm, no bundler). It needs to be migrated into a production-ready Next.js application and deployed to Vercel.

The original source files are in the project context and must be treated as the **design and logic reference** — preserve all visual behaviour, interactions, and UX exactly unless explicitly instructed otherwise below.

---

## Agreed Stack

| Concern         | Decision                                                                            |
| --------------- | ----------------------------------------------------------------------------------- |
| Framework       | Next.js 14 (App Router)                                                             |
| Language        | TypeScript (strict)                                                                 |
| Package manager | pnpm                                                                                |
| Styling         | SCSS with partial file split (migrated from hand-rolled CSS)                        |
| Fonts           | Google Fonts via `next/font/google` — Instrument Serif, JetBrains Mono, Inter Tight |
| Deployment      | Vercel free tier (`.vercel.app` domain initially)                                   |
| AI features     | UI preserved, `ask` command and Ask widget **stubbed** — no API calls at launch     |
| Content         | Real resume data (source of truth: resume attached below)                           |

---

## What Must Be Preserved Exactly

- Dual mode: **Desktop (OS simulation)** and **Web (scrollable)** — both modes fully functional
- Desktop: draggable windows, traffic lights (close/min/zoom), dock, desktop icons with grid snap and collision resolution, right-click context menu
- Theming: light/dark toggle, paper/glass variant, accent colour picker, wallpaper selector — all persisted to `localStorage`
- Terminal: all commands (`help`, `about`, `projects`, `resume`, `contact`, `ls`, `cat`, `whoami`, `date`, `theme`, `mode`, `sudo`, `clear`, `exit`) — command history (arrow up/down), Ctrl+L clear
- Mobile: desktop mode blocked with modal → redirect to Web mode; Web mode fully responsive
- Keyboard shortcuts: `⌘E` (toggle mode), `⌘D` (toggle dark), `⌘T` (open terminal), `⌘,` (settings), `⌘W` (close top window), `⌘.` (reorganise icons)
- TweaksPanel: all controls (variant, dark mode, wallpaper, accent, mode) functional
- Cookie banner (web mode) and system notification (desktop mode) — both with localStorage dismiss

---

## What Changes

### Sections — keep / cut / add

| Section                | Action            | Notes                                   |
| ---------------------- | ----------------- | --------------------------------------- |
| Hero / About           | ✅ Keep           | Rewrite content with real data          |
| Experience / CV        | ✅ Keep           | Reshape as timeline: 1 job + education  |
| Work Projects          | ✅ Keep (renamed) | Split into two sub-sections (see below) |
| Stack                  | ✅ Keep           | Split into 4 categories (see below)     |
| Certifications         | ✅ New section    | Two states: completed + in progress     |
| Ask me widget          | ✅ Keep UI        | AI call stubbed                         |
| Terminal `ask` command | ✅ Keep UI        | AI call stubbed                         |
| Writing / Blog         | ❌ Remove         | No blog content                         |
| Photos                 | ❌ Remove         | No photo content                        |
| Now / Currently        | ❌ Remove         | Replaced by real content sections       |

### Projects section split

**Sub-section A — Work Projects** (inside Experience section, not standalone Projects)
These are internal EG work and have no public links. Describe them under the EG experience entry as project cards or an expandable list. Do **not** create a separate top-level Projects section for these.

Projects to include under EG experience:

- AI Platform (Central) — ASP.NET Core 10, Semantic Kernel, pgvector, Azure Service Bus, Azure Document Intelligence, PostgreSQL, Docker, GitHub Actions
- ArcSync — Electron, React 18, Zustand, TanStack, C# Minimal APIs, Azure OpenAI, Figma MCP, Jira API, Confluence API — **Award: AI Build Challenge Consolation 1st Prize**
- Quality Management System (QMS) — React.js, Turbo Repo, Module Federation, TanStack, shadcn/ui, Zustand, Storybook, Jest
- Legacy System Revival — ASP.NET Core, C#, EF Core, MSSQL, React.js, shadcn/ui, TanStack

**Sub-section B — Personal Projects** (standalone top-level section)
Public projects with links. ArcSync is included here as well (it was open-sourced / submitted to a challenge). For each project show: title, short description, tech tags, and a link (GitHub repo, live demo, or a demo image/video). If a project has no public link, show it with `// repo private` label and no link.

For launch, populate with ArcSync and leave 2–3 placeholder slots clearly marked `// coming soon` so the section doesn't look empty. The user will fill these in.

### Stack categories

Split the flat stack list into 4 labelled groups:

| Group              | Technologies                                                                                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend           | React.js, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack (Query · Router · Forms), Vite, Module Federation, Turbo Repo, Vue.js 3                                     |
| Backend            | .NET 10 / C# 13, ASP.NET Core (Minimal APIs), Entity Framework Core 10, Vertical Slice Architecture, CQRS / MediatR, FluentValidation, PostgreSQL + pgvector                 |
| AI & Cloud (Azure) | Azure OpenAI · Semantic Kernel, Azure Document Intelligence, Azure AI Translation, Azure AI Search, Azure Service Bus, Azure Blob Storage, Azure Container Apps, Azure Bicep |
| DevOps & Tooling   | GitHub Actions (CI/CD), Docker, .NET Aspire, Electron, Storybook, xUnit, Jest                                                                                                |

### Certifications section (new)

**Completed:**

- HuggingFace: AI Agents Course (smolagents, LangGraph, LlamaIndex)
- Anthropic: Claude Code in Action · Claude Code 101 · Claude 101
- Microsoft AZ-900: Azure Fundamentals
- Udemy: .NET Web API (ASP.NET Core, Entity Framework Core, Repository Pattern, JWT Auth)
- Google: Foundations of Cybersecurity
- IBM: Introduction to Web Development with HTML, CSS, JavaScript · Developing Front-End Apps with React · Developing Back-End Apps with Node.js and Express

**In Progress / Planned:**

- Microsoft AI-102: Azure AI Engineer Associate
- Microsoft AZ-305: Azure Solutions Architect Expert (following AI-102)
- Anthropic: Claude Architect Certification (targeted)
- Object-Oriented Design Patterns: comprehensive video series (Strategy, Observer, Decorator, etc.)

Render completed certs as solid cards and in-progress certs as outlined/muted cards with a subtle `// in progress` or `// planned` label.

---

## Real Content — Source of Truth

All content below is taken from the actual resume. Use this verbatim.

### Personal info

- **Name:** P Aneeshram Bhat
- **Title:** Software Developer (Full-stack, React specialist)
- **Location:** Mangalore, India
- **Email:** aneeshram19@gmail.com
- **Phone:** +91 7204713308
- **GitHub:** (link in resume — use `github.com/aneeshram` as placeholder, user will correct)
- **LinkedIn:** (link in resume — use `linkedin.com/in/aneeshram` as placeholder, user will correct)
- **Domain:** `.vercel.app` at launch

### Hero copy (rewrite from placeholder)

```
Full-stack Software Engineer with nearly 2 years of experience building
production web applications and cloud-native systems. React.js specialist
with hands-on backend and Azure experience; currently co-building a
multi-tenant AI platform using Semantic Kernel, pgvector, and ASP.NET Core 10.
```

### Experience

**EG** · Software Developer · Aug 2024 – Present · Mangalore, India

Key bullets:

- Co-architected multi-tenant document ingestion and AI search features on a shared AI services platform using ASP.NET Core 10, Azure Service Bus, pgvector, and Microsoft Semantic Kernel; built the full ingestion worker pipeline.
- Built and shipped ArcSync, award-winning Electron + React desktop agent integrating Figma MCP, Jira, Confluence, and Azure OpenAI; automated frontend/backend story generation and bulk Jira backlog sync.
- Built async AI document translation pipeline supporting multiple extensions using Azure Document Intelligence and AI Translation.
- Architected the extensible settings module; config-driven routing utilities that became the foundation pattern for all subsequent feature modules.
- Delivered a full Wiki feature and contributed to an API endpoint migration across 20 files in the Enterprise monorepo.
- Revived a legacy system lost during handoff; reverse-engineered backend logic from an older DB schema and rebuilt the .NET Web API using clean repository pattern.
- Worked across 4 codebases with overall 93% merge rate.

### Education

**B.E., Computer Science and Engineering**
NMAM Institute of Technology (NMAMIT), Nitte — Udupi District, India
Dec 2020 – 2024 · CGPA: 9.06

### Terminal filesystem (`FS` object in `terminal.tsx`)

Update the static text files to reflect real data:

- `about.txt` → real name, role, location, profile summary
- `projects.txt` → ArcSync, AI Platform, QMS, Legacy Revival
- `resume.txt` → real experience + education + stack
- `contact.txt` → real email, real GitHub/LinkedIn placeholders

### Ask widget stub message

Replace the `window.claude.complete()` call with a stub that returns:

```
// AI assistant is offline in this build.
// Coming soon — email aneeshram19@gmail.com in the meantime.
```

Same stub in the terminal `ask` command.

---

## SCSS File Structure

Migrate `styles.css` to the following SCSS partial split. Do **not** change any visual output — this is a 1:1 port with added nesting, mixins, and organisation.

```
styles/
  _tokens.scss        CSS custom properties: light theme, dark theme, glass variant
  _mixins.scss        Reusable mixins: glass-surface(), font-mono(), shadow helpers
  _reset.scss         box-sizing, body, button, a baseline
  _topbar.scss        Topbar, mode switcher, clock, icon-btn, brand dot
  _desktop.scss       Desktop shell, wallpaper patterns, desktop icons, drag states
  _window.scss        Window chrome, titlebar, traffic lights, window-body scroll
  _dock.scss          Dock, dock items, running indicator, separator
  _terminal.scss      Terminal shell, lines (out/err/ok/accent/dim/ascii), prompt, input
  _web.scss           Web mode: hero, sections, CV rows, project list, stack cards, footer
  _apps.scss          Window app contents: about, projects, resume, writing, contact, settings, trash
  _overlays.scss      Cookie banner, system notification, mobile block modal, nudge
  _tweaks.scss        TweaksPanel, TweakSection, TweakToggle, TweakRadio, TweakSelect, TweakColor
  _responsive.scss    All @media breakpoints (720px, 600px)
  globals.scss        @use / @forward of all partials — imported once in app/layout.tsx
```

Key mixins to extract into `_mixins.scss`:

```scss
@mixin glass-surface($opacity: 86%) {
  background: color-mix(in oklab, var(--paper) #{$opacity}, transparent);
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  border: 0.5px solid var(--rule);
}

@mixin glass-topbar {
  background: color-mix(in oklab, var(--paper) 80%, transparent);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
}

@mixin hard-shadow($size: sm) { ... }  // maps to --shadow-sm/md/lg
@mixin font-mono { font-family: var(--font-mono); }
@mixin font-display { font-family: var(--font-display); }
```

---

## Next.js File Structure

```
/
├── app/
│   ├── layout.tsx          Root layout: fonts (next/font), metadata, globals.scss import
│   ├── page.tsx            Renders <App /> with 'use client'
│   └── globals.scss        Re-export of styles/globals.scss (or direct import path)
│
├── components/
│   ├── App.tsx             Root: mode/theme/tweaks state, topbar, mode routing
│   ├── Desktop.tsx         Window manager, desktop icons, dock, context menu
│   ├── Web.tsx             Scrollable web view, all sections
│   ├── Terminal.tsx        Terminal emulator
│   ├── TweaksPanel.tsx     Tweaks panel + all Tweak* sub-components
│   │
│   └── apps/
│       ├── AboutApp.tsx
│       ├── ProjectsApp.tsx
│       ├── ResumeApp.tsx
│       ├── ContactApp.tsx
│       ├── SettingsApp.tsx
│       ├── TrashApp.tsx
│       └── ProjectDetail.tsx
│
├── lib/
│   ├── data.ts             All typed content: PROJECTS, STACK, CV, CERTS, POSTS(empty)
│   └── claude.ts           Stubbed complete() function — returns offline message
│
├── styles/
│   ├── _tokens.scss
│   ├── _mixins.scss
│   ├── _reset.scss
│   ├── _topbar.scss
│   ├── _desktop.scss
│   ├── _window.scss
│   ├── _dock.scss
│   ├── _terminal.scss
│   ├── _web.scss
│   ├── _apps.scss
│   ├── _overlays.scss
│   ├── _tweaks.scss
│   ├── _responsive.scss
│   └── globals.scss
│
├── public/
│   └── (favicon, og-image placeholder)
│
├── next.config.ts
├── tsconfig.json
├── package.json            pnpm
└── .env.local.example      ANTHROPIC_API_KEY= (empty placeholder for future use)
```

---

## TypeScript Types

Define these in `lib/data.ts`:

```ts
export interface Project {
  id: string;
  num: string;
  title: string;
  year: string;
  desc: string;
  tag: string;
  tech: string[];
  link?: string; // undefined = no public link
  linkLabel?: string; // 'GitHub' | 'Live' | 'Demo' | '// repo private'
  award?: string; // e.g. 'AI Build Challenge · Consolation 1st Prize'
  isPersonal: boolean; // true = Personal Projects section; false = Work (under Experience)
}

export interface CvEntry {
  when: string;
  role: string;
  where: string;
  bullets: string[];
  type: "work" | "education";
}

export interface StackGroup {
  label: string;
  items: string[];
}

export interface Cert {
  title: string;
  issuer: string;
  status: "completed" | "in-progress" | "planned";
}
```

---

## `'use client'` Boundary Strategy

Next.js App Router is server-first. Every component that uses `useState`, `useEffect`, `localStorage`, event handlers, or browser APIs needs `'use client'` at the top.

For this portfolio, the cleanest approach is:

- Mark `app/page.tsx` as `'use client'` and render `<App />` from it
- All components under `components/` are client components by inheritance — no need to add `'use client'` to each one individually
- `lib/data.ts` and `lib/claude.ts` are pure modules — no directive needed

The only server component is `app/layout.tsx` (metadata, font injection, HTML shell).

---

## SEO — Metadata in `app/layout.tsx`

```ts
export const metadata: Metadata = {
  title: "Aneeshram Bhat — Software Developer",
  description:
    "Full-stack Software Engineer building production web apps and cloud-native systems. React specialist with Azure and AI platform experience. Based in Mangalore, India.",
  keywords: [
    "software developer",
    "React",
    "ASP.NET Core",
    "Azure",
    "Semantic Kernel",
    "full-stack",
    "Mangalore",
  ],
  openGraph: {
    title: "Aneeshram Bhat — Software Developer",
    description:
      "Full-stack engineer · React · Azure · AI platforms · Mangalore, India",
    type: "website",
  },
};
```

---

## `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SCSS support is built-in with 'sass' installed — no extra config needed
  // No rewrites or API routes at launch (AI stubbed)
};

export default nextConfig;
```

---

## Execution Phases

### Phase 1 — Scaffold

1. `pnpm create next-app@latest aneesh-portfolio --typescript --app --no-tailwind --no-eslint --src-dir=no`
2. `cd aneesh-portfolio`
3. `pnpm add sass`
4. Delete boilerplate: `app/page.tsx` contents, `app/globals.css`
5. Create folder structure: `components/`, `components/apps/`, `lib/`, `styles/`
6. Create `.env.local.example` with `ANTHROPIC_API_KEY=` comment

### Phase 2 — Data layer

1. Create `lib/data.ts` with all typed constants — real resume content
2. Create `lib/claude.ts` with stubbed `complete()` returning offline message
3. No `window.*` globals anywhere — all data imported directly

### Phase 3 — SCSS migration

1. Create all 13 SCSS partials under `styles/`
2. Port every rule from the original `styles.css` into the correct partial
3. Add nesting, extract mixins — no visual changes
4. Create `styles/globals.scss` that `@use`s all partials
5. Import `styles/globals.scss` in `app/layout.tsx`
6. Verify: load app, both modes should look identical to original

### Phase 4 — Component migration

Migrate in dependency order (leaf components first):

1. `components/TweaksPanel.tsx` — no dependencies
2. `components/Terminal.tsx` — depends on `lib/data.ts`, `lib/claude.ts`
3. `components/apps/AboutApp.tsx` — depends on `lib/data.ts`
4. `components/apps/ProjectsApp.tsx`
5. `components/apps/ResumeApp.tsx`
6. `components/apps/ContactApp.tsx`
7. `components/apps/SettingsApp.tsx`
8. `components/apps/TrashApp.tsx`
9. `components/apps/ProjectDetail.tsx`
10. `components/Desktop.tsx` — depends on all apps, Terminal
11. `components/Web.tsx` — depends on `lib/data.ts`, `lib/claude.ts` (AskWidget stub)
12. `components/App.tsx` — depends on Desktop, Web, TweaksPanel

For each component:

- Remove `window.` globals — import from `lib/data.ts` instead
- Add TypeScript types for all props
- Remove `window.X = X` export pattern — use ES module exports
- Replace `React.useState` / `React.useEffect` with direct imports (`import { useState, useEffect } from 'react'`)

### Phase 5 — Next.js wiring

1. `app/layout.tsx` — metadata, `next/font/google` for all 3 fonts, import `styles/globals.scss`, set `lang="en"`, `data-theme` and `data-variant` defaults on `<html>`
2. `app/page.tsx` — `'use client'`, render `<App />`
3. Verify `localStorage` access is guarded with `typeof window !== 'undefined'` checks (SSR safety) — or use `'use client'` + `useEffect` pattern

### Phase 6 — Content + QA

1. Confirm all real content is in `lib/data.ts` and rendered correctly in both modes
2. Test Desktop mode: open/close/drag all windows, terminal all commands, theme toggle, wallpaper change, mode switch
3. Test Web mode: all sections present, correct order, mobile responsive
4. Test mobile: desktop block modal appears, web mode works at 375px
5. Confirm `ask` stub works in both terminal and ask widget — shows offline message, no errors
6. Run `pnpm build` — zero TypeScript errors, zero build warnings
7. Deploy to Vercel: `vercel --prod` or push to GitHub with Vercel integration

---

## Known Gotchas

1. **`localStorage` in App Router** — `localStorage` is not available during SSR. Any access must be inside `useEffect` or guarded with `typeof window !== 'undefined'`. The original code accesses it in `useState` initialisers — these must be moved to `useEffect` with a hydration-safe pattern.

2. **`data-theme` / `data-variant` flash** — The theme is stored in localStorage and applied via `document.documentElement.dataset`. In Next.js this can cause a flash of wrong theme on first load. Mitigation: inline script in `app/layout.tsx` that reads localStorage and sets the `data-theme` attribute before React hydrates (same pattern as next-themes).

3. **`color-mix(in oklab, ...)` CSS** — This is a modern CSS feature supported in all current browsers. No polyfill needed. Verify it works in the target browsers.

4. **SCSS `@use` vs `@import`** — Use `@use` (not the deprecated `@import`) for all partial imports in `globals.scss`.

5. **Font loading** — Replace the Google Fonts `<link>` tags in `index.html` with `next/font/google`. Apply fonts as CSS variables (e.g. `--font-display`, `--font-mono`, `--font-body`) to match what the SCSS tokens already reference.

6. **`window.__desktopApi`** — The original code sets a global `window.__desktopApi` for cross-component imperative calls. In the migrated version, prefer passing the `api` object via props or React context. If keeping the global for now, guard with `typeof window !== 'undefined'`.

7. **`window.TWEAK_DEFAULTS`** — Currently set inline in `index.html`. In Next.js, move this to a constant in `components/App.tsx`.

8. **The `useTweaks` hook** — Currently lives in `tweaks-panel.jsx` and uses `window.parent.postMessage` for the Labs edit-mode protocol. Remove the postMessage calls entirely in the migrated version — they were specific to the Claude Labs iframe environment and will do nothing (or cause errors) in a standalone deployment.

---

## Out of Scope (future phases)

- AI assistant: wire `lib/claude.ts` to a real `/api/ask` Next.js route with `ANTHROPIC_API_KEY` from Vercel env vars
- Custom domain
- Personal projects section: add real projects beyond ArcSync placeholder
- OG image: generate a real `opengraph-image.tsx` with Next.js image generation
- Analytics: Vercel Analytics (free, privacy-friendly, one line to add)

---

## Reference Files

The following files from the original prototype are the implementation reference. Read them before starting each phase:

| File               | Reference for                                                                          |
| ------------------ | -------------------------------------------------------------------------------------- |
| `app.jsx`          | Root App component, theme/mode state, topbar, keyboard shortcuts, TweaksPanel wiring   |
| `desktop.jsx`      | Window manager, draggable icons, dock, context menu, all desktop logic                 |
| `web.jsx`          | Web mode sections, AskWidget, hero, CV data shape, footer                              |
| `apps.jsx`         | All window app content components, PROJECTS/STACK/POSTS data shape                     |
| `terminal.jsx`     | Terminal FS object, all commands, history navigation, ASCII art                        |
| `tweaks-panel.jsx` | TweaksPanel, useTweaks hook, all Tweak\* components — remove postMessage calls         |
| `styles.css`       | Complete styling reference — every class, variable, and media query to migrate to SCSS |
