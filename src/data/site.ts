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

export interface NavLink {
  label: string;
  href: string;
}

// Menu dropdown (open-state design, 1512px): two link groups + image. Contact lives in the header button.
export const menuGroups: { title: string; links: NavLink[] }[] = [
  {
    title: 'Company',
    links: [
      { label: 'Know About Us', href: '/about' },
      { label: 'Services We Offer', href: '/services' },
      { label: 'Client testimonials', href: '/testimonials' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Our Projects', href: '/projects' },
      { label: 'Blogs', href: '/blog' },
    ],
  },
];

// TODO: client to supply profile URLs. Icons render as non-links until a URL is set.
export const social: { name: 'LinkedIn' | 'Instagram' | 'X'; href: string }[] = [
  { name: 'LinkedIn', href: '' },
  { name: 'Instagram', href: '' },
  { name: 'X', href: '' },
];

export const footerNav: NavLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Blog', href: '/blog' },
  { label: 'Career', href: '/careers' },
  { label: 'Contact Us', href: '/contact' },
];

export const legalNav: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Cookie Consent', href: '/cookie-policy' }, // TODO: page not yet in the brief's page list
];

export const contact = {
  // From the Contact Us design. TODO: confirm email; phone (and the Eircode) were unreadable in the design export —
  // add them here and they appear on the Contact page, menu and footer automatically.
  email: 'info@azurecontracting.ie',
  phone: '',
  address: ['Osprey Business Centre, Block C', 'Naas West, Naas', 'Co. Kildare, Ireland'],
  // Used for the Google Maps embed and directions link
  mapQuery: 'Osprey Business Centre, Naas West, Naas, Co. Kildare, Ireland',
};

// Logos cropped from the homepage design at 1:1. TODO: replace with SVG/hi-res exports from Figma.
export const clients: { name: string; logo: ImageMetadata }[] = [
  { name: 'Morrison Dublin', logo: morrison },
  { name: 'Osprey Spa', logo: ospreySpa },
  { name: 'The Rotunda Hospital Dublin', logo: rotunda },
  { name: 'Westin Hotels & Resorts', logo: westin },
  { name: 'Wexford County Council', logo: wexford },
  { name: 'Fineos', logo: fineos },
  { name: 'InterContinental Dublin', logo: intercontinental },
];
