import {
  ActionLink,
  Actions,
  Example,
  ExampleInput,
  Eyebrow,
  Heading,
  Intro,
  ProductPage,
  Section,
} from '@/features/home/pages/HomePage.styles'

export function HomePage() {
  return (
    <ProductPage>
      <Eyebrow>AI Planner</Eyebrow>
      <Heading>Turn everyday problems into a clear plan.</Heading>
      <Intro>
        Tell AI what you want to achieve. Get practical steps you can edit,
        copy, and save.
      </Intro>
      <Actions>
        <ActionLink to="/workspace/tasks/new" $primary>
          Start a plan →
        </ActionLink>
        <ActionLink to="/demo">Try the demo</ActionLink>
      </Actions>
      <Example aria-label="Example idea and plan">
        <ExampleInput>
          <Eyebrow>Your idea</Eyebrow>
          <h2>“Make my room brighter.”</h2>
        </ExampleInput>
        <div>
          <Eyebrow>Your plan</Eyebrow>
          <ol>
            <li>Check what blocks the light</li>
            <li>Try a low-cost change</li>
            <li>Compare before and after</li>
          </ol>
          <p>✓ A brighter room, within your budget.</p>
        </div>
      </Example>
      <Section>
        Sign in for AI-generated plans and private saving. The demo uses sample
        responses and resets on reload. You choose which steps to take.
      </Section>
    </ProductPage>
  )
}

export default HomePage
