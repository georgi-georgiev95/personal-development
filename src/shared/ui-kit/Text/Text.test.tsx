import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Text } from './Text'

describe('Text', () => {
  it('renders as a paragraph by default', () => {
    render(<Text>Body copy</Text>)

    expect(screen.getByText('Body copy').tagName).toBe('P')
  })

  it('renders with a custom tag via as prop', () => {
    render(<Text as="span">Inline text</Text>)

    expect(screen.getByText('Inline text').tagName).toBe('SPAN')
  })

  it('applies variant data attributes', () => {
    render(
      <Text size="lg" tone="accent" weight="bold" align="center">
        Styled text
      </Text>
    )

    const element = screen.getByText('Styled text')

    expect(element).toHaveAttribute('data-size', 'lg')
    expect(element).toHaveAttribute('data-tone', 'accent')
    expect(element).toHaveAttribute('data-weight', 'bold')
    expect(element).toHaveAttribute('data-align', 'center')
  })

  it('enables truncation when requested', () => {
    render(<Text truncate>Truncated text</Text>)

    expect(screen.getByText('Truncated text')).toHaveAttribute(
      'data-truncate',
      'true'
    )
  })

  it('forwards native HTML attributes', () => {
    render(
      <Text id="text-node" className="custom-text" aria-label="Profile name">
        Georgi
      </Text>
    )

    const element = screen.getByLabelText('Profile name')

    expect(element).toHaveAttribute('id', 'text-node')
    expect(element).toHaveClass('custom-text')
  })
})
