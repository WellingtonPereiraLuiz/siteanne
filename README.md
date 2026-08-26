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
- As imagens ficam em `assets/*.webp` e os HTML apontam pra elas direto, com `<img src="assets/nome.webp">`
- Não existe mais conversão para base64 nem passo de build — o navegador busca cada `.webp` como um arquivo normal
- A pasta `assets/` **precisa** estar no ar junto com os HTML (inclusive na Vercel)

---

## 🛠️ O Que Fizemos

### Fase 1: Pesquisa e Design
- Analisamos o perfil do Instagram e inspirações fornecidas pela Anne
- Extraímos a paleta de cores do avatar da Anne (#ED9A6E como cor base)
- Criamos uma identidade visual coerente com tons de salmon, rosa e laranja (não saturados)
- Desenvolvemos componentes reutilizáveis no estilo "sticker" com bordas e sombras

### Fase 2: Desenvolvimento da Página Principal
- Hero section com avatar circular, nome (@anne_ilustradora) e tagline
- Seção "Onde me achar" com 6 links para plataformas (Instagram, Tapas, Webtoon, itch.io, ArtStation, Apoia.se)
- Galeria de 10 trabalhos em layout 2-colunas com rotações suaves
- Call-to-action buttons para acessar página de orçamento
- Footer com assinatura

### Fase 3: Desenvolvimento da Página de Orçamento
- **Seletor de Tipo**: Individual, Dupla, Cenário
- **Seletor de Estilo**: Cartoon vs. Chibi (com exemplos visuais)
- **Seletor de Enquadramento**: Perfil, Cintura, Inteiro (condicionado ao tipo Individual)
- **Extras**: Adicionar personagens extras (0-4) com preço dinâmico
- **Uso Comercial**: Checkbox com multiplicador de 50% (mínimo R$120 para capas de livro)
- **Tabelas de Referência**: Carousel com 4 imagens de tabelas de preços com zoom
- **FAQ**: 6 seções com perguntas frequentes colapsáveis
- **Cálculo em Tempo Real**: Resumo itemizado e total na sticky footer
- **Integração Social**: Botão "Fechar pedido" que abre WhatsApp ou DM do Instagram

### Fase 4: Otimização e Deploy
- Regeneramos arquivos com URLs corretas da Vercel
- Implementamos tema claro/escuro com CSS tokens
- Otimizamos imagens como base64 data URIs
- Implementamos media queries e viewport meta tag para mobile
- Aumentamos touch targets (botões maiores)
- Testamos responsividade em diferentes tamanhos

---

## 🖼️ Como Funcionam as Imagens

### Estrutura de Imagens

**Localização das imagens:** `assets/` (20 arquivos em WebP)

```
assets/
├── avatar.webp           → Avatar do perfil de Anne
├── ex_cartoon.webp       → Exemplo estilo Cartoon (individual)
├── ex_chibi.webp         → Exemplo estilo Chibi (individual)
├── ex_cartoon_duo.webp   → Exemplo Cartoon (dupla)
├── ex_chibi_duo.webp     → Exemplo Chibi (dupla)
├── ex_cenario.webp       → Exemplo Cenário/Landscape
├── girls4.webp, tv.webp, dragon.webp, cats.webp, port2.webp, forest.webp, duo.webp, swords.webp, outfits.webp, port1.webp
│                         → 10 imagens da galeria de trabalhos
├── tab_chibi_extras.webp → Tabela de preços Chibi extras
├── tab_combos.webp       → Tabela de combos
├── tab_responde.webp     → Tabela "Responde" (perguntas frequentes)
└── tab_obs.webp          → Tabela de observações
```

### Como as Imagens São Usadas

- Cada `<img>` no HTML aponta direto pro arquivo: `<img src="assets/avatar.webp">`
- Na calculadora, os exemplos de estilo (`js/dados.js`, objeto `EXEMPLOS`) também apontam pra `assets/*.webp`
- O navegador pede cada imagem como uma requisição HTTP normal, e guarda em cache —
  então quem já visitou uma página carrega as imagens repetidas quase na hora
- Imagens fora da primeira tela (galeria, tabelas de preço) têm `loading="lazy"`:
  só carregam quando a pessoa rola até elas
- Na Vercel, a pasta `assets/` precisa estar no repositório — ela é servida como
  arquivo estático, junto com os HTML

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
│   ├── dados.js           # CONFIG (whatsapp/instagram) e DADOS (preços, acabamentos, descontos, cenários)
│   ├── calculo.js         # lógica do pedido (cálculo, render, cliques)
│   ├── fim.js             # DADOS (obra, links, personagens) e render da página do Fim Anti-Herói
│   ├── transicao.js       # fallback de fade entre páginas pra navegador sem @view-transition
│   └── rise.js            # animação de entrada dos elementos ao rolar
│
└── assets/                # as 20 imagens do site, em .webp
    ├── avatar.webp              # avatar do perfil de Anne
    ├── ex_cartoon.webp          # exemplo Cartoon (individual)
    ├── ex_chibi.webp            # exemplo Chibi (individual)
    ├── ex_cartoon_duo.webp      # exemplo Cartoon (dupla)
    ├── ex_chibi_duo.webp        # exemplo Chibi (dupla)
    ├── ex_cenario.webp          # exemplo Cenário/paisagem
    ├── girls4.webp, tv.webp, dragon.webp, cats.webp, port2.webp,
    │   forest.webp, duo.webp, swords.webp, outfits.webp, port1.webp
    │                            # 10 imagens da galeria
    ├── tab_chibi_extras.webp    # tabela de preços de extras
    ├── tab_combos.webp          # tabela de combos
    ├── tab_responde.webp        # tabela "Anne Responde"
    └── tab_obs.webp             # tabela de observações
```

**Importante:** na Vercel, todos os HTML e as pastas `css/`, `js/` e `assets/`
precisam estar no repositório — são arquivos estáticos servidos direto, sem
nenhum passo de build.

---

## 🎯 Decisões Técnicas & de Design

### 1. **Arquivos Estáticos Normais (pastas `css/`, `js/`, `assets/`)**
- **Por quê?** Até a Fase 0, as imagens iam embutidas como base64 dentro do HTML, gerado por um `build.py`.
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

### Cenário 1: Mudar Texto, Preços ou Cores (Editar Direto no HTML)

Se você quer mudar apenas **texto, preços ou cores** no site:

1. Abra `index.html` ou `orcamento.html` num editor de texto
2. Procure e edite o conteúdo (exemplo: mudar "R$ 17,00" para "R$ 18,00")
3. Salve e faça commit:
```bash
git add index.html orcamento.html
git commit -m "Atualizar preços"
git push origin main
# Vercel faz auto-deploy em segundos!
```

### Cenário 2: Mudar ou Adicionar Imagens

1. Salve o novo arquivo `.webp` dentro de `assets/` (ou substitua um existente, mantendo o mesmo nome)
2. Aponte pra ele no HTML: `<img src="assets/nome-do-arquivo.webp">` — se for um exemplo da
   calculadora, atualize o objeto `EXEMPLOS` em `js/dados.js`; se for arte de personagem do
   Fim Anti-Herói, atualize o campo `img`/`imgAntiga` em `js/fim.js`
3. Commit e push:
```bash
git add assets/ index.html orcamento.html fimantiheroi.html js/dados.js js/fim.js
git commit -m "Atualizar imagens"
git push origin main
# Vercel faz auto-deploy!
```

### Cenário 3: Mudar Preços, WhatsApp ou Instagram

1. Abra `js/dados.js` e edite:
```js
var CONFIG = {
  instagram: "anne_ilustradora",
  whatsapp: ""   // "5512999999999" se quiser usar WhatsApp em vez da DM
};

var DADOS = {
  precos: {
    cartoon: { perfil:17, cintura:25, inteiro:30, dupla:45 },
    chibi:   { perfil:15, cintura:20, inteiro:25, dupla:35 }
  },
  /* acabamentos, descontosVolume, cenarios e comercial também moram aqui */
};
```

2. Commit e push:
```bash
git add js/dados.js
git commit -m "Atualizar preços e configurações"
git push origin main
```

### Cenário 4: Mudar Sinopse, Personagem ou Link do Fim Anti-Herói

1. Abra `js/fim.js` e edite o objeto `DADOS` (`obra.sinopse`, `obra.gancho`, `links.tapas`,
   `links.webtoon`, `links.apoiase`, ou qualquer item de `personagens`)
2. Commit e push:
```bash
git add js/fim.js
git commit -m "Atualizar conteúdo do Fim Anti-Herói"
git push origin main
```

**Resumo:** não existe mais passo de build — o que está no repositório é exatamente
o que vai para a Vercel.

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

Preços, acabamentos, descontos e cenários da calculadora — em `js/dados.js`:

```js
var CONFIG = {
  instagram: "anne_ilustradora",
  whatsapp: ""   // "5512999999999" se tiver — vazio usa a DM do Instagram
};

var DADOS = {
  precos: {
    cartoon: { perfil:17, cintura:25, inteiro:30, dupla:45 },
    chibi:   { perfil:15, cintura:20, inteiro:25, dupla:35 }
  },
  acabamentos: [ /* completo, sem_sombra, lineart — com o fator de cada um */ ],
  descontosVolume: [ /* faixas de desconto por quantidade de artes */ ],
  cenarios: [ /* categorias de cenário, com faixa de preço min/max */ ],
  comercial: { pct:50, minimoCapaLivro:120 }
};
```

Sinopse, personagens e links do Fim Anti-Herói — em `js/fim.js` (objeto `DADOS`, formato
diferente do de `dados.js`: `obra`, `links` e `personagens`).

---

## 🎓 Stack Técnico

| Tecnologia | Uso |
|-----------|-----|
| **HTML5** | Estrutura semântica |
| **CSS3** | Estilos, tema claro/escuro, responsividade |
| **Vanilla JavaScript** | Lógica de cálculo, interatividade |
| **Vercel** | Hosting & deploy |
| **GitHub** | Versionamento de código |
| **Google Fonts** | Tipografia (Caveat Brush, Gluten, Nunito) |

---

## 🚀 Próximas Melhorias (Ideias Futuras)

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

*Última atualização: 26 de Agosto de 2026*
