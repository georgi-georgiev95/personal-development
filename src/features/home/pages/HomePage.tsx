import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  PageWrapper,
  HudCorner,
  MainRow,
  HeadlineWrap,
  HeroLabel,
  HeroText,
  HeroCursor,
  HeroPillsRow,
  HeroPill,
  CarouselZone,
  StackWrap,
  CardStage,
  ProjectCard,
  CardGlow,
  CardInner,
  CardBadge,
  CardBody,
  CardTitle,
  CardDescription,
  CardMeta,
  CardTag,
  CardViewLink,
  AccentArrow,
  CardNav,
  NavArrow,
  NavCounter,
  PagerTitle,
  ScrollHintWrap,
  ScrollHintText,
  ScrollArrow,
  ScrollTicksRow,
  ScrollTick,
  BottomRow,
  LeftCol,
  RightCol,
  SidebarLabel,
  SidebarChevron,
  SidebarFilters,
  SidebarFilter,
  SidebarLink,
  SidebarLinkArrow,
  SidebarLinkIndex,
  SidebarLinkTitle,
  ChatForm,
  ChatPrompt,
  ChatInput,
  ChatReply,
  Coordinates,
  CopyrightText,
} from './HomePage.styles'

const CARDS = [
  {
    id: 'star-field',
    name: 'Star Field',
    description:
      'Three.js particle system with 600 animated star spheres drifting in deep space.',
    tags: ['THREE.JS', 'WEBGL', 'PARTICLES'],
    accent: '#2dd4bf',
  },
  {
    id: 'scroll-orbit',
    name: 'Scroll Orbit',
    description:
      'Scroll-driven 3D card orbit. Cards fade and scale by depth as you scroll the axis.',
    tags: ['GSAP', 'SCROLL', '3D'],
    accent: '#a78bfa',
  },
  {
    id: 'spine-figure',
    name: 'Spine Figure',
    description:
      'Skeletal rig animation blended in real time through the Spine runtime.',
    tags: ['SPINE', 'CANVAS', 'RIG'],
    accent: '#60a5fa',
  },
  {
    id: 'firebase-auth',
    name: 'Firebase Auth',
    description:
      'Full auth flow with email link, OAuth providers and persisted sessions.',
    tags: ['FIREBASE', 'AUTH', 'SDK'],
    accent: '#fbbf24',
  },
  {
    id: 'ui-kit',
    name: 'UI Kit',
    description:
      'Reusable component library with design tokens, variants and Storybook docs.',
    tags: ['REACT', 'TOKENS', 'STORYBOOK'],
    accent: '#fb7185',
  },
  {
    id: 'error-boundary',
    name: 'Error Boundary',
    description:
      'Resilient React error boundaries with graceful fallback UI and logging.',
    tags: ['REACT', 'RESILIENCE', 'LOGGING'],
    accent: '#f87171',
  },
]

const VISIBLE_SPIRAL_RANGE = 2
const AUTO_ROTATE_MS = 5000

const formatIndex = (index: number) => String(index + 1).padStart(2, '0')

