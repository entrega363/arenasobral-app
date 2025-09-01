@echo off
REM Script para verificar vulnerabilidades de segurança nas dependências no Windows

echo Verificando vulnerabilidades de segurança nas dependências...

REM Verificar vulnerabilidades no Node.js
echo Verificando vulnerabilidades no Node.js...
npm audit

REM Verificar versões desatualizadas
echo Verificando versões desatualizadas...
npm outdated

REM Verificar vulnerabilidades no Docker (se estiver usando Docker)
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Verificando vulnerabilidades nas imagens do Docker...
    for /f "tokens=*" %%s in ('docker-compose config --services') do (
        for /f "tokens=2" %%i in ('docker-compose config ^| findstr "image:" ^| findstr "%%s"') do (
            echo Verificando imagem: %%i
            docker scan "%%i" || echo Não foi possível escanear a imagem %%i
        )
    )
)

REM Verificar vulnerabilidades no código-fonte
echo Verificando vulnerabilidades no código-fonte...
npx eslint --ext .js,.jsx,.ts,.tsx src/ --quiet || echo Erros encontrados no ESLint

echo.
echo Verificação de segurança concluída!
echo.
echo Recomendações:
echo 1. Se vulnerabilidades forem encontradas, atualize as dependências afetadas
echo 2. Execute 'npm audit fix' para corrigir automaticamente algumas vulnerabilidades
echo 3. Para vulnerabilidades críticas, considere substituir as dependências afetadas