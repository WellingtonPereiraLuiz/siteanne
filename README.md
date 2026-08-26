# 🎨 Site Anne - Portfolio & Orçamento Interativo

Um website moderno e responsivo para centralizar os links e serviços da ilustradora Anne (@anne_ilustradora). O projeto é composto por uma página de apresentação e um construtor de orçamentos interativo onde clientes podem configurar suas encomendas em tempo real.

---

## 📋 Descrição do Projeto

**Site Anne** é uma solução completa para gerenciar o portfólio e serviços de uma ilustradora. O projeto oferece:

- **Página de Apresentação (`index.html`)**: Hero section com avatar, links para redes sociais e plataformas, galeria de trabalhos, e call-to-action para montar orçamento
- **Página de Orçamento (`orcamento.html`)**: Construtor interativo onde clientes selecionam tipo de trabalho, estilo, enquadramento e extras, com cálculo de preço em tempo real

O design segue o estilo visual único de Anne: **sticker-like aesthetic** com bordas grossas, elementos rotacionados, tipografia desenhada à mão, e paleta de cores em tons de salmon, laranja e rosa.

⚠️ **NOTA IMPORTANTE SOBRE IMAGENS:**
- Os arquivos HTML finais (`index.html` e `orcamento.html`) **já contêm todas as imagens embutidas como base64 data URIs**
- Isso significa que são arquivos **self-contained** e funcionam sem depender de arquivos externos
- A pasta `assets/` existe apenas para uso do script `build.py` durante desenvolvimento
- Quando você faz deploy na Vercel, os arquivos HTML já estão prontos para funcionar

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

**Localização das imagens:** `assets/` (25 arquivos em WebP)

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

1. **No Desenvolvimento (Local):**
   - Você edita as imagens em `assets/` como arquivos .webp normais
   - Executa: `python build.py "url_orcamento" "url_index"`
   - O script converte cada imagem para base64 e injeta nos arquivos HTML

2. **No Deploy (Vercel):**
   - Os arquivos `index.html` e `orcamento.html` **já contêm todas as imagens embutidas**
   - Vercel não precisa acessar a pasta `assets/`
   - As imagens carregam instantaneamente (sem requisições HTTP extras)

### Convertendo de WebP para Base64 (O que o build.py faz)

```python
# build.py lê cada imagem WebP
def uri(n):
    return 'data:image/webp;base64,' + base64.b64encode(
        open(os.path.join(A, n + '.webp'), 'rb').read()
    ).decode()

# Depois injeta no HTML como:
<img src="data:image/webp;base64,UklGRiY...muito-texto...">
```

**Benefícios:**
- ✅ Arquivos HTML completamente independentes
- ✅ Sem requisições HTTP (carrega mais rápido)
- ✅ Pode compartilhar um único arquivo HTML
- ✅ Funciona offline

**Desvantagens:**
- ⚠️ Arquivos HTML maiores (por isso ~450 KB cada)
- ⚠️ Difícil debugar visualmente no navegador

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
├── README.md                     # Este arquivo (documentação completa)
├── VERCEL_SETUP.md              # Tutorial passo a passo para Vercel
├── PROXIMOS_PASSOS.md           # Quick checklist de ações
├── package.json                 # Configuração npm (sem build script)
├── .gitignore                   # Arquivos ignorados no Git
│
├── 📄 index.html                # ARQUIVO DE DEPLOY - Página principal (450 KB)
│                                # ✓ Contém TODAS as imagens embutidas como base64
│                                # ✓ Pronto para Vercel - não precisa de assets/
│
├── 📄 orcamento.html            # ARQUIVO DE DEPLOY - Página de orçamento (590 KB)
│                                # ✓ Contém TODAS as imagens embutidas como base64
│                                # ✓ Pronto para Vercel - não precisa de assets/
│
├── build.py                     # Script para DESENVOLVIMENTO (lê assets/ e gera HTML)
│                                # Execute: python build.py "url_orc" "url_index"
│                                # Uso: Quando você mudar as imagens em assets/
│
└── 📁 assets/                   # Imagens APENAS para desenvolvimento
    ├── avatar.webp              # Avatar do perfil de Anne
    ├── ex_cartoon.webp          # Exemplo Cartoon (individual)
    ├── ex_chibi.webp            # Exemplo Chibi (individual)
    ├── ex_cartoon_duo.webp      # Exemplo Cartoon (dupla)
    ├── ex_chibi_duo.webp        # Exemplo Chibi (dupla)
    ├── ex_cenario.webp          # Exemplo Cenário
    ├── girls4.webp, tv.webp, dragon.webp, cats.webp, port2.webp
    ├── forest.webp, duo.webp, swords.webp, outfits.webp, port1.webp
    │                            # 10 imagens da galeria
    ├── tab_chibi_extras.webp    # Tabela de preços extras
    ├── tab_combos.webp          # Tabela de combos
    ├── tab_responde.webp        # Tabela de perguntas
    └── tab_obs.webp             # Tabela de observações
