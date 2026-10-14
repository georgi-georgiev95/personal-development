import {
  ActionLink,
  Actions,
  Example,
  Eyebrow,
  Heading,
  Intro,
  ProductPage,
  Section,
} from '@/features/home/pages/HomePage.styles'

export function HomePage() {
  return (
    <ProductPage>
      <div>
        <Eyebrow>A little help, when you need it</Eyebrow>
        <Heading>Make sense of what’s next.</Heading>
        <Intro>
          Bring a goal, a question, or something you’re stuck on. We’ll help you
          find a clear first step.
        </Intro>
        <Actions>
          <ActionLink to="/workspace/tasks/new" $primary>
            Start with a question
          </ActionLink>
          <ActionLink to="/demo">See how it works</ActionLink>
        </Actions>
      </div>
      <Example aria-label="Example idea and next steps">
        <Eyebrow>A simple first step</Eyebrow>
        <h2>I want my room to feel brighter.</h2>
        <ol>
          <li>Notice what already brings light into the room</li>
          <li>Choose one easy change that fits your budget</li>
          <li>Try it, then decide if you want to do more</li>
        </ol>
      </Example>
      <Section>
        Sign in to find your next steps and save them privately. The demo uses
        sample responses and resets on reload. You choose which steps to take.
      </Section>
    </ProductPage>
  )
}

export default HomePage
