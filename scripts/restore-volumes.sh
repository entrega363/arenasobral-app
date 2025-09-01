#!/usr/bin/env bash

# Script para restaurar os volumes do Docker Compose

set -e  # Sair imediatamente se um comando falhar

# Verificar se foi fornecido um arquivo de backup
if [ $# -eq 0 ]; then
    echo "Uso: $0 <diretório_de_backup>"
    echo "Exemplo: $0 docker-backups"
    exit 1
fi

BACKUP_DIR=$1

# Verificar se o diretório de backup existe
if [ ! -d "$BACKUP_DIR" ]; then
    echo "Diretório de backup não encontrado: $BACKUP_DIR"
    exit 1
fi

echo "Restaurando volumes do Docker Compose..."
echo "Diretório de backup: $BACKUP_DIR"

# Confirmar restauração
echo "ATENÇÃO: Esta operação irá substituir todos os volumes atuais!"
read -p "Tem certeza que deseja continuar? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restauração cancelada."
    exit 0
fi

# Parar todos os serviços
echo "Parando serviços..."
docker-compose down

# Remover volumes atuais
echo "Removendo volumes atuais..."
docker-compose down -v

# Restaurar volumes do backup
echo "Restaurando volumes do backup..."
for backup_file in $BACKUP_DIR/*.tar.gz; do
    if [ -f "$backup_file" ]; then
        volume_name=$(basename "$backup_file" .tar.gz)
        volume_name=${volume_name%_docker_volumes_backup_*}
        
        echo "Restaurando volume: $volume_name"
        # Criar novo volume
        docker volume create $volume_name
        # Restaurar dados
        docker run --rm -v $volume_name:/data -v $BACKUP_DIR:/backup alpine sh -c "tar xzf /backup/$(basename "$backup_file") -C /data"
    fi
done

echo "Restauração concluída com sucesso!"