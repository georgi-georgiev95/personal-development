import React from 'react'
import {
  PageWrapper,
  HeroOverlay,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  HeroTagline,
} from './HomePage.styles'

export const HomePage: React.FC = () => {
  return (
    <PageWrapper>
      <HeroOverlay>
        <HeroContent>
          <HeroTitle>Georgi Georgiev</HeroTitle>
          <HeroSubtitle>Software Engineer</HeroSubtitle>
          <HeroTagline>
            Building modern web experiences with clean code and creative design
          </HeroTagline>
        </HeroContent>
      </HeroOverlay>
    </PageWrapper>
  )
}

export default HomePage
