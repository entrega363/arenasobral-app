import { supabase } from './client'
import { Field, FieldFormData } from '@/types'

export const supabaseFieldService = {
  // Obter todas as areninhas
  async getAllFields(): Promise<Field[]> {
    try {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .order('name')

      if (error) throw error
      return data as Field[] || []
    } catch (error) {
      console.error('Error fetching fields:', error)
      return []
    }
  },

  // Obter areninhas por ID do proprietário
  async getFieldsByOwnerId(ownerId: string): Promise<Field[]> {
    try {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .eq('owner_id', ownerId)
        .order('name')

      if (error) throw error
      return data as Field[] || []
    } catch (error) {
      console.error('Error fetching owner fields:', error)
      return []
    }
  },

  // Obter uma areninha por ID
  async getFieldById(id: string): Promise<Field | null> {
    try {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Field
    } catch (error) {
      console.error('Error fetching field:', error)
      return null
    }
  },

  // Criar uma nova areninha
  async createField(fieldData: FieldFormData, ownerId: string): Promise<Field | null> {
    try {
      const newField = {
        name: fieldData.name,
        location: fieldData.location,
        address: fieldData.location,
        description: `Areninha ${fieldData.name} localizada em ${fieldData.location}`,
        field_type: 'SOCIETY',
        price_per_hour: 80,
        rating: 0,
        owner_id: ownerId,
        photos: fieldData.photo ? [{ id: '1', url: fieldData.photo, alt: fieldData.name, isPrimary: true }] : []
      }

      const { data, error } = await supabase
        .from('fields')
        .insert(newField)
        .select()
        .single()

      if (error) throw error
      return data as Field
    } catch (error) {
      console.error('Error creating field:', error)
      return null
    }
  },

  // Atualizar uma areninha
  async updateField(id: string, fieldData: Partial<FieldFormData>): Promise<Field | null> {
    try {
      const updateData: any = {}
      
      if (fieldData.name !== undefined) updateData.name = fieldData.name
      if (fieldData.location !== undefined) updateData.location = fieldData.location
      if (fieldData.photo !== undefined) {
        updateData.photos = fieldData.photo ? [{ id: '1', url: fieldData.photo, alt: fieldData.name, isPrimary: true }] : []
      }

      const { data, error } = await supabase
        .from('fields')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Field
    } catch (error) {
      console.error('Error updating field:', error)
      return null
    }
  },

  // Excluir uma areninha
  async deleteField(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting field:', error)
      return false
    }
  }
}