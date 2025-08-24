# Exemplo de Uso da Prop bookingId

## Componentes Atualizados

### 1. BookingConfirmationScreen

O componente `BookingConfirmationScreen` agora aceita a prop `bookingId` para carregar uma reserva específica:

```tsx
import { BookingConfirmationScreen } from '@/components/screens/BookingConfirmationScreen'

// Uso com bookingId específico
function ExamplePage() {
  return (
    <BookingConfirmationScreen bookingId="abc123def456" />
  )
}

// Uso sem bookingId (usa URL params ou localStorage)
function ExamplePageDefault() {
  return (
    <BookingConfirmationScreen />
  )
}
```

### 2. BookingModal

O componente `BookingModal` agora aceita a prop `bookingId` para editar uma reserva existente:

```tsx
import { BookingModal } from '@/components/fields/BookingModal'

function ExampleBookingEdit() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedField, setSelectedField] = useState<Field | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)

  // Para nova reserva
  const handleNewBooking = () => {
    setIsModalOpen(true)
  }

  // Para editar reserva existente
  const handleEditBooking = (bookingId: string) => {
    setIsModalOpen(true)
    // O modal carregará automaticamente os dados da reserva
  }

  return (
    <>
      <button onClick={handleNewBooking}>Nova Reserva</button>
      <button onClick={() => handleEditBooking('abc123def456')}>
        Editar Reserva
      </button>

      {/* Modal para nova reserva */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        field={selectedField!}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot!}
        onConfirm={(bookingData) => {
          console.log('Nova reserva:', bookingData)
          setIsModalOpen(false)
        }}
      />

      {/* Modal para editar reserva existente */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        field={selectedField!}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot!}
        bookingId="abc123def456" // ID da reserva a ser editada
        onConfirm={(bookingData) => {
          console.log('Reserva editada:', bookingData)
          setIsModalOpen(false)
        }}
      />
    </>
  )
}
```

## Funcionalidades Implementadas

### BookingConfirmationScreen
- ✅ Aceita prop `bookingId` opcional
- ✅ Prioriza `bookingId` prop > URL param > localStorage
- ✅ Carrega dados da reserva usando `FieldService.getBookingById()`
- ✅ Mantém compatibilidade com implementação anterior

### BookingModal
- ✅ Aceita prop `bookingId` opcional para modo de edição
- ✅ Carrega dados existentes quando `bookingId` é fornecido
- ✅ Altera título e botões baseado no modo (nova/editar)
- ✅ Pré-preenche formulário com dados da reserva existente

### FieldService
- ✅ Novo método `getBookingById(bookingId: string)` adicionado
- ✅ Retorna `Booking | null` para busca por ID
- ✅ Tratamento de erros adequado

## Casos de Uso

### 1. Confirmação de Nova Reserva
```tsx
// Após criar uma reserva, redirecionar para confirmação
const bookingId = await FieldService.createBooking(bookingData)
if (bookingId) {
  router.push(`/booking-confirmation?bookingId=${bookingId}`)
  // ou usar o componente diretamente:
  // <BookingConfirmationScreen bookingId={bookingId} />
}
```

### 2. Visualizar Reserva Específica
```tsx
// Link direto para uma reserva específica
<Link href={`/booking-confirmation?bookingId=${booking.id}`}>
  Ver Detalhes da Reserva
</Link>

// ou usar o componente diretamente:
<BookingConfirmationScreen bookingId={booking.id} />
```

### 3. Editar Reserva Existente
```tsx
// Abrir modal de edição para uma reserva
const handleEditBooking = (booking: Booking) => {
  setSelectedField(booking.field)
  setSelectedDate(new Date(booking.date))
  setSelectedTimeSlot(booking.timeSlot)
  setEditingBookingId(booking.id)
  setIsModalOpen(true)
}

<BookingModal
  isOpen={isModalOpen}
  bookingId={editingBookingId}
  field={selectedField}
  selectedDate={selectedDate}
  selectedTimeSlot={selectedTimeSlot}
  onConfirm={handleUpdateBooking}
  onClose={() => setIsModalOpen(false)}
/>
```

## Benefícios

1. **Flexibilidade**: Componentes podem ser usados tanto para criar quanto para editar
2. **Reutilização**: Mesmo componente serve múltiplos propósitos
3. **Consistência**: Interface uniforme para diferentes cenários
4. **Compatibilidade**: Mantém funcionamento anterior intacto
5. **Tipagem**: TypeScript garante uso correto das props

## Próximos Passos

Para implementar funcionalidade completa de edição, considere:

1. Adicionar método `updateBooking()` no `FieldService`
2. Implementar validações específicas para edição
3. Adicionar confirmação antes de salvar alterações
4. Implementar histórico de alterações
5. Adicionar notificações de sucesso/erro