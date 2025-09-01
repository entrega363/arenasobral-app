'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { SupabaseField } from '@/types'

export const useSupabaseFields = () => {
  const [fields, setFields] = useState<SupabaseField[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFields = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .order('name')

      if (error) throw error
      setFields(data as SupabaseField[])
    } catch (err) {
      console.error('Error fetching fields:', err)
      setError('Failed to fetch fields')
    } finally {
      setLoading(false)
    }
  }

  const fetchFieldsByOwner = async (ownerId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .eq('owner_id', ownerId)
        .order('name')

      if (error) throw error
      setFields(data as SupabaseField[])
    } catch (err) {
      console.error('Error fetching owner fields:', err)
      setError('Failed to fetch owner fields')
    } finally {
      setLoading(false)
    }
  }

  const createField = async (fieldData: Partial<SupabaseField>) => {
    try {
      const { data, error } = await supabase
        .from('fields')
        .insert(fieldData)
        .select()
        .single()

      if (error) throw error
      
      // Atualizar a lista de campos
      setFields(prev => [...prev, data as SupabaseField])
      return { success: true, data }
    } catch (err) {
      console.error('Error creating field:', err)
      setError('Failed to create field')
      return { success: false, error: err }
    }
  }

  const updateField = async (id: string, fieldData: Partial<SupabaseField>) => {
    try {
      const { data, error } = await supabase
        .from('fields')
        .update(fieldData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      // Atualizar a lista de campos
      setFields(prev => prev.map(field => field.id === id ? data as SupabaseField : field))
      return { success: true, data }
    } catch (err) {
      console.error('Error updating field:', err)
      setError('Failed to update field')
      return { success: false, error: err }
    }
  }

  const deleteField = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Remover o campo da lista
      setFields(prev => prev.filter(field => field.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting field:', err)
      setError('Failed to delete field')
      return { success: false, error: err }
    }
  }

  useEffect(() => {
    fetchFields()
  }, [])

  return {
    fields,
    loading,
    error,
    fetchFields,
    fetchFieldsByOwner,
    createField,
    updateField,
    deleteField,
  }
}