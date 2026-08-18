export type Status = 'live' | 'running' | 'archived'

export interface Project {
  name: string
  tag: string
  description: string
  tech: string[]
  status: Status
  liveUrl?: string
  repoUrl: string
}

export const osnFeatured: Project = {
  name: 'OSN Extra',
  tag: 'Live Tactical Threat Matrix',
  description:
    "A real-time command interface tracking geopolitical ultimatums, threat levels, and intelligence activity across the Middle East and beyond — with an interactive tactical radar, live alerts, and a four-stage cinematic entry sequence.",
  tech: ['HTML5', 'Tailwind CSS', 'Leaflet.js', 'D3.js', 'Web Audio API'],
  status: 'live',
  liveUrl: 'https://osn-e-xtra.vercel.app/',
  repoUrl: 'https://github.com/OSK0020/OSN-EXTRA-WEB',
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
  },
  {
    name: 'X Auto-Reply Bot',
    tag: 'Autonomous OSINT automation',
    description:
      "The same bot that powers OSN's automation layer on X — a four-model Gemini cascade, real-time fact verification, and instant push alerts to mobile via NTFY.",
    tech: ['Python', 'Gemini API', 'Search Grounding'],
    status: 'running',
    repoUrl: 'https://github.com/OSK0020/X-comment-BOT',
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
