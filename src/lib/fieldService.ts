import { Field, FieldFilters, Booking, TimeSlot, FieldError, FieldErrorType } from '@/types'
import { cache, CacheKeys, withCache } from '@/lib/cache'

// Storage keys for localStorage
export const STORAGE_KEYS = {
  FIELDS: 'arenasobral_fields',
  BOOKINGS: 'arenasobral_bookings',
  FIELD_REVIEWS: 'arenasobral_field_reviews',
  CURRENT_USER: 'currentUser'
} as const

export class FieldService {
  /**
   * Get all fields from localStorage
   */
  static getAllFields(): Field[] {
    try {
      const fieldsData = localStorage.getItem(STORAGE_KEYS.FIELDS)
      if (!fieldsData) {
        // Initialize with mock data if no data exists
        const mockFields = this.generateMockFields()
        this.saveFields(mockFields)
        return mockFields
      }
      return JSON.parse(fieldsData)
    } catch (error) {
      console.error('Error loading fields:', error)
      return []
    }
  }

  /**
   * Get field by ID
   */
  static getFieldById(id: string): Field | null {
    try {
      const fields = this.getAllFields()
      return fields.find(field => field.id === id) || null
    } catch (error) {
      console.error('Error getting field by ID:', error)
      return null
    }
  }

  /**
   * Search fields with filters
   */
  static searchFields(filters: FieldFilters): Field[] {
    try {
      let fields = this.getAllFields()

      // Filter by location
      if (filters.location) {
        const locationLower = filters.location.toLowerCase()
        fields = fields.filter(field => 
          field.location.toLowerCase().includes(locationLower) ||
          field.address.toLowerCase().includes(locationLower)
        )
      }

      // Filter by price range
      if (filters.priceRange) {
        fields = fields.filter(field => 
          field.pricePerHour >= filters.priceRange!.min &&
          field.pricePerHour <= filters.priceRange!.max
        )
      }

      // Filter by field type
      if (filters.fieldType) {
        fields = fields.filter(field => field.fieldType === filters.fieldType)
      }

      // Filter by amenities
      if (filters.amenities && filters.amenities.length > 0) {
        fields = fields.filter(field => 
          filters.amenities!.some(amenityId => 
            field.amenities.some(fieldAmenity => fieldAmenity.id === amenityId)
          )
        )
      }

      return fields
    } catch (error) {
      console.error('Error searching fields:', error)
      return []
    }
  }

  /**
   * Get available time slots for a field on a specific date
   */
  static getAvailableTimeSlots(fieldId: string, date: Date): TimeSlot[] {
    try {
      const field = this.getFieldById(fieldId)
      if (!field) return []

      const dayOfWeek = date.getDay()
      const bookings = this.getBookingsForFieldAndDate(fieldId, date)
      
      // Get time slots for the day of week
      const dayTimeSlots = field.timeSlots.filter(slot => 
        slot.dayOfWeek === dayOfWeek && slot.available
      )

      // Filter out booked time slots
      const bookedTimeSlotIds = bookings
        .filter(booking => booking.status === 'CONFIRMED')
        .map(booking => booking.timeSlotId)

      return dayTimeSlots.filter(slot => !bookedTimeSlotIds.includes(slot.id))
    } catch (error) {
      console.error('Error getting available time slots:', error)
      return []
    }
  }

