#!/usr/bin/env bash

# Script para gerar documentação da API

set -e  # Sair imediatamente se um comando falhar

echo "Gerando documentação da API..."

# Criar diretório de documentação se não existir
mkdir -p docs/api

# Gerar documentação do Supabase
echo "Gerando documentação do Supabase..."
supabase gen docs > docs/api/supabase.md

# Gerar documentação das funções
echo "Gerando documentação das funções..."
supabase functions list > docs/api/functions.md

# Gerar documentação das tabelas
echo "Gerando documentação das tabelas..."
psql -h localhost -p 54322 -U postgres -d postgres -c "
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;
" > docs/api/tables.md

# Gerar documentação das funções do banco de dados
echo "Gerando documentação das funções do banco de dados..."
psql -h localhost -p 54322 -U postgres -d postgres -c "
SELECT 
    proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY proname;
" > docs/api/database-functions.md

# Gerar documentação das políticas de segurança
echo "Gerando documentação das políticas de segurança..."
psql -h localhost -p 54322 -U postgres -d postgres -c "
SELECT 
    polname as policy_name,
    relname as table_name,
    polcmd as command,
    polqual as using_clause,
    polwithcheck as with_check_clause
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
ORDER BY relname, polname;
" > docs/api/security-policies.md

echo "Documentação da API gerada com sucesso!"
echo "Documentação salva em: docs/api/"