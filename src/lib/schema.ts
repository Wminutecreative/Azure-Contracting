import type { CollectionEntry } from 'astro:content';

// JSON-LD building blocks shared by the page schemas (BaseLayout adds WebSite, GeneralContractor, WebPage and the
// client list to every page; pages add these).

export const slogan = 'fit-out specialists in construction, refurbishment and fit-out, Kildare, Ireland';

/** A named list of terms (value cards, process steps, purpose / mission / vision) */
export const termList = (id: string, name: string, items: { name: string; description: string }[]) => ({
  '@type': 'ItemList',
  '@id': id,
  name,
  numberOfItems: items.length,
  itemListElement: items.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: { '@type': 'DefinedTerm', name: t.name, description: t.description },
  })),
});

/** One Review of the organisation per testimonial */
export const reviewNode = (t: CollectionEntry<'testimonials'>, pageUrl: string, orgId: string) => ({
  '@type': 'Review',
  '@id': `${pageUrl}#review-${t.id}`,
  itemReviewed: { '@id': orgId },
  author: {
    '@type': 'Person',
    name: t.data.name,
    ...(t.data.role && { jobTitle: t.data.role }),
    worksFor: { '@type': 'Organization', name: t.data.company },
  },
  reviewRating: { '@type': 'Rating', ratingValue: String(t.data.rating), bestRating: '5', worstRating: '1' },
  reviewBody: t.data.quote,
});
