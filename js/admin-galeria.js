/* Aba "Galeria" do painel — lista com editar/excluir/visível + upload de foto nova. */
function adminGaleriaIniciar(container){
  var itens = [];
  var editando = null;

  function carregar(){
    container.innerHTML = '<p class="carregando">Carregando…</p>';
    return authFetchJson(SUPA_URL + "/rest/v1/galeria?select=id,imagem_url,titulo,largura,altura,ordem,visivel&order=ordem")
      .then(function(linhas){ itens = linhas; render(); })
      .catch(function(erro){ container.innerHTML = '<p class="erro">Não foi possível carregar: ' + escapeHtml(erro.message) + '</p>'; });
  }

  /* lê a largura/altura reais do arquivo escolhido, carregando ele como
     imagem no próprio navegador — funciona pra qualquer formato que o
     navegador consiga exibir, sem precisar de nenhuma biblioteca */
  function obterDimensoes(arquivo){
    return new Promise(function(resolve){
      var url = URL.createObjectURL(arquivo);
      var img = new Image();
      img.onload = function(){
        resolve({ largura: img.naturalWidth, altura: img.naturalHeight });
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  }

  function render(){
    var listaHtml = itens.map(function(f){
      if (editando === f.id) return formItem(f);
      return '<div class="item-admin' + (f.visivel ? "" : " oculto") + '" data-id-arrastar="' + f.id + '">' +
        '<span class="alca-arrastar" title="Arrastar pra reordenar">&#8801;</span>' +
        '<img class="miniatura" src="' + escapeHtml(f.imagem_url) + '" alt="">' +
        '<div class="info">' +
          '<span class="titulo">' + (f.titulo ? escapeHtml(f.titulo) : "(sem título)") + '</span>' +
          '<span class="sub">ordem ' + f.ordem + (f.visivel ? "" : " · oculta") + '</span>' +
        '</div>' +
        '<div class="acoes">' +
          '<button class="botao-icone" type="button" data-editar="' + f.id + '" aria-label="Editar">&#9998;</button>' +
          '<button class="botao-icone perigo" type="button" data-excluir="' + f.id + '" aria-label="Excluir">&#10005;</button>' +
        '</div>' +
      '</div>';
    }).join("");

    container.innerHTML =
      '<div class="painel-secao sticker">' +
        '<h2>Galeria</h2>' +
        '<p class="ajuda" style="margin-bottom:10px">Arraste pela alcinha pra mudar a ordem.</p>' +
        '<div class="lista-admin">' + (listaHtml || '<p class="ajuda">Nenhuma foto cadastrada.</p>') + '</div>' +
        (editando === "novo" ? formItem(null) :
          '<button class="cta pequeno fantasma" type="button" id="gal-novo" style="margin-top:14px">+ Nova foto</button>') +
      '</div>';

    ligarEventos();
  }

  function formItem(f){
    var vazio = !f;
    return '<div class="form-item">' +
      '<div class="upload-imagem" style="margin-bottom:14px">' +
        (vazio ? '<span class="preview-vazia">sem foto</span>' : '<img class="preview-atual" src="' + escapeHtml(f.imagem_url) + '" alt="">') +
        '<div class="campo" style="flex:1;min-width:180px">' +
          '<label>' + (vazio ? "Escolher foto" : "Trocar foto (opcional)") + '</label>' +
          '<input type="file" id="gal-arquivo" accept="image/*">' +
        '</div>' +
      '</div>' +
      '<div class="campo"><label>Título (descreve a foto pra quem usa leitor de tela)</label><input type="text" id="gal-titulo" value="' + (vazio ? "" : escapeHtml(f.titulo)) + '"></div>' +
      '<div class="campo" style="max-width:140px"><label>Ordem</label><input type="number" id="gal-ordem" value="' + (vazio ? (itens.length + 1) : f.ordem) + '"></div>' +
      '<label class="switch" style="margin-top:4px">' +
        '<input type="checkbox" id="gal-visivel"' + (vazio || f.visivel ? " checked" : "") + '>' +
        '<span><span class="sw-t">Visível na galeria</span></span>' +
      '</label>' +
      '<p class="erro" id="gal-erro" hidden style="margin-top:12px"></p>' +
      '<div class="form-acoes">' +
        '<button class="cta pequeno" type="button" id="gal-salvar">Salvar</button>' +
        '<button class="cta pequeno fantasma" type="button" id="gal-cancelar">Cancelar</button>' +
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
        if (!confirm("Excluir essa foto da galeria? Não dá pra desfazer.")) return;
        authFetch(SUPA_URL + "/rest/v1/galeria?id=eq." + b.dataset.excluir, { method: "DELETE" })
          .then(function(){ editando = null; return carregar(); })
          .catch(function(erro){ alert("Erro ao excluir: " + erro.message); });
      });
    });

    var listaEl = container.querySelector(".lista-admin");
    if (listaEl) ligarArrastar(listaEl, function(ids){
      /* a lista já está visualmente na ordem certa (foi reordenada durante
         o arrasto) — só atualiza os números em memória e manda pro banco
         em segundo plano, sem recarregar a lista inteira (isso é o que
         deixava o arrastar lento) */
      ids.forEach(function(id, i){
        var item = itens.filter(function(x){ return x.id === Number(id); })[0];
        if (item) item.ordem = i + 1;
      });
      persistirOrdemArrastada("galeria", ids).catch(function(erro){
        alert("Erro ao salvar a nova ordem: " + erro.message);
        carregar();
      });
    });

    var novoBtn = $("#gal-novo");
    if (novoBtn) novoBtn.addEventListener("click", function(){ editando = "novo"; render(); });

    var cancelar = $("#gal-cancelar");
    if (cancelar) cancelar.addEventListener("click", function(){ editando = null; render(); });

    var salvar = $("#gal-salvar");
    if (salvar) salvar.addEventListener("click", function(){
      var arquivo = $("#gal-arquivo").files[0];
      var atual = editando === "novo" ? null : itens.filter(function(i){ return i.id === editando; })[0];

      if (editando === "novo" && !arquivo){
        $("#gal-erro").textContent = "Escolha uma foto.";
        $("#gal-erro").hidden = false;
        return;
      }

      salvar.disabled = true;

      var prontoImagem = arquivo
        ? Promise.all([authSubirImagem("galeria", arquivo), obterDimensoes(arquivo)]).then(function(r){
            return { imagem_url: r[0], largura: r[1].largura, altura: r[1].altura };
          })
        : Promise.resolve({ imagem_url: atual.imagem_url, largura: atual.largura, altura: atual.altura });

      prontoImagem.then(function(imagem){
        var corpo = {
          imagem_url: imagem.imagem_url, largura: imagem.largura, altura: imagem.altura,
          titulo: $("#gal-titulo").value.trim(),
          ordem: Number($("#gal-ordem").value),
          visivel: $("#gal-visivel").checked
        };
        return editando === "novo"
          ? authFetch(SUPA_URL + "/rest/v1/galeria", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(corpo) })
          : authFetch(SUPA_URL + "/rest/v1/galeria?id=eq." + editando, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(corpo) });
      }).then(function(resp){
        if (!resp.ok) return resp.text().then(function(t){ throw new Error(t); });
        editando = null;
        return carregar();
      }).catch(function(erro){
        $("#gal-erro").textContent = "Erro ao salvar: " + erro.message;
        $("#gal-erro").hidden = false;
        salvar.disabled = false;
      });
    });
  }

  return carregar();
}
