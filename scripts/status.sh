#!/usr/bin/env bash

# Script para verificar o status do Supabase

echo "Verificando status do Supabase..."

# Verificar status do Supabase
supabase status

# Verificar conexão com o banco de dados
echo "
Verificando conexão com o banco de dados..."
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT version();" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Conexão com o banco de dados: OK"
else
    echo "✗ Conexão com o banco de dados: FALHOU"
fi

# Verificar tabelas principais
echo "
Verificando tabelas principais..."
TABLES=("users" "fields" "time_slots" "bookings" "teams" "players" "reviews" "games")
for table in "${TABLES[@]}"; do
    psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT COUNT(*) FROM $table;" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✓ Tabela $table: OK"
    else
        echo "✗ Tabela $table: FALHOU"
    fi
done

# Verificar funções principais
echo "
Verificando funções principais..."
FUNCTIONS=("calculate_field_rating" "update_time_slot_availability" "is_field_owner")
for function in "${FUNCTIONS[@]}"; do
    psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT proname FROM pg_proc WHERE proname = '$function';" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✓ Função $function: OK"
    else
        echo "✗ Função $function: FALHOU"
    fi
done

echo "
Verificação concluída!"