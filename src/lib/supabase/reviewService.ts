import { supabase } from './client'
import { SupabaseReview } from '@/types'

export const supabaseReviewService = {
  // Obter todas as avaliações
  async getAllReviews(): Promise<SupabaseReview[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as SupabaseReview[] || []
    } catch (error) {
      console.error('Error fetching reviews:', error)
      return []
    }
  },

  // Obter avaliações por ID do campo
  async getReviewsByFieldId(fieldId: string): Promise<SupabaseReview[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('field_id', fieldId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as SupabaseReview[] || []
    } catch (error) {
      console.error('Error fetching field reviews:', error)
      return []
    }
  },

  // Obter avaliações por ID do usuário
  async getReviewsByUserId(userId: string): Promise<SupabaseReview[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as SupabaseReview[] || []
    } catch (error) {
      console.error('Error fetching user reviews:', error)
      return []
    }
  },

  // Criar uma nova avaliação
  async createReview(reviewData: Partial<SupabaseReview>): Promise<SupabaseReview | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single()

      if (error) throw error
      return data as SupabaseReview
    } catch (error) {
      console.error('Error creating review:', error)
      return null
    }
  },

  // Atualizar uma avaliação
  async updateReview(id: string, reviewData: Partial<SupabaseReview>): Promise<SupabaseReview | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as SupabaseReview
    } catch (error) {
      console.error('Error updating review:', error)
      return null
    }
  },

  // Excluir uma avaliação
  async deleteReview(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting review:', error)
      return false
    }
  },

  // Calcular média de avaliações para um campo
  async getFieldAverageRating(fieldId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('field_id', fieldId)

      if (error) throw error

      if (!data || data.length === 0) return 0

      const totalRating = data.reduce((sum, review) => sum + review.rating, 0)
      return totalRating / data.length
    } catch (error) {
      console.error('Error calculating field average rating:', error)
      return 0
    }
  }
}