'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
    messageColor: 'text-green-700'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    messageColor: 'text-red-700'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-800',
    messageColor: 'text-yellow-700'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    messageColor: 'text-blue-700'
  }
}

export function FeedbackToast({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  action
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const config = toastConfig[type]
  const Icon = config.icon

  useEffect(() => {
    // Anima entrada
    const showTimer = setTimeout(() => setIsVisible(true), 100)
    
    // Auto-close
    const closeTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(closeTimer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
      `}
    >
      <div
        className={`
          ${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg p-4
          animate-in slide-in-from-right-full duration-300
        `}
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
          
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium ${config.titleColor} text-sm`}>
              {title}
            </h4>
            {message && (
              <p className={`mt-1 text-sm ${config.messageColor}`}>
                {message}
              </p>
            )}
            {action && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={action.onClick}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className={`h-6 w-6 ${config.iconColor} hover:bg-white/50`}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Hook para gerenciar toasts
export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const showToast = (toast: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = {
      ...toast,
      id,
      onClose: () => removeToast(id)
    }
    
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (title: string, message?: string, action?: ToastProps['action']) => {
    showToast({ type: 'success', title, message, action })
  }

  const showError = (title: string, message?: string, action?: ToastProps['action']) => {
    showToast({ type: 'error', title, message, action })
  }

  const showWarning = (title: string, message?: string, action?: ToastProps['action']) => {
    showToast({ type: 'warning', title, message, action })
  }

  const showInfo = (title: string, message?: string, action?: ToastProps['action']) => {
    showToast({ type: 'info', title, message, action })
  }

  const ToastContainer = () => (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map(toast => (
        <FeedbackToast key={toast.id} {...toast} />
      ))}
    </div>
  )

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    ToastContainer
  }
}