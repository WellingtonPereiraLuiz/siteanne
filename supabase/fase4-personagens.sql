-- ============================================================
-- Migração pontual da Fase 4 — personagem vira mini galeria
-- Rode este arquivo INTEIRO uma vez no SQL Editor do Supabase
-- (Project > SQL Editor > New query > colar > Run), depois de já ter
-- rodado schema.sql e policies.sql alguma vez (esse projeto já rodou).
--
-- Confirmado antes de escrever este arquivo: nenhum personagem tinha
-- "mudancas" ou "img_antiga_url" preenchidos de verdade (só texto de
-- exemplo/vazio) — por isso é seguro remover as duas colunas. Já
-- "img_url" tinha foto real nos 5 personagens (Finn, Jake, Marceline,
-- Jujuba, BMO), então este script MIGRA esse valor pra dentro da mini
-- galeria nova (como a primeira foto de cada um) antes de parar de usar
-- a coluna — nenhuma foto que a Anne já subiu se perde.
--
-- O que faz, em ordem:
--   1) Cria personagem_imagens e liga RLS + políticas (mesmo padrão de
--      sempre: leitura pública, escrita só autenticada)
--   2) Copia o img_url atual de cada personagem pra dentro da galeria
--      nova, como a foto de ordem 1 (só quando img_url não está vazio)
--   3) Remove "mudancas" e "img_antiga_url" de personagens — "img_url"
--      fica na tabela (sem uso pelo código a partir de agora), só não é
--      apagada pra não perder o histórico
-- ============================================================

create table if not exists personagem_imagens (
  id            bigint generated always as identity primary key,
  personagem_id bigint not null references personagens(id) on delete cascade,
  url           text not null,
  ordem         int not null default 0,
  atualizado_em timestamptz not null default now()
);
alter table personagem_imagens enable row level security;

create policy "leitura publica" on personagem_imagens
  for select
  to anon, authenticated
  using (true);

create policy "escrita autenticada" on personagem_imagens
  for all
  to authenticated
  using (true)
  with check (true);

insert into personagem_imagens (personagem_id, url, ordem)
select id, img_url, 1
from personagens
where img_url is not null and img_url <> '';

alter table personagens
  drop column if exists mudancas,
  drop column if exists img_antiga_url;
