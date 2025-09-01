-- Script para configurar funções de relatórios do Supabase

-- Função para relatório de receita por campo
create or replace function field_revenue_report(
  start_date date,
  end_date date
)
returns table(
  field_id uuid,
  field_name text,
  total_bookings bigint,
  total_revenue numeric,
  avg_booking_value numeric
) as $$
begin
  return query
  select 
    f.id as field_id,
    f.name as field_name,
    count(b.id) as total_bookings,
    sum(b.total_amount) as total_revenue,
    avg(b.total_amount) as avg_booking_value
  from fields f
  left join bookings b on f.id = b.field_id
  where 
    b.date between start_date and end_date and
    b.status = 'CONFIRMED' and
    b.payment_status = 'PAID'
  group by f.id, f.name
  order by total_revenue desc;
end;
$$ language plpgsql;

-- Função para relatório de receita por proprietário
create or replace function owner_revenue_report(
  start_date date,
  end_date date
)
returns table(
  owner_id uuid,
  owner_email text,
  total_fields bigint,
  total_bookings bigint,
  total_revenue numeric,
  avg_field_revenue numeric
) as $$
begin
  return query
  select 
    u.id as owner_id,
    u.email as owner_email,
    count(distinct f.id) as total_fields,
    count(b.id) as total_bookings,
    sum(b.total_amount) as total_revenue,
    avg(b.total_amount) as avg_field_revenue
  from users u
  join fields f on u.id = f.owner_id
  left join bookings b on f.id = b.field_id
  where 
    u.user_type = 'FIELD_OWNER' and
    b.date between start_date and end_date and
    b.status = 'CONFIRMED' and
    b.payment_status = 'PAID'
  group by u.id, u.email
  order by total_revenue desc;
end;
$$ language plpgsql;

-- Função para relatório de utilização de campos
create or replace function field_utilization_report(
  start_date date,
  end_date date
)
returns table(
  field_id uuid,
  field_name text,
  total_available_slots bigint,
  total_booked_slots bigint,
  utilization_rate numeric
) as $$
begin
  return query
  select 
    f.id as field_id,
    f.name as field_name,
    count(ts.id) as total_available_slots,
    count(b.id) as total_booked_slots,
    case 
      when count(ts.id) > 0 then 
        (count(b.id)::numeric / count(ts.id)::numeric) * 100 
      else 0 
    end as utilization_rate
  from fields f
  join time_slots ts on f.id = ts.field_id
  left join bookings b on ts.id = b.time_slot_id and b.date between start_date and end_date
  where 
    ts.available = true
  group by f.id, f.name
  order by utilization_rate desc;
end;
$$ language plpgsql;

-- Função para relatório de clientes frequentes
create or replace function frequent_customers_report(
  start_date date,
  end_date date
)
returns table(
  user_id uuid,
  user_email text,
  total_bookings bigint,
  total_spent numeric,
  avg_booking_value numeric
) as $$
begin
  return query
  select 
    u.id as user_id,
    u.email as user_email,
    count(b.id) as total_bookings,
    sum(b.total_amount) as total_spent,
    avg(b.total_amount) as avg_booking_value
  from users u
  join bookings b on u.id = b.user_id
  where 
    b.date between start_date and end_date and
    b.status = 'CONFIRMED' and
    b.payment_status = 'PAID'
  group by u.id, u.email
  having count(b.id) >= 5 -- Apenas clientes com 5 ou mais reservas
  order by total_bookings desc, total_spent desc;
end;
$$ language plpgsql;

-- Função para relatório de crescimento de usuários
create or replace function user_growth_report(
  start_date date,
  end_date date
)
returns table(
  period date,
  total_users bigint,
  new_users bigint
) as $$
begin
  return query
  select 
    date_trunc('month', u.created_at)::date as period,
    count(*) as total_users,
    count(*) filter (where u.created_at between start_date and end_date) as new_users
  from users u
  where u.created_at <= end_date
  group by date_trunc('month', u.created_at)
  order by period;
end;
$$ language plpgsql;

-- Função para relatório de receita por período
create or replace function revenue_by_period_report(
  start_date date,
  end_date date,
  period text default 'day' -- 'day', 'week', 'month'
)
returns table(
  period_date date,
  total_bookings bigint,
  total_revenue numeric,
  avg_daily_revenue numeric
) as $$
begin
  return query
  select 
    case 
      when period = 'day' then b.date
      when period = 'week' then date_trunc('week', b.date)::date
      when period = 'month' then date_trunc('month', b.date)::date
      else b.date
    end as period_date,
    count(b.id) as total_bookings,
    sum(b.total_amount) as total_revenue,
    avg(b.total_amount) as avg_daily_revenue
  from bookings b
  where 
    b.date between start_date and end_date and
    b.status = 'CONFIRMED' and
    b.payment_status = 'PAID'
  group by 
    case 
      when period = 'day' then b.date
      when period = 'week' then date_trunc('week', b.date)::date
      when period = 'month' then date_trunc('month', b.date)::date
      else b.date
    end
  order by period_date;
end;
$$ language plpgsql;

-- Função para relatório de desempenho de campos
create or replace function field_performance_report(
  start_date date,
  end_date date
)
returns table(
  field_id uuid,
  field_name text,
  location text,
  total_bookings bigint,
  total_revenue numeric,
  avg_rating numeric,
  total_reviews bigint,
  cancellation_rate numeric
) as $$
begin
  return query
  select 
    f.id as field_id,
    f.name as field_name,
    f.location,
    count(b.id) as total_bookings,
    sum(b.total_amount) as total_revenue,
    avg(r.rating) as avg_rating,
    count(r.id) as total_reviews,
    case 
      when count(b.id) > 0 then 
        (count(b.id) filter (where b.status = 'CANCELLED')::numeric / count(b.id)::numeric) * 100 
      else 0 
    end as cancellation_rate
  from fields f
  left join bookings b on f.id = b.field_id and b.date between start_date and end_date
  left join reviews r on f.id = r.field_id
  group by f.id, f.name, f.location
  order by total_revenue desc, avg_rating desc;
