# 🎨 Site Anne - Portfolio & Orçamento Interativo

Um website moderno e responsivo para centralizar os links e serviços da ilustradora Anne (@anne_ilustradora). O projeto tem três páginas: uma página de apresentação, um construtor de orçamentos interativo onde clientes podem configurar suas encomendas em tempo real, e uma página dedicada à webcomic Fim Anti-Herói.

---

## 📋 Descrição do Projeto

**Site Anne** é uma solução completa para gerenciar o portfólio e serviços de uma ilustradora. O projeto oferece:

- **Página de Apresentação (`index.html`)**: Hero section com avatar, links para redes sociais e plataformas, galeria de trabalhos, e call-to-action para montar orçamento
- **Página de Orçamento (`orcamento.html`)**: Construtor de pedido com vários itens — personagem (estilo, enquadramento, acabamento) ou cenário (por faixa de preço) — com desconto por volume e cálculo em tempo real
- **Página do Fim Anti-Herói (`fimantiheroi.html`)**: Capa, botões para ler no Tapas/Webtoon, sinopse, accordion de personagens com comparativo de design antigo x atual, e bloco de apoio via Apoia.se

O design segue o estilo visual único de Anne: **sticker-like aesthetic** com bordas grossas, elementos rotacionados, tipografia desenhada à mão, e paleta de cores em tons de salmon, laranja e rosa.

⚠️ **NOTA SOBRE IMAGENS:**
- As imagens moram no **Supabase Storage**, não mais servidas direto da pasta `assets/` (ver a
  seção "Como Funcionam as Imagens" mais abaixo pra entender a diferença entre as fixas no código
  e as que vêm do banco)
- `assets/*.webp` continua no repositório como o arquivo original de cada imagem e como fallback
  local do avatar (aparece por uma fração de segundo antes do JS trocar pela URL do Storage) — não
  é mais o que o navegador usa a maior parte do tempo
- Não existe conversão para base64 nem passo de build — o navegador busca cada imagem como um
  arquivo normal, só que agora de um domínio diferente (`supabase.co`)

---

## 🛠️ O Que Fizemos

