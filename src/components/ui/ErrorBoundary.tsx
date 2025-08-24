'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error
  resetError: () => void
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-800 mb-2">Ops! Algo deu errado</h2>
        <p className="text-slate-600 mb-6">
          Ocorreu um erro inesperado. Tente recarregar a página ou voltar ao início.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-medium text-red-800 mb-1">Erro (desenvolvimento):</p>
            <p className="text-xs text-red-600 font-mono break-all">{error.message}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={resetError}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="flex-1"
          >
            <Home className="w-4 h-4 mr-2" />
            Início
          </Button>
        </div>
      </Card>
    </div>
  )
}