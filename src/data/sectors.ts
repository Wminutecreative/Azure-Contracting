// Sectors used by the projects collection and the homepage sector cards (copy from the homepage design).

export const sectorIds = ['offices', 'hospitality', 'retail', 'education', 'healthcare', 'public-buildings', 'industrial'] as const;
export type SectorId = (typeof sectorIds)[number];

export const sectors: { id: SectorId; label: string; description: string }[] = [
  { id: 'offices', label: 'Offices', description: 'Fit-outs built around a workplace that stays in use' },
  { id: 'hospitality', label: 'Hospitality', description: 'New builds and renovations, finished to open on time' },
  { id: 'healthcare', label: 'Healthcare', description: 'Fit-outs and upgrades built around spaces that stay in use' },
  { id: 'public-buildings', label: 'Public Buildings and Education', description: 'Construction delivered to public safety and access standards' },
];

// Projects page filter chips, in display order. `slug` is the ?category= value in the URL; each project's
// Keystatic "Sector" is one of these.
export const projectCategories: { id: SectorId; slug: string; label: string }[] = [
  { id: 'healthcare', slug: 'healthcare', label: 'Healthcare' },
  { id: 'offices', slug: 'office-fitout', label: 'Office Fitout' },
  { id: 'hospitality', slug: 'hospitality', label: 'Hospitality' },
  { id: 'education', slug: 'education', label: 'Education' },
  { id: 'industrial', slug: 'industrial-fitout', label: 'Industrial Fitout' },
];

/** Projects page URL with a category filter switched on (the homepage sector rows link here) */
export const projectsFilterHref = (id: SectorId) => {
  // "Public Buildings and Education" on the homepage opens the Education filter
  const target = id === 'public-buildings' ? 'education' : id;
  const cat = projectCategories.find((c) => c.id === target);
  return cat ? `/projects?category=${cat.slug}` : '/projects';
};

export const sectorLabel = (id: SectorId) => sectors.find((s) => s.id === id)?.label ?? id;

// Schema.org serviceType for each sector (homepage sector Services + project pages)
export const sectorServiceType: Record<SectorId, string> = {
  offices: 'Office Fit-Out',
  hospitality: 'Hospitality Construction',
  retail: 'Retail Fit-Out',
  education: 'Education Construction',
  healthcare: 'Healthcare Fit-Out',
  'public-buildings': 'Public Building Construction',
  industrial: 'Industrial Fit-Out',
};
