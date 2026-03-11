# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Suir Data Analytics — a static marketing website for a B2B consultancy (business automation, custom software, data analytics) targeting SMEs in Tipperary, Kilkenny, and Laois, Ireland. Built with Astro, Tailwind CSS, and TypeScript. Deployed on Netlify.

## Commands

- `npm run dev` — Start dev server (localhost:4321)
- `npm run build` — Type-check with `astro check` then build static site to `dist/`
- `npm run preview` — Preview production build locally
- `astro check` — Run TypeScript/Astro type checking standalone

No test runner, linter, or formatter is configured.

## Architecture

- **Astro 4** static site generator with file-based routing (`src/pages/`)
- **Static output only** — no SSR, configured in `astro.config.mjs` with `output: 'static'`
- **Tailwind CSS 3** for styling via `@astrojs/tailwind` integration
- **TypeScript strict mode** — extends `astro/tsconfigs/strict`
- **Netlify deployment** — auto-deploys from `main`, publishes `dist/`. Contact form uses Netlify Forms (honeypot spam protection, `name="contact"`)

### Current structure

Two pages exist (`index.astro`, `contact.astro`). No components or layouts have been extracted yet — pages use inline HTML with Tailwind classes. Planned pages include `/services/*`, `/case-studies/*`, `/about`, and `/blog/*`.

## Design Conventions

- **Color palette**: Primary blue (`#0066cc` / `blue-600`), hover `blue-700`, text grays (`gray-600`, `gray-700`, `gray-900`), accent green (`green-600`)
- **Layout**: `max-w-6xl` or `max-w-4xl` centered containers, section padding `py-16`/`py-20`
- **Buttons**: `bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700`
- **Cards**: `bg-white p-6 rounded-lg shadow-sm`
- **Responsive**: Mobile-first with `md:` breakpoint for tablet/desktop
