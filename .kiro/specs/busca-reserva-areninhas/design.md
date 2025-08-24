# Design Document - Sistema de Busca e Reserva de Areninhas

## Overview

O sistema de busca e reserva de areninhas será implementado como uma extensão da plataforma ArenasSobral existente, aproveitando a arquitetura atual baseada em Next.js 14, TypeScript e componentes React. O sistema seguirá os padrões estabelecidos de navegação, autenticação e gerenciamento de estado via localStorage, mantendo consistência com a interface existente.

A funcionalidade será acessível através de um botão já existente "Buscar Areninhas" na página inicial, que navegará para uma nova rota `/search/fields` com funcionalidades completas de busca, filtros, visualização de detalhes e processo de reserva.

## Architecture

### Frontend Architecture
- **Framework**: Next.js 14 com App Router
- **Linguagem**: TypeScript para type safety
- **Styling**: Tailwind CSS seguindo o design system existente
- **Componentes**: Shadcn/ui components já configurados
- **Estado**: localStorage para persistência de dados (seguindo padrão atual)
- **Navegação**: Next.js Router para navegação entre páginas

### Data Flow
```
HomePage → SearchFieldsPage → FieldDetailsPage → BookingModal → ConfirmationPage
    ↓           ↓                    ↓              ↓             ↓
localStorage ← Filters ← FieldData ← BookingData ← Confirmation
```

### Route Structure
```
/search/fields          # Página principal de busca
/search/fields/[id]     # Detalhes da areninha
/bookings              # Gerenciamento de reservas do usuário
/dashboard/field-owner # Painel do dono (já existe)
```

## Components and Interfaces

### Core Components

#### 1. SearchFieldsScreen
**Localização**: `src/components/screens/SearchFieldsScreen.tsx`
**Responsabilidade**: Página principal de busca com filtros e lista de resultados
**Props**: Nenhuma (usa estado interno)

#### 2. FieldCard
**Localização**: `src/components/fields/FieldCard.tsx`
**Responsabilidade**: Card individual da areninha na lista de resultados
```typescript
interface FieldCardProps {
  field: Field
  onClick: (fieldId: string) => void
}
```

#### 3. FieldDetailsScreen
**Localização**: `src/components/screens/FieldDetailsScreen.tsx`
**Responsabilidade**: Página de detalhes completos da areninha
**Props**: `{ fieldId: string }`

#### 4. BookingCalendar
**Localização**: `src/components/fields/BookingCalendar.tsx`
**Responsabilidade**: Calendário de disponibilidade e seleção de horários
```typescript
interface BookingCalendarProps {
  field: Field
  onTimeSlotSelect: (date: Date, timeSlot: TimeSlot) => void
  selectedDate?: Date
  selectedTimeSlot?: TimeSlot
}
```

#### 5. BookingModal
**Localização**: `src/components/fields/BookingModal.tsx`
**Responsabilidade**: Modal de confirmação de reserva
```typescript
interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  field: Field
  selectedDate: Date
  selectedTimeSlot: TimeSlot
  onConfirm: (bookingData: BookingFormData) => void
}
```

#### 6. FilterPanel
**Localização**: `src/components/fields/FilterPanel.tsx`
**Responsabilidade**: Painel de filtros de busca
```typescript
interface FilterPanelProps {
  filters: FieldFilters
  onFiltersChange: (filters: FieldFilters) => void
  onClearFilters: () => void
}
```

### Extended Type Definitions

```typescript
// Extensões aos tipos existentes em src/types/index.ts

export interface FieldFilters {
  location?: string
  priceRange?: {
    min: number
    max: number
  }
  fieldType?: 'SOCIETY' | 'FUTSAL' | 'BEACH' | 'INDOOR'
  date?: Date
  timeRange?: {
    start: string
    end: string
  }
  amenities?: string[]
}

export interface FieldAmenity {
  id: string
  name: string
  icon: string
}

export interface FieldPhoto {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

export interface FieldReview {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: Date
}

// Extensão do Field existente
export interface Field {
  id: string
  name: string
  location: string
  ownerId: string
  owner: FieldOwner
  timeSlots: TimeSlot[]
  bookings: Booking[]
  // Novos campos
  description: string
  fieldType: 'SOCIETY' | 'FUTSAL' | 'BEACH' | 'INDOOR'
  photos: FieldPhoto[]
  amenities: FieldAmenity[]
  reviews: FieldReview[]
  rating: number
  pricePerHour: number
  address: string
  coordinates?: {
    lat: number
    lng: number
  }
  rules: string[]
  contactInfo: {
    phone: string
    whatsapp: string
    email?: string
  }
}

export interface BookingFormData {
  playerName: string
  playerWhatsapp: string
  playerEmail?: string
  notes?: string
  paymentMethod: 'PIX' | 'CARD' | 'CASH'
}
```

