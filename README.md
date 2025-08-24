# ArenaSobral - Plataforma Moderna de Futebol Amador

Uma aplicação Next.js 14 moderna para conectar jogadores, times e areninhas em Sobral, Ceará.

## 🚀 Como Testar Localmente

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Git

### 1. Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 2. Executar em Modo de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

### 3. Acessar a Aplicação

Abra seu navegador e acesse: [http://localhost:3000](http://localhost:3000)

## 📱 Funcionalidades Disponíveis

### ✅ Implementado (Versão Inicial)
- ✅ Tela inicial com menu principal
- ✅ Design responsivo mobile-first
- ✅ Componentes UI modernos (Shadcn/ui)
- ✅ Sistema de navegação
- ✅ Configuração TypeScript completa

### 🚧 Em Desenvolvimento
- 🚧 Sistema de autenticação (NextAuth.js)
- 🚧 Banco de dados (Prisma + PostgreSQL)
- 🚧 Painéis de usuário (Jogador, Dono de Time, Areninha)
- 🚧 Sistema de busca de jogadores e times
- 🚧 Upload de imagens (Cloudinary)
- 🚧 Notificações em tempo real (Pusher)

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **UI Components:** Shadcn/ui, Radix UI
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Database:** Prisma + PostgreSQL
- **Auth:** NextAuth.js
- **Images:** Cloudinary
- **Real-time:** Pusher
- **Deploy:** Vercel

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes UI (Shadcn/ui)
│   ├── layout/           # Componentes de layout
│   └── screens/          # Telas da aplicação
├── lib/                  # Utilitários e configurações
├── types/                # Tipos TypeScript
└── hooks/                # Hooks customizados
```

## 🎨 Design System

O projeto utiliza um design system moderno baseado em:

- **Cores:** Paleta profissional com suporte a tema claro/escuro
- **Tipografia:** Inter font para melhor legibilidade
- **Componentes:** Shadcn/ui para consistência
- **Responsividade:** Mobile-first approach
- **Animações:** Transições suaves com Framer Motion

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linting
npm run type-check   # Verifica tipos TypeScript

# Banco de dados (quando configurado)
npm run db:generate  # Gera cliente Prisma
npm run db:push      # Aplica mudanças no schema
npm run db:migrate   # Executa migrações
npm run db:studio    # Abre Prisma Studio
```

## 🔧 Configuração de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database (quando configurar)
DATABASE_URL="postgresql://..."

# NextAuth (quando configurar)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Cloudinary (quando configurar)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Pusher (quando configurar)
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-key"
PUSHER_SECRET="your-secret"
PUSHER_CLUSTER="your-cluster"
```

## 🚀 Deploy no Vercel

### Método 1: Deploy Automático via GitHub

1. **Conectar ao GitHub:**
   - Faça push do código para um repositório GitHub
   - Acesse [vercel.com](https://vercel.com)
   - Conecte sua conta GitHub
   - Importe o repositório

2. **Configurar Variáveis de Ambiente:**
   - No dashboard do Vercel, vá em Settings > Environment Variables
   - Adicione as variáveis necessárias (opcional para esta versão)

3. **Deploy Automático:**
   - A cada push no GitHub, o Vercel fará deploy automaticamente

### Método 2: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Método 3: Deploy Direto (Mais Rápido)

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Na pasta do projeto, executar:
vercel

# Seguir as instruções:
# - Set up and deploy? Yes
# - Which scope? (sua conta)
# - Link to existing project? No
# - Project name? arenasobral-modern
# - In which directory? ./
# - Override settings? No
```

## 📝 Próximos Passos

Para continuar o desenvolvimento, execute as tarefas do plano de implementação:

1. **Configurar banco de dados** - Prisma + PostgreSQL
2. **Implementar autenticação** - NextAuth.js
3. **Criar painéis de usuário** - Jogador, Time, Areninha
4. **Adicionar funcionalidades** - Busca, contratação, agendamento

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**ArenaSobral** - Conectando o futebol amador de Sobral! ⚽