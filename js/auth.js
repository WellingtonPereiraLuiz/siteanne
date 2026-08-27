"use strict";

/*
 * Login da Anne, usando a API de Auth do Supabase direto por fetch (sem
 * instalar biblioteca nenhuma, igual o resto do site). A sessão (token de
 * acesso + token de renovação) fica salva no localStorage do navegador —
 * só existe ali, nunca é enviada pra lugar nenhum além do próprio Supabase.
 */
var AUTH_CHAVE = "anne_admin_sessao";

function authSalvarSessao(resposta){
  localStorage.setItem(AUTH_CHAVE, JSON.stringify({
    access_token: resposta.access_token,
    refresh_token: resposta.refresh_token,
    expira_em: Date.now() + resposta.expires_in * 1000,
    email: resposta.user && resposta.user.email
  }));
}

function authSessao(){
  var bruto = localStorage.getItem(AUTH_CHAVE);
  return bruto ? JSON.parse(bruto) : null;
}

function authLimparSessao(){
  localStorage.removeItem(AUTH_CHAVE);
}

/* Faz login com email/senha. Devolve uma Promise que resolve com a sessão
   ou rejeita com um erro cuja .message já é o texto certo pra mostrar. */
function authLogin(email, senha){
  return fetch(SUPA_URL + "/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: { apikey: SUPA_ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: senha })
  }).then(function(resp){
    return resp.json().then(function(corpo){
      if (!resp.ok){
        var msg = corpo.error_code === "invalid_credentials"
          ? "Email ou senha incorretos."
          : (corpo.msg || corpo.error_description || "Não foi possível entrar.");
        throw new Error(msg);
      }
      authSalvarSessao(corpo);
      return corpo;
    });
  });
}

function authLogout(){
  var sessao = authSessao();
  authLimparSessao();
  if (sessao){
    /* avisa o Supabase pra invalidar o refresh_token; não trava o logout
       se isso falhar (ex.: sem internet) — a sessão local já foi limpa */
    fetch(SUPA_URL + "/auth/v1/logout", {
      method: "POST",
      headers: { apikey: SUPA_ANON_KEY, Authorization: "Bearer " + sessao.access_token }
    }).catch(function(){});
  }
}

/* Troca o refresh_token por um access_token novo, sem precisar da senha de
   novo — usado quando o token de 1 hora está perto de vencer. */
function authRenovar(){
  var sessao = authSessao();
  if (!sessao) return Promise.reject(new Error("sem sessão"));
  return fetch(SUPA_URL + "/auth/v1/token?grant_type=refresh_token", {
    method: "POST",
    headers: { apikey: SUPA_ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: sessao.refresh_token })
  }).then(function(resp){
    return resp.json().then(function(corpo){
      if (!resp.ok){ authLimparSessao(); throw new Error("sessão expirada"); }
      authSalvarSessao(corpo);
      return corpo;
    });
  });
}

/* Garante um access_token válido, renovando primeiro se estiver a menos de
   1 minuto de vencer. Todo fetch autenticado passa por aqui. */
function authToken(){
  var sessao = authSessao();
  if (!sessao) return Promise.reject(new Error("sem sessão"));
  if (sessao.expira_em - Date.now() > 60000) return Promise.resolve(sessao.access_token);
  return authRenovar().then(function(nova){ return nova.access_token; });
}

/* fetch() que já manda apikey + Authorization com o token da Anne — sem os
   dois, o Postgres trata a chamada como visitante anônimo e as políticas de
   RLS bloqueiam qualquer escrita (ver supabase/policies.sql). */
function authFetch(url, opcoes){
  opcoes = opcoes || {};
  return authToken().then(function(token){
    var headers = opcoes.headers || {};
    headers.apikey = SUPA_ANON_KEY;
    headers.Authorization = "Bearer " + token;
    opcoes.headers = headers;
    return fetch(url, opcoes);
  });
}

/* Sobe um arquivo pro Storage com nome único (timestamp na frente) e devolve
   a URL pública. Nome único é proposital: as imagens do Storage têm 1 dia de
   cache no navegador (ver supabase/migrar.mjs) — se a Anne trocasse uma foto
   mantendo o mesmo nome de arquivo, quem já visitou o site continuaria vendo
   a versão antiga por até 1 dia. Com nome novo, a URL muda e não tem cache
   nenhum pra confundir. */
function authSubirImagem(bucket, arquivo){
  var nomeUnico = Date.now() + "-" + arquivo.name.replace(/[^a-zA-Z0-9.\-]/g, "_");
  return authFetch(SUPA_URL + "/storage/v1/object/" + bucket + "/" + nomeUnico, {
    method: "PUT",
    headers: { "Content-Type": arquivo.type || "application/octet-stream", "cache-control": "public, max-age=86400" },
    body: arquivo
  }).then(function(resp){
    if (!resp.ok) return resp.text().then(function(texto){ throw new Error("Falha ao subir imagem: " + texto); });
    return supaStorageUrl(bucket, nomeUnico);
  });
}
