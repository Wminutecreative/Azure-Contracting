// Smooth height animation for <details data-accordion> with a [data-accordion-body] child.
// Progressive enhancement: without JS, <details> still opens and closes.
// Items sharing a `name` attribute behave as an exclusive group (one open at a time).

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function animate(details: HTMLDetailsElement, opening: boolean) {
  const body = details.querySelector<HTMLElement>('[data-accordion-body]');
  if (!body || reduceMotion.matches) {
    details.open = opening;
    return;
  }
  if (opening) details.open = true;
  const full = body.scrollHeight;
  const anim = body.animate(
    { height: opening ? ['0px', `${full}px`] : [`${full}px`, '0px'], opacity: opening ? [0, 1] : [1, 0] },
    { duration: 380, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  );
  anim.onfinish = () => {
    if (!opening) details.open = false;
  };
}

document.querySelectorAll<HTMLDetailsElement>('details[data-accordion]').forEach((details) => {
  details.querySelector('summary')?.addEventListener('click', (e) => {
    e.preventDefault();
    const opening = !details.open;
    if (opening && details.name) {
      document
        .querySelectorAll<HTMLDetailsElement>(`details[data-accordion][name="${details.name}"][open]`)
        .forEach((other) => other !== details && animate(other, false));
    }
    animate(details, opening);
  });
});
