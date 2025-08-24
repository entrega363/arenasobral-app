# Documento de Design - ArenaSobral Modernizado para Vercel

## Visão Geral

O ArenaSobral modernizado será uma aplicação Next.js 14 full-stack com TypeScript, utilizando as melhores práticas e tecnologias atuais. A arquitetura será baseada em App Router, Server Components, e uma stack moderna otimizada para performance e experiência do desenvolvedor.

## Arquitetura

### Stack Tecnológica
```
┌─────────────────────────────────────────┐
│              Frontend                    │
├─────────────────────────────────────────┤
│  • Next.js 14 (App Router)             │
│  • TypeScript                           │
│  • Tailwind CSS + Shadcn/ui            │
│  • Framer Motion                        │
│  • Zustand (State Management)          │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│              Backend                     │
├─────────────────────────────────────────┤
│  • Next.js API Routes                  │
│  • NextAuth.js                         │
│  • Prisma ORM                          │
│  • PostgreSQL                          │
│  • Zod (Validation)                    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│              Services                    │
├─────────────────────────────────────────┤
│  • Cloudinary (Images)                 │
│  • Pusher (Real-time)                  │
│  • Vercel (Hosting)                    │
│  • Vercel Postgres                     │
└─────────────────────────────────────────┘
```

### Estrutura de Diretórios
```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Auth group routes
│   ├── (dashboard)/       # Dashboard group routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # Prisma client
│   ├── validations.ts    # Zod schemas
│   └── utils.ts          # Utility functions
├── stores/               # Zustand stores
├── types/                # TypeScript types
└── hooks/                # Custom hooks
```

## Componentes e Interfaces

### 1. Autenticação (NextAuth.js)

**Configuração:**
```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" }
      },
      async authorize(credentials) {
        // Validação com Prisma
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.userType = user.userType;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.userType = token.userType;
      return session;
    }
  }
}
```

### 2. Banco de Dados (Prisma Schema)

**Modelos Principais:**
```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  whatsapp  String
  userType  UserType
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relacionamentos baseados no tipo
  player    Player?
  teamOwner TeamOwner?
  fieldOwner FieldOwner?
}

model Player {
  id           String @id @default(cuid())
  userId       String @unique
  age          Int
  position     String
  location     String
  experience   String
  availability String
  category     String
  photo        String?
  
  user         User @relation(fields: [userId], references: [id])
  teams        TeamPlayer[]
  contractOffers ContractOffer[]
}

model Team {
  id       String @id @default(cuid())
  name     String
  location String
  category String
  whatsapp String
  
  ownerId  String
  owner    TeamOwner @relation(fields: [ownerId], references: [id])
  players  TeamPlayer[]
  games    Game[]
}

model Field {
  id       String @id @default(cuid())
  name     String
  location String
  
  ownerId  String
  owner    FieldOwner @relation(fields: [ownerId], references: [id])
  timeSlots TimeSlot[]
  bookings Booking[]
}
```

### 3. API Routes com Validação

**Exemplo de API Route:**
```typescript
// app/api/players/route.ts
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

const createPlayerSchema = z.object({
  age: z.number().min(16).max(50),
  position: z.string().min(1),
  location: z.string().min(1),
  experience: z.string().min(1),
  availability: z.string().min(1),
  category: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPlayerSchema.parse(body);

    const player = await prisma.player.create({
      data: {
        ...validatedData,
        userId: session.user.id
      }
    });

    return NextResponse.json(player);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

### 4. Gerenciamento de Estado (Zustand)

**Store Principal:**
```typescript
// stores/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Players
  players: Player[];
  selectedPlayers: Player[];
  contractOffers: ContractOffer[];
  
  // Teams
  teams: Team[];
  joinRequests: JoinRequest[];
  
  // Games
  friendlyMatches: FriendlyMatch[];
  teamSchedule: ScheduledGame[];
  
  // Actions
  setPlayers: (players: Player[]) => void;
  addContractOffer: (offer: ContractOffer) => void;
  updateOfferStatus: (id: string, status: string) => void;
  // ... outras actions
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      players: [],
      selectedPlayers: [],
      contractOffers: [],
      teams: [],
      joinRequests: [],
      friendlyMatches: [],
      teamSchedule: [],
      
      setPlayers: (players) => set({ players }),
      addContractOffer: (offer) => 
        set((state) => ({ 
          contractOffers: [...state.contractOffers, offer] 
        })),
      updateOfferStatus: (id, status) =>
        set((state) => ({
          contractOffers: state.contractOffers.map(offer =>
            offer.id === id ? { ...offer, status } : offer
          )
        }))
    }),
    {
      name: 'arenasobral-storage'
    }
  )
);
```

### 5. Componentes UI (Shadcn/ui)

**Componente de Card de Jogador:**
```typescript
// components/features/PlayerCard.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface PlayerCardProps {
  player: Player;
  onContact: (player: Player) => void;
  showContactButton?: boolean;
}

