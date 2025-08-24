import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookingModal } from '@/components/fields/BookingModal'
import { Field, TimeSlot } from '@/types'

// Mock dos hooks
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
  photos: [],
  amenities: [],
  reviews: [],
  ownerId: 'owner1'
}

const mockTimeSlot: TimeSlot = {
  id: 'slot1',
  startTime: '08:00:00',
  endTime: '09:00:00',
  price: 50,
  isAvailable: true
}

const mockSelectedDate = new Date('2024-12-25')

describe('BookingModal', () => {
  const mockOnClose = jest.fn()
  const mockOnConfirm = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar modal quando aberto', () => {
    render(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        field={mockField}
        selectedDate={mockSelectedDate}
        selectedTimeSlot={mockTimeSlot}
        onConfirm={mockOnConfirm}
      />
    )
    
    expect(screen.getByText('Confirmar Reserva')).toBeInTheDocument()
    expect(screen.getByText('Arena Central')).toBeInTheDocument()
    expect(screen.getByText('25/12/2024')).toBeInTheDocument()
    expect(screen.getByText('08:00 - 09:00')).toBeInTheDocument()
    expect(screen.getByText('R$ 50')).toBeInTheDocument()
  })

  it('não deve renderizar quando fechado', () => {
    render(
      <BookingModal
        isOpen={false}
        onClose={mockOnClose}
        field={mockField}
        selectedDate={mockSelectedDate}
        selectedTimeSlot={mockTimeSlot}
        onConfirm={mockOnConfirm}
      />
    )
    
    expect(screen.queryByText('Confirmar Reserva')).not.toBeInTheDocument()
  })

  it('deve fechar modal quando botão X é clicado', () => {
    render(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        field={mockField}
        selectedDate={mockSelectedDate}
        selectedTimeSlot={mockTimeSlot}
        onConfirm={mockOnConfirm}
      />
    )
    
    const closeButton = screen.getByRole('button', { name: /fechar/i })
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup()
    
    render(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        field={mockField}
        selectedDate={mockSelectedDate}
        selectedTimeSlot={mockTimeSlot}
        onConfirm={mockOnConfirm}
      />
    )
    
    const confirmButton = screen.getByRole('button', { name: /confirmar reserva/i })
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
      expect(screen.getByText('WhatsApp é obrigatório')).toBeInTheDocument()
    })
    
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })

  it('deve validar formato do WhatsApp', async () => {
    const user = userEvent.setup()
    
    render(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        field={mockField}
        selectedDate={mockSelectedDate}
        selectedTimeSlot={mockTimeSlot}
        onConfirm={mockOnConfirm}
      />
    )
    
    const nameInput = screen.getByLabelText(/nome completo/i)
    const whatsappInput = screen.getByLabelText(/whatsapp/i)
    const confirmButton = screen.getByRole('button', { name: /confirmar reserva/i })
    
    await user.type(nameInput, 'João Silva')
    await user.type(whatsappInput, '123') // WhatsApp inválido
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(screen.getByText('WhatsApp deve ter pelo menos 10 dígitos')).toBeInTheDocument()
    })
    
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })

  it('deve validar formato do email quando fornecido', async () => {
    const user = userEvent.setup()
    
    render(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        field={mockField}
        selectedDate={mockSelectedDate}
        selectedTimeSlot={mockTimeSlot}
        onConfirm={mockOnConfirm}
      />
    )
    
    const nameInput = screen.getByLabelText(/nome completo/i)
    const whatsappInput = screen.getByLabelText(/whatsapp/i)
    const emailInput = screen.getByLabelText(/email/i)
    const confirmButton = screen.getByRole('button', { name: /confirmar reserva/i })
    
    await user.type(nameInput, 'João Silva')
    await user.type(whatsappInput, '85999999999')
    await user.type(emailInput, 'email-invalido') // Email inválido
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email deve ter um formato válido')).toBeInTheDocument()
    })
    
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })

  it('deve submeter formulário com dados válidos', async () => {
    const user = userEvent.setup()
    
    render(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        field={mockField}
        selectedDate={mockSelectedDate}
        selectedTimeSlot={mockTimeSlot}
        onConfirm={mockOnConfirm}
      />
    )
    
    const nameInput = screen.getByLabelText(/nome completo/i)
    const whatsappInput = screen.getByLabelText(/whatsapp/i)
    const emailInput = screen.getByLabelText(/email/i)
    const confirmButton = screen.getByRole('button', { name: /confirmar reserva/i })
    
    await user.type(nameInput, 'João Silva')
    await user.type(whatsappInput, '85999999999')
    await user.type(emailInput, 'joao@email.com')
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith({
        fieldId: '1',
        timeSlotId: 'slot1',
        date: mockSelectedDate,
        playerName: 'João Silva',
        playerWhatsapp: '85999999999',
        playerEmail: 'joao@email.com',
        notes: '',
        paymentMethod: 'PIX',
        totalPrice: 50,
        status: 'CONFIRMED'
      })
    })
  })

  it('deve permitir seleção de método de pagamento', async () => {
    const user = userEvent.setup()
    
    render(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        field={mockField}
        selectedDate={mockSelectedDate}
        selectedTimeSlot={mockTimeSlot}
        onConfirm={mockOnConfirm}
      />
    )
    
    // Verifica se os métodos de pagamento estão disponíveis
    expect(screen.getByText('PIX')).toBeInTheDocument()
    expect(screen.getByText('Cartão de Crédito')).toBeInTheDocument()
    expect(screen.getByText('Dinheiro')).toBeInTheDocument()
    
    // Seleciona cartão de crédito
    const creditCardOption = screen.getByLabelText(/cartão de crédito/i)
    await user.click(creditCardOption)
    
    // Preenche dados obrigatórios
    await user.type(screen.getByLabelText(/nome completo/i), 'João Silva')
    await user.type(screen.getByLabelText(/whatsapp/i), '85999999999')
    
    const confirmButton = screen.getByRole('button', { name: /confirmar reserva/i })
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentMethod: 'CREDIT_CARD'
        })
      )
    })
  })

  it('deve permitir adicionar observações', async () => {
    const user = userEvent.setup()
    
    render(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        field={mockField}
        selectedDate={mockSelectedDate}
        selectedTimeSlot={mockTimeSlot}
        onConfirm={mockOnConfirm}
      />
    )
    
    const notesTextarea = screen.getByLabelText(/observações/i)
    await user.type(notesTextarea, 'Preciso de bolas extras')
    
    // Preenche dados obrigatórios
    await user.type(screen.getByLabelText(/nome completo/i), 'João Silva')
    await user.type(screen.getByLabelText(/whatsapp/i), '85999999999')
    
    const confirmButton = screen.getByRole('button', { name: /confirmar reserva/i })
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          notes: 'Preciso de bolas extras'
        })
      )
    })
  })

  it('deve exibir estado de loading durante submissão', async () => {
    const user = userEvent.setup()
    
    // Mock para simular delay na confirmação
    const slowOnConfirm = jest.fn().mockImplementation(() => {
      return new Promise(resolve => setTimeout(resolve, 1000))
    })
    
    render(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        field={mockField}
        selectedDate={mockSelectedDate}
        selectedTimeSlot={mockTimeSlot}
        onConfirm={slowOnConfirm}
      />
    )
    
    // Preenche dados obrigatórios
    await user.type(screen.getByLabelText(/nome completo/i), 'João Silva')
    await user.type(screen.getByLabelText(/whatsapp/i), '85999999999')
    
    const confirmButton = screen.getByRole('button', { name: /confirmar reserva/i })
    await user.click(confirmButton)
    
    // Verifica se o botão mostra estado de loading
    expect(screen.getByText(/confirmando/i)).toBeInTheDocument()
    expect(confirmButton).toBeDisabled()
  })

  it('deve cancelar reserva', async () => {
    const user = userEvent.setup()
    
    render(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        field={mockField}
        selectedDate={mockSelectedDate}
        selectedTimeSlot={mockTimeSlot}
        onConfirm={mockOnConfirm}
      />
    )
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    await user.click(cancelButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })
})

// Testes para versão mobile
describe('BookingModal - Mobile', () => {
  beforeEach(() => {
    jest.mocked(require('@/hooks/useResponsive').useResponsive).mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false
    })
  })

  it('deve aplicar estilos mobile ao modal', () => {
    render(
      <BookingModal
        isOpen={true}
        onClose={jest.fn()}
        field={mockField}
        selectedDate={mockSelectedDate}
        selectedTimeSlot={mockTimeSlot}
        onConfirm={jest.fn()}
      />
    )
    
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveClass('max-w-full', 'max-h-[95vh]', 'm-2')
  })
})