import { supabase } from './client'
import { User } from '@/types'

export const supabaseUserService = {
  supabase,
  
  // Registrar um novo usuário
  async registerUser(email: string, password: string, userType: string): Promise<User | null> {
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      // Criar perfil do usuário na tabela users
      const newUser = {
        id: authData.user?.id,
        email: email,
        user_type: userType,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single()

      if (error) throw error
      return data as User
    } catch (error) {
      console.error('Error registering user:', error)
      return null
    }
  },

  // Login do usuário
  async loginUser(email: string, password: string): Promise<User | null> {
    try {
      // Autenticar usuário
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Obter perfil do usuário
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user?.id)
        .single()

      if (error) throw error
      return data as User
    } catch (error) {
      console.error('Error logging in user:', error)
      return null
    }
  },

  // Logout do usuário
  async logoutUser(): Promise<void> {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error logging out user:', error)
    }
  },

  // Obter usuário atual
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      // Obter perfil do usuário
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data as User
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }
}