# 🎨 Site Anne - Portfolio & Orçamento Interativo

Um website moderno e responsivo para centralizar os links e serviços da ilustradora Anne (@anne_ilustradora). O projeto é composto por uma página de apresentação e um construtor de orçamentos interativo onde clientes podem configurar suas encomendas em tempo real.

---

## 📋 Descrição do Projeto

**Site Anne** é uma solução completa para gerenciar o portfólio e serviços de uma ilustradora. O projeto oferece:

- **Página de Apresentação (`index.html`)**: Hero section com avatar, links para redes sociais e plataformas, galeria de trabalhos, e call-to-action para montar orçamento
- **Página de Orçamento (`orcamento.html`)**: Construtor interativo onde clientes selecionam tipo de trabalho, estilo, enquadramento e extras, com cálculo de preço em tempo real

O design segue o estilo visual único de Anne: **sticker-like aesthetic** com bordas grossas, elementos rotacionados, tipografia desenhada à mão, e paleta de cores em tons de salmon, laranja e rosa.

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
- Testamos responsividade em diferentes tamanhos

---

## 💬 Como Usei Claude

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
├── README.md                 # Este arquivo (documentação completa)
├── index.html               # Página de apresentação (0.44 MB)
├── orcamento.html           # Página de orçamento (0.59 MB)
├── build.py                 # Script Python para gerar arquivos (opcional, para manutenção)
└── assets/                  # Pasta com imagens em WebP
    ├── avatar.webp          # Avatar do perfil de Anne
    ├── ex_cartoon.webp      # Exemplo estilo Cartoon (individual)
    ├── ex_chibi.webp        # Exemplo estilo Chibi (individual)
    ├── ex_cartoon_duo.webp  # Exemplo Cartoon (dupla)
    ├── ex_chibi_duo.webp    # Exemplo Chibi (dupla)
    ├── ex_cenario.webp      # Exemplo Cenário/Landscape
    ├── girls4.webp          # Galeria
    ├── tv.webp              # Galeria
    ├── dragon.webp          # Galeria
    ├── cats.webp            # Galeria
    ├── port2.webp           # Galeria
    ├── forest.webp          # Galeria
    ├── duo.webp             # Galeria
    ├── swords.webp          # Galeria
    ├── outfits.webp         # Galeria
    ├── port1.webp           # Galeria
    ├── tab_chibi_extras.webp    # Tabela de preços Chibi extras
    ├── tab_combos.webp          # Tabela de combos
    ├── tab_responde.webp        # Tabela "Responde"
    └── tab_obs.webp             # Tabela observações
```

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

### Se Conectar via GitHub:
```bash
# Fazer alterações nos arquivos
# Depois:
git add .
git commit -m "Descrição das mudanças"
git push origin main
# Vercel faz auto-deploy automaticamente!
```

### Se Usar build.py (opcional, para reconstruir arquivos):
```bash
python build.py "https://anne-ilustradora.vercel.app/orcamento.html" "https://anne-ilustradora.vercel.app/"
```

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
