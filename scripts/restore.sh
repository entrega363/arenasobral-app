#!/usr/bin/env bash

# Script para restaurar o banco de dados do Supabase

set -e  # Sair imediatamente se um comando falhar

# Verificar se foi fornecido um arquivo de backup
if [ $# -eq 0 ]; then
    echo "Uso: $0 <arquivo_de_backup.sql>"
    echo "Exemplo: $0 backups/supabase_backup_20230101_120000_full.sql"
    exit 1
fi

BACKUP_FILE=$1

# Verificar se o arquivo de backup existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Arquivo de backup não encontrado: $BACKUP_FILE"
    exit 1
fi

echo "Restaurando banco de dados do Supabase..."
echo "Arquivo de backup: $BACKUP_FILE"

# Confirmar restauração
echo "ATENÇÃO: Esta operação irá substituir todos os dados atuais!"
read -p "Tem certeza que deseja continuar? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restauração cancelada."
    exit 0
fi

# Parar o Supabase
echo "Parando Supabase..."
supabase stop

# Iniciar o Supabase
echo "Iniciando Supabase..."
supabase start

# Restaurar o backup
echo "Restaurando backup..."
supabase db reset
psql -h localhost -p 54322 -U postgres -d postgres -f "$BACKUP_FILE"

echo "Restauração concluída com sucesso!"