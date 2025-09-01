#!/usr/bin/env bash

# Script para configurar o ambiente de desenvolvimento completo

set -e  # Sair imediatamente se um comando falhar

echo "Configurando ambiente de desenvolvimento completo..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "Node.js não encontrado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "npm não encontrado. Por favor, instale o npm primeiro."
    exit 1
fi

# Instalar dependências do projeto
echo "Instalando dependências do projeto..."
npm ci

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI não encontrado. Instalando..."
    npm install -g supabase
fi

# Iniciar o Supabase local
echo "Iniciando Supabase local..."
supabase start

# Aplicar migrações
echo "Aplicando migrações..."
supabase db reset

# Popular o banco de dados com dados de exemplo
echo "Populando banco de dados..."
supabase db seed

# Configurar tipos TypeScript
echo "Gerando tipos TypeScript..."
supabase gen types typescript --local > src/types/supabase-generated.ts

# Verificar se o Docker está instalado
if command -v docker &> /dev/null; then
    echo "Iniciando serviços com Docker Compose..."
    docker-compose up -d
fi

# Criar arquivo .env.local se não existir
if [ ! -f .env.local ]; then
    echo "Criando arquivo .env.local..."
    cp .env.local.example .env.local
    echo "ATENÇÃO: Configure as variáveis de ambiente em .env.local"
fi

# Executar testes
echo "Executando testes..."
npm test

echo "
Ambiente de desenvolvimento configurado com sucesso!

Próximos passos:
1. Configure as variáveis de ambiente em .env.local
2. Execute 'npm run dev' para iniciar a aplicação em modo de desenvolvimento
3. Acesse http://localhost:3000 no seu navegador
4. Acesse o Supabase Studio em http://localhost:54329 (se estiver usando Docker)
"