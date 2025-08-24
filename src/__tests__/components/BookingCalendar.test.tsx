import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BookingCalendar } from '@/components/fields/BookingCalendar'
import { FieldService } from '@/lib/fieldService'
import { Field, TimeSlot } from '@/types'

// Mock dos hooks
jest.mock('@/hooks/useResponsive', () => ({
  useResponsive: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  })
}))

jest.mock('@/hooks/useSwipeGesture', () => ({
  useSwipeGesture: () => ({ current: null })
}))

// Mock do FieldService
jest.mock('@/lib/fieldService')
const mockFieldService = FieldService as jest.Mocked<typeof FieldService>

const mockField: Field = {
  id: '1',
  name: 'Arena Central',
  location: 'Centro, Sobral, CE',
  pricePerHour: 50,
  fieldType: 'SOCIETY',
  rating: 4.5,
  photos: [],
  amenities: [],
  reviews: [],
  ownerId: 'owner1'
}

const mockTimeSlots: TimeSlot[] = [
  {
    id: 'slot1',
    startTime: '08:00:00',
    endTime: '09:00:00',
    price: 50,
    isAvailable: true
  },
  {
    id: 'slot2',
    startTime: '09:00:00',
    endTime: '10:00:00',
    price: 50,
    isAvailable: true
  },
  {
    id: 'slot3',
    startTime: '10:00:00',
    endTime: '11:00:00',
    price: 60,
    isAvailable: false
  }
]

describe('BookingCalendar', () => {
  const mockOnTimeSlotSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockFieldService.getAvailableTimeSlots.mockReturnValue(mockTimeSlots)
  })

  it('deve renderizar calendário com mês atual', () => {
    render(
      <BookingCalendar 
        field={mockField} 
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    )
    
    expect(screen.getByText('Selecionar Data')).toBeInTheDocument()
    
    // Verifica se os dias da semana estão presentes
    expect(screen.getByText('Dom')).toBeInTheDocument()
    expect(screen.getByText('Seg')).toBeInTheDocument()
    expect(screen.getByText('Ter')).toBeInTheDocument()
    expect(screen.getByText('Qua')).toBeInTheDocument()
    expect(screen.getByText('Qui')).toBeInTheDocument()
    expect(screen.getByText('Sex')).toBeInTheDocument()
    expect(screen.getByText('Sáb')).toBeInTheDocument()
  })

  it('deve renderizar horários disponíveis', async () => {
    render(
      <BookingCalendar 
        field={mockField} 
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    )
    
    expect(screen.getByText('Horários Disponíveis')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('08:00 - 09:00')).toBeInTheDocument()
      expect(screen.getByText('09:00 - 10:00')).toBeInTheDocument()
      expect(screen.getByText('R$ 50')).toBeInTheDocument()
    })
  })

  it('deve navegar entre meses', () => {
    render(
      <BookingCalendar 
        field={mockField} 
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    )
    
    const nextButton = screen.getByRole('button', { name: /próximo/i })
    const prevButton = screen.getByRole('button', { name: /anterior/i })
    
    expect(nextButton).toBeInTheDocument()
    expect(prevButton).toBeInTheDocument()
    
    fireEvent.click(nextButton)
    fireEvent.click(prevButton)
  })

  it('deve selecionar data quando clicada', async () => {
    render(
      <BookingCalendar 
        field={mockField} 
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    )
    
    // Encontra um dia disponível (não no passado)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    const dayButton = screen.getByText(tomorrow.getDate().toString())
    fireEvent.click(dayButton)
    
    await waitFor(() => {
      expect(mockFieldService.getAvailableTimeSlots).toHaveBeenCalled()
    })
  })

  it('deve selecionar horário quando clicado', async () => {
    render(
      <BookingCalendar 
        field={mockField} 
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    )
    
    await waitFor(() => {
      const timeSlotButton = screen.getByText('08:00 - 09:00')
      fireEvent.click(timeSlotButton.closest('button')!)
    })
    
    expect(mockOnTimeSlotSelect).toHaveBeenCalledWith(
      expect.any(Date),
      mockTimeSlots[0]
    )
  })

  it('deve exibir estado de loading', () => {
    // Mock para simular loading
    mockFieldService.getAvailableTimeSlots.mockImplementation(() => {
      // Simula delay
      return []
    })
    
    render(
      <BookingCalendar 
        field={mockField} 
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    )
    
    // O loading spinner deve aparecer inicialmente
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
  })

  it('deve exibir mensagem quando não há horários disponíveis', async () => {
    mockFieldService.getAvailableTimeSlots.mockReturnValue([])
    
    render(
      <BookingCalendar 
        field={mockField} 
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('Nenhum horário disponível')).toBeInTheDocument()
      expect(screen.getByText('Tente selecionar outra data')).toBeInTheDocument()
    })
  })

  it('deve desabilitar datas no passado', () => {
    render(
      <BookingCalendar 
        field={mockField} 
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    )
    
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    
    // Procura por botões de data desabilitados
    const disabledButtons = screen.getAllByRole('button').filter(button => 
      button.hasAttribute('disabled')
    )
    
    expect(disabledButtons.length).toBeGreaterThan(0)
  })

  it('deve exibir resumo do horário selecionado', async () => {
    const selectedDate = new Date()
    const selectedTimeSlot = mockTimeSlots[0]
    
    render(
      <BookingCalendar 
        field={mockField} 
        onTimeSlotSelect={mockOnTimeSlotSelect}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
      />
    )
    
    expect(screen.getByText('Horário Selecionado')).toBeInTheDocument()
    expect(screen.getByText('08:00 - 09:00')).toBeInTheDocument()
    expect(screen.getByText('R$ 50')).toBeInTheDocument()
  })

  it('deve formatar preços corretamente', async () => {
    render(
      <BookingCalendar 
        field={mockField} 
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    )
    
    await waitFor(() => {
      // Verifica se os preços estão formatados corretamente
      expect(screen.getAllByText('R$ 50')).toHaveLength(2) // Dois slots com preço 50
      expect(screen.getByText('por hora')).toBeInTheDocument()
    })
  })

  it('deve formatar horários removendo segundos', async () => {
    render(
      <BookingCalendar 
        field={mockField} 
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    )
    
    await waitFor(() => {
      // Verifica se os horários não mostram segundos
      expect(screen.getByText('08:00 - 09:00')).toBeInTheDocument()
      expect(screen.queryByText('08:00:00')).not.toBeInTheDocument()
    })
  })
})

// Testes para versão mobile
describe('BookingCalendar - Mobile', () => {
  beforeEach(() => {
    jest.mocked(require('@/hooks/useResponsive').useResponsive).mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false
    })
    
    mockFieldService.getAvailableTimeSlots.mockReturnValue(mockTimeSlots)
  })

  it('deve exibir dias da semana abreviados em mobile', () => {
    render(
      <BookingCalendar 
        field={mockField} 
        onTimeSlotSelect={jest.fn()}
      />
    )
    
    // Em mobile, deve mostrar apenas a primeira letra
    expect(screen.getByText('D')).toBeInTheDocument()
    expect(screen.getByText('S')).toBeInTheDocument()
  })

  it('deve aplicar estilos mobile aos botões de data', () => {
    render(
      <BookingCalendar 
        field={mockField} 
        onTimeSlotSelect={jest.fn()}
      />
    )
    
    const dateButtons = screen.getAllByRole('button').filter(button => 
      /^\d+$/.test(button.textContent || '')
    )
    
    dateButtons.forEach(button => {
      expect(button).toHaveClass('min-h-[40px]')
    })
  })
})