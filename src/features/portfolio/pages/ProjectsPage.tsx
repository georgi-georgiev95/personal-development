import { portfolioProjects } from '../data/projects'
import { theme } from '@/shared/styles/theme'
import {
  CardHeader,
  ActionLink,
  CardActions,
  CardTitle,
  Category,
  Description,
  Purpose,
  Eyebrow,
  Grid,
  Heading,
  Highlights,
  Intro,
  Page,
  ProjectCard,
  Status,
  Tag,
  TagList,
} from './PortfolioPage.styles'

const statusLabels = {
  complete: 'Complete',
  'in-progress': 'In progress',
  planned: 'Roadmap',
} as const

export const ProjectsPage = () => (
  <Page>
    <Eyebrow>// project index</Eyebrow>
    <Heading>One portfolio. Multiple frontend problems.</Heading>
    <Intro>
      Every project lives inside this application and exists to demonstrate a
      specific product and engineering capability.
    </Intro>
    <Grid>
      {portfolioProjects.map((project) => {
        const accent = theme.colors[project.accent]
        return (
          <ProjectCard key={project.id} $accent={accent}>
            <CardHeader>
              <div>
                <Category>{project.category}</Category>
                <CardTitle>{project.title}</CardTitle>
              </div>
              <Status $accent={accent}>{statusLabels[project.status]}</Status>
            </CardHeader>
            <Description>{project.summary}</Description>
            <Purpose>Why: {project.purpose}</Purpose>
            <TagList>
              {project.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </TagList>
            <Highlights>
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </Highlights>
            <CardActions>
              {project.status !== 'complete' && (
                <ActionLink
                  to={
                    project.status === 'in-progress'
                      ? `${project.route}#roadmap`
                      : project.route
                  }
                  $accent={accent}
                  $primary
                >
                  view roadmap →
                </ActionLink>
              )}
              {project.status !== 'planned' && project.demoRoute && (
                <ActionLink to={project.demoRoute} $accent={accent} $primary>
                  open project →
                </ActionLink>
              )}
              {project.status !== 'planned' && (
                <ActionLink
                  to={project.documentationUrl ?? project.route}
                  $accent={accent}
                >
                  open docs →
                </ActionLink>
              )}
            </CardActions>
          </ProjectCard>
        )
      })}
    </Grid>
  </Page>
)

export default ProjectsPage
