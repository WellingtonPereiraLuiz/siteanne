-- ============================================================
-- Políticas de segurança (RLS) + buckets do Storage — Fase 3
-- Rode DEPOIS do schema.sql, também no SQL Editor do Supabase.
--
-- Ideia geral, pra cada tabela: duas políticas.
--   1) "leitura pública"     — quem visita o site (papel "anon") e quem
--      está logada (papel "authenticated") podem LER.
--   2) "escrita autenticada" — só quem está logada pode INSERIR, ATUALIZAR
--      ou APAGAR ("for all" cobre as três ações de escrita de uma vez).
-- Como o cadastro público vai ficar desligado (Etapa 4), a única conta
-- que existe é a da Anne — então "quem está logada" na prática só pode
-- ser ela.
-- ============================================================

-- ---------- configuracao ----------
create policy "leitura publica" on configuracao
  for select
  to anon, authenticated
  using (true);

create policy "escrita autenticada" on configuracao
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------- cenarios ----------
create policy "leitura publica" on cenarios
  for select
  to anon, authenticated
  using (true);

create policy "escrita autenticada" on cenarios
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------- galeria ----------
create policy "leitura publica" on galeria
  for select
  to anon, authenticated
  using (true);

create policy "escrita autenticada" on galeria
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------- obra ----------
create policy "leitura publica" on obra
  for select
  to anon, authenticated
  using (true);

create policy "escrita autenticada" on obra
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------- personagens ----------
create policy "leitura publica" on personagens
  for select
  to anon, authenticated
  using (true);

create policy "escrita autenticada" on personagens
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------- personagem_imagens ----------
create policy "leitura publica" on personagem_imagens
  for select
  to anon, authenticated
  using (true);

create policy "escrita autenticada" on personagem_imagens
  for all
  to authenticated
  using (true)
  with check (true);


-- ============================================================
-- Storage: buckets + políticas
--
-- "public = true" no bucket já faz o navegador conseguir CARREGAR uma
-- imagem direto pela URL pública, sem checar nada — é assim que a foto
-- aparece pra qualquer visitante do site. Isso não tem relação com poder
-- ENVIAR ou APAGAR arquivo: subir/trocar/apagar sempre passa pela API,
-- que respeita as políticas de RLS abaixo. Ou seja: "público" resolve a
-- leitura sozinho; a política é o que garante que só quem está logada
-- consegue mexer no conteúdo dos buckets.
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('galeria', 'galeria', true),
  ('perfil', 'perfil', true),
  ('personagens', 'personagens', true)
on conflict (id) do nothing;

-- RLS em storage.objects já vem ligado por padrão no Supabase (a tabela é
-- de propriedade do supabase_storage_admin — nem dá pra rodar "alter table
-- ... enable row level security" nela pelo SQL Editor, só falta permissão).
-- Só falta criar as políticas mesmo.

create policy "leitura publica buckets do site" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = any (array['galeria', 'perfil', 'personagens']));

create policy "escrita autenticada buckets do site" on storage.objects
  for all
  to authenticated
  using (bucket_id = any (array['galeria', 'perfil', 'personagens']))
  with check (bucket_id = any (array['galeria', 'perfil', 'personagens']));
