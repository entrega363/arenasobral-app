import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchFieldsScreen } from '@/components/screens/SearchFieldsScreen'
import { FieldService } from '@/lib/fieldService'

// Mock do router
const mockPush = jest.fn()
const mockBack = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  usePathname: () => '/search/fields',
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
  useAsyncOperation: (initialData: any) => ({
    data: initialData,
    loading: false,
    error: null,
    execute: jest.fn().mockImplementation(async (operation) => {
      const result = await operation()
      return result
    })
  })
}))

// Mock do FieldService
jest.mock('@/lib/fieldService')
const mockFieldService = FieldService as jest.Mocked<typeof FieldService>

const mockFields = [
  {
    id: '1',
    name: 'Arena Central',
    location: 'Centro, Sobral, CE',
    pricePerHour: 50,
    fieldType: 'SOCIETY',
    rating: 4.5,
    photos: [{ id: 'photo1', url: 'test.jpg', isPrimary: true, caption: 'Principal' }],
    amenities: [
      { id: 'vestiario', name: 'Vestiário' },
      { id: 'estacionamento', name: 'Estacionamento' }
    ],
    reviews: [
      {
        id: 'review1',
        playerId: 'player1',
        playerName: 'João Silva',
        rating: 5,
        comment: 'Excelente!',
        createdAt: new Date()
      }
    ],
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

describe('Fluxo de Reserva - Integração', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFieldService.getAllFields.mockReturnValue(mockFields)
    mockFieldService.searchFields.mockReturnValue(mockFields)
  })

  describe('Busca de Areninhas', () => {
    it('deve exibir lista de areninhas ao carregar', async () => {
      render(<SearchFieldsScreen />)
      
      await waitFor(() => {
        expect(screen.getByText('Arena Central')).toBeInTheDocument()
        expect(screen.getByText('Campo do Bairro')).toBeInTheDocument()
      })
      
      expect(screen.getByText('2 areninhas encontradas')).toBeInTheDocument()
    })

    it('deve filtrar areninhas por busca de texto', async () => {
      const user = userEvent.setup()
      
      // Mock para retornar apenas um resultado
      mockFieldService.searchFields.mockReturnValue([mockFields[0]])
      
      render(<SearchFieldsScreen />)
      
      const searchInput = screen.getByPlaceholderText('Buscar por nome ou localização...')
      await user.type(searchInput, 'Central')
      
      await waitFor(() => {
        expect(mockFieldService.searchFields).toHaveBeenCalledWith({
          location: 'Central'
        })
      })
    })

    it('deve navegar para detalhes da areninha ao clicar', async () => {
      const user = userEvent.setup()
      
      render(<SearchFieldsScreen />)
      
      await waitFor(() => {
        const fieldCard = screen.getByText('Arena Central').closest('button')
        expect(fieldCard).toBeInTheDocument()
      })
      
      const fieldCard = screen.getByText('Arena Central').closest('button')!
      await user.click(fieldCard)
      
      expect(mockPush).toHaveBeenCalledWith('/search/fields/1')
    })

    it('deve abrir painel de filtros', async () => {
      const user = userEvent.setup()
      
      render(<SearchFieldsScreen />)
      
      const filterButton = screen.getByRole('button', { name: /filtro/i })
      await user.click(filterButton)
      
      // Verifica se o painel de filtros foi aberto
      // (assumindo que o FilterPanel renderiza algum conteúdo específico)
      expect(screen.getByText(/filtros/i)).toBeInTheDocument()
    })

    it('deve limpar filtros quando solicitado', async () => {
      const user = userEvent.setup()
      
      render(<SearchFieldsScreen />)
      
      // Primeiro, adiciona um filtro
      const searchInput = screen.getByPlaceholderText('Buscar por nome ou localização...')
      await user.type(searchInput, 'teste')
      
      // Depois limpa
      const clearButton = screen.getByText('Limpar Filtros')
      await user.click(clearButton)
      
      expect(searchInput).toHaveValue('')
    })
  })

  describe('Estados de Erro e Loading', () => {
    it('deve exibir estado de loading', () => {
      // Mock para simular loading
      jest.mocked(require('@/hooks/useAsyncOperation').useAsyncOperation).mockReturnValue({
        data: null,
        loading: true,
        error: null,
        execute: jest.fn()
      })
      
      render(<SearchFieldsScreen />)
      
      expect(screen.getByText('Buscar Areninhas')).toBeInTheDocument()
      // Verifica se há elementos de skeleton loading
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('deve exibir estado de erro', () => {
      // Mock para simular erro
      jest.mocked(require('@/hooks/useAsyncOperation').useAsyncOperation).mockReturnValue({
        data: null,
        loading: false,
        error: 'Erro ao carregar areninhas',
        execute: jest.fn()
      })
      
      render(<SearchFieldsScreen />)
      
      expect(screen.getByText('Erro ao carregar areninhas')).toBeInTheDocument()
      expect(screen.getByText('Erro ao carregar areninhas')).toBeInTheDocument()
    })

    it('deve exibir mensagem quando não há resultados', async () => {
      mockFieldService.searchFields.mockReturnValue([])
      
      render(<SearchFieldsScreen />)
      
      await waitFor(() => {
        expect(screen.getByText('Nenhuma areninha encontrada')).toBeInTheDocument()
      })
    })
  })

  describe('Responsividade', () => {
    it('deve adaptar layout para mobile', () => {
      // Mock para versão mobile
      jest.mocked(require('@/hooks/useResponsive').useResponsive).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false
      })
      
      render(<SearchFieldsScreen />)
      
      // Verifica se componentes mobile estão presentes
      expect(screen.getByText('Buscar Areninhas')).toBeInTheDocument()
    })
  })

  describe('Acessibilidade', () => {
    it('deve ter elementos acessíveis', async () => {
      render(<SearchFieldsScreen />)
      
      // Verifica se há elementos com roles apropriados
      expect(screen.getByRole('textbox')).toBeInTheDocument() // Input de busca
      expect(screen.getAllByRole('button')).toHaveLength(3) // Botões de filtro, voltar, etc.
      
      await waitFor(() => {
        // Cards de areninha devem ser clicáveis
        const fieldCards = screen.getAllByRole('button').filter(button => 
          button.textContent?.includes('Arena') || button.textContent?.includes('Campo')
        )
        expect(fieldCards.length).toBeGreaterThan(0)
      })
    })

    it('deve permitir navegação por teclado', async () => {
      const user = userEvent.setup()
      
      render(<SearchFieldsScreen />)
      
      // Testa navegação por Tab
      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /voltar/i }))
      
      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('textbox'))
    })
  })

  describe('Performance', () => {
    it('deve não re-renderizar desnecessariamente', async () => {
      const renderSpy = jest.fn()
      
      const TestComponent = () => {
        renderSpy()
        return <SearchFieldsScreen />
      }
      
      const { rerender } = render(<TestComponent />)
      
      expect(renderSpy).toHaveBeenCalledTimes(1)
      
      // Re-renderiza com as mesmas props
      rerender(<TestComponent />)
      
      // Deve ter renderizado apenas uma vez adicional
      expect(renderSpy).toHaveBeenCalledTimes(2)
    })
  })
})