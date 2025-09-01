#!/usr/bin/env bash

# Script para verificar vulnerabilidades de segurança nas dependências

set -e  # Sair imediatamente se um comando falhar

echo "Verificando vulnerabilidades de segurança nas dependências..."

# Verificar vulnerabilidades no Node.js
echo "Verificando vulnerabilidades no Node.js..."
npm audit

# Verificar versões desatualizadas
echo "Verificando versões desatualizadas..."
npm outdated

# Verificar vulnerabilidades no Docker (se estiver usando Docker)
if command -v docker &> /dev/null; then
    echo "Verificando vulnerabilidades nas imagens do Docker..."
    docker-compose config --services | while read service; do
        image=$(docker-compose config | grep "image:" | grep "$service" | awk '{print $2}')
        if [ ! -z "$image" ]; then
            echo "Verificando imagem: $image"
            docker scan "$image" || echo "Não foi possível escanear a imagem $image"
        fi
    done
fi

# Verificar vulnerabilidades no código-fonte
echo "Verificando vulnerabilidades no código-fonte..."
npx eslint --ext .js,.jsx,.ts,.tsx src/ --quiet || echo "Erros encontrados no ESLint"

echo "
Verificação de segurança concluída!

Recomendações:
1. Se vulnerabilidades forem encontradas, atualize as dependências afetadas
2. Execute 'npm audit fix' para corrigir automaticamente algumas vulnerabilidades
3. Para vulnerabilidades críticas, considere substituir as dependências afetadas
"