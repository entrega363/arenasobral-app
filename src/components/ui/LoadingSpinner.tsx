'use client'

import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
  variant?: 'primary' | 'white' | 'gray'
}

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  className = '',
  variant = 'primary'
}: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'
      case 'lg':
        return 'w-8 h-8'
      case 'xl':
        return 'w-12 h-12'
      default:
        return 'w-6 h-6'
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'white':
        return 'text-white'
      case 'gray':
        return 'text-gray-500'
      default:
        return 'text-blue-500'
    }
  }

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm'
      case 'lg':
        return 'text-lg'
      case 'xl':
        return 'text-xl'
      default:
        return 'text-base'
    }
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin ${getSizeClasses()} ${getVariantClasses()}`} />
      {text && (
        <span className={`${getTextSize()} ${getVariantClasses()} font-medium`}>
          {text}
        </span>
      )}
    </div>
  )
}

// Skeleton components for loading states
interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  )
}

export function FieldCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className="flex gap-4">
        <Skeleton className="w-24 h-24 rounded-lg" />
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-12" />
          </div>
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function BookingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex gap-4">
          <div className="space-y-1">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}