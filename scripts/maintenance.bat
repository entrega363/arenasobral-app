@echo off
REM Script para executar tarefas de manutenção do banco de dados do Supabase no Windows

echo Executando tarefas de manutenção do banco de dados do Supabase...

REM Verificar integridade dos dados
echo Verificando integridade dos dados...
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT * FROM check_data_integrity();"

REM Verificar políticas de segurança
echo Verificando políticas de segurança...
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT * FROM check_permissions_integrity();"

REM Verificar performance
echo Verificando performance...
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT * FROM slow_queries LIMIT 10;"

REM Verificar saúde do banco
echo Verificando saúde do banco...
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT * FROM check_database_health();"

REM Atualizar estatísticas
echo Atualizando estatísticas...
psql -h localhost -p 54322 -U postgres -d postgres -c "ANALYZE;"

REM Limpar logs antigos
echo Limpando logs antigos...
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT cleanup_old_logs();"

REM Atualizar visões materializadas
echo Atualizando visões materializadas...
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT refresh_materialized_views();"

echo Tarefas de manutenção concluídas com sucesso!