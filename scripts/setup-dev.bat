@echo off
REM Script para configurar o ambiente de desenvolvimento do Supabase no Windows

echo Configurando ambiente de desenvolvimento do Supabase...

REM Verificar se o Supabase CLI está instalado
where supabase >nul 2>&1
if %errorlevel% neq 0 (
    echo Supabase CLI não encontrado. Instalando...
    npm install -g supabase
)

REM Iniciar o Supabase local (se não estiver rodando)
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

echo Ambiente de desenvolvimento configurado com sucesso!

echo.
echo Próximos passos:
echo 1. Configure as variáveis de ambiente no arquivo .env.local
echo 2. Execute 'npm run dev' para iniciar a aplicação
echo 3. Acesse http://localhost:3000 no seu navegador