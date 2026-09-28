// Site-wide data used by Header, menu overlay, Footer and schema.
// TODO: verify all copy, contact details and client list against Figma (534:xxxx).

export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
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
  { label: 'Cookie Policy', href: '/cookie-policy' }, // TODO: page not yet in the brief's page list
];

export const contact = {
  // TODO: email and phone from Figma contact page — left empty so nothing invented ships.
  email: '',
  phone: '',
  address: ['Osprey Business Centre', 'Naas, Co. Kildare', 'Ireland'], // TODO: verify in Figma
};

// TODO: replace names with logo SVGs exported from Figma.
export const clients: string[] = ['Morrison', 'Osprey Spa', 'The Westin', 'Vaughan', 'Finnegans', 'The Hari Clinic'];
