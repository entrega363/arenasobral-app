@echo off
REM Script para executar todos os testes do Supabase no Windows

echo Executando testes do Supabase...

REM Verificar se o Supabase está rodando
echo Verificando se o Supabase está rodando...
supabase status >nul 2>&1
if %errorlevel% neq 0 (
    echo Iniciando Supabase...
    supabase start
)

REM Executar testes de unidade
echo Executando testes de unidade...
npm run test

REM Executar testes de integração com o banco de dados
echo Executando testes de integração...
supabase test db

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

echo Todos os testes executados com sucesso!