'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabaseUserService } from '@/lib/supabase/userService'
import { User } from '@/types'

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (email: string, password: string, userType: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se o usuário já está logado
    checkUser()

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabaseUserService.supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const userData = await supabaseUserService.getCurrentUser()
          setUser(userData)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    try {
      const userData = await supabaseUserService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = await supabaseUserService.loginUser(email, password)
      if (userData) {
        setUser(userData)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await supabaseUserService.logoutUser()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const register = async (email: string, password: string, userType: string): Promise<boolean> => {
    try {
      const userData = await supabaseUserService.registerUser(email, password, userType)
      if (userData) {
        setUser(userData)
        return true
      }
      return false
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    register
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}