-- ============================================================
-- Esquema do banco do site da Anne — Fase 3 (Supabase)
-- Rode este arquivo inteiro no SQL Editor do painel do Supabase
-- (Project > SQL Editor > New query > colar > Run).
--
-- Cada "create table" já vem seguido de "enable row level security"
-- SEM nenhuma política. Isso é proposital: no Postgres/Supabase, RLS
-- ligado + zero políticas = ninguém (nem anon, nem authenticated)
-- consegue ler ou escrever nada pela API pública. Só quem tem a
-- service_role key (que ignora RLS) consegue mexer, e essa chave só
-- existe no seu computador/na Vercel, nunca no site.
-- As políticas de leitura/escrita entram na Etapa 3 (policies.sql),
-- rodada logo depois desta.
-- ============================================================

-- ---------- configuracao ----------
-- Guarda "blocos" de configuração como JSON, um por linha. Isso evita
-- criar uma tabela e uma tela de admin diferente pra cada tipo de
-- configuração — o painel só lê/grava o jsonb do "chave" certo.
-- Linhas que vamos usar: 'precos', 'acabamentos', 'descontosVolume',
-- 'comercial' (tudo isso é hoje o objeto DADOS de js/dados.js) e
-- 'perfil' (avatar_url, fundo_url, instagram, whatsapp — o que hoje é
-- CONFIG em js/dados.js + o avatar do index.html).
create table if not exists configuracao (
  chave        text primary key,
  valor        jsonb not null,
  atualizado_em timestamptz not null default now()
);
alter table configuracao enable row level security;

-- ---------- cenarios ----------
-- Uma linha por categoria de cenário da calculadora (hoje é o array
-- DADOS.cenarios em js/dados.js). "slug" é o id curto usado no código
-- (ex.: "vegetacao"); "ordem" decide a ordem de exibição na tela.
create table if not exists cenarios (
  id           bigint generated always as identity primary key,
  slug         text not null unique,
  nome         text not null,
  descricao    text not null default '',
  preco_min    numeric not null,
  preco_max    numeric not null,
  imagem_url   text not null default '',
  ordem        int not null default 0,
  atualizado_em timestamptz not null default now()
);
alter table cenarios enable row level security;

-- ---------- links ----------
-- Os botões de "onde me achar" da página inicial (Instagram, Tapas,
-- Webtoon, itch, ArtStation, Apoia.se, a página do Fim Anti-Herói...).
-- Antes da Fase 5 ficavam escritos direto no index.html.
--
-- Ícone de cada link: ou um dos prontos (icone_tipo = 'preset', e
-- "icone_preset" guarda a chave de js/icones.js — ex.: 'instagram'), ou
-- uma imagem que a Anne subiu (icone_tipo = 'imagem', e "icone_url" guarda
-- a URL no bucket "links" do Storage). Só um dos dois é usado de cada vez.
-- "cor" é o fundo do quadradinho do ícone. "visivel" esconde um link sem
-- apagar (igual na galeria).
create table if not exists links (
  id            bigint generated always as identity primary key,
  nome          text not null,
  descricao     text not null default '',
  url           text not null default '',
  icone_tipo    text not null default 'preset',
  icone_preset  text not null default 'link',
  icone_url     text not null default '',
  cor           text not null default '#F3C0B4',
  ordem         int not null default 0,
  visivel       boolean not null default true,
  atualizado_em timestamptz not null default now()
);
alter table links enable row level security;

-- ---------- galeria ----------
-- As fotos da galeria do index.html. "visivel" permite a Anne "esconder"
-- uma foto sem apagar (útil pra testar antes de tirar de vez). "largura"
-- e "altura" guardam o tamanho real do arquivo, pra colocar width/height
-- na <img> e a página não pular enquanto a imagem carrega — a galeria
-- usa layout tipo mosaico, que depende da proporção de cada foto.
create table if not exists galeria (
  id           bigint generated always as identity primary key,
  imagem_url   text not null,
  titulo       text not null default '', -- vira o alt da imagem
  largura      int,
  altura       int,
  ordem        int not null default 0,
  visivel      boolean not null default true,
  atualizado_em timestamptz not null default now()
);
alter table galeria enable row level security;

-- ---------- obra ----------
-- Textos e links da página do Fim Anti-Herói (hoje é DADOS.obra e
-- DADOS.links em js/fim.js), no mesmo estilo chave/valor de
-- "configuracao" — mas aqui o valor é texto simples, não JSON, porque
-- cada linha é só uma frase ou uma URL.
create table if not exists obra (
  chave        text primary key,
  valor        text not null default '',
  atualizado_em timestamptz not null default now()
);
-- chaves que o site espera encontrar aqui:
--   titulo, gancho, sinopse, apoio_texto, capa,
--   link_tapas, link_webtoon, link_apoiase
alter table obra enable row level security;

-- ---------- personagens ----------
-- Um por personagem do Fim Anti-Herói (hoje é o array DADOS.personagens
-- em js/fim.js).
-- "img_url" é a foto principal do personagem — a arte grande que aparece
-- no topo do card (igual já era desde a Fase 3). "personagem_imagens"
-- abaixo é a galeria de fotos extras, num carrossel à parte — a Fase 4
-- trocou o antigo comparativo "antes e agora" por essa galeria.
create table if not exists personagens (
  id             bigint generated always as identity primary key,
  nome           text not null,
  descricao      text not null default '',
  img_url        text not null default '',
  ordem          int not null default 0,
  atualizado_em  timestamptz not null default now()
);
alter table personagens enable row level security;

-- ---------- personagem_imagens ----------
-- Fase 4: o comparativo "antes e agora" de cada personagem virou uma mini
-- galeria de fotos. Uma linha por foto; "ordem" decide a posição (a de
-- ordem mais baixa aparece como a arte principal do personagem). Usa o
-- bucket "personagens" que já existe no Storage — não precisa bucket novo.
create table if not exists personagem_imagens (
  id            bigint generated always as identity primary key,
  personagem_id bigint not null references personagens(id) on delete cascade,
  url           text not null,
  ordem         int not null default 0,
  atualizado_em timestamptz not null default now()
);
alter table personagem_imagens enable row level security;
