-- Script para configurar funções de utilidade do Supabase

-- Função para gerar ID único
create or replace function generate_unique_id()
returns text as $$
begin
  return gen_random_uuid()::text;
end;
$$ language plpgsql;

-- Função para formatar telefone
create or replace function format_phone(phone text)
returns text as $$
begin
  -- Remover todos os caracteres não numéricos
  phone := regexp_replace(phone, '[^0-9]', '', 'g');
  
  -- Formatar como (XX) XXXXX-XXXX
  if length(phone) = 11 then
    return '(' || substring(phone, 1, 2) || ') ' || substring(phone, 3, 5) || '-' || substring(phone, 8, 4);
  end if;
  
  -- Formatar como (XX) XXXX-XXXX
  if length(phone) = 10 then
    return '(' || substring(phone, 1, 2) || ') ' || substring(phone, 3, 4) || '-' || substring(phone, 7, 4);
  end if;
  
  return phone;
end;
$$ language plpgsql;

-- Função para validar email
create or replace function is_valid_email(email text)
returns boolean as $$
begin
  return email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
end;
$$ language plpgsql;

-- Função para calcular idade
create or replace function calculate_age(birth_date date)
returns integer as $$
begin
  return extract(year from age(birth_date));
end;
$$ language plpgsql;

-- Função para formatar moeda
create or replace function format_currency(amount numeric)
returns text as $$
begin
  return to_char(amount, 'L999G999G999D99');
end;
$$ language plpgsql;

-- Função para calcular distância entre coordenadas (usando fórmula haversine)
create or replace function calculate_distance(
  lat1 double precision,
  lon1 double precision,
  lat2 double precision,
  lon2 double precision
)
returns double precision as $$
declare
  R double precision := 6371; -- Raio da Terra em km
  dLat double precision;
  dLon double precision;
  a double precision;
  c double precision;
  distance double precision;
begin
  dLat := radians(lat2 - lat1);
  dLon := radians(lon2 - lon1);
  
  a := sin(dLat/2) * sin(dLat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dLon/2) * sin(dLon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  distance := R * c;
  
  return distance;
end;
$$ language plpgsql;

-- Função para gerar slug
create or replace function generate_slug(text text)
returns text as $$
begin
  return lower(regexp_replace(regexp_replace(text, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
end;
$$ language plpgsql;

-- Função para truncar texto
create or replace function truncate_text(text text, length integer)
returns text as $$
begin
  if length(text) <= length then
    return text;
  else
    return substring(text, 1, length) || '...';
  end if;
end;
$$ language plpgsql;

-- Função para converter tempo em minutos
create or replace function time_to_minutes(time_value time)
returns integer as $$
begin
  return extract(hour from time_value) * 60 + extract(minute from time_value);
end;
$$ language plpgsql;

-- Função para converter minutos em tempo
create or replace function minutes_to_time(minutes integer)
returns time as $$
begin
  return make_time(minutes / 60, minutes % 60, 0);
end;
$$ language plpgsql;

-- Função para verificar se um horário está dentro de um intervalo
create or replace function is_time_in_range(
  time_value time,
  start_time time,
  end_time time
)
returns boolean as $$
begin
  return time_value >= start_time and time_value <= end_time;
end;
$$ language plpgsql;

-- Função para calcular o próximo dia da semana
create or replace function next_weekday(date_value date, weekday integer)
returns date as $$
begin
  return date_value + (7 - extract(dow from date_value) + weekday) % 7;
end;
$$ language plpgsql;

-- Função para gerar série de datas
create or replace function generate_date_series(
  start_date date,
  end_date date,
  interval_text text default '1 day'
)
returns table(date_value date) as $$
begin
  return query
  select generate_series(start_date, end_date, interval_text)::date;
end;
$$ language plpgsql;

-- Função para calcular dias úteis entre duas datas
create or replace function business_days_between(
  start_date date,
  end_date date
)
returns integer as $$
declare
  days integer := 0;
  current_date date := start_date;
begin
  while current_date <= end_date loop
    if extract(dow from current_date) not in (0, 6) then -- 0 = Domingo, 6 = Sábado
      days := days + 1;
    end if;
    current_date := current_date + interval '1 day';
  end loop;
  
  return days;
end;
$$ language plpgsql;

-- Função para verificar se uma data é feriado (exemplo básico)
create or replace function is_holiday(date_value date)
returns boolean as $$
begin
  -- Esta é uma implementação básica - em produção, você pode querer
  -- usar uma tabela de feriados ou uma API externa
  return date_value in (
    -- Feriados fixos no Brasil
    make_date(extract(year from date_value)::integer, 1, 1),   -- Ano Novo
    make_date(extract(year from date_value)::integer, 4, 21),  -- Tiradentes
    make_date(extract(year from date_value)::integer, 5, 1),   -- Dia do Trabalho
    make_date(extract(year from date_value)::integer, 9, 7),   -- Independência
    make_date(extract(year from date_value)::integer, 10, 12), -- Nossa Senhora Aparecida
    make_date(extract(year from date_value)::integer, 11, 2),  -- Finados
    make_date(extract(year from date_value)::integer, 11, 15), -- Proclamação da República
    make_date(extract(year from date_value)::integer, 12, 25)  -- Natal
  );
end;
$$ language plpgsql;

-- Função para calcular o preço com desconto
create or replace function calculate_discounted_price(
  original_price numeric,
  discount_percentage numeric
)
returns numeric as $$
begin
  return original_price * (1 - discount_percentage / 100);
end;
$$ language plpgsql;

-- Função para calcular comissão
create or replace function calculate_commission(
  amount numeric,
  commission_rate numeric
)
returns numeric as $$
begin
  return amount * (commission_rate / 100);
end;
$$ language plpgsql;

-- Função para arredondar para cima
create or replace function round_up(value numeric, decimals integer)
returns numeric as $$
begin
  return ceil(value * (10^decimals)) / (10^decimals);
end;
$$ language plpgsql;

-- Função para arredondar para baixo
create or replace function round_down(value numeric, decimals integer)
returns numeric as $$
begin
  return floor(value * (10^decimals)) / (10^decimals);
end;
$$ language plpgsql;