-- Script para configurar o auth do Supabase

-- Configurar domínios de redirecionamento permitidos
insert into auth.config (key, value)
values 
  ('additional_redirect_urls', '["http://localhost:3000/**", "https://seu-dominio.com/**"]'),
  ('disable_signup', 'false'),
  ('email_confirmations_enabled', 'true'),
  ('email_verification_enabled', 'true'),
  ('external_email_enabled', 'true'),
  ('external_phone_enabled', 'false'),
  ('jwt_exp', '3600'),
  ('jwt_aud', 'authenticated'),
  ('mailersend_api_key', ''),
  ('mailersend_from_address', ''),
  ('mailersend_from_name', ''),
  ('mailersend_host', ''),
  ('mailersend_port', '587'),
  ('mailersend_secure', 'true'),
  ('mailersend_template_id', ''),
  ('mailgun_api_key', ''),
  ('mailgun_domain', ''),
  ('mailgun_from_address', ''),
  ('mailgun_from_name', ''),
  ('mailgun_host', ''),
  ('mailgun_port', '587'),
  ('mailgun_secure', 'true'),
  ('mailgun_template_id', ''),
  ('postmark_api_key', ''),
  ('postmark_from_address', ''),
  ('postmark_from_name', ''),
  ('postmark_host', ''),
  ('postmark_port', '587'),
  ('postmark_secure', 'true'),
  ('postmark_template_id', ''),
  ('sendgrid_api_key', ''),
  ('sendgrid_from_address', ''),
  ('sendgrid_from_name', ''),
  ('sendgrid_host', ''),
  ('sendgrid_port', '587'),
  ('sendgrid_secure', 'true'),
  ('sendgrid_template_id', ''),
  ('smtp_api_key', ''),
  ('smtp_from_address', ''),
  ('smtp_from_name', ''),
  ('smtp_host', ''),
  ('smtp_port', '587'),
  ('smtp_secure', 'true'),
  ('smtp_template_id', ''),
  ('smtp_user', ''),
  ('smtp_pass', ''),
  ('test_otp_phone', ''),
  ('test_otp_code', ''),
  ('webhook_url', '');

-- Configurar provedores OAuth
insert into auth.providers (id, name, active, config)
values 
  ('google', 'Google', true, '{}'),
  ('facebook', 'Facebook', false, '{}'),
  ('github', 'GitHub', false, '{}'),
  ('azure', 'Azure', false, '{}'),
  ('bitbucket', 'Bitbucket', false, '{}'),
  ('discord', 'Discord', false, '{}'),
  ('gitlab', 'GitLab', false, '{}'),
  ('keycloak', 'Keycloak', false, '{}'),
  ('linkedin', 'LinkedIn', false, '{}'),
  ('notion', 'Notion', false, '{}'),
  ('slack', 'Slack', false, '{}'),
  ('spotify', 'Spotify', false, '{}'),
  ('twitch', 'Twitch', false, '{}'),
  ('twitter', 'Twitter', false, '{}'),
  ('workos', 'WorkOS', false, '{}');

-- Configurar hooks de auth
create or replace function auth.custom_access_token_hook(event jsonb)
returns jsonb as $$
declare
  claims jsonb;
  user_data jsonb;
begin
  -- Obter dados do usuário
  select jsonb_build_object(
    'user_type', u.user_type,
    'name', u.name
  ) into user_data
  from users u
  where u.id = (event->>'user_id')::uuid;

  -- Adicionar claims personalizadas
  claims := jsonb_build_object(
    'app_metadata', user_data
  );

  -- Retornar evento com claims adicionais
  event := jsonb_set(event, '{claims}', claims);
  
  return event;
end;
$$ language plpgsql security definer;

-- Configurar triggers para auth
create or replace function auth.custom_user_created_hook()
returns trigger as $$
begin
  -- Criar perfil de usuário na tabela users
  insert into users (id, email, user_type)
  values (
    new.id,
    new.email,
    'PLAYER' -- Tipo padrão
  );
  
  return new;
end;
$$ language plpgsql security definer;

-- Gatilho para criar perfil de usuário após registro
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure auth.custom_user_created_hook();