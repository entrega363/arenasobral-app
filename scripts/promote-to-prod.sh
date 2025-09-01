#!/usr/bin/env bash

# Script para promover alterações do staging para produção

set -e  # Sair imediatamente se um comando falhar

echo "Promovendo alterações do staging para produção..."

# Verificar se as variáveis de ambiente estão definidas
if [ -z "$SUPABASE_STAGING_PROJECT_ID" ]; then
    echo "Erro: SUPABASE_STAGING_PROJECT_ID não está definida"
    exit 1
fi

if [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo "Erro: SUPABASE_PROJECT_ID não está definida"
    exit 1
fi

# Confirmar promoção
echo "ATENÇÃO: Esta operação irá promover as alterações do ambiente de staging para produção!"
read -p "Tem certeza que deseja continuar? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Promoção cancelada."
    exit 0
fi

# Gerar diff entre staging e produção
echo "Gerando diff entre staging e produção..."
supabase db diff --project-ref $SUPABASE_STAGING_PROJECT_ID --production-ref $SUPABASE_PROJECT_ID

# Aplicar migrações na produção
echo "Aplicando migrações na produção..."
supabase db push --project-ref $SUPABASE_PROJECT_ID

# Deploy das funções na produção (se existirem)
if [ -d "supabase/functions" ]; then
    echo "Deployando funções na produção..."
    supabase functions deploy --project-ref $SUPABASE_PROJECT_ID
fi

# Atualizar tipos TypeScript
echo "Atualizando tipos TypeScript..."
supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/supabase-generated.ts

echo "Alterações promovidas para produção com sucesso!"

echo "
Próximos passos:
1. Verifique se a aplicação está funcionando corretamente em produção
2. Monitore os logs para qualquer erro
3. Notifique a equipe sobre a promoção
"