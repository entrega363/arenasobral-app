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
}

export interface TimeSlotFormData {
  dayOfWeek: number
  startTime: string
  endTime: string
  price: number
  available: boolean
}