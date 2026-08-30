/*
 * Escapa texto antes de colar num innerHTML. Sem isso, um "&", "<", ">" ou
 * aspas digitado pela Anne num campo (sinopse, nome, etc.) pode quebrar o
 * HTML da própria tela do painel — todo texto livre que vem do banco e é
 * colado de volta em innerHTML/atributo passa por aqui primeiro.
 */
function escapeHtml(texto){
  return String(texto === null || texto === undefined ? "" : texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/*
 * authFetch() + já confere se a resposta veio "ok" antes de tentar ler o
 * JSON. Sem isso, quando o servidor devolve um erro (token vencido, RLS
 * bloqueando, coluna errada etc.), o corpo do erro é um objeto JSON válido
 * — vira "dado" normalmente, e só quebra mais tarde de um jeito confuso
 * (tipo "personagens.map is not a function"), escondendo o erro real.
 */
function authFetchJson(url, opcoes){
  return authFetch(url, opcoes).then(function(resp){
    if (!resp.ok) return resp.text().then(function(t){ throw new Error(t); });
    return resp.json();
  });
}