export const HomePage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [clock, setClock] = useState(() => new Date())
  const [chatValue, setChatValue] = useState('')
  const [chatReply, setChatReply] = useState<string | null>(null)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const touchStartYRef = useRef<number | null>(null)
  const wheelCooldownRef = useRef(false)
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pageWrapperRef = useRef<HTMLDivElement | null>(null)
  const carouselZoneRef = useRef<HTMLDivElement | null>(null)

  const activeCard = CARDS[activeIndex]

  const restartAutoRotate = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current)
    autoTimerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % CARDS.length)
    }, AUTO_ROTATE_MS)
  }, [])

  useEffect(() => {
    restartAutoRotate()
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current)
    }
  }, [restartAutoRotate])

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const goTo = useCallback(
    (index: number) => {
      const length = CARDS.length
      setActiveIndex(((index % length) + length) % length)
      restartAutoRotate()
    },
    [restartAutoRotate]
  )

  const prev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex])

  const next = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex])

  const moveBy = useCallback(
    (delta: number) => {
      if (delta === 0) {
        return
      }
      goTo(activeIndex + delta)
    },
    [goTo, activeIndex]
  )

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault()

      if (wheelCooldownRef.current) {
        return
      }

      const absDelta = Math.abs(event.deltaY)
      if (absDelta < 20) {
        return
      }

      moveBy(event.deltaY > 0 ? 1 : -1)

      wheelCooldownRef.current = true
      setTimeout(() => {
        wheelCooldownRef.current = false
      }, 500)
    },
    [moveBy]
  )

  const handleTouchStart = useCallback((event: TouchEvent) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null
  }, [])

  const handleTouchMove = useCallback((event: TouchEvent) => {
    event.preventDefault()
  }, [])

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (touchStartYRef.current === null) {
        return
      }

      const endY = event.changedTouches[0]?.clientY

      if (typeof endY !== 'number') {
        touchStartYRef.current = null
        return
      }

      const deltaY = touchStartYRef.current - endY
      const swipeThreshold = 26

      if (Math.abs(deltaY) >= swipeThreshold) {
        moveBy(deltaY > 0 ? 1 : -1)
      }

      touchStartYRef.current = null
    },
    [moveBy]
  )

  // React's onWheel/onTouchMove handlers are attached as passive listeners,
  // so preventDefault() inside them is silently ignored and the gesture still
  // falls through. Attach native, non-passive listeners scoped to just the
  // carousel zone, so scrolling over the navbar, sidebar links, footer or
  // pager leaves those static and only the card stack reacts.
  useEffect(() => {
    const node = carouselZoneRef.current
    if (!node) {
      return
    }

    node.addEventListener('wheel', handleWheel, { passive: false })
    node.addEventListener('touchstart', handleTouchStart, { passive: true })
    node.addEventListener('touchmove', handleTouchMove, { passive: false })
    node.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      node.removeEventListener('wheel', handleWheel)
      node.removeEventListener('touchstart', handleTouchStart)
      node.removeEventListener('touchmove', handleTouchMove)
      node.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd])

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2
      const y = (event.clientY / window.innerHeight - 0.5) * 2
      setMouse({ x, y })
    },
    []
  )

  const handleChatSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!chatValue.trim()) {
        return
      }
      setChatReply('coming soon — an AI assistant trained on my projects.')
      setChatValue('')
    },
    [chatValue]
  )

  const tiltX = mouse.y * -4
  const tiltY = mouse.x * 4

  const length = CARDS.length
  const spiralCards = CARDS.map((card, index) => {
    let delta = index - activeIndex
    if (delta > length / 2) delta -= length
    if (delta < -length / 2) delta += length
    return { delta, index, card }
  }).filter(({ delta }) => Math.abs(delta) <= VISIBLE_SPIRAL_RANGE)

  const coordsTime = clock.toTimeString().slice(0, 8)

  return (
    <PageWrapper ref={pageWrapperRef} onMouseMove={handleMouseMove}>
      <HudCorner $corner="tl" />
      <HudCorner $corner="tr" />
      <HudCorner $corner="bl" />
      <HudCorner $corner="br" />

      <CardNav>
        <NavArrow onClick={prev} aria-label="Previous project">
          {'<<'}
        </NavArrow>
        <NavCounter>
          {`${formatIndex(activeIndex)} / ${formatIndex(CARDS.length - 1)}`}
          <PagerTitle>{` · ${activeCard.name}`}</PagerTitle>
        </NavCounter>
        <NavArrow onClick={next} aria-label="Next project">
          {'>>'}
        </NavArrow>
      </CardNav>

      <MainRow>
        <HeadlineWrap>
          <HeroLabel>// about</HeroLabel>
          <HeroText>
            Full-stack engineer crafting interactive, three-dimensional
            interfaces for the web
            <HeroCursor />
          </HeroText>
          <HeroPillsRow>
            <HeroPill>React</HeroPill>
            <HeroPill>Three.js</HeroPill>
            <HeroPill>Firebase</HeroPill>
          </HeroPillsRow>
        </HeadlineWrap>

        <CarouselZone ref={carouselZoneRef}>
          <StackWrap $tiltX={tiltX} $tiltY={tiltY}>
            <CardStage>
              {spiralCards.map(({ delta, index, card }) => (
                <ProjectCard
                  key={card.id}
                  $delta={delta}
                  $accent={card.accent}
                  onClick={delta === 0 ? undefined : () => goTo(index)}
                >
                  <CardGlow $accent={card.accent} />
                  <CardInner>
                    <CardBadge $accent={card.accent}>
                      {formatIndex(index)}
                    </CardBadge>
                    <CardBody>
                      <CardTitle>{card.name}</CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                      <CardMeta>
                        {card.tags.map((tag) => (
                          <CardTag key={tag} $accent={card.accent}>
                            {tag}
                          </CardTag>
                        ))}
                      </CardMeta>
                      <CardViewLink>
                        view project{' '}
                        <AccentArrow $color={card.accent}>→</AccentArrow>
                      </CardViewLink>
                    </CardBody>
                  </CardInner>
                </ProjectCard>
              ))}
            </CardStage>
          </StackWrap>

          <ScrollHintWrap>
            <ScrollHintText>scroll or click to explore</ScrollHintText>
            <ScrollArrow>▼</ScrollArrow>
            <ScrollTicksRow>
              {CARDS.map((card, index) => (
                <ScrollTick
                  key={card.id}
                  $active={index === activeIndex}
                  $color={card.accent}
                />
              ))}
            </ScrollTicksRow>
          </ScrollHintWrap>
        </CarouselZone>
      </MainRow>

      <BottomRow>
        <LeftCol>
          <SidebarLabel
            type="button"
            aria-expanded={isFiltersOpen}
            aria-controls="sidebar-filters"
            onClick={() => setIsFiltersOpen((open) => !open)}
          >
            What are you looking for?
            <SidebarChevron $open={isFiltersOpen}>▾</SidebarChevron>
          </SidebarLabel>
          <SidebarFilters id="sidebar-filters" $open={isFiltersOpen}>
            {CARDS.map((card, index) => (
              <SidebarFilter key={card.id}>
                <SidebarLink
                  href={`#${card.id}`}
                  $active={index === activeIndex}
                  onClick={(event) => {
                    event.preventDefault()
                    goTo(index)
                  }}
                >
                  <SidebarLinkIndex
                    $active={index === activeIndex}
                    $color={card.accent}
                  >
                    {formatIndex(index)}
                  </SidebarLinkIndex>
                  <SidebarLinkArrow>→</SidebarLinkArrow>
                  <SidebarLinkTitle
                    $active={index === activeIndex}
                    $color={card.accent}
                  >
                    {card.name}
                  </SidebarLinkTitle>
                </SidebarLink>
              </SidebarFilter>
            ))}
          </SidebarFilters>
          <ChatForm onSubmit={handleChatSubmit}>
            <ChatPrompt>&gt;</ChatPrompt>
            <ChatInput
              placeholder="ask me anything..."
              value={chatValue}
              onChange={(event) => setChatValue(event.target.value)}
            />
          </ChatForm>
          {chatReply && <ChatReply>{`→ ${chatReply}`}</ChatReply>}
        </LeftCol>

        <RightCol>
          <Coordinates>
            <div>42.6977° N, 23.3219° E</div>
            <div>{`Sofia, BG · ${coordsTime}`}</div>
          </Coordinates>
          <CopyrightText>
            Georgi Georgiev — all rights reserved 2026
          </CopyrightText>
        </RightCol>
      </BottomRow>
    </PageWrapper>
  )
}

export default HomePage
