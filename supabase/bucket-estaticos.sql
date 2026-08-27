-- Bucket extra pras imagens que a Anne ainda não edita pelo painel nesta
-- fase: exemplos de estilo da calculadora (ex_cartoon.webp etc.) e as
-- tabelas de preço em foto (tab_*.webp). Ficam com URL fixa, referenciada
-- direto no HTML/JS — sem linha de banco, porque não há o que editar
-- por enquanto. Mesma regra de segurança dos outros três: leitura livre,
-- escrita só autenticada.

insert into storage.buckets (id, name, public)
values ('estaticos', 'estaticos', true)
on conflict (id) do nothing;

create policy "leitura publica estaticos" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'estaticos');

create policy "escrita autenticada estaticos" on storage.objects
  for all
  to authenticated
  using (bucket_id = 'estaticos')
  with check (bucket_id = 'estaticos');
