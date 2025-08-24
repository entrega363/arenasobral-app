import { render, screen, fireEvent } from '@testing-library/react'
import { FilterPanel } from '@/components/fields/FilterPanel'
import { FieldFilters } from '@/types'

describe('FilterPanel', () => {
  const mockOnFiltersChange = jest.fn()
  const mockOnClearFilters = jest.fn()
  const mockOnClose = jest.fn()

  const defaultProps = {
    filters: {} as FieldFilters,
    onFiltersChange: mockOnFiltersChange,
    onClearFilters: mockOnClearFilters,
    onClose: mockOnClose
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders filter panel correctly', () => {
    render(<FilterPanel {...defaultProps} />)

    expect(screen.getByText('Filtros')).toBeInTheDocument()
    expect(screen.getByText('Localização')).toBeInTheDocument()
    expect(screen.getByText('Faixa de Preço (por hora)')).toBeInTheDocument()
    expect(screen.getByText('Tipo de Quadra')).toBeInTheDocument()
    expect(screen.getByText('Horário Preferido')).toBeInTheDocument()
    expect(screen.getByText('Comodidades')).toBeInTheDocument()
  })

  it('handles location input change', () => {
    render(<FilterPanel {...defaultProps} />)

    const locationInput = screen.getByPlaceholderText('Digite o bairro ou região...')
    fireEvent.change(locationInput, { target: { value: 'Centro' } })

    expect(locationInput).toHaveValue('Centro')
  })

  it('handles price range changes', () => {
    render(<FilterPanel {...defaultProps} />)

    const minPriceInput = screen.getByPlaceholderText('R$ 0')
    const maxPriceInput = screen.getByPlaceholderText('R$ 200')

    fireEvent.change(minPriceInput, { target: { value: '50' } })
    fireEvent.change(maxPriceInput, { target: { value: '150' } })

    expect(minPriceInput).toHaveValue(50)
    expect(maxPriceInput).toHaveValue(150)
  })

  it('handles field type selection', () => {
    render(<FilterPanel {...defaultProps} />)

    const societyOption = screen.getByText('Society')
    fireEvent.click(societyOption)

    expect(societyOption.closest('label')).toHaveClass('border-blue-500')
  })

  it('handles amenity selection', () => {
    render(<FilterPanel {...defaultProps} />)

    const vestiarioOption = screen.getByText('Vestiário')
    fireEvent.click(vestiarioOption)

    expect(vestiarioOption.closest('label')).toHaveClass('border-blue-500')
  })

  it('handles time range changes', () => {
    render(<FilterPanel {...defaultProps} />)

    const startTimeInputs = screen.getAllByDisplayValue('')
    const startTimeInput = startTimeInputs.find(input => input.getAttribute('type') === 'time')
    
    if (startTimeInput) {
      fireEvent.change(startTimeInput, { target: { value: '08:00' } })
      expect(startTimeInput).toHaveValue('08:00')
    }
  })

  it('applies filters when apply button is clicked', () => {
    render(<FilterPanel {...defaultProps} />)

    const locationInput = screen.getByPlaceholderText('Digite o bairro ou região...')
    fireEvent.change(locationInput, { target: { value: 'Centro' } })

    const applyButton = screen.getByText('Aplicar Filtros')
    fireEvent.click(applyButton)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ location: 'Centro' })
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('clears filters when clear button is clicked', () => {
    const filtersWithData = { location: 'Centro', fieldType: 'SOCIETY' as const }
    render(<FilterPanel {...defaultProps} filters={filtersWithData} />)

    const clearButton = screen.getByText('Limpar Filtros')
    fireEvent.click(clearButton)

    expect(mockOnClearFilters).toHaveBeenCalled()
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('closes panel when X button is clicked', () => {
    render(<FilterPanel {...defaultProps} />)

    const closeButton = screen.getByRole('button', { name: '' }) // X button
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('disables clear button when no filters are active', () => {
    render(<FilterPanel {...defaultProps} />)

    const clearButton = screen.getByText('Limpar Filtros')
    expect(clearButton).toBeDisabled()
  })

  it('enables clear button when filters are active', () => {
    const filtersWithData = { location: 'Centro' }
    render(<FilterPanel {...defaultProps} filters={filtersWithData} />)

    const clearButton = screen.getByText('Limpar Filtros')
    expect(clearButton).not.toBeDisabled()
  })

  it('shows selected field type correctly', () => {
    const filtersWithFieldType = { fieldType: 'FUTSAL' as const }
    render(<FilterPanel {...defaultProps} filters={filtersWithFieldType} />)

    const futsalOption = screen.getByText('Futsal')
    expect(futsalOption.closest('label')).toHaveClass('border-blue-500')
  })

  it('shows selected amenities correctly', () => {
    const filtersWithAmenities = { amenities: ['1', '2'] }
    render(<FilterPanel {...defaultProps} filters={filtersWithAmenities} />)

    const vestiarioOption = screen.getByText('Vestiário')
    const estacionamentoOption = screen.getByText('Estacionamento')
    
    expect(vestiarioOption.closest('label')).toHaveClass('border-blue-500')
    expect(estacionamentoOption.closest('label')).toHaveClass('border-blue-500')
  })
})