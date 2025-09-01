-- Script para configurar testes e migrações do Supabase

-- Criar schema para testes
create schema if not exists test;

-- Função para limpar dados de teste
create or replace function test.reset_test_data()
returns void as $$
begin
  -- Limpar tabelas em ordem reversa de dependências
  truncate table test.games restart identity cascade;
  truncate table test.reviews restart identity cascade;
  truncate table test.players restart identity cascade;
  truncate table test.teams restart identity cascade;
  truncate table test.bookings restart identity cascade;
  truncate table test.time_slots restart identity cascade;
  truncate table test.fields restart identity cascade;
  truncate table test.users restart identity cascade;
end;
$$ language plpgsql;

-- Função para inserir dados de teste
create or replace function test.seed_test_data()
returns void as $$
begin
  -- Inserir usuários de teste
  insert into test.users (id, email, user_type, name, phone) values
  ('11111111-1111-1111-1111-111111111111', 'jogador@teste.com', 'PLAYER', 'Jogador Teste', '(88) 99999-1111'),
  ('22222222-2222-2222-2222-222222222222', 'time@teste.com', 'TEAM_OWNER', 'Dono de Time Teste', '(88) 99999-2222'),
  ('33333333-3333-3333-3333-333333333333', 'areninha@teste.com', 'FIELD_OWNER', 'Dono de Areninha Teste', '(88) 99999-3333');

  -- Inserir campos de teste
  insert into test.fields (id, name, location, address, description, field_type, price_per_hour, rating, owner_id) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Arena Teste 1', 'Centro', 'Rua Teste, 123', 'Arena de teste 1', 'SOCIETY', 80, 4.5, '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Arena Teste 2', 'Vila Nova', 'Rua Teste, 456', 'Arena de teste 2', 'GRASS', 100, 4.2, '33333333-3333-3333-3333-333333333333');

  -- Inserir slots de tempo de teste
  insert into test.time_slots (id, field_id, day_of_week, start_time, end_time, price, available) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '18:00:00', '19:00:00', 80, true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '19:00:00', '20:00:00', 80, true);

  -- Inserir reservas de teste
  insert into test.bookings (id, field_id, user_id, time_slot_id, date, status, payment_status, total_amount) values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '2023-01-01', 'CONFIRMED', 'PAID', 80);

  -- Inserir times de teste
  insert into test.teams (id, name, description, owner_id) values
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Time Teste 1', 'Time de teste 1', '22222222-2222-2222-2222-222222222222');

  -- Inserir jogadores de teste
  insert into test.players (id, user_id, name, position, skill_level, phone) values
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', '11111111-1111-1111-1111-111111111111', 'Jogador Teste', 'Atacante', 4, '(88) 99999-1111');

  -- Inserir avaliações de teste
  insert into test.reviews (id, field_id, user_id, rating, comment) values
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 5, 'Excelente arena!');

  -- Inserir jogos de teste
  insert into test.games (id, field_id, team1_id, team2_id, date, time, status) values
  ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ffffffff-ffff-ffff-ffff-ffffffffffff', null, '2023-01-01', '18:00:00', 'SCHEDULED');
end;
$$ language plpgsql;

-- Função para executar migrações
create or replace function migrate(version text)
returns void as $$
begin
  -- Esta função seria expandida para incluir migrações específicas
  raise notice 'Executando migração para versão %', version;
  
  -- Exemplo de migração:
  -- if version = '1.0.1' then
  --   alter table fields add column if not exists capacity integer;
  -- end if;
end;
$$ language plpgsql;

-- Função para verificar integridade dos dados
create or replace function check_data_integrity()
returns table(table_name text, issue text) as $$
begin
  -- Verificar campos sem proprietário
  return query
  select 'fields'::text, 'Campo sem proprietário: ' || f.name
  from fields f
  where not exists (
    select 1 from users u where u.id = f.owner_id
  );
  
  -- Verificar reservas sem usuário
  return query
  select 'bookings'::text, 'Reserva sem usuário: ' || b.id
  from bookings b
  where not exists (
    select 1 from users u where u.id = b.user_id
  );
  
  -- Verificar reservas sem campo
  return query
  select 'bookings'::text, 'Reserva sem campo: ' || b.id
  from bookings b
  where not exists (
    select 1 from fields f where f.id = b.field_id
  );
  
  -- Verificar avaliações sem usuário
  return query
  select 'reviews'::text, 'Avaliação sem usuário: ' || r.id
  from reviews r
  where not exists (
    select 1 from users u where u.id = r.user_id
  );
  
  -- Verificar avaliações sem campo
  return query
  select 'reviews'::text, 'Avaliação sem campo: ' || r.id
  from reviews r
  where not exists (
    select 1 from fields f where f.id = r.field_id
  );
end;
$$ language plpgsql;

-- Função para backup de dados
create or replace function backup_data()
returns void as $$
begin
  -- Esta função seria implementada para fazer backup dos dados
  raise notice 'Backup dos dados iniciado...';
  
  -- Exemplo de backup (em produção, isso seria mais complexo):
  -- copy users to '/backups/users_backup.csv' csv header;
  -- copy fields to '/backups/fields_backup.csv' csv header;
  -- etc.
end;
$$ language plpgsql;

-- Função para restaurar dados
create or replace function restore_data()
returns void as $$
begin
  -- Esta função seria implementada para restaurar os dados
  raise notice 'Restauração dos dados iniciada...';
  
  -- Exemplo de restauração (em produção, isso seria mais complexo):
  -- copy users from '/backups/users_backup.csv' csv header;
  -- copy fields from '/backups/fields_backup.csv' csv header;
  -- etc.
end;
$$ language plpgsql;