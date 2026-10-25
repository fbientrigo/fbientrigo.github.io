export const profile = {
  name: 'Fabián Trigo',
  role: {
    en: 'Doctoral researcher in experimental particle physics',
    es: 'Investigador doctoral en física experimental de partículas',
  },
  affiliation: {
    en: 'Universidad de Valparaíso · Inter-university doctoral programme',
    es: 'Universidad de Valparaíso · Programa doctoral interuniversitario',
  },
  supervision: {
    en: 'Scientific supervision at Universidad de La Serena',
    es: 'Supervisión científica en la Universidad de La Serena',
  },
  university: 'Universidad de Valparaíso',
  github: 'https://github.com/fbientrigo',
  orcid: 'https://orcid.org/0009-0002-7441-441X',
};

export const pages = ['', 'research', 'projects', 'cv', 'contact'] as const;

export const sitePath = (path: string, locale: 'en' | 'es') => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${locale === 'es' ? '/es' : ''}/${path ? `${path}/` : ''}`;
};

export const copy = {
  en: {
    navLabel: 'Main navigation',
    nav: { home: 'Home', research: 'Research', projects: 'Projects', cv: 'CV', contact: 'Contact' },
    skip: 'Skip to content', language: 'Español', theme: 'Toggle dark mode',
    intro: 'I work on muon-induced backgrounds for SHiP, between detector simulation and computational methods, and on checking carefully that a simulation can be trusted for experimental physics.',
    research: 'Research', projects: 'Selected projects', cv: 'Academic profile', contact: 'Contact',
    researchText: 'I study muon-induced backgrounds for the SHiP experiment at the CERN SPS. I simulate with FairShip and GEANT4, and I am testing whether normalizing flows can make simulation studies more adaptive. These are open research questions. This site does not report validated physics results.',
    readResearch: 'Read the research note',
    researchSections: [
      {
        heading: 'The question and the SHiP context',
        paragraphs: [
          'SHiP (Search for Hidden Particles) is designed for the CERN Super Proton Synchrotron (SPS) beam dump. It looks for weakly interacting particles and dark-sector physics. The 400 GeV/c proton beam on a heavy target produces a very large flux of muons, so estimating muon-induced backgrounds shapes the design of the active shielding and the decay-vessel veto systems.',
          'Standard Monte Carlo is very inefficient for rare background trajectories that cross deep magnetic shielding. My doctoral work aims to formulate and benchmark adaptive sampling strategies for these high-dimensional regions of phase space.',
        ],
      },
      {
        heading: 'Methods: normalizing flows and simulation',
        paragraphs: [
          'I study invertible neural networks (normalizing flows with affine coupling layers). They learn a density model of the phase space that I can sample conditionally or use for importance-weighted generation.',
          'The code in the repository shows early thesis work: controlled numerical benchmarks with Gaussian and Gaussian-mixture targets (D0–D5). I use them to check density estimation and coverage before moving to full detector-level pipelines.',
        ],
      },
      {
        heading: 'BSM phenomenology and theory',
        paragraphs: [
          'My theory background covers physics beyond the Standard Model (BSM): heavy neutral leptons (HNLs), dark photons and long-lived particle (LLP) models. Knowing their production channels and kinematics is necessary to design solid background rejection.',
        ],
      },
      {
        heading: 'Instrumentation, FPGA and scientific software',
        paragraphs: [
          'I am also interested in digital electronics and FPGA logic for detector data acquisition and laboratory control.',
          'In scientific software I build reproducible tools and teaching material for high-energy physics: ROOT-kata for learning data analysis with ROOT, and labOS for tracking laboratory sessions.',
        ],
      },
    ],
    scopeLabel: 'Scope note',
    scopeText: 'The diagram is conceptual. It shows the method I am following, not measured collider data or real detector rates.',
    scopeTag: 'SHiP · muon backgrounds',
    interests: ['Muon-induced backgrounds', 'Simulation · FairShip / GEANT4', 'Normalizing flows', 'BSM phenomenology', 'FPGA instrumentation', 'Open scientific software'],
    diagramTitle: 'A conceptual research workflow',
    diagram: ['Muon phase space', 'Controlled density models', 'Normalizing flows', 'Closure & diagnostics'],
    diagramNote: 'Conceptual workflow. It shows how the method develops, not measured results.',
    projectsText: 'Selected research and scientific-software repositories. Each card says what stage the code is at, what my part is and where it comes from.',
    moreProjects: 'See all projects',
    artNote: 'Schematic drawing, not data', filterLabel: 'Filter projects by stage', filterAll: 'All',
    statusNames: { 'active-research': 'Active research', prototype: 'Prototypes', educational: 'Teaching tools', archived: 'Archived' },
    cvText: 'My research focus, methods, computational tools and open software, on one page.',
    contactText: 'For academic correspondence, research exchange or questions about my CERN doctoral application, use the public profiles below.',
    codeLabel: 'Code', idLabel: 'Research ID',
    repo: 'Repository', demo: 'Verified demo', contribution: 'Contribution', origin: 'Origin and attribution',
    cvMissing: 'A formal PDF CV will follow once institutional certificates and committee dates are confirmed. My active research records are linked through ORCID.',
    cvSections: [
      {
        title: 'Institutional status',
        lead: 'Doctoral candidate in experimental high-energy physics',
        items: [
          { label: 'Doctoral programme', text: 'Inter-university doctoral programme, Universidad de Valparaíso, Chile' },
          { label: 'Scientific supervision', text: 'Universidad de La Serena, Chile' },
          { label: 'Application', text: 'CERN doctoral studentship candidate · simulation for the SHiP experiment' },
        ],
      },
      {
        title: 'Doctoral research',
        lead: 'Muon-induced backgrounds and adaptive simulation at SHiP',
        paragraphs: [
          'I study high-intensity muon backgrounds for the SHiP experiment, proposed for the CERN SPS beam dump facility.',
          'I apply normalizing flows (invertible neural networks with tractable Jacobians) as surrogate density estimators and adaptive importance samplers for high-dimensional phase space.',
          'The simulation work runs in the FairShip and GEANT4 ecosystem.',
        ],
      },
      {
        title: 'Methods and technical stack',
        lead: 'Experimental, computational and theoretical tools',
        items: [
          { label: 'Detector simulation', text: 'FairShip framework, GEANT4 geometry and particle transport, Monte Carlo methods' },
          { label: 'Machine learning and numerics', text: 'Normalizing flows (affine coupling), density estimation, PyTorch, NumPy, SciPy' },
          { label: 'Phenomenology', text: 'BSM physics, heavy neutral leptons (HNLs), long-lived particles (LLPs), kinematic recasting' },
          { label: 'Hardware and instrumentation', text: 'FPGA digital logic, hardware description, laboratory data acquisition (DAQ)' },
          { label: 'Scientific computing', text: 'ROOT (C++ / Python), Linux/POSIX systems, reproducible environments' },
        ],
      },
      {
        title: 'Public research and software',
        lead: 'Repositories and open teaching tools',
        items: [
          { label: 'ship_adaptive_muon_bg', text: 'Controlled numerical benchmarks (D0–D5 Gaussian/GMM targets) for adaptive muon sampling in SHiP (thesis development)' },
          { label: 'labOS', text: 'Experimental phase 0 session ledger and device configuration tooling for electronics laboratories' },
          { label: 'ROOT-kata', text: 'Interactive exercise runner for learning particle physics analysis with ROOT' },
          { label: 'ROOT-rag', text: 'Local documentation indexing and lexical search prototype (SQLite FTS5) for high-energy physics reference' },
        ],
      },
      {
        title: 'Scope and transparency',
        lead: 'What these projects are and are not',
        paragraphs: [
          'I label each piece of software by its maturity: controlled benchmarks, experimental prototypes or teaching tools. I do not present any preliminary numerical result as official collaboration physics.',
        ],
      },
    ],
    loop: {
      tag: 'SHiP beam dump · Adaptive search loop',
      heading: 'A search that learns where to look.',
      text: 'Behind the magnetic shield, only a few muons can produce dangerous deep-inelastic (DIS) events. Simulating every muon in FairShip is expensive. The loop I am building lets a normalizing flow propose candidates, simulates them, scores the space with a proxy U(x) and retrains the flow, so that each generation needs less simulation per useful candidate.',
      steps: ['Propose with q(x)', 'Simulate', 'Score U(x)', 'Retrain q(x)'],
      next: 'Next generation',
      play: 'Play loop',
      reset: 'Reset',
      controlsLabel: 'Loop controls',
      mapCaption: 'Schematic phase space x₁, x₂. Dots are simulated candidates; highlighted dots are DIS-like. The tinted fog is the proxy U(x). Open circles show the current proposal q(x), and the line shows its path. The dashed ring is the DIS-like region, which the sampler never sees directly.',
      chartTitle: 'DIS-like candidates per 100 simulated',
      gen: 'Gen',
      status: 'Generation {g}: {n} of {total} simulated candidates were DIS-like.',
      note: 'Toy illustration of the loop I am building, with a Gaussian standing in for the flow. Not a result.',
    },
    home: {
      shieldTag: '02 · SHiP muon shield · Interactive',
      shieldHeading: 'Find the muons that make DIS.',
      shieldText: 'The 400 GeV/c proton beam makes a huge flux of muons. A magnetic shield bends them away: μ⁺ to one side, μ⁻ to the other, and slow muons more than fast ones. The survivors cross a gas vessel. There a muon can hit a nucleus in the gas or in the wall and make deep inelastic scattering (DIS): a scattered muon plus hadrons such as pions and kaons. Most secondaries are harmless. The ones that matter are charged tracks that look like a reconstructable vertex and slip past the veto.',
      shieldHow: 'Move the pointer over the drawing to fire your own muon: left to right raises its momentum, up and down sets its angle, and a click flips its charge. Fast muons are more likely to make DIS. Press “Fire again” to roll the dice again.',
      shieldPunch: 'The rare case is a muon that makes DIS and leaves a charged track in the detector. Finding those by hand is slow. My thesis trains a normalizing flow to propose them automatically.',
      probeLabel: 'Your muon',
      pLabel: 'Momentum p (GeV/c)',
      thetaLabel: 'Angle θ (mrad)',
      chargeLabel: 'Charge',
      fieldLabel: 'Shield field B (T)',
      swept: 'swept away',
      reaches: 'reaches the detector',
      escapes: '{n} of {total} background muons reach the detector.',
      reroll: 'Fire again',
      disYes: 'DIS in the vessel',
      disNo: 'no DIS',
      dangerYes: 'charged hadron reaches the detector',
      dangerNo: 'no charged hadron in the window',
      funnel: '{dis} of {total} make DIS in the vessel. {danger} of those leave a charged hadron in the window.',
      neutralNote: 'dashed: neutral, no track',
      panLeft: '← Target',
      panMid: 'Magnet → gas vessel · schematic: uniform field, no scattering, DIS rate exaggerated, not data',
      panRight: 'Detector window →',
      heroTag: '01 · Experimental particle physics & machine learning',
      statement: 'Doctoral researcher studying muon-induced backgrounds for <strong>SHiP at the CERN SPS</strong>, testing <strong>normalizing flows</strong> for adaptive simulation, and building open scientific tools.',
      programme: 'Doctoral programme',
      methods: 'Core methods',
      methodsText: 'FairShip / GEANT4 · Invertible flows · Reproducible C++ / Python · FPGA',
      flowCaption: 'Base Gaussian z₀ ~ N(0,I) → affine coupling s_θ, t_θ → target q_θ(x)',
      artifactsTag: '03 · Artifacts · Scientific software & teaching tools',
      artifactsHeading: 'Tools that leave a trace.',
      artifactCaptions: {
        tracks: 'ship_adaptive_muon_bg · controlled density benchmarks',
        histogram: 'ROOT-kata · short ROOT exercises',
        pulse: 'labOS · session notes into a SQLite ledger',
        network: 'ROOT-rag · lexical search with file and line references',
      },
    },
    footer: 'Research notes · Last content review: October 2026',
  },
  es: {
    navLabel: 'Navegación principal',
    nav: { home: 'Inicio', research: 'Investigación', projects: 'Proyectos', cv: 'Perfil', contact: 'Contacto' },
    skip: 'Saltar al contenido', language: 'English', theme: 'Cambiar modo oscuro',
    intro: 'Trabajo en fondos inducidos por muones para SHiP, entre la simulación de detectores y los métodos computacionales, y en comprobar con cuidado que una simulación sirva para la física experimental.',
    research: 'Investigación', projects: 'Proyectos seleccionados', cv: 'Perfil académico', contact: 'Contacto',
    researchText: 'Estudio los fondos inducidos por muones para el experimento SHiP en el SPS del CERN. Simulo con FairShip y GEANT4, y pruebo si los flujos normalizantes pueden hacer más adaptativos los estudios de simulación. Son preguntas de investigación abiertas. Este sitio no presenta resultados de física validados.',
    readResearch: 'Leer la nota de investigación',
    researchSections: [
      {
        heading: 'La pregunta y el contexto de SHiP',
        paragraphs: [
          'SHiP (Search for Hidden Particles) está diseñado para la parada de haz del Super Proton Synchrotron (SPS) del CERN. Busca partículas débilmente interactuantes y física de sectores oscuros. El haz de protones de 400 GeV/c sobre un blanco pesado produce un flujo muy grande de muones, así que estimar los fondos inducidos por muones condiciona el diseño del blindaje activo y de los detectores de veto.',
          'La simulación Monte Carlo estándar es muy ineficiente para trayectorias de fondo raras que atraviesan blindajes magnéticos profundos. Mi trabajo doctoral busca formular y comparar estrategias de muestreo adaptativo para estas regiones del espacio de fase de alta dimensión.',
        ],
      },
      {
        heading: 'Métodos: flujos normalizantes y simulación',
        paragraphs: [
          'Estudio redes neuronales invertibles (flujos normalizantes con capas de acoplamiento afín). Aprenden un modelo de densidad del espacio de fase que puedo muestrear de forma condicional o usar para generación con pesos de importancia.',
          'El código del repositorio muestra trabajo temprano de tesis: benchmarks numéricos controlados con blancos gaussianos y mezclas gaussianas (D0–D5). Los uso para evaluar la estimación de densidad y la cobertura antes de pasar a flujos completos a nivel de detector.',
        ],
      },
      {
        heading: 'Fenomenología BSM y teoría',
        paragraphs: [
          'Mi base teórica incluye física más allá del Modelo Estándar (BSM): leptones neutros pesados (HNLs), fotones oscuros y modelos de partículas de vida media larga (LLPs). Conocer sus canales de producción y su cinemática es necesario para diseñar un rechazo de fondos sólido.',
        ],
      },
      {
        heading: 'Instrumentación, FPGA y software científico',
        paragraphs: [
          'También me interesan la electrónica digital y la lógica en FPGA para adquisición de datos (DAQ) en detectores y control de laboratorio.',
          'En software científico desarrollo herramientas reproducibles y material de enseñanza para física de altas energías: ROOT-kata para aprender análisis de datos con ROOT y labOS para registrar sesiones de laboratorio.',
        ],
      },
    ],
    scopeLabel: 'Nota de alcance',
    scopeText: 'El diagrama es conceptual. Muestra el método que sigo, no datos medidos en acelerador ni tasas reales de detector.',
    scopeTag: 'SHiP · fondos de muones',
    interests: ['Fondos inducidos por muones', 'Simulación · FairShip / GEANT4', 'Flujos normalizantes', 'Fenomenología BSM', 'Instrumentación FPGA', 'Software científico abierto'],
    diagramTitle: 'Flujo conceptual de investigación',
    diagram: ['Espacio de fase de muones', 'Modelos de densidad controlados', 'Flujos normalizantes', 'Cierre y diagnósticos'],
    diagramNote: 'Flujo conceptual. Muestra cómo se desarrolla el método, no resultados medidos.',
    projectsText: 'Repositorios seleccionados de investigación y software científico. Cada ficha indica en qué etapa está el código, cuál es mi parte y de dónde viene.',
    moreProjects: 'Ver todos los proyectos',
    artNote: 'Dibujo esquemático, no son datos', filterLabel: 'Filtrar proyectos por etapa', filterAll: 'Todos',
    statusNames: { 'active-research': 'Investigación activa', prototype: 'Prototipos', educational: 'Herramientas de enseñanza', archived: 'Archivados' },
    cvText: 'Mi línea de investigación, métodos, herramientas computacionales y software abierto, en una página.',
    contactText: 'Para correspondencia académica, intercambio científico o consultas sobre mi postulación doctoral al CERN, usa los perfiles públicos de abajo.',
    codeLabel: 'Código', idLabel: 'Identificador de investigación',
    repo: 'Repositorio', demo: 'Demo verificada', contribution: 'Contribución', origin: 'Origen y atribución',
    cvMissing: 'El CV formal en PDF llegará cuando estén confirmados los certificados institucionales y las fechas de comisión. Mis registros de investigación activos están enlazados vía ORCID.',
    cvSections: [
      {
        title: 'Estado institucional',
        lead: 'Candidato doctoral en física experimental de altas energías',
        items: [
          { label: 'Programa doctoral', text: 'Programa doctoral interuniversitario, Universidad de Valparaíso, Chile' },
          { label: 'Supervisión científica', text: 'Universidad de La Serena, Chile' },
          { label: 'Postulación', text: 'Candidato a CERN doctoral studentship · simulación para el experimento SHiP' },
        ],
      },
      {
        title: 'Investigación doctoral',
        lead: 'Fondos inducidos por muones y simulación adaptativa en SHiP',
        paragraphs: [
          'Estudio fondos de muones de alta intensidad para el experimento SHiP, propuesto para la instalación de parada de haz del SPS en el CERN.',
          'Aplico flujos normalizantes (redes neuronales invertibles con jacobiano tratable) como estimadores de densidad subrogados y muestreadores adaptativos por importancia para espacios de fase de alta dimensión.',
          'El trabajo de simulación se hace en el ecosistema FairShip y GEANT4.',
        ],
      },
      {
        title: 'Métodos y herramientas técnicas',
        lead: 'Herramientas experimentales, computacionales y teóricas',
        items: [
          { label: 'Simulación de detectores', text: 'Framework FairShip, geometría y transporte de partículas con GEANT4, métodos de Monte Carlo' },
          { label: 'Machine learning y cálculo', text: 'Flujos normalizantes (acoplamiento afín), estimación de densidad, PyTorch, NumPy, SciPy' },
          { label: 'Fenomenología', text: 'Física BSM, leptones neutros pesados (HNLs), partículas de vida media larga (LLPs), recasting' },
          { label: 'Hardware e instrumentación', text: 'Lógica digital FPGA, descripción de hardware, adquisición de datos (DAQ) de laboratorio' },
          { label: 'Computación científica', text: 'ROOT (C++ / Python), sistemas Linux/POSIX, entornos reproducibles' },
        ],
      },
      {
        title: 'Investigación y software público',
        lead: 'Repositorios y herramientas de enseñanza abiertas',
        items: [
          { label: 'ship_adaptive_muon_bg', text: 'Benchmarks numéricos controlados (blancos gaussianos/mezclas D0–D5) para muestreo adaptativo en SHiP (desarrollo de tesis)' },
          { label: 'labOS', text: 'Registro de sesiones y configuración de dispositivos en fase experimental 0 para laboratorios de electrónica' },
          { label: 'ROOT-kata', text: 'Runner interactivo de ejercicios para aprender análisis de física de partículas con ROOT' },
          { label: 'ROOT-rag', text: 'Prototipo de indexación local y búsqueda léxica (SQLite FTS5) de documentación de referencia en física de altas energías' },
        ],
      },
      {
        title: 'Alcance y transparencia',
        lead: 'Qué son y qué no son estos proyectos',
        paragraphs: [
          'Clasifico cada software según su madurez: benchmarks controlados, prototipos experimentales o herramientas de enseñanza. No presento ningún resultado numérico preliminar como física oficial de la colaboración.',
        ],
      },
    ],
    loop: {
      tag: 'Beam dump de SHiP · Ciclo de búsqueda adaptativa',
      heading: 'Una búsqueda que aprende dónde mirar.',
      text: 'Detrás del blindaje magnético, solo unos pocos muones pueden producir eventos peligrosos de dispersión profundamente inelástica (DIS). Simular cada muón en FairShip es caro. El ciclo que estoy construyendo deja que un flujo normalizante proponga candidatos, los simula, puntúa el espacio con un proxy U(x) y reentrena el flujo, para que cada generación necesite menos simulación por candidato útil.',
      steps: ['Proponer con q(x)', 'Simular', 'Puntuar U(x)', 'Reentrenar q(x)'],
      next: 'Siguiente generación',
      play: 'Reproducir ciclo',
      reset: 'Reiniciar',
      controlsLabel: 'Controles del ciclo',
      mapCaption: 'Espacio de fase esquemático x₁, x₂. Los puntos son candidatos simulados; los destacados son tipo DIS. La niebla de color es el proxy U(x). Los círculos abiertos muestran la propuesta actual q(x), y la línea su recorrido. El anillo punteado es la región tipo DIS, que el muestreador nunca ve directamente.',
      chartTitle: 'Candidatos tipo DIS por cada 100 simulados',
      gen: 'Gen',
      status: 'Generación {g}: {n} de {total} candidatos simulados fueron tipo DIS.',
      note: 'Ilustración de juguete del ciclo que estoy construyendo, con una gaussiana en lugar del flujo. No es un resultado.',
    },
    home: {
      shieldTag: '02 · Blindaje de muones de SHiP · Interactivo',
      shieldHeading: 'Encuentra los muones que hacen DIS.',
      shieldText: 'El haz de protones de 400 GeV/c produce un flujo enorme de muones. Un blindaje magnético los desvía: los μ⁺ hacia un lado, los μ⁻ hacia el otro, y los lentos más que los rápidos. Los que sobreviven cruzan un recipiente con gas. Ahí un muón puede chocar con un núcleo del gas o de la pared y hacer dispersión inelástica profunda (DIS): un muón dispersado más hadrones como piones y kaones. La mayoría de los restos es inofensiva. Importan las trazas cargadas que parecen un vértice reconstruible y escapan al veto.',
      shieldHow: 'Mueve el puntero sobre el dibujo para lanzar tu propio muón: de izquierda a derecha sube su momento, arriba y abajo cambia su ángulo, y un clic cambia su carga. Los muones rápidos hacen DIS con más probabilidad. Pulsa «Disparar otra vez» para repetir el sorteo.',
      shieldPunch: 'El caso raro es un muón que hace DIS y deja una traza cargada en el detector. Buscarlos a mano es lento. Mi tesis entrena un flujo normalizante para proponerlos de forma automática.',
      probeLabel: 'Tu muón',
      pLabel: 'Momento p (GeV/c)',
      thetaLabel: 'Ángulo θ (mrad)',
      chargeLabel: 'Carga',
      fieldLabel: 'Campo del blindaje B (T)',
      swept: 'desviado',
      reaches: 'llega al detector',
      escapes: '{n} de {total} muones de fondo llegan al detector.',
      reroll: 'Disparar otra vez',
      disYes: 'DIS en el recipiente',
      disNo: 'sin DIS',
      dangerYes: 'un hadrón cargado llega al detector',
      dangerNo: 'ningún hadrón cargado en la ventana',
      funnel: '{dis} de {total} hacen DIS en el recipiente. {danger} de esos dejan un hadrón cargado en la ventana.',
      neutralNote: 'discontinua: neutro, sin traza',
      panLeft: '← Blanco',
      panMid: 'Imán → recipiente de gas · esquema: campo uniforme, sin dispersión, tasa de DIS exagerada, no son datos',
      panRight: 'Ventana del detector →',
      heroTag: '01 · Física experimental de partículas y machine learning',
      statement: 'Investigador doctoral en fondos inducidos por muones para <strong>SHiP en el SPS del CERN</strong>; pruebo <strong>flujos normalizantes</strong> para simulación adaptativa y desarrollo herramientas científicas abiertas.',
      programme: 'Programa doctoral',
      methods: 'Métodos principales',
      methodsText: 'FairShip / GEANT4 · Flujos invertibles · C++ / Python reproducible · FPGA',
      flowCaption: 'Gaussiana base z₀ ~ N(0,I) → acoplamiento afín s_θ, t_θ → objetivo q_θ(x)',
      artifactsTag: '03 · Artefactos · Software científico y docencia',
      artifactsHeading: 'Herramientas que dejan evidencia.',
      artifactCaptions: {
        tracks: 'ship_adaptive_muon_bg · benchmarks de densidad controlados',
        histogram: 'ROOT-kata · ejercicios cortos de ROOT',
        pulse: 'labOS · notas de sesión en un registro SQLite',
        network: 'ROOT-rag · búsqueda léxica con referencias a archivo y línea',
      },
    },
    footer: 'Notas de investigación · Última revisión de contenido: octubre de 2026',
  },
} as const;

export interface CvItem {
  readonly label?: string;
  readonly text: string;
}

export interface CvSection {
  readonly title: string;
  readonly lead?: string;
  readonly items?: readonly CvItem[];
  readonly paragraphs?: readonly string[];
}

export type Locale = keyof typeof copy;
