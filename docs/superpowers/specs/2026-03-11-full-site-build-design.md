# Suir Data Analytics — Full Site Build Design

## Overview

Complete build of the Suir Data Analytics marketing website: a static Astro site targeting SMEs in Tipperary, Kilkenny, and Laois, Ireland. Covers all 13 GitHub issues — components, pages, content, SEO, lead magnets, blog, and pre-launch QA.

## Business Context

- **Owner**: Andy Burns — 14+ years data engineering experience (Optum, JP Morgan, Citi, First Derivatives)
- **Positioning**: Independent consultancy, local presence in Tipperary, affordable phased approach for SMEs
- **Contact**: andy@suirda.ie, 6 Leighton Manor, Two Mile Borris, Co. Tipperary
- **Booking**: https://calendly.com/andy_burns/30min
- **Content approach**: Realistic placeholders derived from Andy's CV; case studies inspired by real achievements

## Component Architecture

### BaseLayout (`src/layouts/BaseLayout.astro`)
- Props: `title`, `description`, `ogImage`, `structuredData`, `canonicalUrl`
- Contains: `<head>` (meta, OG tags, GA4 placeholder, canonical), `<Header />`, `<slot />`, `<Footer />`
- Title format: `{pageTitle} | Suir Data Analytics — Tipperary, Kilkenny & Laois`

### Components (`src/components/`)
| Component | Purpose |
|-----------|---------|
| `Header.astro` | Sticky nav, text logo, mobile hamburger, links: Home, Services, Case Studies, About, Blog, Contact |
| `Footer.astro` | Contact info, quick links, copyright |
| `CTASection.astro` | Reusable CTA banner, configurable heading/text/button. Primary → Calendly, secondary → /contact |
| `ServiceCard.astro` | Icon + title + description + link |
| `CaseStudyCard.astro` | Client type, challenge summary, key metric, link |
| `BlogPostCard.astro` | Title, date, excerpt, link |
| `SEO.astro` | JSON-LD structured data (LocalBusiness, Service, Article, BreadcrumbList) |

## Page Structure

```
src/pages/
├── index.astro                           # Homepage (refactored)
├── contact.astro                         # Contact (refactored)
├── about.astro                           # About page
├── services/
│   ├── index.astro                       # Services overview
│   ├── business-automation.astro
│   ├── custom-software.astro
│   ├── data-analytics.astro
│   └── ai-automation.astro
├── case-studies/
│   ├── index.astro                       # Case studies listing
│   ├── manufacturing-automation.astro
│   ├── retail-software.astro
│   └── professional-services.astro
├── blog/
│   ├── index.astro                       # Blog listing
│   ├── manual-tasks-costing-smes.astro
│   ├── when-need-custom-software.astro
│   ├── cloud-automation-affordable.astro
│   ├── what-10k-buys-custom-software.astro
│   └── why-local-partner-matters.astro
├── resources/
│   ├── automation-guide.astro            # Lead magnet landing page
│   └── software-decision-guide.astro     # Lead magnet landing page
└── 404.astro                             # Custom 404
```

## SEO & Technical Infrastructure

- **Sitemap**: Auto-generated via `@astrojs/sitemap`
- **robots.txt**: Allow all, reference sitemap
- **Structured data**: JSON-LD — `LocalBusiness` (all pages), `Service` (service pages), `Article` (blog posts), `BreadcrumbList` (all except homepage)
- **GA4**: Script placeholder with `G-XXXXXXXXXX`
- **Search Console**: Verification meta tag placeholder
- **Netlify**: Remove SPA fallback redirect, keep build config
- **Fonts**: System font stack (no external fonts)
- **Images**: Lazy-load below fold

## Target Keywords (Issue #13)

### Primary
- "AI Tipperary", "AI automation Tipperary", "business automation Tipperary"
- "custom software Tipperary", "data analytics Tipperary"
- County variants for Kilkenny and Laois

### Secondary
- "AI automation South East Ireland", "business automation Ireland SME"
- "custom software development Ireland"

### Long-tail
- "AI automation for small business Tipperary"
- "affordable custom software Kilkenny"
- "data analytics for SMEs Ireland"

## Content Strategy

### About Page
- Bio: 14+ years, Optum/JP Morgan/Citi/First Derivatives
- Education: B.Sc Quantitative Finance, DCU (1:1)
- Certifications: AWS Solutions Architect, Databricks (3x), Qlik Sense
- Positioning: Local Tipperary presence, face-to-face, ROI-focused, not enterprise pricing

### Case Studies (plausible placeholders from CV)
1. **Manufacturing automation** — Tipperary manufacturer, automated reporting. Inspired by ingestion framework (76% refresh reduction)
2. **Retail custom software** — Kilkenny retailer, booking/loyalty system. Inspired by onboarding automation (95% reduction)
3. **Professional services workflow** — Laois firm, client onboarding. Inspired by SDLC automation (90% effort reduction)

### Blog Posts (5, 800-1500 words each)
1. "5 Manual Tasks Costing Tipperary SMEs Time and Money"
2. "When Does a Kilkenny Business Need Custom Software?"
3. "How Cloud-Based Automation Makes Enterprise Efficiency Affordable for Small Businesses"
4. "Real Cost Breakdown: What €10k Buys in Custom Software"
5. "Why Local Matters When Choosing an Automation Partner"

### Lead Magnets (2 landing pages)
1. "10 Processes Every SME Can Automate" — gated Netlify Form, placeholder PDF
2. "Custom Software vs Off-the-Shelf: Decision Guide" — gated Netlify Form, placeholder PDF

## Design Conventions (existing, maintained)
- Primary blue: `#0066cc` / `blue-600`, hover `blue-700`
- Text grays: `gray-600`, `gray-700`, `gray-900`, accent `green-600`
- Layout: `max-w-6xl` / `max-w-4xl`, section padding `py-16`/`py-20`
- Buttons: `bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700`
- Cards: `bg-white p-6 rounded-lg shadow-sm`
- Mobile-first, `md:` breakpoint

## Implementation Phases

### Phase 1 — Foundation & Components (Issues #1, #8)
- Extract BaseLayout, Header, Footer, CTASection
- Refactor index.astro and contact.astro
- Mobile hamburger menu
- Install @astrojs/sitemap, generate robots.txt
- Update netlify.toml
- Custom 404 page

### Phase 2 — Core Pages (Issues #2, #3, #5, #6)
- Refine homepage content with keywords
- Services index + 4 detail pages
- About page
- Update contact page (email, address, Calendly)

### Phase 3 — Case Studies & Blog (Issues #4, #10)
- Case studies index + 3 detail pages
- Blog index + 5 posts
- BlogPostCard and CaseStudyCard components

### Phase 4 — Lead Magnets (Issue #9)
- 2 landing pages with gated Netlify Forms
- Resources nav item

### Phase 5 — SEO & Polish (Issues #7, #13)
- Structured data on all pages
- OG tags, meta descriptions audit
- GA4 + Search Console placeholders
- Keyword optimization pass
- Accessibility check

### Phase 6 — Pre-Launch QA (Issues #11, #12)
- Link check, build verification
- Lighthouse audit
- Document remaining launch tasks
