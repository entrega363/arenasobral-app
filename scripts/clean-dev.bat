@echo off
REM Script para limpar o ambiente de desenvolvimento do Supabase no Windows

echo Limpando ambiente de desenvolvimento do Supabase...

REM Parar o Supabase
echo Parando Supabase...
supabase stop

REM Remover volumes do Docker (isso irá apagar todos os dados)
echo Removendo volumes do Docker...
docker volume rm supabase_db supabase_auth supabase_storage supabase_functions supabase_realtime supabase_inbucket supabase_edge_runtime 2>nul

REM Remover arquivos de configuração locais
echo Removendo arquivos de configuração locais...
del /q supabase\.temp supabase\.branches 2>nul

REM Remover diretório de backups
echo Removendo diretório de backups...
rmdir /s /q backups 2>nul

echo Ambiente de desenvolvimento limpo com sucesso!

echo.
echo Para reconfigurar o ambiente:
echo 1. Execute 'supabase start' para iniciar o Supabase
echo 2. Execute 'supabase db reset' para aplicar as migrações
echo 3. Execute 'supabase db seed' para popular com dados de exemplo