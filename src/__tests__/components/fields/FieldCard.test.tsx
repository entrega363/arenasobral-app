import { render, screen, fireEvent } from '@testing-library/react'
import { FieldCard } from '@/components/fields/FieldCard'
import { Field } from '@/types'

// Mock field data for testing
const mockField: Field = {
  id: '1',
  name: 'Arena Test',
  location: 'Centro, Sobral',
  address: 'Rua Test, 123',
  description: 'Test arena description',
  fieldType: 'SOCIETY',
  pricePerHour: 80,
  rating: 4.5,
  ownerId: 'owner1',
  owner: {} as any,
  photos: [
    { id: '1', url: '/test.jpg', alt: 'Test arena', isPrimary: true }
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
      userName: 'Test User',
      rating: 5,
      comment: 'Great arena!',
      createdAt: new Date()
    }
  ],
  rules: ['Test rule'],
  contactInfo: {
    phone: '(88) 99999-1111',
    whatsapp: '(88) 99999-1111'
  },
  timeSlots: [],
  bookings: []
}

describe('FieldCard', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    mockOnClick.mockClear()
  })

  it('renders field information correctly', () => {
    render(<FieldCard field={mockField} onClick={mockOnClick} />)

    expect(screen.getByText('Arena Test')).toBeInTheDocument()
    expect(screen.getByText('Centro, Sobral')).toBeInTheDocument()
    expect(screen.getByText('R$ 80')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('Society')).toBeInTheDocument()
  })

  it('displays amenities correctly', () => {
    render(<FieldCard field={mockField} onClick={mockOnClick} />)

    expect(screen.getByText('Vestiário')).toBeInTheDocument()
    expect(screen.getByText('Estacionamento')).toBeInTheDocument()
    expect(screen.getByText('Iluminação')).toBeInTheDocument()
    expect(screen.getByText('+1 mais')).toBeInTheDocument()
  })

  it('shows reviews count', () => {
    render(<FieldCard field={mockField} onClick={mockOnClick} />)

    expect(screen.getByText('1 avaliação')).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', () => {
    render(<FieldCard field={mockField} onClick={mockOnClick} />)

    const card = screen.getByRole('button', { name: /arena test/i })
    fireEvent.click(card)

    expect(mockOnClick).toHaveBeenCalledWith('1')
  })

  it('handles field without photos', () => {
    const fieldWithoutPhotos = { ...mockField, photos: [] }
    render(<FieldCard field={fieldWithoutPhotos} onClick={mockOnClick} />)

    expect(screen.getByText('SEM FOTO')).toBeInTheDocument()
  })

  it('handles field with no amenities', () => {
    const fieldWithoutAmenities = { ...mockField, amenities: [] }
    render(<FieldCard field={fieldWithoutAmenities} onClick={mockOnClick} />)

    expect(screen.queryByText('Vestiário')).not.toBeInTheDocument()
  })

  it('handles field with no reviews', () => {
    const fieldWithoutReviews = { ...mockField, reviews: [] }
    render(<FieldCard field={fieldWithoutReviews} onClick={mockOnClick} />)

    expect(screen.queryByText(/avaliação/)).not.toBeInTheDocument()
  })

  it('formats different field types correctly', () => {
    const futsalField = { ...mockField, fieldType: 'FUTSAL' as const }
    const { rerender } = render(<FieldCard field={futsalField} onClick={mockOnClick} />)
    expect(screen.getByText('Futsal')).toBeInTheDocument()

    const beachField = { ...mockField, fieldType: 'BEACH' as const }
    rerender(<FieldCard field={beachField} onClick={mockOnClick} />)
    expect(screen.getByText('Beach Soccer')).toBeInTheDocument()

    const indoorField = { ...mockField, fieldType: 'INDOOR' as const }
    rerender(<FieldCard field={indoorField} onClick={mockOnClick} />)
    expect(screen.getByText('Indoor')).toBeInTheDocument()
  })
})