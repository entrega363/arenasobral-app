#!/usr/bin/env bash

# Script para atualizar o esquema do banco de dados do Supabase

set -e  # Sair imediatamente se um comando falhar

echo "Atualizando esquema do banco de dados do Supabase..."

# Gerar migração a partir das alterações no esquema
echo "Gerando migração..."
MIGRATION_NAME="update_schema_$(date +%Y%m%d_%H%M%S)"
supabase db diff -f $MIGRATION_NAME

# Aplicar migração
echo "Aplicando migração..."
supabase db push

# Atualizar tipos TypeScript
echo "Atualizando tipos TypeScript..."
supabase gen types typescript --local > src/types/supabase-generated.ts

echo "Esquema atualizado com sucesso!"

echo "
Próximos passos:
1. Verifique se a migração foi aplicada corretamente
2. Teste a aplicação para garantir que tudo está funcionando
3. Faça commit das alterações de esquema
"