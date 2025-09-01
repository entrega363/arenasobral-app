@echo off
REM Script para iniciar todos os serviços com Docker Compose no Windows

echo Iniciando serviços com Docker Compose...

REM Verificar se o Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker não encontrado. Por favor, instale o Docker primeiro.
    exit /b 1
)

REM Verificar se o Docker Compose está instalado
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Compose não encontrado. Por favor, instale o Docker Compose primeiro.
    exit /b 1
)

REM Construir e iniciar todos os serviços
echo Construindo e iniciando serviços...
docker-compose up -d

REM Aguardar alguns segundos para os serviços iniciarem
echo Aguardando inicialização dos serviços...
timeout /t 30 /nobreak >nul

REM Verificar status dos serviços
echo Verificando status dos serviços...
docker-compose ps

echo.
echo Serviços iniciados com sucesso!
echo.
echo Acesse os serviços em:
echo - Aplicação: http://localhost:3000
echo - Supabase Studio: http://localhost:54329
echo - Supabase Auth: http://localhost:54321
echo - Supabase Storage: http://localhost:54323
echo - Supabase Functions: http://localhost:54324
echo - Supabase REST: http://localhost:54325
echo - Supabase Realtime: http://localhost:54326
echo - Inbucket (Email): http://localhost:54327
echo.
echo Para parar os serviços, execute: docker-compose down