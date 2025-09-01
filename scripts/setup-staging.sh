#!/usr/bin/env bash

# Script para configurar o ambiente de staging do Supabase

set -e  # Sair imediatamente se um comando falhar

echo "Configurando ambiente de staging do Supabase..."

# Verificar se as variáveis de ambiente estão definidas
if [ -z "$SUPABASE_STAGING_PROJECT_ID" ]; then
    echo "Erro: SUPABASE_STAGING_PROJECT_ID não está definida"
    exit 1
fi

if [ -z "$SUPABASE_STAGING_ACCESS_TOKEN" ]; then
    echo "Erro: SUPABASE_STAGING_ACCESS_TOKEN não está definida"
    exit 1
fi

# Linkar o projeto de staging
echo "Linkando projeto de staging..."
supabase link --project-ref $SUPABASE_STAGING_PROJECT_ID

# Aplicar migrações
echo "Aplicando migrações..."
supabase db push

# Popular o banco de dados com dados de exemplo
echo "Populando banco de dados..."
supabase db seed

# Configurar tipos TypeScript
echo "Gerando tipos TypeScript..."
supabase gen types typescript --project-id $SUPABASE_STAGING_PROJECT_ID > src/types/supabase-generated.ts

# Deploy das funções (se existirem)
if [ -d "supabase/functions" ]; then
    echo "Deployando funções..."
    supabase functions deploy
fi

echo "Ambiente de staging configurado com sucesso!"

echo "
Próximos passos:
1. Verifique se todas as variáveis de ambiente estão configuradas no dashboard do Supabase de staging
2. Configure os provedores de autenticação necessários
3. Configure os buckets de storage, se necessário
"