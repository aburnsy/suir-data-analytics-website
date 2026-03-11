# Suir Data Analytics Full Site Build — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Suir Data Analytics marketing website — components, 20+ pages, SEO, blog, lead magnets, and pre-launch QA — covering all 13 GitHub issues.

**Architecture:** Astro 4 static site with Tailwind CSS 3 and TypeScript. Shared `BaseLayout` wraps every page with meta/OG/GA4/structured data. Reusable components (`Header`, `Footer`, `CTASection`, cards) eliminate duplication. File-based routing with static `.astro` pages. Deployed to Netlify.

**Tech Stack:** Astro 4, Tailwind CSS 3, TypeScript (strict), @astrojs/sitemap, Netlify Forms, JSON-LD structured data.

**Spec:** `docs/superpowers/specs/2026-03-11-full-site-build-design.md`

---

## Chunk 1: Foundation & Components (Issues #1, #8 partial)

### Task 1: Install @astrojs/sitemap and configure Astro

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`

- [ ] **Step 1: Install @astrojs/sitemap**

Run:
```bash
cd "C:\Users\andre\OneDrive\Documents\Development\suir-data-analytics-website" && npm install @astrojs/sitemap
```

- [ ] **Step 2: Update astro.config.mjs**

Replace the entire file with:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.suirda.ie',
  integrations: [tailwind(), sitemap()],
  output: 'static',
  build: {
    format: 'file'
  }
});
```

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: Build succeeds, sitemap.xml generated in `dist/`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json astro.config.mjs
git commit -m "feat: add @astrojs/sitemap integration and configure site URL"
```

---

### Task 2: Create robots.txt

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: Create robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://www.suirda.ie/sitemap-index.xml
```

- [ ] **Step 2: Commit**

```bash
git add public/robots.txt
git commit -m "feat: add robots.txt with sitemap reference"
```

---

### Task 3: Fix netlify.toml — remove SPA redirect

**Files:**
- Modify: `netlify.toml`

- [ ] **Step 1: Replace netlify.toml**

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

Remove the `[[redirects]]` block entirely — Astro generates individual HTML files per page, so the SPA fallback is incorrect and would mask 404s.

- [ ] **Step 2: Commit**

```bash
git add netlify.toml
git commit -m "fix: remove SPA redirect from Netlify config (Astro uses file-based routing)"
```

---

### Task 4: Create BaseLayout component

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create the layout**

```astro
---
interface Props {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
}

const {
  title,
  description,
  canonicalUrl,
  ogImage = '/og-default.png',
  structuredData,
} = Astro.props;

const fullTitle = `${title} | Suir Data Analytics — Tipperary, Kilkenny & Laois`;
const canonical = canonicalUrl || Astro.url.href;
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{fullTitle}</title>
    <meta name="description" content={description}>
    <link rel="canonical" href={canonical}>

    <!-- Open Graph -->
    <meta property="og:title" content={fullTitle}>
    <meta property="og:description" content={description}>
    <meta property="og:image" content={ogImage}>
    <meta property="og:url" content={canonical}>
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_IE">

    <!-- Google Analytics 4 (replace G-XXXXXXXXXX with real ID) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script is:inline>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    </script>

    <!-- Google Search Console verification (replace with real code) -->
    <meta name="google-site-verification" content="VERIFICATION_CODE_HERE">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <!-- Structured Data -->
    {structuredData && (
      <script type="application/ld+json" set:html={JSON.stringify(structuredData)} />
    )}
</head>
<body class="bg-gray-50">
    <slot />
</body>
</html>
```

- [ ] **Step 2: Verify no type errors**

Run: `npx astro check`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: create BaseLayout with meta, OG, GA4, and structured data support"
```

---

### Task 5: Create Header component with mobile menu

**Files:**
- Create: `src/components/Header.astro`

- [ ] **Step 1: Create Header.astro**

```astro
---
interface Props {
  currentPath?: string;
}

const { currentPath = '' } = Astro.props;
const path = currentPath || Astro.url.pathname;

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];
---

<nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <div class="flex-shrink-0">
                <a href="/" class="text-2xl font-bold text-blue-600">Suir Data Analytics</a>
            </div>

            <!-- Desktop nav -->
            <div class="hidden md:flex space-x-8">
                {links.map(link => (
                    <a
                        href={link.href}
                        class:list={[
                            'hover:text-blue-600 transition',
                            path === link.href || (link.href !== '/' && path.startsWith(link.href))
                                ? 'text-blue-600 font-semibold'
                                : 'text-gray-700',
                        ]}
                    >
                        {link.label}
                    </a>
                ))}
            </div>

            <!-- Mobile hamburger -->
            <button
                id="mobile-menu-btn"
                class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                aria-label="Toggle menu"
                aria-expanded="false"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path id="hamburger-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    <path id="close-icon" class="hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>

    <!-- Mobile menu -->
    <div id="mobile-menu" class="hidden md:hidden bg-white border-t">
        <div class="px-4 py-3 space-y-2">
            {links.map(link => (
                <a
                    href={link.href}
                    class:list={[
                        'block py-2 px-3 rounded-lg transition',
                        path === link.href || (link.href !== '/' && path.startsWith(link.href))
                            ? 'text-blue-600 font-semibold bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-50',
                    ]}
                >
                    {link.label}
                </a>
            ))}
        </div>
    </div>
</nav>

