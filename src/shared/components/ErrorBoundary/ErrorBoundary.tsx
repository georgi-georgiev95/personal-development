import { Component, type ReactNode } from 'react'
import {
  ErrorContainer,
  ErrorTitle,
  ErrorMessageText,
  RetryButton,
} from './ErrorBoundary.styles'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessageText>
            {this.state.error?.message || 'An unexpected error occurred'}
          </ErrorMessageText>
          <RetryButton onClick={this.handleRetry}>Try Again</RetryButton>
        </ErrorContainer>
      )
    }

    return this.props.children
  }
}
