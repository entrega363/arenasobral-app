import { supabase } from './client'
import { Booking } from '@/types'

export const supabaseBookingService = {
  // Obter todas as reservas
  async getAllBookings(): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Booking[] || []
    } catch (error) {
      console.error('Error fetching bookings:', error)
      return []
    }
  },

  // Obter reservas por ID do campo
  async getBookingsByFieldId(fieldId: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('field_id', fieldId)
        .order('date', { ascending: false })

      if (error) throw error
      return data as Booking[] || []
    } catch (error) {
      console.error('Error fetching field bookings:', error)
      return []
    }
  },

  // Obter reservas por ID do usuário
  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (error) throw error
      return data as Booking[] || []
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      return []
    }
  },

  // Criar uma nova reserva
  async createBooking(bookingData: Partial<Booking>): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single()

      if (error) throw error
      return data as Booking
    } catch (error) {
      console.error('Error creating booking:', error)
      return null
    }
  },

  // Atualizar uma reserva
  async updateBooking(id: string, bookingData: Partial<Booking>): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Booking
    } catch (error) {
      console.error('Error updating booking:', error)
      return null
    }
  },

  // Excluir uma reserva
  async deleteBooking(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting booking:', error)
      return false
    }
  }
}