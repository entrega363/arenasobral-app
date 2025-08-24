import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldService } from '@/lib/fieldService'

// Mock completo do sistema para teste end-to-end
const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  pathname: '/search/fields'
}

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockRouter.pathname,
}))

// Mock dos hooks
jest.mock('@/hooks/useResponsive', () => ({
  useResponsive: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  })
}))

jest.mock('@/hooks/useAsyncOperation', () => ({
  useAsyncOperation: (initialData: any) => {
    const [data, setData] = require('react').useState(initialData)
    const [loading, setLoading] = require('react').useState(false)
    const [error, setError] = require('react').useState(null)
    
    const execute = async (operation: () => Promise<any>) => {
      try {
        setLoading(true)
        setError(null)
        const result = await operation()
        setData(result)
        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro inesperado'
        setError(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    }
    
    return { data, loading, error, execute }
  }
}))

// Mock do FieldService
jest.mock('@/lib/fieldService')
const mockFieldService = FieldService as jest.Mocked<typeof FieldService>

// Dados mock completos
const mockFields = [
  {
    id: '1',
    name: 'Arena Central Premium',
    location: 'Centro, Sobral, CE',
    pricePerHour: 80,
    fieldType: 'SOCIETY',
    rating: 4.8,
    photos: [
      { id: 'photo1', url: 'arena1.jpg', isPrimary: true, caption: 'Vista principal' }
    ],
    amenities: [
      { id: 'vestiario', name: 'Vestiário' },
      { id: 'estacionamento', name: 'Estacionamento' },
      { id: 'lanchonete', name: 'Lanchonete' },
      { id: 'chuveiro', name: 'Chuveiro' }
    ],
    reviews: [
      {
        id: 'review1',
        playerId: 'player1',
        playerName: 'João Silva',
        rating: 5,
        comment: 'Excelente estrutura!',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'review2',
        playerId: 'player2',
        playerName: 'Maria Santos',
        rating: 4,
        comment: 'Muito boa!',
        createdAt: new Date('2024-01-10')
      }
    ],
    ownerId: 'owner1'
  },
  {
    id: '2',
    name: 'Campo do Bairro',
    location: 'Bairro Norte, Sobral, CE',
    pricePerHour: 40,
    fieldType: 'FUTSAL',
    rating: 4.2,
    photos: [],
    amenities: [
      { id: 'vestiario', name: 'Vestiário' }
    ],
    reviews: [],
    ownerId: 'owner2'
  }
]

const mockTimeSlots = [
  {
    id: 'slot1',
    startTime: '08:00:00',
    endTime: '09:00:00',
    price: 80,
    isAvailable: true
  },
  {
    id: 'slot2',
    startTime: '09:00:00',
    endTime: '10:00:00',
    price: 80,
    isAvailable: true
  },
  {
    id: 'slot3',
    startTime: '10:00:00',
    endTime: '11:00:00',
    price: 80,
    isAvailable: false
  }
]

describe('Jornada Completa do Usuário', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFieldService.getAllFields.mockReturnValue(mockFields)
    mockFieldService.searchFields.mockReturnValue(mockFields)
    mockFieldService.getFieldById.mockReturnValue(mockFields[0])
    mockFieldService.getAvailableTimeSlots.mockReturnValue(mockTimeSlots)
    mockFieldService.createBooking.mockReturnValue('booking123')
  })

  it('deve completar jornada: busca → seleção → reserva → confirmação', async () => {
    const user = userEvent.setup()
    
    // === ETAPA 1: Busca de Areninhas ===
    const { SearchFieldsScreen } = await import('@/components/screens/SearchFieldsScreen')
    const { rerender } = render(<SearchFieldsScreen />)
    
    // Verifica se areninhas são carregadas
    await waitFor(() => {
      expect(screen.getByText('Arena Central Premium')).toBeInTheDocument()
      expect(screen.getByText('Campo do Bairro')).toBeInTheDocument()
    })
    
    // Testa busca por texto
    const searchInput = screen.getByPlaceholderText('Buscar por nome ou localização...')
    await user.type(searchInput, 'Central')
    
    // Simula filtro retornando apenas Arena Central
    mockFieldService.searchFields.mockReturnValue([mockFields[0]])
    
    await waitFor(() => {
      expect(mockFieldService.searchFields).toHaveBeenCalledWith({
        location: 'Central'
      })
    })
    
    // === ETAPA 2: Seleção da Areninha ===
    const fieldCard = screen.getByText('Arena Central Premium').closest('button')!
    await user.click(fieldCard)
    
    expect(mockRouter.push).toHaveBeenCalledWith('/search/fields/1')
    
    // === ETAPA 3: Simulação da Página de Detalhes ===
    // (Aqui simularíamos a navegação para a página de detalhes)
    mockRouter.pathname = '/search/fields/1'
    
    // === ETAPA 4: Seleção de Horário ===
    const { BookingCalendar } = await import('@/components/fields/BookingCalendar')
    const mockOnTimeSlotSelect = jest.fn()
    
    rerender(
      <BookingCalendar
        field={mockFields[0]}
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    )
    
    // Seleciona uma data futura
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const dayButton = screen.getByText(tomorrow.getDate().toString())
    await user.click(dayButton)
    
    // Aguarda carregamento dos horários
    await waitFor(() => {
      expect(screen.getByText('08:00 - 09:00')).toBeInTheDocument()
    })
    
    // Seleciona um horário
    const timeSlotButton = screen.getByText('08:00 - 09:00').closest('button')!
    await user.click(timeSlotButton)
    
    expect(mockOnTimeSlotSelect).toHaveBeenCalledWith(
      expect.any(Date),
      mockTimeSlots[0]
    )
    
    // === ETAPA 5: Modal de Reserva ===
    const { BookingModal } = await import('@/components/fields/BookingModal')
    const mockOnConfirm = jest.fn()
    const mockOnClose = jest.fn()
    
    rerender(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        field={mockFields[0]}
        selectedDate={tomorrow}
        selectedTimeSlot={mockTimeSlots[0]}
        onConfirm={mockOnConfirm}
      />
    )
    
    // Verifica informações da reserva
    expect(screen.getByText('Arena Central Premium')).toBeInTheDocument()
    expect(screen.getByText('R$ 80')).toBeInTheDocument()
    
    // Preenche formulário
    await user.type(screen.getByLabelText(/nome completo/i), 'João Silva')
    await user.type(screen.getByLabelText(/whatsapp/i), '85999999999')
    await user.type(screen.getByLabelText(/email/i), 'joao@email.com')
    
    // Confirma reserva
    const confirmButton = screen.getByRole('button', { name: /confirmar reserva/i })
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith({
        fieldId: '1',
        timeSlotId: 'slot1',
        date: tomorrow,
        playerName: 'João Silva',
        playerWhatsapp: '85999999999',
        playerEmail: 'joao@email.com',
        notes: '',
        paymentMethod: 'PIX',
        totalPrice: 80,
        status: 'CONFIRMED'
      })
    })
  })

  it('deve lidar com erros durante a jornada', async () => {
    const user = userEvent.setup()
    
    // Simula erro no carregamento
    mockFieldService.getAllFields.mockImplementation(() => {
      throw new Error('Erro de conexão')
    })
    
    // Mock para simular erro no hook
    jest.mocked(require('@/hooks/useAsyncOperation').useAsyncOperation).mockReturnValue({
      data: null,
      loading: false,
      error: 'Erro ao carregar areninhas',
      execute: jest.fn()
    })
    
    const { SearchFieldsScreen } = await import('@/components/screens/SearchFieldsScreen')
    render(<SearchFieldsScreen />)
    
    // Verifica se erro é exibido
    expect(screen.getByText('Erro ao carregar areninhas')).toBeInTheDocument()
    
    // Verifica se botão de retry está presente
    const retryButton = screen.getByText('Tentar Novamente')
    expect(retryButton).toBeInTheDocument()
  })

  it('deve validar dados durante reserva', async () => {
    const user = userEvent.setup()
    
    const { BookingModal } = await import('@/components/fields/BookingModal')
    const mockOnConfirm = jest.fn()
    
    render(
      <BookingModal
        isOpen={true}
        onClose={jest.fn()}
        field={mockFields[0]}
        selectedDate={new Date()}
        selectedTimeSlot={mockTimeSlots[0]}
        onConfirm={mockOnConfirm}
      />
    )
    
    // Tenta confirmar sem preencher dados
    const confirmButton = screen.getByRole('button', { name: /confirmar reserva/i })
    await user.click(confirmButton)
    
    // Verifica se validações aparecem
    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
      expect(screen.getByText('WhatsApp é obrigatório')).toBeInTheDocument()
    })
    
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })

  it('deve funcionar em dispositivos móveis', async () => {
    // Mock para mobile
    jest.mocked(require('@/hooks/useResponsive').useResponsive).mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false
    })
    
    const { SearchFieldsScreen } = await import('@/components/screens/SearchFieldsScreen')
    render(<SearchFieldsScreen />)
    
    // Verifica se layout mobile é aplicado
    expect(screen.getByText('Buscar Areninhas')).toBeInTheDocument()
    
    // Verifica se componentes mobile estão presentes
    const searchInput = screen.getByPlaceholderText('Buscar por nome ou localização...')
    expect(searchInput).toBeInTheDocument()
  })

  it('deve manter estado durante navegação', async () => {
    const user = userEvent.setup()
    
    const { SearchFieldsScreen } = await import('@/components/screens/SearchFieldsScreen')
    render(<SearchFieldsScreen />)
    
    // Aplica filtro
    const searchInput = screen.getByPlaceholderText('Buscar por nome ou localização...')
    await user.type(searchInput, 'Premium')
    
    // Simula navegação e volta
    mockRouter.pathname = '/search/fields/1'
    mockRouter.pathname = '/search/fields'
    
    // Verifica se filtro foi mantido
    expect(searchInput).toHaveValue('Premium')
  })

  it('deve ser acessível via teclado', async () => {
    const user = userEvent.setup()
    
    const { SearchFieldsScreen } = await import('@/components/screens/SearchFieldsScreen')
    render(<SearchFieldsScreen />)
    
    await waitFor(() => {
      expect(screen.getByText('Arena Central Premium')).toBeInTheDocument()
    })
    
    // Navega por Tab
    await user.tab() // Botão voltar
    await user.tab() // Input de busca
    await user.tab() // Botão filtro
    await user.tab() // Primeiro card de areninha
    
    // Verifica se card está focado
    const firstCard = screen.getByText('Arena Central Premium').closest('button')
    expect(document.activeElement).toBe(firstCard)
    
    // Ativa com Enter
    await user.keyboard('{Enter}')
    expect(mockRouter.push).toHaveBeenCalledWith('/search/fields/1')
  })

  it('deve otimizar performance com muitas areninhas', async () => {
    // Simula muitas areninhas
    const manyFields = Array.from({ length: 100 }, (_, i) => ({
      ...mockFields[0],
      id: `field-${i}`,
      name: `Arena ${i}`,
    }))
    
    mockFieldService.getAllFields.mockReturnValue(manyFields)
    mockFieldService.searchFields.mockReturnValue(manyFields)
    
    const startTime = performance.now()
    
    const { SearchFieldsScreen } = await import('@/components/screens/SearchFieldsScreen')
    render(<SearchFieldsScreen />)
    
    await waitFor(() => {
      expect(screen.getByText('Arena 0')).toBeInTheDocument()
    })
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // Verifica se renderização foi rápida (menos de 1 segundo)
    expect(renderTime).toBeLessThan(1000)
  })
})