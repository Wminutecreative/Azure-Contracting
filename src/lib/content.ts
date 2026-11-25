import { getCollection } from 'astro:content';
import type { FaqItem } from '@/components/FaqAccordion.astro';

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export async function getProjects({ featured }: { featured?: boolean } = {}) {
  const all = await getCollection('projects', ({ data }) => (featured ? data.featured : true));
  return all.sort(byOrder);
}

export async function getPosts() {
  const all = await getCollection('blog');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** `featured`: homepage slider entries. `page`: entries shown on the Testimonials page. (Both set in Keystatic.) */
export async function getTestimonials({ featured, page }: { featured?: boolean; page?: boolean } = {}) {
  const all = await getCollection(
    'testimonials',
    // (the homepage slider shows the person's initials when there is no photo or logo)
    ({ data }) => (featured ? data.featured : true) && (page ? data.showOnPage : true),
  );
  return all.sort(byOrder);
}

export async function getServices() {
  return (await getCollection('services')).sort(byOrder);
}

export async function getTeam() {
  return (await getCollection('team', ({ data }) => !data.hidden)).sort(byOrder);
}

/** FAQs for one page (home, about, testimonials, contact) */
export async function getFaqs(page: string): Promise<FaqItem[]> {
  const all = await getCollection('faqs', ({ data }) => data.pages.includes(page));
  return all.sort(byOrder).map(({ data }) => ({ question: data.question, answer: data.answer }));
}

/** A project's cover photo + alt text, for page cover banners / share images (undefined if the project is gone) */
export async function getProjectCover(id: string) {
  const project = (await getCollection('projects')).find((p) => p.id === id);
  return project ? { src: project.data.cover, alt: project.data.coverAlt } : undefined;
}
