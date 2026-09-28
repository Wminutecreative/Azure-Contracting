// Sectors used by the projects collection and the homepage SectorAccordion.
// TODO: sector descriptions from Figma (homepage 534:1874).

export const sectorIds = ['offices', 'hospitality', 'retail', 'education'] as const;
export type SectorId = (typeof sectorIds)[number];

export const sectors: { id: SectorId; label: string; description: string }[] = [
  { id: 'offices', label: 'Offices', description: 'TODO: client copy — office fit-out and refurbishment.' },
  { id: 'hospitality', label: 'Hospitality', description: 'TODO: client copy — hotels, spas and venues.' },
  { id: 'retail', label: 'Retail', description: 'TODO: client copy — retail units and showrooms.' },
  { id: 'education', label: 'Education', description: 'TODO: client copy — schools and campuses.' },
];

export const sectorLabel = (id: SectorId) => sectors.find((s) => s.id === id)?.label ?? id;
