import { Component, type ErrorInfo, type ReactNode } from "react"

interface ErrorBoundaryProps {
    children: ReactNode
    /**
     * Either a static node, or a render prop that receives a `reset`
     * callback. Use the render prop when you want a "Try again" button.
     */
    fallback: ReactNode | ((reset: () => void) => ReactNode)
    /** Optional hook for logging (Sentry, etc.). */
    onError?: (error: Error, info: ErrorInfo) => void
}

interface ErrorBoundaryState {
    error: Error | null
}

export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    state: ErrorBoundaryState = { error: null }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        this.props.onError?.(error, info)
        // eslint-disable-next-line no-console
        console.error("ErrorBoundary caught:", error, info)
    }

    // Stable reference, safe to pass as a prop.
    reset = () => this.setState({ error: null })

    render() {
        const { error } = this.state
        if (error === null) return this.props.children

        const { fallback } = this.props
        return typeof fallback === "function" ? fallback(this.reset) : fallback
    }
}