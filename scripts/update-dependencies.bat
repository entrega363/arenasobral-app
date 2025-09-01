@echo off
REM Script para atualizar todas as dependências do projeto no Windows

echo Atualizando dependências do projeto...

REM Atualizar dependências do Node.js
echo Atualizando dependências do Node.js...
npm update

REM Atualizar Supabase CLI
echo Atualizando Supabase CLI...
npm update -g supabase

REM Atualizar dependências do Docker (se estiver usando Docker)
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Atualizando imagens do Docker...
    docker-compose pull
)

REM Atualizar tipos TypeScript do Supabase
echo Atualizando tipos TypeScript do Supabase...
supabase gen types typescript --local > src/types/supabase-generated.ts

echo Dependências atualizadas com sucesso!

echo.
echo Próximos passos:
echo 1. Execute os testes para garantir que tudo está funcionando
echo 2. Faça commit das atualizações
echo 3. Se estiver usando Docker, reconstrua as imagens:
echo    docker-compose up -d --build