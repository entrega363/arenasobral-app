# Documento de Design - Sistema ArenaSobral

## Visão Geral

O ArenaSobral é uma aplicação web Single Page Application (SPA) desenvolvida em React que utiliza gerenciamento de estado local com hooks e localStorage para persistência de dados. A arquitetura é baseada em componentes funcionais com navegação por estados controlados.

## Arquitetura

### Arquitetura Geral
```
┌─────────────────────────────────────────┐
│              Frontend (React)            │
├─────────────────────────────────────────┤
│  • Componentes de Interface             │
│  • Gerenciamento de Estado (useState)   │
│  • Persistência Local (localStorage)    │
│  • Navegação por Estados                │
└─────────────────────────────────────────┘
```

### Estrutura de Componentes
```
ArenaSobralApp (Componente Principal)
├── StatusBar (Barra de Status Mobile)
├── HomeScreen (Tela Inicial)
├── LoginScreen (Tela de Login)
├── RegisterScreen (Tela de Cadastro)
├── PlayerBoard (Painel do Jogador)
├── TeamOwnerPanel (Painel do Dono de Time)
├── FieldOwnerPanel (Painel do Dono de Areninha)
├── SearchTeams (Busca de Times)
├── SearchPlayers (Busca de Jogadores)
└── FieldSchedule (Gerenciamento de Horários)
```

## Componentes e Interfaces

### 1. Componente Principal (ArenaSobralApp)

**Responsabilidades:**
- Gerenciar navegação entre telas através do estado `currentScreen`
- Manter estado global da aplicação
- Controlar dados de jogadores, times, horários e agendamentos

**Estados Principais:**
```javascript
const [currentScreen, setCurrentScreen] = useState('home');
const [selectedTab, setSelectedTab] = useState('reservas');
const [contractOffers, setContractOffers] = useState([]);
const [selectedPlayers, setSelectedPlayers] = useState([]);
const [joinRequests, setJoinRequests] = useState([]);
const [friendlyMatches, setFriendlyMatches] = useState([]);
const [fieldTimeSlots, setFieldTimeSlots] = useState([]);
const [teamSchedule, setTeamSchedule] = useState([]);
```

### 2. Sistema de Autenticação

**LoginScreen:**
- Campos: email, senha, tipo de conta (radio buttons)
- Validação de tipo de usuário antes do redirecionamento
- Integração com diferentes painéis baseado no perfil

**RegisterScreen:**
- Formulário completo com nome, email, WhatsApp, senha
- Seleção visual de tipo de conta com feedback visual
- Validação de campos obrigatórios

### 3. Painéis de Usuário

**PlayerBoard (Painel do Jogador):**
- Visualização de propostas de contrato recebidas
- Busca e solicitação de entrada em times
- Gerenciamento de perfil pessoal
- Histórico de times e jogos

**TeamOwnerPanel (Painel do Dono de Time):**
- Gerenciamento de elenco
- Busca e contratação de jogadores
- Agendamento de jogos amistosos
- Controle de agenda de jogos

**FieldOwnerPanel (Painel do Dono de Areninha):**
- Dashboard com estatísticas de negócio
- Gerenciamento de horários e preços
- Controle de reservas
- Relatórios de ocupação e receita

### 4. Sistema de Busca

**SearchPlayers:**
- Lista paginada de jogadores disponíveis
- Filtros por posição, localização, disponibilidade
- Visualização de fotos e informações detalhadas
- Funcionalidade de contratação direta

**SearchTeams:**
- Lista de times cadastrados
- Informações de capitão, localização, categoria
- Solicitação de entrada em times
- Contato via WhatsApp

## Modelos de Dados

### Jogador (Player)
```javascript
{
  id: number,
  name: string,
  age: number,
  position: string,
  location: string,
  whatsapp: string,
  experience: string,
  currentTeam: string,
  availability: string,
  category: string,
  teamsCount: number,
  photo: string
}
```

### Time (Team)
```javascript
{
  id: number,
  name: string,
  location: string,
  players: number,
  captain: string,
  whatsapp: string,
  category: string,
  playersList: number[]
}
```

### Horário de Campo (TimeSlot)
```javascript
{
  id: number,
  time: string,
  price: number,
  available: boolean
}
```

### Jogo Agendado (ScheduledGame)
```javascript
{
  id: number,
  opponent: string,
  date: string,
  time: string,
  location: string,
  type: string,
  status: string
}
```

### Proposta de Contrato (ContractOffer)
```javascript
{
  id: number,
  playerName: string,
  teamName: string,
  teamId: number,
  position: string,
  date: string,
  status: string
}
```

## Tratamento de Erros

### Estratégias de Tratamento
1. **Validação de Formulários:** Verificação de campos obrigatórios antes do envio
2. **Feedback Visual:** Alertas JavaScript para confirmações e erros
3. **Estados de Loading:** Indicadores visuais durante operações
4. **Fallbacks:** Dados padrão quando informações não estão disponíveis

### Cenários de Erro
- Campos obrigatórios não preenchidos
- Seleção de tipo de usuário não realizada
- Falha na persistência de dados no localStorage
- Navegação para telas inexistentes

## Estratégia de Testes

### Testes de Componente
1. **Renderização:** Verificar se todos os componentes renderizam corretamente
2. **Navegação:** Testar transições entre telas
3. **Estados:** Validar mudanças de estado em diferentes cenários
4. **Formulários:** Testar validação e submissão de dados

### Testes de Integração
1. **Fluxo de Login:** Testar processo completo de autenticação
2. **Contratação de Jogadores:** Validar fluxo completo de proposta e resposta
3. **Agendamento de Jogos:** Testar criação e gerenciamento de jogos
4. **Persistência:** Verificar salvamento e recuperação de dados

### Testes de Interface
1. **Responsividade:** Testar em diferentes tamanhos de tela
2. **Acessibilidade:** Verificar navegação por teclado e leitores de tela
3. **Performance:** Testar tempo de carregamento e responsividade
4. **Compatibilidade:** Validar funcionamento em diferentes navegadores

## Considerações Técnicas

### Tecnologias Utilizadas
- **React 18.2.0:** Framework principal para interface
- **Lucide React:** Biblioteca de ícones
- **Tailwind CSS:** Framework de estilos
- **localStorage:** Persistência de dados local
- **ESM:** Módulos ES6 carregados via CDN

### Arquitetura de Dados
- **Estado Local:** Gerenciamento via useState hooks
- **Persistência:** localStorage para dados que precisam persistir
- **Dados Mock:** Dados estáticos para demonstração
- **Comunicação:** Simulação de APIs via funções JavaScript

### Performance
- **Lazy Loading:** Componentes carregados sob demanda
- **Memoização:** Otimização de re-renderizações desnecessárias
- **Bundle Size:** Uso de CDN para reduzir tamanho do bundle
- **Caching:** Aproveitamento do cache do navegador

### Segurança
- **Validação Client-side:** Verificação de dados no frontend
- **Sanitização:** Limpeza de inputs do usuário
- **Proteção XSS:** Uso de práticas seguras do React
- **Dados Sensíveis:** Não armazenamento de informações críticas no localStorage