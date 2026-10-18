// Masked text reveal for any element with [data-line-reveal]: the text rises from below into view, line by line,
// with the part still below its line hidden (each word sits in an overflow-hidden mask).
// Optional [data-lr-delay="0.2"] adds a start delay in seconds (e.g. to stagger a row of stats).
// Plays once when the element scrolls into view. Reduced motion: text is left untouched.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Wrap every word of every text node in <span class="lr-mask"><span class="lr-word">…</span></span>. */
function splitWords(root: HTMLElement): HTMLElement[] {
  const words: HTMLElement[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  for (const node of textNodes) {
    const parts = (node.textContent ?? '').split(/(\s+)/);
    const frag = document.createDocumentFragment();
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(document.createTextNode(' '));
        continue;
      }
      const mask = document.createElement('span');
      mask.className = 'lr-mask';
      const word = document.createElement('span');
      word.className = 'lr-word';
      word.textContent = part;
      mask.append(word);
      frag.append(mask);
      words.push(word);
    }
    node.replaceWith(frag);
  }
  return words;
}

/** Set up the reveal on every [data-line-reveal] element not set up yet (safe to call more than once). */
export function revealLines() {
  if (reduceMotion) return;
  document.querySelectorAll<HTMLElement>('[data-line-reveal]:not([data-lr-ready])').forEach((el) => {
    el.setAttribute('data-lr-ready', '');
    // Screen readers keep reading the original sentence, not the word fragments
    const label = el.textContent?.replace(/\s+/g, ' ').trim();
    if (label && !el.hasAttribute('aria-label')) el.setAttribute('aria-label', label);

    const words = splitWords(el);
    words.forEach((w) => w.parentElement?.setAttribute('aria-hidden', 'true'));
    gsap.set(words, { yPercent: 110 });

    const play = () => {
      // Words on the same visual line rise together; each following line starts a little later
      const tops = [...new Set(words.map((w) => Math.round(w.parentElement!.offsetTop)))].sort((a, b) => a - b);
      const lineOf = (w: HTMLElement) => tops.indexOf(Math.round(w.parentElement!.offsetTop));
      const delay = Number(el.dataset.lrDelay) || 0;
      gsap.to(words, {
        yPercent: 0,
        duration: 1,
        ease: 'expo.out',
        delay: (i) => delay + lineOf(words[i]) * 0.12,
      });
    };

    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: play });
  });
}

revealLines();