  /**
   * Create a new booking
   */
  static createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'field' | 'timeSlot' | 'team'>): string | null {
    try {
      const bookings = this.getAllBookings()
      const field = this.getFieldById(bookingData.fieldId)
      const timeSlot = field?.timeSlots.find(ts => ts.id === bookingData.timeSlotId)
      
      if (!field || !timeSlot) {
        throw new Error('Field or time slot not found')
      }

      // Check if time slot is still available
      const existingBooking = bookings.find(booking => 
        booking.fieldId === bookingData.fieldId &&
        booking.timeSlotId === bookingData.timeSlotId &&
        new Date(booking.date).toDateString() === new Date(bookingData.date).toDateString() &&
        booking.status === 'CONFIRMED'
      )

      if (existingBooking) {
        throw new Error('Time slot is no longer available')
      }

      const newBooking: Booking = {
        ...bookingData,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        field,
        timeSlot,
        status: 'CONFIRMED' // Auto-confirm for demo purposes
      }

      bookings.push(newBooking)
      this.saveBookings(bookings)
      return newBooking.id
    } catch (error) {
      console.error('Error creating booking:', error)
      return null
    }
  }

  /**
   * Get all bookings for a user
   */
  static getUserBookings(userEmail: string): Booking[] {
    try {
      const bookings = this.getAllBookings()
      return bookings.filter(booking => 
        booking.playerEmail === userEmail || 
        booking.playerName.toLowerCase().includes(userEmail.toLowerCase())
      )
    } catch (error) {
      console.error('Error getting user bookings:', error)
      return []
    }
  }

  /**
   * Get booking by ID
   */
  static getBookingById(bookingId: string): Booking | null {
    try {
      const bookings = this.getAllBookings()
      return bookings.find(booking => booking.id === bookingId) || null
    } catch (error) {
      console.error('Error getting booking by ID:', error)
      return null
    }
  }

  /**
   * Cancel a booking
   */
  static cancelBooking(bookingId: string): boolean {
    try {
      const bookings = this.getAllBookings()
      const bookingIndex = bookings.findIndex(booking => booking.id === bookingId)
      
      if (bookingIndex === -1) return false

      bookings[bookingIndex].status = 'CANCELLED'
      bookings[bookingIndex].updatedAt = new Date()
      
      this.saveBookings(bookings)
      return true
    } catch (error) {
      console.error('Error cancelling booking:', error)
      return false
    }
  }

  /**
   * Get all bookings from localStorage
   */
  private static getAllBookings(): Booking[] {
    try {
      const bookingsData = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
      return bookingsData ? JSON.parse(bookingsData) : []
    } catch (error) {
      console.error('Error loading bookings:', error)
      return []
    }
  }

  /**
   * Get bookings for a specific field and date
   */
  private static getBookingsForFieldAndDate(fieldId: string, date: Date): Booking[] {
    const bookings = this.getAllBookings()
    const dateString = date.toDateString()
    
    return bookings.filter(booking => 
      booking.fieldId === fieldId && 
      new Date(booking.date).toDateString() === dateString
    )
  }

  /**
   * Save fields to localStorage
   */
  private static saveFields(fields: Field[]): void {
    localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields))
  }

  /**
   * Save bookings to localStorage
   */
  private static saveBookings(bookings: Booking[]): void {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))
  }

  /**
   * Generate a unique ID
   */
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
  
