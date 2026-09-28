# Azure Contracting — Website Build (Astro + Tailwind)

This file is the build brief for Claude Code. Read it fully before writing any code.
Client: **Azure Contracting** (construction, refurbishment & fit-out — Kildare, Ireland)
Agency: **Minute Creative**

---

## 1. Source of truth: Figma

- File: `https://www.figma.com/design/Eewhz9BDP1JI0jYi3QEwuw/`
- File key: `Eewhz9BDP1JI0jYi3QEwuw`
- Page to build from: **Final Design** (page id `1:2`). Ignore all other Figma pages (they are brand/strategy exploration).
- There are two copies of every page. Build from the **main set (534:xxxx)**. The **535:xxxx** set is the "WITH PROTOTYPE" version — use it only to understand interactions/animations.

| Page | Main node | Prototype node | Route |
|---|---|---|---|
| Homepage | `534:1874` | `535:6374` | `/` |
| About Us | `534:1311` | `535:5812` | `/about` |
| Services | `534:1449` | `535:5950` | `/services` |
| Project (listing) | `534:2019` | `535:6519` | `/projects` |
| Project Detail | `534:1796` | `535:6296` | `/projects/[slug]` |
| Testimonials | `534:1361` | `535:5862` | `/testimonials` |
| Blogs (listing) | `534:1543` | `535:6043` | `/blog` |
| Blog Post | `534:1586` | `535:6086` | `/blog/[slug]` |
| Contact Us | `534:1707` | `535:6207` | `/contact` |

Design-system frames: Typography `307:1854`, Section Padding `307:2057`, Brand Colours `307:2139`.
Menu open states: frames `539:7982`, `539:7992`. Animation reference: https://www.osmo.supply/

**How to use Figma:** For each page, call Figma MCP `get_design_context` + `get_screenshot` on the node above (one section at a time if the page is large). Pull exact copy, spacing, radii and images from Figma — do **not** invent copy. Download images with `download_assets` into `src/assets/`.
> Note: the Figma account is on the Starter plan with a low MCP call limit. Be economical: fetch design context once per section, cache what you learn in `docs/figma-notes.md`, and don't re-fetch.

---

## 2. Tech stack & rules

- **Astro 5** (static output) + **Tailwind CSS v4** + TypeScript
- Content in **Astro Content Collections** (Markdown/MDX + zod schemas)
- Minimal JS: vanilla TS in `<script>` tags; use **GSAP + ScrollTrigger** only for animations; **Swiper** for the testimonial slider (or a lightweight vanilla slider)
- Images via `astro:assets` `<Image />` (AVIF/WebP, lazy, explicit width/height)
- Sitemap: `@astrojs/sitemap`. Deploy target: Vercel or Netlify (static)
- Accessibility: semantic HTML, one `<h1>` per page, keyboard-accessible menu/accordions, `prefers-reduced-motion` respected
- No component libraries (no React UI kits). Astro components only.

---

## 3. Design tokens (from Figma)

### Colours
```
--color-navy:        #0E1F3D   /* Primary Color Blue — buttons, footer, dark cards */
--color-neon:        #C7D92E   /* Primary Color Neon — accents, arrows, highlights */
--color-text-dark:   #303030
--color-text-medium: #585858
--color-light:       #E7E7E7   /* borders, dividers */
--color-bg:          #F4F9FD   /* page background */
--color-white:       #FFFFFF   /* cards */
--color-black:       #161616
```
Gradient: navy → neon (used in footer card / CTA). Pages also use a soft background image `arcway-gradient-background-long.png` at 68% opacity — export it from Figma.

### Typography
Headings: **Avenir Next W1G** (Medium 500). ⚠️ Paid font — if no licence file is in `public/fonts/`, fall back to **Figtree** or **Nunito Sans** (Google Fonts) and flag it.
Body: **DM Sans**.

| Token | Font | Size / line-height |
|---|---|---|
| H-Large | Avenir Next Medium | 80 / 100% |
| H1 | Avenir Next Medium | 64 / 120% |
| H2 | Avenir Next Medium | 40 / 120% |
| H-Caps | Avenir Next Medium, uppercase | 40 / 150% |
| H3 | Avenir Next Medium | 36 / 120% |
| H4 | Avenir Next Medium | 32 / 120% |
| H5 | Avenir Next Medium | 24 / 120% |
| P1 | DM Sans Regular | 18 / 130% |
| P1-Medium | DM Sans Medium | 18 / 120% |
| P2 | DM Sans Regular | 16 / 140% |
| P3 | DM Sans Regular | 14 / 140% |

Scale headings down fluidly on mobile with `clamp()`.

### Layout
- Desktop design width: **1512px**. Content container max-width ~1320px, centred, side padding from the Section Padding frame (`307:2057`).
- Cards: white, rounded corners, subtle shadow — read exact radius/shadow from Figma.
- Breakpoints: mobile < 768, tablet 768–1199, desktop ≥ 1200. **Figma has desktop only** — design sensible mobile/tablet stacks yourself (single column, hamburger menu).