### Pesquisa e Design
- Analisamos o perfil do Instagram e inspirações fornecidas pela Anne
- Extraímos a paleta de cores do avatar da Anne (#ED9A6E como cor base)
- Criamos uma identidade visual coerente com tons de salmon, rosa e laranja (não saturados)
- Desenvolvemos componentes reutilizáveis no estilo "sticker" com bordas e sombras

### Desenvolvimento da Página Principal
- Hero section com avatar circular, nome (@anne_ilustradora) e tagline
- Seção "Onde me achar" com 6 links para plataformas (Instagram, Tapas, Webtoon, itch.io, ArtStation, Apoia.se)
- Galeria de 10 trabalhos em layout 2-colunas com rotações suaves
- Call-to-action buttons para acessar página de orçamento
- Footer com assinatura

### Desenvolvimento da Página de Orçamento
- **Seletor de Tipo**: Individual, Dupla, Cenário
- **Seletor de Estilo**: Cartoon vs. Chibi (com exemplos visuais)
- **Seletor de Enquadramento**: Perfil, Cintura, Inteiro (condicionado ao tipo Individual)
- **Extras**: Adicionar personagens extras (0-4) com preço dinâmico
- **Uso Comercial**: Checkbox com multiplicador de 50% (mínimo R$120 para capas de livro)
- **Tabelas de Referência**: Carousel com 4 imagens de tabelas de preços com zoom
- **FAQ**: 6 seções com perguntas frequentes colapsáveis
- **Cálculo em Tempo Real**: Resumo itemizado e total na sticky footer
- **Integração Social**: Botão "Fechar pedido" que abre WhatsApp ou DM do Instagram

### Otimização e Deploy
- Regeneramos arquivos com URLs corretas da Vercel
- Implementamos tema claro/escuro com CSS tokens
- Otimizamos imagens como base64 data URIs
- Implementamos media queries e viewport meta tag para mobile
- Aumentamos touch targets (botões maiores)
- Testamos responsividade em diferentes tamanhos

### Banco de Dados e Storage (Supabase)
- Criamos o projeto no Supabase e as 5 tabelas do site (`configuracao`, `cenarios`, `galeria`,
  `obra`, `personagens`) com Row Level Security ligado — leitura pública, escrita só pra quem
  estiver logado (`supabase/schema.sql` + `supabase/policies.sql`)
- Criamos 4 buckets no Storage: `perfil`, `galeria` e `personagens` (imagens que um painel de
  admin vai editar) e `estaticos` (exemplos da calculadora e tabelas de preço, que não têm tela de
  edição ainda)
- Rodamos `supabase/migrar.mjs` pra subir as 20 imagens de `assets/` pro Storage e popular as 5
  tabelas com os dados que antes estavam fixos em `js/dados.js`/`js/fim.js`
- Reescrevemos `js/dados.js` e `js/fim.js` pra buscar tudo isso do banco (`fetch` puro, sem
  biblioteca nova) em vez de ler de um objeto fixo no arquivo; `js/avatar.js` e `js/index.js` são
  novos, pro avatar e a galeria também virem do banco/Storage
- Corrigimos dois problemas de carregamento que apareceram com a mudança: os `<script>` agora usam
  `defer` e ficam no `<head>` (o navegador começa a baixar tudo mais cedo) e as imagens do Storage
  passaram a ter `Cache-Control` de verdade (o upload precisa usar `PUT`, não `POST` com upsert)

### Painel de administração (Fases 3 → 5)

- `admin.html` + `js/admin*.js`: a Anne entra com email/senha (`js/auth.js`, sem biblioteca) e
  edita o site pelo navegador. Abas: **Preços & Perfil** (preços, acabamentos, descontos, avatar,
  contato e o **fundo do site** — imagem, cor sólida ou mistura de cores), **Cenários**,
  **Galeria**, **Links** e **Fim Anti-Herói** (obra + personagens + galeria de fotos de cada um).
- Fase 4 trocou o comparativo "antes/agora" dos personagens por uma galeria de fotos
  (`personagem_imagens`), anexou foto aos 3 cenários (bucket `cenarios`) e adicionou reordenar
  arrastando (`js/admin-arrastar.js`).
- Fase 5 tirou os links de "onde me achar" do `index.html` e passou pra tabela `links`: cada link
  tem nome, URL, cor e um **ícone** — um dos prontos de `js/icones.js` ou uma imagem enviada
  (bucket `links`). Rodar 1x: `supabase/bucket-links.sql` + `supabase/fase5-links.sql`.
- Estado atual do banco: **7 tabelas** (`configuracao`, `cenarios`, `galeria`, `obra`,
  `personagens`, `personagem_imagens`, `links`) e **6 buckets** (`perfil`, `galeria`,
  `personagens`, `estaticos`, `cenarios`, `links`).

---

## 🖼️ Como Funcionam as Imagens

As imagens do site vêm do **Supabase Storage**, não da pasta `assets/`. Tem dois grupos, tratados
de formas diferentes:

### Grupo 1 — imagens "de conteúdo" (vêm do banco)

Avatar, as 10 fotos da galeria, a capa e as artes dos personagens do Fim Anti-Herói. A URL de cada
uma mora numa tabela (`configuracao.perfil.avatar_url`, `galeria.imagem_url`,
`obra.capa`/`personagens.img_url`), e o JavaScript da página busca essa URL antes de desenhar a
`<img>` — é por isso que existem `js/avatar.js` (roda nas três páginas) e `js/index.js`
(só a galeria do `index.html`). Isso é proposital: é o que vai deixar a Anne trocar essas fotos
pelo futuro painel de admin, sem precisar mexer em código nem esperar deploy.

### Grupo 2 — imagens "fixas" (URL direto no código)

Os exemplos de estilo da calculadora (`ex_cartoon.webp` etc., em `js/dados.js`, objeto `EXEMPLOS`)
e as 4 tabelas de preço em foto (`tab_*.webp`, direto no `<img>` de `orcamento.html`). Essas ainda
não têm linha de banco nem tela de edição — ficam no bucket `estaticos` do Storage, com a URL
escrita direto no código. Pra trocar uma dessas, é o mesmo fluxo de antes: subir o arquivo novo
pro bucket e atualizar a URL no código (ver "Como Fazer Atualizações Futuras" abaixo).

### De onde as imagens realmente saem

**Fonte original:** `assets/` (20 arquivos `.webp`, continuam no repositório). O script
`supabase/migrar.mjs` foi o que subiu cada um pro bucket certo do Storage — `perfil` (avatar),
`galeria` (as 10 fotos de trabalho) ou `estaticos` (exemplos + tabelas) — e gravou a URL pública
nas tabelas do Grupo 1. Rodar esse script de novo **substitui** todas as imagens e o conteúdo de
`cenarios`/`galeria`/`personagens` pelos dados originais — não é seguro rodar depois que a Anne
começar a editar pelo painel.

- O avatar mantém `<img src="assets/avatar.webp">` como valor inicial no HTML, só pra não aparecer
  quebrado no instante antes do JavaScript rodar — `js/avatar.js` troca pela URL do Storage assim
  que a busca no banco responde
- Imagens fora da primeira tela (galeria, tabelas de preço, artes de personagem) têm
  `loading="lazy"`: só carregam quando a pessoa rola até elas
- As imagens do Storage têm `Cache-Control: public, max-age=86400` (1 dia) — o navegador reusa a
  cópia local em vez de pedir de novo ao servidor a cada visita

---

## 💬 Como Usei Claude (You Used Me!)

Durante o desenvolvimento, **Claude atuou como**:

1. **Designer & Product Manager**
   - Definiu a paleta de cores baseada no avatar de Anne
   - Criou o sistema de design com componentes reutilizáveis
   - Propôs a estrutura de duas páginas (apresentação + orçamento)

2. **Full-Stack Developer**
   - Desenvolveu HTML/CSS responsivo com tema claro/escuro
   - Implementou lógica de cálculo de preços em JavaScript
   - Criou sistema de preview dinâmico que atualiza com seleções do usuário
   - Construiu carousel interativo e modal de zoom para tabelas

3. **Build Automation Engineer**
   - Criou script `build.py` em Python que:
     - Converte imagens WebP para base64 data URIs
     - Injeta URLs de inter-página como variáveis
     - Gera ambos os arquivos HTML otimizados e self-contained
     - Mantém configurações centralizadas (preços, handles, etc)

4. **DevOps Partner**
   - Debugou issue de routing na Vercel
   - Regenerou arquivos com URLs corretas para deploy

---

## 📁 Estrutura do Projeto

```
siteanne/
├── README.md              # este arquivo
├── CLAUDE.md              # guia rápido do projeto pra IA/dev
├── package.json           # metadados do projeto (sem script de build)
├── vercel.json            # desliga o build automático da Vercel
│
├── index.html             # página inicial (central de links)
├── orcamento.html         # calculadora de encomendas
├── fimantiheroi.html      # página da webcomic Fim Anti-Herói
│
├── css/
│   ├── tokens.css         # variáveis de cor — tema claro e escuro
│   ├── base.css           # estilos compartilhados pelas três páginas + transição entre elas
│   ├── orcamento.css      # estilos exclusivos da página de orçamento
│   └── fim.css            # estilos exclusivos da página do Fim Anti-Herói
│
├── js/
│   ├── supabase.js        # URL + anon key do Supabase e o helper supaSelect() de fetch na API REST
│   ├── avatar.js          # busca o avatar e troca o src de toda <img class="js-avatar"> (3 páginas)
│   ├── dados.js           # CONFIG e DADOS — preenchidos por um fetch no banco (ver DADOS_PRONTO)
│   ├── calculo.js         # lógica do pedido (cálculo, render, cliques) — espera DADOS_PRONTO
│   ├── index.js           # busca a tabela "galeria" e monta as fotos do index.html
│   ├── fim.js             # busca "obra" e "personagens" e renderiza a página do Fim Anti-Herói
│   ├── transicao.js       # fallback de fade entre páginas pra navegador sem @view-transition
│   └── rise.js            # animação de entrada dos elementos ao rolar
│
├── supabase/              # tudo relacionado ao banco/Storage — nada disso é servido
│   │                        pro navegador, é só pra rodar uma vez no painel do Supabase / terminal
│   ├── schema.sql         # cria as 5 tabelas com RLS ligado (rodar 1º no SQL Editor)
│   ├── policies.sql       # políticas de leitura/escrita + cria os buckets perfil/galeria/personagens (2º)
│   ├── bucket-estaticos.sql  # cria o bucket "estaticos" (exemplos + tabelas de preço)
│   └── migrar.mjs         # script Node de migração única — sobe assets/*.webp pro Storage e
│                             popula as tabelas (precisa da service_role key, só roda local)
│
└── assets/                # os 20 arquivos .webp originais — fonte pro migrar.mjs, e fallback
                              local do avatar (ver "Como Funcionam as Imagens")
```

**Importante:** na Vercel, todos os HTML e as pastas `css/` e `js/` precisam estar no
repositório — são arquivos estáticos servidos direto, sem nenhum passo de build. A pasta
`supabase/` também vai no repositório (é código-fonte do projeto), mas não é "servida" — o
navegador nunca acessa esses arquivos, só o banco/Storage que eles configuraram.

---

## 🎯 Decisões Técnicas & de Design

### 1. **Arquivos Estáticos Normais (pastas `css/`, `js/`, `assets/`)**
- **Por quê?** No início do projeto, as imagens iam embutidas como base64 dentro do HTML, gerado por um `build.py`.
  Isso inflava os HTML pra 456 KB e 619 KB (94-96% base64) e exigia rodar um script pra qualquer mudança de imagem
- **Decisão atual**: HTML, CSS, JS e imagens em arquivos próprios, linkados normalmente
- **Benefício**: HTML final com poucos KB, CSS compartilhado em cache entre as páginas, imagens carregando sob
  demanda (`loading="lazy"`), e dá pra editar qualquer arquivo direto — sem gerar nada

### 2. **Três Arquivos HTML Separados**
- **Por quê?** Fácil deploy na Vercel, simples compartilhamento de links, carregamento rápido
- **Alternativa considerada**: Single-page app (SPA) com React, mas seria mais complexo para deploy simples
- A troca de página entre elas usa `@view-transition` (nativo, sem JS, em navegadores que suportam) com um
  fallback simples em `js/transicao.js` pros demais — sensação de app sem virar uma SPA

### 3. **Paleta de Cores Extraída do Avatar**
- **Cor Base**: #ED9A6E (salmon do avatar de Anne)
- **Complementos**: Rosa (#E5A0A2), Pêssego (#F8D6C2), Laranja (#D9855A), Barro (#A85331)
- **Por quê?** Cria coesão visual - o site reflete a identidade visual de Anne
- **Dark Mode**: Versão dessaturada e mais clara para não queimar em modo escuro

### 4. **CSS Tokens para Tema Claro/Escuro**
```css
:root { /* Light theme */ }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { } }
:root[data-theme="dark"] { /* Explicit dark toggle */ }
```
- **Por quê?** Suporta automático (por preferência do OS), manual (toggle do usuário), e sem preferência (padrão light)

### 5. **Tipografia Google Fonts**
- **Caveat Brush**: Display/handwriting (headings, labels, eyebrows) - transmite personalidade
- **Gluten**: Bold display (titles em grande) - destaque com peso
- **Nunito**: Body text - legibilidade e neutralidade

### 6. **Cálculo de Preços Dinâmico**
- Tabelas de preços definidas em JavaScript (facilita atualizações)
- Multiplicador comercial (50%) com mínimo obrigatório (R$120)
- Preview em tempo real enquanto o usuário interage

### 7. **Integração Social**
- Links diretos para Instagram DM e WhatsApp (fallback para DM se WhatsApp não configurado)
- Resumo da encomenda pode ser copiado para clipboard

---

## 🚀 Conectando à Vercel

### Opção A: Conectar via GitHub (Recomendado)

#### Passo 1: Inicializar Git Localmente
```bash
cd /home/wellingtonpereiraluiz/Documentos/GitHub/siteanne
git init
git add .
git commit -m "Initial commit: Anne portfolio & order builder"
```

#### Passo 2: Criar Repositório no GitHub
1. Acesse https://github.com/new
2. Nome do repositório: `siteanne`
3. Descrição: "Portfolio & interactive order builder for illustrator Anne"
4. Deixe como Public (para Vercel conseguir acessar)
5. Clique em "Create repository"

#### Passo 3: Fazer Push para GitHub
```bash
git remote add origin https://github.com/SEU_USUARIO/siteanne.git
git branch -M main
git push -u origin main
```

#### Passo 4: Conectar à Vercel
1. Acesse https://vercel.com/dashboard
2. Clique em "New Project" (ou "Add New..." → "Project")
3. Selecione "Import Git Repository"
4. Procure por `siteanne` ou cole a URL: `https://github.com/SEU_USUARIO/siteanne`
5. Clique em "Import"
6. Na tela de configuração:
   - **Framework Preset**: Other
   - **Root Directory**: ./ (deixar padrão)
   - Clique em "Deploy"

#### Passo 5: Configurar Domínio
1. Após o deploy, vá para "Settings" do projeto
2. Em "Domains", você pode:
   - Usar o domínio padrão (siteanne.vercel.app)
   - Adicionar um domínio customizado se tiver

---

### Opção B: Conectar Diretamente Sem GitHub

Se preferir não usar Git agora:

1. Acesse https://vercel.com/dashboard
2. Clique em "New Project" → "Deploy from Git" → Skip this for now
3. Selecione "Upload" (ou Drag & Drop)
4. Arraste os arquivos `index.html` e `orcamento.html`
5. Configure como projeto "Other"
6. Deploy

---

## 🔄 Como Fazer Atualizações Futuras

Hoje, **preços, cenários, galeria, avatar, sinopse e personagens não estão mais escritos
em nenhum arquivo do site** — eles vêm do banco (Supabase). Editar `js/dados.js` ou `js/fim.js`
não muda mais o que aparece pro público; esses arquivos só têm a *lógica* que busca e desenha os
dados, não os dados em si. Até o painel de administração da Anne existir, atualizar esse conteúdo
é feito pelo **SQL Editor do Supabase** (Project → SQL Editor → New query).

### Cenário 1: Mudar Preços, Acabamentos, Descontos ou Cenários da Calculadora

Tudo isso mora na tabela `configuracao` (chaves `precos`, `acabamentos`, `descontosVolume`,
`comercial`) e na tabela `cenarios`. Exemplo, pra mudar o preço de "perfil" do estilo cartoon:

```sql
update configuracao
set valor = jsonb_set(valor, '{cartoon,perfil}', '18')
where chave = 'precos';
```

Pra editar um cenário (ex.: mudar a faixa de preço de "vegetacao"):

```sql
update cenarios set preco_min = 65, preco_max = 130 where slug = 'vegetacao';
```

Não precisa de commit nem push — o site já busca o valor novo na próxima visita (o navegador só
usa a cópia salva se ainda não passou 1 dia, ver "Como Funcionam as Imagens").

### Cenário 2: Mudar Instagram ou WhatsApp

Também é a tabela `configuracao`, chave `perfil`:

```sql
update configuracao
set valor = jsonb_set(valor, '{whatsapp}', '"5512999999999"')
where chave = 'perfil';
```

### Cenário 3: Trocar uma Foto da Galeria, o Avatar, ou Adicionar/Remover uma Foto

1. Suba o arquivo `.webp` novo pro bucket certo do Storage (Project → Storage → `galeria` ou
   `perfil`, botão "Upload file")
2. Copie a URL pública do arquivo (clique nele → "Get URL")
3. Atualize a linha correspondente:
```sql
-- trocar uma foto existente (mantém a ordem/posição dela)
update galeria set imagem_url = 'URL_NOVA_AQUI' where id = 3;

-- esconder uma foto sem apagar (some da galeria, mas continua no banco)
update galeria set visivel = false where id = 3;

-- adicionar uma foto nova
insert into galeria (imagem_url, titulo, ordem) values ('URL_NOVA_AQUI', 'Descrição da foto', 11);
```

### Cenário 4: Mudar Sinopse, Personagem ou Link do Fim Anti-Herói

A tabela `obra` guarda `titulo`, `gancho`, `sinopse`, `apoio_texto`, `capa`, `link_tapas`,
`link_webtoon` e `link_apoiase` — uma linha por chave:

```sql
update obra set valor = 'A sinopse de verdade, escrita pela Anne...' where chave = 'sinopse';
update obra set valor = 'https://tapas.io/series/finn-o-antiheroi' where chave = 'link_tapas';
```

E a tabela `personagens`:

```sql
update personagens
set descricao = 'Descrição de verdade do Finn...', mudancas = 'Como o design mudou...'
where nome = 'Finn';
```

### Cenário 5: Mudar Exemplos da Calculadora ou Tabelas de Preço em Foto

Essas duas (`EXEMPLOS` em `js/dados.js`, e as 4 imagens de tabela em `orcamento.html`) **não** vêm
do banco ainda — continuam sendo código, porque não têm tela de edição prevista por enquanto:

1. Suba o `.webp` novo pro bucket `estaticos` do Storage
2. Cole a URL pública no lugar certo: `EXEMPLOS` em `js/dados.js`, ou o `src`/`data-full` do
   `<img>` correspondente em `orcamento.html`
3. Commit e push:
```bash
git add js/dados.js orcamento.html
git commit -m "Atualizar exemplo/tabela de preços"
git push origin main
```

### Cenário 6: Mudar HTML, CSS ou a Lógica de Cálculo

Continua sendo código de verdade — edita o arquivo, testa local, commit e push, igual sempre foi.
Isso vale pra layout, estilo visual, e a lógica de como o pedido é somado (`js/calculo.js`).

**Resumo:** não existe passo de build — o que está no repositório é exatamente o que vai para a
Vercel — mas agora **conteúdo** (preços, textos, fotos editáveis) e **código** (layout, lógica,
estilo) são duas coisas separadas, cada uma com seu próprio jeito de atualizar.

---

## ⚡ Deploy na Vercel - Ponto Importante

**Os arquivos HTML já estão prontos para Vercel!** Você não precisa de nenhum build process.

### Por que não há build script?

- `index.html`, `orcamento.html`, `css/`, `js/` e `assets/` já são os arquivos finais
- Não existe nenhuma etapa de conversão ou geração — o que está no repositório é o que roda no navegador
- Vercel apenas precisa servir esses arquivos estáticos

### O que fazer:

1. Faça push do seu repositório para GitHub
2. Conecte o repositório na Vercel
3. Deploy pronto! (sem precisar de nenhuma configuração de build)

**Nota:** O arquivo `package.json` não tem um script `build` propositalmente. Se tiver erro de build na Vercel, é sinal de que algo está diferente. Verifique se os arquivos `index.html`, `orcamento.html` e `fimantiheroi.html` estão presentes no repositório.

---

## 📞 Configurações do Projeto

Preços, acabamentos, descontos, cenários, avatar, contato (Instagram/WhatsApp), galeria, sinopse e
personagens do Fim Anti-Herói **não estão mais em nenhum arquivo do site** — moram no banco do
Supabase. Ver "Como Fazer Atualizações Futuras" acima pros comandos SQL de cada caso.

`js/dados.js` e `js/fim.js` continuam existindo, mas hoje só têm a *lógica* que busca esses dados
(`CONFIG`/`DADOS` começam vazios e são preenchidos por um `fetch` — ver `DADOS_PRONTO` em
`js/dados.js`), mais o `EXEMPLOS` da calculadora, que ainda é fixo no código (ver Cenário 5 acima).

**Acesso ao projeto no Supabase:** [supabase.com/dashboard](https://supabase.com/dashboard),
projeto do site da Anne. A `anon key` (pública, usada pelo site pra ler os dados) está em
`js/supabase.js` — é segura pra ficar ali. A `service_role key` (acesso total, ignora as regras de
segurança) **nunca** deve entrar em nenhum arquivo do repositório; só é usada na mão, na hora de
rodar `supabase/migrar.mjs`.

---

## 🎓 Stack Técnico

| Tecnologia | Uso |
|-----------|-----|
| **HTML5** | Estrutura semântica |
| **CSS3** | Estilos, tema claro/escuro, responsividade |
| **Vanilla JavaScript** | Lógica de cálculo, interatividade |
| **Supabase** | Banco de dados (Postgres), Storage de imagens e (em breve) login/autenticação |
| **Vercel** | Hosting & deploy |
| **GitHub** | Versionamento de código |
| **Google Fonts** | Tipografia (Caveat Brush, Gluten, Nunito) |

---

## 🚀 Próximas Melhorias (Ideias Futuras)

- [ ] Login da Anne + painel de administração (editar preços, galeria, obra e personagens sem SQL)
- [ ] Adicionar forma de pagamento integrada (Pix, cartão)
- [ ] Sistema de agendamento de prazos
- [ ] Dashboard para Anne acompanhar pedidos
- [ ] Integração com Notion ou Airtable para gerenciar orçamentos
- [ ] Versão em Português/English
- [ ] Mobile app (React Native ou Flutter)
- [ ] Sistema de notificações por email

---

## 📧 Suporte

Dúvidas sobre o projeto? 
- GitHub Issues: Crie uma issue neste repositório
- Email: wellingtonpereiraluiz89@gmail.com

---

**Desenvolvido com ❤️ por Wellington (usando Claude como AI partner)**

*Última atualização: 27 de Agosto de 2026*
