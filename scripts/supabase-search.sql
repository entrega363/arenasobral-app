-- Script para configurar funções de busca e filtragem do Supabase

-- Função para busca textual em campos
create or replace function search_fields(query text)
returns table(
  id uuid,
  name text,
  location text,
  description text,
  rating numeric,
  price_per_hour numeric
) as $$
begin
  return query
  select 
    f.id,
    f.name,
    f.location,
    f.description,
    f.rating,
    f.price_per_hour
  from fields f
  where 
    f.name ilike '%' || query || '%' or
    f.location ilike '%' || query || '%' or
    f.description ilike '%' || query || '%'
  order by 
    case 
      when f.name ilike query || '%' then 1
      when f.name ilike '%' || query || '%' then 2
      else 3
    end,
    f.rating desc,
    f.name
  limit 50;
end;
$$ language plpgsql;

-- Função para busca textual em times
create or replace function search_teams(query text)
returns table(
  id uuid,
  name text,
  description text
) as $$
begin
  return query
  select 
    t.id,
    t.name,
    t.description
  from teams t
  where 
    t.name ilike '%' || query || '%' or
    t.description ilike '%' || query || '%'
  order by 
    case 
      when t.name ilike query || '%' then 1
      when t.name ilike '%' || query || '%' then 2
      else 3
    end,
    t.name
  limit 50;
end;
$$ language plpgsql;

-- Função para busca textual em jogadores
create or replace function search_players(query text)
returns table(
  id uuid,
  name text,
  position text
) as $$
begin
  return query
  select 
    p.id,
    p.name,
    p.position
  from players p
  where 
    p.name ilike '%' || query || '%' or
    p.position ilike '%' || query || '%'
  order by 
    case 
      when p.name ilike query || '%' then 1
      when p.name ilike '%' || query || '%' then 2
      else 3
    end,
    p.name
  limit 50;
end;
$$ language plpgsql;

-- Função para filtrar campos por localização e distância
create or replace function filter_fields_by_location(
  lat double precision,
  lon double precision,
  max_distance_km double precision default 10
)
returns table(
  id uuid,
  name text,
  location text,
  rating numeric,
  price_per_hour numeric,
  distance_km double precision
) as $$
begin
  return query
  select 
    f.id,
    f.name,
    f.location,
    f.rating,
    f.price_per_hour,
    calculate_distance(lat, lon, f.latitude, f.longitude) as distance_km
  from fields f
  where 
    f.latitude is not null and 
    f.longitude is not null and
    calculate_distance(lat, lon, f.latitude, f.longitude) <= max_distance_km
  order by distance_km
  limit 50;
end;
$$ language plpgsql;

-- Função para filtrar campos por disponibilidade
create or replace function filter_fields_by_availability(
  date_value date,
  start_time time,
  end_time time
)
returns table(
  id uuid,
  name text,
  location text,
  rating numeric,
  price_per_hour numeric
) as $$
begin
  return query
  select distinct
    f.id,
    f.name,
    f.location,
    f.rating,
    f.price_per_hour
  from fields f
  join time_slots ts on f.id = ts.field_id
  where 
    ts.day_of_week = extract(dow from date_value) and
    ts.start_time <= start_time and
    ts.end_time >= end_time and
    ts.available = true
  order by f.rating desc, f.name
  limit 50;
end;
$$ language plpgsql;

-- Função para filtrar campos por preço
create or replace function filter_fields_by_price(
  min_price numeric,
  max_price numeric
)
returns table(
  id uuid,
  name text,
  location text,
  rating numeric,
  price_per_hour numeric
) as $$
begin
  return query
  select 
    f.id,
    f.name,
    f.location,
    f.rating,
    f.price_per_hour
  from fields f
  where 
    f.price_per_hour between min_price and max_price
  order by f.price_per_hour, f.rating desc
  limit 50;
end;
$$ language plpgsql;

-- Função para filtrar campos por tipo
create or replace function filter_fields_by_type(
  field_type text
)
returns table(
  id uuid,
  name text,
  location text,
  rating numeric,
  price_per_hour numeric
) as $$
begin
  return query
  select 
    f.id,
    f.name,
    f.location,
    f.rating,
    f.price_per_hour
  from fields f
  where 
    f.field_type = field_type
  order by f.rating desc, f.name
  limit 50;
