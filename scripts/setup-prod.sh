#!/usr/bin/env bash

# Script para configurar o ambiente de produção do Supabase

set -e  # Sair imediatamente se um comando falhar

echo "Configurando ambiente de produção do Supabase..."

# Verificar se as variáveis de ambiente estão definidas
if [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo "Erro: SUPABASE_PROJECT_ID não está definida"
    exit 1
fi

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "Erro: SUPABASE_ACCESS_TOKEN não está definida"
    exit 1
fi

# Linkar o projeto
echo "Linkando projeto..."
supabase link --project-ref $SUPABASE_PROJECT_ID

# Aplicar migrações
echo "Aplicando migrações..."
supabase db push

# Configurar tipos TypeScript
echo "Gerando tipos TypeScript..."
supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/supabase-generated.ts

# Deploy das funções (se existirem)
if [ -d "supabase/functions" ]; then
    echo "Deployando funções..."
    supabase functions deploy
fi

echo "Ambiente de produção configurado com sucesso!"

echo "
Próximos passos:
1. Verifique se todas as variáveis de ambiente estão configuradas no dashboard do Supabase
2. Configure os provedores de autenticação necessários
3. Configure os buckets de storage, se necessário
"