# Handoff: Academic Portfolio MVP (M0/M1)

## Estado de entrega

El MVP de la web académica personal para Fabián Trigo (`https://fbientrigo.github.io/`) ha sido completado con éxito, orientado a la evaluación del **CERN Doctoral Studentship**.

El proyecto utiliza Astro 7, TypeScript, diseño tipográfico sobrio estilo *research notebook*, soporte bilingüe integral (EN en `/` y ES en `/es/`), tema claro/oscuro que respeta `prefers-color-scheme` y persistencia en `localStorage`, y despliegue automatizado a GitHub Pages vía GitHub Actions.

## Cambios implementados

1. **Configuración de Astro y GitHub Pages:**
   - URL raíz definitiva configurada como `https://fbientrigo.github.io/` con `base: '/'`.
   - Canonicals, rutas hreflang (incluyendo `x-default`), Open Graph y sitemap generados apuntando a la raíz.
   - Script de verificación (`scripts/verify-build.mjs`) adaptado para verificar la raíz (`''` o `/`).

2. **Consolidación de Contenido Científico:**
   - Presentación rigurosa de la línea doctoral en SHiP (Search for Hidden Particles en el beam dump del CERN SPS, 400 GeV/c).
   - Metodología de simulación con flujos normalizantes (arquitecturas invertibles como acoplamiento afín / RealNVP) y benchmarks controlados D0–D5.
   - Fenomenología BSM (leptones neutros pesados, partículas de vida media larga).
   - Instrumentación FPGA y lógica digital.
   - Software científico pedagógico (`ROOT-kata`, `ROOT-rag`, `labOS`).
   - Demarcación explícita entre investigación doctoral en desarrollo, benchmarks controlados de simulación y herramientas experimentales. Cero afirmaciones no respaldadas o publicaciones ficticias.

3. **Perfil Académico Estructurado (CV):**
   - Implementado en `src/pages/cv.astro` y `src/pages/es/cv.astro` con cinco secciones estructuradas:
     - 01: Estado Institucional y Afiliaciones.
     - 02: Especialización en Investigación Doctoral.
     - 03: Metodologías y Competencias Técnicas.
     - 04: Artefactos Públicos de Investigación y Software.
     - 05: Transparencia y Límites Científicos.
   - Nota transparente indicando que el PDF formal se publicará al formalizarse los certificados institucionales.

4. **Correcciones Visuales y de Composición:**
   - Solucionado overflow horizontal móvil en Chrome (375px) asegurando `minmax(0, 1fr)` en grids, `overflow-wrap: break-word` y restricciones de ancho en contenedor `.wrap` y `.site-header`.
   - Soporte automático para `prefers-color-scheme: dark` en carga inicial sin parpadeo (FOUC).
   - Corregido el espaciado en la portada (hero) de escritorio entre botones de acción y el footer `RESEARCH NOTEBOOK 01 — 04`.
   - Corregida la visualización del tercer proyecto en vistas tablet y eliminados valores como `0•` en badges de proyectos.
   - Implementada captura de previews visuales mediante Chrome DevTools Protocol (`scripts/capture-previews.mjs`).

## Verificación técnica y visual

- `npm run check`: 23 archivos analizados, 0 errores, 0 advertencias, 0 sugerencias.
- `npm run build`: Genera 10 rutas estáticas (5 EN, 5 ES), sitemap, metadatos y assets.
- Capturas de pantalla guardadas en `docs/preview/`:
  - `en-home-desktop.png`: Portada desktop en inglés.
  - `en-cv-desktop.png`: Perfil académico desktop en inglés.
  - `dark-research-desktop.png`: Investigación en modo oscuro.
  - `es-projects-mobile.png`: Índice de proyectos móvil (375px) en español.
  - `es-cv-mobile.png`: Perfil académico móvil (375px) en español.

## Destino de despliegue

- Repositorio destino: `fbientrigo/fbientrigo.github.io`
- URL pública de GitHub Pages: `https://fbientrigo.github.io/`
- Rama base: `main`
- Rama de entrega: `feature/academic-portfolio-mvp`
