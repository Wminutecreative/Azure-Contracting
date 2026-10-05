import { config, fields, collection } from '@keystatic/core';
import { sectors } from './src/data/sectors';

// Keystatic CMS — admin at /keystatic.
//
// Storage:
// - Local (default): run `npm run dev`, open http://localhost:4321/keystatic. Edits are written straight into
//   src/content/… in this repo; commit + push them (GitHub Desktop) to publish.
// - GitHub: set PUBLIC_KEYSTATIC_STORAGE=github (+ the Keystatic GitHub App env vars) in Vercel, and the admin
//   on the deployed site commits edits to GitHub itself, which triggers a Vercel redeploy. See docs/cms.md.
const useGitHub = import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github';

export default config({
  storage: useGitHub ? { kind: 'github', repo: 'Wminutecreative/Azure-Contracting' } : { kind: 'local' },
  ui: {
    brand: { name: 'Azure Contracting' },
  },
  collections: {
    // Must match the `projects` schema in src/content.config.ts
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['sector', 'order'],
      schema: {
        title: fields.slug({
          name: { label: 'Project name', validation: { isRequired: true } },
          slug: { label: 'Page URL', description: 'The project page address: /projects/<this>' },
        }),
        sector: fields.select({
          label: 'Sector',
          options: sectors.map((s) => ({ label: s.label, value: s.id })),
          defaultValue: 'offices',
        }),
        excerpt: fields.text({
          label: 'Summary',
          description: 'Shown on the project cards (Projects page and homepage).',
          multiline: true,
          validation: { isRequired: true },
        }),
        cover: fields.image({
          label: 'Cover photo',
          description: 'Main photo for the cards and the top of the project page. At least 1600px wide.',
          directory: 'src/assets/projects',
          publicPath: '../../assets/projects/',
          validation: { isRequired: true },
        }),
        coverAlt: fields.text({
          label: 'Cover photo description',
          description: 'What the photo shows, for screen readers and Google (e.g. "Hotel lobby with new bar and seating").',
          validation: { isRequired: true },
        }),
        gallery: fields.array(
          fields.object({
            src: fields.image({
              label: 'Photo',
              directory: 'src/assets/projects',
              publicPath: '../../assets/projects/',
              validation: { isRequired: true },
            }),
            alt: fields.text({ label: 'Description', validation: { isRequired: true } }),
          }),
          { label: 'Gallery', description: 'Extra photos for the project page.', itemLabel: (p) => p.fields.alt.value || 'Photo' },
        ),
        location: fields.text({ label: 'Location', description: 'e.g. "Dublin City Centre". Optional.' }),
        year: fields.integer({ label: 'Year completed', description: 'Optional.' }),
        featured: fields.checkbox({ label: 'Show on the homepage (Our Featured Work)', defaultValue: false }),
        order: fields.integer({ label: 'Order', description: 'Lower numbers appear first.', defaultValue: 10 }),
        body: fields.markdoc({ label: 'Project description', extension: 'md' }),
      },
    }),

    // Must match the `testimonials` schema in src/content.config.ts
    testimonials: collection({
      label: 'Testimonials',
      slugField: 'name',
      path: 'src/content/testimonials/*',
      format: { data: 'yaml' },
      columns: ['company', 'order'],
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        role: fields.text({
          label: 'Job title',
          description: 'e.g. "Development Manager". Shown as "Development Manager at Company". Leave empty to show only the company.',
        }),
        company: fields.text({ label: 'Company', validation: { isRequired: true } }),
        photo: fields.image({
          label: 'Photo',
          description: 'Portrait or on-site photo. Landscape or square, at least 1200px wide.',
          directory: 'src/assets/testimonials',
          publicPath: '../../assets/testimonials/',
          validation: { isRequired: true },
        }),
        quote: fields.text({
          label: 'Quote',
          description: 'Without surrounding quotation marks — they are added automatically.',
          multiline: true,
          validation: { isRequired: true },
        }),
        rating: fields.integer({ label: 'Star rating (1–5)', defaultValue: 5, validation: { min: 1, max: 5 } }),
        showOnPage: fields.checkbox({ label: 'Show on the Testimonials page', defaultValue: true }),
        featured: fields.checkbox({ label: 'Show in the homepage slider', defaultValue: false }),
        order: fields.integer({ label: 'Order', description: 'Lower numbers appear first.', defaultValue: 10 }),
      },
    }),
  },
});
