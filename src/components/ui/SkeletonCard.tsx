'use client'
import { Card } from '@/components/ui/card'

interface SkeletonCardProps {
  variant?: 'field' | 'booking' | 'simple'
  count?: number
}

export function SkeletonCard({ variant = 'simple', count = 1 }: SkeletonCardProps) {
  const renderSkeleton = () => {
    if (variant === 'field') {
      return (
        <Card className="bg-white rounded-xl p-4 animate-pulse">
          <div className="flex gap-4">
            {/* Image placeholder */}
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
            {/* Content */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-5 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-14"></div>
              </div>
            </div>
          </div>
        </Card>
      )
    }
    
    if (variant === 'booking') {
      return (
        <Card className="bg-white rounded-xl p-4 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-12"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex gap-4">
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-10"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </Card>
      )
    }
    
    return (
      <Card className="bg-white rounded-xl p-4 animate-pulse">
        <div className="space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}