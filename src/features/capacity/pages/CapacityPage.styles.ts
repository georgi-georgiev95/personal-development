import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Planner = styled.div`
  width: min(100%, 1480px);
  margin: 0 auto;
  padding: clamp(24px, 4vw, 56px);
  color: ${theme.colors.text};

  input {
    min-width: 0;
    min-height: 40px;
    padding: 6px 8px;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    background: ${theme.colors.background};
    color: inherit;
    font: inherit;
  }

  button:focus-visible,
  input:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;

  h1 {
    margin: 0;
    color: ${theme.colors.heroText};
    font-size: clamp(2rem, 4vw, 3.25rem);
    letter-spacing: ${theme.letterSpacing.tight};
    line-height: 1.08;
  }

  p {
    margin: 8px 0 0;
    color: ${theme.colors.textSecondary};
  }

  .sample-note {
    font-size: 0.8125rem;
  }
`

export const Editor = styled.form`
  display: grid;
  grid-template-columns: minmax(12rem, 2fr) repeat(3, minmax(8rem, 1fr));
  gap: 12px;
  padding: 16px;
  margin-bottom: 20px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};

  label {
    display: grid;
    gap: 4px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    grid-column: 1 / -1;
  }

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 400px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const Board = styled.section`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1149px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 740px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 540px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const Column = styled.section`
  min-width: 0;
  min-height: 210px;
  padding: 12px;
  background: color-mix(
    in srgb,
    ${theme.colors.surface} 65%,
    ${theme.colors.background}
  );
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};

  &[data-drop-target='true'] {
    border-color: ${theme.colors.primary};
  }

  header {
    display: grid;
    gap: 8px;
  }

  h2 {
    margin: 0;
    font-size: 1rem;
  }

  p {
    margin: 0;
    font-size: 0.8125rem;
    color: ${theme.colors.textSecondary};
  }

  .hours,
  .load {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 4px;
  }

  .hours {
    font-size: 0.75rem;

    input {
      width: 4rem;
      min-height: 32px;
    }
  }

  --load-color: ${theme.colors.success};

  &[data-over='true'] {
    --load-color: ${theme.colors.error};
  }

  meter {
    --meter-track: color-mix(
      in srgb,
      ${theme.colors.text} 22%,
      ${theme.colors.background}
    );
    appearance: none;
    width: 100%;
    height: 12px;
    padding: 2px;
    overflow: hidden;
    border: 0;
    border-radius: 6px;
    background: var(--meter-track);

    &::-webkit-meter-bar {
      background: transparent;
      border: 0;
    }

    &::-webkit-meter-optimum-value {
      background: var(--load-color);
      border-radius: 4px;
    }

    &::-moz-meter-bar {
      background: var(--load-color);
      border-radius: 4px;
    }
  }

  .load strong {
    color: var(--load-color);
  }

  ul {
    display: grid;
    gap: 8px;
    list-style: none;
    margin: 12px 0 0;
    padding: 0;
  }

  .empty {
    padding: 12px;
    border: 1px dashed ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
  }
`

export const Card = styled.li`
  display: grid;
  /* Keep the column background out of the native drag preview’s rounded corners. */
  isolation: isolate;
  gap: 8px;
  min-width: 0;
  padding: 12px;
  background: ${theme.colors.surface};
  box-shadow: ${theme.boxShadow.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};

  .card-top,
  .details,
  .card-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .card-top {
    align-items: start;
    cursor: grab;
    user-select: none;

    &:active {
      cursor: grabbing;
    }
  }

  h3 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 650;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .grip {
    color: ${theme.colors.textSecondary};
    flex-shrink: 0;
  }

  .details {
    flex-wrap: wrap;
    font-size: 0.75rem;
    color: ${theme.colors.textSecondary};

    span {
      padding: 2px 6px;
      border-radius: ${theme.borderRadius.sm};
      background: ${theme.colors.background};
    }

    [data-required='true'] {
      color: ${theme.colors.primary};
      font-weight: 650;
    }
  }

  .deadline[data-late='true'] {
    color: ${theme.colors.error};
    font-weight: 650;
  }

  .move {
    display: grid;
    gap: 4px;
    color: ${theme.colors.textSecondary};
    font-size: 0.75rem;
    font-weight: 600;
  }

  .card-actions {
    flex-wrap: wrap;
  }
`

export const DropPlaceholder = styled.li`
  display: grid;
  align-content: start;
  gap: 8px;
  min-height: 128px;
  padding: 12px;
  border: 1px dashed ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  background: color-mix(
    in srgb,
    ${theme.colors.primary} 8%,
    ${theme.colors.surface}
  );
  pointer-events: none;

  span {
    height: 8px;
    width: 70%;
    border-radius: ${theme.borderRadius.sm};
    background: ${theme.colors.border};
  }

  span + span {
    width: 36%;
  }
`

export const ScreenReaderText = styled.p`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`
