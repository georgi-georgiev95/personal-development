import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const GameStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
  margin: 12px 0 18px;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  strong {
    margin-left: 8px;
    color: ${theme.colors.text};
    font-variant-numeric: tabular-nums;
  }
  @media (max-width: 800px) {
    justify-content: center;
    margin: 8px 0 12px;
  }
`

export const Ranking = styled.section`
  margin-top: 28px;
  padding: clamp(14px, 3vw, 24px);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};
  h2 {
    margin: 0;
    font-size: ${theme.fontSizes.lg};
  }
  p {
    color: ${theme.colors.textSecondary};
    line-height: 1.5;
  }
  header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  select,
  button {
    font: inherit;
  }
  select {
    padding: 10px;
    border-radius: 8px;
    color: ${theme.colors.text};
    background: ${theme.colors.cardBg};
    border: 1px solid ${theme.colors.border};
  }
  ol {
    list-style: none;
    margin: 12px 0;
    padding: 0;
  }
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid ${theme.colors.border};
  }
  li div {
    min-width: 0;
    overflow-wrap: anywhere;
  }
  li small {
    display: block;
    margin-top: 6px;
    color: ${theme.colors.textSecondary};
  }
  li strong {
    white-space: nowrap;
    color: ${theme.colors.primary};
    font-variant-numeric: tabular-nums;
  }
`

export const ScoreForm = styled.form`
  display: grid;
  gap: 16px;
  label {
    display: grid;
    gap: 8px;
    font-weight: 600;
  }
  input {
    width: 100%;
    box-sizing: border-box;
    min-height: 44px;
    padding: 10px 12px;
    font: inherit;
    color: ${theme.colors.text};
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: 8px;
  }
  input:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
  p {
    margin: 0;
    line-height: 1.5;
  }
  small {
    color: ${theme.colors.textSecondary};
    line-height: 1.5;
  }
  footer {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
`
