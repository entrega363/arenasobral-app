#!/usr/bin/env bash

# Script para executar testes de performance

set -e  # Sair imediatamente se um comando falhar

echo "Executando testes de performance..."

# Verificar se as ferramentas necessárias estão instaladas
if ! command -v ab &> /dev/null; then
    echo "Apache Bench (ab) não encontrado. Instalando..."
    if command -v apt &> /dev/null; then
        sudo apt update && sudo apt install -y apache2-utils
    elif command -v yum &> /dev/null; then
        sudo yum install -y httpd-tools
    elif command -v brew &> /dev/null; then
        brew install httpd
    else
        echo "Não foi possível instalar Apache Bench. Por favor, instale manualmente."
        exit 1
    fi
fi

# Iniciar a aplicação em modo de produção (se não estiver rodando)
echo "Verificando se a aplicação está rodando..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "Iniciando a aplicação..."
    npm run start &
    sleep 10
fi

# Testes de performance para endpoints principais
echo "Executando testes de performance..."

# Teste de performance para a página inicial
echo "Teste 1: Página inicial"
ab -n 1000 -c 10 http://localhost:3000/ > docs/performance/homepage.txt

# Teste de performance para a API de campos
echo "Teste 2: API de campos"
ab -n 1000 -c 10 http://localhost:3000/api/fields > docs/performance/fields-api.txt

# Teste de performance para a API de reservas
echo "Teste 3: API de reservas"
ab -n 1000 -c 10 http://localhost:3000/api/bookings > docs/performance/bookings-api.txt

# Teste de performance para a API de usuários
echo "Teste 4: API de usuários"
ab -n 1000 -c 10 http://localhost:3000/api/users > docs/performance/users-api.txt

# Teste de performance para o banco de dados
echo "Teste 5: Banco de dados"
psql -h localhost -p 54322 -U postgres -d postgres -c "
EXPLAIN ANALYZE 
SELECT f.*, COUNT(b.id) as booking_count 
FROM fields f 
LEFT JOIN bookings b ON f.id = b.field_id 
GROUP BY f.id 
ORDER BY f.rating DESC 
LIMIT 50;
" > docs/performance/database-query.txt

echo "Testes de performance concluídos!"
echo "Resultados salvos em: docs/performance/"