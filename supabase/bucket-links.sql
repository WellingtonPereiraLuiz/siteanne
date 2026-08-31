-- Bucket pras imagens de ícone dos links da página inicial (Fase 5) — usado
-- só quando a Anne escolhe "subir imagem" no lugar de um ícone pronto.
-- Mesma regra dos outros buckets: leitura livre, escrita só autenticada.
-- Rode este arquivo uma vez no SQL Editor do Supabase.

insert into storage.buckets (id, name, public)
values ('links', 'links', true)
on conflict (id) do nothing;

create policy "leitura publica links" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'links');

create policy "escrita autenticada links" on storage.objects
  for all
  to authenticated
  using (bucket_id = 'links')
  with check (bucket_id = 'links');
