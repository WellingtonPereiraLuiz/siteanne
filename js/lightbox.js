"use strict";

/*
 * Lightbox genérico: abre o <dialog id="lb"> (mesmo elemento que já existia
 * só em orcamento.html pras tabelas de preço) com uma imagem grande. Fase 4
 * passou a usar o mesmo dialog em fimantiheroi.html pras fotos de
 * personagem, então essa lógica saiu de calculo.js pra cá — assim as duas
 * páginas reaproveitam o mesmo código em vez de duplicar.
 *
 * Qualquer botão com "data-full" no HTML vira um gatilho automático: basta
 * <button data-full="URL_DA_IMAGEM_GRANDE" data-alt="texto alternativo">.
 */
(function(){
  var lb = document.getElementById("lb");
  if (!lb) return;

  var lbImg = document.getElementById("lb-img");

  function abrir(src, alt){
    lbImg.src = src;
    lbImg.alt = alt || "";
    if (lb.showModal) lb.showModal();
  }

  function fechar(){ lb.close(); }

  lb.querySelector(".close").addEventListener("click", fechar);
  lb.addEventListener("click", function(e){
    if (e.target === lb || e.target === lbImg) fechar();
  });

  document.addEventListener("click", function(e){
    var botao = e.target.closest ? e.target.closest("[data-full]") : null;
    if (!botao) return;
    var imgFilho = botao.querySelector("img");
    abrir(botao.dataset.full, botao.dataset.alt || (imgFilho ? imgFilho.alt : ""));
  });
})();