end;
$$ language plpgsql;

-- Função para filtrar campos por avaliação
create or replace function filter_fields_by_rating(
  min_rating numeric
)
returns table(
  id uuid,
  name text,
  location text,
  rating numeric,
  price_per_hour numeric
) as $$
begin
  return query
  select 
    f.id,
    f.name,
    f.location,
    f.rating,
    f.price_per_hour
  from fields f
  where 
    f.rating >= min_rating
  order by f.rating desc, f.name
  limit 50;
end;
$$ language plpgsql;

-- Função para filtrar campos por comodidades
create or replace function filter_fields_by_amenities(
  amenity_names text[]
)
returns table(
  id uuid,
  name text,
  location text,
  rating numeric,
  price_per_hour numeric
) as $$
begin
  return query
  select 
    f.id,
    f.name,
    f.location,
    f.rating,
    f.price_per_hour
  from fields f
  where 
    f.amenities @> jsonb_build_array(
      select jsonb_build_object('name', amenity_name)
      from unnest(amenity_names) as amenity_name
    )
  order by f.rating desc, f.name
  limit 50;
end;
$$ language plpgsql;

-- Função para busca combinada de campos
create or replace function search_fields_combined(
  query text default '',
  location text default '',
  field_type text default '',
  min_price numeric default 0,
  max_price numeric default 9999,
  min_rating numeric default 0,
  date_value date default null,
  start_time time default null,
  end_time time default null,
  lat double precision default null,
  lon double precision default null,
  max_distance_km double precision default null
)
returns table(
  id uuid,
  name text,
  location text,
  description text,
  field_type text,
  rating numeric,
  price_per_hour numeric,
  distance_km double precision
) as $$
begin
  return query
  select 
    f.id,
    f.name,
    f.location,
    f.description,
    f.field_type,
    f.rating,
    f.price_per_hour,
    case 
      when lat is not null and lon is not null and f.latitude is not null and f.longitude is not null
      then calculate_distance(lat, lon, f.latitude, f.longitude)
      else null
    end as distance_km
  from fields f
  where 
    -- Busca textual
    (
      query = '' or 
      f.name ilike '%' || query || '%' or
      f.location ilike '%' || query || '%' or
      f.description ilike '%' || query || '%'
    )
    and
    -- Localização
    (
      location = '' or 
      f.location ilike '%' || location || '%'
    )
    and
    -- Tipo de campo
    (
      field_type = '' or 
      f.field_type = field_type
    )
    and
    -- Preço
    f.price_per_hour between min_price and max_price
    and
    -- Avaliação
    f.rating >= min_rating
    and
    -- Disponibilidade (se data e horário forem fornecidos)
    (
      date_value is null or start_time is null or end_time is null or
      exists (
        select 1 from time_slots ts
        where 
          ts.field_id = f.id and
          ts.day_of_week = extract(dow from date_value) and
          ts.start_time <= start_time and
          ts.end_time >= end_time and
          ts.available = true
      )
    )
    and
    -- Distância (se coordenadas forem fornecidas)
    (
      lat is null or lon is null or max_distance_km is null or
      (f.latitude is not null and f.longitude is not null and
       calculate_distance(lat, lon, f.latitude, f.longitude) <= max_distance_km)
    )
  order by 
    case 
      when query != '' and (f.name ilike query || '%' or f.location ilike query || '%') then 1
      when query != '' and (f.name ilike '%' || query || '%' or f.location ilike '%' || query || '%') then 2
      else 3
    end,
    f.rating desc,
    f.name
  limit 50;
end;
$$ language plpgsql;

-- Função para autocomplete de localizações
create or replace function autocomplete_locations(query text)
returns table(location text) as $$
begin
  return query
  select distinct f.location
  from fields f
  where f.location ilike query || '%'
  order by f.location
  limit 10;
end;
$$ language plpgsql;

-- Função para obter sugestões de busca
create or replace function get_search_suggestions(query text)
returns table(suggestion text) as $$
begin
  return query
  select distinct f.name as suggestion
  from fields f
  where f.name ilike query || '%'
  union
  select distinct f.location as suggestion
  from fields f
  where f.location ilike query || '%'
  order by suggestion
  limit 10;
end;
$$ language plpgsql;