-- Script para configurar gatilhos e funções do Supabase

-- Função para atualizar o campo updated_at automaticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

-- Gatilhos para atualizar o campo updated_at
create trigger update_users_updated_at 
before update on users 
for each row 
execute procedure update_updated_at_column();

create trigger update_fields_updated_at 
before update on fields 
for each row 
execute procedure update_updated_at_column();

create trigger update_time_slots_updated_at 
before update on time_slots 
for each row 
execute procedure update_updated_at_column();

create trigger update_bookings_updated_at 
before update on bookings 
for each row 
execute procedure update_updated_at_column();

create trigger update_teams_updated_at 
before update on teams 
for each row 
execute procedure update_updated_at_column();

create trigger update_players_updated_at 
before update on players 
for each row 
execute procedure update_updated_at_column();

create trigger update_reviews_updated_at 
before update on reviews 
for each row 
execute procedure update_updated_at_column();

create trigger update_games_updated_at 
before update on games 
for each row 
execute procedure update_updated_at_column();

-- Função para calcular a média de avaliações de um campo
create or replace function calculate_field_rating(field_id uuid)
returns numeric as $$
declare
    avg_rating numeric;
begin
    select avg(rating) into avg_rating
    from reviews
    where field_id = calculate_field_rating.field_id;
    
    return coalesce(avg_rating, 0);
end;
$$ language 'plpgsql';

-- Função para atualizar a classificação de um campo após uma nova avaliação
create or replace function update_field_rating()
returns trigger as $$
begin
    update fields 
    set rating = calculate_field_rating(new.field_id)
    where id = new.field_id;
    
    return new;
end;
$$ language 'plpgsql';

-- Gatilho para atualizar a classificação de um campo após uma nova avaliação
create trigger update_field_rating_trigger
after insert or update or delete on reviews
for each row
execute procedure update_field_rating();

-- Função para verificar disponibilidade de horário antes de criar uma reserva
create or replace function check_booking_availability()
returns trigger as $$
declare
    slot_available boolean;
begin
    select available into slot_available
    from time_slots
    where id = new.time_slot_id;
    
    if not slot_available then
        raise exception 'Time slot is not available';
    end if;
    
    return new;
end;
$$ language 'plpgsql';

-- Gatilho para verificar disponibilidade de horário antes de criar uma reserva
create trigger check_booking_availability_trigger
before insert on bookings
for each row
execute procedure check_booking_availability();

-- Função para atualizar a disponibilidade de um slot de tempo após uma reserva
create or replace function update_time_slot_availability()
returns trigger as $$
begin
    if tg_op = 'INSERT' then
        -- Marcar slot como indisponível quando uma reserva é criada
        update time_slots 
        set available = false
        where id = new.time_slot_id;
    elsif tg_op = 'DELETE' then
        -- Marcar slot como disponível quando uma reserva é cancelada
        update time_slots 
        set available = true
        where id = old.time_slot_id;
    end if;
    
    return new;
end;
$$ language 'plpgsql';

-- Gatilho para atualizar a disponibilidade de um slot de tempo após uma reserva
create trigger update_time_slot_availability_trigger
after insert or delete on bookings
for each row
execute procedure update_time_slot_availability();