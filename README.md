# Site da Anne

Portfólio e calculadora de encomendas da ilustradora Anne (@anne_ilustradora).
Site estático (HTML, CSS e JavaScript puro, sem build) com conteúdo editável
por um painel de administração ligado ao Supabase.

## Páginas

| Página | Arquivo | O que é |
|---|---|---|
| Início | `index.html` | Central de links, avatar, galeria e chamada para o orçamento |
| Orçamento | `orcamento.html` | Calculadora de encomendas: monta um pedido com vários itens (personagem ou cenário), aplica descontos e fecha pelo WhatsApp ou DM |
| Fim Anti-Herói | `fimantiheroi.html` | Página da webcomic: sinopse, personagens, galeria e links de leitura |
| Painel | `admin.html` | Área logada onde a Anne edita preços, cenários, galeria, links e a página do Fim Anti-Herói |

## Stack

- **HTML5 / CSS3 / JavaScript (ES5, sem framework nem bundler)**
- **Supabase** — Postgres (conteúdo), Storage (imagens) e Auth (login do painel)
- **Vercel** — hospedagem e deploy automático a cada push na `main`
- **Google Fonts** — Caveat Brush, Gluten, Nunito

## Estrutura

```
index.html · orcamento.html · fimantiheroi.html · admin.html
css/
  tokens.css      variáveis de cor (tema claro e escuro)
  base.css        estilos compartilhados + transição entre páginas
  orcamento.css   estilos da calculadora
  fim.css         estilos da página do Fim Anti-Herói
  admin.css       estilos do painel
js/
  supabase.js     URL, anon key e helper de leitura da API REST
  auth.js         login e sessão do painel (Supabase Auth via fetch)
  dados.js        CONFIG/DADOS da calculadora (preenchidos pelo banco)
  calculo.js      lógica do pedido (cálculo, render, eventos)
  fim.js          renderização da página do Fim Anti-Herói
  index.js        galeria e links da página inicial
  avatar.js       avatar compartilhado pelas páginas públicas
  fundo.js        fundo customizável do site
  icones.js       ícones prontos dos links
  lightbox.js     visualização ampliada de imagens
  rise.js         animação de entrada ao rolar
  transicao.js    fallback de transição entre páginas
  admin-*.js      abas do painel
assets/           avatar e exemplos da calculadora (.webp)
supabase/         schema, políticas de RLS e scripts de migração inicial
vercel.json       desativa o build da Vercel
```

Cada HTML linka o CSS por `<link>` e o JS por `<script defer>` no `<head>`.
CSS e JS são compartilhados entre as páginas para aproveitar o cache do navegador.

## Rodar localmente

O site é estático. Sirva a pasta com qualquer servidor HTTP:

```bash
npx serve .
# ou
python -m http.server
```

Abrir os arquivos por `file://` não funciona — as chamadas ao Supabase exigem
`http://`.

## Deploy

Push na `main` → a Vercel publica automaticamente. Não há passo de build:
`vercel.json` desativa o build e os arquivos do repositório são servidos como
estão.

## Banco de dados e imagens

Preços, cenários, galeria, avatar, links, sinopse e personagens ficam no
Supabase, não no código. `js/dados.js` e `js/fim.js` começam com objetos vazios
e os preenchem por `fetch` na API REST; o restante do código trata esses dados
como conteúdo externo.

As imagens são servidas pelo Supabase Storage. `assets/` guarda apenas o avatar
e os exemplos da calculadora, usados como fallback local.

- `supabase/schema.sql` — tabelas e Row Level Security (leitura pública, escrita
  só autenticada)
- `supabase/policies.sql` — políticas e buckets do Storage
- `supabase/migrar.mjs` e demais scripts — migração inicial, executados uma vez

A `anon key` em `js/supabase.js` é pública por design (limitada pelas políticas
de RLS). A `service_role key` nunca entra no repositório.

## Editar conteúdo

A Anne edita preços, cenários, galeria, links e a página do Fim Anti-Herói pelo
painel em `admin.html`. As mudanças valem na próxima visita, sem deploy.

Layout, estilo e a lógica de cálculo continuam sendo código — edite os arquivos
e faça push.
