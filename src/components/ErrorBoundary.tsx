import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    // Auto-reload on chunk load error
    if (error.message.includes("dynamically imported module") || error.name === "ChunkLoadError") {
      const reloaded = window.sessionStorage.getItem("chunk-load-reloaded");
      if (!reloaded) {
        window.sessionStorage.setItem("chunk-load-reloaded", "true");
        window.location.reload();
        return;
      }
    }
    
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", background: "red", color: "white" }}>
          <h1>Sorry.. there was an error</h1>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error?.toString()}
          </pre>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "10px" }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
