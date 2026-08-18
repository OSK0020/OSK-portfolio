export type Status = 'live' | 'running' | 'archived'

export interface ProjectMetric {
  label: string
  value: string
}

export interface Project {
  name: string
  tag: string
  description: string
  tech: string[]
  status: Status
  liveUrl?: string
  repoUrl: string
  metrics?: ProjectMetric[]
  dossier?: {
    overview: string
    architecture: string[]
    telemetry: string
  }
}

export const osnFeatured: Project = {
  name: 'OSN Extra',
  tag: 'Live Tactical Threat Matrix',
  description:
    'A real-time command interface tracking geopolitical ultimatums, threat levels, and intelligence activity across the Middle East and beyond — with an interactive tactical radar, live alerts, and a four-stage cinematic entry sequence.',
  tech: ['HTML5', 'Tailwind CSS', 'Leaflet.js', 'D3.js', 'Web Audio API'],
  status: 'live',
  liveUrl: 'https://osn-e-xtra.vercel.app/',
  repoUrl: 'https://github.com/OSK0020/OSN-EXTRA-WEB',
  metrics: [
    { label: 'Signals/sec', value: '4.2k' },
    { label: 'Latency', value: '38ms' },
    { label: 'Frame Budget', value: '60 FPS' },
  ],
  dossier: {
    overview:
      'Primary operational frontend for OSN. Streams multi-source threat intelligence through a worker pipeline, scoring geopolitical escalation anomalies with heuristic weighting and rendering live alerts on an interactive radar matrix.',
    architecture: [
      'Leaflet & D3.js real-time spatial projection layers',
      'Procedural Web Audio API tactical sound synthesis (Zero MP3)',
      'Multi-stage cinematic entry gate & live ultimatum counters',
    ],
    telemetry: 'DEFCON 2 // 14 Active Regional Feeds // 99.9% Ingest Uptime',
  },
}

export const osnSecondary: Project = {
  name: 'Global Security Data Poll',
  tag: "OSN's main platform",
  description:
    'An automated intelligence aggregator pipelining dozens of RSS feeds from global security networks, mapped onto an interactive 3D globe — alongside a historical archive of 80+ major intelligence events.',
  tech: ['Next.js', 'React', 'TypeScript', 'WebGL'],
  status: 'live',
  liveUrl: 'https://osn-website.vercel.app/',
  repoUrl: 'https://github.com/OSK0020/global-security-data-poll',
  metrics: [
    { label: 'Global Feeds', value: '48' },
    { label: 'Archive Events', value: '80+' },
    { label: '3D Render', value: 'WebGL' },
  ],
  dossier: {
    overview:
      'Central archival and live aggregation repository for Observer Security Network. Maps intercepted signals to global latitude/longitude coordinates on a high-DPI 3D globe.',
    architecture: [
      'Next.js App Router with Server-Sent Events (SSE)',
      'Custom WebGL shader pipeline for high-density particle globe',
      'Historical intelligence archive with full-text search indexing',
    ],
    telemetry: 'GLOBAL MATRIX ACTIVE // 412 Synced Geo-Nodes',
  },
}

export const labProjects: Project[] = [
  {
    name: 'AI Models Laboratory',
    tag: 'Experimental visual playground',
    description:
      'A visual lab for comparing leading AI image-generation models in real time, with a 3D WebGL scene, a synthesized Web Audio sound engine, and a smart performance guard that detects low-end hardware and falls back automatically.',
    tech: ['Next.js 15', 'Three.js', 'Tailwind CSS 4'],
    status: 'live',
    liveUrl: 'https://iamge-lab-website.vercel.app/',
    repoUrl: 'https://github.com/OSK0020/imagetestLAB-poll',
    metrics: [
      { label: 'Models Compared', value: '6' },
      { label: 'GPU Fallback', value: 'Auto-Guard' },
      { label: 'Inference Sim', value: 'Real-time' },
    ],
    dossier: {
      overview:
        'Interactive benchmarking lab comparing generative AI models (FLUX.1, SDXL, Midjourney, Gemini). Evaluates visual fidelity, prompt comprehension, latency curves, and VRAM memory budgets in real time.',
      architecture: [
        'Three.js 3D viewport with dynamic shader lighting',
        'Hardware GPU capability detection & adaptive fallback',
        'Synthesized audio engine responding to model generation stages',
      ],
      telemetry: 'BENCHMARK SUITE v2.4 // LATENT VISUALIZER ONLINE',
    },
  },
  {
    name: 'X Auto-Reply Bot',
    tag: 'Autonomous OSINT automation',
    description:
      "The same bot that powers OSN's automation layer on X — a four-model Gemini cascade, real-time fact verification, and instant push alerts to mobile via NTFY.",
    tech: ['Python', 'Gemini API', 'Search Grounding'],
    status: 'running',
    repoUrl: 'https://github.com/OSK0020/X-comment-BOT',
    metrics: [
      { label: 'Model Cascade', value: '4-Stage' },
      { label: 'Grounding', value: 'Live Search' },
      { label: 'Alert Push', value: '<500ms' },
    ],
    dossier: {
      overview:
        'Autonomous agent monitoring social media feeds, verifying emerging geopolitical breaking news using Gemini Search Grounding, and notifying operational commanders via encrypted NTFY mobile channels.',
      architecture: [
        'Python 3.12 async event loop with rate-limiting backoff',
        'Multi-model Gemini cascade with prompt verification gates',
        'End-to-end encrypted NTFY push notifications with actionable payloads',
      ],
      telemetry: '24/7 AUTONOMOUS RECON // ZERO DROP RATE',
    },
  },
]

export const processSteps = [
  {
    num: '01',
    tag: 'DISCOVERY',
    title: 'Discovery',
    body: 'We get aligned on the data you have, who will use it, and the business goal the interface needs to serve.',
  },
  {
    num: '02',
    tag: 'ARCHITECTURE',
    title: 'Architecture',
    body: 'We pick the right stack for the job — Next.js, Python, WebGL — based on the need, not the trend.',
  },
  {
    num: '03',
    tag: 'BUILD',
    title: 'Build',
    body: 'Iterative development with live demos along the way, so you watch the interface grow in real time.',
  },
  {
    num: '04',
    tag: 'DEPLOY',
    title: 'Deploy & Support',
    body: 'Going live, ongoing monitoring, and support — exactly how every OSN product runs today.',
  },
]

export const stats = [
  { value: 4, suffix: '', label: 'products in production' },
  { value: 24, suffix: '/7', label: 'live monitoring & automation' },
  { value: 1, suffix: '', label: 'intelligence network founded', display: 'OSN' },
]
