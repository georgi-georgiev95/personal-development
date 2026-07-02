import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`
