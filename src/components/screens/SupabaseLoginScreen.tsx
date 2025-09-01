'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Users, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'
import { UserType } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

export function SupabaseLoginScreen() {
  const { login, register } = useAuth()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [selectedUserType, setSelectedUserType] = useState<UserType | ''>('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, preencha todos os campos')
      return
    }

    if (!selectedUserType) {
      alert('Por favor, selecione o tipo de conta')
      return
    }

    setLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        // Redirecionar baseado no tipo de usuário
        switch (selectedUserType) {
          case 'PLAYER':
            router.push('/dashboard/player')
            break
          case 'TEAM_OWNER':
            router.push('/dashboard/team-owner')
            break
          case 'FIELD_OWNER':
            router.push('/dashboard/field-owner')
            break
        }
      } else {
        alert('Email ou senha incorretos')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      alert('Por favor, preencha todos os campos')
      return
    }

    if (password !== confirmPassword) {
      alert('As senhas não coincidem')
      return
    }

    if (!selectedUserType) {
      alert('Por favor, selecione o tipo de conta')
      return
    }

    setLoading(true)
    try {
      const success = await register(email, password, selectedUserType)
      if (success) {
        // Redirecionar baseado no tipo de usuário
        switch (selectedUserType) {
          case 'PLAYER':
            router.push('/dashboard/player')
            break
          case 'TEAM_OWNER':
            router.push('/dashboard/team-owner')
            break
          case 'FIELD_OWNER':
            router.push('/dashboard/field-owner')
            break
        }
      } else {
        alert('Erro ao criar conta')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  const userTypes = [
    {
      value: 'PLAYER' as UserType,
      title: 'Jogador',
      description: 'Buscar times, participar de jogos',
      icon: User,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: selectedUserType === 'PLAYER' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
    },
    {
      value: 'TEAM_OWNER' as UserType,
      title: 'Dono de Time',
      description: 'Gerenciar equipe, marcar jogos',
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: selectedUserType === 'TEAM_OWNER' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
    },
    {
      value: 'FIELD_OWNER' as UserType,
      title: 'Dono de Areninha',
      description: 'Gerenciar quadra, horários e reservas',
      icon: MapPin,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      borderColor: selectedUserType === 'FIELD_OWNER' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
    }
  ]

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
        <h1 className="text-xl font-bold">Login ArenaSobral</h1>
      </div>
      
      <div className="px-4 py-8">
        <Card className="bg-white rounded-xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {isLogin ? 'Bem-vindo ao ArenaSobral' : 'Criar Conta'}
            </h2>
            <p className="text-slate-600">
              {isLogin 
                ? 'Entre em sua conta para acessar todas as funcionalidades' 
                : 'Crie uma conta para acessar todas as funcionalidades'}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <label className="text-slate-600 text-sm mb-2 block">Email *</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu.email@exemplo.com"
              />
            </div>

            <div>
              <label className="text-slate-600 text-sm mb-2 block">Senha *</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sua senha"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="text-slate-600 text-sm mb-2 block">Confirmar Senha *</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirme sua senha"
                />
              </div>
            )}

            <div>
              <label className="text-slate-600 text-sm mb-2 block">Tipo de Conta *</label>
              <div className="space-y-3">
                {userTypes.map((userType) => {
                  const IconComponent = userType.icon
                  
                  return (
                    <label 
                      key={userType.value}
                      className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${userType.borderColor}`}
                      onClick={() => setSelectedUserType(userType.value)}
                    >
                      <input 
                        type="radio" 
                        name="userType" 
                        value={userType.value}
                        checked={selectedUserType === userType.value}
                        onChange={() => setSelectedUserType(userType.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${userType.bgColor} rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`w-5 h-5 ${userType.iconColor}`} />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{userType.title}</div>
                          <div className="text-sm text-slate-600">{userType.description}</div>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            <Button 
              onClick={isLogin ? handleLogin : handleRegister}
              disabled={loading}
              className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg mb-4 hover:bg-blue-600 transition"
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                {isLogin ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
              </p>
              <Button 
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-500 text-sm font-medium hover:text-blue-600 transition"
              >
                {isLogin ? 'Criar Conta Grátis' : 'Fazer Login'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}