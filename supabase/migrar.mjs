// Script de migração única: sobe assets/*.webp pro Storage e popula as
// tabelas do Supabase com os dados que hoje estão fixos em js/dados.js e
// js/fim.js (mais a galeria e o avatar, que hoje são HTML/CSS fixos).
//
// ATENÇÃO: as tabelas cenarios, galeria e personagens são APAGADAS e
// recriadas do zero toda vez que este script roda. Rode-o AGORA, uma vez,
// pra popular o banco pela primeira vez. Depois que a Anne começar a usar
// o painel, rodar de novo APAGARIA o que ela cadastrou — não é um script
// de sincronização contínua, é só o pontapé inicial.
//
// Uso (no terminal, dentro da pasta do projeto):
//   SUPABASE_URL="https://xzpctuxezuugyjbedzhh.supabase.co" \
//   SUPABASE_SERVICE_ROLE_KEY="cole a secret/service_role key aqui, só neste comando" \
//   node supabase/migrar.mjs
//
// A service_role key nunca fica salva em nenhum arquivo — ela só existe
// no ar enquanto esse comando roda, na memória do seu terminal.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ASSETS = path.join(ROOT, "assets");

const URL_BASE = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_BASE || !SERVICE_KEY) {
  console.error("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY antes de rodar (veja o comentário no topo deste arquivo).");
  process.exit(1);
}

const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` };

/* Lê largura/altura direto dos bytes do arquivo WebP — mesma lógica usada
   na Fase 0 pra recuperar as imagens do base64, sem depender de nenhuma
   biblioteca de imagem. */
function dimensoesWebp(buf) {
  const fourcc = buf.toString("ascii", 12, 16);
  if (fourcc === "VP8X") {
    return { largura: buf.readUIntLE(20, 3) + 1, altura: buf.readUIntLE(23, 3) + 1 };
  }
  if (fourcc === "VP8 ") {
    return { largura: buf.readUInt16LE(26) & 0x3fff, altura: buf.readUInt16LE(28) & 0x3fff };
  }
  if (fourcc === "VP8L") {
    const val = buf.readUInt32LE(21);
    return { largura: (val & 0x3fff) + 1, altura: ((val >> 14) & 0x3fff) + 1 };
  }
  throw new Error("formato WebP não reconhecido");
}

async function subirArquivo(bucket, nomeArquivo, caminhoLocal) {
  const bytes = await readFile(caminhoLocal);
  const resp = await fetch(`${URL_BASE}/storage/v1/object/${bucket}/${nomeArquivo}`, {
    /* PUT cria o arquivo se ele não existir e substitui se já existir — e,
       diferente do POST com x-upsert (jeito antigo daqui), respeita o
       cache-control abaixo em vez de ignorar. Sem isso, o Storage devolve
       "Cache-Control: no-cache" e o navegador reconsulta o servidor toda
       vez que a imagem aparece de novo, mesmo sem ter mudado nada — 1 dia
       de cache dá uma folga real sem deixar uma foto trocada "presa"
       por muito tempo depois que o painel de admin existir. */
    method: "PUT",
    headers: { ...headers, "Content-Type": "image/webp", "cache-control": "public, max-age=86400" },
    body: bytes,
  });
  if (!resp.ok) throw new Error(`falha ao subir ${bucket}/${nomeArquivo}: ${resp.status} ${await resp.text()}`);
  const urlPublica = `${URL_BASE}/storage/v1/object/public/${bucket}/${nomeArquivo}`;
  return { urlPublica, ...dimensoesWebp(bytes) };
}

async function upsert(tabela, linhas, colunaConflito) {
  const qs = colunaConflito ? `?on_conflict=${colunaConflito}` : "";
  const resp = await fetch(`${URL_BASE}/rest/v1/${tabela}${qs}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(linhas),
  });
  if (!resp.ok) throw new Error(`falha ao gravar em ${tabela}: ${resp.status} ${await resp.text()}`);
}

async function limparTabela(tabela) {
  const resp = await fetch(`${URL_BASE}/rest/v1/${tabela}?id=gte.0`, { method: "DELETE", headers });
  if (!resp.ok) throw new Error(`falha ao limpar ${tabela}: ${resp.status} ${await resp.text()}`);
}

/* ================= 1) imagens ================= */

console.log("Subindo imagens...");

const avatar = await subirArquivo("perfil", "avatar.webp", path.join(ASSETS, "avatar.webp"));

const galeriaArquivos = [
  { arq: "girls4.webp", titulo: "Quatro retratos de personagens femininas em cores fortes" },
  { arq: "tv.webp", titulo: "Personagem sentada sobre televisores antigos em um quarto roxo" },
  { arq: "dragon.webp", titulo: "Personagem ao lado de um dragão branco em uma paisagem verde" },
  { arq: "cats.webp", titulo: "Dois personagens em estilo cartoon segurando gatinhos" },
  { arq: "port2.webp", titulo: "Quatro retratos de personagens de fantasia" },
  { arq: "forest.webp", titulo: "Personagem de chifres sentada à beira de uma cachoeira" },
  { arq: "duo.webp", titulo: "Dois personagens de corpo inteiro com roupas detalhadas" },
  { arq: "swords.webp", titulo: "Cinco espadas do Finn desenhadas lado a lado" },
  { arq: "outfits.webp", titulo: "Quatro versões de uma mesma personagem com roupas diferentes" },
  { arq: "port1.webp", titulo: "Quatro retratos de personagens de cabelo escuro" },
];

