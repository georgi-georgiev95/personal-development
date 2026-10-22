import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Page = styled.section`
  width: min(100%, 1600px);
  margin: 0 auto;
  padding: clamp(24px, 5vw, 64px) clamp(16px, 5vw, 48px) 96px;
  color: ${theme.colors.text};

  @media (min-width: 801px) {
    --sudoku-board-size: min(
      clamp(320px, calc(100svh - 280px), 560px),
      calc((100vw - 104px) * 0.58)
    );
    width: min(100%, calc(var(--sudoku-board-size) * 1.65 + 88px));
    padding: 16px 32px 32px;
  }

  @media (max-width: 800px) {
    padding: 10px 12px calc(84px + env(safe-area-inset-bottom));
  }
`

export const Header = styled.header`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;

  h1 {
    margin: 4px 0 8px;
    font-size: clamp(28px, 5vw, 42px);
    letter-spacing: ${theme.letterSpacing.tight};
  }

  p {
    max-width: 560px;
    margin: 0;
    color: ${theme.colors.textSecondary};
    line-height: ${theme.lineHeight.relaxed};
  }

  > button {
    display: none;
  }

  @media (min-width: 801px) {
    margin-bottom: 8px;

    h1 {
      margin: 0;
      font-size: 24px;
      line-height: 1.2;
    }

    p,
    span {
      display: none;
    }
  }

  @media (max-width: 620px) {
    align-items: start;
    flex-direction: column;
  }

  @media (max-width: 800px) {
    display: none;
  }
`

export const DifficultyBar = styled.nav`
  display: flex;
  align-items: center;
  gap: clamp(14px, 2vw, 32px);
  margin-bottom: 20px;
  color: ${theme.colors.textSecondary};
  font-size: clamp(15px, 1.8vw, 22px);
  font-weight: 650;

  @media (min-width: 801px) {
    gap: 20px;
    margin-bottom: 8px;
    font-size: 16px;
  }

  @media (max-width: 800px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px 18px;
    margin-bottom: 10px;
  }
`

export const DifficultyButton = styled.button`
  min-height: 40px;
  padding: 0;
  border: 0;
  color: ${theme.colors.textSecondary};
  background: transparent;
  font: inherit;
  cursor: pointer;

  &[aria-pressed='true'] {
    color: ${theme.colors.primary};
  }
  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 4px;
  }
`

export const ModeBar = styled.nav`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  font-weight: 650;

  @media (max-width: 800px) {
    justify-content: center;
  }
`

export const ModeButton = styled(DifficultyButton)`
  min-height: 34px;
  padding: 0 10px;
  border-radius: ${theme.borderRadius.md};

  &[aria-pressed='true'] {
    color: ${theme.colors.primary};
    background: ${theme.colors.cardBg};
  }
`

export const Eyebrow = styled.span`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
`

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 1fr);
  align-items: start;
  gap: clamp(20px, 4vw, 40px);

  @media (min-width: 801px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.65fr);
    gap: 24px;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`

export const BoardColumn = styled.div`
  min-width: 0;
`

export const Board = styled.div`
  position: relative;
  container-type: inline-size;
  display: grid;
  width: 100%;
  aspect-ratio: 1;
  grid-template-rows: repeat(9, minmax(0, 1fr));
  overflow: hidden;
  border: 2px solid var(--sudoku-grid, ${theme.colors.text});
  border-radius: 5px;
  background: ${theme.colors.surface};
  touch-action: manipulation;

  :root:not([data-theme='light']) &[data-mode='killer'] {
    --sudoku-grid: #94a3b8;
    --sudoku-fine-grid: #343b43;
    --sudoku-cage: #b8ceca;
    --sudoku-cage-opacity: 1;
    --sudoku-sum-size: clamp(10px, 2.2cqi, 16px);
    --sudoku-selected: #134e4a;
    --sudoku-match: #203b38;
    --sudoku-related: #202725;
    --sudoku-highlight-text: #f0fdfa;
  }

  &::after {
    position: absolute;
    z-index: 1;
    inset: 0;
    background:
      linear-gradient(
        to right,
        transparent calc(33.333% - 1px),
        var(--sudoku-grid, ${theme.colors.text}) calc(33.333% - 1px),
        var(--sudoku-grid, ${theme.colors.text}) calc(33.333% + 1px),
        transparent calc(33.333% + 1px)
      ),
      linear-gradient(
        to right,
        transparent calc(66.667% - 1px),
        var(--sudoku-grid, ${theme.colors.text}) calc(66.667% - 1px),
        var(--sudoku-grid, ${theme.colors.text}) calc(66.667% + 1px),
        transparent calc(66.667% + 1px)
      ),
      linear-gradient(
        to bottom,
        transparent calc(33.333% - 1px),
        var(--sudoku-grid, ${theme.colors.text}) calc(33.333% - 1px),
        var(--sudoku-grid, ${theme.colors.text}) calc(33.333% + 1px),
        transparent calc(33.333% + 1px)
      ),
      linear-gradient(
        to bottom,
        transparent calc(66.667% - 1px),
        var(--sudoku-grid, ${theme.colors.text}) calc(66.667% - 1px),
        var(--sudoku-grid, ${theme.colors.text}) calc(66.667% + 1px),
        transparent calc(66.667% + 1px)
      );
    content: '';
    pointer-events: none;
  }

  @media (max-width: 360px) {
    border-width: 1px;
  }
  @media (min-width: 801px) {
    border-width: 3px;
  }
