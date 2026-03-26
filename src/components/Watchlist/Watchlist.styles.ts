import { styled } from '@linaria/react'
import { theme } from '@/theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
  }
`

export const WidgetTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.primary};
  font-weight: 600;
`

export const InputRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`

export const SymbolInput = styled.input`
  flex: 1;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.text};
  background: ${theme.colors.background};
  text-transform: uppercase;
  box-sizing: border-box;

  &::placeholder {
    text-transform: none;
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}33;
  }
`

export const AddButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${theme.borderRadius};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  overflow-y: auto;
`

export const ItemRow = styled.li`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
`

export const ItemSymbol = styled.span`
  font-size: ${theme.fontSizes.md};
  font-weight: 700;
  color: ${theme.colors.text};
  min-width: 64px;
`

export const ItemPrice = styled.span`
  flex: 1;
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.text};
  text-align: right;
`

export const ItemChange = styled.span`
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  min-width: 64px;
  text-align: right;
`

export const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  font-size: ${theme.fontSizes.md};
  line-height: 1;
  padding: 0 ${theme.spacing.xs};
  transition: color 0.15s;

  &:hover {
    color: ${theme.colors.error};
  }
`

export const ErrorMessage = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.error};
`

export const EmptyMessage = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  text-align: center;
  padding: ${theme.spacing.md} 0;
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const RefreshButton = styled.button`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: transparent;
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${theme.colors.primary}11;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const SearchWrapper = styled.div`
  position: relative;
`

export const SuggestionsDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  margin: ${theme.spacing.xs} 0 0;
  padding: 0;
  list-style: none;
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  max-height: 220px;
  overflow-y: auto;
`

export const SuggestionItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: ${theme.colors.primary}11;
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.border};
  }
`

export const SuggestionSymbol = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  color: ${theme.colors.text};
  min-width: 60px;
`

export const SuggestionName = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
