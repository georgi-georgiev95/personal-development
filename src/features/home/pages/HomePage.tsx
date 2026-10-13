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
    <Heading>Turn an idea into a useful implementation brief.</Heading>
    <Intro>
      Clarify what you want to change, shape a small plan, and carry a focused
      brief into your own development work. The product records your thinking;
      it does not write code or run checks.
    </Intro>
    <ActionLink to="/workspace/tasks/new" $primary>
      Start a private brief →
    </ActionLink>
    <ActionLink to="/demo">See a simulated brief</ActionLink>
    <ActionLink to="/login">Sign in to save your work</ActionLink>

    <Section aria-labelledby="workflow-heading">
      <SectionHeading id="workflow-heading">The workflow</SectionHeading>
      <Workflow>
        <li>Describe the outcome and the context that matters.</li>
        <li>
          Review a concise implementation brief with practical next steps.
        </li>
        <li>Save it privately, then take the work into your own repository.</li>
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
            <li>Try a resettable, simulated brief without an account.</li>
            <li>
              Sign in or create an account before generating or saving for real.
            </li>
            <li>Save tasks, context, evidence, and handoff artifacts.</li>
            <li>
              Generate and review AI-assisted plans within your workspace.
            </li>
          </FeatureList>
        </FeatureCard>
        <FeatureCard>
          <h3>What the product records</h3>
          <FeatureList>
            <li>Your goal, context, plan, and acceptance criteria.</li>
            <li>Implementation work performed outside the product.</li>
            <li>Manual validation and delivery handoffs.</li>
          </FeatureList>
        </FeatureCard>
        <FeatureCard>
          <h3>Outside the release</h3>
          <FeatureList>
            <li>Code execution, GitHub connections, and CI result imports.</li>
            <li>Automated coding, team invitations, and billing.</li>
          </FeatureList>
        </FeatureCard>
      </FeatureGrid>
    </Section>
  </ProductPage>
)

export default HomePage
