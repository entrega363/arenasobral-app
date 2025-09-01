@echo off
REM Script para configurar o ambiente de desenvolvimento completo no Windows

echo Configurando ambiente de desenvolvimento completo...

REM Verificar se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js não encontrado. Por favor, instale o Node.js primeiro.
    exit /b 1
)

REM Verificar se o npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo npm não encontrado. Por favor, instale o npm primeiro.
    exit /b 1
)

REM Instalar dependências do projeto
echo Instalando dependências do projeto...
npm ci

REM Verificar se o Supabase CLI está instalado
supabase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Supabase CLI não encontrado. Instalando...
    npm install -g supabase
)

REM Iniciar o Supabase local
echo Iniciando Supabase local...
supabase start

REM Aplicar migrações
echo Aplicando migrações...
supabase db reset

REM Popular o banco de dados com dados de exemplo
echo Populando banco de dados...
supabase db seed

REM Configurar tipos TypeScript
echo Gerando tipos TypeScript...
supabase gen types typescript --local > src/types/supabase-generated.ts

REM Verificar se o Docker está instalado
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Iniciando serviços com Docker Compose...
    docker-compose up -d
)

REM Criar arquivo .env.local se não existir
if not exist .env.local (
    echo Criando arquivo .env.local...
    copy .env.local.example .env.local
    echo ATENÇÃO: Configure as variáveis de ambiente em .env.local
)

REM Executar testes
echo Executando testes...
npm test

echo.
echo Ambiente de desenvolvimento configurado com sucesso!
echo.
echo Próximos passos:
echo 1. Configure as variáveis de ambiente em .env.local
echo 2. Execute 'npm run dev' para iniciar a aplicação em modo de desenvolvimento
echo 3. Acesse http://localhost:3000 no seu navegador
echo 4. Acesse o Supabase Studio em http://localhost:54329 (se estiver usando Docker)