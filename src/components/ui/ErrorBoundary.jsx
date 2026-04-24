import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="error-boundary">
        <div className="error-boundary-card">
          <h2>Something went wrong</h2>
          <p>
            We hit an unexpected error. Try reloading the page, and if it keeps happening,
            please let us know at <a href="mailto:hello@vibeflow.app">hello@vibeflow.app</a>.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre>{String(this.state.error?.stack || this.state.error)}</pre>
          )}
          <button className="btn btn-primary" onClick={this.handleRetry}>
            Reload view
          </button>
        </div>
      </div>
    )
  }
}
