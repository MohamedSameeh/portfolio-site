# Personal portfolio

Live: https://mohamedsameeh.vercel.app

Bilingual (English / Arabic) portfolio with an interactive WebGL hero.
Next.js App Router, React, TypeScript, Tailwind CSS, Three.js (`@react-three/fiber`), Framer Motion, Lenis.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build, also type-checks
npm run start        # serve the production build
```

## URL switches

| URL | What it does |
|---|---|
| `/` | The full personal site: contact section with LinkedIn, GitHub and (if set) email. |
| `/?lang=ar` or `/?lang=en` | Opens in that language. The header switch does the same and remembers the choice. |
| `/?showcase=true` | Marketplace mode. Every personal contact route is removed: no email, no LinkedIn, no GitHub, no external product link. The hero button becomes "View the work". Use this mode for screenshots uploaded to Mostaql, Upwork or Khamsat. |

## Contact details

Edit `lib/site.ts`. The email is read from an environment variable so it never sits in the repository:

```bash
# .env.local  (or Vercel > Project > Settings > Environment Variables)
NEXT_PUBLIC_CONTACT_EMAIL=you@example.com
```

Without it the "Write to me" button is not rendered and the contact section shows LinkedIn and GitHub only.

## Where things live

| Path | What |
|---|---|
| `lib/projects.ts` | Every project: bilingual copy, stack, images, category. Add a project here. |
| `lib/app-state.tsx` | Language, direction and showcase mode (one small store, no context provider). |
| `components/hero-scene.tsx` | The 3D sculpture: geometry, material, studio lighting, pointer and scroll response. |
| `components/hero.tsx` | Headline reveal, CTA, and the drawn fallback for devices without WebGL. |
| `components/work.tsx` | Featured case, filters, bento grid with tilt and glare. |
| `components/case-drawer.tsx` | The case study panel. |
| `components/about.tsx` | About section with the portrait (`public/me/portrait.jpg`). |
| `components/bounty-console.tsx` | The Bounty Agents console visualisation. |
| `public/work/` | Project screenshots. |

## Deploy on Vercel

Import the folder as a project. No configuration is needed: the framework preset is Next.js and the page is prerendered as static content. Add `NEXT_PUBLIC_CONTACT_EMAIL` if you want the email button.

## Screenshots for the marketplaces

With the production server on port 3100 (`npx next start -p 3100`), from `../tools`:

```bash
node portfolio-site-capture.mjs   # writes portfolio-ready/05-personal-portfolio/images and audits for contact details
node portfolio-site-check.mjs     # language switch, filters, drawer, showcase mode, reduced motion, no-WebGL fallback
```