```

**IMPORTANTE:** Na Vercel, **apenas os arquivos HTML (`index.html` e `orcamento.html`) são necessários**. A pasta `assets/` não precisa estar no servidor, pois as imagens já estão embutidas nos arquivos HTML.

---

## 🎯 Decisões Técnicas & de Design

### 1. **Abordagem Self-Contained (HTML puro)**
- **Por quê?** As imagens são convertidas para base64 data URIs, deixando cada arquivo HTML completamente independente
- **Benefício**: Pode ser compartilhado como arquivo único, sem depender de servidor ou assets externos
- **Trade-off**: Arquivos maiores (456 KB e 619 KB), mas carregam sem requisições HTTP adicionais

### 2. **Dois Arquivos HTML Separados**
- **Por quê?** Fácil deploy na Vercel, simples compartilhamento de links, carregamento rápido
- **Alternativa considerada**: Single-page app (SPA) com React, mas seria mais complexo para deploy simples

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

### Cenário 2: Mudar as Imagens (Usar build.py)

Se você quer **substituir ou adicionar novas imagens**:

1. **Edite as imagens em `assets/`:**
   - Substitua os arquivos .webp existentes, ou
   - Adicione novos arquivos .webp

2. **Rode o build.py local:**
```bash
python build.py "https://anne-ilustradora.vercel.app/orcamento.html" "https://anne-ilustradora.vercel.app/"
```

3. **Faça commit e push:**
```bash
git add index.html orcamento.html build.py
git commit -m "Atualizar imagens - novo avatar e galeria"
git push origin main
# Vercel faz auto-deploy!
```

### Cenário 3: Mudar Configurações (Editar build.py)

Se você quer mudar **handles do Instagram, WhatsApp, preços de forma automática**:

1. Abra `build.py` e edite:
```python
INSTAGRAM_HANDLE = "anne_ilustradora"
WHATSAPP_NUMBER = "+5512999999999"  # Adicione se quiser

PRECOS = {
    'cartoon': {
        'perfil': 17,  # Mudou de 17 para 20? Altere aqui
        'cintura': 25,
        # ... resto dos preços
    },
    # ...
}
```

2. Rode o build.py:
```bash
python build.py "https://anne-ilustradora.vercel.app/orcamento.html" "https://anne-ilustradora.vercel.app/"
```

3. Commit e push:
```bash
git add index.html orcamento.html build.py
git commit -m "Atualizar configurações e preços"
git push origin main
```

**Resumo:** Os arquivos HTML são o que vai para Vercel. O `build.py` é uma ferramenta para **gerar** os arquivos HTML a partir das imagens e configurações.

---

## ⚡ Deploy na Vercel - Ponto Importante

**Os arquivos HTML já estão prontos para Vercel!** Você não precisa de nenhum build process.

### Por que não há build script?

- Os arquivos `index.html` e `orcamento.html` **já contêm todas as imagens embutidas**
- Não precisam de um servidor para servir arquivos de assets
- Vercel apenas precisa servir os arquivos HTML estáticos

### O que fazer:

1. Faça push do seu repositório para GitHub
2. Conecte o repositório na Vercel
3. Deploy pronto! (sem precisar de nenhuma configuração de build)

**Nota:** O arquivo `package.json` não tem um script `build` propositalmente. Se tiver erro de build na Vercel, é sinal de que algo está diferente. Verifique se os arquivos `index.html` e `orcamento.html` estão presentes no repositório.

---

## 📞 Configurações do Projeto

Editar no `build.py` (se usar reconstrução):

```python
# Alterar esses valores conforme necessário:
INSTAGRAM_HANDLE = "anne_ilustradora"
WHATSAPP_NUMBER = None  # +55XXXXXXXXXXX se tiver

PRECOS = {
    'cartoon': {
        'perfil': 17, 'cintura': 25, 'inteiro': 30,
        'dupla': 45, 'cenario': 60,
        'extras': [20, 25, 30, 35]
    },
    'chibi': {
        'perfil': 15, 'cintura': 20, 'inteiro': 25,
        'dupla': 35, 'cenario': 50,
        'extras': [15, 20, 25, 30]
    }
}
```

---

## 🎓 Stack Técnico

| Tecnologia | Uso |
|-----------|-----|
| **HTML5** | Estrutura semântica |
| **CSS3** | Estilos, tema claro/escuro, responsividade |
| **Vanilla JavaScript** | Lógica de cálculo, interatividade |
| **Python** (build.py) | Automação de build (imagens → base64) |
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
