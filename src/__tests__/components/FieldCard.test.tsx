import { render, screen, fireEvent } from '@testing-library/react'
import { FieldCard } from '@/components/fields/FieldCard'
import { Field } from '@/types'

// Mock do hook useResponsive
jest.mock('@/hooks/useResponsive', () => ({
  useResponsive: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  })
}))

const mockField: Field = {
  id: '1',
  name: 'Arena Central',
  location: 'Centro, Sobral, CE',
  pricePerHour: 50,
  fieldType: 'SOCIETY',
  rating: 4.5,
  photos: [
    {
      id: 'photo1',
      url: 'https://example.com/photo1.jpg',
      isPrimary: true,
      caption: 'Vista principal'
    }
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
      comment: 'Excelente campo!',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'review2',
      playerId: 'player2',
      playerName: 'Maria Santos',
      rating: 4,
      comment: 'Muito bom!',
      createdAt: new Date('2024-01-10')
    }
  ],
  ownerId: 'owner1'
}

describe('FieldCard', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar informações básicas do campo', () => {
    render(<FieldCard field={mockField} onClick={mockOnClick} />)
    
    expect(screen.getByText('Arena Central')).toBeInTheDocument()
    expect(screen.getByText('Centro, Sobral, CE')).toBeInTheDocument()
    expect(screen.getByText('R$ 50')).toBeInTheDocument()
    expect(screen.getByText('/hora')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('Society')).toBeInTheDocument()
  })

  it('deve exibir comodidades limitadas', () => {
    render(<FieldCard field={mockField} onClick={mockOnClick} />)
    
    // Deve mostrar apenas as primeiras 3 comodidades
    expect(screen.getByText('Vestiário')).toBeInTheDocument()
    expect(screen.getByText('Estacionamento')).toBeInTheDocument()
    expect(screen.getByText('Lanchonete')).toBeInTheDocument()
    expect(screen.getByText('+1 mais')).toBeInTheDocument()
  })

  it('deve exibir número de avaliações', () => {
    render(<FieldCard field={mockField} onClick={mockOnClick} />)
    
    expect(screen.getByText('2 avaliações')).toBeInTheDocument()
  })

  it('deve chamar onClick quando clicado', () => {
    render(<FieldCard field={mockField} onClick={mockOnClick} />)
    
    const card = screen.getByRole('button')
    fireEvent.click(card)
    
    expect(mockOnClick).toHaveBeenCalledWith('1')
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('deve formatar tipos de campo corretamente', () => {
    const fieldTypes = [
      { type: 'SOCIETY', expected: 'Society' },
      { type: 'FUTSAL', expected: 'Futsal' },
      { type: 'BEACH', expected: 'Beach Soccer' },
      { type: 'INDOOR', expected: 'Indoor' }
    ]

    fieldTypes.forEach(({ type, expected }) => {
      const field = { ...mockField, fieldType: type }
      const { rerender } = render(<FieldCard field={field} onClick={mockOnClick} />)
      
      expect(screen.getByText(expected)).toBeInTheDocument()
      
      rerender(<div />)
    })
  })

  it('deve exibir placeholder quando não há foto', () => {
    const fieldWithoutPhoto = {
      ...mockField,
      photos: []
    }
    
    render(<FieldCard field={fieldWithoutPhoto} onClick={mockOnClick} />)
    
    expect(screen.getByText('SEM FOTO')).toBeInTheDocument()
  })

  it('deve exibir "ARENA" quando há foto primária', () => {
    render(<FieldCard field={mockField} onClick={mockOnClick} />)
    
    expect(screen.getByText('ARENA')).toBeInTheDocument()
  })

  it('deve exibir texto singular para 1 avaliação', () => {
    const fieldWithOneReview = {
      ...mockField,
      reviews: [mockField.reviews[0]]
    }
    
    render(<FieldCard field={fieldWithOneReview} onClick={mockOnClick} />)
    
    expect(screen.getByText('1 avaliação')).toBeInTheDocument()
  })

  it('deve não exibir seção de avaliações quando não há avaliações', () => {
    const fieldWithoutReviews = {
      ...mockField,
      reviews: []
    }
    
    render(<FieldCard field={fieldWithoutReviews} onClick={mockOnClick} />)
    
    expect(screen.queryByText(/avaliação/)).not.toBeInTheDocument()
  })

  it('deve não exibir seção de comodidades quando não há comodidades', () => {
    const fieldWithoutAmenities = {
      ...mockField,
      amenities: []
    }
    
    render(<FieldCard field={fieldWithoutAmenities} onClick={mockOnClick} />)
    
    expect(screen.queryByText('Vestiário')).not.toBeInTheDocument()
  })
})

// Teste para versão mobile
describe('FieldCard - Mobile', () => {
  beforeEach(() => {
    // Mock para versão mobile
    jest.mocked(require('@/hooks/useResponsive').useResponsive).mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false
    })
  })

  it('deve aplicar estilos mobile corretamente', () => {
    render(<FieldCard field={mockField} onClick={jest.fn()} />)
    
    const card = screen.getByRole('button')
    expect(card).toHaveClass('active:scale-[0.98]')
  })
})