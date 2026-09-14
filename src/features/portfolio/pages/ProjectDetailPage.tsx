import { Navigate, useParams } from 'react-router-dom'
import { portfolioProjects } from '../data/projects'
import { theme } from '@/shared/styles/theme'
import {
  BackLink,
  DetailCard,
  DetailGrid,
  DetailHeading,
  DetailHero,
  DetailList,
  DetailPage,
  DetailSection,
  DetailText,
  DetailTitle,
  DemoLink,
  ProjectLinks,
  ProjectLink,
  Eyebrow,
  Intro,
  Status,
  Tag,
  TagList,
} from './PortfolioPage.styles'

const statusLabels = {
  complete: 'Complete',
  'in-progress': 'In progress',
  planned: 'Roadmap',
} as const

export const ProjectDetailPage = () => {
  const { projectId } = useParams()
  const project = portfolioProjects.find((item) => item.id === projectId)

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  const caseStudy = project.caseStudy
  const accent = theme.colors[project.accent]

  return (
    <DetailPage>
      <BackLink to="/projects">← back to projects</BackLink>
      <DetailHero $accent={accent}>
        <Eyebrow>// {project.category}</Eyebrow>
        <DetailHeading>
          <DetailTitle>{project.title}</DetailTitle>
          <Status $accent={accent}>{statusLabels[project.status]}</Status>
        </DetailHeading>
        <Intro>{project.description}</Intro>
        <TagList>
          {project.technologies.map((technology) => (
            <Tag key={technology}>{technology}</Tag>
          ))}
        </TagList>
        {project.demoRoute && (
          <DemoLink to={project.demoRoute} $accent={accent}>
            Open live demo →
          </DemoLink>
        )}
        {(project.sourceUrl || project.deploymentUrl) && (
          <ProjectLinks>
            {project.sourceUrl && (
              <ProjectLink
                href={project.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                View source →
              </ProjectLink>
            )}
            {project.deploymentUrl && (
              <ProjectLink
                href={project.deploymentUrl}
                target="_blank"
                rel="noreferrer"
              >
                View deployment →
              </ProjectLink>
            )}
          </ProjectLinks>
        )}
      </DetailHero>

      {caseStudy ? (
        <>
          <DetailSection>
            <DetailHeading>Why this project exists</DetailHeading>
            <DetailText>{caseStudy.context}</DetailText>
          </DetailSection>
          <DetailSection>
            <DetailHeading>Architecture</DetailHeading>
            <DetailText>{caseStudy.architecture}</DetailText>
          </DetailSection>
          <DetailGrid>
            <DetailCard>
              <DetailHeading>Implementation</DetailHeading>
              <DetailList>
                {caseStudy.implementation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </DetailList>
            </DetailCard>
            <DetailCard>
              <DetailHeading>Quality and delivery</DetailHeading>
              <DetailList>
                {caseStudy.quality.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </DetailList>
            </DetailCard>
          </DetailGrid>
          <DetailSection id="roadmap">
            <DetailHeading>Next steps</DetailHeading>
            <DetailList>
              {caseStudy.nextSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </DetailList>
          </DetailSection>
        </>
      ) : (
        <DetailSection>
          <DetailHeading>Planned scope</DetailHeading>
          <DetailText>
            This project is part of the portfolio roadmap. Its scope is defined
            now so the eventual implementation can be evaluated against a clear
            product and engineering goal.
          </DetailText>
          <DetailList>
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </DetailList>
        </DetailSection>
      )}
    </DetailPage>
  )
}

export default ProjectDetailPage
