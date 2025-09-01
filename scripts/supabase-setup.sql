-- Script principal para configurar todas as funções do Supabase

-- 1. Criar extensões necessárias
\ir extensions.sql

-- 2. Criar tabelas principais
\ir supabase-init.sql

-- 3. Configurar políticas de segurança de linha (RLS)
\ir supabase-rls.sql

-- 4. Configurar gatilhos e funções
\ir supabase-triggers.sql

-- 5. Configurar armazenamento
\ir supabase-storage.sql

-- 6. Configurar autenticação
\ir supabase-auth.sql

-- 7. Configurar índices e otimizações
\ir supabase-optimization.sql

-- 8. Configurar testes e migrações
\ir supabase-migrations.sql

-- 9. Configurar monitoramento e logs
\ir supabase-monitoring.sql

-- 10. Configurar funções de utilidade
\ir supabase-utilities.sql

-- 11. Configurar funções de busca e filtragem
\ir supabase-search.sql

-- 12. Configurar funções de relatórios
\ir supabase-reports.sql

-- 13. Configurar funções de notificações
\ir supabase-notifications.sql

-- 14. Configurar funções de segurança
\ir supabase-security.sql

-- 15. Configurar funções de integração com serviços externos
\ir supabase-integrations.sql

-- Mensagem de conclusão
\echo 'Todas as funções do Supabase foram configuradas com sucesso!'