'use client'

import { ArrowLeft, Menu, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface MobileHeaderProps {
  title: string
  showBackButton?: boolean
  showMenuButton?: boolean
  onMenuClick?: () => void
  rightAction?: React.ReactNode
  className?: string
}

export function MobileHeader({
  title,
  showBackButton = false,
  showMenuButton = false,
  onMenuClick,
  rightAction,
  className = ''
}: MobileHeaderProps) {
  const router = useRouter()

  const handleBackClick = () => {
    router.back()
  }

  return (
    <div className={`flex items-center justify-between p-4 bg-slate-800 text-white ${className}`}>
      {/* Left side */}
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="text-white hover:bg-white/10 p-2"
          >
            <Menu className="w-6 h-6" />
          </Button>
        )}
        <h1 className="text-xl font-bold truncate">{title}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {rightAction || (
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 p-2"
          >
            <MoreVertical className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  )
}