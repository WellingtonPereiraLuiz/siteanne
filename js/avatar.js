(function(){
  "use strict";

  /*
   * O avatar aparece em mais de uma página (header do index.html, topbar
   * de orcamento.html e fimantiheroi.html), por isso esse fetch fica num
   * arquivo à parte em vez de duplicado em cada página — toda <img> com a
   * classe "js-avatar" recebe a URL vinda da tabela "configuracao"
   * (chave "perfil"), sem precisar saber quantas existem na página.
   */
  supaSelect("configuracao", "select=valor&chave=eq.perfil").then(function(linhas){
    var url = linhas[0] && linhas[0].valor.avatar_url;
    if (!url) return;
    Array.prototype.slice.call(document.querySelectorAll(".js-avatar")).forEach(function(img){
      img.src = url;
    });
  }).catch(function(erro){ console.error(erro); });
})();
