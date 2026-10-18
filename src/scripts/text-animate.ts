// Site-wide text animation (loaded by BaseLayout), applied automatically to the page content in <main>:
//   • Headings (h1–h4) — masked line reveal: words rise into view line by line (see line-reveal.ts)
//   • Paragraphs and list text — soft fade + rise, staggered when several enter together
// Each plays once as it scrolls into view. Reduced motion / no JS: text is simply shown.
//
// Skipped (they have their own motion, move around, or must stay readable at once):
//   the big outline section titles, the testimonial slider, the FAQ, the menu dialog, interactive cards' links
//   inside headings, anything inside [data-no-text-anim], and elements that already opt in to a reveal.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { revealLines } from './line-reveal';

gsap.registerPlugin(ScrollTrigger);

const SKIP = [
  '[data-no-text-anim]',
  '.big-heading', // the big outline title only — the section content it wraps is still animated
  '[data-tslider]',
  '.sr-only',
  '[data-faq]',
  'dialog',
  '[data-line-reveal]',
  '[data-count-up]',
  '[data-fw-fade]',
  'form',
].join(',');

const main = document.getElementById('main');

if (main && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const skipped = (el: Element) => !!el.closest(SKIP) || !el.textContent?.trim();

  // Headings: the word-by-word reveal hides inner text from screen readers (the heading gets an aria-label),
  // so headings containing links or buttons fade instead — their accessible names stay intact.
  const fades: HTMLElement[] = [];
  main.querySelectorAll<HTMLElement>('h1, h2, h3, h4').forEach((h) => {
    if (skipped(h)) return;
    if (h.querySelector('a, button')) fades.push(h);
    else h.setAttribute('data-line-reveal', '');
  });
  revealLines();
  const fading = new Set<HTMLElement>(fades);

  main.querySelectorAll<HTMLElement>('p, li:not(:has(p, h2, h3, h4, a, button, img, picture)), dd, dt, blockquote').forEach((el) => {
    if (skipped(el)) return;
    // Don't animate text nested inside something that already fades in
    for (let p = el.parentElement; p && p !== main; p = p.parentElement) if (fading.has(p)) return;
    fades.push(el);
    fading.add(el);
  });

  gsap.set(fades, { autoAlpha: 0, y: 24 });
  ScrollTrigger.batch(fades, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
  });

  // These triggers are created before page-specific ones (e.g. the pinned FAQ adds scroll space above later
  // text), so once everything has loaded, put all triggers in page order and re-measure.
  window.addEventListener('load', () => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
}
