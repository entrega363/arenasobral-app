'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      // Validar credenciais
      if (email === 'josetenico21@gmail.com' && password === 'tenderbr0') {
        // Armazenar estado de autenticação
        localStorage.setItem('adminAuthenticated', 'true')
        // Definir cookie de autenticação
        document.cookie = "adminAuthenticated=true; path=/; max-age=86400; SameSite=Lax"
        router.push('/admin/dashboard')
      } else {
        setError('Credenciais inválidas')
      }
    } catch (err) {
      setError('Erro ao fazer login')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 min-h-screen">
      <StatusBar />
      
      <div className="flex items-center gap-4 px-4 py-4 text-white">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.back()}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold">Painel Administrativo</h1>
      </div>

      <div className="px-4 py-8">
        <Card className="bg-white p-6 max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Login Administrador</h2>
            <p className="text-slate-600">Acesse o painel administrativo</p>
          </div>

          {error && (
            <div className="mb-4">
              <ErrorMessage
                title="Erro de autenticação"
                message={error}
              />
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-slate-600 text-sm mb-2">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="josetenico21@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-slate-600 text-sm mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tenderbr0"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner size="sm" variant="white" />
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}