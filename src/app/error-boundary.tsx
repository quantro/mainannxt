"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-[200px] px-6">
            <div className="cosmic-card px-6 py-5 text-center max-w-sm">
              <p className="text-[15px] font-medium mb-1">Something went wrong</p>
              <p className="text-[13px] text-[var(--color-ink-muted-48)]">
                Try refreshing the page.
              </p>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
