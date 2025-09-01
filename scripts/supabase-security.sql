-- Script para configurar funções de segurança do Supabase

-- Função para verificar se um usuário é proprietário de um campo
create or replace function is_field_owner(user_uuid uuid, field_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from fields f
    where f.id = field_uuid and f.owner_id = user_uuid
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário é dono de um time
create or replace function is_team_owner(user_uuid uuid, team_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from teams t
    where t.id = team_uuid and t.owner_id = user_uuid
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário é dono de um perfil de jogador
create or replace function is_player_owner(user_uuid uuid, player_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from players p
    where p.id = player_uuid and p.user_id = user_uuid
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário pode visualizar uma reserva
create or replace function can_view_booking(user_uuid uuid, booking_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from bookings b
    where b.id = booking_uuid and (b.user_id = user_uuid or 
      exists (
        select 1 from fields f
        where f.id = b.field_id and f.owner_id = user_uuid
      )
    )
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário pode modificar uma reserva
create or replace function can_modify_booking(user_uuid uuid, booking_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from bookings b
    where b.id = booking_uuid and b.user_id = user_uuid
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário pode visualizar um jogo
create or replace function can_view_game(user_uuid uuid, game_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from games g
    join teams t1 on g.team1_id = t1.id
    left join teams t2 on g.team2_id = t2.id
    where g.id = game_uuid and (t1.owner_id = user_uuid or 
      (t2 is not null and t2.owner_id = user_uuid) or
      exists (
        select 1 from players p
        where p.user_id = user_uuid and (p.team_id = g.team1_id or p.team_id = g.team2_id)
      )
    )
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário pode modificar um jogo
create or replace function can_modify_game(user_uuid uuid, game_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from games g
    join teams t on g.team1_id = t.id
    where g.id = game_uuid and t.owner_id = user_uuid
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário pode visualizar uma avaliação
create or replace function can_view_review(user_uuid uuid, review_uuid uuid)
returns boolean as $$
begin
  return true; -- Avaliações são públicas por padrão
end;
$$ language plpgsql;

-- Função para verificar se um usuário pode modificar uma avaliação
create or replace function can_modify_review(user_uuid uuid, review_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from reviews r
    where r.id = review_uuid and r.user_id = user_uuid
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário tem permissão de administrador
create or replace function is_admin(user_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from users u
    where u.id = user_uuid and u.email in (
      'admin@arenasobral.com',
      'suporte@arenasobral.com'
      -- Adicione mais emails de administradores conforme necessário
    )
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário pode criar um campo
create or replace function can_create_field(user_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from users u
    where u.id = user_uuid and u.user_type = 'FIELD_OWNER'
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário pode criar um time
create or replace function can_create_team(user_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from users u
    where u.id = user_uuid and u.user_type = 'TEAM_OWNER'
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário pode criar um perfil de jogador
create or replace function can_create_player(user_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from users u
    where u.id = user_uuid and u.user_type = 'PLAYER'
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário pode fazer uma reserva
create or replace function can_create_booking(user_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from users u
    where u.id = user_uuid
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário pode criar uma avaliação
create or replace function can_create_review(user_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from users u
    where u.id = user_uuid
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário pode criar um jogo
create or replace function can_create_game(user_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from users u
    join teams t on u.id = t.owner_id
    where u.id = user_uuid
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário pode acessar dados sensíveis
create or replace function can_access_sensitive_data(user_uuid uuid)
returns boolean as $$
begin
  return is_admin(user_uuid);
end;
$$ language plpgsql;

-- Função para registrar tentativa de acesso não autorizado
create or replace function log_unauthorized_access(
  user_uuid uuid,
  table_name text,
  action text,
  record_id uuid default null
)
returns void as $$
begin
  insert into audit_logs (
    table_name, 
    record_id, 
    action, 
    user_id, 
    ip_address, 
    user_agent,
    old_values,
    new_values
  ) values (
    table_name,
    record_id,
    'UNAUTHORIZED_' || action,
    user_uuid,
    inet_client_addr(),
    current_setting('application_name'),
    null,
    null
  );
end;
$$ language plpgsql;

-- Função para verificar rate limiting
create or replace function check_rate_limit(user_uuid uuid, action text)
returns boolean as $$
declare
  request_count integer;
  time_window interval := interval '1 hour';
begin
  select count(*) into request_count
  from audit_logs
  where user_id = user_uuid 
    and action = action
    and created_at > now() - time_window;
    
  -- Limite de 100 requisições por hora por usuário
  return request_count < 100;
end;
$$ language plpgsql;

-- Função para verificar se um usuário está bloqueado
create or replace function is_user_blocked(user_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from users u
    where u.id = user_uuid and u.status = 'BLOCKED'
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário tem email verificado
create or replace function is_email_verified(user_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from auth.users au
    where au.id = user_uuid and au.email_confirmed_at is not null
  );
end;
$$ language plpgsql;

-- Função para verificar se um usuário tem permissões suficientes para uma ação
create or replace function has_permission(user_uuid uuid, permission text)
returns boolean as $$
begin
  -- Esta função pode ser expandida para suportar um sistema de permissões mais complexo
  case permission
    when 'create_field' then return can_create_field(user_uuid);
    when 'create_team' then return can_create_team(user_uuid);
    when 'create_player' then return can_create_player(user_uuid);
    when 'create_booking' then return can_create_booking(user_uuid);
    when 'create_review' then return can_create_review(user_uuid);
    when 'create_game' then return can_create_game(user_uuid);
    when 'access_admin' then return is_admin(user_uuid);
    when 'access_sensitive_data' then return can_access_sensitive_data(user_uuid);
    else return false;
  end case;
end;
$$ language plpgsql;

-- Função para verificar todas as condições de segurança antes de uma operação
create or replace function check_security_conditions(
  user_uuid uuid,
  operation text,
  resource_type text,
  resource_id uuid default null
)
returns boolean as $$
begin
  -- Verificar se o usuário está bloqueado
  if is_user_blocked(user_uuid) then
    return false;
  end if;
  
  -- Verificar se o email está verificado (para operações sensíveis)
  if operation in ('create', 'update', 'delete') and not is_email_verified(user_uuid) then
    return false;
  end if;
  
  -- Verificar rate limiting
  if not check_rate_limit(user_uuid, operation || '_' || resource_type) then
    return false;
  end if;
  
  -- Verificar permissões específicas
  case operation
    when 'create' then
      case resource_type
        when 'field' then return can_create_field(user_uuid);
        when 'team' then return can_create_team(user_uuid);
        when 'player' then return can_create_player(user_uuid);
        when 'booking' then return can_create_booking(user_uuid);
        when 'review' then return can_create_review(user_uuid);
        when 'game' then return can_create_game(user_uuid);
        else return false;
      end case;
    when 'update', 'delete' then
      case resource_type
        when 'field' then return is_field_owner(user_uuid, resource_id);
        when 'team' then return is_team_owner(user_uuid, resource_id);
        when 'player' then return is_player_owner(user_uuid, resource_id);
        when 'booking' then return can_modify_booking(user_uuid, resource_id);
        when 'review' then return can_modify_review(user_uuid, resource_id);
        when 'game' then return can_modify_game(user_uuid, resource_id);
        else return false;
      end case;
    when 'view' then
      case resource_type
        when 'booking' then return can_view_booking(user_uuid, resource_id);
        when 'game' then return can_view_game(user_uuid, resource_id);
        when 'review' then return can_view_review(user_uuid, resource_id);
        else return true; -- Outros recursos são públicos por padrão
      end case;
    else
      return false;
  end case;
end;
$$ language plpgsql;

-- Função para aplicar proteção a nível de linha
create or replace function apply_row_level_security()
returns void as $$
begin
  -- Esta função seria usada para aplicar RLS dinamicamente
  -- Na prática, as políticas RLS são definidas diretamente nas tabelas
  raise notice 'RLS já aplicada através das políticas definidas nas tabelas';
end;
$$ language plpgsql;

-- Função para verificar integridade das permissões
create or replace function check_permissions_integrity()
returns table(
  issue text,
  description text
) as $$
begin
  -- Verificar usuários sem tipo definido
  return query
  select 
    'missing_user_type'::text as issue,
    'Usuário sem tipo definido: ' || u.email as description
  from users u
  where u.user_type is null;
  
  -- Verificar campos sem proprietário
  return query
  select 
    'field_without_owner'::text as issue,
    'Campo sem proprietário: ' || f.name as description
  from fields f
  where not exists (
    select 1 from users u where u.id = f.owner_id
  );
  
  -- Verificar times sem dono
  return query
  select 
    'team_without_owner'::text as issue,
    'Time sem dono: ' || t.name as description
  from teams t
  where not exists (
    select 1 from users u where u.id = t.owner_id
  );
  
  -- Verificar jogadores sem usuário
  return query
  select 
    'player_without_user'::text as issue,
    'Jogador sem usuário associado' as description
  from players p
  where not exists (
    select 1 from users u where u.id = p.user_id
  );
end;
$$ language plpgsql;