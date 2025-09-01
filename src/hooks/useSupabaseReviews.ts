'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { SupabaseReview } from '@/types'

export const useSupabaseReviews = () => {
  const [reviews, setReviews] = useState<SupabaseReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data as SupabaseReview[])
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError('Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviewsByField = async (fieldId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('field_id', fieldId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data as SupabaseReview[])
    } catch (err) {
      console.error('Error fetching field reviews:', err)
      setError('Failed to fetch field reviews')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviewsByUser = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data as SupabaseReview[])
    } catch (err) {
      console.error('Error fetching user reviews:', err)
      setError('Failed to fetch user reviews')
    } finally {
      setLoading(false)
    }
  }

  const createReview = async (reviewData: Partial<SupabaseReview>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single()

      if (error) throw error
      
      // Atualizar a lista de avaliações
      setReviews(prev => [...prev, data as SupabaseReview])
      return { success: true, data }
    } catch (err) {
      console.error('Error creating review:', err)
      setError('Failed to create review')
      return { success: false, error: err }
    }
  }

  const updateReview = async (id: string, reviewData: Partial<SupabaseReview>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      // Atualizar a lista de avaliações
      setReviews(prev => prev.map(review => review.id === id ? data as SupabaseReview : review))
      return { success: true, data }
    } catch (err) {
      console.error('Error updating review:', err)
      setError('Failed to update review')
      return { success: false, error: err }
    }
  }

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Remover a avaliação da lista
      setReviews(prev => prev.filter(review => review.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting review:', err)
      setError('Failed to delete review')
      return { success: false, error: err }
    }
  }

  // Calcular média de avaliações para um campo
  const getFieldAverageRating = async (fieldId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('field_id', fieldId)

      if (error) throw error

      if (!data || data.length === 0) return 0

      const totalRating = data.reduce((sum, review) => sum + review.rating, 0)
      return totalRating / data.length
    } catch (err) {
      console.error('Error calculating field average rating:', err)
      return 0
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    fetchReviewsByField,
    fetchReviewsByUser,
    createReview,
    updateReview,
    deleteReview,
    getFieldAverageRating,
  }
}