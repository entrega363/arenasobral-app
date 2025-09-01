@echo off
REM Script para verificar o status do Supabase no Windows

echo Verificando status do Supabase...

REM Verificar status do Supabase
supabase status

REM Verificar conexão com o banco de dados
echo.
echo Verificando conexão com o banco de dados...
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT version();" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Conexão com o banco de dados: OK
) else (
    echo ✗ Conexão com o banco de dados: FALHOU
)

REM Verificar tabelas principais
echo.
echo Verificando tabelas principais...
set TABLES=users fields time_slots bookings teams players reviews games
for %%t in (%TABLES%) do (
    psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT COUNT(*) FROM %%t;" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✓ Tabela %%t: OK
    ) else (
        echo ✗ Tabela %%t: FALHOU
    )
)

REM Verificar funções principais
echo.
echo Verificando funções principais...
set FUNCTIONS=calculate_field_rating update_time_slot_availability is_field_owner
for %%f in (%FUNCTIONS%) do (
    psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT proname FROM pg_proc WHERE proname = '%%f';" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✓ Função %%f: OK
    ) else (
        echo ✗ Função %%f: FALHOU
    )
)

echo.
echo Verificação concluída!