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
