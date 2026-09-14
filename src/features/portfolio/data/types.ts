export type ProjectStatus = 'complete' | 'in-progress' | 'planned'
export type ProjectAccent = 'primary' | 'secondary' | 'success'

export interface ProjectCaseStudy {
  context: string
  architecture: string
  implementation: string[]
  quality: string[]
  nextSteps: string[]
}

export interface PortfolioProject {
  id: string
  title: string
  summary: string
  purpose: string
  description: string
  category: string
  technologies: string[]
  skills: string[]
  status: ProjectStatus
  accent: ProjectAccent
  route: string
  demoRoute?: string
  sourceUrl?: string
  deploymentUrl?: string
  documentationUrl?: string
  caseStudy?: ProjectCaseStudy
  highlights: string[]
}
