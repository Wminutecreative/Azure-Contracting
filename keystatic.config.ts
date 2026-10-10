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
        client: fields.text({ label: 'Client', description: 'Shown on the project page, e.g. "Centauro Investments XI S.à r.l.". Optional.' }),
        location: fields.text({ label: 'Location', description: 'e.g. "Ormonde Quay Lower, Dublin 1". Optional.' }),
        role: fields.text({ label: 'Our role', description: 'e.g. "Main Contractor & PSCS". Optional.' }),
        year: fields.integer({ label: 'Year completed', description: 'Optional.' }),
        featured: fields.checkbox({ label: 'Show on the homepage (Our Featured Work)', defaultValue: false }),
        order: fields.integer({ label: 'Order', description: 'Lower numbers appear first.', defaultValue: 10 }),
        body: fields.markdoc({ label: 'Project description', extension: 'md' }),
      },
    }),

    // Must match the `blog` schema in src/content.config.ts
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['date'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: { label: 'Page URL', description: 'The post address: /blog/<this>' },
        }),
        date: fields.date({ label: 'Published date', validation: { isRequired: true } }),
        author: fields.text({ label: 'Author', validation: { isRequired: true } }),
        cover: fields.image({
          label: 'Cover photo',
          description: 'Landscape, at least 1600px wide. Shown on the blog cards and at the top of the post.',
          directory: 'src/assets/blog',
          publicPath: '../../assets/blog/',
          validation: { isRequired: true },
        }),
        coverAlt: fields.text({ label: 'Cover photo description', validation: { isRequired: true } }),
        excerpt: fields.text({
          label: 'Summary',
          description: 'One or two sentences — used for Google and social sharing.',
          multiline: true,
          validation: { isRequired: true },
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (p) => p.value || 'Tag' }),
        body: fields.markdoc({ label: 'Article', extension: 'md' }),
      },
    }),

    // Must match the `services` schema in src/content.config.ts
    services: collection({
      label: 'Services',
      slugField: 'category',
      path: 'src/content/services/*',
      format: { data: 'yaml' },
      columns: ['order'],
      schema: {
        category: fields.slug({ name: { label: 'Service name', validation: { isRequired: true } } }),
        items: fields.array(fields.text({ label: 'Item' }), {
          label: 'What it includes',
          description: 'One line each. The first 5 show on the card; longer lists get a "Read More…" toggle.',
          itemLabel: (props) => props.value || 'Item',
        }),
        image: fields.image({
          label: 'Photo',
          description: 'Landscape, at least 1200px wide.',
          directory: 'src/assets/services',
          publicPath: '../../assets/services/',
          validation: { isRequired: true },
        }),
        imageAlt: fields.text({ label: 'Photo description', description: 'What the photo shows (for screen readers and Google).' }),
        order: fields.integer({ label: 'Order', description: 'Lower numbers appear first.', defaultValue: 10 }),
      },
    }),

    // Must match the `team` schema in src/content.config.ts
    team: collection({
      label: 'Team',
      slugField: 'name',
      path: 'src/content/team/*',
      format: { data: 'yaml' },
      columns: ['role', 'order'],
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        role: fields.text({ label: 'Job title', validation: { isRequired: true } }),
        photo: fields.image({
          label: 'Photo',
          description: 'Portrait (taller than wide), at least 800px wide. Shown on the About Us page.',
          directory: 'src/assets/team',
          publicPath: '../../assets/team/',
          validation: { isRequired: true },
        }),
        linkedin: fields.url({ label: 'LinkedIn profile URL', description: 'Optional — shows the LinkedIn icon on the card.' }),
        order: fields.integer({ label: 'Order', description: 'Lower numbers appear first.', defaultValue: 10 }),
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
