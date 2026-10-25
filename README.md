# Portafolio académico

Portafolio académico bilingüe y estático de Fabián Trigo, construido con Astro. El contenido en inglés está en `/` y en español en `/es/`. Los proyectos se editan en `src/content/projects/*.json` y los textos de interfaz en `src/data/site.ts`.

## Desarrollo local

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

La compilación valida el contenido, las páginas generadas, enlaces, metadatos SEO, recursos y sitemap. Se requiere Node.js 22.12 o posterior y npm 9.6.5 o posterior. La configuración predeterminada corresponde al sitio personal `https://fbientrigo.github.io/` (`BASE_PATH=/`).

## Publicar en GitHub Pages

El repositorio ya incluye `.github/workflows/pages.yml`. Para habilitar la publicación:

1. En GitHub, abre **Settings → Pages** y elige **GitHub Actions** como *Build and deployment source*.
2. Publica esta rama y abre un pull request hacia `main`; al integrarlo, Actions compilará y publicará el sitio automáticamente. Para ejecutarlo manualmente, abre **Actions → Build and deploy to GitHub Pages → Run workflow** y selecciona `main` como rama.
3. Comparte `https://fbientrigo.github.io/` (inglés) o `https://fbientrigo.github.io/es/` (español). La primera publicación puede tardar unos minutos.

Para compilar antes de publicar, usa `npm run check` y `npm run build`. La acción de pull request valida los cambios, pero solo publica al actualizar la rama predeterminada.

Si el destino es otro repositorio de proyecto en Pages, configura las variables de repositorio `SITE_URL` con el origen del sitio y `BASE_PATH` con `/<nombre-del-repositorio>/`. Para un dominio propio o un sitio de usuario, normalmente se usa `BASE_PATH=/`.

El perfil académico y el portafolio de investigación se enfocan en la evaluación para la beca doctoral de CERN, con énfasis en:

- Investigación doctoral en SHiP (Search for Hidden Particles), en el SPS del CERN.
- Estimación del fondo inducido por muones y flujos normalizantes (arquitecturas neuronales invertibles).
- Fenomenología BSM (neutrinos neutros pesados y partículas de larga vida).
- Instrumentación FPGA y software científico.

Antes de anunciar públicamente el perfil, revisa los datos personales y académicos pendientes en [el registro M0](docs/M0.md#facts-needed-before-public-launch). El sitio no ofrece un PDF descargable de CV.
