#!/usr/bin/env bash

# Script para limpar todos os serviços do Docker Compose

set -e  # Sair imediatamente se um comando falhar

echo "Limpando todos os serviços do Docker Compose..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null
then
    echo "Docker não encontrado."
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose não encontrado."
    exit 1
fi

# Parar todos os serviços
echo "Parando serviços..."
docker-compose down

# Remover volumes
echo "Removendo volumes..."
docker-compose down -v

# Remover imagens
echo "Removendo imagens..."
docker-compose down --rmi all

# Limpar sistema Docker (opcional - descomente se quiser)
# echo "Limpando sistema Docker..."
# docker system prune -af

echo "Serviços limpos com sucesso!"