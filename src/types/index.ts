export type UserType = 'PLAYER' | 'TEAM_OWNER' | 'FIELD_OWNER'

export interface User {
  id: string
  email: string
  name: string
  whatsapp: string
  userType: UserType
  createdAt: Date
  updatedAt: Date
}

// Tipos do Supabase
export type {
  SupabaseUser,
  SupabaseField,
  SupabaseTimeSlot,
  SupabaseBooking,
  SupabaseReview,
  SupabaseTeam,
  SupabasePlayer,
  SupabaseGame
} from './supabase'

export interface Player {
  id: string
  userId: string
  age: number
  position: string
  location: string
  experience: string
  availability: string
  category: string
  photo?: string
  user: User
  teams?: TeamPlayer[]
  _count?: {
    teams: number
  }
}

export interface Team {
  id: string
  name: string
  location: string
  category: string
  whatsapp: string
  ownerId: string
  owner?: TeamOwner
  players?: TeamPlayer[]
  _count?: {
    players: number
  }
}

export interface TeamOwner {
  id: string
  userId: string
  user: User
  teams: Team[]
}

export interface TeamPlayer {
  id: string
  teamId: string
  playerId: string
  joinedAt: Date
  team: Team
  player: Player
}

export interface Field {
  id: string
  name: string
  location: string
  ownerId: string
  owner: FieldOwner
  timeSlots: TimeSlot[]
  bookings: Booking[]
  // Extended fields for search and booking
  description: string
  fieldType: 'SOCIETY' | 'FUTSAL' | 'BEACH' | 'INDOOR'
  photos: FieldPhoto[]
  amenities: FieldAmenity[]
  reviews: FieldReview[]
  rating: number
  pricePerHour: number
  address: string
  coordinates?: {
    lat: number
    lng: number
  }
  rules: string[]
  contactInfo: {
    phone: string
    whatsapp: string
    email?: string
  }
}

export interface FieldOwner {
  id: string
  userId: string
  user: User
  fields: Field[]
}

export interface TimeSlot {
  id: string
  fieldId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  price: number
  available: boolean
  field: Field
}

export interface Booking {
  id: string
  fieldId: string
  timeSlotId: string
  teamId?: string
  playerName: string
  playerWhatsapp: string
  date: Date
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  field: Field
  timeSlot: TimeSlot
  team?: Team
  // Extended fields for booking
  playerEmail?: string
  notes?: string
  paymentMethod: 'PIX' | 'CARD' | 'CASH'
  createdAt: Date
  updatedAt: Date
}

export interface ContractOffer {
  id: string
  playerId: string
  teamId: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  message?: string
  createdAt: Date
  player: Player
  team: Team
}

export interface JoinRequest {
  id: string
  playerId: string
  teamId: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  message?: string
  createdAt: Date
  player: Player
  team: Team
}

export interface FriendlyMatch {
  id: string
  homeTeamId: string
  awayTeamId?: string
  date: Date
  time: string
  location: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  isRandom: boolean
  homeTeam: Team
  awayTeam?: Team
}

export interface ScheduledGame {
  id: string
  teamId: string
  opponent: string
  date: Date
  time: string
  location: string
  type: 'FRIENDLY' | 'TOURNAMENT'
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  team: Team
}

// Form types
export interface LoginFormData {
  email: string
  password: string
  userType: UserType
}

export interface RegisterFormData {
  name: string
  email: string
  whatsapp: string
  password: string
  confirmPassword: string
  userType: UserType
}

export interface PlayerProfileData {
  age: number
  position: string
  location: string
  experience: string
  availability: string
  category: string
  photo?: string
}

export interface TeamFormData {
  name: string
  location: string
  category: string
  whatsapp: string
}

export interface FieldFormData {
  name: string
  location: string
  photo?: string // Adicionando campo para foto da arena
}

export interface TimeSlotFormData {
  dayOfWeek: number
  startTime: string
  endTime: string
  price: number
  available: boolean
}

// New types for field search and booking system
export interface FieldFilters {
  location?: string
  priceRange?: {
    min: number
    max: number
  }
  fieldType?: 'SOCIETY' | 'FUTSAL' | 'BEACH' | 'INDOOR'
  date?: Date
  timeRange?: {
    start: string
    end: string
  }
  amenities?: string[]
}

export interface FieldAmenity {
  id: string
  name: string
  icon: string
}

export interface FieldPhoto {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

export interface FieldReview {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: Date
}

export interface BookingFormData {
  playerName: string
  playerWhatsapp: string
  playerEmail?: string
  notes?: string
  paymentMethod: 'PIX' | 'CARD' | 'CASH'
}

export enum FieldErrorType {
  FIELD_NOT_FOUND = 'FIELD_NOT_FOUND',
  TIME_SLOT_UNAVAILABLE = 'TIME_SLOT_UNAVAILABLE',
  BOOKING_FAILED = 'BOOKING_FAILED',
  USER_NOT_AUTHENTICATED = 'USER_NOT_AUTHENTICATED',
  INVALID_DATE = 'INVALID_DATE'
}

export interface FieldError {
  type: FieldErrorType
  message: string
  details?: any
}