export function PlayerCard({ player, onContact, showContactButton = true }: PlayerCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={player.photo} alt={player.name} />
          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <h3 className="font-semibold">{player.name}</h3>
          <Badge variant="secondary">{player.position}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Idade: {player.age} anos</p>
          <p>Localização: {player.location}</p>
          <p>Experiência: {player.experience}</p>
          <p>Disponibilidade: {player.availability}</p>
          <p>Categoria: {player.category}</p>
        </div>
        {showContactButton && (
          <Button 
            className="w-full mt-4" 
            onClick={() => onContact(player)}
          >
            Contratar Jogador
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

## Modelos de Dados (TypeScript)

### Tipos Principais
```typescript
// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  whatsapp: string;
  userType: 'PLAYER' | 'TEAM_OWNER' | 'FIELD_OWNER';
  createdAt: Date;
  updatedAt: Date;
}

export interface Player {
  id: string;
  userId: string;
  age: number;
  position: string;
  location: string;
  experience: string;
  availability: string;
  category: string;
  photo?: string;
  user: User;
  teams: TeamPlayer[];
}

export interface Team {
  id: string;
  name: string;
  location: string;
  category: string;
  whatsapp: string;
  ownerId: string;
  owner: TeamOwner;
  players: TeamPlayer[];
  _count?: {
    players: number;
  };
}

export interface ContractOffer {
  id: string;
  playerId: string;
  teamId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  player: Player;
  team: Team;
}
```

## Tratamento de Erros

### Estratégias de Tratamento
1. **Validação com Zod:** Validação de dados em API routes e formulários
2. **Error Boundaries:** Captura de erros em componentes React
3. **Toast Notifications:** Feedback visual para usuários
4. **Logging:** Sistema de logs para debugging em produção

### Middleware de Erro
```typescript
// lib/error-handler.ts
export function handleApiError(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    );
  }
  
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    );
  }
  
  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

## Estratégia de Testes

### Configuração de Testes
```typescript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
```

### Tipos de Testes
1. **Unit Tests:** Componentes individuais e funções utilitárias
2. **Integration Tests:** API routes e fluxos de dados
3. **E2E Tests:** Fluxos completos de usuário com Playwright
4. **Visual Tests:** Testes de regressão visual com Chromatic

## Considerações de Performance

### Otimizações Next.js
1. **Server Components:** Renderização no servidor quando possível
2. **Image Optimization:** Componente Image do Next.js com Cloudinary
3. **Bundle Analysis:** Análise e otimização do bundle
4. **Caching:** Estratégias de cache para dados e assets

### Otimizações de Banco
1. **Indexação:** Índices apropriados no PostgreSQL
2. **Query Optimization:** Queries otimizadas com Prisma
3. **Connection Pooling:** Pool de conexões para performance
4. **Data Fetching:** Server Components para reduzir waterfalls

## Segurança

### Medidas de Segurança
1. **Authentication:** NextAuth.js com providers seguros
2. **Authorization:** Middleware para proteção de rotas
3. **Validation:** Zod para validação de entrada
4. **CSRF Protection:** Proteção contra CSRF attacks
5. **Rate Limiting:** Limitação de requests por IP
6. **Environment Variables:** Variáveis sensíveis no Vercel

### Configuração de Segurança
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Lógica de autorização adicional
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Verificar permissões baseadas na rota
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*']
};
```