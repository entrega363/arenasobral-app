#!/usr/bin/env bash

# Script para reiniciar todos os serviços com Docker Compose

set -e  # Sair imediatamente se um comando falhar

echo "Reiniciando serviços com Docker Compose..."

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

# Construir e iniciar todos os serviços
echo "Construindo e iniciando serviços..."
docker-compose up -d --build

# Aguardar alguns segundos para os serviços iniciarem
echo "Aguardando inicialização dos serviços..."
sleep 30

# Verificar status dos serviços
echo "Verificando status dos serviços..."
docker-compose ps

echo "
Serviços reiniciados com sucesso!

Acesse os serviços em:
- Aplicação: http://localhost:3000
- Supabase Studio: http://localhost:54329
- Supabase Auth: http://localhost:54321
- Supabase Storage: http://localhost:54323
- Supabase Functions: http://localhost:54324
- Supabase REST: http://localhost:54325
- Supabase Realtime: http://localhost:54326
- Inbucket (Email): http://localhost:54327
"