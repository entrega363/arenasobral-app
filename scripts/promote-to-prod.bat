@echo off
REM Script para promover alterações do staging para produção no Windows

echo Promovendo alterações do staging para produção...

REM Verificar se as variáveis de ambiente estão definidas
if "%SUPABASE_STAGING_PROJECT_ID%"=="" (
    echo Erro: SUPABASE_STAGING_PROJECT_ID não está definida
    exit /b 1
)

if "%SUPABASE_PROJECT_ID%"=="" (
    echo Erro: SUPABASE_PROJECT_ID não está definida
    exit /b 1
)

REM Confirmar promoção
echo ATENÇÃO: Esta operação irá promover as alterações do ambiente de staging para produção!
set /p CONFIRM=Tem certeza que deseja continuar? (y/N) 
if /i not "%CONFIRM%"=="y" (
    echo Promoção cancelada.
    exit /b 0
)

REM Gerar diff entre staging e produção
echo Gerando diff entre staging e produção...
supabase db diff --project-ref %SUPABASE_STAGING_PROJECT_ID% --production-ref %SUPABASE_PROJECT_ID%

REM Aplicar migrações na produção
echo Aplicando migrações na produção...
supabase db push --project-ref %SUPABASE_PROJECT_ID%

REM Deploy das funções na produção (se existirem)
if exist "supabase/functions" (
    echo Deployando funções na produção...
    supabase functions deploy --project-ref %SUPABASE_PROJECT_ID%
)

REM Atualizar tipos TypeScript
echo Atualizando tipos TypeScript...
supabase gen types typescript --project-id %SUPABASE_PROJECT_ID% > src/types/supabase-generated.ts

echo Alterações promovidas para produção com sucesso!

echo.
echo Próximos passos:
echo 1. Verifique se a aplicação está funcionando corretamente em produção
echo 2. Monitore os logs para qualquer erro
echo 3. Notifique a equipe sobre a promoção