#!/usr/bin/env bash/env bash

# Script para parar todos os serviços com Docker Compose

set -e  # Sair imediatamente se um comando falhar

echo "Parando serviços com Docker Compose..."

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

echo "Serviços parados com sucesso!"