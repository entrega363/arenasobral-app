// Tipos do Supabase para a aplicação ArenaSobral

export interface SupabaseUser {
  id: string
  email: string
  user_type: 'PLAYER' | 'TEAM_OWNER' | 'FIELD_OWNER'
  name?: string
  phone?: string
  created_at: string
  updated_at?: string
}

export interface SupabaseField {
  id: string
  name: string
  location: string
  address: string
  description: string
  field_type: 'SOCIETY' | 'GRASS' | 'CONCRETE'
  price_per_hour: number
  rating: number
  owner_id: string
  photos?: Array<{
    id: string
    url: string
    alt: string
    isPrimary: boolean
  }>
  amenities?: Array<{
    id: string
    name: string
    icon: string
  }>
  rules?: string[]
  contact_info?: {
    phone?: string
    whatsapp?: string
  }
  created_at: string
  updated_at?: string
}

export interface SupabaseTimeSlot {
  id: string
  field_id: string
  day_of_week: number // 0-6 (Domingo-Sábado)
  start_time: string // HH:MM
  end_time: string // HH:MM
  price: number
  available: boolean
  created_at: string
  updated_at?: string
}

export interface SupabaseBooking {
  id: string
  field_id: string
  user_id: string
  time_slot_id: string
  date: string // YYYY-MM-DD
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  payment_status: 'PENDING' | 'PAID' | 'REFUNDED'
  total_amount: number
  created_at: string
  updated_at?: string
}

export interface SupabaseReview {
  id: string
  field_id: string
  user_id: string
  rating: number // 1-5
  comment?: string
  created_at: string
  updated_at?: string
}

export interface SupabaseTeam {
  id: string
  name: string
  description?: string
  owner_id: string
  created_at: string
  updated_at?: string
}

export interface SupabasePlayer {
  id: string
  user_id: string
  name: string
  position?: string
  skill_level?: number // 1-5
  phone?: string
  created_at: string
  updated_at?: string
}

export interface SupabaseGame {
  id: string
  field_id: string
  team1_id: string
  team2_id?: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  score_team1?: number
  score_team2?: number
  created_at: string
  updated_at?: string
}