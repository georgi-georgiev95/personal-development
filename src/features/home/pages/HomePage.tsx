import {
  ActionLink,
  FeatureGrid,
  FeatureCard,
  Eyebrow,
  FeatureList,
  Heading,
  Intro,
  Section,
  SectionHeading,
  Workflow,
  ProductPage,
} from './HomePage.styles'

export const HomePage = () => (
  <ProductPage>
    <Eyebrow>// AI Delivery Lab</Eyebrow>
    <Heading>Turn a development task into a reviewable handoff.</Heading>
    <Intro>
      A task-to-handoff workflow for solo developers: clarify the goal, plan the
      work, record implementation and manual validation, then prepare a clear
      handoff. The product tracks work; it does not run code or checks.
    </Intro>
    <ActionLink to="/demo" $primary>
      Explore the public demo →
    </ActionLink>
    <ActionLink to="/login">Sign in</ActionLink>

    <Section aria-labelledby="workflow-heading">
      <SectionHeading id="workflow-heading">The workflow</SectionHeading>
      <Workflow>
        <li>Capture the task goal, scope, and repository context.</li>
        <li>Shape a small plan and record implementation done elsewhere.</li>
        <li>Enter manual validation evidence, review, and hand off.</li>
      </Workflow>
    </Section>

    <Section aria-labelledby="availability-heading">
      <SectionHeading id="availability-heading">
        What is available
      </SectionHeading>
      <FeatureGrid>
        <FeatureCard>
          <h3>Available now</h3>
          <FeatureList>
            <li>
              Explore a resettable, simulated workflow without an account.
            </li>
            <li>Sign in or create an account.</li>
          </FeatureList>
        </FeatureCard>
        <FeatureCard>
          <h3>Planned for the first release</h3>
          <FeatureList>
            <li>Private workspaces with saved tasks and manual evidence.</li>
            <li>AI-assisted planning within a task.</li>
          </FeatureList>
        </FeatureCard>
        <FeatureCard>
          <h3>Outside the release</h3>
          <FeatureList>
            <li>Code execution, GitHub connections, and CI result imports.</li>
            <li>Team invitations, billing, and production backend rollout.</li>
          </FeatureList>
        </FeatureCard>
      </FeatureGrid>
    </Section>
  </ProductPage>
)

export default HomePage
