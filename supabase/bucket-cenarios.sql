-- Bucket pras fotos dos 3 cenários da calculadora (Fase 4) — a coluna
-- cenarios.imagem_url já existia desde a Fase 3, mas não tinha bucket nem
-- tela de admin pra usar. Mesma regra de segurança dos outros buckets:
-- leitura livre, escrita só autenticada. Rode este arquivo uma vez no SQL
-- Editor do Supabase.

insert into storage.buckets (id, name, public)
values ('cenarios', 'cenarios', true)
on conflict (id) do nothing;

create policy "leitura publica cenarios" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'cenarios');

create policy "escrita autenticada cenarios" on storage.objects
  for all
  to authenticated
  using (bucket_id = 'cenarios')
  with check (bucket_id = 'cenarios');