end;
$$ language plpgsql;

-- Função para relatório de comparação de períodos
create or replace function period_comparison_report(
  current_start date,
  current_end date,
  previous_start date,
  previous_end date
)
returns table(
  metric text,
  current_period numeric,
  previous_period numeric,
  difference numeric,
  percentage_change numeric
) as $$
begin
  return query
  with current_period as (
    select 
      count(b.id) as total_bookings,
      sum(b.total_amount) as total_revenue,
      avg(b.total_amount) as avg_booking_value
    from bookings b
    where 
      b.date between current_start and current_end and
      b.status = 'CONFIRMED' and
      b.payment_status = 'PAID'
  ),
  previous_period as (
    select 
      count(b.id) as total_bookings,
      sum(b.total_amount) as total_revenue,
      avg(b.total_amount) as avg_booking_value
    from bookings b
    where 
      b.date between previous_start and previous_end and
      b.status = 'CONFIRMED' and
      b.payment_status = 'PAID'
  )
  select 
    'Total Bookings' as metric,
    cp.total_bookings,
    pp.total_bookings,
    cp.total_bookings - pp.total_bookings as difference,
    case 
      when pp.total_bookings > 0 then 
        ((cp.total_bookings - pp.total_bookings)::numeric / pp.total_bookings::numeric) * 100 
      else 0 
    end as percentage_change
  from current_period cp, previous_period pp
  
  union all
  
  select 
    'Total Revenue' as metric,
    cp.total_revenue,
    pp.total_revenue,
    cp.total_revenue - pp.total_revenue as difference,
    case 
      when pp.total_revenue > 0 then 
        ((cp.total_revenue - pp.total_revenue)::numeric / pp.total_revenue::numeric) * 100 
      else 0 
    end as percentage_change
  from current_period cp, previous_period pp
  
  union all
  
  select 
    'Avg Booking Value' as metric,
    cp.avg_booking_value,
    pp.avg_booking_value,
    cp.avg_booking_value - pp.avg_booking_value as difference,
    case 
      when pp.avg_booking_value > 0 then 
        ((cp.avg_booking_value - pp.avg_booking_value)::numeric / pp.avg_booking_value::numeric) * 100 
      else 0 
    end as percentage_change
  from current_period cp, previous_period pp
  
  order by metric;
end;
$$ language plpgsql;

-- Função para relatório de tendências sazonais
create or replace function seasonal_trends_report(
  year integer
)
returns table(
  month integer,
  total_bookings bigint,
  total_revenue numeric,
  avg_booking_value numeric,
  peak_day_of_week integer
) as $$
begin
  return query
  select 
    extract(month from b.date)::integer as month,
    count(b.id) as total_bookings,
    sum(b.total_amount) as total_revenue,
    avg(b.total_amount) as avg_booking_value,
    mode() within group (order by extract(dow from b.date))::integer as peak_day_of_week
  from bookings b
  where 
    extract(year from b.date) = year and
    b.status = 'CONFIRMED' and
    b.payment_status = 'PAID'
  group by extract(month from b.date)
  order by month;
end;
$$ language plpgsql;

-- Função para relatório de retenção de clientes
create or replace function customer_retention_report(
  start_date date,
  end_date date
)
returns table(
  cohort_month date,
  cohort_size bigint,
  month_1_retained bigint,
  month_1_retention_rate numeric,
  month_3_retained bigint,
  month_3_retention_rate numeric,
  month_6_retained bigint,
  month_6_retention_rate numeric
) as $$
begin
  return query
  with cohort_data as (
    select 
      u.id as user_id,
      date_trunc('month', u.created_at)::date as cohort_month,
      date_trunc('month', b.date)::date as booking_month
    from users u
    join bookings b on u.id = b.user_id
    where 
      u.created_at between start_date and end_date and
      b.date >= u.created_at and
      b.status = 'CONFIRMED' and
      b.payment_status = 'PAID'
  ),
  cohort_sizes as (
    select 
      cohort_month,
      count(distinct user_id) as cohort_size
    from cohort_data
    group by cohort_month
  ),
  retention_data as (
    select 
      cd.cohort_month,
      cs.cohort_size,
      count(distinct cd.user_id) filter (where cd.booking_month = cd.cohort_month + interval '1 month') as month_1_retained,
      count(distinct cd.user_id) filter (where cd.booking_month = cd.cohort_month + interval '3 months') as month_3_retained,
      count(distinct cd.user_id) filter (where cd.booking_month = cd.cohort_month + interval '6 months') as month_6_retained
    from cohort_data cd
    join cohort_sizes cs on cd.cohort_month = cs.cohort_month
    group by cd.cohort_month, cs.cohort_size
  )
  select 
    cohort_month,
    cohort_size,
    month_1_retained,
    case 
      when cohort_size > 0 then (month_1_retained::numeric / cohort_size::numeric) * 100 
      else 0 
    end as month_1_retention_rate,
    month_3_retained,
    case 
      when cohort_size > 0 then (month_3_retained::numeric / cohort_size::numeric) * 100 
      else 0 
    end as month_3_retention_rate,
    month_6_retained,
    case 
      when cohort_size > 0 then (month_6_retained::numeric / cohort_size::numeric) * 100 
      else 0 
    end as month_6_retention_rate
  from retention_data
  order by cohort_month;
end;
$$ language plpgsql;