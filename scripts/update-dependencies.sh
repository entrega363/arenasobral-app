#!/usr/bin/env bash

# Script para atualizar todas as dependências do projeto

set -e  # Sair imediatamente se um comando falhar

echo "Atualizando dependências do projeto..."

# Atualizar dependências do Node.js
echo "Atualizando dependências do Node.js..."
npm update

# Atualizar Supabase CLI
echo "Atualizando Supabase CLI..."
npm update -g supabase

# Atualizar dependências do Docker (se estiver usando Docker)
if command -v docker &> /dev/null; then
    echo "Atualizando imagens do Docker..."
    docker-compose pull
fi

# Atualizar tipos TypeScript do Supabase
echo "Atualizando tipos TypeScript do Supabase..."
supabase gen types typescript --local > src/types/supabase-generated.ts

echo "Dependências atualizadas com sucesso!"

echo "
Próximos passos:
1. Execute os testes para garantir que tudo está funcionando
2. Faça commit das atualizações
3. Se estiver usando Docker, reconstrua as imagens:
   docker-compose up -d --build
"