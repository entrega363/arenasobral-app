@echo off
REM Script para configurar o ambiente de staging do Supabase no Windows

echo Configurando ambiente de staging do Supabase...

REM Verificar se as variáveis de ambiente estão definidas
if "%SUPABASE_STAGING_PROJECT_ID%"=="" (
    echo Erro: SUPABASE_STAGING_PROJECT_ID não está definida
    exit /b 1
)

if "%SUPABASE_STAGING_ACCESS_TOKEN%"=="" (
    echo Erro: SUPABASE_STAGING_ACCESS_TOKEN não está definida
    exit /b 1
)

REM Linkar o projeto de staging
echo Linkando projeto de staging...
supabase link --project-ref %SUPABASE_STAGING_PROJECT_ID%

REM Aplicar migrações
echo Aplicando migrações...
supabase db push

REM Popular o banco de dados com dados de exemplo
echo Populando banco de dados...
supabase db seed

REM Configurar tipos TypeScript
echo Gerando tipos TypeScript...
supabase gen types typescript --project-id %SUPABASE_STAGING_PROJECT_ID% > src/types/supabase-generated.ts

REM Deploy das funções (se existirem)
if exist "supabase/functions" (
    echo Deployando funções...
    supabase functions deploy
)

echo Ambiente de staging configurado com sucesso!

echo.
echo Próximos passos:
echo 1. Verifique se todas as variáveis de ambiente estão configuradas no dashboard do Supabase de staging
echo 2. Configure os provedores de autenticação necessários
echo 3. Configure os buckets de storage, se necessário