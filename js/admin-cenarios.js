/* Aba "Cenários" do painel — lista com editar/excluir + formulário de novo. */
function adminCenariosIniciar(container){
  var itens = [];
  var editando = null; /* id do cenário em edição, "novo", ou null (nada aberto) */

  function carregar(){
    container.innerHTML = '<p class="carregando">Carregando…</p>';
    return authFetch(SUPA_URL + "/rest/v1/cenarios?select=id,slug,nome,descricao,preco_min,preco_max,ordem&order=ordem")
      .then(function(resp){ return resp.json(); })
      .then(function(linhas){ itens = linhas; render(); })
      .catch(function(erro){ container.innerHTML = '<p class="erro">Não foi possível carregar: ' + escapeHtml(erro.message) + '</p>'; });
  }

  function render(){
    var listaHtml = itens.map(function(c){
      if (editando === c.id) return formItem(c);
      return '<div class="item-admin">' +
        '<div class="info">' +
          '<span class="titulo">' + escapeHtml(c.nome) + '</span>' +
          '<span class="sub">R$ ' + c.preco_min + ' a R$ ' + c.preco_max + ' · ordem ' + c.ordem + '</span>' +
        '</div>' +
        '<div class="acoes">' +
          '<button class="botao-icone" type="button" data-editar="' + c.id + '" aria-label="Editar">&#9998;</button>' +
          '<button class="botao-icone perigo" type="button" data-excluir="' + c.id + '" aria-label="Excluir">&#10005;</button>' +
        '</div>' +
      '</div>';
    }).join("");

    container.innerHTML =
      '<div class="painel-secao sticker">' +
        '<h2>Cenários</h2>' +
        '<div class="lista-admin">' + (listaHtml || '<p class="ajuda">Nenhum cenário cadastrado.</p>') + '</div>' +
        (editando === "novo" ? formItem(null) :
          '<button class="cta pequeno fantasma" type="button" id="cen-novo" style="margin-top:14px">+ Novo cenário</button>') +
      '</div>';

    ligarEventos();
  }

  function formItem(c){
    var vazio = !c;
    return '<div class="form-item">' +
      '<div class="campo"><label>Slug (identificador curto, sem espaço — não dá pra mudar depois de criado)</label>' +
        '<input type="text" id="cen-slug" value="' + (vazio ? "" : escapeHtml(c.slug)) + '"' + (vazio ? "" : " disabled") + '></div>' +
      '<div class="campo"><label>Nome</label><input type="text" id="cen-nome" value="' + (vazio ? "" : escapeHtml(c.nome)) + '"></div>' +
      '<div class="campo"><label>Descrição</label><input type="text" id="cen-desc" value="' + (vazio ? "" : escapeHtml(c.descricao)) + '"></div>' +
      '<div class="linha-campos">' +
        '<div class="campo"><label>Preço mínimo (R$)</label><input type="number" step="0.01" id="cen-min" value="' + (vazio ? 0 : c.preco_min) + '"></div>' +
        '<div class="campo"><label>Preço máximo (R$)</label><input type="number" step="0.01" id="cen-max" value="' + (vazio ? 0 : c.preco_max) + '"></div>' +
        '<div class="campo"><label>Ordem</label><input type="number" id="cen-ordem" value="' + (vazio ? (itens.length + 1) : c.ordem) + '"></div>' +
      '</div>' +
      '<p class="erro" id="cen-erro" hidden></p>' +
      '<div class="form-acoes">' +
        '<button class="cta pequeno" type="button" id="cen-salvar">Salvar</button>' +
        '<button class="cta pequeno fantasma" type="button" id="cen-cancelar">Cancelar</button>' +
      '</div>' +
    '</div>';
  }

  function ligarEventos(){
    var $ = function(s){ return container.querySelector(s); };

    container.querySelectorAll("[data-editar]").forEach(function(b){
      b.addEventListener("click", function(){ editando = Number(b.dataset.editar); render(); });
    });
    container.querySelectorAll("[data-excluir]").forEach(function(b){
      b.addEventListener("click", function(){
        if (!confirm("Excluir esse cenário? Não dá pra desfazer.")) return;
        authFetch(SUPA_URL + "/rest/v1/cenarios?id=eq." + b.dataset.excluir, { method: "DELETE" })
          .then(function(){ editando = null; return carregar(); })
          .catch(function(erro){ alert("Erro ao excluir: " + erro.message); });
      });
    });

    var novoBtn = $("#cen-novo");
    if (novoBtn) novoBtn.addEventListener("click", function(){ editando = "novo"; render(); });

    var cancelar = $("#cen-cancelar");
    if (cancelar) cancelar.addEventListener("click", function(){ editando = null; render(); });

    var salvar = $("#cen-salvar");
    if (salvar) salvar.addEventListener("click", function(){
      var corpo = {
        nome: $("#cen-nome").value.trim(),
        descricao: $("#cen-desc").value.trim(),
        preco_min: Number($("#cen-min").value),
        preco_max: Number($("#cen-max").value),
        ordem: Number($("#cen-ordem").value)
      };

      var requisicao;
      if (editando === "novo"){
        corpo.slug = $("#cen-slug").value.trim();
        if (!corpo.nome || !corpo.slug){
          $("#cen-erro").textContent = "Preencha pelo menos o slug e o nome.";
          $("#cen-erro").hidden = false;
          return;
        }
        requisicao = authFetch(SUPA_URL + "/rest/v1/cenarios", {
          method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(corpo)
        });
      } else {
        requisicao = authFetch(SUPA_URL + "/rest/v1/cenarios?id=eq." + editando, {
          method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(corpo)
        });
      }

      salvar.disabled = true;
      requisicao.then(function(resp){
        if (!resp.ok) return resp.text().then(function(t){ throw new Error(t); });
        editando = null;
        return carregar();
      }).catch(function(erro){
        $("#cen-erro").textContent = "Erro ao salvar: " + erro.message;
        $("#cen-erro").hidden = false;
        salvar.disabled = false;
      });
    });
  }

  return carregar();
}
