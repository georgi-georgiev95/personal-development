import {
  ActionLink,
  Eyebrow,
  Heading,
  Intro,
  ProductPage,
} from './HomePage.styles'

export const HomePage = () => (
  <ProductPage>
    <Eyebrow>// AI Delivery Lab</Eyebrow>
    <Heading>From a task to a verified handoff.</Heading>
    <Intro>
      A practical workspace for turning a goal into a clear plan, focused code
      changes, and evidence that the result works.
    </Intro>
    <ActionLink to="/demo" $primary>
      Explore the simulated demo →
    </ActionLink>
  </ProductPage>
)

export default HomePage
