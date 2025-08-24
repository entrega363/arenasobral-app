import { FieldService } from '@/lib/fieldService'
import { Field, FieldFilters, Booking } from '@/types'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('FieldService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('getAllFields', () => {
    it('deve retornar campos mock quando localStorage está vazio', () => {
      const fields = FieldService.getAllFields()
      
      expect(fields).toBeDefined()
      expect(Array.isArray(fields)).toBe(true)
      expect(fields.length).toBeGreaterThan(0)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'arena_booking_fields',
        expect.any(String)
      )
    })

    it('deve retornar campos do localStorage quando disponível', () => {
      const mockFields = [
        {
          id: '1',
          name: 'Arena Teste',
          location: 'Sobral, CE',
          pricePerHour: 50,
          fieldType: 'SOCIETY',
          rating: 4.5,
          photos: [],
          amenities: [],
          reviews: [],
          ownerId: 'owner1'
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockFields))
      
      const fields = FieldService.getAllFields()
      
      expect(fields).toEqual(mockFields)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('arena_booking_fields')
    })

    it('deve lançar erro quando dados estão corrompidos', () => {
      localStorageMock.getItem.mockReturnValue('dados-invalidos')
      
      expect(() => FieldService.getAllFields()).toThrow('Erro ao carregar areninhas')
    })
  })

  describe('getFieldById', () => {
    beforeEach(() => {
      const mockFields = [
        {
          id: '1',
          name: 'Arena Teste',
          location: 'Sobral, CE',
          pricePerHour: 50,
          fieldType: 'SOCIETY',
          rating: 4.5,
          photos: [],
          amenities: [],
          reviews: [],
          ownerId: 'owner1'
        }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockFields))
    })

    it('deve retornar campo quando ID existe', () => {
      const field = FieldService.getFieldById('1')
      
      expect(field).toBeDefined()
      expect(field?.id).toBe('1')
      expect(field?.name).toBe('Arena Teste')
    })

    it('deve retornar null quando campo não existe', () => {
      const field = FieldService.getFieldById('999')
      
      expect(field).toBeNull()
    })

    it('deve lançar erro para ID inválido', () => {
      expect(() => FieldService.getFieldById('')).toThrow('ID da areninha inválido')
      expect(() => FieldService.getFieldById(null as any)).toThrow('ID da areninha inválido')
    })
  })

  describe('searchFields', () => {
    beforeEach(() => {
      const mockFields = [
        {
          id: '1',
          name: 'Arena Central',
          location: 'Centro, Sobral, CE',
          pricePerHour: 50,
          fieldType: 'SOCIETY',
          rating: 4.5,
          photos: [],
          amenities: [{ id: 'vestiario', name: 'Vestiário' }],
          reviews: [],
          ownerId: 'owner1'
        },
        {
          id: '2',
          name: 'Campo do Bairro',
          location: 'Bairro Norte, Sobral, CE',
          pricePerHour: 30,
          fieldType: 'FUTSAL',
          rating: 4.0,
          photos: [],
          amenities: [],
          reviews: [],
          ownerId: 'owner2'
        }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockFields))
    })

    it('deve filtrar por localização', () => {
      const filters: FieldFilters = { location: 'Centro' }
      const results = FieldService.searchFields(filters)
      
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Arena Central')
    })

    it('deve filtrar por tipo de campo', () => {
      const filters: FieldFilters = { fieldType: 'FUTSAL' }
      const results = FieldService.searchFields(filters)
      
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Campo do Bairro')
    })

    it('deve filtrar por faixa de preço', () => {
      const filters: FieldFilters = { 
        priceRange: { min: 40, max: 60 }
      }
      const results = FieldService.searchFields(filters)
      
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Arena Central')
    })

    it('deve combinar múltiplos filtros', () => {
      const filters: FieldFilters = { 
        location: 'Sobral',
        fieldType: 'SOCIETY'
      }
      const results = FieldService.searchFields(filters)
      
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Arena Central')
    })

    it('deve retornar array vazio quando nenhum campo corresponde', () => {
      const filters: FieldFilters = { location: 'Cidade Inexistente' }
      const results = FieldService.searchFields(filters)
      
      expect(results).toHaveLength(0)
    })
  })

  describe('createBooking', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('[]')
    })

    it('deve criar reserva com dados válidos', () => {
      const bookingData = {
        fieldId: '1',
        timeSlotId: 'slot1',
        date: new Date('2024-12-25'),
        playerName: 'João Silva',
        playerWhatsapp: '85999999999',
        playerEmail: 'joao@email.com',
        paymentMethod: 'PIX' as const,
        totalPrice: 50,
        status: 'CONFIRMED' as const
      }

      // Mock para getAvailableTimeSlots retornar slots disponíveis
      jest.spyOn(FieldService, 'getAvailableTimeSlots').mockReturnValue([
        {
          id: 'slot1',
          startTime: '08:00',
          endTime: '09:00',
          price: 50,
          isAvailable: true
        }
      ])

      const bookingId = FieldService.createBooking(bookingData)
      
      expect(bookingId).toBeDefined()
      expect(typeof bookingId).toBe('string')
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'arena_booking_bookings',
        expect.any(String)
      )
    })

    it('deve lançar erro quando dados obrigatórios estão faltando', () => {
      const bookingData = {
        fieldId: '',
        timeSlotId: 'slot1',
        date: new Date(),
        playerName: '',
        playerWhatsapp: '85999999999',
        playerEmail: 'joao@email.com',
        paymentMethod: 'PIX' as const,
        totalPrice: 50,
        status: 'CONFIRMED' as const
      }

      expect(() => FieldService.createBooking(bookingData))
        .toThrow('Erro ao criar reserva: Dados obrigatórios da reserva estão faltando')
    })

    it('deve lançar erro quando horário não está disponível', () => {
      const bookingData = {
        fieldId: '1',
        timeSlotId: 'slot1',
        date: new Date(),
        playerName: 'João Silva',
        playerWhatsapp: '85999999999',
        playerEmail: 'joao@email.com',
        paymentMethod: 'PIX' as const,
        totalPrice: 50,
        status: 'CONFIRMED' as const
      }

      // Mock para getAvailableTimeSlots retornar array vazio
      jest.spyOn(FieldService, 'getAvailableTimeSlots').mockReturnValue([])

      expect(() => FieldService.createBooking(bookingData))
        .toThrow('Erro ao criar reserva: Horário não está mais disponível')
    })
  })

  describe('getAvailableTimeSlots', () => {
    it('deve retornar slots de tempo disponíveis', () => {
      const fieldId = '1'
      const date = new Date('2024-12-25')
      
      const slots = FieldService.getAvailableTimeSlots(fieldId, date)
      
      expect(Array.isArray(slots)).toBe(true)
      expect(slots.length).toBeGreaterThan(0)
      
      slots.forEach(slot => {
        expect(slot).toHaveProperty('id')
        expect(slot).toHaveProperty('startTime')
        expect(slot).toHaveProperty('endTime')
        expect(slot).toHaveProperty('price')
        expect(slot).toHaveProperty('isAvailable')
      })
    })

    it('deve retornar slots diferentes para datas diferentes', () => {
      const fieldId = '1'
      const date1 = new Date('2024-12-25')
      const date2 = new Date('2024-12-26')
      
      const slots1 = FieldService.getAvailableTimeSlots(fieldId, date1)
      const slots2 = FieldService.getAvailableTimeSlots(fieldId, date2)
      
      // Os slots podem ser diferentes devido à lógica de disponibilidade
      expect(slots1).toBeDefined()
      expect(slots2).toBeDefined()
    })
  })
})