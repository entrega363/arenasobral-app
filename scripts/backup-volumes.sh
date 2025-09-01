#!/usr/bin/env bash

# Script para fazer backup dos volumes do Docker Compose

set -e  # Sair imediatamente se um comando falhar

# Configurações
BACKUP_DIR="./docker-backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="docker_volumes_backup_$DATE"

echo "Iniciando backup dos volumes do Docker Compose..."

# Criar diretório de backups se não existir
mkdir -p $BACKUP_DIR

# Parar todos os serviços
echo "Parando serviços..."
docker-compose down

# Fazer backup de cada volume
echo "Fazendo backup dos volumes..."
for volume in $(docker volume ls -q | grep arenasobral); do
    echo "Fazendo backup do volume: $volume"
    docker run --rm -v $volume:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/${volume}_${BACKUP_NAME}.tar.gz -C /data .
done

echo "Backup concluído com sucesso!"
echo "Backups salvos em: $BACKUP_DIR"