# Verification and visual preview

Automated verification and responsive visual checks completed on 2026-10-25:

- **Astro check**: `npm run build` checked 24 project files with 0 errors, warnings, or hints.
- **Production build and integrity**: `npm run build` generated 10 localized pages and `sitemap.xml`; `scripts/verify-build.mjs` verified internal links, anchors, canonical and alternate language URLs, SEO metadata, CSS assets, and sitemap for `https://fbientrigo.github.io/`.
- **Browser checks and previews**: `npm run preview:capture` passed on all seven desktop (1440×900) and mobile (375×812) previews, with no runtime JavaScript errors or horizontal overflow. The research controls passed Next, Reset, normal Play, and a switch to reduced motion while playing; no more than one animation frame was pending at once.

## Previews

### Desktop English Home (current)
![English home, desktop width](preview/en-home-desktop.png)

### Desktop Dark Mode Home (current)
![Dark English home, desktop width](preview/dark-home-desktop.png)

### Mobile Spanish Home (current)
![Spanish home, mobile width](preview/es-home-mobile.png)

### Desktop English CV (Academic Profile)
![English CV, desktop width](preview/en-cv-desktop.png)

### Desktop Dark Mode Research
![Dark research page, desktop width](preview/dark-research-desktop.png)

### Mobile Spanish Projects (375px)
![Spanish project index, mobile width](preview/es-projects-mobile.png)

### Mobile Spanish CV (375px)
![Spanish CV, mobile width](preview/es-cv-mobile.png)
