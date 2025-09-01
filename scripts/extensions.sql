-- Script para criar extensões necessárias

-- Extensões para UUID
create extension if not exists "uuid-ossp";

-- Extensões para criptografia
create extension if not exists "pgcrypto";

-- Extensões para estatísticas
create extension if not exists "pg_stat_statements";

-- Extensões para texto
create extension if not exists "citext";

-- Extensões para datas e horas
create extension if not exists "btree_gist";

-- Extensões para buscas de texto
create extension if not exists "pg_trgm";

-- Extensões para JSON
create extension if not exists "jsonb_plperl";

-- Extensões para networking (se disponível)
-- create extension if not exists "pg_net";

\echo 'Extensões criadas com sucesso!'