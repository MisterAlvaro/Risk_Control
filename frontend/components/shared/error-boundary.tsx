"use client";

import React, { PropsWithChildren, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <div className="text-sm text-red-600">Ha ocurrido un error inesperado.</div>;
    }
    return this.props.children;
  }
}