`

export const CageOverlay = styled.svg`
  position: absolute;
  z-index: 3;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;

  path {
    fill: none;
    stroke: var(--sudoku-cage, ${theme.colors.text});
    stroke-width: 1.75;
    opacity: var(--sudoku-cage-opacity, 0.82);
    stroke-dasharray: 7 5;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }
  path.cage-halo {
    stroke: ${theme.colors.surface};
    stroke-width: 3.75;
    opacity: 1;
  }
`

export const BoardRow = styled.div<{ $killer: boolean }>`
  display: grid;
  min-height: 0;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  border-bottom: ${({ $killer }) =>
    $killer ? '0' : `1px solid ${theme.colors.border}`};

  &:last-child {
    border-bottom: 0;
  }
`

export const Cell = styled.button<{
  $selected: boolean
  $related: boolean
  $match: boolean
  $given: boolean
  $mistake: boolean
  $killer: boolean
}>`
  position: relative;
  display: grid;
  min-width: 0;
  min-height: 0;
  place-items: center;
  padding: 0;
  border: 0;
  border-top: 0;
  border-right: 1px solid var(--sudoku-fine-grid, ${theme.colors.border});
  border-bottom: ${({ $killer }) =>
    $killer
      ? `1px solid var(--sudoku-fine-grid, ${theme.colors.border})`
      : '0'};
  border-left: 0;
  color: ${({ $given, $selected, $match, $mistake }) =>
    $mistake
      ? theme.colors.textOnAccent
      : $selected || $match
        ? `var(--sudoku-highlight-text, ${theme.colors.textOnAccent})`
        : $given
          ? theme.colors.heroText
          : theme.colors.primary};
  background: ${({ $selected, $match, $related, $mistake }) =>
    $mistake
      ? theme.colors.error
      : $selected
        ? `var(--sudoku-selected, ${theme.colors.accent})`
        : $match
          ? `var(--sudoku-match, ${theme.colors.accentHover})`
          : $related
            ? `var(--sudoku-related, ${theme.colors.cardBg})`
            : theme.colors.surface};
  font: 400 clamp(18px, 6cqi, 90px) ${theme.font.family};
  cursor: pointer;
  outline: ${({ $selected }) =>
    $selected ? `2px solid ${theme.colors.primary}` : 'none'};
  outline-offset: -2px;

  &::after {
    position: absolute;
    top: 1px;
    right: 2px;
    color: ${({ $mistake }) =>
      $mistake ? theme.colors.textOnAccent : theme.colors.error};
    content: ${({ $mistake }) => ($mistake ? "'!'" : "''")};
    font-size: clamp(7px, 1.7vw, 11px);
    line-height: 1;
  }

  &:nth-child(9n) {
    border-right: 0;
  }
  &:focus-visible {
    outline: 3px solid ${theme.colors.primary};
  }
`

export const CageLabel = styled.span`
  position: absolute;
  top: 3px;
  left: 4px;
  z-index: 4;
  padding: 1px 2px;
  border-radius: 2px;
  color: var(--sudoku-cage, ${theme.colors.text});
  background: ${theme.colors.surface};
  font-size: var(--sudoku-sum-size, clamp(9px, 1.8cqi, 16px));
  font-weight: 650;
  line-height: 1;
  pointer-events: none;
