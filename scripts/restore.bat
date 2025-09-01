@echo off
REM Script para restaurar o banco de dados do Supabase no Windows

REM Verificar se foi fornecido um arquivo de backup
if "%1"=="" (
    echo Uso: %0 ^<arquivo_de_backup.sql^>
    echo Exemplo: %0 backups\supabase_backup_20230101_120000_full.sql
    exit /b 1
)

set BACKUP_FILE=%1

REM Verificar se o arquivo de backup existe
if not exist "%BACKUP_FILE%" (
    echo Arquivo de backup não encontrado: %BACKUP_FILE%
    exit /b 1
)

echo Restaurando banco de dados do Supabase...
echo Arquivo de backup: %BACKUP_FILE%

REM Confirmar restauração
echo ATENÇÃO: Esta operação irá substituir todos os dados atuais!
set /p CONFIRM=Tem certeza que deseja continuar? (y/N) 
if /i not "%CONFIRM%"=="y" (
    echo Restauração cancelada.
    exit /b 0
)

REM Parar o Supabase
echo Parando Supabase...
supabase stop

REM Iniciar o Supabase
echo Iniciando Supabase...
supabase start

REM Restaurar o backup
echo Restaurando backup...
supabase db reset
psql -h localhost -p 54322 -U postgres -d postgres -f "%BACKUP_FILE%"

echo Restauração concluída com sucesso!