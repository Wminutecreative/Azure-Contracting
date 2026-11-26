// Share images from the pages themselves: screenshots the top of every built page at 1200 × 630 and saves them as
// JPGs in public/og/ (home.jpg, about.jpg, projects.jpg, projects/<slug>.jpg …). BaseLayout uses the matching
// file as the page's og:image when it exists, else og-default.jpg.
//
// Run after a build, then build again so the pages pick the files up:
//   npm run build && npm run og && npm run build
// Needs Google Chrome installed (macOS path below; set CHROME=/path/to/chrome elsewhere).
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, '.vercel/output/static');
const out = join(root, 'public/og');
const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 4391;

if (!existsSync(join(dist, 'index.html'))) {
  console.error('No build found in .vercel/output/static — run `npm run build` first.');
  process.exit(1);
}

// Every page's index.html → its route ("/", "/about", "/projects/avid" …). Skips the dev-only components page.
const pages = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name !== '_astro' && name !== 'og') walk(p);
    } else if (name === 'index.html') {
      const route = '/' + relative(dist, dirname(p));
      if (!route.startsWith('/components')) pages.push(route === '/.' || route === '/' ? '/' : route);
    }
  }
};
walk(dist);

const server = spawn('python3', ['-m', 'http.server', String(port), '-d', dist], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1500));

let done = 0;
try {
  for (const route of pages.sort()) {
    const name = route === '/' ? 'home' : route.slice(1);
    const jpg = join(out, `${name}.jpg`);
    const png = jpg.replace(/\.jpg$/, '.png');
    mkdirSync(dirname(jpg), { recursive: true });
    // Reduced motion: scroll-in animations are skipped, so everything above the fold is already visible
    spawnSync(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-prefers-reduced-motion',
      '--window-size=1200,630',
      '--virtual-time-budget=6000',
      `--screenshot=${png}`,
      `http://localhost:${port}${route === '/' ? '/' : route + '/'}`,
    ], { stdio: 'ignore' });
    if (!existsSync(png)) {
      console.warn(`  ✗ ${route} (no screenshot)`);
      continue;
    }
    await sharp(png).resize(1200, 630, { fit: 'cover', position: 'top' }).jpeg({ quality: 82, mozjpeg: true }).toFile(jpg);
    rmSync(png);
    done++;
    console.log(`  ✓ ${route} → public/og/${name}.jpg`);
  }
} finally {
  server.kill();
}
console.log(`${done} share images written. Build again so the pages use them.`);
