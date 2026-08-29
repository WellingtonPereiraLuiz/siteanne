"use strict";

/*
 * Reordenar listas do admin (cenários, galeria, personagens) sem precisar
 * abrir "editar" e digitar o número da ordem. Duas formas, as duas
 * chamando o banco assim que terminam:
 *
 *   1) Arrastar a linha pela alcinha (.alca-arrastar) — usa Pointer Events
 *      em vez da Drag and Drop API nativa do HTML porque essa API nativa
 *      não funciona em touch (celular/tablet), e o painel precisa
 *      funcionar em mobile.
 *   2) Botões ▲▼ na própria linha — mais lento (um vizinho por clique),
 *      mas mais fácil de acertar no toque do que arrastar.
 *
 * Os dois presumem uma tabela com coluna "ordem" (inteiro) — o mesmo
 * padrão de cenarios, galeria e personagens.
 */

/* ligarArrastar(lista, aoSoltar)
 * "lista" é o elemento ".lista-admin"; cada ".item-admin" dentro dele
 * precisa ter "data-id-arrastar" com o id do item e uma ".alca-arrastar"
 * lá dentro. "aoSoltar" é chamado com o array de ids (na ordem final,
 * de cima pra baixo) assim que o usuário solta. */
function ligarArrastar(lista, aoSoltar){
  var item = null;

  lista.querySelectorAll(".alca-arrastar").forEach(function(alca){
    alca.addEventListener("pointerdown", function(e){
      item = alca.closest(".item-admin");
      if (!item) return;
      item.setPointerCapture(e.pointerId);
      item.classList.add("arrastando");
    });
  });

  lista.addEventListener("pointermove", function(e){
    if (!item) return;
    e.preventDefault();
    var irmaos = Array.prototype.slice.call(lista.children)
      .filter(function(el){ return el !== item && el.classList.contains("item-admin"); });
    for (var i = 0; i < irmaos.length; i++){
      var r = irmaos[i].getBoundingClientRect();
      if (e.clientY < r.top + r.height / 2){
        lista.insertBefore(item, irmaos[i]);
        return;
      }
    }
    lista.appendChild(item);
  });

  function soltar(){
    if (!item) return;
    item.classList.remove("arrastando");
    item = null;
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
 * depois de arrastar) — um PATCH por item. */
function persistirOrdemArrastada(tabela, ids){
  return Promise.all(ids.map(function(id, i){
    return authFetch(SUPA_URL + "/rest/v1/" + tabela + "?id=eq." + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ ordem: i + 1 })
    });
  }));
}

/* moverOrdem(tabela, itens, id, direcao)
 * troca o valor de "ordem" entre um item e o vizinho (direcao: -1 sobe,
 * +1 desce). "itens" precisa já estar ordenado por ordem crescente (é o
 * array que cada aba já mantém em memória). Não faz nada se já for o
 * primeiro/último — quem chama decide desabilitar o botão nesse caso. */
function moverOrdem(tabela, itens, id, direcao){
  var i = -1;
  for (var k = 0; k < itens.length; k++){ if (itens[k].id === id){ i = k; break; } }
  var j = i + direcao;
  if (i < 0 || j < 0 || j >= itens.length) return Promise.resolve();

  var a = itens[i], b = itens[j];
  return Promise.all([
    authFetch(SUPA_URL + "/rest/v1/" + tabela + "?id=eq." + a.id, {
      method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ ordem: b.ordem })
    }),
    authFetch(SUPA_URL + "/rest/v1/" + tabela + "?id=eq." + b.id, {
      method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ ordem: a.ordem })
    })
  ]);
}
