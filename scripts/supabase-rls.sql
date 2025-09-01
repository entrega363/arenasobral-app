-- Script para configurar as políticas de segurança de linha (RLS) do Supabase

-- Habilitar RLS para todas as tabelas
alter table users enable row level security;
alter table fields enable row level security;
alter table time_slots enable row level security;
alter table bookings enable row level security;
alter table teams enable row level security;
alter table players enable row level security;
alter table reviews enable row level security;
alter table games enable row level security;

-- Políticas para a tabela users
create policy "Usuários podem visualizar seus próprios dados" on users
for select using (auth.uid() = id);

create policy "Usuários podem atualizar seus próprios dados" on users
for update using (auth.uid() = id);

create policy "Usuários podem inserir seus próprios dados" on users
for insert with check (auth.uid() = id);

-- Políticas para a tabela fields
create policy "Todos podem visualizar campos" on fields
for select using (true);

create policy "Proprietários podem criar campos" on fields
for insert with check (auth.uid() = owner_id);

create policy "Proprietários podem atualizar seus próprios campos" on fields
for update using (auth.uid() = owner_id);

create policy "Proprietários podem deletar seus próprios campos" on fields
for delete using (auth.uid() = owner_id);

-- Políticas para a tabela time_slots
create policy "Todos podem visualizar slots de tempo" on time_slots
for select using (true);

create policy "Proprietários de campos podem gerenciar slots de tempo" on time_slots
for all using (
  exists (
    select 1 from fields 
    where fields.id = time_slots.field_id 
    and fields.owner_id = auth.uid()
  )
);

-- Políticas para a tabela bookings
create policy "Usuários podem visualizar suas próprias reservas" on bookings
for select using (auth.uid() = user_id);

create policy "Usuários podem criar reservas" on bookings
for insert with check (auth.uid() = user_id);

create policy "Usuários podem atualizar suas próprias reservas" on bookings
for update using (auth.uid() = user_id);

create policy "Usuários podem deletar suas próprias reservas" on bookings
for delete using (auth.uid() = user_id);

create policy "Proprietários de campos podem visualizar reservas em seus campos" on bookings
for select using (
  exists (
    select 1 from fields 
    where fields.id = bookings.field_id 
    and fields.owner_id = auth.uid()
  )
);

-- Políticas para a tabela teams
create policy "Todos podem visualizar times" on teams
for select using (true);

create policy "Usuários podem criar times" on teams
for insert with check (auth.uid() = owner_id);

create policy "Donos de times podem atualizar seus times" on teams
for update using (auth.uid() = owner_id);

create policy "Donos de times podem deletar seus times" on teams
for delete using (auth.uid() = owner_id);

-- Políticas para a tabela players
create policy "Todos podem visualizar jogadores" on players
for select using (true);

create policy "Usuários podem criar perfis de jogador" on players
for insert with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus perfis de jogador" on players
for update using (auth.uid() = user_id);

create policy "Usuários podem deletar seus perfis de jogador" on players
for delete using (auth.uid() = user_id);

-- Políticas para a tabela reviews
create policy "Todos podem visualizar avaliações" on reviews
for select using (true);

create policy "Usuários podem criar avaliações" on reviews
for insert with check (auth.uid() = user_id);

create policy "Usuários podem atualizar suas avaliações" on reviews
for update using (auth.uid() = user_id);

create policy "Usuários podem deletar suas avaliações" on reviews
for delete using (auth.uid() = user_id);

-- Políticas para a tabela games
create policy "Todos podem visualizar jogos" on games
for select using (true);

create policy "Usuários podem criar jogos" on games
for insert with check (
  exists (
    select 1 from teams 
    where teams.id = games.team1_id 
    and teams.owner_id = auth.uid()
  )
);

create policy "Donos de times podem atualizar jogos de seus times" on games
for update using (
  exists (
    select 1 from teams 
    where (teams.id = games.team1_id or teams.id = games.team2_id)
    and teams.owner_id = auth.uid()
  )
);

create policy "Donos de times podem deletar jogos de seus times" on games
for delete using (
  exists (
    select 1 from teams 
    where (teams.id = games.team1_id or teams.id = games.team2_id)
    and teams.owner_id = auth.uid()
  )
);