`

export const Notes = styled.span<{ $selected: boolean; $killer: boolean }>`
  position: absolute;
  inset: ${({ $killer }) => ($killer ? '22% 5% 3%' : '3%')};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  align-items: center;
  justify-items: center;
  color: ${({ $selected }) =>
    $selected
      ? `var(--sudoku-highlight-text, ${theme.colors.textOnAccent})`
      : theme.colors.textSecondary};
  font-size: clamp(8px, 1.6cqi, 18px);
  font-weight: 400;
  line-height: 1;

  span:empty {
    visibility: hidden;
  }
`

export const Controls = styled.aside`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  padding: 0;

  label {
    display: grid;
    gap: 8px;
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSizes.sm};
  }

  select {
    width: 100%;
    min-height: 44px;
    padding: 0 12px;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    color: ${theme.colors.text};
    background: ${theme.colors.surface};
    font: inherit;
  }

  > button {
    grid-column: auto;
  }

  > div[aria-label='Puzzle tools'],
  > div[aria-label='Number pad'] {
    grid-column: 1 / -1;
  }

  > p {
    grid-column: 1 / -1;
  }

  @media (min-width: 801px) {
    height: var(--sudoku-board-size);
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(0, 1fr) auto auto;
    gap: 12px;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  @media (max-width: 480px) {
    gap: 10px;
  }
`

export const ControlToolbar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  justify-items: center;
  gap: 12px;
`

export const NewPuzzle = styled.div`
  grid-column: 1 / -1;

  button {
    width: 100%;
    min-height: clamp(58px, 7vw, 92px);
    font-size: clamp(18px, 2.2vw, 28px);
  }

  @media (min-width: 801px) {
    button {
      min-height: clamp(44px, calc(var(--sudoku-board-size) * 0.09), 52px);
      font-size: 16px;
    }
  }
`

export const NumberPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(8px, 1vw, 14px);

  button {
    min-height: clamp(58px, 10vw, 140px);
    border: 0;
    border-radius: ${theme.borderRadius.md};
    color: ${theme.colors.primary};
    background: ${theme.colors.cardBg};
    font: 400 clamp(24px, 4vw, 60px) ${theme.font.family};
    font-variant-numeric: tabular-nums;
    line-height: 1;
    cursor: pointer;
  }

  button:hover:not(:disabled),
  button[aria-pressed='true']:not(:disabled) {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.textOnAccent};
    background: ${theme.colors.accent};
  }
  button:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
  button:disabled {
    opacity: 0.4;
    cursor: default;
  }

  @media (min-width: 801px) {
    min-height: 0;
    grid-template-rows: repeat(3, minmax(0, 1fr));

    button {
      min-height: 0;
      padding: 0;
      font-size: clamp(24px, calc(var(--sudoku-board-size) * 0.06), 36px);
    }
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(9, minmax(0, 1fr));
    gap: 2px;

    button {
      min-width: 0;
      min-height: 0;
      aspect-ratio: 1;
      padding: 0;
      border-radius: 50%;
      color: ${theme.colors.primary};
      background: transparent;
      font-size: clamp(20px, 7vw, 34px);
    }
  }
`

export const ControlButton = styled.button`
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  font: 600 ${theme.fontSizes.sm} ${theme.font.family};
  text-align: left;
  cursor: pointer;

  &:hover,
  &[aria-pressed='true'] {
    border-color: ${theme.colors.primary};
    background: ${theme.colors.cardBg};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  ${ControlToolbar} & {
    display: grid;
    width: clamp(58px, 8vw, 112px);
    aspect-ratio: 1;
    min-height: 0;
    place-items: center;
    padding: 14px;
    border: 0;
    border-radius: 50%;
    color: ${theme.colors.primary};
    background: ${theme.colors.cardBg};
    text-align: center;

    @media (min-width: 801px) {
      width: clamp(44px, calc(var(--sudoku-board-size) * 0.12), 72px);
      padding: 10px;
    }

    svg {
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.7;
    }

    &:hover:not(:disabled),
    &[aria-pressed='true']:not(:disabled) {
      color: ${theme.colors.textOnAccent};
      background: ${theme.colors.accent};
    }
  }
`

export const Status = styled.p`
  min-height: 1.5em;
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeight.relaxed};
`

export const Completion = styled.div`
  padding: 14px;
  border: 1px solid ${theme.colors.success};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.success};
  font-weight: 600;
`

export const MistakeCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  color: ${theme.colors.textSecondary};

  strong {
    color: ${theme.colors.text};
  }

  @media (max-width: 800px) {
    flex-basis: 100%;
    justify-content: center;
    margin-left: 0;
  }
`
