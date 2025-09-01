@echo off
REM Script para fazer backup dos volumes do Docker Compose no Windows

REM Configurações
set BACKUP_DIR=./docker-backups
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set DATE=%dt:~0,8%_%dt:~8,6%
set BACKUP_NAME=docker_volumes_backup_%DATE%

echo Iniciando backup dos volumes do Docker Compose...

REM Criar diretório de backups se não existir
if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%

REM Parar todos os serviços
echo Parando serviços...
docker-compose down

REM Fazer backup de cada volume
echo Fazendo backup dos volumes...
for /f "tokens=*" %%v in ('docker volume ls -q ^| findstr arenasobral') do (
    echo Fazendo backup do volume: %%v
    docker run --rm -v %%v:/data -v %BACKUP_DIR%:/backup alpine tar czf /backup/%%v_%BACKUP_NAME%.tar.gz -C /data .
)

echo Backup concluído com sucesso!
echo Backups salvos em: %BACKUP_DIR%