const galeriaLinhas = [];
for (let i = 0; i < galeriaArquivos.length; i++) {
  const { arq, titulo } = galeriaArquivos[i];
  const info = await subirArquivo("galeria", arq, path.join(ASSETS, arq));
  galeriaLinhas.push({ imagem_url: info.urlPublica, titulo, largura: info.largura, altura: info.altura, ordem: i + 1, visivel: true });
}

const estaticosArquivos = [
  "ex_cartoon.webp", "ex_chibi.webp", "ex_cartoon_duo.webp", "ex_chibi_duo.webp", "ex_cenario.webp",
  "tab_chibi_extras.webp", "tab_combos.webp", "tab_obs.webp", "tab_responde.webp",
];
const estaticosUrls = {};
for (const arq of estaticosArquivos) {
  const info = await subirArquivo("estaticos", arq, path.join(ASSETS, arq));
  estaticosUrls[arq] = info.urlPublica;
}

console.log("\nImagens no ar. URLs dos arquivos estáticos (vou usar isso na Etapa 7, pra trocar os src no código):");
console.log(JSON.stringify(estaticosUrls, null, 2));

/* ================= 2) tabelas ================= */

console.log("\nGravando configuração...");
await upsert("configuracao", [
  {
    chave: "precos",
    valor: {
      cartoon: { perfil: 17, cintura: 25, inteiro: 30, dupla: 45 },
      chibi: { perfil: 15, cintura: 20, inteiro: 25, dupla: 35 },
    },
  },
  {
    chave: "acabamentos",
    valor: [
      { id: "completo", nome: "Completo (cor e sombra)", fator: 1.0 },
      { id: "sem_sombra", nome: "Lineart e cor sem sombra", fator: 0.6 },
      { id: "lineart", nome: "Só lineart / preto e branco", fator: 0.4 },
    ],
  },
  {
    chave: "descontosVolume",
    valor: [
      { min: 1, pct: 0 },
      { min: 2, pct: 5 },
      { min: 3, pct: 10 },
      { min: 4, pct: 15 },
    ],
  },
  { chave: "comercial", valor: { pct: 50, minimoCapaLivro: 120 } },
  {
    chave: "perfil",
    valor: { avatar_url: avatar.urlPublica, fundo_url: "", instagram: "anne_ilustradora", whatsapp: "" },
  },
], "chave");

console.log("Gravando cenários...");
await limparTabela("cenarios");
await upsert("cenarios", [
  { slug: "vegetacao", nome: "Vegetação e natureza", descricao: "Floresta, jardim, campo aberto", preco_min: 60, preco_max: 120, imagem_url: "", ordem: 1 },
  { slug: "fechado", nome: "Espaço fechado / interior", descricao: "Quarto, taverna, sala bagunçada", preco_min: 70, preco_max: 140, imagem_url: "", ordem: 2 },
  { slug: "cidade", nome: "Cidade e ruas", descricao: "Fachadas, calçada, perspectiva urbana", preco_min: 90, preco_max: 180, imagem_url: "", ordem: 3 },
]);

console.log("Gravando galeria...");
await limparTabela("galeria");
await upsert("galeria", galeriaLinhas);

console.log("Gravando obra (Fim Anti-Herói)...");
await upsert("obra", [
  { chave: "titulo", valor: "Fim Anti-Herói" },
  { chave: "gancho", valor: "[texto de exemplo] Um herói que não escolheu ser herói, numa história que também não escolheu." },
  { chave: "sinopse", valor: "[texto de exemplo] Aqui entra a sinopse de verdade, escrita pela Anne — de onde vem o Finn, o que ele quer, e o que o empurra pra dentro da própria história. Pode ter mais de um parágrafo; o texto quebra normalmente conforme o tamanho da tela." },
  { chave: "apoio_texto", valor: "[texto de exemplo] Quem apoia no Apoia.se recebe conteúdo em primeira mão, acompanha os bastidores do processo e ajuda a Anne a continuar desenhando a HQ." },
  { chave: "capa", valor: "" },
  { chave: "link_tapas", valor: "" },
  { chave: "link_webtoon", valor: "" },
  { chave: "link_apoiase", valor: "" },
], "chave");

console.log("Gravando personagens...");
await limparTabela("personagens");
await upsert("personagens", [
  {
    nome: "Finn",
    descricao: "[texto de exemplo] Descrição curta do protagonista — quem ele é, o que ele quer, e o que marca o visual dele.",
    mudancas: "[texto de exemplo] Como o design do Finn mudou desde a primeira versão até a atual — traço, cores, roupa, o que for relevante.",
    img_url: "",
    img_antiga_url: "",
    ordem: 1,
  },
  {
    nome: "[nome do 2º personagem — exemplo]",
    descricao: "[texto de exemplo] Descrição curta do segundo personagem.",
    mudancas: "[texto de exemplo] Evolução do design deste personagem.",
    img_url: "",
    img_antiga_url: "",
    ordem: 2,
  },
]);

console.log("\nPronto! Migração concluída.");
