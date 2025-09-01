@echo off
REM Script para executar testes de performance no Windows

echo Executando testes de performance...

REM Verificar se as ferramentas necessárias estão instaladas
where ab >nul 2>&1
if %errorlevel% neq 0 (
    echo Apache Bench (ab) não encontrado. Por favor, instale o Apache HTTP Server.
    exit /b 1
)

REM Iniciar a aplicação em modo de produção (se não estiver rodando)
echo Verificando se a aplicação está rodando...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo Iniciando a aplicação...
    start /b npm run start
    timeout /t 10 /nobreak >nul
)

REM Criar diretório de performance se não existir
if not exist docs\performance mkdir docs\performance

REM Testes de performance para endpoints principais
echo Executando testes de performance...

REM Teste de performance para a página inicial
echo Teste 1: Página inicial
ab -n 1000 -c 10 http://localhost:3000/ > docs/performance/homepage.txt

REM Teste de performance para a API de campos
echo Teste 2: API de campos
ab -n 1000 -c 10 http://localhost:3000/api/fields > docs/performance/fields-api.txt

REM Teste de performance para a API de reservas
echo Teste 3: API de reservas
ab -n 1000 -c 10 http://localhost:3000/api/bookings > docs/performance/bookings-api.txt

REM Teste de performance para a API de usuários
echo Teste 4: API de usuários
ab -n 1000 -c 10 http://localhost:3000/api/users > docs/performance/users-api.txt

echo Testes de performance concluídos!
echo Resultados salvos em: docs/performance/