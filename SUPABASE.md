# Integração com Supabase

Este documento descreve como configurar e usar a integração com o Supabase na aplicação ArenaSobral.

## Configuração Inicial

1. Crie um projeto no [Supabase](https://supabase.io/)
2. Obtenha as credenciais do seu projeto:
   - URL do projeto
   - Chave anônima (anon key)
3. Configure as variáveis de ambiente no arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

## Estrutura de Serviços

Todos os serviços do Supabase estão localizados em `src/lib/supabase/`:

- `client.ts` - Configuração do cliente Supabase
- `userService.ts` - Gerenciamento de usuários
- `fieldService.ts` - Gerenciamento de campos (areninhas)
- `bookingService.ts` - Gerenciamento de reservas
- `teamService.ts` - Gerenciamento de times
- `playerService.ts` - Gerenciamento de jogadores
- `reviewService.ts` - Gerenciamento de avaliações
- `gameService.ts` - Gerenciamento de jogos
- `storage.ts` - Gerenciamento de armazenamento de arquivos

## Hooks Personalizados

Hooks personalizados para facilitar o uso dos serviços do Supabase estão em `src/hooks/`:

- `useSupabaseAuth.ts` - Gerenciamento de autenticação
- `useSupabaseUser.ts` - Gerenciamento de dados do usuário
- `useSupabaseFields.ts` - Gerenciamento de campos
- `useSupabaseBookings.ts` - Gerenciamento de reservas
- `useSupabaseTeams.ts` - Gerenciamento de times
- `useSupabasePlayers.ts` - Gerenciamento de jogadores
- `useSupabaseReviews.ts` - Gerenciamento de avaliações
- `useSupabaseGames.ts` - Gerenciamento de jogos

## Componentes com Supabase

Componentes que utilizam os serviços do Supabase estão em `src/components/`:

- `SupabaseFieldManagement.tsx` - Gerenciamento de campos
- `SupabaseFieldOwnerDashboard.tsx` - Dashboard do proprietário de areninhas
- `SupabaseLoginScreen.tsx` - Tela de login/registro
- `SupabaseBookingsScreen.tsx` - Tela de reservas
- `SupabaseFieldList.tsx` - Lista de campos
- `SupabaseFieldDetails.tsx` - Detalhes de um campo

## Utilitários

Utilitários para formatação, validação e tratamento de erros estão em `src/lib/supabase/`:

- `format.ts` - Formatação de datas, valores, etc.
- `validation.ts` - Validação de dados
- `errors.ts` - Tratamento de erros

## Tipos

Tipos TypeScript para os dados do Supabase estão em `src/types/supabase.ts`.

## Configuração do Banco de Dados

### Tabelas Principais

1. **users** - Usuários da aplicação
2. **fields** - Campos (areninhas)
3. **bookings** - Reservas
4. **teams** - Times
5. **players** - Jogadores
6. **reviews** - Avaliações
7. **games** - Jogos
8. **time_slots** - Horários disponíveis

### Exemplo de Schema

```sql
-- Users
create table users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  user_type text check (user_type in ('PLAYER', 'TEAM_OWNER', 'FIELD_OWNER')),
  name text,
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Fields
create table fields (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  location text not null,
  address text not null,
  description text,
  field_type text check (field_type in ('SOCIETY', 'GRASS', 'CONCRETE')),
  price_per_hour numeric not null,
  rating numeric default 0,
  owner_id uuid references users(id) not null,
  photos jsonb,
  amenities jsonb,
  rules text[],
  contact_info jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Bookings
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  field_id uuid references fields(id) not null,
  user_id uuid references users(id) not null,
  time_slot_id uuid not null,
  date date not null,
  status text check (status in ('PENDING', 'CONFIRMED', 'CANCELLED')) default 'PENDING',
  payment_status text check (payment_status in ('PENDING', 'PAID', 'REFUNDED')) default 'PENDING',
  total_amount numeric not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

## Autenticação

A autenticação é gerenciada pelo serviço de autenticação do Supabase. O contexto de autenticação está em `src/contexts/AuthContext.tsx`.

## Storage

O armazenamento de arquivos (imagens, documentos) é feito através do Supabase Storage. O serviço `storage.ts` facilita o upload e gerenciamento de arquivos.

## RLS (Row Level Security)

Configure as políticas de segurança de linha para controlar o acesso aos dados:

```sql
-- Exemplo: Apenas o proprietário pode editar seus campos
create policy "Users can update their own fields" on fields
for update using (auth.uid() = owner_id);

-- Exemplo: Todos podem ver os campos
create policy "Everyone can view fields" on fields
for select using (true);
```

## Testes

Para testar a integração com o Supabase:

1. Configure as variáveis de ambiente corretamente
2. Execute a aplicação em modo de desenvolvimento: `npm run dev`
3. Verifique se os componentes estão carregando dados do Supabase
4. Teste as operações de CRUD (criar, ler, atualizar, deletar)

## Troubleshooting

### Problemas Comuns

1. **CORS errors**: Verifique se a URL do seu aplicativo está na lista de URLs permitidas no dashboard do Supabase
2. **Authentication errors**: Certifique-se de que as chaves de API estão corretas
3. **RLS errors**: Verifique as políticas de segurança de linha no dashboard do Supabase

### Logs e Debugging

Use o console do navegador e os logs do Supabase para debugar problemas:

```javascript
// Exibir logs detalhados
console.log('Supabase client:', supabase)
```

## Recursos Adicionais

- [Documentação do Supabase](https://supabase.io/docs)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Supabase Community](https://github.com/supabase/supabase/discussions)