import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('PeptShop render error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="ps-error-boundary">
          <div className="ps-error-content">
            <h2>Something went wrong</h2>
            <p>This page failed to load. Try refreshing — your cart is preserved.</p>
            <button type="button" onClick={() => window.location.reload()}>
              Refresh page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}