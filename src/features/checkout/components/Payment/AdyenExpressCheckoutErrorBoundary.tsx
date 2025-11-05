'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AdyenExpressCheckoutErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Adyen Express Checkout Error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Fail silently - don't show anything if express checkout fails
      return "Could not load Adyen Express Checkout";
    }

    return this.props.children;
  }
}

