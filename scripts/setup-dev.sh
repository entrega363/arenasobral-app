#!/usr/bin/env bash

# Script para configurar o ambiente de desenvolvimento do Supabase

set -e  # Sair imediatamente se um comando falhar

echo "Configurando ambiente de desenvolvimento do Supabase..."

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null
then
    echo "Supabase CLI não encontrado. Instalando..."
    npm install -g supabase
fi

# Iniciar o Supabase local (se não estiver rodando)
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

echo "Ambiente de desenvolvimento configurado com sucesso!"

echo "
Próximos passos:
1. Configure as variáveis de ambiente no arquivo .env.local
2. Execute 'npm run dev' para iniciar a aplicação
3. Acesse http://localhost:3000 no seu navegador
"