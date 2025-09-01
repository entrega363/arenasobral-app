@echo off
REM Script para verificar o status de todos os serviços com Docker Compose no Windows

echo Verificando status dos serviços com Docker Compose...

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

REM Verificar status dos serviços
echo Status dos serviços:
docker-compose ps

echo.
echo Últimas 20 linhas de log de cada serviço:
for /f "tokens=*" %%s in ('docker-compose config --services') do (
    echo.
    echo === %%s ===
    docker-compose logs --tail=20 %%s
)