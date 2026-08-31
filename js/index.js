(function(){
  "use strict";

  var $ = function(s){ return document.querySelector(s); };

  /* escapa texto de campo livre da Anne antes de colar num innerHTML/atributo
     (nome, descrição, título de foto) — o painel deixa ela digitar "<", "&"
     etc. e sem isso quebraria o HTML da própria página */
  function esc(s){
    return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ===================== galeria ===================== */

  function figuraHtml(foto){
    return '<figure><img src="' + foto.imagem_url + '" width="' + (foto.largura || 560) +
      '" height="' + (foto.altura || 560) + '" alt="' + esc(foto.titulo) + '" loading="lazy"></figure>';
  }

  /* A galeria é a tabela "galeria", uma linha por foto. "visivel=eq.true"
     deixa a Anne "esconder" uma foto no painel sem apagar do banco. */
  supaSelect("galeria", "select=imagem_url,titulo,largura,altura,ordem&visivel=eq.true&order=ordem")
    .then(function(galeriaLinhas){
      $("#galeria-grid").innerHTML = galeriaLinhas.map(figuraHtml).join("");
    })
    .catch(function(erro){ console.error(erro); });

  /* ===================== links ("onde me achar") ===================== */

  /* Escolhe texto claro ou escuro pro ícone conforme a cor de fundo do
     quadradinho — a Anne pode pôr qualquer cor no painel, e uma cor escura
     deixaria o ícco (que usa "currentColor") sumir. Fórmula de luminância
     padrão (YIQ): acima de ~150 é cor clara, usa tinta escura; senão clara. */
  function tintaDoIcone(hex){
    var h = String(hex || "").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    if (isNaN(n) || h.length !== 6) return "#38222B";
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return (r * 299 + g * 587 + b * 114) / 1000 >= 150 ? "#38222B" : "#FFF8F3";
  }

  function linkHtml(l){
    var externo = /^https?:\/\//i.test(l.url);
    var attrs = externo ? ' target="_blank" rel="noopener"' : "";
    var seta = externo ? "↗" : "→"; /* ↗ externo, → interno */
    return '<a class="link sticker" href="' + esc(l.url) + '"' + attrs + '>' +
      '<span class="ico" style="background:' + esc(l.cor) + ';color:' + tintaDoIcone(l.cor) + '">' +
        iconeLinkHtml(l.icone_tipo, l.icone_preset, l.icone_url) +
      '</span>' +
      '<span class="txt">' +
        '<span class="name">' + esc(l.nome) + '</span>' +
        '<span class="desc">' + esc(l.descricao) + '</span>' +
      '</span>' +
      '<span class="arrow" aria-hidden="true">' + seta + '</span>' +
    '</a>';
  }

  /* Os links já estão no index.html como fallback (aparecem se o Supabase
     demorar ou falhar, igual o avatar). Aqui a gente troca pela versão do
     banco assim que ela chega — a partir da Fase 5 é o painel que manda. */
  supaSelect("links", "select=nome,descricao,url,icone_tipo,icone_preset,icone_url,cor,ordem&visivel=eq.true&order=ordem")
    .then(function(linksLinhas){
      if (!linksLinhas.length) return;
      $(".links").innerHTML = linksLinhas.map(linkHtml).join("");
    })
    .catch(function(erro){ console.error(erro); });
})();
