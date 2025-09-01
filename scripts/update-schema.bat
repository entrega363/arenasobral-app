@echo off
REM Script para atualizar o esquema do banco de dados do Supabase no Windows

echo Atualizando esquema do banco de dados do Supabase...

REM Gerar migração a partir das alterações no esquema
echo Gerando migração...
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set DATE=%dt:~0,8%_%dt:~8,6%
set MIGRATION_NAME=update_schema_%DATE%
supabase db diff -f %MIGRATION_NAME%

REM Aplicar migração
echo Aplicando migração...
supabase db push

REM Atualizar tipos TypeScript
echo Atualizando tipos TypeScript...
supabase gen types typescript --local > src/types/supabase-generated.ts

echo Esquema atualizado com sucesso!

echo.
echo Próximos passos:
echo 1. Verifique se a migração foi aplicada corretamente
echo 2. Teste a aplicação para garantir que tudo está funcionando
echo 3. Faça commit das alterações de esquema