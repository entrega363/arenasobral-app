'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Home, Search, Calendar, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  path: string
  isActive?: boolean
}

export function MobileBottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      icon: Home,
      label: 'Início',
      path: '/',
      isActive: pathname === '/'
    },
    {
      icon: Search,
      label: 'Buscar',
      path: '/search/fields',
      isActive: pathname.startsWith('/search')
    },
    {
      icon: Calendar,
      label: 'Reservas',
      path: '/bookings',
      isActive: pathname === '/bookings'
    },
    {
      icon: User,
      label: 'Perfil',
      path: '/profile',
      isActive: pathname === '/profile'
    }
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                item.isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}