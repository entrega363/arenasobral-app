'use client'

import { ReactNode, useState } from 'react'
import { Card } from '@/components/ui/card'
import { useResponsive } from '@/hooks/useResponsive'

interface AnimatedCardProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  hoverScale?: boolean
  fadeIn?: boolean
  slideUp?: boolean
  delay?: number
}

export function AnimatedCard({
  children,
  onClick,
  className = '',
  hoverScale = true,
  fadeIn = true,
  slideUp = false,
  delay = 0
}: AnimatedCardProps) {
  const { isMobile } = useResponsive()
  const [isPressed, setIsPressed] = useState(false)

  const handleMouseDown = () => {
    if (!isMobile) setIsPressed(true)
  }

  const handleMouseUp = () => {
    if (!isMobile) setIsPressed(false)
  }

  const handleTouchStart = () => {
    if (isMobile) setIsPressed(true)
  }

  const handleTouchEnd = () => {
    if (isMobile) setIsPressed(false)
  }

  const animationClasses = [
    'transition-all duration-300 ease-out',
    fadeIn ? 'animate-in fade-in-0' : '',
    slideUp ? 'animate-in slide-in-from-bottom-4' : '',
    hoverScale && !isMobile ? 'hover:scale-[1.02] hover:shadow-lg' : '',
    isMobile && onClick ? 'active:scale-[0.98]' : '',
    isPressed ? 'scale-[0.98]' : '',
    onClick ? 'cursor-pointer' : '',
    className
  ].filter(Boolean).join(' ')

  const style = delay > 0 ? { animationDelay: `${delay}ms` } : undefined

  return (
    <Card
      className={animationClasses}
      style={style}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {children}
    </Card>
  )
}