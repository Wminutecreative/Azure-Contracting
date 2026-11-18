// Site-wide data used by Header, menu overlay, Footer and schema.
// Copy verified against the homepage design screenshot (1512px) where visible.
import type { ImageMetadata } from 'astro';
import morrison from '@/assets/clients/morrison.png';
import ospreySpa from '@/assets/clients/osprey-spa.png';
import rotunda from '@/assets/clients/rotunda-hospital.png';
import westin from '@/assets/clients/westin.png';
import wexford from '@/assets/clients/wexford-county-council.png';
import fineos from '@/assets/clients/fineos.png';
import intercontinental from '@/assets/clients/intercontinental.png';
import mhl from '@/assets/testimonials/eanna-murtagh/mhl-hotel-collection-logo.png';

// Blog hidden for now: no pages are built, so /blog and every post 404. To bring it back set this to true and
// uncomment the two Blog links below.
export const showBlog = false;

export interface NavLink {
  label: string;
  href: string;
}

// Menu dropdown (open-state design, 1512px): two link groups + image. Contact lives in the header button.
export const menuGroups: { title: string; links: NavLink[] }[] = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Services', href: '/services' },
      { label: 'Client Testimonials', href: '/testimonials' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Our Projects', href: '/projects' },
      // { label: 'Blogs', href: '/blog' },
    ],
  },
];

// TODO: client to supply profile URLs. Icons render as non-links until a URL is set.
export const social: { name: 'LinkedIn'; href: string }[] = [
  { name: 'LinkedIn', href: '' },
];

export const footerNav: NavLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Testimonials', href: '/testimonials' },
  // { label: 'Blog', href: '/blog' },
  // { label: 'Career', href: '/careers' },
  { label: 'Contact Us', href: '/contact' },
];

export const legalNav: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Cookie Consent', href: '/cookie-policy' }, // TODO: page not yet in the brief's page list
];

export const contact = {
  // From the Contact Us design. TODO: confirm email; the Eircode was unreadable in the design export.
  email: 'info@azurecontracting.ie',
  phone: '+353 1 541 7201',
  address: ['Osprey Business Centre, Block C', 'Naas West, Naas', 'Co. Kildare, Ireland'],
  // Used for the Google Maps embed and directions link
  mapQuery: 'Osprey Business Centre, Naas West, Naas, Co. Kildare, Ireland',
};

// Logos cropped from the homepage design at 1:1. TODO: replace with SVG/hi-res exports from Figma.
// `scale`: for logo files with no built-in padding, so they sit at the same visual size as the others
export const clients: { name: string; logo: ImageMetadata; scale?: number }[] = [
  { name: 'Morrison Dublin', logo: morrison },
  { name: 'Osprey Spa', logo: ospreySpa },
  { name: 'The Rotunda Hospital Dublin', logo: rotunda },
  { name: 'Westin Hotels & Resorts', logo: westin },
  { name: 'Wexford County Council', logo: wexford },
  { name: 'Fineos', logo: fineos },
  { name: 'InterContinental Dublin', logo: intercontinental },
  { name: 'MHL Hotel Collection', logo: mhl, scale: 0.7 },
];

// "How we work" value cards (homepage + About Us); also used for their JSON-LD
// TODO: confirm with the hover design — Engineered / Versatile copy is from the Claude Design homepage
export const valueCards: { title: string; description: string }[] = [
  {
    title: 'Precise',
    description: 'Close attention to detail at every stage, so the finished space matches the vision it started with.',
  },
  {
    title: 'Engineered',
    description: 'Real construction expertise behind every fit-out, translating drawings into finished spaces that hold up to use.',
  },
  { title: 'Versatile', description: "Equally at home across each sector's specific needs shape how we approach the work." },
];
