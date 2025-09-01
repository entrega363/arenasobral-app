-- Script para configurar índices e otimizações do Supabase

-- Índices para a tabela users
create index if not exists idx_users_email on users(email);
create index if not exists idx_users_user_type on users(user_type);
create index if not exists idx_users_created_at on users(created_at);

-- Índices para a tabela fields
create index if not exists idx_fields_owner_id on fields(owner_id);
create index if not exists idx_fields_location on fields(location);
create index if not exists idx_fields_field_type on fields(field_type);
create index if not exists idx_fields_rating on fields(rating);
create index if not exists idx_fields_price_per_hour on fields(price_per_hour);
create index if not exists idx_fields_created_at on fields(created_at);

-- Índices para a tabela time_slots
create index if not exists idx_time_slots_field_id on time_slots(field_id);
create index if not exists idx_time_slots_day_of_week on time_slots(day_of_week);
create index if not exists idx_time_slots_start_time on time_slots(start_time);
create index if not exists idx_time_slots_available on time_slots(available);
create index if not exists idx_time_slots_created_at on time_slots(created_at);

-- Índices para a tabela bookings
create index if not exists idx_bookings_field_id on bookings(field_id);
create index if not exists idx_bookings_user_id on bookings(user_id);
create index if not exists idx_bookings_time_slot_id on bookings(time_slot_id);
create index if not exists idx_bookings_date on bookings(date);
create index if not exists idx_bookings_status on bookings(status);
create index if not exists idx_bookings_payment_status on bookings(payment_status);
create index if not exists idx_bookings_created_at on bookings(created_at);

-- Índices para a tabela teams
create index if not exists idx_teams_owner_id on teams(owner_id);
create index if not exists idx_teams_name on teams(name);
create index if not exists idx_teams_created_at on teams(created_at);

-- Índices para a tabela players
create index if not exists idx_players_user_id on players(user_id);
create index if not exists idx_players_name on players(name);
create index if not exists idx_players_position on players(position);
create index if not exists idx_players_skill_level on players(skill_level);
create index if not exists idx_players_created_at on players(created_at);

-- Índices para a tabela reviews
create index if not exists idx_reviews_field_id on reviews(field_id);
create index if not exists idx_reviews_user_id on reviews(user_id);
create index if not exists idx_reviews_rating on reviews(rating);
create index if not exists idx_reviews_created_at on reviews(created_at);

-- Índices para a tabela games
create index if not exists idx_games_field_id on games(field_id);
create index if not exists idx_games_team1_id on games(team1_id);
create index if not exists idx_games_team2_id on games(team2_id);
create index if not exists idx_games_date on games(date);
create index if not exists idx_games_status on games(status);
create index if not exists idx_games_created_at on games(created_at);

-- Índices compostos para consultas frequentes
create index if not exists idx_bookings_field_date on bookings(field_id, date);
create index if not exists idx_bookings_user_date on bookings(user_id, date);
create index if not exists idx_time_slots_field_day on time_slots(field_id, day_of_week);
create index if not exists idx_reviews_field_rating on reviews(field_id, rating);
create index if not exists idx_games_field_date on games(field_id, date);
create index if not exists idx_games_team_date on games(team1_id, date);

-- Estatísticas para otimização de consultas
analyze users;
analyze fields;
analyze time_slots;
analyze bookings;
analyze teams;
analyze players;
analyze reviews;
analyze games;

-- Configurar autovacuum para tabelas grandes
alter table bookings set (autovacuum_vacuum_scale_factor = 0.05);
alter table fields set (autovacuum_vacuum_scale_factor = 0.05);
alter table users set (autovacuum_vacuum_scale_factor = 0.05);

-- Criar visões materializadas para relatórios
create materialized view if not exists field_bookings_summary as
select 
  f.id as field_id,
  f.name as field_name,
  count(b.id) as total_bookings,
  sum(b.total_amount) as total_revenue,
  avg(b.total_amount) as avg_booking_value
from fields f
left join bookings b on f.id = b.field_id
group by f.id, f.name;

create materialized view if not exists user_activity_summary as
select 
  u.id as user_id,
  u.email,
  count(b.id) as total_bookings,
  count(r.id) as total_reviews,
  max(b.created_at) as last_activity
from users u
left join bookings b on u.id = b.user_id
left join reviews r on u.id = r.user_id
group by u.id, u.email;

-- Índices para visões materializadas
create index if not exists idx_field_bookings_summary_field_id on field_bookings_summary(field_id);
create index if not exists idx_user_activity_summary_user_id on user_activity_summary(user_id);

-- Função para atualizar visões materializadas
create or replace function refresh_materialized_views()
returns void as $$
begin
  refresh materialized view concurrently field_bookings_summary;
  refresh materialized view concurrently user_activity_summary;
end;
$$ language plpgsql;

-- Gatilho para atualizar visões materializadas após alterações importantes
create or replace function trigger_refresh_materialized_views()
returns trigger as $$
begin
  perform refresh_materialized_views();
  return new;
end;
$$ language plpgsql;

-- Agendar atualização de visões materializadas (isso seria feito externamente)
-- select cron.schedule('refresh-materialized-views', '0 2 * * *', $$select refresh_materialized_views()$$);