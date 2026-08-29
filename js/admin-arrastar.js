"use strict";

/*
 * Arrastar pra reordenar listas do admin (cenários, galeria, personagens)
 * sem precisar abrir "editar" e digitar o número da ordem. Usa Pointer
 * Events em vez da Drag and Drop API nativa do HTML porque essa API
 * nativa não funciona em touch (celular/tablet), e o painel precisa
 * funcionar em mobile.
 */

/* ligarArrastar(lista, aoSoltar)
 * "lista" é o elemento ".lista-admin"; cada ".item-admin" dentro dele
 * precisa ter "data-id-arrastar" com o id do item e uma ".alca-arrastar"
 * lá dentro. "aoSoltar" é chamado com o array de ids (na ordem final,
 * de cima pra baixo) assim que o usuário solta.
 *
 * Duas animações rodando ao mesmo tempo, pra não ficar um movimento seco:
 *   - o item arrastado segue o dedo/mouse (translateY direto, sem
 *     transição — precisa grudar na hora)
 *   - os vizinhos que saem do lugar deslizam suavemente até a posição
 *     nova, com a técnica "FLIP": mede a posição de cada um ANTES de
 *     mexer no DOM, aplica a diferença como um transform instantâneo
 *     (sem transição) assim que a posição muda de verdade, e só then liga
 *     a transição — o navegador anima a volta de -delta até 0 sozinho. */
function ligarArrastar(lista, aoSoltar){
  var item = null;
  var pointerYInicial = 0;

  function irmaosDe(el){
    return Array.prototype.slice.call(lista.children)
      .filter(function(x){ return x !== el && x.classList.contains("item-admin"); });
  }

  function medirPosicoes(els){
    var mapa = {};
    els.forEach(function(el){ mapa[el.dataset.idArrastar] = el.getBoundingClientRect().top; });
    return mapa;
  }

  function animarQueda(els, antes){
    els.forEach(function(el){
      var id = el.dataset.idArrastar;
      if (!(id in antes)) return;
      var delta = antes[id] - el.getBoundingClientRect().top;
      if (!delta) return;
      el.style.transition = "none";
      el.style.transform = "translateY(" + delta + "px)";
      requestAnimationFrame(function(){
        el.style.transition = "transform .2s ease";
        el.style.transform = "";
      });
    });
  }

  lista.querySelectorAll(".alca-arrastar").forEach(function(alca){
    alca.addEventListener("pointerdown", function(e){
      item = alca.closest(".item-admin");
      if (!item) return;
      pointerYInicial = e.clientY;
      item.setPointerCapture(e.pointerId);
      item.style.transition = "none";
      item.classList.add("arrastando");
    });
  });

  lista.addEventListener("pointermove", function(e){
    if (!item) return;
    e.preventDefault();
    item.style.transform = "translateY(" + (e.clientY - pointerYInicial) + "px) scale(1.02)";

    var irmaos = irmaosDe(item);
    for (var i = 0; i < irmaos.length; i++){
      var r = irmaos[i].getBoundingClientRect();
      if (e.clientY < r.top + r.height / 2){
        if (irmaos[i] !== item.nextSibling){
          var antes = medirPosicoes(irmaos);
          lista.insertBefore(item, irmaos[i]);
          animarQueda(irmaos, antes);
        }
        return;
      }
    }
    if (lista.lastElementChild !== item){
      var antesFim = medirPosicoes(irmaos);
      lista.appendChild(item);
      animarQueda(irmaos, antesFim);
    }
  });

  function soltar(){
    if (!item) return;
    var alvo = item;
    item = null;
    alvo.classList.remove("arrastando");
    alvo.style.transition = "transform .18s ease";
    alvo.style.transform = "";
    setTimeout(function(){ alvo.style.transition = ""; }, 200);

    var ids = Array.prototype.slice.call(lista.children)
      .filter(function(el){ return el.classList.contains("item-admin"); })
      .map(function(el){ return el.dataset.idArrastar; });
    aoSoltar(ids);
  }

  lista.addEventListener("pointerup", soltar);
  lista.addEventListener("pointercancel", soltar);
}

/* persistirOrdemArrastada(tabela, ids)
 * grava "ordem" 1, 2, 3... na sequência dos ids recebidos (a ordem final
 * depois de arrastar) — um PATCH por item, DE CADA VEZ (não em paralelo).
 * Isso é proposital: cada PATCH passa por authFetch(), que renova o token
 * de acesso sozinho quando ele está perto de vencer (ver js/auth.js); o
 * token de renovação só serve pra uma troca — se duas chamadas tentarem
 * renovar ao mesmo tempo, só a primeira funciona e as outras falham. Feito
 * uma de cada vez, nunca tem duas tentando renovar junto. Rejeita (e quem
 * chamou trata o erro) se qualquer PATCH não vier "ok". */
function persistirOrdemArrastada(tabela, ids){
  var corrente = Promise.resolve();
  ids.forEach(function(id, i){
    corrente = corrente
      .then(function(){
        return authFetch(SUPA_URL + "/rest/v1/" + tabela + "?id=eq." + id, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({ ordem: i + 1 })
        });
      })
      .then(function(resp){
        if (!resp.ok) return resp.text().then(function(t){ throw new Error(t); });
      });
  });
  return corrente;
}
