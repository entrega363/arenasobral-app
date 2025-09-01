@echo off
REM Script para fazer backup do banco de dados do Supabase no Windows

REM Configurações
set BACKUP_DIR=./backups
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set DATE=%dt:~0,8%_%dt:~8,6%
set BACKUP_NAME=supabase_backup_%DATE%

echo Iniciando backup do banco de dados do Supabase...

REM Criar diretório de backups se não existir
if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%

REM Fazer backup do esquema
echo Fazendo backup do esquema...
supabase db dump --schema-only > "%BACKUP_DIR%\%BACKUP_NAME%_schema.sql"

REM Fazer backup dos dados
echo Fazendo backup dos dados...
supabase db dump --data-only > "%BACKUP_DIR%\%BACKUP_NAME%_data.sql"

REM Fazer backup completo
echo Fazendo backup completo...
supabase db dump > "%BACKUP_DIR%\%BACKUP_NAME%_full.sql"

echo Backup concluído com sucesso!
echo Backups salvos em: %BACKUP_DIR%
echo Arquivos criados:
echo   - %BACKUP_NAME%_schema.sql
echo   - %BACKUP_NAME%_data.sql
echo   - %BACKUP_NAME%_full.sql