'use client'

import { AlertCircle, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  onDismiss?: () => void
  variant?: 'error' | 'warning' | 'info'
  className?: string
}

export function ErrorMessage({
  title = 'Erro',
  message,
  onRetry,
  onDismiss,
  variant = 'error',
  className = ''
}: ErrorMessageProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-600',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          button: 'bg-yellow-500 hover:bg-yellow-600'
        }
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          title: 'text-blue-800',
          message: 'text-blue-700',
          button: 'bg-blue-500 hover:bg-blue-600'
        }
      default:
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          title: 'text-red-800',
          message: 'text-red-700',
          button: 'bg-red-500 hover:bg-red-600'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <Card className={`${styles.container} border rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className={`w-5 h-5 ${styles.icon} mt-0.5 flex-shrink-0`} />
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium ${styles.title} mb-1`}>{title}</h3>
          <p className={`text-sm ${styles.message} leading-relaxed`}>{message}</p>
          
          {(onRetry || onDismiss) && (
            <div className="flex gap-2 mt-3">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  size="sm"
                  className={`${styles.button} text-white`}
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Tentar Novamente
                </Button>
              )}
              {onDismiss && (
                <Button
                  onClick={onDismiss}
                  variant="outline"
                  size="sm"
                  className="border-gray-300"
                >
                  Dispensar
                </Button>
              )}
            </div>
          )}
        </div>

        {onDismiss && (
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="sm"
            className="p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}