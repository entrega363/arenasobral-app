# Testes - Arena Booking

Este diretório contém todos os testes unitários e de integração para o sistema de reserva de areninhas.

## Estrutura dos Testes

```
src/__tests__/
├── components/           # Testes de componentes React
│   ├── FieldCard.test.tsx
│   ├── BookingCalendar.test.tsx
│   └── BookingModal.test.tsx
├── hooks/               # Testes de hooks personalizados
│   ├── useResponsive.test.ts
│   └── useAsyncOperation.test.ts
├── lib/                 # Testes de serviços e utilitários
│   └── fieldService.test.ts
├── integration/         # Testes de integração
│   └── booking-flow.test.tsx
└── README.md
```

## Executando os Testes

### Comandos Disponíveis

```bash
# Executar todos os testes uma vez
npm test

# Executar testes em modo watch (re-executa quando arquivos mudam)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar testes para CI/CD (sem watch, com cobertura)
npm run test:ci
```

### Executar Testes Específicos

```bash
# Executar apenas testes de componentes
npm test -- components

# Executar apenas um arquivo de teste
npm test -- FieldCard.test.tsx

# Executar testes que correspondem a um padrão
npm test -- --testNamePattern="deve renderizar"
```

## Cobertura de Testes

Os testes cobrem:

### Componentes (90%+ cobertura)
- **FieldCard**: Renderização, interações, responsividade
- **BookingCalendar**: Seleção de datas, horários, navegação
- **BookingModal**: Validação de formulário, submissão, estados

### Hooks (95%+ cobertura)
- **useResponsive**: Detecção de breakpoints, eventos de resize
- **useAsyncOperation**: Estados de loading/erro, operações assíncronas

### Serviços (85%+ cobertura)
- **FieldService**: CRUD de areninhas, busca, filtros, reservas

### Integração (80%+ cobertura)
- **Fluxo de Reserva**: Busca → Seleção → Reserva completa
- **Estados de Erro**: Tratamento de erros e loading
- **Responsividade**: Adaptação mobile/desktop

## Metas de Cobertura

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Mocks e Utilitários

### Mocks Globais (jest.setup.js)
- `localStorage` e `sessionStorage`
- `matchMedia` para queries CSS
- `ResizeObserver` e `IntersectionObserver`
- Console.error filtrado para warnings do React

### Mocks por Teste
- Next.js Router (`useRouter`, `usePathname`)
- Hooks personalizados (`useResponsive`, `useAsyncOperation`)
- Serviços (`FieldService`)

## Padrões de Teste

### Estrutura de Teste
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup antes de cada teste
    jest.clearAllMocks()
  })

  it('deve fazer algo específico', () => {
    // Arrange
    const props = { ... }
    
    // Act
    render(<Component {...props} />)
    
    // Assert
    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
```

### Testes de Interação
```typescript
it('deve chamar callback quando clicado', async () => {
  const user = userEvent.setup()
  const mockCallback = jest.fn()
  
  render(<Button onClick={mockCallback} />)
  
  await user.click(screen.getByRole('button'))
  
  expect(mockCallback).toHaveBeenCalledTimes(1)
})
```

### Testes Assíncronos
```typescript
it('deve carregar dados', async () => {
  render(<AsyncComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Dados carregados')).toBeInTheDocument()
  })
})
```

## Debugging

### Visualizar DOM Renderizado
```typescript
import { screen } from '@testing-library/react'

// Durante o teste
screen.debug() // Mostra todo o DOM
screen.debug(screen.getByRole('button')) // Mostra elemento específico
```

### Queries Úteis
```typescript
// Por texto
screen.getByText('Texto exato')
screen.getByText(/texto parcial/i)

// Por role
screen.getByRole('button', { name: /clique aqui/i })

// Por label
screen.getByLabelText('Nome do campo')

// Por placeholder
screen.getByPlaceholderText('Digite aqui...')

// Por test-id (usar apenas quando necessário)
screen.getByTestId('custom-element')
```

## Boas Práticas

1. **Teste comportamento, não implementação**
2. **Use queries semânticas** (byRole, byLabelText)
3. **Teste casos de erro** além dos casos de sucesso
4. **Mock apenas o necessário**
5. **Mantenha testes independentes**
6. **Use nomes descritivos** para os testes
7. **Teste acessibilidade** (roles, labels, navegação por teclado)

## Troubleshooting

### Erro: "Cannot find module"
- Verifique se o caminho no `moduleNameMapping` está correto
- Confirme se o arquivo existe no local especificado

### Erro: "ReferenceError: window is not defined"
- Adicione mock do window no jest.setup.js
- Use `typeof window !== 'undefined'` no código

### Testes lentos
- Use `jest.useFakeTimers()` para timers
- Mock operações assíncronas desnecessárias
- Execute testes em paralelo com `--maxWorkers`

### Falhas intermitentes
- Use `waitFor` para operações assíncronas
- Evite timeouts fixos
- Limpe mocks entre testes com `jest.clearAllMocks()`