# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Critical: this is Next.js 16, not the Next.js in your training data

This project runs **Next.js 16.2.6** (see `package.json`). Many App Router APIs, conventions, and file structures differ from older versions you may know. Version-matched documentation is bundled at `node_modules/next/dist/docs/` — treat it as the source of truth and read the relevant guide before writing any Next.js code. The docs mirror the structure of nextjs.org/docs:

- `01-app/01-getting-started/`, `01-app/02-guides/`, `01-app/03-api-reference/` — App Router
- `02-pages/` — Pages Router
- `03-architecture/` — compiler, fast refresh, supported browsers

Notable APIs in this version that likely conflict with training data:
- **Cache Components / `use cache`** — directive-based caching of async components and functions (`01-app/02-guides/caching-without-cache-components.md`, `migrating-to-cache-components.md`).
- **`unstable_instant` route export** — opt a route into build- and dev-time validation that it produces an instant static shell at every entry point. Suspense boundaries alone do not guarantee instant client navigation; a misplaced boundary silently blocks it. See `01-app/02-guides/instant-navigation.md`. Opt a too-dynamic layout out with `export const unstable_instant = false`.
- `params` (and `searchParams`) are Promises that must be awaited.

## Commands

This repo uses **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`).

- `pnpm dev` — start the dev server at http://localhost:3000
- `pnpm build` — production build (also runs instant-navigation validation for routes that export `unstable_instant`)
- `pnpm start` — serve the production build

There is no lint or test script configured yet. Type checking happens via `tsc` (strict mode, `noEmit`); `pnpm build` will surface type errors.

## Structure

App Router project. Source lives in `app/`:
- `app/layout.tsx` — root layout; loads Geist fonts via `next/font/google` and wraps all pages.
- `app/page.tsx` — home page (currently the create-next-app starter).
- `app/globals.css`, `app/*.module.css` — global styles and CSS Modules.

The `@/*` path alias maps to the project root (`tsconfig.json`). Static assets are served from `public/`.
