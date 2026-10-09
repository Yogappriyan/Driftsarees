import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
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
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Atelier Uncaught UI Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0B0B] text-[#ECE5DC] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="max-w-lg w-full bg-[#181315] border border-[#8C1D3B]/40 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#C5A880] block mb-2">
              VKT Silks and Sarees • System Recovery
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-[#FAF7F2] mb-3">
              Experience Paused
            </h1>
            <p className="text-sm text-[#ECE5DC]/70 mb-6 leading-relaxed">
              An unexpected display glitch occurred while preparing the atelier. Your cart and preferences remain safe.
            </p>

            {this.state.error && (
              <div className="text-left bg-black/60 rounded-lg p-3.5 mb-6 text-xs font-mono text-[#D8A49B] overflow-x-auto border border-white/5">
                <p className="font-bold mb-1">Details:</p>
                <p className="break-all">{this.state.error.message || String(this.state.error)}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#8C1D3B] hover:bg-[#A32244] text-[#FAF7F2] text-xs font-mono tracking-widest uppercase transition-all shadow-lg cursor-pointer"
              >
                Resume Experience
              </button>
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-[#C5A880] text-xs font-mono tracking-widest uppercase transition-all cursor-pointer"
              >
                Reload Atelier
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
