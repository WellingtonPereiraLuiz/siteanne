"use strict";

/*
 * URL do projeto e "anon key" do Supabase. As duas são seguras pra ficar
 * públicas aqui no código — foi feito pra isso: o anon key só enxerga o
 * que as políticas de RLS liberarem pra "leitura pública" (ver
 * supabase/policies.sql). A chave que PRECISA ficar em segredo é a
 * service_role key, e essa nunca entra em nenhum arquivo do site.
 */
var SUPA_URL = "https://xzpctuxezuugyjbedzhh.supabase.co";
var SUPA_ANON_KEY = "sb_publishable_eVPFYj7Kht9JAD-7LwztTg_DMZskvoL";

/* Monta a URL pública de um arquivo dentro de um bucket do Storage. */
function supaStorageUrl(bucket, arquivo){
  return SUPA_URL + "/storage/v1/object/public/" + bucket + "/" + arquivo;
}

/*
 * Busca linhas de uma tabela pela API REST do Supabase (PostgREST).
 * "query" é tudo que vai depois do "?" (ex.: "select=*&order=ordem").
 * Devolve uma Promise com o array de linhas já decodificado.
 */
function supaSelect(tabela, query){
  var url = SUPA_URL + "/rest/v1/" + tabela + (query ? "?" + query : "");
  return fetch(url, {
    headers: { apikey: SUPA_ANON_KEY, Authorization: "Bearer " + SUPA_ANON_KEY }
  }).then(function(resp){
    if (!resp.ok) throw new Error("Supabase: falha ao buscar " + tabela + " (" + resp.status + ")");
    return resp.json();
  });
}
