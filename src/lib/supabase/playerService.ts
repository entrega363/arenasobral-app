import { supabase } from './client'
import { SupabasePlayer } from '@/types'

export const supabasePlayerService = {
  // Obter todos os jogadores
  async getAllPlayers(): Promise<SupabasePlayer[]> {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('name')

      if (error) throw error
      return data as SupabasePlayer[] || []
    } catch (error) {
      console.error('Error fetching players:', error)
      return []
    }
  },

  // Obter jogadores por ID do usuário
  async getPlayersByUserId(userId: string): Promise<SupabasePlayer[]> {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', userId)
        .order('name')

      if (error) throw error
      return data as SupabasePlayer[] || []
    } catch (error) {
      console.error('Error fetching user players:', error)
      return []
    }
  },

  // Obter um jogador por ID
  async getPlayerById(id: string): Promise<SupabasePlayer | null> {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as SupabasePlayer
    } catch (error) {
      console.error('Error fetching player:', error)
      return null
    }
  },

  // Criar um novo jogador
  async createPlayer(playerData: Partial<SupabasePlayer>): Promise<SupabasePlayer | null> {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert(playerData)
        .select()
        .single()

      if (error) throw error
      return data as SupabasePlayer
    } catch (error) {
      console.error('Error creating player:', error)
      return null
    }
  },

  // Atualizar um jogador
  async updatePlayer(id: string, playerData: Partial<SupabasePlayer>): Promise<SupabasePlayer | null> {
    try {
      const { data, error } = await supabase
        .from('players')
        .update(playerData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as SupabasePlayer
    } catch (error) {
      console.error('Error updating player:', error)
      return null
    }
  },

  // Excluir um jogador
  async deletePlayer(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting player:', error)
      return false
    }
  }
}