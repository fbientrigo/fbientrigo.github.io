# Academic portfolio

Static bilingual portfolio for Fabián Trigo, built with Astro. English is at `/` and Spanish at `/es/`. Project copy and status are editable in `src/content/projects/*.json`; shared localized interface copy is in `src/data/site.ts`.

## Local development

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

The build validates content metadata and the generated pages, links, SEO metadata, assets and sitemap. Node.js 22.12 or newer is required by Astro 7. The site is configured for GitHub Pages root hosting at `https://fbientrigo.github.io/` (with `BASE_PATH=/`).

## GitHub Pages

The Actions workflow in `.github/workflows/pages.yml` checks pull requests and publishes on push to the `main` branch. GitHub Pages is configured to deploy via GitHub Actions.

The academic profile and research portfolio are tailored for CERN Doctoral Studentship evaluation, focusing on:
- Doctoral research in SHiP (Search for Hidden Particles) at CERN SPS.
- Muon-induced background estimation and normalizing flows (invertible neural architectures).
- BSM phenomenology (heavy neutral leptons, long-lived particles).
- FPGA instrumentation and scientific software.

Before public production launch, confirm the personal and academic details in [the M0 record](docs/M0.md#facts-needed-before-public-launch). A downloadable PDF CV will be linked once final institutional certificates and formal publications are finalized.
