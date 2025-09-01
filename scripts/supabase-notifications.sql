-- Script para configurar funções de notificações do Supabase

-- Criar tabela para notificações
create table if not exists notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  message text not null,
  type text check (type in ('info', 'success', 'warning', 'error')) default 'info',
  read boolean default false,
  action_url text,
  created_at timestamp with time zone default now(),
  read_at timestamp with time zone
);

-- Índices para a tabela de notificações
create index if not exists idx_notifications_user_id on notifications(user_id);
create index if not exists idx_notifications_read on notifications(read);
create index if not exists idx_notifications_type on notifications(type);
create index if not exists idx_notifications_created_at on notifications(created_at);

-- Função para marcar notificação como lida
create or replace function mark_notification_as_read(notification_id uuid)
returns void as $$
begin
  update notifications 
  set read = true, read_at = now()
  where id = notification_id;
end;
$$ language plpgsql;

-- Função para marcar todas as notificações como lidas
create or replace function mark_all_notifications_as_read(user_uuid uuid)
returns void as $$
begin
  update notifications 
  set read = true, read_at = now()
  where user_id = user_uuid and read = false;
end;
$$ language plpgsql;

-- Função para criar notificação de reserva confirmada
create or replace function create_booking_confirmation_notification(booking_id uuid)
returns void as $$
declare
  booking_record record;
  user_email text;
begin
  select b.*, u.email into booking_record, user_email
  from bookings b
  join users u on b.user_id = u.id
  where b.id = booking_id;
  
  if found then
    insert into notifications (
      user_id, 
      title, 
      message, 
      type, 
      action_url
    ) values (
      booking_record.user_id,
      'Reserva Confirmada',
      'Sua reserva para ' || booking_record.date || ' às ' || booking_record.time || ' foi confirmada com sucesso!',
      'success',
      '/bookings/' || booking_id
    );
    
    -- Aqui você poderia integrar com um serviço de email/SMS
    -- perform send_email(user_email, 'Reserva Confirmada', '...');
  end if;
end;
$$ language plpgsql;

-- Função para criar notificação de cancelamento de reserva
create or replace function create_booking_cancellation_notification(booking_id uuid)
returns void as $$
declare
  booking_record record;
  user_email text;
begin
  select b.*, u.email into booking_record, user_email
  from bookings b
  join users u on b.user_id = u.id
  where b.id = booking_id;
  
  if found then
    insert into notifications (
      user_id, 
      title, 
      message, 
      type, 
      action_url
    ) values (
      booking_record.user_id,
      'Reserva Cancelada',
      'Sua reserva para ' || booking_record.date || ' às ' || booking_record.time || ' foi cancelada.',
      'warning',
      '/bookings/' || booking_id
    );
    
    -- Aqui você poderia integrar com um serviço de email/SMS
    -- perform send_email(user_email, 'Reserva Cancelada', '...');
  end if;
end;
$$ language plpgsql;

-- Função para criar notificação de nova avaliação
create or replace function create_new_review_notification(review_id uuid)
returns void as $$
declare
  review_record record;
  field_owner_id uuid;
begin
  select r.*, f.owner_id into review_record, field_owner_id
  from reviews r
  join fields f on r.field_id = f.id
  where r.id = review_id;
  
  if found then
    insert into notifications (
      user_id, 
      title, 
      message, 
      type, 
      action_url
    ) values (
      field_owner_id,
      'Nova Avaliação',
      'Você recebeu uma nova avaliação de ' || review_record.rating || ' estrelas para sua arena.',
      'info',
      '/fields/' || review_record.field_id
    );
  end if;
end;
$$ language plpgsql;

-- Função para criar notificação de lembrete de reserva
create or replace function create_booking_reminder_notification(booking_id uuid)
returns void as $$
declare
  booking_record record;
  user_email text;
begin
  select b.*, u.email into booking_record, user_email
  from bookings b
  join users u on b.user_id = u.id
  where b.id = booking_id;
  
  if found then
    insert into notifications (
      user_id, 
      title, 
      message, 
      type, 
      action_url
    ) values (
      booking_record.user_id,
      'Lembrete de Reserva',
      'Não se esqueça da sua reserva para ' || booking_record.date || ' às ' || booking_record.time || '.',
      'info',
      '/bookings/' || booking_id
    );
    
    -- Aqui você poderia integrar com um serviço de email/SMS
    -- perform send_email(user_email, 'Lembrete de Reserva', '...');
  end if;
end;
$$ language plpgsql;

-- Função para criar notificação de novo jogador interessado
create or replace function create_player_interest_notification(team_id uuid, player_id uuid)
returns void as $$
declare
  team_owner_id uuid;
  player_name text;
begin
  select t.owner_id into team_owner_id
  from teams t
  where t.id = team_id;
  
  select p.name into player_name
  from players p
  where p.id = player_id;
  
  if team_owner_id is not null and player_name is not null then
    insert into notifications (
      user_id, 
      title, 
      message, 
      type, 
      action_url
    ) values (
      team_owner_id,
      'Novo Jogador Interessado',
      player_name || ' está interessado em fazer parte do seu time!',
      'info',
      '/teams/' || team_id || '/players/' || player_id
    );
  end if;
end;
$$ language plpgsql;

-- Função para criar notificação de convite para time
create or replace function create_team_invite_notification(player_id uuid, team_id uuid)
returns void as $$
declare
  team_name text;
  player_user_id uuid;