<script is:inline>
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  btn.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    hamburger.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: create Header component with active link highlighting and mobile menu"
```

---

### Task 6: Create Footer component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create Footer.astro**

```astro
<footer class="bg-gray-900 text-gray-400 py-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-3 gap-8">
            <div>
                <h4 class="text-white font-semibold mb-4">Suir Data Analytics</h4>
                <p class="text-sm">
                    Business automation, custom software, data analytics, and AI solutions for SMEs in Tipperary, Kilkenny & Laois.
                </p>
                <p class="text-sm mt-3">
                    6 Leighton Manor, Two Mile Borris<br>
                    Co. Tipperary, Ireland
                </p>
            </div>
            <div>
                <h4 class="text-white font-semibold mb-4">Quick Links</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="/services" class="hover:text-white transition">Services</a></li>
                    <li><a href="/case-studies" class="hover:text-white transition">Case Studies</a></li>
                    <li><a href="/about" class="hover:text-white transition">About</a></li>
                    <li><a href="/blog" class="hover:text-white transition">Blog</a></li>
                    <li><a href="/contact" class="hover:text-white transition">Contact</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-white font-semibold mb-4">Contact</h4>
                <p class="text-sm">
                    Email: <a href="mailto:andy@suirda.ie" class="hover:text-white transition">andy@suirda.ie</a>
                </p>
                <p class="text-sm mt-2">
                    Phone: <a href="tel:+353870910661" class="hover:text-white transition">087 091 0661</a>
                </p>
                <p class="text-sm mt-2">
                    Serving Tipperary, Kilkenny, Laois<br>& surrounding South-East Ireland
                </p>
            </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Suir Data Analytics. All rights reserved.</p>
        </div>
    </div>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: create Footer component with contact info, links, and address"
```

---

### Task 7: Create CTASection component

**Files:**
- Create: `src/components/CTASection.astro`

- [ ] **Step 1: Create CTASection.astro**

```astro
---
interface Props {
  heading: string;
  text: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  bgClass?: string;
}

const {
  heading,
  text,
  primaryLabel = 'Book Your Free Process Review',
  primaryHref = 'https://calendly.com/andy_burns/30min',
  secondaryLabel,
  secondaryHref,
  bgClass = 'bg-white',
} = Astro.props;
---

<section class:list={['py-20', bgClass]}>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">{heading}</h2>
        <p class="text-xl text-gray-600 mb-8">{text}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
                href={primaryHref}
                target={primaryHref.startsWith('http') ? '_blank' : undefined}
                rel={primaryHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                class="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
                {primaryLabel}
            </a>
            {secondaryLabel && secondaryHref && (
                <a
                    href={secondaryHref}
                    class="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
                >
                    {secondaryLabel}
                </a>
            )}
        </div>
        <p class="text-gray-500 mt-4">
            Or email us: <a href="mailto:andy@suirda.ie" class="text-blue-600 hover:underline">andy@suirda.ie</a>
        </p>
    </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CTASection.astro
git commit -m "feat: create CTASection component with configurable headings and Calendly link"
```

---

### Task 8: Create ServiceCard component

**Files:**
- Create: `src/components/ServiceCard.astro`

- [ ] **Step 1: Create ServiceCard.astro**

```astro
---
interface Props {
  icon: string;
  title: string;
  description: string;
  href: string;
}

const { icon, title, description, href } = Astro.props;
---

<a href={href} class="block text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition group">
    <div class="text-4xl mb-4">{icon}</div>
    <h3 class="text-xl font-semibold mb-3 group-hover:text-blue-600 transition">{title}</h3>
    <p class="text-gray-600">{description}</p>
</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ServiceCard.astro
git commit -m "feat: create ServiceCard component"
```

---

### Task 9: Create CaseStudyCard component

**Files:**
- Create: `src/components/CaseStudyCard.astro`

- [ ] **Step 1: Create CaseStudyCard.astro**

```astro
---
interface Props {
  category: string;
  location: string;
  title: string;
  summary: string;
  metric: string;
  href: string;
}

const { category, location, title, summary, metric, href } = Astro.props;
---

<a href={href} class="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition group">
    <div class="text-blue-600 font-semibold mb-2">{category} | {location}</div>
    <h3 class="text-lg font-semibold mb-3 group-hover:text-blue-600 transition">{title}</h3>
    <p class="text-gray-600 mb-4">{summary}</p>
    <div class="text-2xl font-bold text-green-600">{metric}</div>
</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CaseStudyCard.astro
git commit -m "feat: create CaseStudyCard component"
```

---

### Task 10: Create BlogPostCard component

**Files:**
- Create: `src/components/BlogPostCard.astro`

- [ ] **Step 1: Create BlogPostCard.astro**

```astro
---
interface Props {
  title: string;
  date: string;
  excerpt: string;
  href: string;
}

const { title, date, excerpt, href } = Astro.props;
---

<a href={href} class="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition group">
    <time class="text-sm text-gray-500">{date}</time>
    <h3 class="text-lg font-semibold mt-1 mb-3 group-hover:text-blue-600 transition">{title}</h3>
    <p class="text-gray-600">{excerpt}</p>
    <span class="inline-block mt-3 text-blue-600 font-semibold">Read more →</span>
</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BlogPostCard.astro
git commit -m "feat: create BlogPostCard component"
```

---

### Task 11: Create SEO component for JSON-LD structured data

**Files:**
- Create: `src/components/SEO.astro`

- [ ] **Step 1: Create SEO.astro**

This component generates the LocalBusiness base schema. Pages pass additional schemas (Service, Article) via BaseLayout's `structuredData` prop.

```astro
---
/**
 * Generates the base LocalBusiness JSON-LD schema.
 * Import and use the `localBusinessSchema` object in pages
 * that need it, passing it to BaseLayout's structuredData prop.
 */
---

<Fragment />
```

Create a data file instead — `src/data/structured-data.ts`:

```typescript
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Suir Data Analytics',
  description: 'Business automation, custom software, data analytics, and AI solutions for SMEs in Tipperary, Kilkenny & Laois.',
  email: 'andy@suirda.ie',
  telephone: '+353870910661',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '6 Leighton Manor, Two Mile Borris',
    addressLocality: 'Two Mile Borris',
    addressRegion: 'Co. Tipperary',
    addressCountry: 'IE',
  },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'County Tipperary' },
    { '@type': 'AdministrativeArea', name: 'County Kilkenny' },
    { '@type': 'AdministrativeArea', name: 'County Laois' },
  ],
  url: 'https://www.suirda.ie',
};