## Data Models

### Mock Data Structure
O sistema utilizará dados mockados armazenados em localStorage, seguindo o padrão atual:

```typescript
// localStorage keys
const STORAGE_KEYS = {
  FIELDS: 'arenasobral_fields',
  BOOKINGS: 'arenasobral_bookings',
  FIELD_REVIEWS: 'arenasobral_field_reviews',
  CURRENT_USER: 'currentUser'
}

// Estrutura de dados mockados
const mockFields: Field[] = [
  {
    id: '1',
    name: 'Arena Central',
    location: 'Centro, Sobral',
    description: 'Quadra society com grama sintética de alta qualidade...',
    fieldType: 'SOCIETY',
    pricePerHour: 80,
    rating: 4.5,
    photos: [
      { id: '1', url: '/images/arena1.jpg', alt: 'Arena Central', isPrimary: true }
    ],
    amenities: [
      { id: '1', name: 'Vestiário', icon: 'changing-room' },
      { id: '2', name: 'Estacionamento', icon: 'parking' }
    ],
    // ... outros campos
  }
]
```

### Data Management Functions
```typescript
// src/lib/fieldService.ts
export class FieldService {
  static getAllFields(): Field[]
  static getFieldById(id: string): Field | null
  static searchFields(filters: FieldFilters): Field[]
  static getAvailableTimeSlots(fieldId: string, date: Date): TimeSlot[]
  static createBooking(bookingData: Booking): boolean
  static getUserBookings(userId: string): Booking[]
  static cancelBooking(bookingId: string): boolean
}
```

## Error Handling

### Error Types
```typescript
export enum FieldErrorType {
  FIELD_NOT_FOUND = 'FIELD_NOT_FOUND',
  TIME_SLOT_UNAVAILABLE = 'TIME_SLOT_UNAVAILABLE',
  BOOKING_FAILED = 'BOOKING_FAILED',
  USER_NOT_AUTHENTICATED = 'USER_NOT_AUTHENTICATED',
  INVALID_DATE = 'INVALID_DATE'
}

export interface FieldError {
  type: FieldErrorType
  message: string
  details?: any
}
```

### Error Handling Strategy
1. **Validação de entrada**: Validar filtros e dados de reserva no frontend
2. **Estados de erro**: Componentes com estados de loading, error e success
3. **Fallbacks**: Exibir mensagens amigáveis quando não há resultados
4. **Retry logic**: Permitir tentar novamente em caso de falha
5. **Logging**: Console.log para debug (substituir por serviço real futuramente)

### Error Components
```typescript
// src/components/ui/ErrorBoundary.tsx
// src/components/ui/ErrorMessage.tsx
// src/components/ui/LoadingSpinner.tsx
```

## Testing Strategy

### Unit Testing
- **Componentes**: Testes para cada componente usando Jest + React Testing Library
- **Serviços**: Testes para FieldService e funções utilitárias
- **Hooks**: Testes para custom hooks de gerenciamento de estado

### Integration Testing
- **Fluxo de busca**: Teste completo do fluxo de busca e filtros
- **Fluxo de reserva**: Teste do processo completo de reserva
- **Navegação**: Testes de navegação entre páginas

### E2E Testing (Futuro)
- **Cypress**: Para testes end-to-end do fluxo completo
- **Cenários críticos**: Busca, reserva, cancelamento

### Test Files Structure
```
src/
  __tests__/
    components/
      fields/
        FieldCard.test.tsx
        BookingCalendar.test.tsx
        BookingModal.test.tsx
    screens/
      SearchFieldsScreen.test.tsx
      FieldDetailsScreen.test.tsx
    services/
      fieldService.test.ts
```

### Mock Strategy
- **Mock data**: Dados consistentes para todos os testes
- **Mock services**: Simular localStorage e APIs
- **Mock components**: Componentes simplificados para testes de integração

## Implementation Phases

### Phase 1: Core Search Functionality
- SearchFieldsScreen com lista básica
- FieldCard component
- Navegação para detalhes
- Filtros básicos (localização, preço)

### Phase 2: Field Details & Calendar
- FieldDetailsScreen completa
- BookingCalendar component
- Visualização de disponibilidade
- Galeria de fotos

### Phase 3: Booking System
- BookingModal component
- Processo de reserva
- Validações e confirmações
- Integração com autenticação

### Phase 4: User Management
- Página "Minhas Reservas"
- Cancelamento de reservas
- Histórico de reservas
- Notificações (simuladas)

### Phase 5: Field Owner Features
- Extensão do dashboard existente
- Gerenciamento de areninhas
- Visualização de reservas
- Configuração de horários e preços