/* Aba "Links" do painel — os botões "onde me achar" da página inicial.
   Lista arrastável (editar / excluir / visível) + formulário de novo. */
function adminLinksIniciar(container){
  var itens = [];
  var editando = null; /* id em edição, "novo", ou null */

  /* texto claro ou escuro pro ícone conforme a cor de fundo (mesma fórmula
     de js/index.js) — pra prévia no painel bater com o site */
  function tintaIcone(hex){
    var h = String(hex || "").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    if (isNaN(n) || h.length !== 6) return "#38222B";
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return (r * 299 + g * 587 + b * 114) / 1000 >= 150 ? "#38222B" : "#FFF8F3";
  }

  function carregar(){
    container.innerHTML = '<p class="carregando">Carregando…</p>';
    return authFetchJson(SUPA_URL + "/rest/v1/links?select=id,nome,descricao,url,icone_tipo,icone_preset,icone_url,cor,ordem,visivel&order=ordem")
      .then(function(linhas){ itens = linhas; render(); })
      .catch(function(erro){ container.innerHTML = '<p class="erro">Não foi possível carregar: ' + escapeHtml(erro.message) + '</p>'; });
  }

  function iconeMiniatura(l){
    return '<span class="miniatura icone" style="background:' + escapeHtml(l.cor) + ';color:' + tintaIcone(l.cor) + '">' +
      iconeLinkHtml(l.icone_tipo, l.icone_preset, l.icone_url) + '</span>';
  }

  function render(){
    var listaHtml = itens.map(function(l){
      if (editando === l.id) return formItem(l);
      return '<div class="item-admin' + (l.visivel ? "" : " oculto") + '" data-id-arrastar="' + l.id + '">' +
        '<span class="alca-arrastar" title="Arrastar pra reordenar">&#8801;</span>' +
        iconeMiniatura(l) +
        '<div class="info">' +
          '<span class="titulo">' + escapeHtml(l.nome) + '</span>' +
          '<span class="sub">' + (l.url ? escapeHtml(l.url) : "(sem link)") + (l.visivel ? "" : " · oculto") + '</span>' +
        '</div>' +
        '<div class="acoes">' +
          '<button class="botao-icone" type="button" data-editar="' + l.id + '" aria-label="Editar">&#9998;</button>' +
          '<button class="botao-icone perigo" type="button" data-excluir="' + l.id + '" aria-label="Excluir">&#10005;</button>' +
        '</div>' +
      '</div>';
    }).join("");

    container.innerHTML =
      '<div class="painel-secao sticker">' +
        '<h2>Links</h2>' +
        '<p class="ajuda" style="margin-bottom:10px">Os botões de "onde me achar" da página inicial. Arraste pela alcinha pra mudar a ordem.</p>' +
        '<div class="lista-admin">' + (listaHtml || '<p class="ajuda">Nenhum link cadastrado.</p>') + '</div>' +
        (editando === "novo" ? formItem(null) :
          '<button class="cta pequeno fantasma" type="button" id="lk-novo" style="margin-top:14px">+ Novo link</button>') +
      '</div>';

    ligarEventos();
  }

  function gradeIconesHtml(presetAtual){
    return '<div class="icone-grade">' + Object.keys(ICONES_SITE).map(function(chave){
      var ic = ICONES_SITE[chave];
      return '<button type="button" class="icone-opcao" data-preset="' + chave + '" ' +
        'aria-pressed="' + (chave === presetAtual) + '" title="' + escapeHtml(ic.nome) + '">' + ic.svg + '</button>';
    }).join("") + '</div>';
  }

  function formItem(l){
    var vazio = !l;
    var tipo = vazio ? "preset" : l.icone_tipo;
    var preset = vazio ? "link" : (l.icone_preset || "link");
    var cor = vazio ? "#F3C0B4" : l.cor;

    return '<div class="form-item">' +
      '<div class="campo"><label>Nome</label><input type="text" id="lk-nome" value="' + (vazio ? "" : escapeHtml(l.nome)) + '"></div>' +
      '<div class="campo"><label>Descrição (a linha menor embaixo do nome)</label><input type="text" id="lk-desc" value="' + (vazio ? "" : escapeHtml(l.descricao)) + '"></div>' +
      '<div class="campo"><label>Link (URL completa, ou "fimantiheroi.html" pra página interna)</label><input type="text" id="lk-url" value="' + (vazio ? "" : escapeHtml(l.url)) + '"></div>' +

      '<div class="campo" style="max-width:180px"><label for="lk-cor">Cor do quadradinho</label><input type="color" id="lk-cor" value="' + escapeHtml(cor) + '"></div>' +

      '<div class="campo"><label>Ícone</label>' +
        '<div class="linha-campos" role="radiogroup" aria-label="Tipo de ícone" style="margin-bottom:4px">' +
          '<label><input type="radio" name="lk-icone-tipo" value="preset"' + (tipo === "preset" ? " checked" : "") + '> Escolher um pronto</label>' +
          '<label><input type="radio" name="lk-icone-tipo" value="imagem"' + (tipo === "imagem" ? " checked" : "") + '> Subir imagem</label>' +
        '</div>' +
      '</div>' +

      '<div class="lk-bloco" data-para="preset"' + (tipo === "preset" ? "" : " hidden") + '>' +
        gradeIconesHtml(preset) +
      '</div>' +

      '<div class="lk-bloco" data-para="imagem"' + (tipo === "imagem" ? "" : " hidden") + '>' +
        '<div class="upload-imagem" style="margin:4px 0 8px">' +
          (!vazio && l.icone_url ? '<img class="preview-atual" src="' + escapeHtml(l.icone_url) + '" alt="">' : '<span class="preview-vazia">sem imagem</span>') +
          '<div class="campo" style="flex:1;min-width:180px"><label for="lk-arquivo">Imagem do ícone (quadrada fica melhor)</label><input type="file" id="lk-arquivo" accept="image/*"></div>' +
        '</div>' +
      '</div>' +

      '<div class="campo" style="max-width:140px"><label>Ordem</label><input type="number" id="lk-ordem" value="' + (vazio ? (itens.length + 1) : l.ordem) + '"></div>' +
      '<label class="switch" style="margin-top:4px">' +
        '<input type="checkbox" id="lk-visivel"' + (vazio || l.visivel ? " checked" : "") + '>' +
        '<span><span class="sw-t">Visível na página inicial</span></span>' +
      '</label>' +
      '<p class="erro" id="lk-erro" hidden style="margin-top:12px"></p>' +
      '<div class="form-acoes">' +
        '<button class="cta pequeno" type="button" id="lk-salvar">Salvar</button>' +
        '<button class="cta pequeno fantasma" type="button" id="lk-cancelar">Cancelar</button>' +
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
        if (!confirm("Excluir esse link? Não dá pra desfazer.")) return;
        authFetch(SUPA_URL + "/rest/v1/links?id=eq." + b.dataset.excluir, { method: "DELETE" })
          .then(function(){ editando = null; return carregar(); })
          .catch(function(erro){ alert("Erro ao excluir: " + erro.message); });
      });
    });

    var listaEl = container.querySelector(".lista-admin");
    if (listaEl) ligarArrastar(listaEl, function(ids){
      ids.forEach(function(id, i){
        var item = itens.filter(function(x){ return x.id === Number(id); })[0];
        if (item) item.ordem = i + 1;
      });
      persistirOrdemArrastada("links", ids).catch(function(erro){
        alert("Erro ao salvar a nova ordem: " + erro.message);
        carregar();
      });
    });

    var novoBtn = $("#lk-novo");
    if (novoBtn) novoBtn.addEventListener("click", function(){ editando = "novo"; render(); });

    var cancelar = $("#lk-cancelar");
    if (cancelar) cancelar.addEventListener("click", function(){ editando = null; render(); });

    /* --- formulário aberto: picker de ícone --- */
    var form = $(".form-item");
    if (form){
      /* radio "pronto" / "imagem" mostra só o bloco escolhido */
      form.querySelectorAll('input[name="lk-icone-tipo"]').forEach(function(r){
        r.addEventListener("change", function(){
          form.querySelectorAll(".lk-bloco").forEach(function(bl){
            bl.hidden = bl.dataset.para !== r.value;
          });
        });
      });
      /* grade de ícones prontos: clicar seleciona (só um por vez) */
      form.querySelectorAll(".icone-opcao").forEach(function(op){
        op.addEventListener("click", function(){
          form.querySelectorAll(".icone-opcao").forEach(function(o){ o.setAttribute("aria-pressed", "false"); });
          op.setAttribute("aria-pressed", "true");
        });
      });
    }

    var salvar = $("#lk-salvar");
    if (salvar) salvar.addEventListener("click", function(){
      var atual = editando === "novo" ? null : itens.filter(function(i){ return i.id === editando; })[0];
      var arquivo = $("#lk-arquivo").files[0];
      var tipo = form.querySelector('input[name="lk-icone-tipo"]:checked').value;
      var opSel = form.querySelector('.icone-opcao[aria-pressed="true"]');
      var preset = opSel ? opSel.dataset.preset : "link";

      var nome = $("#lk-nome").value.trim();
      var url = $("#lk-url").value.trim();
      if (!nome || !url){
        $("#lk-erro").textContent = "Preencha pelo menos o nome e o link.";
        $("#lk-erro").hidden = false;
        return;
      }

      salvar.disabled = true;

      /* se escolheu "imagem" e tem arquivo novo, sobe; senão mantém a URL
         que já estava salva (ou vazia, se for link novo) */
      var prontoIcone = (tipo === "imagem" && arquivo)
        ? authSubirImagem("links", arquivo)
        : Promise.resolve(atual ? atual.icone_url : "");

      prontoIcone.then(function(iconeUrl){
        var corpo = {
          nome: nome,
          descricao: $("#lk-desc").value.trim(),
          url: url,
          cor: $("#lk-cor").value,
          icone_tipo: tipo,
          icone_preset: preset,
          icone_url: tipo === "imagem" ? iconeUrl : "",
          ordem: Number($("#lk-ordem").value),
          visivel: $("#lk-visivel").checked
        };
        return editando === "novo"
          ? authFetch(SUPA_URL + "/rest/v1/links", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(corpo) })
          : authFetch(SUPA_URL + "/rest/v1/links?id=eq." + editando, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(corpo) });
      }).then(function(resp){
        if (!resp.ok) return resp.text().then(function(t){ throw new Error(t); });
        editando = null;
        return carregar();
      }).catch(function(erro){
        $("#lk-erro").textContent = "Erro ao salvar: " + erro.message;
        $("#lk-erro").hidden = false;
        salvar.disabled = false;
      });
    });
  }

  return carregar();
}
