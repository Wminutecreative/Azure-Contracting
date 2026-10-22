// Sectors used by the projects collection and the homepage sector cards (copy from the homepage design).

export const sectorIds = ['offices', 'hospitality', 'retail', 'education', 'healthcare', 'public-buildings'] as const;
export type SectorId = (typeof sectorIds)[number];

export const sectors: { id: SectorId; label: string; description: string }[] = [
  { id: 'offices', label: 'Offices', description: 'Fit-outs built around a workplace that stays in use' },
  { id: 'hospitality', label: 'Hospitality', description: 'New builds and renovations, finished to open on time' },
  { id: 'healthcare', label: 'Healthcare', description: 'Fit-outs and upgrades built around spaces that stay in use' },
  { id: 'public-buildings', label: 'Public Buildings', description: 'Construction delivered to public safety and access standards' },
];

export const sectorLabel = (id: SectorId) => sectors.find((s) => s.id === id)?.label ?? id;
