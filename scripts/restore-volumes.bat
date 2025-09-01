@echo off
REM Script para restaurar os volumes do Docker Compose no Windows

REM Verificar se foi fornecido um arquivo de backup
if "%1"=="" (
    echo Uso: %0 ^<diretório_de_backup^>
    echo Exemplo: %0 docker-backups
    exit /b 1
)

set BACKUP_DIR=%1

REM Verificar se o diretório de backup existe
if not exist "%BACKUP_DIR%" (
    echo Diretório de backup não encontrado: %BACKUP_DIR%
    exit /b 1
)

echo Restaurando volumes do Docker Compose...
echo Diretório de backup: %BACKUP_DIR%

REM Confirmar restauração
echo ATENÇÃO: Esta operação irá substituir todos os volumes atuais!
set /p CONFIRM=Tem certeza que deseja continuar? (y/N) 
if /i not "%CONFIRM%"=="y" (
    echo Restauração cancelada.
    exit /b 0
)

REM Parar todos os serviços
echo Parando serviços...
docker-compose down

REM Remover volumes atuais
echo Removendo volumes atuais...
docker-compose down -v

REM Restaurar volumes do backup
echo Restaurando volumes do backup...
for %%f in (%BACKUP_DIR%\*.tar.gz) do (
    echo Restaurando volume: %%~nf
    REM Criar novo volume
    docker volume create %%~nf
    REM Restaurar dados
    docker run --rm -v %%~nf:/data -v %BACKUP_DIR%:/backup alpine sh -c "tar xzf /backup/%%~nxf -C /data"
)

echo Restauração concluída com sucesso!