Put tokens in `src/styles/global.css` using Tailwind v4 `@theme`.

---

## 4. Global components (`src/components/`)

| Component | Notes |
|---|---|
| `Header.astro` | Hamburger (left) · Azure logo (centre) · navy "Contact Us" button with neon arrow (right). Hamburger opens full-screen menu overlay (see `539:7982/7992`). |
| `Footer.astro` | Navy background, logo, links (About Us, Projects, Testimonials, Blog, Career, Contact Us), legal row (Privacy Policy, Terms, Cookie Policy), large navy→neon gradient card on the right. |
| `BigOutlineHeading.astro` | The very large faded/outlined section title that sits behind content (“Our Featured Work”, “Discover About Us”, “Asked Questions”, “Client Testimonials”, “Our Featured Blogs”, “Be In Touch With Us”, “Other Similar Blogs”, “Our Team Members”). Prop: `text`. Animate in on scroll. |
| `Button.astro` | Variants: `primary` (navy + neon arrow square), `outline` ("Know More" with arrow). Renders `<a>` or `<button>`. |
| `LogoStrip.astro` | Client logos row (Morrison, Osprey Spa, Westin, Vaughan, Finnegans, etc.). Used on nearly every page above the footer. |
| `FaqAccordion.astro` | "Asked Questions" section; data from `faqs` collection. Use `<details>` for no-JS accessibility, enhance with animation. |
| `ProjectCard.astro` | Alternating image/text card: title, excerpt, Know More button. Prop `reverse`. |
| `BlogCard.astro` | Image with date pill, title, neon arrow. |
| `TestimonialCard.astro` | Photo + quote card, star rating, name/role. |
| `ValueCards.astro` | 3 icon cards: Precise · Engineered · Versatile. |
| `StatRow.astro` | 20+ · 500+ · 98% stats (read labels from Figma). |
| `SectorAccordion.astro` | Offices · Hospitality · Retail · Education rows with short descriptions. |
| `CtaCard.astro` | "Ready To Talk Fit-Out?" sticky sidebar card (Blog Post). |
| `BaseLayout.astro` | `<head>` SEO (title, description, canonical, OG/Twitter), JSON-LD slot, background gradient, Header, Footer. |

---

## 5. Content collections (`src/content/`)

```ts
projects:     title, slug, sector('offices'|'hospitality'|'retail'|'education'),
              excerpt, cover(image), gallery(image[]), location?, year?, featured(bool), order, body(md)
blog:         title, slug, date, author, cover(image), excerpt, tags[], body(md)
testimonials: name, role, company, photo(image), quote, rating(1-5), featured(bool)
services:     category, order, items(string[]), description?
faqs:         question, answer, pages(string[])   // which pages show it
team:         name, role, photo(image), order
```
Seed with the real entries visible in Figma (e.g. projects: Morrison Hotel, Osprey Hotel Spa, The Hari Clinic; blog: "A Step-By-Step Guide To CLT Staircases" and the other cards). Use placeholder text only where Figma uses placeholder text, and mark it `TODO: client copy`.

---

## 6. Pages — section by section (top → bottom)

**Homepage `/`**
1. Hero — full-width building image/video, centred Azure logo, header on top
2. Intro statement (H-Caps style) — "Azure Contracting brings hands-on site experience to construction, refurbishment and fit-out work in offices, hospitality, retail and education" (verify exact copy in Figma) + StatRow
3. SectorAccordion (Offices / Hospitality / Retail / Education)
4. BigOutlineHeading "Our Featured Work" + 3 alternating ProjectCards (featured projects) + link to /projects
5. ValueCards (Precise / Engineered / Versatile)
6. "Trusted By Builders" testimonial slider — large quote card + navy side cards with prev/next
7. FAQ ("Asked Questions")
8. LogoStrip → Footer

**About Us `/about`**
1. BigOutlineHeading "Discover About Us" + intro "Based in Kildare and working on projects across Ireland" + image + CTA
2. Image + Purpose / Vision / Values stacked cards
3. ValueCards
4. Full-width building image
5. "Our Team Members" grid (team collection)
6. FAQ → LogoStrip → Footer

**Services `/services`**
1. Heading + intro
2. Service categories list/accordion: Design Service, Commercial Service, Fit-out & Refurbishment, Mechanical & Electrical, Dry Lining / Ceilings, Audio Visual, Partitions & Joinery, Other Services — each with bullet items (services collection)
3. LogoStrip → Footer

**Projects `/projects`**
1. BigOutlineHeading "Our Featured Work"
2. All projects as alternating ProjectCards (optional sector filter chips)
3. LogoStrip → Footer

