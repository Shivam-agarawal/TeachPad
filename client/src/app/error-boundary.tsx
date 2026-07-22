import React, { Component, type ReactNode } from 'react';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('React ErrorBoundary caught an exception:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-[var(--bg-canvas)] p-6 text-center text-[var(--text-primary)]">
          <h1 className="text-[20px] font-semibold text-[var(--danger)]">Something went wrong</h1>
          <p className="mt-2 text-[13px] text-[var(--text-secondary)]">
            An unexpected error occurred in the application shell.
          </p>
          <button
            onClick={() => window.location.reload()}
            aria-label="Reload application"
            className="mt-4 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Reload TeachPad
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