/**
   * Generate mock field data for development
   */
  private static generateMockFields(): Field[] {
    return [
      {
        id: '1',
        name: 'Arena Central',
        location: 'Centro, Sobral',
        address: 'Rua Principal, 123 - Centro, Sobral - CE',
        description: 'Quadra society com grama sintética de alta qualidade, ideal para jogos profissionais e amadores. Localizada no coração de Sobral com fácil acesso.',
        fieldType: 'SOCIETY',
        pricePerHour: 80,
        rating: 4.5,
        ownerId: 'owner1',
        owner: {} as any, // Will be populated when needed
        photos: [
          { id: '1', url: '/images/arena1-1.jpg', alt: 'Arena Central - Vista geral', isPrimary: true },
          { id: '2', url: '/images/arena1-2.jpg', alt: 'Arena Central - Vestiário', isPrimary: false }
        ],
        amenities: [
          { id: '1', name: 'Vestiário', icon: 'changing-room' },
          { id: '2', name: 'Estacionamento', icon: 'parking' },
          { id: '3', name: 'Iluminação', icon: 'lightbulb' },
          { id: '4', name: 'Chuveiro', icon: 'shower' }
        ],
        reviews: [
          {
            id: '1',
            userId: 'user1',
            userName: 'João Silva',
            rating: 5,
            comment: 'Excelente quadra, muito bem cuidada!',
            createdAt: new Date('2024-01-15')
          },
          {
            id: '2',
            userId: 'user2',
            userName: 'Maria Santos',
            rating: 4,
            comment: 'Boa estrutura, recomendo!',
            createdAt: new Date('2024-01-10')
          }
        ],
        rules: [
          'Uso obrigatório de chuteira ou tênis',
          'Proibido fumar nas dependências',
          'Respeitar horário de início e fim',
          'Manter a quadra limpa'
        ],
        contactInfo: {
          phone: '(88) 99999-1111',
          whatsapp: '(88) 99999-1111',
          email: 'contato@arenacentral.com'
        },
        coordinates: {
          lat: -3.6958,
          lng: -40.3492
        },
        timeSlots: [
          { id: 'ts1', fieldId: '1', dayOfWeek: 1, startTime: '08:00', endTime: '09:00', price: 80, available: true, field: {} as any },
          { id: 'ts2', fieldId: '1', dayOfWeek: 1, startTime: '09:00', endTime: '10:00', price: 80, available: true, field: {} as any },
          { id: 'ts3', fieldId: '1', dayOfWeek: 1, startTime: '18:00', endTime: '19:00', price: 100, available: true, field: {} as any },
          { id: 'ts4', fieldId: '1', dayOfWeek: 1, startTime: '19:00', endTime: '20:00', price: 100, available: true, field: {} as any }
        ],
        bookings: []
      },
      {
        id: '2',
        name: 'Arena do Bairro',
        location: 'Dom Expedito, Sobral',
        address: 'Av. Dom Expedito, 456 - Dom Expedito, Sobral - CE',
        description: 'Quadra de futsal coberta com piso oficial, perfeita para treinos e campeonatos. Ambiente climatizado e confortável.',
        fieldType: 'FUTSAL',
        pricePerHour: 60,
        rating: 4.2,
        ownerId: 'owner2',
        owner: {} as any,
        photos: [
          { id: '3', url: '/images/arena2-1.jpg', alt: 'Arena do Bairro - Quadra', isPrimary: true }
        ],
        amenities: [
          { id: '1', name: 'Vestiário', icon: 'changing-room' },
          { id: '5', name: 'Cobertura', icon: 'umbrella' },
          { id: '6', name: 'Arquibancada', icon: 'stadium' }
        ],
        reviews: [
          {
            id: '3',
            userId: 'user3',
            userName: 'Pedro Costa',
            rating: 4,
            comment: 'Boa quadra, preço justo.',
            createdAt: new Date('2024-01-12')
          }
        ],
        rules: [
          'Uso obrigatório de tênis de futsal',
          'Máximo 10 jogadores por time',
          'Proibido comer na quadra'
        ],
        contactInfo: {
          phone: '(88) 99999-2222',
          whatsapp: '(88) 99999-2222'
        },
        coordinates: {
          lat: -3.7058,
          lng: -40.3592
        },
        timeSlots: [
          { id: 'ts5', fieldId: '2', dayOfWeek: 1, startTime: '07:00', endTime: '08:00', price: 60, available: true, field: {} as any },
          { id: 'ts6', fieldId: '2', dayOfWeek: 1, startTime: '08:00', endTime: '09:00', price: 60, available: true, field: {} as any },
          { id: 'ts7', fieldId: '2', dayOfWeek: 1, startTime: '17:00', endTime: '18:00', price: 80, available: true, field: {} as any }
        ],
        bookings: []
      },
      {
        id: '3',
        name: 'Arena Premium',
        location: 'Cidade Dr. José Euclides, Sobral',
        address: 'Rua das Flores, 789 - Cidade Dr. José Euclides, Sobral - CE',
        description: 'Arena premium com estrutura completa, grama sintética importada e sistema de som profissional. A melhor experiência de jogo da cidade.',
        fieldType: 'SOCIETY',
        pricePerHour: 120,
        rating: 4.8,
        ownerId: 'owner3',
        owner: {} as any,
        photos: [
          { id: '4', url: '/images/arena3-1.jpg', alt: 'Arena Premium - Vista aérea', isPrimary: true },
          { id: '5', url: '/images/arena3-2.jpg', alt: 'Arena Premium - Vestiário premium', isPrimary: false },
          { id: '6', url: '/images/arena3-3.jpg', alt: 'Arena Premium - Área de descanso', isPrimary: false }
        ],
        amenities: [
          { id: '1', name: 'Vestiário', icon: 'changing-room' },
          { id: '2', name: 'Estacionamento', icon: 'parking' },
          { id: '3', name: 'Iluminação', icon: 'lightbulb' },
          { id: '4', name: 'Chuveiro', icon: 'shower' },
          { id: '7', name: 'Som Ambiente', icon: 'speaker' },
          { id: '8', name: 'Lanchonete', icon: 'coffee' },
          { id: '9', name: 'Wi-Fi', icon: 'wifi' }
        ],
        reviews: [
          {
            id: '4',
            userId: 'user4',
            userName: 'Carlos Oliveira',
            rating: 5,
            comment: 'Simplesmente perfeita! Vale cada centavo.',
            createdAt: new Date('2024-01-20')
          },
          {
            id: '5',
            userId: 'user5',
            userName: 'Ana Paula',
            rating: 5,
            comment: 'Estrutura incrível, super recomendo!',
            createdAt: new Date('2024-01-18')
          }
        ],
        rules: [
          'Uso obrigatório de chuteira society',
          'Proibido bebidas alcoólicas',
          'Respeitar outros usuários',
          'Cuidar do patrimônio'
        ],
        contactInfo: {
          phone: '(88) 99999-3333',
          whatsapp: '(88) 99999-3333',
          email: 'reservas@arenapremium.com'
        },
        coordinates: {
          lat: -3.6858,
          lng: -40.3392
        },
        timeSlots: [
          { id: 'ts8', fieldId: '3', dayOfWeek: 1, startTime: '06:00', endTime: '07:00', price: 120, available: true, field: {} as any },
          { id: 'ts9', fieldId: '3', dayOfWeek: 1, startTime: '07:00', endTime: '08:00', price: 120, available: true, field: {} as any },
          { id: 'ts10', fieldId: '3', dayOfWeek: 1, startTime: '18:00', endTime: '19:00', price: 150, available: true, field: {} as any },
          { id: 'ts11', fieldId: '3', dayOfWeek: 1, startTime: '19:00', endTime: '20:00', price: 150, available: true, field: {} as any },
          { id: 'ts12', fieldId: '3', dayOfWeek: 1, startTime: '20:00', endTime: '21:00', price: 150, available: true, field: {} as any }
        ],
        bookings: []
      }
    ]
  }
}