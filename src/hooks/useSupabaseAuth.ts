'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export const useSupabaseAuth = () => {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      setSession(data.session)
      return { success: true, data }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error
      setSession(data.session)
      return { success: true, data }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setSession(null)
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Password reset error:', error)
      return { success: false, error }
    }
  }

  return {
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    user: session?.user,
  }
}