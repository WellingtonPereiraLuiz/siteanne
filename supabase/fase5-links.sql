-- Fase 5: popula a tabela "links" com os 7 botões que já estavam escritos
-- direto no index.html, cada um com o ícone pronto correspondente (ver
-- js/icones.js) e a cor que ele já tinha no css/base.css.
--
-- Rode UMA VEZ no SQL Editor do Supabase, depois do schema.sql +
-- policies.sql. O "where not exists" faz nada acontecer se a tabela já
-- tiver algum link — então rodar de novo por engano não duplica nem apaga
-- o que a Anne cadastrou pelo painel.

insert into links (nome, descricao, url, icone_tipo, icone_preset, cor, ordem, visivel)
select v.* from (values
  ('Instagram',
   'Artes novas, processos e avisos de encomenda',
   'https://www.instagram.com/anne_ilustradora',
   'preset', 'instagram', '#F0C0AA', 1, true),
  ('Fim Anti-Herói',
   'Sinopse, personagens e onde ler a HQ',
   'fimantiheroi.html',
   'preset', 'livro', '#D5C3DA', 2, true),
  ('Finn, o Anti-Herói · Tapas',
   'Leia a HQ em episódios',
   'https://tapas.io/series/finn-o-antiheroi',
   'preset', 'tapas', '#F3C0B4', 3, true),
  ('Finn, o Anti-Herói · Webtoon',
   'A mesma HQ, no formato de rolagem',
   'https://www.webtoons.com/en/canvas/finn-o-anti-heroi/list?title_no=1162705',
   'preset', 'webtoon', '#C3D2B3', 4, true),
  ('A Carta no Livro',
   'Visual novel na itch.io — jogue de graça',
   'https://annestudios.itch.io/a-carta-no-livro',
   'preset', 'jogos', '#E5A0A2', 5, true),
  ('Portfólio na ArtStation',
   'Trabalhos reunidos em alta resolução',
   'https://www.artstation.com/annestudios',
   'preset', 'paleta', '#B9C6C4', 6, true),
  ('Apoia.se',
   'Apoie a HQ e receba conteúdo antes de todo mundo',
   'https://apoia.se/anneilustradora',
   'preset', 'coracao', '#B25B37', 7, true)
) as v(nome, descricao, url, icone_tipo, icone_preset, cor, ordem, visivel)
where not exists (select 1 from links);
