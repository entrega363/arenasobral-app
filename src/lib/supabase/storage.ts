import { supabase } from '@/lib/supabase/client'

export const supabaseStorage = {
  // Fazer upload de imagem
  async uploadImage(file: File, bucket: string, path: string): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${path}/${Date.now()}.${fileExt}`
      
      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

      if (error) throw error

      // Obter URL público da imagem
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  },

  // Obter URL público de imagem
  getImageUrl(bucket: string, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  // Deletar imagem
  async deleteImage(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting image:', error)
      return false
    }
  }
}