import {
  Eyebrow,
  Heading,
  Intro,
  Page,
  ProofGrid,
  ProofItem,
  ProofLabel,
  ProofValue,
  Prose,
  ProjectLink,
  ProjectLinks,
  Section,
  SectionHeading,
} from './PortfolioPage.styles'

const proofPoints = [
  [
    'Architecture',
    'Feature-Sliced React and TypeScript with lazy route boundaries.',
  ],
  [
    'Quality gate',
    'Lint, typecheck, formatting, coverage, build, and performance checks.',
  ],
  [
    'Testing',
    'Vitest and React Testing Library today, with Playwright journeys planned.',
  ],
  ['Design system', 'Shared UI-kit components documented through Storybook.'],
  [
    'Performance',
    'Three.js and Firestore stay out of the initial load where possible.',
  ],
  [
    'AI workflow',
    'Repository harness guidance and project skills make decisions repeatable.',
  ],
]

export const EngineeringPage = () => (
  <Page>
    <Eyebrow>// engineering notes</Eyebrow>
    <Heading>The portfolio is also the case study.</Heading>
    <Intro>
      This page explains how the application is structured, tested, and shipped
      so the technology list is backed by implementation details.
    </Intro>
    <Section>
      <SectionHeading>Current proof points</SectionHeading>
      <ProofGrid>
        {proofPoints.map(([label, value]) => (
          <ProofItem key={label}>
            <ProofLabel>{label}</ProofLabel>
            <ProofValue>{value}</ProofValue>
          </ProofItem>
        ))}
      </ProofGrid>
    </Section>
    <Section>
      <SectionHeading>How the work evolves</SectionHeading>
      <Prose>
        <p>
          Each feature starts with a clear goal and a small implementation
          slice. Business logic is kept testable, while UI work is checked for
          responsive behavior, keyboard access, and visual clarity.
        </p>
        <p>
          AI is used as an engineering accelerator, not as a replacement for
          product judgment. Harness instructions, reusable skills, acceptance
          criteria, and quality gates keep the process inspectable from idea to
          deployment.
        </p>
      </Prose>
    </Section>
    <Section>
      <SectionHeading>Architecture in practice</SectionHeading>
      <Prose>
        <p>
          The Photobook feature uses Firebase Authentication for signed-in
          actions, Firestore for realtime photos, comments, and reactions, and
          Storage for compressed image uploads. Its use cases are composed
          through dependency injection so infrastructure remains replaceable and
          testable.
        </p>
        <p>
          Shared UI-kit components, Linaria styling, semantic HTML, keyboard
          interactions, and responsive layouts provide the common foundation.
          Unit and integration tests protect business behavior, while Storybook
          documents component APIs and accessibility states.
        </p>
      </Prose>
    </Section>
    <Section>
      <SectionHeading>Repository evidence</SectionHeading>
      <Prose>
        <p>
          The implementation and delivery claims above can be inspected in the
          repository. Workflow links show the automated quality and deployment
          paths, while Storybook source shows the documented component surface.
        </p>
      </Prose>
      <ProjectLinks>
        <ProjectLink
          href="https://github.com/georgi-georgiev95/personal-development/actions/workflows/quality-gate.yml"
          target="_blank"
          rel="noreferrer"
        >
          Quality gate workflow →
        </ProjectLink>
        <ProjectLink
          href="https://github.com/georgi-georgiev95/personal-development/actions/workflows/firebase-deploy.yml"
          target="_blank"
          rel="noreferrer"
        >
          Deployment workflow →
        </ProjectLink>
        <ProjectLink
          href="https://github.com/georgi-georgiev95/personal-development/tree/main/.storybook"
          target="_blank"
          rel="noreferrer"
        >
          Storybook configuration →
        </ProjectLink>
        <ProjectLink
          href="https://github.com/georgi-georgiev95/personal-development/blob/main/scripts/check-perf-budget.js"
          target="_blank"
          rel="noreferrer"
        >
          Performance budget script →
        </ProjectLink>
        <ProjectLink
          href="https://github.com/georgi-georgiev95/personal-development/tree/main/src/shared/ui-kit"
          target="_blank"
          rel="noreferrer"
        >
          Shared UI kit source →
        </ProjectLink>
      </ProjectLinks>
    </Section>
  </Page>
)

export default EngineeringPage
