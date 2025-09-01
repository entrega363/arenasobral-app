import { supabase } from './client'
import { SupabaseGame } from '@/types'

export const supabaseGameService = {
  // Obter todos os jogos
  async getAllGames(): Promise<SupabaseGame[]> {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      return data as SupabaseGame[] || []
    } catch (error) {
      console.error('Error fetching games:', error)
      return []
    }
  },

  // Obter jogos por ID do time
  async getGamesByTeamId(teamId: string): Promise<SupabaseGame[]> {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .or(`team1_id.eq.${teamId},team2_id.eq.${teamId}`)
        .order('date', { ascending: false })

      if (error) throw error
      return data as SupabaseGame[] || []
    } catch (error) {
      console.error('Error fetching team games:', error)
      return []
    }
  },

  // Obter jogos por data
  async getGamesByDate(date: string): Promise<SupabaseGame[]> {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('date', date)
        .order('time')

      if (error) throw error
      return data as SupabaseGame[] || []
    } catch (error) {
      console.error('Error fetching games by date:', error)
      return []
    }
  },

  // Criar um novo jogo
  async createGame(gameData: Partial<SupabaseGame>): Promise<SupabaseGame | null> {
    try {
      const { data, error } = await supabase
        .from('games')
        .insert(gameData)
        .select()
        .single()

      if (error) throw error
      return data as SupabaseGame
    } catch (error) {
      console.error('Error creating game:', error)
      return null
    }
  },

  // Atualizar um jogo
  async updateGame(id: string, gameData: Partial<SupabaseGame>): Promise<SupabaseGame | null> {
    try {
      const { data, error } = await supabase
        .from('games')
        .update(gameData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as SupabaseGame
    } catch (error) {
      console.error('Error updating game:', error)
      return null
    }
  },

  // Excluir um jogo
  async deleteGame(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting game:', error)
      return false
    }
  }
}