**Project Detail `/projects/[slug]`**
1. Project title (H3/H4) + image gallery (large + stacked images) + description/meta column
2. BigOutlineHeading "Other Similar Projects" + 2–3 ProjectCards (same sector)
3. LogoStrip → Footer
JSON-LD: `CreativeWork`/`Project` + BreadcrumbList

**Testimonials `/testimonials`**
1. BigOutlineHeading "Client Testimonials"
2. Alternating grid of photo cards + quote cards
3. FAQ → LogoStrip → Footer

**Blog `/blog`**
1. BigOutlineHeading "Our Featured Blogs"
2. 2-column BlogCard grid (paginate at 12)
3. LogoStrip → Footer

**Blog Post `/blog/[slug]`**
1. Breadcrumb · H1 title · hero image
2. Meta row (written by, published date) + share icons
3. Two-column: article body (headings like "Step One…", images, lists) + sticky CtaCard "Ready To Talk Fit-Out?"
4. BigOutlineHeading "Other Similar Blogs" + 2 BlogCards
5. LogoStrip → Footer
JSON-LD: `BlogPosting` + BreadcrumbList

**Contact `/contact`**
1. BigOutlineHeading "Be In Touch With Us"
2. Card: "Connect With Us" (email, phone) + form (Name, Email, Phone, Subject, Message, Contact Us button)
3. Map (Google Maps embed, lazy-loaded) + Address card (Osprey Business Centre, Naas, Co. Kildare — verify in Figma)
4. FAQ → LogoStrip → Footer
Form: post to Formspree/Netlify Forms (env var `PUBLIC_FORM_ENDPOINT`), client-side validation, honeypot, success/error states. Fire a `generate_lead` dataLayer event on success.

Also create: `404.astro`, `/privacy-policy`, `/terms` (placeholder), `/careers` (footer links to it — placeholder, flag to client).

---

## 7. Interactions (match prototype + osmo.supply feel)

- Menu overlay: slide/fade in, body scroll lock, Esc to close, focus trap
- BigOutlineHeading: fade + slight rise, or text-reveal on scroll
- Cards/images: staggered fade-up on scroll (ScrollTrigger, `once: true`)
- Buttons: arrow nudges right on hover; cards lift slightly on hover
- Accordions: smooth height animation
- Testimonial slider: prev/next + drag/swipe
- All motion disabled under `prefers-reduced-motion`

---

## 8. SEO, tracking & performance

- Unique title/description per page; canonical URLs; OG image per page/collection item
- JSON-LD: `LocalBusiness`/`GeneralContractor` (site-wide), `FAQPage` where FAQs show, `BlogPosting`, `BreadcrumbList`
- `robots.txt`, `sitemap-index.xml`
- Analytics placeholders in `BaseLayout`: GTM (`PUBLIC_GTM_ID`) and Microsoft Clarity (`PUBLIC_CLARITY_ID`) — load only if env var set
- Track: Contact Us button clicks (`cta_click`), form submissions (`generate_lead`), phone/email clicks
- Targets: Lighthouse ≥ 95 Performance/SEO/Accessibility on mobile; LCP image preloaded; fonts `font-display: swap` + preload

---

## 9. Folder structure

```
src/
  assets/            images exported from Figma
  components/        (section 4)
  content/           projects/ blog/ testimonials/ services/ faqs/ team/
  content.config.ts  zod schemas
  layouts/BaseLayout.astro
  pages/             index, about, services, projects/[...], testimonials, blog/[...], contact, 404
  styles/global.css  Tailwind @theme tokens
public/fonts/  public/favicon.svg  public/robots.txt
docs/figma-notes.md  (cache of Figma measurements)
```

---

## 10. Build order (do one phase at a time, commit after each, show me before moving on)

1. **Setup** — Astro + Tailwind v4 + TS, tokens, fonts, BaseLayout, `docs/figma-notes.md` from the 3 design-system frames
2. **Globals** — Header + menu overlay, Footer, Button, BigOutlineHeading, LogoStrip, FaqAccordion
3. **Content** — collection schemas + seed entries + exported images
4. **Homepage** (`534:1874`) — pixel-match at 1512px, then make responsive
5. **Projects + Project Detail**
6. **Blog + Blog Post**
7. **About Us, Services, Testimonials, Contact**
8. **Interactions** (GSAP) — compare against prototype nodes (535:xxxx)
9. **SEO / schema / tracking / 404 / legal pages**
10. **QA** — check each page against its Figma screenshot at 1512px, then 1280, 768, 375. Lighthouse run. Fix list in `docs/qa.md`.

## Definition of done (per page)
- Matches Figma at 1512px (spacing, type, colours, images)
- No horizontal scroll at 375px; menu, accordions, slider work by keyboard
- Real copy from Figma (placeholders marked `TODO`)
- Title, description, OG and JSON-LD present
- No console errors; Lighthouse ≥ 95
