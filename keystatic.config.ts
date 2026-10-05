import { config, fields, collection } from '@keystatic/core';

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
