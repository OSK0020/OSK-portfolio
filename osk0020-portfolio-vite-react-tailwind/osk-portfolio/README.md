# OSK0020 — Portfolio

A personal portfolio site built with **Vite + React + TypeScript + Tailwind CSS v4**, showcasing OSN (Observer Security Network) and independent side projects.

## Stack
- Vite
- React 19 + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- No external UI/animation libraries — the spotlight hover, terminal boot sequence, count-up stats, and scroll reveals are all hand-built (see `src/components`)

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## Structure

```
src/
  components/    UI building blocks (Nav, Hero, OsnSection, ProjectsSection, ServicesSection, Footer,
                 SpotlightCard, TerminalPanel, CountUp, Reveal, StatusPill)
  data/          projects.ts — all project copy/links/tech in one place, easy to edit
  hooks/         useReveal.ts — IntersectionObserver-based scroll reveal hook
  index.css      Tailwind v4 theme tokens (colors, fonts) + base styles
```

## Before you deploy

- Replace the placeholder email in `src/components/Footer.tsx` (`hello@example.com`) with your real contact address.
- All project links already point to your real live/GitHub URLs — double check they still resolve before publishing.

## Deploying

This is a static Vite app — deploys as-is to Vercel, Netlify, GitHub Pages, or any static host. On Vercel: framework preset "Vite", build command `npm run build`, output directory `dist`.
