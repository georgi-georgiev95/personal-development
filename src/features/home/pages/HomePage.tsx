import React, { useState, useCallback, useRef } from 'react'
import {
  PageWrapper,
  Sidebar,
  SidebarLabel,
  SidebarFilters,
  SidebarFilter,
  SidebarLink,
  AskButton,
  CarouselArea,
  CardStage,
  ProjectCard,
  CardInner,
  CardBadge,
  CardTitle,
  CardDescription,
  CardMeta,
  CardTag,
  CardNav,
  NavArrow,
  NavCounter,
} from './HomePage.styles'

const CARDS = [
  {
    id: 'star-field',
    number: '01',
    name: 'Star Field',
    shortName: 'STARFIELD',
    category: '3D / WEBGL',
    description:
      'Three.js particle system with 600 animated star spheres drifting in deep space.',
    tags: ['THREE.JS', 'WEBGL', 'PARTICLES'],
    colorFrom: '#041a1a',
    colorTo: '#083030',
    accent: '#14b8a6',
  },
  {
    id: 'scroll-orbit',
    number: '02',
    name: 'Scroll Orbit',
    shortName: 'ORBIT',
    category: 'SCROLL',
    description:
      'Scroll-driven 3D card orbit. Cards fade and scale by depth as you scroll the axle.',
    tags: ['R3F', 'SCROLL', '3D'],
    colorFrom: '#100820',
    colorTo: '#1e0e38',
    accent: '#a855f7',
  },
  {
    id: 'spine-figure',
    number: '03',
    name: 'Spine Figure',
    shortName: 'SPINE',
    category: '3D / WEBGL',
    description:
      'Anatomical spiral form in Three.js with scroll-driven rotation and curvature response.',
    tags: ['THREE.JS', 'GEOMETRY', 'ANIMATION'],
    colorFrom: '#060e22',
    colorTo: '#0c1a3a',
    accent: '#3b82f6',
  },
  {
    id: 'firebase-auth',
    number: '04',
    name: 'Firebase Auth',
    shortName: 'AUTH',
    category: 'AUTHENTICATION',
    description:
      'Full auth flow — login, register, profile modal, sign out — powered by Firebase.',
    tags: ['FIREBASE', 'REACT', 'AUTH'],
    colorFrom: '#1a0e04',
    colorTo: '#301a08',
    accent: '#f97316',
  },
  {
    id: 'ui-kit',
    number: '05',
    name: 'UI Kit',
    shortName: 'UI-KIT',
    category: 'UI',
    description:
      'Reusable component library — Button, Modal, Text — built with zero-runtime Linaria CSS.',
    tags: ['LINARIA', 'STORYBOOK', 'VITEST'],
    colorFrom: '#200614',
    colorTo: '#360a22',
    accent: '#ec4899',
  },
  {
    id: 'error-boundary',
    number: '06',
    name: 'Error Boundary',
    shortName: 'ERRBOUND',
    category: 'EXPERIMENTS',
    description:
      'React Error Boundary with graceful fallback UI and route-level error isolation.',
    tags: ['REACT', 'ERROR', 'UX'],
    colorFrom: '#041408',
    colorTo: '#082210',
    accent: '#22c55e',
  },
]

export const HomePage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const wheelLockRef = useRef(0)

  const clampedIndex = Math.min(activeIndex, CARDS.length - 1)
  const activeCard = CARDS[clampedIndex]

  const prev = useCallback(() => {
    setActiveIndex((i) => (i > 0 ? i - 1 : CARDS.length - 1))
  }, [])

  const next = useCallback(() => {
    setActiveIndex((i) => (i < CARDS.length - 1 ? i + 1 : 0))
  }, [])

  const handleCardLinkClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, index: number) => {
      event.preventDefault()
      setActiveIndex(index)
    },
    []
  )

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (CARDS.length <= 1) {
        return
      }

      const now = Date.now()
      const lockMs = 180

      if (now - wheelLockRef.current < lockMs || Math.abs(event.deltaY) < 6) {
        return
      }

      wheelLockRef.current = now

      if (event.deltaY > 0) {
        next()
      } else {
        prev()
      }
    },
    [next, prev]
  )

  return (
    <PageWrapper>
      <Sidebar>
        <SidebarLabel>What are you looking for?</SidebarLabel>
        <SidebarFilters>
          {CARDS.map((card, index) => (
            <SidebarFilter key={card.id}>
              <SidebarLink
                href={`#${card.id}`}
                $active={index === clampedIndex}
                onClick={(event) => handleCardLinkClick(event, index)}
              >
                {`→ ${card.name}`}
              </SidebarLink>
            </SidebarFilter>
          ))}
        </SidebarFilters>
        <AskButton>Ask me anything...</AskButton>
      </Sidebar>

      <CarouselArea onWheel={handleWheel}>
        <CardNav>
          <NavArrow onClick={prev} aria-label="Previous project">
            {'<<'}
          </NavArrow>
          <NavCounter>{`${clampedIndex + 1}. ${activeCard.shortName}`}</NavCounter>
          <NavArrow onClick={next} aria-label="Next project">
            {'>>'}
          </NavArrow>
        </CardNav>

        <CardStage>
          {CARDS.map((card, index) => {
            const offset = index - clampedIndex
            return (
              <ProjectCard
                key={card.id}
                id={card.id}
                $offset={offset}
                $colorFrom={card.colorFrom}
                $colorTo={card.colorTo}
                $accent={card.accent}
                onClick={() => setActiveIndex(index)}
              >
                <CardInner>
                  <CardBadge $accent={card.accent}>{card.number}</CardBadge>
                  <CardTitle>{card.name}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                  <CardMeta>
                    {card.tags.map((tag) => (
                      <CardTag key={tag} $accent={card.accent}>
                        {tag}
                      </CardTag>
                    ))}
                  </CardMeta>
                </CardInner>
              </ProjectCard>
            )
          })}
        </CardStage>
      </CarouselArea>
    </PageWrapper>
  )
}

export default HomePage
