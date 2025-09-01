'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { SupabaseGame } from '@/types'

export const useSupabaseGames = () => {
  const [games, setGames] = useState<SupabaseGame[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGames = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setGames(data as SupabaseGame[])
    } catch (err) {
      console.error('Error fetching games:', err)
      setError('Failed to fetch games')
    } finally {
      setLoading(false)
    }
  }

  const fetchGamesByTeam = async (teamId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('games')
        .select('*')
        .or(`team1_id.eq.${teamId},team2_id.eq.${teamId}`)
        .order('date', { ascending: false })

      if (error) throw error
      setGames(data as SupabaseGame[])
    } catch (err) {
      console.error('Error fetching team games:', err)
      setError('Failed to fetch team games')
    } finally {
      setLoading(false)
    }
  }

  const fetchGamesByDate = async (date: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('date', date)
        .order('time')

      if (error) throw error
      setGames(data as SupabaseGame[])
    } catch (err) {
      console.error('Error fetching games by date:', err)
      setError('Failed to fetch games by date')
    } finally {
      setLoading(false)
    }
  }

  const createGame = async (gameData: Partial<SupabaseGame>) => {
    try {
      const { data, error } = await supabase
        .from('games')
        .insert(gameData)
        .select()
        .single()

      if (error) throw error
      
      // Atualizar a lista de jogos
      setGames(prev => [...prev, data as SupabaseGame])
      return { success: true, data }
    } catch (err) {
      console.error('Error creating game:', err)
      setError('Failed to create game')
      return { success: false, error: err }
    }
  }

  const updateGame = async (id: string, gameData: Partial<SupabaseGame>) => {
    try {
      const { data, error } = await supabase
        .from('games')
        .update(gameData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      // Atualizar a lista de jogos
      setGames(prev => prev.map(game => game.id === id ? data as SupabaseGame : game))
      return { success: true, data }
    } catch (err) {
      console.error('Error updating game:', err)
      setError('Failed to update game')
      return { success: false, error: err }
    }
  }

  const deleteGame = async (id: string) => {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Remover o jogo da lista
      setGames(prev => prev.filter(game => game.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting game:', err)
      setError('Failed to delete game')
      return { success: false, error: err }
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  return {
    games,
    loading,
    error,
    fetchGames,
    fetchGamesByTeam,
    fetchGamesByDate,
    createGame,
    updateGame,
    deleteGame,
  }
}