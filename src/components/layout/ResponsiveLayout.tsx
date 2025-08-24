'use client'

import { ReactNode } from 'react'
import { StatusBar } from '@/components/layout/StatusBar'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { MobileHeader } from '@/components/ui/MobileHeader'
import { useResponsive } from '@/hooks/useResponsive'

interface ResponsiveLayoutProps {
  children: ReactNode
  title?: string
  showHeader?: boolean
  showBackButton?: boolean
  showBottomNav?: boolean
  headerRightAction?: ReactNode
  className?: string
}

export function ResponsiveLayout({
  children,
  title = 'Arena Booking',
  showHeader = true,
  showBackButton = false,
  showBottomNav = true,
  headerRightAction,
  className = ''
}: ResponsiveLayoutProps) {
  const { isMobile } = useResponsive()

  return (
    <div className={`min-h-screen bg-slate-800 ${className}`}>
      <StatusBar />
      
      {showHeader && isMobile && (
        <MobileHeader
          title={title}
          showBackButton={showBackButton}
          rightAction={headerRightAction}
        />
      )}

      <main className={`${
        isMobile && showBottomNav ? 'pb-20' : ''
      } ${
        isMobile && showHeader ? 'pt-0' : 'pt-4'
      }`}>
        {children}
      </main>

      {showBottomNav && isMobile && <MobileBottomNav />}
    </div>
  )
}