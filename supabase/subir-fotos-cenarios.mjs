// Script pontual: sobe as 3 fotos reais dos cenários (assets/vegetacao.jpeg,
// assets/quarto.jpeg, assets/cidade.jpeg) pro bucket "cenarios" do Storage e
// grava a URL de cada uma na linha certa da tabela "cenarios", pelo slug.
//
// Rode DEPOIS de já ter rodado supabase/bucket-cenarios.sql no SQL Editor
// (senão o bucket "cenarios" ainda não existe e o upload falha).
//
// HISTÓRICO: os arquivos vegetacao.jpeg/quarto.jpeg/cidade.jpeg foram removidos
// de assets/ depois da migração. Para re-rodar, recupere-os do histórico do Git:
//   git checkout <commit-antes-da-limpeza> -- assets/
//
// Uso (no terminal, dentro da pasta do projeto):
//   SUPABASE_URL="https://xzpctuxezuugyjbedzhh.supabase.co" \
//   SUPABASE_SERVICE_ROLE_KEY="cole a secret/service_role key aqui, só neste comando" \
//   node supabase/subir-fotos-cenarios.mjs
//
// A service_role key nunca fica salva em nenhum arquivo — só existe no ar
// enquanto esse comando roda, na memória do seu terminal. Só é preciso rodar
// esse script UMA vez; rodar de novo simplesmente substitui as 3 fotos pelo
// mesmo arquivo local (não apaga nem mexe em mais nada da tabela).

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

// arquivo local -> slug do cenário que recebe a URL
const FOTOS = [
  { arquivo: "vegetacao.jpeg", slug: "vegetacao" },
  { arquivo: "quarto.jpeg", slug: "fechado" },
  { arquivo: "cidade.jpeg", slug: "cidade" },
];

async function subirArquivo(bucket, nomeArquivo, caminhoLocal) {
  const bytes = await readFile(caminhoLocal);
  const resp = await fetch(`${URL_BASE}/storage/v1/object/${bucket}/${nomeArquivo}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "image/jpeg", "cache-control": "public, max-age=86400" },
    body: bytes,
  });
  if (!resp.ok) throw new Error(`falha ao subir ${bucket}/${nomeArquivo}: ${resp.status} ${await resp.text()}`);
  return `${URL_BASE}/storage/v1/object/public/${bucket}/${nomeArquivo}`;
}

async function atualizarCenario(slug, imagemUrl) {
  const resp = await fetch(`${URL_BASE}/rest/v1/cenarios?slug=eq.${slug}`, {
    method: "PATCH",
    headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ imagem_url: imagemUrl }),
  });
  if (!resp.ok) throw new Error(`falha ao atualizar cenario "${slug}": ${resp.status} ${await resp.text()}`);
}

for (const { arquivo, slug } of FOTOS) {
  console.log(`Subindo ${arquivo}...`);
  const urlPublica = await subirArquivo("cenarios", arquivo, path.join(ASSETS, arquivo));
  console.log(`Atualizando cenario "${slug}" -> ${urlPublica}`);
  await atualizarCenario(slug, urlPublica);
}

console.log("\nPronto! As 3 fotos estão no ar e as linhas de cenarios foram atualizadas.");