export function serviceSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: localBusinessSchema,
    areaServed: localBusinessSchema.areaServed,
    url,
  };
}

export function articleSchema(
  title: string,
  description: string,
  url: string,
  datePublished: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    author: {
      '@type': 'Person',
      name: 'Andy Burns',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Suir Data Analytics',
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

- [ ] **Step 2: Verify no type errors**

Run: `npx astro check`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/data/structured-data.ts
git commit -m "feat: add structured data helpers (LocalBusiness, Service, Article, Breadcrumb)"
```

---

### Task 12: Refactor index.astro to use components

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Rewrite index.astro using BaseLayout, Header, Footer, components**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import CTASection from '../components/CTASection.astro';
import CaseStudyCard from '../components/CaseStudyCard.astro';
import { localBusinessSchema } from '../data/structured-data';
---

<BaseLayout
  title="Business Automation & Custom Software for SMEs"
  description="Helping Tipperary, Kilkenny & Laois SMEs automate workflows and build custom software that saves time and scales with growth. Local expertise, affordable solutions."
  structuredData={localBusinessSchema}
>
    <Header />

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-50 to-white py-20">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Helping Tipperary, Kilkenny & Laois SMEs Automate Workflows and Build Custom Software
                </h1>
                <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    We're a local data and software consultancy that turns manual processes into automated systems — affordably and without the enterprise price tag.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="https://calendly.com/andy_burns/30min" target="_blank" rel="noopener noreferrer" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Book a Free 30-Minute Process Review
                    </a>
                    <a href="/services" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition">
                        See What We Can Automate
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Three Core Value Props -->
    <section class="py-16 bg-white">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">How We Help Local SMEs</h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="text-center p-6">
                    <div class="text-4xl mb-4">⚡</div>
                    <h3 class="text-xl font-semibold mb-3">Business Automation That Pays for Itself</h3>
                    <p class="text-gray-600">
                        Automate invoice processing, reporting, inventory sync, and CRM workflows.
                        Typical ROI: 10+ hours saved per week within 3 months.
                    </p>
                </div>
                <div class="text-center p-6">
                    <div class="text-4xl mb-4">🛠️</div>
                    <h3 class="text-xl font-semibold mb-3">Custom Software for Unique Business Needs</h3>
                    <p class="text-gray-600">
                        Build bespoke job scheduling, quoting tools, customer portals, and integrations
                        that fit how your business actually works. From €5k for an MVP.
                    </p>
                </div>
                <div class="text-center p-6">
                    <div class="text-4xl mb-4">📊</div>
                    <h3 class="text-xl font-semibold mb-3">Phased, Cloud-Based Approach</h3>
                    <p class="text-gray-600">
                        Start small with a pilot project (€2k-5k). Prove ROI before expanding.
                        No massive upfront investment — scale as you grow.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Mini Case Studies -->
    <section class="py-16 bg-gray-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Recent Wins for Regional SMEs</h2>
            <div class="grid md:grid-cols-3 gap-8">
                <CaseStudyCard
                    category="Manufacturing"
                    location="Tipperary"
                    title="Automated Production Reporting"
                    summary="Built automated dashboards pulling data from production systems, cutting monthly reporting from 2 days to 2 hours."
                    metric="10 hours/week saved"
                    href="/case-studies/manufacturing-automation"
                />
                <CaseStudyCard
                    category="Retail"
                    location="Kilkenny"
                    title="Custom Loyalty & Booking System"
                    summary="Developed a custom loyalty program integrated with POS, enabling targeted promotions and online booking."
                    metric="25% increase in repeat business"
                    href="/case-studies/retail-software"
                />
                <CaseStudyCard
                    category="Professional Services"
                    location="Laois"
                    title="Client Onboarding Automation"
                    summary="Automated workflow from enquiry to contract to project kickoff, eliminating manual handoffs and email chasing."
                    metric="2 weeks → 3 days"
                    href="/case-studies/professional-services"
                />
            </div>
            <div class="text-center mt-10">
                <a href="/case-studies" class="text-blue-600 font-semibold hover:underline">View All Case Studies →</a>
            </div>
        </div>
    </section>

    <!-- Social Proof -->
    <section class="py-16 bg-blue-600 text-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-2xl font-semibold mb-4">
                Trusted by manufacturers, retailers, and service businesses across the South-East
            </h2>
            <p class="text-blue-100 text-lg">
                We're based locally in the Tipperary/Kilkenny/Laois region, so we understand the reality of running a business here —
                lean teams, tight budgets, and the need for solutions that work without disrupting operations.
            </p>
        </div>
    </section>

    <!-- Final CTA -->
    <CTASection
        heading="Ready to Automate Your Biggest Manual Headache?"
        text="Book a free 30-minute call. We'll map your biggest pain points and recommend 2-3 practical next steps."
    />

    <Footer />
</BaseLayout>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "refactor: rewrite homepage to use BaseLayout, Header, Footer, CTASection, CaseStudyCard"
```

---

### Task 13: Refactor contact.astro to use components

**Files:**
- Modify: `src/pages/contact.astro`

- [ ] **Step 1: Rewrite contact.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { localBusinessSchema } from '../data/structured-data';
---

<BaseLayout
  title="Contact Us"
  description="Get in touch with Suir Data Analytics. Book a free 30-minute process review to discuss your automation and software needs in Tipperary, Kilkenny & Laois."
  structuredData={localBusinessSchema}
>
    <Header />

    <section class="py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-6 text-center">Let's Talk About Your Automation Needs</h1>
            <p class="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
                Book a free 30-minute call or send us a message. We'll discuss your biggest manual headaches and recommend practical next steps.
            </p>

            <div class="grid md:grid-cols-2 gap-12">
                <!-- Contact Form -->
                <div class="bg-white p-8 rounded-lg shadow-sm">
                    <h2 class="text-2xl font-semibold mb-6">Send Us a Message</h2>
                    <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" class="space-y-4">
                        <input type="hidden" name="form-name" value="contact" />
                        <p class="hidden">
                            <label>Don't fill this out: <input name="bot-field" /></label>
                        </p>

                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input type="text" id="name" name="name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                        </div>
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input type="email" id="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                        </div>
                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="tel" id="phone" name="phone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                        </div>
                        <div>
                            <label for="company" class="block text-sm font-medium text-gray-700 mb-1">Company</label>
                            <input type="text" id="company" name="company" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                        </div>
                        <div>
                            <label for="interest" class="block text-sm font-medium text-gray-700 mb-1">Interested In</label>
                            <select id="interest" name="interest" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                                <option value="">Select an option</option>
                                <option value="automation">Business Automation</option>
                                <option value="software">Custom Software</option>
                                <option value="data">Data Analytics & Reporting</option>
                                <option value="ai">AI & Intelligent Automation</option>
                                <option value="not-sure">Not Sure / General Enquiry</option>
                            </select>
                        </div>
                        <div>
                            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                            <textarea id="message" name="message" rows="4" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"></textarea>
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                            Send Message
                        </button>
                    </form>
                </div>

                <!-- Contact Info Sidebar -->
                <div>
                    <div class="bg-blue-50 p-8 rounded-lg mb-8">
                        <h2 class="text-2xl font-semibold mb-4">Get In Touch</h2>
                        <div class="space-y-4">
                            <div>
                                <h3 class="font-semibold text-gray-900 mb-1">Email</h3>
                                <a href="mailto:andy@suirda.ie" class="text-blue-600 hover:underline">andy@suirda.ie</a>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 mb-1">Phone</h3>
                                <a href="tel:+353870910661" class="text-blue-600 hover:underline">087 091 0661</a>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 mb-1">Address</h3>
                                <p class="text-gray-700">6 Leighton Manor, Two Mile Borris<br>Co. Tipperary, Ireland</p>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 mb-1">Book a Call</h3>
                                <a href="https://calendly.com/andy_burns/30min" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                                    Schedule a free 30-minute process review →
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-8 rounded-lg shadow-sm">
                        <h3 class="text-xl font-semibold mb-4">What to Expect</h3>
                        <ul class="space-y-3 text-gray-700">
                            <li class="flex items-start">
                                <span class="text-blue-600 mr-2">✓</span>
                                <span>We'll respond within 1 business day</span>
                            </li>
                            <li class="flex items-start">
                                <span class="text-blue-600 mr-2">✓</span>
                                <span>Free 30-minute discovery call to understand your needs</span>
                            </li>
                            <li class="flex items-start">
                                <span class="text-blue-600 mr-2">✓</span>
                                <span>Honest assessment of what's possible and practical</span>
                            </li>
                            <li class="flex items-start">
                                <span class="text-blue-600 mr-2">✓</span>
                                <span>No hard sell — just practical recommendations</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <Footer />
</BaseLayout>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/contact.astro
git commit -m "refactor: rewrite contact page to use BaseLayout, Header, Footer with updated contact info"
```

---

### Task 14: Create 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create 404.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<BaseLayout
  title="Page Not Found"
  description="The page you're looking for doesn't exist."
>
    <Header />

    <section class="py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Page Not Found</h2>
            <p class="text-xl text-gray-600 mb-8">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <a href="/" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Back to Homepage
            </a>
        </div>
    </section>

    <Footer />
</BaseLayout>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds, `dist/404.html` exists

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: add custom 404 page"
```

---

### Task 15: Verify Phase 1 — full build check

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors. Sitemap generated. All pages render.

- [ ] **Step 2: Spot-check dist output**

Run: `ls dist/` — should see `index.html`, `contact.html`, `404.html`, `sitemap-index.xml`, `robots.txt`

---

## Chunk 2: Core Pages (Issues #2, #3, #5, #6)

### Task 16: Create services index page

**Files:**
- Create: `src/pages/services/index.astro`

- [ ] **Step 1: Create services/index.astro**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import ServiceCard from '../../components/ServiceCard.astro';
import CTASection from '../../components/CTASection.astro';
import { localBusinessSchema, breadcrumbSchema } from '../../data/structured-data';

const breadcrumbs = breadcrumbSchema([
  { name: 'Home', url: 'https://www.suirda.ie/' },
  { name: 'Services', url: 'https://www.suirda.ie/services' },
]);
---

<BaseLayout
  title="Services — Automation, Software, Data & AI"
  description="Business automation, custom software development, data analytics, and AI solutions for SMEs in Tipperary, Kilkenny & Laois. Affordable, phased approach."
  structuredData={breadcrumbs}
>
    <Header />

    <section class="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">What We Do</h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                We help SMEs in Tipperary, Kilkenny, and Laois save time, reduce costs, and grow through automation, custom software, data analytics, and AI.
            </p>
        </div>
    </section>

    <section class="py-16 bg-white">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 gap-8">
                <ServiceCard
                    icon="⚡"
                    title="Business Process Automation"
                    description="Eliminate manual data entry, automate reporting, and connect your systems. Typical ROI: 10+ hours saved per week."
                    href="/services/business-automation"
                />
                <ServiceCard
                    icon="🛠️"
                    title="Custom Software Development"
                    description="Bespoke web apps, customer portals, and internal tools built to fit how your business actually works. From €5k."
                    href="/services/custom-software"
                />
                <ServiceCard
                    icon="📊"
                    title="Data Analytics & Reporting"
                    description="Turn scattered data into clear dashboards and automated reports. Make better decisions with real-time visibility."
                    href="/services/data-analytics"
                />
                <ServiceCard
                    icon="🤖"
                    title="AI & Intelligent Automation"
                    description="Automate document processing, add intelligent chatbots, and use predictive analytics to stay ahead."
                    href="/services/ai-automation"
                />
            </div>
        </div>
    </section>

    <section class="py-16 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Our Approach</h2>
            <div class="grid md:grid-cols-3 gap-8 text-center">
                <div>
                    <div class="text-3xl font-bold text-blue-600 mb-2">1</div>
                    <h3 class="font-semibold mb-2">Discover</h3>
                    <p class="text-gray-600 text-sm">Free 30-minute call to map your biggest pain points and opportunities.</p>
                </div>
                <div>
                    <div class="text-3xl font-bold text-blue-600 mb-2">2</div>
                    <h3 class="font-semibold mb-2">Pilot</h3>
                    <p class="text-gray-600 text-sm">Start small with a focused project (€2k-5k) to prove ROI before scaling.</p>
                </div>
                <div>
                    <div class="text-3xl font-bold text-blue-600 mb-2">3</div>
                    <h3 class="font-semibold mb-2">Scale</h3>
                    <p class="text-gray-600 text-sm">Expand what works. Add features, automate more, grow with confidence.</p>
                </div>
            </div>
        </div>
    </section>

    <CTASection
        heading="Not Sure Where to Start?"
        text="Book a free 30-minute process review. We'll identify 2-3 quick wins for your business."
        secondaryLabel="View Case Studies"
        secondaryHref="/case-studies"
    />

    <Footer />
</BaseLayout>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/pages/services/index.astro
git commit -m "feat: add services index page with four service cards and approach section"
```

---

### Task 17: Create business-automation service page

**Files:**
- Create: `src/pages/services/business-automation.astro`

- [ ] **Step 1: Create the page**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import CTASection from '../../components/CTASection.astro';
import { serviceSchema, breadcrumbSchema } from '../../data/structured-data';

const schema = serviceSchema(
  'Business Process Automation',
  'Workflow automation, dashboard building, and system integration for SMEs in Tipperary, Kilkenny & Laois.',
  'https://www.suirda.ie/services/business-automation'
);
const breadcrumbs = breadcrumbSchema([
  { name: 'Home', url: 'https://www.suirda.ie/' },
  { name: 'Services', url: 'https://www.suirda.ie/services' },
  { name: 'Business Automation', url: 'https://www.suirda.ie/services/business-automation' },
]);
---

<BaseLayout
  title="Business Process Automation"
  description="Automate manual workflows, reporting, and system integrations for your Tipperary, Kilkenny or Laois business. Save 10+ hours per week. Free process review."
  structuredData={breadcrumbs}
>
    <Header />

    <section class="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Business Process Automation</h1>
            <p class="text-xl text-gray-600">
                Stop wasting hours on repetitive tasks. We automate your workflows so your team can focus on what actually grows the business.
            </p>
        </div>
    </section>

    <section class="py-16 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Common Challenges We Solve</h2>
            <ul class="space-y-4 text-gray-700">
                <li class="flex items-start"><span class="text-blue-600 mr-3 mt-1 font-bold">•</span><span>Staff spending hours on manual data entry between systems (accounting, CRM, inventory)</span></li>
                <li class="flex items-start"><span class="text-blue-600 mr-3 mt-1 font-bold">•</span><span>Monthly or weekly reports that take days to compile from spreadsheets</span></li>
                <li class="flex items-start"><span class="text-blue-600 mr-3 mt-1 font-bold">•</span><span>Customer orders, invoices, or quotes that require manual copying between platforms</span></li>
                <li class="flex items-start"><span class="text-blue-600 mr-3 mt-1 font-bold">•</span><span>No visibility into business performance without digging through multiple systems</span></li>
            </ul>
        </div>
    </section>

    <section class="py-16 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">How We Help</h2>
            <p class="text-gray-700 mb-4">
                We analyse your existing workflows, identify the biggest time sinks, and build automations that connect your systems and eliminate manual handoffs. Whether it's syncing your accounting software with your CRM, auto-generating reports from live data, or building dashboards that give you real-time visibility — we make your operations run smoother.
            </p>
            <p class="text-gray-700 mb-4">
                We start with a focused pilot project (typically €2k-5k) targeting your single biggest pain point. Once you see the ROI, we expand to automate more of your workflow. No big-bang implementations — just steady, measurable improvement.
            </p>
            <p class="text-gray-700">
                With 14+ years of experience building data pipelines and automation systems at enterprise scale (JP Morgan, Citi, Optum), we bring serious engineering capability to local SME problems — without the enterprise price tag.
            </p>
        </div>
    </section>

    <section class="py-16 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-8">Typical Outcomes</h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="text-center">
                    <div class="text-3xl font-bold text-green-600 mb-2">10+ hrs/week</div>
                    <p class="text-gray-600">saved on manual reporting and data entry</p>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-green-600 mb-2">76% faster</div>
                    <p class="text-gray-600">data refresh times with automated pipelines</p>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-green-600 mb-2">95% reduction</div>
                    <p class="text-gray-600">in client onboarding time</p>
                </div>
            </div>
        </div>
    </section>

    <section class="py-16 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Technologies We Use</h2>
            <p class="text-gray-700">
                Python, Power Automate, Zapier, custom APIs, Databricks, SQL, Power BI, Ansible — we pick the right tool for the job, not the trendiest one.
            </p>
        </div>
    </section>

    <CTASection
        heading="Let's Discuss Your Automation Needs"
        text="Book a free 30-minute process review. We'll identify your biggest time sinks and recommend practical next steps."
    />

    <Footer />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/services/business-automation.astro
git commit -m "feat: add business automation service page"
```

---

### Task 18: Create custom-software service page

**Files:**
- Create: `src/pages/services/custom-software.astro`

- [ ] **Step 1: Create the page** (follows same structure as business-automation — hero, challenges, how we help, outcomes, tech, CTA)

Key content points:
- Challenges: off-the-shelf doesn't fit, spreadsheet workarounds, paper processes, systems that don't talk to each other
- How we help: bespoke web/mobile apps, customer portals, internal tools, phased MVP-first builds
- Pricing guidance: from €5k for MVP, €10k-50k+ for full systems
- Outcomes: efficiency gains, revenue impact, reduced manual workarounds
- Tech: React, Node.js, Python, PostgreSQL, AWS, cloud-based
- Breadcrumbs and Service schema

- [ ] **Step 2: Commit**

```bash
git add src/pages/services/custom-software.astro
git commit -m "feat: add custom software service page"
```

---

### Task 19: Create data-analytics service page

**Files:**
- Create: `src/pages/services/data-analytics.astro`

- [ ] **Step 1: Create the page**

Key content points:
- Challenges: data trapped in silos, no visibility, manual reporting, decisions based on gut feel
- How we help: data integration, automated dashboards, KPI tracking, real-time visibility
- Outcomes: better decision-making, time saved on reports, real-time insights
- Tech: Power BI, Databricks, SQL, Python, Delta Lake, cloud data warehouses
- Reference: top-5 most-used dashboards out of 10,000+ at Optum

- [ ] **Step 2: Commit**

```bash
git add src/pages/services/data-analytics.astro
git commit -m "feat: add data analytics service page"
```

---

### Task 20: Create ai-automation service page

**Files:**
- Create: `src/pages/services/ai-automation.astro`

- [ ] **Step 1: Create the page**

Key content points:
- Challenges: repetitive document processing, no predictive capability, manual customer support
- How we help: document extraction, intelligent chatbots, predictive analytics, process mining
- Outcomes: processing time reduction, accuracy improvement, referral conversion gains
- Tech: Python, Databricks, Spark, cloud ML services
- Local SEO: keywords like "AI Tipperary", "AI automation Kilkenny"

- [ ] **Step 2: Commit**

```bash
git add src/pages/services/ai-automation.astro
git commit -m "feat: add AI automation service page"
```

---

### Task 21: Create about page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create about.astro**

Content sections:
1. **Hero**: "About Suir Data Analytics"
2. **Company story**: Founded to help regional SMEs compete through automation and software. Named after the River Suir. Local presence in Tipperary.
3. **What makes us different**: Local, face-to-face, affordable phased approach, ROI-focused, enterprise experience at SME prices
4. **Andy Burns bio**: 14+ years across Optum (Principal Analytics Engineer), JP Morgan (Senior Data Engineer), Citi (Engineering Manager SVP, led 14 engineers), First Derivatives. B.Sc Quantitative Finance DCU (1:1). AWS Certified Solutions Architect, Databricks Certified (3x), Qlik Sense Certified.
5. **Technologies & tools**: Databricks, Spark, Delta Lake, Power BI, Python, SQL, AWS, React, Docker, Kubernetes
6. **CTA section**

Include breadcrumbs and LocalBusiness structured data.

- [ ] **Step 2: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add about page with bio, company story, and certifications"
```

---

### Task 22: Verify Phase 2 — full build check

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds. All service pages, about page, contact page render.

- [ ] **Step 2: Commit all Phase 2 work if any uncommitted changes remain**

---

## Chunk 3: Case Studies & Blog (Issues #4, #10)

### Task 23: Create case studies index page

**Files:**
- Create: `src/pages/case-studies/index.astro`

- [ ] **Step 1: Create case-studies/index.astro**

Lists all 3 case studies using CaseStudyCard component. Hero section with heading "Real Results for Regional SMEs". Breadcrumbs. CTA at bottom.

- [ ] **Step 2: Commit**

```bash
git add src/pages/case-studies/index.astro
git commit -m "feat: add case studies index page"
```

---

### Task 24: Create manufacturing-automation case study

**Files:**
- Create: `src/pages/case-studies/manufacturing-automation.astro`

- [ ] **Step 1: Create the case study page**

Structure:
- **Client**: Tipperary-based food manufacturing company (anonymised)
- **Challenge**: Production reporting took 2 days/month. Data scattered across machines, spreadsheets, and legacy systems. No real-time visibility. Staff manually compiling reports.
- **Solution**: Built automated data ingestion pipeline connecting production systems to a centralised dashboard. Automated daily/weekly/monthly reports. Real-time KPI monitoring. Inspired by Andy's ingestion framework at JP Morgan (76% faster refresh, 60% less RAM).
- **Outcome**: 10 hours/week saved, monthly reporting from 2 days to 2 hours, real-time production visibility, 100% reduction in reporting errors
- **Technologies**: Python, SQL, Power BI, automated ETL pipelines
- **Timeline**: 6 weeks (2-week discovery, 4-week build)
- Breadcrumbs, Article schema

- [ ] **Step 2: Commit**

```bash
git add src/pages/case-studies/manufacturing-automation.astro
git commit -m "feat: add manufacturing automation case study"
```

---

### Task 25: Create retail-software case study

**Files:**
- Create: `src/pages/case-studies/retail-software.astro`

- [ ] **Step 1: Create the case study page**

Structure:
- **Client**: Kilkenny-based independent retailer
- **Challenge**: No way to track repeat customers. Manual booking via phone. No loyalty program. POS data not being leveraged.
- **Solution**: Custom web app integrating with existing POS. Online booking, customer profiles, targeted promotions, loyalty points. Inspired by Andy's client onboarding/entitlements work at Citi (scaled to 100+ clients).
- **Outcome**: 25% increase in repeat business within 6 months, 40% of bookings now online, staff time saved on phone bookings
- **Technologies**: React, Node.js, PostgreSQL, REST API, cloud hosting
- **Timeline**: 8 weeks (MVP), ongoing enhancements

- [ ] **Step 2: Commit**

```bash
git add src/pages/case-studies/retail-software.astro
git commit -m "feat: add retail software case study"
```

---

### Task 26: Create professional-services case study

**Files:**
- Create: `src/pages/case-studies/professional-services.astro`

- [ ] **Step 1: Create the case study page**

Structure:
- **Client**: Laois-based professional services firm (accounting/legal)
- **Challenge**: Client onboarding took 2 weeks. Manual document collection, email chains, missed follow-ups. Compliance paperwork scattered.
- **Solution**: Automated onboarding workflow: online intake form, automated document requests, status tracking dashboard, email notifications. Inspired by Andy's SDLC automation (90% effort reduction) and client onboarding feature (95% time reduction).
- **Outcome**: Onboarding from 2 weeks to 3 days, zero missed compliance steps, clients can self-serve document uploads
- **Technologies**: Python, Power Automate, custom web portal, cloud storage
- **Timeline**: 5 weeks

- [ ] **Step 2: Commit**

```bash
git add src/pages/case-studies/professional-services.astro
git commit -m "feat: add professional services case study"
```

---

### Task 27: Create blog index page

**Files:**
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: Create blog/index.astro**

Lists all 5 blog posts using BlogPostCard. Hero: "Insights for SMEs". Breadcrumbs. Each card shows title, date, excerpt, "Read more" link.

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: add blog index page"
```

---

### Task 28: Create blog post — "5 Manual Tasks Costing Tipperary SMEs Time and Money"

**Files:**
- Create: `src/pages/blog/manual-tasks-costing-smes.astro`

- [ ] **Step 1: Create the blog post** (800-1500 words)

Content: Identify 5 common manual tasks (invoicing/data entry, monthly reporting, inventory management, scheduling, customer follow-ups). Quantify time/cost. Explain automation solution for each. CTA: free process review. Target keywords: "business automation Tipperary", "manual tasks SME". Article schema, breadcrumbs.

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/manual-tasks-costing-smes.astro
git commit -m "feat: add blog post — 5 manual tasks costing SMEs"
```

---

### Task 29: Create blog post — "When Does a Kilkenny Business Need Custom Software?"

**Files:**
- Create: `src/pages/blog/when-need-custom-software.astro`

- [ ] **Step 1: Create the blog post** (800-1500 words)

Content: Decision framework. Signs off-the-shelf isn't working (workarounds, multiple systems, unique processes). Cost considerations (€5k-50k+). Timeline expectations. When NOT to build custom. CTA: discuss your needs. Target keywords: "custom software Kilkenny", "bespoke software Ireland".

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/when-need-custom-software.astro
git commit -m "feat: add blog post — when to build custom software"
```

---

### Task 30: Create blog post — "How Cloud-Based Automation Makes Enterprise Efficiency Affordable"

**Files:**
- Create: `src/pages/blog/cloud-automation-affordable.astro`

- [ ] **Step 1: Create the blog post** (800-1500 words)

Content: Cloud economics explained simply. No upfront infrastructure costs. Pay-as-you-grow. Real cost examples. Comparison with traditional on-premises. How enterprise tools (Databricks, Power BI) are now accessible to SMEs. CTA.

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/cloud-automation-affordable.astro
git commit -m "feat: add blog post — cloud automation affordability"
```

---

### Task 31: Create blog post — "Real Cost Breakdown: What €10k Buys in Custom Software"

**Files:**
- Create: `src/pages/blog/what-10k-buys-custom-software.astro`

- [ ] **Step 1: Create the blog post** (800-1500 words)

Content: Transparent pricing education. What €5k, €10k, €25k, €50k+ gets you. Scope examples at each tier. What's included (discovery, design, development, deployment, training). ROI examples. Why phased approach works. CTA.

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/what-10k-buys-custom-software.astro
git commit -m "feat: add blog post — what €10k buys in custom software"
```

---

### Task 32: Create blog post — "Why Local Matters When Choosing an Automation Partner"

**Files:**
- Create: `src/pages/blog/why-local-partner-matters.astro`

- [ ] **Step 1: Create the blog post** (800-1500 words)

Content: Benefits of face-to-face meetings. Understanding regional business challenges. Ongoing local support. Comparison to offshore/Dublin agencies. Why Tipperary/Kilkenny/Laois businesses benefit from a local partner. CTA. Target keywords: "AI Tipperary", "automation partner Ireland".

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/why-local-partner-matters.astro
git commit -m "feat: add blog post — why local automation partner matters"
```

---

### Task 33: Verify Phase 3 — full build check

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds. All case study and blog pages render.

---

## Chunk 4: Lead Magnets (Issue #9)

### Task 34: Create automation guide lead magnet landing page

**Files:**
- Create: `src/pages/resources/automation-guide.astro`

- [ ] **Step 1: Create resources/automation-guide.astro**

Landing page for "10 Processes Every SME Can Automate" guide:
- Hero with benefit statement
- What's in the guide (bullet list)
- Netlify Form gated download (name, email, company)
- Form name: "automation-guide-download"
- Thank you message (placeholder — actual PDF to be created later)
- Breadcrumbs

- [ ] **Step 2: Commit**

```bash
git add src/pages/resources/automation-guide.astro
git commit -m "feat: add automation guide lead magnet landing page"
```

---

### Task 35: Create software decision guide lead magnet landing page

**Files:**
- Create: `src/pages/resources/software-decision-guide.astro`

- [ ] **Step 1: Create resources/software-decision-guide.astro**

Landing page for "Custom Software vs Off-the-Shelf: Decision Guide":
- Hero with benefit statement
- What's in the guide (decision framework, cost comparison, checklist)
- Netlify Form gated download (name, email, company)
- Form name: "software-guide-download"
- Breadcrumbs

- [ ] **Step 2: Commit**

```bash
git add src/pages/resources/software-decision-guide.astro
git commit -m "feat: add software decision guide lead magnet landing page"
```

---

### Task 36: Add Resources to Header navigation

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Add Resources link to the nav links array**

Add `{ href: '/resources', label: 'Resources' }` between Blog and Contact in the links array.

- [ ] **Step 2: Create resources index page**

Create `src/pages/resources/index.astro` — simple page listing the two guides with links to their landing pages.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro src/pages/resources/index.astro
git commit -m "feat: add Resources section to navigation and create resources index"
```

---

### Task 37: Verify Phase 4 — full build check

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds. Resource pages render. Nav updated.

---

## Chunk 5: SEO & Polish (Issues #7, #13)

### Task 38: SEO audit — meta descriptions and titles

- [ ] **Step 1: Review all page titles and meta descriptions**

Check every page has:
- Unique title (under 60 chars ideally) with location keywords where natural
- Meta description (150-160 chars) with location keywords
- Fix any that are missing or generic

- [ ] **Step 2: Commit any fixes**

```bash
git add -u
git commit -m "fix: audit and update meta titles and descriptions across all pages"
```

---

### Task 39: Add structured data to all pages

- [ ] **Step 1: Ensure every page passes structured data to BaseLayout**

- Homepage: `localBusinessSchema`
- Service pages: service-specific schema + breadcrumbs
- Case study pages: article schema + breadcrumbs
- Blog posts: article schema + breadcrumbs
- About: `localBusinessSchema` + breadcrumbs
- Contact: `localBusinessSchema` + breadcrumbs

- [ ] **Step 2: Commit any fixes**

```bash
git add -u
git commit -m "feat: ensure structured data (JSON-LD) on all pages"
```

---

### Task 40: Local keyword optimization pass

- [ ] **Step 1: Review all H1/H2 tags for natural keyword inclusion**

Target keywords: "AI Tipperary", "AI automation", "business automation Tipperary", "custom software Kilkenny", "data analytics Laois", "automation South East Ireland"

Ensure these appear naturally in headings, body text, and meta descriptions — no keyword stuffing.

- [ ] **Step 2: Review image alt text**

Ensure all images (currently only favicon) have descriptive alt text.

- [ ] **Step 3: Review internal linking**

Ensure service pages link to relevant case studies and blog posts. Blog posts link to relevant service pages. Case studies link back to services.

- [ ] **Step 4: Commit**

```bash
git add -u
git commit -m "feat: local SEO keyword optimization across all pages"
```

---

### Task 41: Accessibility check

- [ ] **Step 1: Verify heading hierarchy**

Every page should have exactly one `<h1>`, with `<h2>`/`<h3>` nested logically. No skipped levels.

- [ ] **Step 2: Verify colour contrast**

Blue-600 on white = 4.75:1 ratio (passes AA). Gray-600 on white = 5.08:1 (passes). Verify no issues.

- [ ] **Step 3: Verify keyboard navigation**

Mobile menu button has aria-label and aria-expanded. Links are focusable. Forms have labels.

- [ ] **Step 4: Fix any issues found and commit**

---

### Task 42: Verify Phase 5 — full build check

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Clean build, no warnings.

---

## Chunk 6: Pre-Launch QA (Issues #11, #12)

### Task 43: Full build verification and link check

- [ ] **Step 1: Run build**

Run: `npm run build`
Expected: Build succeeds with zero errors.

- [ ] **Step 2: Check all generated pages exist in dist/**

Verify: index.html, contact.html, about.html, 404.html, services/index.html, services/business-automation.html, services/custom-software.html, services/data-analytics.html, services/ai-automation.html, case-studies/index.html, case-studies/manufacturing-automation.html, case-studies/retail-software.html, case-studies/professional-services.html, blog/index.html, blog/manual-tasks-costing-smes.html, blog/when-need-custom-software.html, blog/cloud-automation-affordable.html, blog/what-10k-buys-custom-software.html, blog/why-local-partner-matters.html, resources/index.html, resources/automation-guide.html, resources/software-decision-guide.html, sitemap-index.xml, robots.txt

- [ ] **Step 3: Grep for any remaining placeholder emails**

Search for `hello@suirdata.ie` — should be zero occurrences (replaced with `andy@suirda.ie`).

- [ ] **Step 4: Grep for any broken internal links**

Search all `.astro` files for `href="/"` patterns and verify targets exist.

- [ ] **Step 5: Commit any fixes**

---

### Task 44: Close GitHub issues

- [ ] **Step 1: Close completed issues**

Close issues #1 through #13 with comments summarizing what was done:

```bash
for i in $(seq 1 13); do
  "/c/Program Files/GitHub CLI/gh.exe" issue close $i --repo aburnsy/suir-data-analytics-website --comment "Completed as part of full site build."
done
```

---

### Task 45: Document remaining launch tasks

- [ ] **Step 1: Create a launch checklist comment or issue**

Items the user needs to do manually:
- Replace `G-XXXXXXXXXX` with real GA4 Measurement ID in `BaseLayout.astro`
- Replace `VERIFICATION_CODE_HERE` with Google Search Console verification code
- Set up Google Analytics 4 property
- Set up Google Search Console and submit sitemap
- Create/claim Google Business Profile
- Create actual PDF lead magnets (Canva/Figma) and host in `public/`
- Connect custom domain (suirda.ie) in Netlify
- Create real Calendly account if `andy_burns/30min` is placeholder
- Review all content for accuracy before going live
- Announce launch on LinkedIn, email signature, etc.

---

### Task 46: Final commit and push

- [ ] **Step 1: Ensure all changes are committed**

Run: `git status`
Expected: Clean working tree.

- [ ] **Step 2: Push to main** (with user confirmation)

Run: `git push origin main`
