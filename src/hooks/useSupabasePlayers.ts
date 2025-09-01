'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { SupabasePlayer } from '@/types'

export const useSupabasePlayers = () => {
  const [players, setPlayers] = useState<SupabasePlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlayers = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('name')

      if (error) throw error
      setPlayers(data as SupabasePlayer[])
    } catch (err) {
      console.error('Error fetching players:', err)
      setError('Failed to fetch players')
    } finally {
      setLoading(false)
    }
  }

  const fetchPlayersByUser = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', userId)
        .order('name')

      if (error) throw error
      setPlayers(data as SupabasePlayer[])
    } catch (err) {
      console.error('Error fetching user players:', err)
      setError('Failed to fetch user players')
    } finally {
      setLoading(false)
    }
  }

  const createPlayer = async (playerData: Partial<SupabasePlayer>) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert(playerData)
        .select()
        .single()

      if (error) throw error
      
      // Atualizar a lista de jogadores
      setPlayers(prev => [...prev, data as SupabasePlayer])
      return { success: true, data }
    } catch (err) {
      console.error('Error creating player:', err)
      setError('Failed to create player')
      return { success: false, error: err }
    }
  }

  const updatePlayer = async (id: string, playerData: Partial<SupabasePlayer>) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .update(playerData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      // Atualizar a lista de jogadores
      setPlayers(prev => prev.map(player => player.id === id ? data as SupabasePlayer : player))
      return { success: true, data }
    } catch (err) {
      console.error('Error updating player:', err)
      setError('Failed to update player')
      return { success: false, error: err }
    }
  }

  const deletePlayer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Remover o jogador da lista
      setPlayers(prev => prev.filter(player => player.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting player:', err)
      setError('Failed to delete player')
      return { success: false, error: err }
    }
  }

  useEffect(() => {
    fetchPlayers()
  }, [])

  return {
    players,
    loading,
    error,
    fetchPlayers,
    fetchPlayersByUser,
    createPlayer,
    updatePlayer,
    deletePlayer,
  }
}