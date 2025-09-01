#!/usr/bin/env bash

# Script para executar tarefas de manutenção do banco de dados do Supabase

set -e  # Sair imediatamente se um comando falhar

echo "Executando tarefas de manutenção do banco de dados do Supabase..."

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

# Atualizar estatísticas
echo "Atualizando estatísticas..."
psql -h localhost -p 54322 -U postgres -d postgres -c "ANALYZE;"

# Limpar logs antigos
echo "Limpando logs antigos..."
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT cleanup_old_logs();"

# Atualizar visões materializadas
echo "Atualizando visões materializadas..."
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT refresh_materialized_views();"

echo "Tarefas de manutenção concluídas com sucesso!"