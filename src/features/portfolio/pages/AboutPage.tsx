import {
  Eyebrow,
  Heading,
  Intro,
  Page,
  Prose,
  Section,
  SectionHeading,
} from './PortfolioPage.styles'

export const AboutPage = () => (
  <Page>
    <Eyebrow>// about</Eyebrow>
    <Heading>Frontend engineering with curiosity, clarity, and care.</Heading>
    <Intro>
      I am Georgi Georgiev, a frontend developer based in Varna, Bulgaria,
      currently working in the fintech space at Devexperts.
    </Intro>
    <Section>
      <SectionHeading>What I build</SectionHeading>
      <Prose>
        <p>
          I enjoy turning complex requirements into interfaces that feel clear,
          responsive, and dependable. My main tools are React and TypeScript,
          with a particular interest in real-time products, data-heavy screens,
          accessible interaction, and thoughtful visual systems.
        </p>
        <p>
          This portfolio is itself a working product. Its projects are small,
          focused experiments that make frontend decisions visible: how data is
          loaded, how states recover, how components scale, and how quality is
          protected before release.
        </p>
        <p>
          I am especially interested in frontend products that combine rich
          data, real-time behavior, accessible interaction, and AI-powered user
          experiences without sacrificing clarity or maintainability.
        </p>
      </Prose>
    </Section>
  </Page>
)

export default AboutPage
