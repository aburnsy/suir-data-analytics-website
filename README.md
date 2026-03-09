# Suir Data Analytics Website

Static website for Suir Data Analytics - helping Tipperary, Kilkenny & Laois SMEs with automation and custom software.

## Tech Stack

- **Framework**: Astro (static site generator)
- **Styling**: Tailwind CSS
- **Hosting**: Netlify (free tier)
- **Forms**: Netlify Forms (free tier - 100 submissions/month)
- **Analytics**: Google Analytics 4

## Local Development Setup

### Prerequisites
- Node.js 18+ and npm installed
- Git installed

### Getting Started

1. Clone the repository:
```bash
git clone https://github.com/aburnsy/suir-data-analytics-website.git
cd suir-data-analytics-website
```

2. Install Astro and dependencies:
```bash
npm create astro@latest . -- --template minimal --install --git --typescript strict
npm install -D tailwindcss @astrojs/tailwind
npx astro add tailwind
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:4321 in your browser

## Project Structure

```
/
├── public/          # Static assets (images, fonts, favicon)
├── src/
│   ├── components/  # Reusable UI components
│   ├── layouts/     # Page layouts
│   ├── pages/       # Route pages (index.astro = homepage)
│   └── styles/      # Global styles
├── astro.config.mjs # Astro configuration
└── package.json
```

## Deployment

This repo is connected to Netlify for automatic deployments:
- Push to `main` branch → automatic deploy to production
- Pull requests get preview deployments

### Netlify Setup (One-time)
1. Go to https://app.netlify.com
2. "Add new site" → "Import an existing project"
3. Connect to this GitHub repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy!

Your site will be live at: `https://[random-name].netlify.app`
Custom domain can be added later in Netlify settings.

## Available Commands

| Command           | Action                                       |
|-------------------|----------------------------------------------|
| `npm run dev`     | Start dev server at `localhost:4321`         |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview production build locally             |

## Content Structure

### Pages to Build
- `/` - Homepage (Hero, services overview, mini cases, CTAs)
- `/services` - Services overview with 4 core offerings
- `/services/automation` - Business Process Automation details
- `/services/software` - Custom Software Development details
- `/services/data-analytics` - Data & Reporting details
- `/services/ai` - AI & Intelligent Automation details
- `/case-studies` - Case studies listing
- `/case-studies/[slug]` - Individual case study pages
- `/about` - About Suir Data Analytics
- `/contact` - Contact form and info
- `/blog` - Blog listing
- `/blog/[slug]` - Individual blog posts

## Target Audience

Tipperary, Kilkenny & Laois SMEs with:
- Manual processes that need automation
- Custom software needs (off-the-shelf doesn't fit)
- Data trapped in silos needing dashboards
- Repetitive tasks suitable for AI/automation

## Key Messaging

- **Local expertise**: Face-to-face, understanding regional business challenges
- **Affordable & phased**: Start small, prove ROI, scale up
- **Practical solutions**: Focus on outcomes, not enterprise complexity

---

Built with ❤️ in Ireland