begin
  select t.name into team_name
  from teams t
  where t.id = team_id;
  
  select p.user_id into player_user_id
  from players p
  where p.id = player_id;
  
  if team_name is not null and player_user_id is not null then
    insert into notifications (
      user_id, 
      title, 
      message, 
      type, 
      action_url
    ) values (
      player_user_id,
      'Convite para Time',
      'Você foi convidado para fazer parte do time ' || team_name || '!',
      'success',
      '/teams/' || team_id
    );
  end if;
end;
$$ language plpgsql;

-- Função para criar notificação de novo jogo agendado
create or replace function create_game_scheduled_notification(game_id uuid)
returns void as $$
declare
  game_record record;
begin
  select g.*, t1.name as team1_name, t2.name as team2_name into game_record
  from games g
  join teams t1 on g.team1_id = t1.id
  left join teams t2 on g.team2_id = t2.id
  where g.id = game_id;
  
  if found then
    -- Notificar dono do time 1
    insert into notifications (
      user_id, 
      title, 
      message, 
      type, 
      action_url
    ) 
    select 
      t1.owner_id,
      'Jogo Agendado',
      'Seu time ' || game_record.team1_name || ' tem um jogo agendado para ' || game_record.date || ' às ' || game_record.time || 
      case when game_record.team2_name is not null then ' contra ' || game_record.team2_name else '' end || '.',
      'info',
      '/games/' || game_id
    from teams t1
    where t1.id = game_record.team1_id;
    
    -- Notificar dono do time 2 (se existir)
    if game_record.team2_id is not null then
      insert into notifications (
        user_id, 
        title, 
        message, 
        type, 
        action_url
      ) 
      select 
        t2.owner_id,
        'Jogo Agendado',
        'Seu time ' || game_record.team2_name || ' tem um jogo agendado para ' || game_record.date || ' às ' || game_record.time || 
        ' contra ' || game_record.team1_name || '.',
        'info',
        '/games/' || game_id
      from teams t2
      where t2.id = game_record.team2_id;
    end if;
  end if;
end;
$$ language plpgsql;

-- Função para criar notificação de mudança de status de reserva
create or replace function create_booking_status_change_notification(booking_id uuid)
returns void as $$
declare
  booking_record record;
  user_email text;
begin
  select b.*, u.email into booking_record, user_email
  from bookings b
  join users u on b.user_id = u.id
  where b.id = booking_id;
  
  if found then
    insert into notifications (
      user_id, 
      title, 
      message, 
      type, 
      action_url
    ) values (
      booking_record.user_id,
      'Status da Reserva Atualizado',
      'O status da sua reserva para ' || booking_record.date || ' às ' || booking_record.time || 
      ' foi atualizado para: ' || booking_record.status || '.',
      case 
        when booking_record.status = 'CONFIRMED' then 'success'
        when booking_record.status = 'CANCELLED' then 'error'
        else 'info'
      end,
      '/bookings/' || booking_id
    );
    
    -- Aqui você poderia integrar com um serviço de email/SMS
    -- perform send_email(user_email, 'Status da Reserva Atualizado', '...');
  end if;
end;
$$ language plpgsql;

-- Função para obter notificações não lidas de um usuário
create or replace function get_unread_notifications(user_uuid uuid)
returns table(
  id uuid,
  title text,
  message text,
  type text,
  action_url text,
  created_at timestamp with time zone
) as $$
begin
  return query
  select 
    n.id,
    n.title,
    n.message,
    n.type,
    n.action_url,
    n.created_at
  from notifications n
  where n.user_id = user_uuid and n.read = false
  order by n.created_at desc
  limit 20;
end;
$$ language plpgsql;

-- Função para obter todas as notificações de um usuário
create or replace function get_all_notifications(user_uuid uuid, limit_count integer default 50)
returns table(
  id uuid,
  title text,
  message text,
  type text,
  read boolean,
  action_url text,
  created_at timestamp with time zone,
  read_at timestamp with time zone
) as $$
begin
  return query
  select 
    n.id,
    n.title,
    n.message,
    n.type,
    n.read,
    n.action_url,
    n.created_at,
    n.read_at
  from notifications n
  where n.user_id = user_uuid
  order by n.created_at desc
  limit limit_count;
end;
$$ language plpgsql;

-- Gatilho para criar notificação quando uma reserva é confirmada
create or replace function trigger_booking_confirmation_notification()
returns trigger as $$
begin
  if new.status = 'CONFIRMED' and (old is null or old.status != 'CONFIRMED') then
    perform create_booking_confirmation_notification(new.id);
  end if;
  
  return new;
end;
$$ language plpgsql;

create trigger booking_confirmation_notification_trigger
after insert or update on bookings
for each row
execute procedure trigger_booking_confirmation_notification();

-- Gatilho para criar notificação quando uma reserva é cancelada
create or replace function trigger_booking_cancellation_notification()
returns trigger as $$
begin
  if new.status = 'CANCELLED' and (old is null or old.status != 'CANCELLED') then
    perform create_booking_cancellation_notification(new.id);
  end if;
  
  return new;
end;
$$ language plpgsql;

create trigger booking_cancellation_notification_trigger
after update on bookings
for each row
execute procedure trigger_booking_cancellation_notification();

-- Gatilho para criar notificação quando uma avaliação é criada
create or replace function trigger_new_review_notification()
returns trigger as $$
begin
  perform create_new_review_notification(new.id);
  return new;
end;
$$ language plpgsql;

create trigger new_review_notification_trigger
after insert on reviews
for each row
execute procedure trigger_new_review_notification();