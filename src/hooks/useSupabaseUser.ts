'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { SupabaseUser } from '@/types'

export const useSupabaseUser = (userId: string | null) => {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) throw error
        setUser(data as SupabaseUser)
      } catch (err) {
        console.error('Error fetching user:', err)
        setError('Failed to fetch user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  const updateUser = async (userData: Partial<SupabaseUser>) => {
    try {
      if (!userId) throw new Error('User ID is required')

      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      setUser(data as SupabaseUser)
      return { success: true, data }
    } catch (err) {
      console.error('Error updating user:', err)
      setError('Failed to update user data')
      return { success: false, error: err }
    }
  }

  return {
    user,
    loading,
    error,
    updateUser,
  }
}