@echo off
REM Script para parar todos os serviços com Docker Compose no Windows

echo Parando serviços com Docker Compose...

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

echo Serviços parados com sucesso!