'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { SupabaseTeam } from '@/types'

export const useSupabaseTeams = () => {
  const [teams, setTeams] = useState<SupabaseTeam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeams = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name')

      if (error) throw error
      setTeams(data as SupabaseTeam[])
    } catch (err) {
      console.error('Error fetching teams:', err)
      setError('Failed to fetch teams')
    } finally {
      setLoading(false)
    }
  }

  const fetchTeamsByOwner = async (ownerId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('owner_id', ownerId)
        .order('name')

      if (error) throw error
      setTeams(data as SupabaseTeam[])
    } catch (err) {
      console.error('Error fetching owner teams:', err)
      setError('Failed to fetch owner teams')
    } finally {
      setLoading(false)
    }
  }

  const createTeam = async (teamData: Partial<SupabaseTeam>) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert(teamData)
        .select()
        .single()

      if (error) throw error
      
      // Atualizar a lista de times
      setTeams(prev => [...prev, data as SupabaseTeam])
      return { success: true, data }
    } catch (err) {
      console.error('Error creating team:', err)
      setError('Failed to create team')
      return { success: false, error: err }
    }
  }

  const updateTeam = async (id: string, teamData: Partial<SupabaseTeam>) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update(teamData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      // Atualizar a lista de times
      setTeams(prev => prev.map(team => team.id === id ? data as SupabaseTeam : team))
      return { success: true, data }
    } catch (err) {
      console.error('Error updating team:', err)
      setError('Failed to update team')
      return { success: false, error: err }
    }
  }

  const deleteTeam = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Remover o time da lista
      setTeams(prev => prev.filter(team => team.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting team:', err)
      setError('Failed to delete team')
      return { success: false, error: err }
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  return {
    teams,
    loading,
    error,
    fetchTeams,
    fetchTeamsByOwner,
    createTeam,
    updateTeam,
    deleteTeam,
  }
}