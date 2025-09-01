#!/usr/bin/env bash

# Script para verificar o status de todos os serviços com Docker Compose

echo "Verificando status dos serviços com Docker Compose..."

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

# Verificar status dos serviços
echo "Status dos serviços:"
docker-compose ps

# Verificar logs dos serviços
echo "
Últimas 20 linhas de log de cada serviço:"
for service in $(docker-compose config --services); do
    echo "
=== $service ==="
    docker-compose logs --tail=20 $service
done