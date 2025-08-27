'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      // Verificar autenticação no localStorage
      const isAuthenticatedLocalStorage = localStorage.getItem('adminAuthenticated') === 'true'
      
      // Verificar autenticação no cookie
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);
      
      const isAuthenticatedCookie = cookies['adminAuthenticated'] === 'true';
      
      // Se não estiver autenticado em nenhum dos dois, redirecionar para login
      if (!isAuthenticatedLocalStorage && !isAuthenticatedCookie) {
        router.push('/admin/login')
      } else {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="bg-slate-800 min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verificando autenticação..." variant="white" />
      </div>
    )
  }

  return <>{children}</>
}