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

export async function getTestimonials({ featured }: { featured?: boolean } = {}) {
  const all = await getCollection('testimonials', ({ data }) => (featured ? data.featured : true));
  return all.sort(byOrder);
}

export async function getServices() {
  return (await getCollection('services')).sort(byOrder);
}

export async function getTeam() {
  return (await getCollection('team')).sort(byOrder);
}

/** FAQs for one page (home, about, testimonials, contact) */
export async function getFaqs(page: string): Promise<FaqItem[]> {
  const all = await getCollection('faqs', ({ data }) => data.pages.includes(page));
  return all.sort(byOrder).map(({ data }) => ({ question: data.question, answer: data.answer }));
}
