# Managing content with Keystatic

Admin panel: **`/keystatic`** — manages **Projects**, **Services** and **Testimonials** (more collections can be
added in `keystatic.config.ts`).

## Option A — edit on your computer (works now)

1. `npm run dev`
2. Open <http://localhost:4321/keystatic> → **Testimonials**
3. Add / edit / delete a testimonial, upload the photo, **Save**
4. Keystatic writes the files into the repo:
   - `src/content/testimonials/<name>.yaml`
   - `src/assets/testimonials/<name>/photo.<ext>`
5. Commit + push in GitHub Desktop → Vercel redeploys (push to `Development` for the dev site, `main` for live).

## Option B — edit on the live site (no computer setup)

Keystatic can commit straight to GitHub from the deployed `/keystatic` page.

1. Add `PUBLIC_KEYSTATIC_STORAGE=github` to a local `.env`, run `npm run dev`, open
   <http://localhost:4321/keystatic> and follow Keystatic's **Create GitHub App** wizard. It creates the app and
   writes `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and
   `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` into `.env`.
2. Install the new GitHub App on the `Wminutecreative/Azure-Contracting` repo.
3. Copy `PUBLIC_KEYSTATIC_STORAGE` and those 4 variables into **Vercel → Settings → Environment Variables**
   (Production + Preview) and redeploy.
4. Open `https://<your-site>/keystatic`, sign in with GitHub, edit, **Save** → Keystatic commits to the branch
   you pick → Vercel redeploys in ~1 minute.

Never commit `.env` — it holds secrets (it is already git-ignored).

## Project fields

Files: `src/content/projects/<url>.md` and `src/assets/projects/<url>/…` (photos).

| Field | Notes |
|---|---|
| Project name / Page URL | URL becomes `/projects/<url>` — avoid changing it once the page is live |
| Sector | Offices · Hospitality · Retail · Education |
| Summary | Shown on the project cards (Projects page + homepage) |
| Cover photo + description | Main photo; description is for screen readers and Google |
| Gallery | Extra photos for the project page |
| Location, Year completed | Optional |
| Show on the homepage | Tick to include it in "Our Featured Work" on the homepage |
| Order | Lower numbers first (Projects page and homepage) |
| Project description | Full write-up for the project page |

## Service fields

Files: `src/content/services/<name>.yaml` and `src/assets/services/<name>/…` (photo).

| Field | Notes |
|---|---|
| Service name | Card title on /services |
| What it includes | One line per item. First 5 show; longer lists get "Read More…" |
| Photo + description | Landscape, ≥ 1200px wide |
| Order | Lower numbers first |

## Team fields

Files: `src/content/team/<name>.yaml` and `src/assets/team/<name>/…` (photo). Shown on /about → "Our Team Members".

| Field | Notes |
|---|---|
| Name / Job title | Shown in the card that slides up on hover |
| Photo | Portrait, ≥ 800px wide |
| LinkedIn profile URL | Optional — adds the LinkedIn button |
| Order | Lower numbers first |

## Testimonial fields

| Field | Notes |
|---|---|
| Name | Also becomes the file name |
| Job title | Optional — shown as "Job title at Company" |
| Company | Required |
| Photo | Landscape or square, ≥ 1200px wide |
| Quote | No surrounding quotation marks — added automatically |
| Star rating | 1–5 |
| Show on the Testimonials page | Tick to list it on /testimonials |
| Show in the homepage slider | Tick to include it in "Trusted By Builders" |
| Order | Lower numbers first |
