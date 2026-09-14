import type { PortfolioProject } from './types'
import { projectCaseStudies } from './caseStudies'

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'photobook',
    title: 'Photobook',
    summary:
      'A real-time community photo feed for sharing, discussion, and moderation.',
    purpose: 'Demonstrate authenticated CRUD, realtime UX, and moderation.',
    description:
      'The first portfolio product: a Firebase-backed social experience that demonstrates authenticated CRUD, live subscriptions, image handling, reactions, comments, and an admin workflow.',
    category: 'Product application',
    technologies: ['React', 'TypeScript', 'Firebase', 'Firestore', 'Linaria'],
    skills: [
      'CRUD',
      'Authentication',
      'Real-time UX',
      'Moderation',
      'Responsive UI',
    ],
    status: 'complete',
    accent: 'success',
    route: '/projects/photobook',
    demoRoute: '/photobook',
    caseStudy: projectCaseStudies.photobook,
    sourceUrl:
      'https://github.com/georgi-georgiev95/personal-development/tree/main/src/features/photobook',
    documentationUrl: '/projects/photobook',
    highlights: [
      'Public gallery with authenticated contributions',
      'Real-time photos, comments, and reactions',
      'Admin-only moderation route',
    ],
  },
  {
    id: 'personal-development',
    title: 'Personal Development',
    summary:
      'The portfolio platform that contains every project and engineering case study.',
    purpose:
      'Make frontend decisions, delivery practices, and project growth inspectable.',
    description:
      'The main project demonstrates how a frontend portfolio can be designed as a small product: typed content, route-level composition, reusable UI, documented decisions, automated quality checks, and a roadmap of focused experiments.',
    category: 'Portfolio platform',
    technologies: ['React', 'TypeScript', 'Vite', 'Storybook', 'CI/CD'],
    skills: [
      'Architecture',
      'Design systems',
      'Testing strategy',
      'Performance',
      'AI workflow',
    ],
    status: 'in-progress',
    accent: 'primary',
    route: '/projects/personal-development',
    demoRoute: '/',
    documentationUrl: '/projects/personal-development',
    caseStudy: projectCaseStudies['personal-development'],
    highlights: [
      'One application containing multiple project experiences',
      'Feature-Sliced architecture with lazy route boundaries',
      'Harness-driven delivery with quality gates',
    ],
  },
  {
    id: 'api-explorer',
    title: 'API Explorer',
    summary:
      'A data-rich interface for exploring a public API with resilient states.',
    purpose:
      'Practice resilient data fetching, filtering, pagination, and caching.',
    description:
      'A planned project focused on practical API consumption: search, pagination, caching, filtering, and clear loading, empty, and error experiences.',
    category: 'Data interface',
    technologies: ['React', 'TypeScript', 'REST API', 'Testing'],
    skills: ['Data fetching', 'Caching', 'Pagination', 'Error handling'],
    status: 'planned',
    accent: 'primary',
    route: '/projects/api-explorer',
    documentationUrl: '/projects/api-explorer',
    highlights: ['REST integration', 'Search and filters', 'Reliable async UX'],
  },
  {
    id: 'financial-dashboard',
    title: 'Financial Dashboard',
    summary:
      'A precise, responsive dashboard for complex financial information.',
    purpose:
      'Explore high-density fintech UI, visualizations, and numeric precision.',
    description:
      'A planned fintech-oriented interface for demonstrating charts, tables, currency precision, responsive layouts, and information hierarchy for high-density data.',
    category: 'Fintech interface',
    technologies: [
      'React',
      'TypeScript',
      'Data visualization',
      'Design system',
    ],
    skills: ['Data visualization', 'Tables', 'Precision', 'Responsive design'],
    status: 'planned',
    accent: 'secondary',
    route: '/projects/financial-dashboard',
    documentationUrl: '/projects/financial-dashboard',
    highlights: [
      'High-density information design',
      'Currency-safe formatting',
      'Responsive analytics',
    ],
  },
  {
    id: 'ai-workspace',
    title: 'AI Workspace',
    summary:
      'A responsible AI interface with streaming responses and recovery paths.',
    purpose:
      'Demonstrate transparent, resilient, and human-centered AI interactions.',
    description:
      'A planned project for demonstrating chat UX, streaming states, cancellation, retries, structured responses, and transparent AI interactions.',
    category: 'AI product interface',
    technologies: ['React', 'TypeScript', 'Streaming UI', 'AI API'],
    skills: ['AI UX', 'Async state', 'Progressive disclosure', 'Resilience'],
    status: 'planned',
    accent: 'primary',
    route: '/projects/ai-workspace',
    documentationUrl: '/projects/ai-workspace',
    highlights: [
      'Streaming interaction model',
      'Error and retry states',
      'Human-readable AI output',
    ],
  },
  {
    id: 'design-system',
    title: 'Design System',
    summary:
      'The reusable component foundation behind the portfolio experience.',
    purpose:
      'Make accessibility, component APIs, and visual consistency explicit.',
    description:
      'A planned expansion of the existing UI kit showing component APIs, composition, accessibility, responsive behavior, and visual documentation in Storybook.',
    category: 'Frontend foundation',
    technologies: ['React', 'TypeScript', 'Storybook', 'Linaria'],
    skills: ['Component APIs', 'Accessibility', 'Documentation', 'Consistency'],
    status: 'in-progress',
    accent: 'secondary',
    route: '/projects/design-system',
    demoRoute: '/',
    documentationUrl: '/projects/design-system',
    highlights: [
      'Reusable UI primitives',
      'Accessible interaction patterns',
      'Storybook documentation',
    ],
  },
  {
    id: 'performance-lab',
    title: 'Performance Lab',
    summary:
      'A focused workspace for measuring and improving frontend performance.',
    purpose:
      'Make code splitting, Web Vitals, and bundle optimization measurable.',
    description:
      'A planned set of experiments for profiling real interfaces, comparing loading strategies, and documenting the performance trade-offs behind frontend decisions.',
    category: 'Frontend performance',
    technologies: ['React', 'TypeScript', 'Web Vitals', 'Code splitting'],
    skills: ['Profiling', 'Web Vitals', 'Bundle optimization', 'Measurement'],
    status: 'planned',
    accent: 'success',
    route: '/projects/performance-lab',
    documentationUrl: '/projects/performance-lab',
    highlights: [
      'Repeatable performance experiments',
      'Web Vitals measurement',
      'Bundle and loading strategy comparisons',
    ],
  },
]
