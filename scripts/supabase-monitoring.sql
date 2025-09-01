-- Script para configurar monitoramento e logs do Supabase

-- Criar tabela para logs de auditoria
create table if not exists audit_logs (
  id uuid default uuid_generate_v4() primary key,
  table_name text not null,
  record_id uuid,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  old_values jsonb,
  new_values jsonb,
  user_id uuid references auth.users(id),
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default now()
);

-- Índices para a tabela de logs de auditoria
create index if not exists idx_audit_logs_table_name on audit_logs(table_name);
create index if not exists idx_audit_logs_record_id on audit_logs(record_id);
create index if not exists idx_audit_logs_action on audit_logs(action);
create index if not exists idx_audit_logs_user_id on audit_logs(user_id);
create index if not exists idx_audit_logs_created_at on audit_logs(created_at);

-- Função para registrar logs de auditoria
create or replace function audit_trigger()
returns trigger as $$
begin
  if (tg_op = 'DELETE') then
    insert into audit_logs (
      table_name, record_id, action, old_values, user_id, ip_address, user_agent
    ) values (
      tg_table_name, old.id, 'DELETE', to_jsonb(old), auth.uid(), inet_client_addr(), current_setting('application_name')
    );
    return old;
  elsif (tg_op = 'UPDATE') then
    insert into audit_logs (
      table_name, record_id, action, old_values, new_values, user_id, ip_address, user_agent
    ) values (
      tg_table_name, new.id, 'UPDATE', to_jsonb(old), to_jsonb(new), auth.uid(), inet_client_addr(), current_setting('application_name')
    );
    return new;
  elsif (tg_op = 'INSERT') then
    insert into audit_logs (
      table_name, record_id, action, new_values, user_id, ip_address, user_agent
    ) values (
      tg_table_name, new.id, 'INSERT', to_jsonb(new), auth.uid(), inet_client_addr(), current_setting('application_name')
    );
    return new;
  end if;
  
  return null;
end;
$$ language plpgsql;

-- Gatilhos para auditoria (opcional - pode impactar performance)
-- create trigger audit_users_trigger
-- after insert or update or delete on users
-- for each row execute procedure audit_trigger();

-- create trigger audit_fields_trigger
-- after insert or update or delete on fields
-- for each row execute procedure audit_trigger();

-- create trigger audit_bookings_trigger
-- after insert or update or delete on bookings
-- for each row execute procedure audit_trigger();

-- Visão para monitorar atividade recente
create or replace view recent_activity as
select 
  al.id,
  al.table_name,
  al.action,
  al.user_id,
  u.email as user_email,
  al.created_at,
  al.ip_address
from audit_logs al
left join users u on al.user_id = u.id
where al.created_at > now() - interval '1 hour'
order by al.created_at desc
limit 100;

-- Visão para estatísticas de uso
create or replace view usage_statistics as
select 
  date_trunc('day', created_at) as day,
  table_name,
  action,
  count(*) as count
from audit_logs
where created_at > now() - interval '30 days'
group by date_trunc('day', created_at), table_name, action
order by day desc, table_name, action;

-- Função para limpar logs antigos
create or replace function cleanup_old_logs()
returns void as $$
begin
  delete from audit_logs 
  where created_at < now() - interval '90 days';
end;
$$ language plpgsql;

-- Configurar métricas de performance
create extension if not exists pg_stat_statements;

-- Visão para queries lentas
create or replace view slow_queries as
select 
  query,
  calls,
  total_time,
  mean_time,
  rows,
  100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) as hit_percent
from pg_stat_statements
where calls > 10
order by mean_time desc
limit 20;

-- Visão para conexões ativas
create or replace view active_connections as
select 
  datname,
  usename,
  application_name,
  client_addr,
  backend_start,
  state,
  query
from pg_stat_activity
where state = 'active';

-- Função para monitorar saúde do banco
create or replace function check_database_health()
returns table(
  check_name text,
  status text,
  details text
) as $$
begin
  -- Verificar conexões
  return query
  select 
    'active_connections'::text,
    case when count(*) < 100 then 'ok'::text else 'warning'::text end,
    count(*)::text || ' conexões ativas'
  from pg_stat_activity 
  where state = 'active';
  
  -- Verificar tamanho do banco
  return query
  select 
    'database_size'::text,
    case when pg_database_size(current_database()) < 1073741824 then 'ok'::text else 'warning'::text end,
    pg_size_pretty(pg_database_size(current_database()))
  ;
  
  -- Verificar tabelas sem índices
  return query
  select 
    'tables_without_indexes'::text,
    case when count(*) = 0 then 'ok'::text else 'warning'::text end,
    count(*)::text || ' tabelas sem índices'
  from pg_stat_user_tables 
  where idx_tup_fetch = 0;
end;
$$ language plpgsql;

-- Visão para alertas
create or replace view system_alerts as
select 
  'high_connection_count' as alert_type,
  'Número alto de conexões ativas' as message,
  count(*) as value,
  now() as created_at
from pg_stat_activity 
where state = 'active'
group by state
having count(*) > 50

union all

select 
  'slow_queries' as alert_type,
  'Queries com tempo médio alto' as message,
  count(*) as value,
  now() as created_at
from pg_stat_statements
where mean_time > 1000
group by mean_time
having count(*) > 5

union all

select 
  'large_table_size' as alert_type,
  'Tabelas com tamanho acima de 100MB' as message,
  count(*) as value,
  now() as created_at
from (
  select pg_total_relation_size(c.oid) as size
  from pg_class c
  left join pg_namespace n on n.oid = c.relnamespace
  where n.nspname not in ('pg_catalog', 'information_schema')
  and c.relkind = 'r'
) t
where size > 104857600
group by size
having count(*) > 0;