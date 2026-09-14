import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { portfolioProjects } from '@/features/portfolio/data/projects'
import { theme } from '@/shared/styles/theme'
import {
  PageWrapper,
  HudCorner,
  MainRow,
  HeadlineWrap,
  HeroLabel,
  HeroText,
  HeroSummary,
  HeroCursor,
  HeroPillsRow,
  HeroPill,
  HeroLinks,
  HeroLink,
  ProfileLinks,
  ProfileLink,
  ProfilePlaceholder,
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
  SearchHint,
  SearchResults,
  SearchResult,
  SearchResultArrow,
  SearchResultTitle,
  SearchEmpty,
  ChatForm,
  ChatPrompt,
  ChatInput,
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

const PROJECTS: ProjectCardData[] = portfolioProjects.map((project) => ({
  id: project.id,
  name: project.title,
  badge: project.status === 'complete' ? 'Featured project' : 'On the roadmap',
  description: project.summary,
  tags: project.technologies
    .slice(0, 3)
    .map((technology) => technology.toUpperCase()),
  accent: theme.colors[project.accent],
  route: project.route,
  cta: project.status === 'complete' ? 'view project' : 'view roadmap',
}))

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
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [activeResult, setActiveResult] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const searchResults = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    if (!query) return []

    return portfolioProjects
      .map((project) => ({
        project,
        searchableText: [
          project.title,
          project.summary,
          project.description,
          project.category,
          ...project.technologies,
          ...project.skills,
          ...project.highlights,
        ]
          .join(' ')
          .toLowerCase(),
      }))
      .filter(({ searchableText }) => searchableText.includes(query))
      .slice(0, 5)
      .map(({ project }) => project)
  }, [searchValue])

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const project = searchResults[activeResult]
    if (project) navigate(project.demoRoute ?? project.route)
  }

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!searchResults.length) return

    if (event.key === 'Enter') {
      event.preventDefault()
      const project = searchResults[activeResult]
      if (project) navigate(project.demoRoute ?? project.route)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveResult((current) => (current + 1) % searchResults.length)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveResult(
        (current) => (current - 1 + searchResults.length) % searchResults.length
      )
    }
  }

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
            Front-end engineer in Varna building reliable interfaces for complex
            products
            <HeroCursor />
          </HeroText>
          <HeroSummary>
            React, TypeScript, fintech experience, and AI-assisted engineering
            in one evolving portfolio.
          </HeroSummary>
          <HeroPillsRow>
            <HeroPill>React</HeroPill>
            <HeroPill>TypeScript</HeroPill>
            <HeroPill>Fintech</HeroPill>
          </HeroPillsRow>
          <HeroLinks>
            <HeroLink to="/projects">Explore projects →</HeroLink>
            <HeroLink to="/engineering">Engineering details →</HeroLink>
          </HeroLinks>
          <ProfileLinks aria-label="Profile links">
            <ProfileLink
              href="https://github.com/georgi-georgiev95/personal-development"
              target="_blank"
              rel="noreferrer"
            >
              GitHub →
            </ProfileLink>
            <ProfilePlaceholder>CV available on request</ProfilePlaceholder>
            <ProfilePlaceholder>
              LinkedIn profile coming soon
            </ProfilePlaceholder>
            <ProfilePlaceholder>Contact details coming soon</ProfilePlaceholder>
          </ProfileLinks>
        </HeadlineWrap>

        <FeatureCardZone>
          {PROJECTS.slice(0, 3).map((project) => (
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
          {!searchValue && (
            <SearchHint>
              try to find what you are looking for by keyword
            </SearchHint>
          )}
          {searchValue && (
            <SearchResults id="project-search-results" role="listbox">
              {searchResults.length ? (
                searchResults.map((project, index) => (
                  <SearchResult
                    key={project.id}
                    id={`project-result-${project.id}`}
                    to={project.demoRoute ?? project.route}
                    $active={index === activeResult}
                    onMouseEnter={() => setActiveResult(index)}
                    role="option"
                    aria-selected={index === activeResult}
                  >
                    <SearchResultArrow>→</SearchResultArrow>
                    <SearchResultTitle>{project.title}</SearchResultTitle>
                  </SearchResult>
                ))
              ) : (
                <SearchEmpty>nothing matches that keyword</SearchEmpty>
              )}
            </SearchResults>
          )}
          <ChatForm onSubmit={handleSearchSubmit}>
            <ChatPrompt>&gt;</ChatPrompt>
            <ChatInput
              ref={searchInputRef}
              aria-label="Search projects"
              aria-controls="project-search-results"
              aria-activedescendant={
                searchResults[activeResult]
                  ? `project-result-${searchResults[activeResult].id}`
                  : undefined
              }
              placeholder="search projects..."
              role="combobox"
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value)
                setActiveResult(0)
              }}
              onKeyDown={handleSearchKeyDown}
            />
          </ChatForm>
        </LeftCol>

        <RightCol>
          <Coordinates>
            <div>42.6977° N, 23.3219° E</div>
            <div>
              Varna, BG · <LiveClock />
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
