#!/usr/bin/env bash

# Script para executar todos os testes do Supabase

set -e  # Sair imediatamente se um comando falhar

echo "Executando testes do Supabase..."

# Verificar se o Supabase está rodando
echo "Verificando se o Supabase está rodando..."
if ! supabase status &> /dev/null; then
    echo "Iniciando Supabase..."
    supabase start
fi

# Executar testes de unidade
echo "Executando testes de unidade..."
npm run test

# Executar testes de integração com o banco de dados
echo "Executando testes de integração..."
supabase test db

# Verificar integridade dos dados
echo "Verificando integridade dos dados..."
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT * FROM check_data_integrity();"

# Verificar políticas de segurança
echo "Verificando políticas de segurança..."
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT * FROM check_permissions_integrity();"

# Verificar performance
echo "Verificando performance..."
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT * FROM slow_queries LIMIT 10;"

# Verificar saúde do banco
echo "Verificando saúde do banco..."
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT * FROM check_database_health();"

echo "Todos os testes executados com sucesso!"