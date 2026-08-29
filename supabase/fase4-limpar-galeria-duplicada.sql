-- Migração pontual: quando a galeria de personagem foi criada, a foto que
-- já existia em personagens.img_url foi copiada pra dentro de
-- personagem_imagens (ver supabase/fase4-personagens.sql), assumindo que
-- "a primeira foto da galeria" seria a principal. Depois foi decidido que
-- "foto principal" (img_url) e "fotos da galeria" (personagem_imagens) são
-- coisas separadas — então aquela cópia ficou duplicada: a mesma imagem
-- aparecendo como principal E como primeira foto da galeria.
--
-- Este script remove só essas duplicatas exatas (compara a URL da foto da
-- galeria com o img_url do personagem) — qualquer foto que a Anne já tenha
-- adicionado de verdade na galeria continua intacta, porque a URL dela é
-- diferente do img_url.
--
-- Rode uma vez no SQL Editor do Supabase.

delete from personagem_imagens pi
using personagens p
where pi.personagem_id = p.id
  and pi.url = p.img_url;
