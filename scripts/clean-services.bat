@echo off
REM Script para limpar todos os serviços do Docker Compose no Windows

echo Limpando todos os serviços do Docker Compose...

REM Verificar se o Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker não encontrado.
    exit /b 1
)

REM Verificar se o Docker Compose está instalado
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Compose não encontrado.
    exit /b 1
)

REM Parar todos os serviços
echo Parando serviços...
docker-compose down

REM Remover volumes
echo Removendo volumes...
docker-compose down -v

REM Remover imagens
echo Removendo imagens...
docker-compose down --rmi all

REM Limpar sistema Docker (opcional - descomente se quiser)
REM echo Limpando sistema Docker...
REM docker system prune -af

echo Serviços limpos com sucesso!