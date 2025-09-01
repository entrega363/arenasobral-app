#!/usr/bin/env bash

# Script para limpar o ambiente de desenvolvimento do Supabase

set -e  # Sair imediatamente se um comando falhar

echo "Limpando ambiente de desenvolvimento do Supabase..."

# Parar o Supabase
echo "Parando Supabase..."
supabase stop

# Remover volumes do Docker (isso irá apagar todos os dados)
echo "Removendo volumes do Docker..."
docker volume rm supabase_db supabase_auth supabase_storage supabase_functions supabase_realtime supabase_inbucket supabase_edge_runtime 2>/dev/null || true

# Remover arquivos de configuração locais
echo "Removendo arquivos de configuração locais..."
rm -f supabase/.temp supabase/.branches 2>/dev/null || true

# Remover diretório de backups
echo "Removendo diretório de backups..."
rm -rf backups 2>/dev/null || true

echo "Ambiente de desenvolvimento limpo com sucesso!"

echo "
Para reconfigurar o ambiente:
1. Execute 'supabase start' para iniciar o Supabase
2. Execute 'supabase db reset' para aplicar as migrações
3. Execute 'supabase db seed' para popular com dados de exemplo
"