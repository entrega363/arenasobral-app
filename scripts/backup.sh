#!/usr/bin/env bash

# Script para fazer backup do banco de dados do Supabase

set -e  # Sair imediatamente se um comando falhar

# Configurações
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="supabase_backup_$DATE"

echo "Iniciando backup do banco de dados do Supabase..."

# Criar diretório de backups se não existir
mkdir -p $BACKUP_DIR

# Fazer backup do esquema
echo "Fazendo backup do esquema..."
supabase db dump --schema-only > "$BACKUP_DIR/${BACKUP_NAME}_schema.sql"

# Fazer backup dos dados
echo "Fazendo backup dos dados..."
supabase db dump --data-only > "$BACKUP_DIR/${BACKUP_NAME}_data.sql"

# Fazer backup completo
echo "Fazendo backup completo..."
supabase db dump > "$BACKUP_DIR/${BACKUP_NAME}_full.sql"

# Comprimir backups
echo "Comprimindo backups..."
gzip "$BACKUP_DIR/${BACKUP_NAME}_schema.sql"
gzip "$BACKUP_DIR/${BACKUP_NAME}_data.sql"
gzip "$BACKUP_DIR/${BACKUP_NAME}_full.sql"

echo "Backup concluído com sucesso!"
echo "Backups salvos em: $BACKUP_DIR"
echo "Arquivos criados:"
echo "  - ${BACKUP_NAME}_schema.sql.gz"
echo "  - ${BACKUP_NAME}_data.sql.gz"
echo "  - ${BACKUP_NAME}_full.sql.gz"