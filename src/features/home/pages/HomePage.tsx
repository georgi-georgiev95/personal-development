import React, { useCallback, useEffect, useState } from 'react'
import { theme } from '@/shared/styles/theme'
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
  FeatureCardZone,
  FeatureCard,
  CardGlow,
  CardInner,
  CardBadge,
  CardBody,
  CardTitle,
  CardDescription,
  CardMeta,
  CardTag,
  CardViewRouterLink,
  AccentArrow,
  BottomRow,
  LeftCol,
  RightCol,
  SidebarLabel,
  SidebarLink,
  SidebarLinkArrow,
  SidebarLinkTitle,
  ChatForm,
  ChatPrompt,
  ChatInput,
  ChatReply,
  Coordinates,
  CopyrightText,
} from './HomePage.styles'

interface ProjectCardData {
  id: string
  name: string
  badge: string
  description: string
  tags: string[]
  accent: string
  route: string
  cta: string
}

const PROJECTS: ProjectCardData[] = [
  {
    id: 'photobook',
    name: 'Photobook',
    badge: 'Featured project',
    description:
      'Shared community photo feed — upload, comment, and react in real time.',
    tags: ['FIRESTORE', 'STORAGE', 'REALTIME'],
    accent: theme.colors.success,
    route: '/photobook',
    cta: 'view project',
  },
]

// Isolated so the once-per-second tick re-renders only this tiny component
// instead of the whole page.
const LiveClock: React.FC = () => {
  const [clock, setClock] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return <>{clock.toTimeString().slice(0, 8)}</>
}

export const HomePage: React.FC = () => {
  const [chatValue, setChatValue] = useState('')
  const [chatReply, setChatReply] = useState<string | null>(null)

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

  return (
    <PageWrapper>
      <HudCorner $corner="tl" />
      <HudCorner $corner="tr" />
      <HudCorner $corner="bl" />
      <HudCorner $corner="br" />

      <MainRow>
        <HeadlineWrap>
          <HeroLabel>// about</HeroLabel>
          <HeroText>
            Front-end engineer crafting interactive, three-dimensional
            interfaces for the web
            <HeroCursor />
          </HeroText>
          <HeroPillsRow>
            <HeroPill>React</HeroPill>
            <HeroPill>Three.js</HeroPill>
            <HeroPill>Firebase</HeroPill>
          </HeroPillsRow>
        </HeadlineWrap>

        <FeatureCardZone>
          {PROJECTS.map((project) => (
            <FeatureCard key={project.id} $accent={project.accent}>
              <CardGlow $accent={project.accent} />
              <CardInner>
                <CardBadge $accent={project.accent}>{project.badge}</CardBadge>
                <CardBody>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                  <CardMeta>
                    {project.tags.map((tag) => (
                      <CardTag key={tag} $accent={project.accent}>
                        {tag}
                      </CardTag>
                    ))}
                  </CardMeta>
                  <CardViewRouterLink to={project.route}>
                    {project.cta}{' '}
                    <AccentArrow $color={project.accent}>→</AccentArrow>
                  </CardViewRouterLink>
                </CardBody>
              </CardInner>
            </FeatureCard>
          ))}
        </FeatureCardZone>
      </MainRow>

      <BottomRow>
        <LeftCol>
          <SidebarLabel>What are you looking for?</SidebarLabel>
          {PROJECTS.map((project) => (
            <SidebarLink key={project.id} to={project.route}>
              <SidebarLinkArrow>→</SidebarLinkArrow>
              <SidebarLinkTitle>{project.name}</SidebarLinkTitle>
            </SidebarLink>
          ))}
          <ChatForm onSubmit={handleChatSubmit}>
            <ChatPrompt>&gt;</ChatPrompt>
            <ChatInput
              aria-label="Ask me anything"
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
            <div>
              Sofia, BG · <LiveClock />
            </div>
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
