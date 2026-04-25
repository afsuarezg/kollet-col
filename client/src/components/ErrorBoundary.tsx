import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div className="p-6 rounded-md border border-red-300 bg-red-50 text-red-800">
          <p className="font-semibold">Ocurrió un error inesperado.</p>
          <p className="mt-1 text-sm font-mono">{this.state.error.message}</p>
          <button
            className="mt-3 text-sm underline"
            onClick={() => this.setState({ error: null })}
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
