import { createClient } from '@supabase/supabase-js'

// Substitua essas variáveis com os valores reais do seu projeto Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseService = {
  supabase
}