import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const TextRoot = styled.p`
  margin: 0;
  font-family: ${theme.font.family};
  line-height: ${theme.lineHeight.relaxed};

  &[data-size='xs'] {
    font-size: ${theme.fontSizes.xs};
  }

  &[data-size='sm'] {
    font-size: ${theme.fontSizes.sm};
  }

  &[data-size='md'] {
    font-size: ${theme.fontSizes.md};
  }

  &[data-size='lg'] {
    font-size: ${theme.fontSizes.lg};
  }

  &[data-size='xl'] {
    font-size: ${theme.fontSizes.xl};
  }

  &[data-tone='default'] {
    color: ${theme.colors.text};
  }

  &[data-tone='muted'] {
    color: ${theme.colors.textSecondary};
  }

  &[data-tone='inverse'] {
    color: ${theme.colors.textInverse};
  }

  &[data-tone='accent'] {
    color: ${theme.colors.accent};
  }

  &[data-tone='success'] {
    color: ${theme.colors.success};
  }

  &[data-tone='error'] {
    color: ${theme.colors.error};
  }

  &[data-weight='regular'] {
    font-weight: 400;
  }

  &[data-weight='medium'] {
    font-weight: 500;
  }

  &[data-weight='semibold'] {
    font-weight: 600;
  }

  &[data-weight='bold'] {
    font-weight: 700;
  }

  &[data-align='left'] {
    text-align: left;
  }

  &[data-align='center'] {
    text-align: center;
  }

  &[data-align='right'] {
    text-align: right;
  }

  &[data-truncate='true'] {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`
