-- Script para popular o banco de dados com dados de exemplo

-- Inserir usuários de exemplo
insert into users (id, email, user_type, name, phone) values
('11111111-1111-1111-1111-111111111111', 'jogador@teste.com', 'PLAYER', 'Jogador Teste', '(88) 99999-1111'),
('22222222-2222-2222-2222-222222222222', 'time@teste.com', 'TEAM_OWNER', 'Dono de Time Teste', '(88) 99999-2222'),
('33333333-3333-3333-3333-333333333333', 'areninha@teste.com', 'FIELD_OWNER', 'Dono de Areninha Teste', '(88) 99999-3333')
on conflict (id) do nothing;

-- Inserir campos de exemplo
insert into fields (id, name, location, address, description, field_type, price_per_hour, rating, owner_id) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Arena Sobral Central', 'Centro', 'Rua Principal, 123 - Centro', 'Areninha society com vestiário e estacionamento', 'SOCIETY', 80, 4.5, '33333333-3333-3333-3333-333333333333'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Quadra do Zé', 'Vila Nova', 'Rua das Palmeiras, 456 - Vila Nova', 'Quadra de grama sintética', 'GRASS', 100, 4.2, '33333333-3333-3333-3333-333333333333')
on conflict (id) do nothing;

-- Inserir slots de tempo de exemplo
insert into time_slots (id, field_id, day_of_week, start_time, end_time, price, available) values
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '18:00:00', '19:00:00', 80, true),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, '19:00:00', '20:00:00', 80, true),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, '20:00:00', '21:00:00', 100, true)
on conflict (id) do nothing;

-- Inserir reservas de exemplo
insert into bookings (id, field_id, user_id, time_slot_id, date, status, payment_status, total_amount) values
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '2023-01-01', 'CONFIRMED', 'PAID', 80),
('00000000-0000-0000-0000-000000000000', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2023-01-02', 'PENDING', 'PENDING', 100)
on conflict (id) do nothing;

-- Inserir times de exemplo
insert into teams (id, name, description, owner_id) values
('12345678-1234-1234-1234-123456789012', 'Vila Nove F.C.', 'Time da Vila Nove', '22222222-2222-2222-2222-222222222222'),
('23456789-2345-2345-2345-234567890123', 'Amigos da Bola', 'Time de amigos que jogam aos finais de semana', '22222222-2222-2222-2222-222222222222')
on conflict (id) do nothing;

-- Inserir jogadores de exemplo
insert into players (id, user_id, name, position, skill_level, phone) values
('34567890-3456-3456-3456-345678901234', '11111111-1111-1111-1111-111111111111', 'Jogador Teste', 'Atacante', 4, '(88) 99999-1111')
on conflict (id) do nothing;

-- Inserir avaliações de exemplo
insert into reviews (id, field_id, user_id, rating, comment) values
('45678901-4567-4567-4567-456789012345', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 5, 'Excelente arena!'),
('56789012-5678-5678-5678-567890123456', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 4, 'Boa quadra, mas poderia ter mais iluminação.')
on conflict (id) do nothing;

-- Inserir jogos de exemplo
insert into games (id, field_id, team1_id, team2_id, date, time, status) values
('67890123-6789-6789-6789-678901234567', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '12345678-1234-1234-1234-123456789012', '23456789-2345-2345-2345-234567890123', '2023-01-01', '18:00:00', 'SCHEDULED')
on conflict (id) do nothing;

-- Mensagem de conclusão
\echo 'Banco de dados populado com dados de exemplo com sucesso!'