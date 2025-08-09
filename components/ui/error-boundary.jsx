"use client"
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">We're sorry for the inconvenience. Please try refreshing the page.</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;