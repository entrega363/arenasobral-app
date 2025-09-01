import { supabase } from './client'
import { SupabaseTeam } from '@/types'

export const supabaseTeamService = {
  // Obter todos os times
  async getAllTeams(): Promise<SupabaseTeam[]> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name')

      if (error) throw error
      return data as SupabaseTeam[] || []
    } catch (error) {
      console.error('Error fetching teams:', error)
      return []
    }
  },

  // Obter times por ID do proprietário
  async getTeamsByOwnerId(ownerId: string): Promise<SupabaseTeam[]> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('owner_id', ownerId)
        .order('name')

      if (error) throw error
      return data as SupabaseTeam[] || []
    } catch (error) {
      console.error('Error fetching owner teams:', error)
      return []
    }
  },

  // Obter um time por ID
  async getTeamById(id: string): Promise<SupabaseTeam | null> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as SupabaseTeam
    } catch (error) {
      console.error('Error fetching team:', error)
      return null
    }
  },

  // Criar um novo time
  async createTeam(teamData: Partial<SupabaseTeam>): Promise<SupabaseTeam | null> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert(teamData)
        .select()
        .single()

      if (error) throw error
      return data as SupabaseTeam
    } catch (error) {
      console.error('Error creating team:', error)
      return null
    }
  },

  // Atualizar um time
  async updateTeam(id: string, teamData: Partial<SupabaseTeam>): Promise<SupabaseTeam | null> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update(teamData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as SupabaseTeam
    } catch (error) {
      console.error('Error updating team:', error)
      return null
    }
  },

  // Excluir um time
  async deleteTeam(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting team:', error)
      return false
    }
  }
}