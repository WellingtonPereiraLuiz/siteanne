(function(){
  "use strict";

  var $ = function(s){ return document.querySelector(s); };

  function figuraHtml(foto){
    return '<figure><img src="' + foto.imagem_url + '" width="' + (foto.largura || 560) +
      '" height="' + (foto.altura || 560) + '" alt="' + foto.titulo + '" loading="lazy"></figure>';
  }

  /* A galeria é a tabela "galeria", uma linha por foto. "visivel=eq.true"
     deixa a Anne "esconder" uma foto no painel sem apagar do banco. */
  supaSelect("galeria", "select=imagem_url,titulo,largura,altura,ordem&visivel=eq.true&order=ordem")
    .then(function(galeriaLinhas){
      $("#galeria-grid").innerHTML = galeriaLinhas.map(figuraHtml).join("");
    })
    .catch(function(erro){ console.error(erro); });
})();
