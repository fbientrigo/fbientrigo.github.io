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
  github: 'https://github.com/fbientrigo',
  orcid: 'https://orcid.org/0009-0002-7441-441X',
};

export const sitePath = (path: string, locale: 'en' | 'es') => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${locale === 'es' ? '/es' : ''}/${path ? `${path}/` : ''}`;
};

export const copy = {
  en: {
    nav: { home: 'Home', research: 'Research', projects: 'Projects', cv: 'CV', contact: 'Contact' },
    skip: 'Skip to content', language: 'Español', theme: 'Toggle dark mode',
    eyebrow: 'Experimental particle physics · Chile',
    title: 'Understanding the tracks muons leave behind.',
    intro: 'I am a doctoral researcher studying muon-induced backgrounds in the context of SHiP. My work brings together detector simulation, computational methods and the careful validation needed to make simulation useful for experimental physics.',
    research: 'Research', projects: 'Selected projects', cv: 'Academic profile', contact: 'Contact',
    researchText: 'My current research examines muon-induced backgrounds relevant to the SHiP experiment at CERN SPS. I work with simulation in the FairShip and GEANT4 ecosystem and explore whether normalizing flows can support adaptive simulation studies. These are ongoing research questions; this site does not report validated physics results.',
    researchSections: [
      {
        heading: 'Scientific question & SHiP context',
        paragraphs: [
          'The Search for Hidden Particles (SHiP) experiment is designed to operate at the CERN Super Proton Synchrotron (SPS) beam dump, targeting weakly interacting particles and dark sector physics. The 400 GeV/c proton beam incident on a heavy target produces an immense flux of muons, making muon-induced background estimation a critical design challenge for active shielding and decay vessel veto systems.',
          'Standard Monte Carlo generation faces extreme sampling inefficiencies when estimating rare background trajectories through deep magnetic shielding. The goal of this doctoral line is to formulate and benchmark adaptive computational strategies capable of addressing these high-dimensional phase space regimes.',
        ],
      },
      {
        heading: 'Methods in scope: Normalizing flows & simulation',
        paragraphs: [
          'I investigate invertible neural architectures (normalizing flows with affine coupling layers) to learn expressive phase-space density models that can be sampled conditionally or used for importance-weighted generation.',
          'Present repository code records early thesis development with controlled numerical benchmarks (Gaussian and Gaussian-mixture targets D0–D5) to evaluate density estimation fidelity and coverage prior to scaling toward full detector-level pipelines.',
        ],
      },
      {
        heading: 'BSM phenomenology & theoretical foundations',
        paragraphs: [
          'My theoretical grounding encompasses Beyond the Standard Model (BSM) scenarios, including Heavy Neutral Leptons (HNLs), dark photons, and general Long-Lived Particle (LLP) models. Understanding kinematic distributions and production channels is essential for designing robust background rejection strategies.',
        ],
      },
      {
        heading: 'Instrumentation, FPGA systems & scientific software',
        paragraphs: [
          'Complementary experimental interests include digital electronic instrumentation and FPGA-based logic for detector acquisition systems and laboratory control.',
          'In scientific software, I develop reproducible tools and educational katas for high-energy physics, such as ROOT-kata for interactive data analysis learning and labOS for laboratory session tracking.',
        ],
      },
    ],
    scopeLabel: 'SCOPE NOTE',
    scopeText: 'The diagram is conceptual. It illustrates the research methodology and does not represent measured collider data or production detector rates.',
    scopeTag: 'SHiP · MUON BACKGROUNDS',
    interests: ['Muon-induced backgrounds', 'Simulation · FairShip / GEANT4', 'Normalizing flows', 'BSM phenomenology', 'FPGA instrumentation', 'Open scientific software'],
    diagramTitle: 'A conceptual research workflow',
    diagram: ['Muon phase space', 'Controlled density models', 'Normalizing flows', 'Closure & diagnostics'],
    diagramNote: 'Conceptual workflow only; it depicts methodological development rather than measured experimental results.',
    projectsText: 'A selection of research and scientific-software repositories. Repository implementation and provenance have been inspected; each card details status, attribution, and boundaries.',
    moreProjects: 'View all project notes',
    cvText: 'A structured academic overview covering research specialization, methodologies, computational tools, and open software artifacts.',
    cvLink: 'Read academic profile',
    contactText: 'For academic correspondence, research exchanges, or queries regarding CERN doctoral candidacy, use the public profiles below.',
    repo: 'Repository', demo: 'Verified demo', status: 'Status', contribution: 'Contribution', origin: 'Origin & attribution',
    profileHeading: 'Academic profile', profileBody: 'Doctoral researcher in experimental particle physics, formally associated with Universidad de Valparaíso through an inter-university doctoral programme, with scientific supervision at Universidad de La Serena.',
    focusHeading: 'Research focus', skillsHeading: 'Methods and tools', skills: ['Muon-background simulation', 'FairShip and GEANT4', 'Normalizing flows', 'BSM phenomenology', 'FPGA instrumentation', 'Educational scientific software'],
    cvMissing: 'A formal PDF CV will be published alongside verified institutional transcripts and committee dates. All active scientific records are indexed via ORCID.',
    cvSections: [
      {
        title: 'Institutional Status & Affiliations',
        lead: 'Doctoral Candidate in Experimental High-Energy Physics',
        items: [
          { label: 'Doctoral Programme', text: 'Inter-university Doctoral Programme, Universidad de Valparaíso, Chile' },
          { label: 'Scientific Supervision', text: 'Universidad de La Serena, Chile' },
          { label: 'Target Context', text: 'CERN Doctoral Studentship candidate · Focus on SHiP experiment simulation' },
        ],
      },
      {
        title: 'Doctoral Research Specialization',
        lead: 'Muon-Induced Backgrounds & Adaptive Simulation at SHiP',
        paragraphs: [
          'Investigation of high-intensity muon background characterization for the SHiP (Search for Hidden Particles) experiment proposed at the CERN SPS beam dump facility.',
          'Application of Normalizing Flows (invertible neural architectures with tractable Jacobians) as surrogate density estimators and adaptive importance samplers for high-dimensional phase-space generation.',
          'Simulation integration within the FairShip and GEANT4 computational ecosystem.',
        ],
      },
      {
        title: 'Core Methodologies & Technical Stack',
        lead: 'Experimental, Computational, and Theoretical Toolsets',
        items: [
          { label: 'Detector Simulation', text: 'FairShip framework, GEANT4 geometry and particle transport, Monte Carlo methods' },
          { label: 'Machine Learning & Numerics', text: 'Normalizing flows (affine coupling), density estimation, PyTorch, NumPy, SciPy' },
          { label: 'Phenomenology', text: 'BSM physics, Heavy Neutral Leptons (HNLs), Long-Lived Particles (LLPs), kinematic recasting' },
          { label: 'Hardware & Instrumentation', text: 'FPGA digital logic, hardware description, laboratory data acquisition (DAQ) systems' },
          { label: 'Scientific Computing', text: 'ROOT data analysis framework (C++ / Python), Linux/POSIX systems, reproducible environments' },
        ],
      },
      {
        title: 'Public Research & Software Artifacts',
        lead: 'Verifiable Repositories and Open Educational Tools',
        items: [
          { label: 'ship_adaptive_muon_bg', text: 'Controlled numerical benchmarks (D0–D5 Gaussian/GMM targets) for adaptive muon sampling in SHiP (Thesis development)' },
          { label: 'labOS', text: 'Experimental Phase 0 session ledger and device configuration tooling for electronics laboratories' },
          { label: 'ROOT-kata', text: 'Interactive pedagogical dojo and exercise runner for particle physics analysis with ROOT' },
          { label: 'ROOT-rag', text: 'Local documentation indexing and lexical search prototype (SQLite FTS5) for high-energy physics reference' },
        ],
      },
      {
        title: 'Verification & Transparency Note',
        lead: 'Scientific Demarcation',
        paragraphs: [
          'In alignment with academic integrity protocols, all software artifacts are explicitly categorized by maturity (controlled benchmarks, experimental prototypes, educational tools). No preliminary numerical result is presented as official collaboration physics.',
        ],
      },
    ],
    footer: 'Research notes · Last content review: October 2026',
  },
  es: {
    nav: { home: 'Inicio', research: 'Investigación', projects: 'Proyectos', cv: 'Perfil', contact: 'Contacto' },
    skip: 'Saltar al contenido', language: 'English', theme: 'Cambiar modo oscuro',
    eyebrow: 'Física experimental de partículas · Chile',
    title: 'Comprender las huellas que dejan los muones.',
    intro: 'Soy investigador doctoral y estudio fondos inducidos por muones en el contexto de SHiP. Mi trabajo reúne simulación de detectores, métodos computacionales y la validación cuidadosa que requiere el uso de simulaciones en física experimental.',
    research: 'Investigación', projects: 'Proyectos seleccionados', cv: 'Perfil académico', contact: 'Contacto',
    researchText: 'Mi investigación actual examina fondos inducidos por muones relevantes para el experimento SHiP en el SPS del CERN. Trabajo con simulación en el ecosistema FairShip y GEANT4, y exploro si los flujos normalizantes pueden apoyar estudios de simulación adaptativa. Son preguntas de investigación en curso; este sitio no presenta resultados de física validados.',
    researchSections: [
      {
        heading: 'Pregunta científica y contexto SHiP',
        paragraphs: [
          'El experimento Search for Hidden Particles (SHiP) está diseñado para operar en la parada de haz del Super Proton Synchrotron (SPS) del CERN, buscando física en la frontera de intensidad, sectores oscuros y partículas de vida media larga débilmente interactuantes (LLPs). El haz de protones de 400 GeV/c sobre un blanco pesado produce un flujo masivo de muones, convirtiendo el modelado de fondos en un desafío crucial para el blindaje magnético activo y los detectores de veto.',
          'La simulación Monte Carlo estándar enfrenta ineficiencias extremas por rechazo al estudiar trayectorias de fondo que logran atravesar blindajes profundos. El objetivo de esta línea doctoral es desarrollar y comparar estrategias computacionales adaptativas para estos regímenes en el espacio de fase.',
        ],
      },
      {
        heading: 'Métodos en estudio: Flujos normalizantes y simulación',
        paragraphs: [
          'Investigo arquitecturas neuronales invertibles (flujos normalizantes con capas de acoplamiento afín) para aprender densidades continuas en el espacio de fase y generar muestras mediante muestreo condicional o por importancia.',
          'El código actual registra avances tempranos de tesis con benchmarks numéricos controlados (blancos gaussianos y mezclas gaussianas D0–D5) para evaluar convergencia, cobertura y fidelidad antes de escalar a detectores completos.',
        ],
      },
      {
        heading: 'Fenomenología BSM y fundamentación teórica',
        paragraphs: [
          'El marco teórico abarca modelos Más Allá del Modelo Estándar (BSM), tales como leptones neutros pesados (HNLs), fotones oscuros y partículas de vida media larga. Comprender sus canales de producción y límites cinemáticos es indispensable para diseñar criterios rigurosos de supresión de fondos.',
        ],
      },
      {
        heading: 'Instrumentación, sistemas FPGA y software científico',
        paragraphs: [
          'Los intereses experimentales complementarios incluyen electrónica digital e instrumentación en FPGA para adquisición de datos (DAQ) y laboratorio.',
          'En el ámbito del software científico, desarrollo recursos reproducibles y herramientas pedagógicas, como ROOT-kata para el aprendizaje de análisis en física de altas energías y labOS para el registro de sesiones instrumentales.',
        ],
      },
    ],
    scopeLabel: 'NOTA DE ALCANCE',
    scopeText: 'El diagrama es conceptual. Ilustra la metodología de investigación y no representa datos medidos en acelerador ni tasas validadas de detector.',
    scopeTag: 'SHiP · FONDOS DE MUONES',
    interests: ['Fondos inducidos por muones', 'Simulación · FairShip / GEANT4', 'Flujos normalizantes', 'Fenomenología BSM', 'Instrumentación FPGA', 'Software científico abierto'],
    diagramTitle: 'Flujo conceptual de investigación',
    diagram: ['Espacio de fase de muones', 'Modelos de densidad controlados', 'Flujos normalizantes', 'Cierre y diagnósticos'],
    diagramNote: 'Flujo conceptual; representa el desarrollo metodológico y no resultados experimentales medidos.',
    projectsText: 'Una selección de repositorios de investigación y software científico. Se inspeccionaron la implementación y procedencia; cada ficha detalla estado, atribución y límites.',
    moreProjects: 'Ver notas de proyectos',
    cvText: 'Un resumen académico estructurado que abarca especialización investigadora, metodologías, herramientas computacionales y proyectos de software abierto.',
    cvLink: 'Leer perfil académico',
    contactText: 'Para correspondencia académica, intercambio científico o consultas relativas a la candidatura doctoral al CERN, utiliza los perfiles públicos a continuación.',
    repo: 'Repositorio', demo: 'Demo verificada', status: 'Estado', contribution: 'Contribución', origin: 'Origen y atribución',
    profileHeading: 'Perfil académico', profileBody: 'Investigador doctoral en física experimental de partículas, con asociación formal a la Universidad de Valparaíso mediante un programa doctoral interuniversitario y supervisión científica en la Universidad de La Serena.',
    focusHeading: 'Líneas de investigación', skillsHeading: 'Métodos y herramientas', skills: ['Simulación de fondos de muones', 'FairShip y GEANT4', 'Flujos normalizantes', 'Fenomenología BSM', 'Instrumentación FPGA', 'Software científico educativo'],
    cvMissing: 'El CV formal en PDF se publicará junto con los certificados institucionales y fechas de comisión validadas. Todos los identificadores científicos activos están enlazados vía ORCID.',
    cvSections: [
      {
        title: 'Estado Institucional y Afiliaciones',
        lead: 'Candidato Doctoral en Física Experimental de Altas Energías',
        items: [
          { label: 'Programa Doctoral', text: 'Programa Doctoral Interuniversitario, Universidad de Valparaíso, Chile' },
          { label: 'Supervisión Científica', text: 'Universidad de La Serena, Chile' },
          { label: 'Contexto de Postulación', text: 'Candidato a CERN Doctoral Studentship · Simulación para el experimento SHiP' },
        ],
      },
      {
        title: 'Especialización en Investigación Doctoral',
        lead: 'Fondos Inducidos por Muones y Simulación Adaptativa en SHiP',
        paragraphs: [
          'Estudio y caracterización de fondos de muones de alta intensidad para el experimento SHiP (Search for Hidden Particles) en la instalación de parada de haz del SPS en el CERN.',
          'Aplicación de Flujos Normalizantes (redes invertibles con jacobiano analítico) como estimadores de densidad subrogados y muestreadores adaptativos para distribuciones complejas en el espacio de fase.',
          'Integración de simulaciones en el ecosistema FairShip y GEANT4.',
        ],
      },
      {
        title: 'Metodologías y Competencias Técnicas',
        lead: 'Herramientas Experimentales, Computacionales y Teóricas',
        items: [
          { label: 'Simulación de Detectores', text: 'Framework FairShip, transporte y geometría con GEANT4, técnicas de Monte Carlo' },
          { label: 'Machine Learning y Cálculo', text: 'Flujos normalizantes (acoplamiento afín), estimación de densidad, PyTorch, NumPy, SciPy' },
          { label: 'Fenomenología', text: 'Física BSM, leptones neutros pesados (HNLs), partículas de vida media larga (LLPs), recasting' },
          { label: 'Hardware e Instrumentación', text: 'Lógica digital FPGA, descripción de hardware, adquisición de datos (DAQ) para laboratorio' },
          { label: 'Computación Científica', text: 'Framework ROOT (C++ / Python), entornos Linux/POSIX, flujos de trabajo reproducibles' },
        ],
      },
      {
        title: 'Artefactos Públicos de Investigación y Software',
        lead: 'Repositorios Verificables y Herramientas Educativas Abiertas',
        items: [
          { label: 'ship_adaptive_muon_bg', text: 'Benchmarks numéricos controlados (blancos gaussianos/mezclas D0–D5) para muestreo adaptativo en SHiP (Tesis)' },
          { label: 'labOS', text: 'Registro instrumental y configuración de dispositivos en fase experimental 0 para laboratorios de electrónica' },
          { label: 'ROOT-kata', text: 'Dojo pedagógico interactivo con runner de ejercicios para análisis de datos de partículas con ROOT' },
          { label: 'ROOT-rag', text: 'Prototipo de recuperación léxica local (SQLite FTS5) para documentación de referencia en física de altas energías' },
        ],
      },
      {
        title: 'Transparencia y Límites Científicos',
        lead: 'Demarcación Metodológica',
        paragraphs: [
          'En conformidad con los protocolos de rigor científico, cada software se clasifica explícitamente según su madurez (benchmarks controlados, prototipos de software, herramientas educativas). Ningún resultado numérico preliminar se presenta como física oficial de la colaboración.',
        ],
      },
    ],
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
