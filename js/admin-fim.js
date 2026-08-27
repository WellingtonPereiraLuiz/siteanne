/* Aba "Fim Anti-Herói" do painel — textos/links da obra + CRUD de personagens. */
function adminFimIniciar(container){
  container.innerHTML = '<p class="carregando">Carregando…</p>';

  var personagens = [];
  var editandoPersonagem = null;

  return Promise.all([
    authFetch(SUPA_URL + "/rest/v1/obra?select=chave,valor").then(function(r){ return r.json(); }),
    authFetch(SUPA_URL + "/rest/v1/personagens?select=id,nome,descricao,mudancas,img_url,img_antiga_url,ordem&order=ordem").then(function(r){ return r.json(); })
  ]).then(function(resultados){
    var obraPorChave = {};
    resultados[0].forEach(function(l){ obraPorChave[l.chave] = l.valor; });
    personagens = resultados[1];
    render(obraPorChave);
  }).catch(function(erro){
    container.innerHTML = '<p class="erro">Não foi possível carregar: ' + escapeHtml(erro.message) + '</p>';
  });

  function statusHtml(){ return '<p class="sucesso" hidden></p><p class="erro" hidden></p>'; }
  function mostrarStatus(form, ok, texto){
    var okEl = form.querySelector(".sucesso"), erroEl = form.querySelector(".erro");
    okEl.hidden = !ok; erroEl.hidden = ok;
    (ok ? okEl : erroEl).textContent = texto;
    if (ok) setTimeout(function(){ okEl.hidden = true; }, 2500);
  }

  function campoTexto(id, label, valor, textarea){
    var campo = textarea
      ? '<textarea id="' + id + '">' + escapeHtml(valor) + '</textarea>'
      : '<input type="text" id="' + id + '" value="' + escapeHtml(valor) + '">';
    return '<div class="campo"><label for="' + id + '">' + label + '</label>' + campo + '</div>';
  }

  function salvarObraChave(chave, valor){
    return authFetch(SUPA_URL + "/rest/v1/obra?chave=eq." + chave, {
      method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ valor: valor })
    }).then(function(resp){ if (!resp.ok) return resp.text().then(function(t){ throw new Error(t); }); });
  }

  /* === bloco "obra" (textos e links) === */

  function render(obra){
    container.innerHTML =
      '<form class="painel-secao sticker" id="form-obra">' +
        '<h2>Fim Anti-Herói — obra</h2>' +
        '<div class="upload-imagem" style="margin-bottom:16px">' +
          (obra.capa ? '<img class="preview-atual" src="' + escapeHtml(obra.capa) + '" alt="">' : '<span class="preview-vazia">sem capa</span>') +
          '<div class="campo" style="flex:1;min-width:180px"><label for="ob-capa-arquivo">Trocar capa</label><input type="file" id="ob-capa-arquivo" accept="image/*"></div>' +
        '</div>' +
        campoTexto("ob-titulo", "Título", obra.titulo || "") +
        campoTexto("ob-gancho", "Gancho (frase curta de efeito)", obra.gancho || "") +
        campoTexto("ob-sinopse", "Sinopse", obra.sinopse || "", true) +
        campoTexto("ob-apoio", "Texto do bloco de apoio (Apoia.se)", obra.apoio_texto || "", true) +
        '<div class="linha-campos">' +
          campoTexto("ob-tapas", "Link do Tapas", obra.link_tapas || "") +
          campoTexto("ob-webtoon", "Link do Webtoon", obra.link_webtoon || "") +
          campoTexto("ob-apoiase", "Link do Apoia.se", obra.link_apoiase || "") +
        '</div>' +
        statusHtml() +
        '<button class="cta pequeno" type="submit">Salvar</button>' +
      '</form>' +
      '<div id="fim-personagens-admin"></div>';

    ligarObra(obra);
    renderPersonagens();
  }

  function ligarObra(obra){
    var form = container.querySelector("#form-obra");
    var $ = function(s){ return form.querySelector(s); };

    form.addEventListener("submit", function(e){
      e.preventDefault();
      var botao = form.querySelector('button[type="submit"]');
      var arquivo = $("#ob-capa-arquivo").files[0];
      botao.disabled = true;

      (arquivo ? authSubirImagem("personagens", arquivo) : Promise.resolve(obra.capa || ""))
        .then(function(capaUrl){
          return Promise.all([
            salvarObraChave("titulo", $("#ob-titulo").value.trim()),
            salvarObraChave("gancho", $("#ob-gancho").value.trim()),
            salvarObraChave("sinopse", $("#ob-sinopse").value.trim()),
            salvarObraChave("apoio_texto", $("#ob-apoio").value.trim()),
            salvarObraChave("capa", capaUrl),
            salvarObraChave("link_tapas", $("#ob-tapas").value.trim()),
            salvarObraChave("link_webtoon", $("#ob-webtoon").value.trim()),
            salvarObraChave("link_apoiase", $("#ob-apoiase").value.trim())
          ]).then(function(){ return capaUrl; });
        })
        .then(function(capaUrl){
          obra.capa = capaUrl;
          mostrarStatus(form, true, "Salvo!");
          botao.disabled = false;
        })
        .catch(function(erro){
          mostrarStatus(form, false, "Erro ao salvar: " + erro.message);
          botao.disabled = false;
        });
    });
  }

  /* === bloco "personagens" (lista + form) === */

  function recarregarPersonagens(){
    return authFetch(SUPA_URL + "/rest/v1/personagens?select=id,nome,descricao,mudancas,img_url,img_antiga_url,ordem&order=ordem")
      .then(function(resp){ return resp.json(); })
      .then(function(linhas){ personagens = linhas; });
  }

  function renderPersonagens(){
    var host = container.querySelector("#fim-personagens-admin");
    var listaHtml = personagens.map(function(p){
      if (editandoPersonagem === p.id) return formPersonagem(p);
      return '<div class="item-admin">' +
        (p.img_url ? '<img class="miniatura" src="' + escapeHtml(p.img_url) + '" alt="">' : '<span class="miniatura-vazia"></span>') +
        '<div class="info">' +
          '<span class="titulo">' + escapeHtml(p.nome) + '</span>' +
          '<span class="sub">ordem ' + p.ordem + '</span>' +
        '</div>' +
        '<div class="acoes">' +
          '<button class="botao-icone" type="button" data-editar-p="' + p.id + '" aria-label="Editar">&#9998;</button>' +
          '<button class="botao-icone perigo" type="button" data-excluir-p="' + p.id + '" aria-label="Excluir">&#10005;</button>' +
        '</div>' +
      '</div>';
    }).join("");

    host.innerHTML =
      '<div class="painel-secao sticker">' +
        '<h2>Personagens</h2>' +
        '<div class="lista-admin">' + (listaHtml || '<p class="ajuda">Nenhum personagem cadastrado.</p>') + '</div>' +
        (editandoPersonagem === "novo" ? formPersonagem(null) :
          '<button class="cta pequeno fantasma" type="button" id="pz-novo" style="margin-top:14px">+ Novo personagem</button>') +
      '</div>';

    ligarPersonagens(host);
  }

  function formPersonagem(p){
    var vazio = !p;
    return '<div class="form-item">' +
      '<div class="campo"><label>Nome</label><input type="text" id="pz-nome" value="' + (vazio ? "" : escapeHtml(p.nome)) + '"></div>' +
      '<div class="campo"><label>Descrição</label><textarea id="pz-desc">' + (vazio ? "" : escapeHtml(p.descricao)) + '</textarea></div>' +
      '<div class="campo"><label>Como o design mudou</label><textarea id="pz-mudancas">' + (vazio ? "" : escapeHtml(p.mudancas)) + '</textarea></div>' +
      '<div class="upload-imagem" style="margin-bottom:12px">' +
        (vazio || !p.img_url ? '<span class="preview-vazia">sem arte</span>' : '<img class="preview-atual" src="' + escapeHtml(p.img_url) + '" alt="">') +
        '<div class="campo" style="flex:1;min-width:160px"><label>Arte atual</label><input type="file" id="pz-img" accept="image/*"></div>' +
      '</div>' +
      '<div class="upload-imagem" style="margin-bottom:12px">' +
        (vazio || !p.img_antiga_url ? '<span class="preview-vazia">sem versão antiga</span>' : '<img class="preview-atual" src="' + escapeHtml(p.img_antiga_url) + '" alt="">') +
        '<div class="campo" style="flex:1;min-width:160px"><label>Versão antiga (comparativo)</label><input type="file" id="pz-img-antiga" accept="image/*"></div>' +
      '</div>' +
      '<div class="campo" style="max-width:140px"><label>Ordem</label><input type="number" id="pz-ordem" value="' + (vazio ? (personagens.length + 1) : p.ordem) + '"></div>' +
      '<p class="erro" id="pz-erro" hidden></p>' +
      '<div class="form-acoes">' +
        '<button class="cta pequeno" type="button" id="pz-salvar">Salvar</button>' +
        '<button class="cta pequeno fantasma" type="button" id="pz-cancelar">Cancelar</button>' +
      '</div>' +
    '</div>';
  }

  function ligarPersonagens(host){
    var $ = function(s){ return host.querySelector(s); };

    host.querySelectorAll("[data-editar-p]").forEach(function(b){
      b.addEventListener("click", function(){ editandoPersonagem = Number(b.dataset.editarP); renderPersonagens(); });
    });
    host.querySelectorAll("[data-excluir-p]").forEach(function(b){
      b.addEventListener("click", function(){
        if (!confirm("Excluir esse personagem? Não dá pra desfazer.")) return;
        authFetch(SUPA_URL + "/rest/v1/personagens?id=eq." + b.dataset.excluirP, { method: "DELETE" })
          .then(function(){ return recarregarPersonagens(); })
          .then(function(){ editandoPersonagem = null; renderPersonagens(); })
          .catch(function(erro){ alert("Erro ao excluir: " + erro.message); });
      });
    });

    var novoBtn = $("#pz-novo");
    if (novoBtn) novoBtn.addEventListener("click", function(){ editandoPersonagem = "novo"; renderPersonagens(); });

    var cancelar = $("#pz-cancelar");
    if (cancelar) cancelar.addEventListener("click", function(){ editandoPersonagem = null; renderPersonagens(); });

    var salvar = $("#pz-salvar");
    if (salvar) salvar.addEventListener("click", function(){
      var atual = editandoPersonagem === "novo" ? null : personagens.filter(function(p){ return p.id === editandoPersonagem; })[0];
      var arquivoImg = $("#pz-img").files[0];
      var arquivoImgAntiga = $("#pz-img-antiga").files[0];
      var nome = $("#pz-nome").value.trim();

      if (!nome){
        $("#pz-erro").textContent = "Preencha o nome.";
        $("#pz-erro").hidden = false;
        return;
      }

      salvar.disabled = true;

      Promise.all([
        arquivoImg ? authSubirImagem("personagens", arquivoImg) : Promise.resolve(atual ? atual.img_url : ""),
        arquivoImgAntiga ? authSubirImagem("personagens", arquivoImgAntiga) : Promise.resolve(atual ? atual.img_antiga_url : "")
      ]).then(function(urls){
        var corpo = {
          nome: nome,
          descricao: $("#pz-desc").value.trim(),
          mudancas: $("#pz-mudancas").value.trim(),
          img_url: urls[0],
          img_antiga_url: urls[1],
          ordem: Number($("#pz-ordem").value)
        };
        return editandoPersonagem === "novo"
          ? authFetch(SUPA_URL + "/rest/v1/personagens", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(corpo) })
          : authFetch(SUPA_URL + "/rest/v1/personagens?id=eq." + editandoPersonagem, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(corpo) });
      }).then(function(resp){
        if (!resp.ok) return resp.text().then(function(t){ throw new Error(t); });
        return recarregarPersonagens();
      }).then(function(){
        editandoPersonagem = null;
        renderPersonagens();
      }).catch(function(erro){
        $("#pz-erro").textContent = "Erro ao salvar: " + erro.message;
        $("#pz-erro").hidden = false;
        salvar.disabled = false;
      });
    });
  }
}
