(function(){
  "use strict";

  /*
   * O avatar aparece em mais de uma página (header do index.html, topbar
   * de orcamento.html e fimantiheroi.html), por isso esse fetch fica num
   * arquivo à parte em vez de duplicado em cada página — toda <img> com a
   * classe "js-avatar" recebe a URL vinda da tabela "configuracao"
   * (chave "perfil"), sem precisar saber quantas existem na página.
   *
   * O mesmo fetch já traz o fundo customizado (Fase 4, campo "fundo" —
   * ver js/fundo.js) — reaproveitar em vez de buscar de novo evita uma
   * segunda chamada ao banco só pra isso.
   */
  supaSelect("configuracao", "select=valor&chave=eq.perfil").then(function(linhas){
    var perfil = linhas[0] && linhas[0].valor;
    if (!perfil) return;

    if (perfil.avatar_url){
      Array.prototype.slice.call(document.querySelectorAll(".js-avatar")).forEach(function(img){
        img.src = perfil.avatar_url;
      });
    }

    if (perfil.fundo && typeof aplicarFundo === "function") aplicarFundo(perfil.fundo);
  }).catch(function(erro){ console.error(erro); });
})();
