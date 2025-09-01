-- Script SQL para inicializar as tabelas do Supabase

-- Habilitar UUID
create extension if not exists "uuid-ossp";

-- Tabela de usuários
create table if not exists users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  user_type text check (user_type in ('PLAYER', 'TEAM_OWNER', 'FIELD_OWNER')) not null,
  name text,
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de campos (areninhas)
create table if not exists fields (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  location text not null,
  address text not null,
  description text,
  field_type text check (field_type in ('SOCIETY', 'GRASS', 'CONCRETE')) not null,
  price_per_hour numeric not null,
  rating numeric default 0,
  owner_id uuid references users(id) not null,
  photos jsonb,
  amenities jsonb,
  rules text[],
  contact_info jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de slots de tempo
create table if not exists time_slots (
  id uuid default uuid_generate_v4() primary key,
  field_id uuid references fields(id) not null,
  day_of_week integer check (day_of_week >= 0 and day_of_week <= 6) not null,
  start_time time not null,
  end_time time not null,
  price numeric not null,
  available boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de reservas
create table if not exists bookings (
  id uuid default uuid_generate_v4() primary key,
  field_id uuid references fields(id) not null,
  user_id uuid references users(id) not null,
  time_slot_id uuid references time_slots(id) not null,
  date date not null,
  status text check (status in ('PENDING', 'CONFIRMED', 'CANCELLED')) default 'PENDING',
  payment_status text check (payment_status in ('PENDING', 'PAID', 'REFUNDED')) default 'PENDING',
  total_amount numeric not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de times
create table if not exists teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  owner_id uuid references users(id) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de jogadores
create table if not exists players (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id),
  name text not null,
  position text,
  skill_level integer check (skill_level >= 1 and skill_level <= 5),
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de avaliações
create table if not exists reviews (
  id uuid default uuid_generate_v4() primary key,
  field_id uuid references fields(id) not null,
  user_id uuid references users(id) not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de jogos
create table if not exists games (
  id uuid default uuid_generate_v4() primary key,
  field_id uuid references fields(id) not null,
  team1_id uuid references teams(id) not null,
  team2_id uuid references teams(id),
  date date not null,
  time time not null,
  status text check (status in ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')) default 'SCHEDULED',
  score_team1 integer,
  score_team2 integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Índices
create index if not exists idx_fields_owner_id on fields(owner_id);
create index if not exists idx_bookings_field_id on bookings(field_id);
create index if not exists idx_bookings_user_id on bookings(user_id);
create index if not exists idx_bookings_date on bookings(date);
create index if not exists idx_time_slots_field_id on time_slots(field_id);
create index if not exists idx_reviews_field_id on reviews(field_id);
create index if not exists idx_games_field_id on games(field_id);
create index if not exists idx_games_date on games(date);

-- Funções para inicialização
create or replace function create_users_table()
returns void as $$
begin
  create table if not exists users (
    id uuid references auth.users not null primary key,
    email text unique not null,
    user_type text check (user_type in ('PLAYER', 'TEAM_OWNER', 'FIELD_OWNER')) not null,
    name text,
    phone text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );
end;
$$ language plpgsql;

create or replace function create_fields_table()
returns void as $$
begin
  create table if not exists fields (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    location text not null,
    address text not null,
    description text,
    field_type text check (field_type in ('SOCIETY', 'GRASS', 'CONCRETE')) not null,
    price_per_hour numeric not null,
    rating numeric default 0,
    owner_id uuid references users(id) not null,
    photos jsonb,
    amenities jsonb,
    rules text[],
    contact_info jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );
end;
$$ language plpgsql;

create or replace function create_time_slots_table()
returns void as $$
begin
  create table if not exists time_slots (
    id uuid default uuid_generate_v4() primary key,
    field_id uuid references fields(id) not null,
    day_of_week integer check (day_of_week >= 0 and day_of_week <= 6) not null,
    start_time time not null,
    end_time time not null,
    price numeric not null,
    available boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );
end;
$$ language plpgsql;

create or replace function create_bookings_table()
returns void as $$
begin
  create table if not exists bookings (
    id uuid default uuid_generate_v4() primary key,
    field_id uuid references fields(id) not null,
    user_id uuid references users(id) not null,
    time_slot_id uuid references time_slots(id) not null,
    date date not null,
    status text check (status in ('PENDING', 'CONFIRMED', 'CANCELLED')) default 'PENDING',
    payment_status text check (payment_status in ('PENDING', 'PAID', 'REFUNDED')) default 'PENDING',
    total_amount numeric not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );
end;
$$ language plpgsql;

create or replace function create_teams_table()
returns void as $$
begin
  create table if not exists teams (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    owner_id uuid references users(id) not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );
end;
$$ language plpgsql;

create or replace function create_players_table()
returns void as $$
begin
  create table if not exists players (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references users(id),
    name text not null,
    position text,
    skill_level integer check (skill_level >= 1 and skill_level <= 5),
    phone text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );
end;
$$ language plpgsql;

create or replace function create_reviews_table()
returns void as $$
begin
  create table if not exists reviews (
    id uuid default uuid_generate_v4() primary key,
    field_id uuid references fields(id) not null,
    user_id uuid references users(id) not null,
    rating integer check (rating >= 1 and rating <= 5) not null,
    comment text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );
end;
$$ language plpgsql;

create or replace function create_games_table()
returns void as $$
begin
  create table if not exists games (
    id uuid default uuid_generate_v4() primary key,
    field_id uuid references fields(id) not null,
    team1_id uuid references teams(id) not null,
    team2_id uuid references teams(id),
    date date not null,
    time time not null,
    status text check (status in ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')) default 'SCHEDULED',
    score_team1 integer,
    score_team2 integer,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );
end;
$$ language plpgsql;