'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { SupabaseBooking } from '@/types'

export const useSupabaseBookings = () => {
  const [bookings, setBookings] = useState<SupabaseBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data as SupabaseBooking[])
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const fetchBookingsByUser = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (error) throw error
      setBookings(data as SupabaseBooking[])
    } catch (err) {
      console.error('Error fetching user bookings:', err)
      setError('Failed to fetch user bookings')
    } finally {
      setLoading(false)
    }
  }

  const fetchBookingsByField = async (fieldId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('field_id', fieldId)
        .order('date', { ascending: false })

      if (error) throw error
      setBookings(data as SupabaseBooking[])
    } catch (err) {
      console.error('Error fetching field bookings:', err)
      setError('Failed to fetch field bookings')
    } finally {
      setLoading(false)
    }
  }

  const createBooking = async (bookingData: Partial<SupabaseBooking>) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single()

      if (error) throw error
      
      // Atualizar a lista de reservas
      setBookings(prev => [...prev, data as SupabaseBooking])
      return { success: true, data }
    } catch (err) {
      console.error('Error creating booking:', err)
      setError('Failed to create booking')
      return { success: false, error: err }
    }
  }

  const updateBooking = async (id: string, bookingData: Partial<SupabaseBooking>) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      // Atualizar a lista de reservas
      setBookings(prev => prev.map(booking => booking.id === id ? data as SupabaseBooking : booking))
      return { success: true, data }
    } catch (err) {
      console.error('Error updating booking:', err)
      setError('Failed to update booking')
      return { success: false, error: err }
    }
  }

  const deleteBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Remover a reserva da lista
      setBookings(prev => prev.filter(booking => booking.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting booking:', err)
      setError('Failed to delete booking')
      return { success: false, error: err }
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    fetchBookingsByUser,
    fetchBookingsByField,
    createBooking,
    updateBooking,
    deleteBooking,
  }
}