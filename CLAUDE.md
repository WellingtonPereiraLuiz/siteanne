# Site da Anne — contexto do projeto

Portfólio + calculadora de encomendas da ilustradora Anne (@anne_ilustradora).
Cliente real, trabalho freelance. O dev é iniciante em programação: comente as
decisões não óbvias e explique o plano em português simples antes de implementar.

## Estrutura de pastas

O site é HTML, CSS e JS estático, sem build. Edite os arquivos direto.

```
index.html          página inicial (central de links)
orcamento.html       calculadora de encomendas
fimantiheroi.html    página da webcomic Fim Anti-Herói
css/
  tokens.css        variáveis de cor — tema claro e escuro
  base.css          estilos compartilhados pelas três páginas + transição entre elas
  orcamento.css     estilos exclusivos da página de orçamento
  fim.css           estilos exclusivos da página do Fim Anti-Herói
js/
  dados.js          CONFIG (whatsapp/instagram) e DADOS (preços, acabamentos,
                    descontos de volume, categorias de cenário) — usado por orcamento.html
  calculo.js        a lógica do pedido (cálculo, render, cliques)
  fim.js            DADOS (obra, links, personagens) e a renderização da página do Fim Anti-Herói
  transicao.js      fallback de fade entre páginas pra navegador sem @view-transition
  rise.js           animação de entrada dos elementos ao rolar
assets/             as imagens (.webp), servidas direto — sem base64
```

**Regra do `DADOS`:** todo preço, desconto, categoria de cenário, sinopse,
personagem e link de obra mora dentro de um objeto `DADOS` — `js/dados.js` pra
página de orçamento, `js/fim.js` pra página do Fim Anti-Herói — nunca solto no
HTML nem escrito direto no arquivo de lógica correspondente. Numa fase futura
esses objetos viram um fetch no Supabase, então o resto do código já trata
eles como "dado de fora", não como constante fixa.

Guia rápido de "onde mexo para...":

| Eu quero... | Edito |
|---|---|
| mudar uma cor do tema | `css/tokens.css` |
| mudar espaçamento, fonte, layout de algo que aparece em mais de uma página | `css/base.css` |
| mudar algo só da página de orçamento (chips, barra de total, tabelas) | `css/orcamento.css` |
| mudar texto ou estrutura da página inicial | `index.html` |
| mudar texto ou estrutura da página de orçamento | `orcamento.html` |
| mudar preço, acabamento, desconto, categoria de cenário ou número de WhatsApp | `js/dados.js` (objeto `DADOS` e `CONFIG`) |
| mudar como o pedido soma ou o que a tela mostra | `js/calculo.js` |
| mudar sinopse, gancho, personagem ou link (Tapas/Webtoon/Apoia.se) do Fim Anti-Herói | `js/fim.js` (objeto `DADOS`) |
| mudar estrutura da página do Fim Anti-Herói | `fimantiheroi.html` |
| mudar estilo só dessa página (accordion, botões, comparativo antes/depois) | `css/fim.css` |
| trocar ou adicionar uma imagem | soltar o `.webp` em `assets/` e apontar o `src="assets/nome.webp"` no HTML (ou no `EXEMPLOS` de `dados.js`/`img` de `fim.js`, se for exemplo/arte usada no JS) |
| mudar a duração ou o estilo da transição entre páginas | `css/base.css` (`@view-transition`, `.saindo`, `@starting-style`) e `js/transicao.js` |

Cada HTML linka o CSS com `<link>` e o JS com `<script src>` no fim do body.
Isso evita duplicar CSS entre as páginas e faz o navegador cachear os arquivos —
a segunda página que a pessoa abrir carrega quase instantânea.

Sempre que adicionar uma `<img>`, inclua `width` e `height` com o tamanho real
do arquivo (evita que o layout pule enquanto a imagem carrega) e `loading="lazy"`
se ela estiver fora da primeira tela (galeria, tabelas de preço). Não coloque
`loading="lazy"` no avatar nem em nada visível sem rolar.

## Design system

Estilo adesivo: bordas grossas escuras, sombras deslocadas, elementos rotacionados.
Paleta salmão / laranja terroso / rosa empoeirado, extraída da arte da própria Anne.
Referência de layout dada pela cliente: nielfae.carrd.co

Tokens em `css/tokens.css`, dentro de `:root`. Tema claro e escuro via
`prefers-color-scheme` **e** `[data-theme]` — os dois precisam continuar
funcionando em qualquer coisa nova.
Fontes: Caveat Brush (display), Gluten (títulos), Nunito (corpo).

## Regras não negociáveis

- Sem framework, sem bundler, sem dependência nova. JavaScript puro.
- Mobile primeiro: media queries em 480px, alvos de toque de 44px ou mais.
- Preservar tema claro e escuro em tudo que for adicionado.
- Textos de interface em português do Brasil.
- Nunca commitar chave de API.

## Deploy

GitHub → Vercel, deploy automático a cada push na `main`.
`vercel.json` desliga o build da Vercel — o site já é HTML/CSS/JS pronto,
não precisa de nenhum passo de build no servidor.

## Fechamento do pedido

O CTA leva para o WhatsApp ou para a DM do Instagram. Em `CONFIG`, dentro de
`js/dados.js`: se `whatsapp` estiver vazio, usa a DM. O resumo do pedido é copiado
para a área de transferência antes de sair, porque a DM não aceita texto pré-preenchido.

## Roadmap

- [x] **Fase 0** — abandonar o `build.py`, separar HTML/CSS/JS em pastas e trocar
      o base64 por `assets/*.webp`.
- [x] **Fase 1** — calculadora com pedido de vários itens, descontos de acabamento
      e de volume, cenários por faixa de preço
- [x] **Fase 2** — página do Fim Anti Herói (webcomic da Anne no Tapas e Webtoon)
- [ ] **Fase 3** — Supabase: banco, storage, login e painel de administração;
      as imagens passam de `assets/` para arquivos no Storage
