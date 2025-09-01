-- Script para configurar o armazenamento do Supabase

-- Criar buckets para diferentes tipos de arquivos
insert into storage.buckets (id, name, public)
values 
  ('field-photos', 'field-photos', true),
  ('profile-pictures', 'profile-pictures', true),
  ('team-logos', 'team-logos', true),
  ('documents', 'documents', false);

-- Políticas para o bucket de fotos de campos
create policy "Todos podem visualizar fotos de campos" on storage.objects
for select using (bucket_id = 'field-photos');

create policy "Proprietários de campos podem fazer upload de fotos" on storage.objects
for insert with check (
  bucket_id = 'field-photos' 
  and auth.role() = 'authenticated'
  and exists (
    select 1 from fields 
    where fields.id = (storage.foldername(name))[2]::uuid
    and fields.owner_id = auth.uid()
  )
);

create policy "Proprietários de campos podem atualizar fotos" on storage.objects
for update using (
  bucket_id = 'field-photos' 
  and auth.role() = 'authenticated'
  and exists (
    select 1 from fields 
    where fields.id = (storage.foldername(name))[2]::uuid
    and fields.owner_id = auth.uid()
  )
);

create policy "Proprietários de campos podem deletar fotos" on storage.objects
for delete using (
  bucket_id = 'field-photos' 
  and auth.role() = 'authenticated'
  and exists (
    select 1 from fields 
    where fields.id = (storage.foldername(name))[2]::uuid
    and fields.owner_id = auth.uid()
  )
);

-- Políticas para o bucket de fotos de perfil
create policy "Usuários podem visualizar fotos de perfil" on storage.objects
for select using (bucket_id = 'profile-pictures');

create policy "Usuários podem fazer upload de sua própria foto de perfil" on storage.objects
for insert with check (
  bucket_id = 'profile-pictures' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Usuários podem atualizar sua própria foto de perfil" on storage.objects
for update using (
  bucket_id = 'profile-pictures' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Usuários podem deletar sua própria foto de perfil" on storage.objects
for delete using (
  bucket_id = 'profile-pictures' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[2] = auth.uid()::text
);

-- Políticas para o bucket de logos de times
create policy "Todos podem visualizar logos de times" on storage.objects
for select using (bucket_id = 'team-logos');

create policy "Donos de times podem fazer upload de logos" on storage.objects
for insert with check (
  bucket_id = 'team-logos' 
  and auth.role() = 'authenticated'
  and exists (
    select 1 from teams 
    where teams.id = (storage.foldername(name))[2]::uuid
    and teams.owner_id = auth.uid()
  )
);

create policy "Donos de times podem atualizar logos" on storage.objects
for update using (
  bucket_id = 'team-logos' 
  and auth.role() = 'authenticated'
  and exists (
    select 1 from teams 
    where teams.id = (storage.foldername(name))[2]::uuid
    and teams.owner_id = auth.uid()
  )
);

create policy "Donos de times podem deletar logos" on storage.objects
for delete using (
  bucket_id = 'team-logos' 
  and auth.role() = 'authenticated'
  and exists (
    select 1 from teams 
    where teams.id = (storage.foldername(name))[2]::uuid
    and teams.owner_id = auth.uid()
  )
);

-- Políticas para o bucket de documentos
create policy "Usuários podem visualizar seus próprios documentos" on storage.objects
for select using (
  bucket_id = 'documents' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Usuários podem fazer upload de seus próprios documentos" on storage.objects
for insert with check (
  bucket_id = 'documents' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Usuários podem atualizar seus próprios documentos" on storage.objects
for update using (
  bucket_id = 'documents' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Usuários podem deletar seus próprios documentos" on storage.objects
for delete using (
  bucket_id = 'documents' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[2] = auth.uid()::text
);