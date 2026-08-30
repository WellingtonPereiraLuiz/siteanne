/* Aba "Fim Anti-Herói" do painel — textos/links da obra + CRUD de personagens. */
function adminFimIniciar(container){
  container.innerHTML = '<p class="carregando">Carregando…</p>';

  var personagens = [];
  var imagensPorPersonagem = {}; // id do personagem -> array de {id, url, ordem}, ordenado
  var editandoPersonagem = null;

  /* as 3 buscas rodam uma de cada vez (não Promise.all) — evita que duas
     chamadas tentem renovar o token de acesso ao mesmo tempo logo ao abrir
     a aba (mesma causa do bug de ordem no arrastar, ver js/admin-arrastar.js) */
  return authFetchJson(SUPA_URL + "/rest/v1/obra?select=chave,valor")
    .then(function(obraLinhas){
      var obraPorChave = {};
      obraLinhas.forEach(function(l){ obraPorChave[l.chave] = l.valor; });
      return authFetchJson(SUPA_URL + "/rest/v1/personagens?select=id,nome,descricao,img_url,ordem&order=ordem")
        .then(function(linhas){ personagens = linhas; })
        .then(function(){ return authFetchJson(SUPA_URL + "/rest/v1/personagem_imagens?select=id,personagem_id,url,ordem&order=ordem"); })
        .then(function(linhas){ montarImagensPorPersonagem(linhas); })
        .then(function(){ render(obraPorChave); });
    })
    .catch(function(erro){
      container.innerHTML = '<p class="erro">Não foi possível carregar: ' + escapeHtml(erro.message) + '</p>';
    });

  function montarImagensPorPersonagem(linhas){
    imagensPorPersonagem = {};
    linhas.forEach(function(im){
      (imagensPorPersonagem[im.personagem_id] = imagensPorPersonagem[im.personagem_id] || []).push(im);
    });
  }

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
          /* uma chave de cada vez (não Promise.all) — evita que várias
             renovações de token disputem ao mesmo tempo, mesma causa do
             bug de ordem no arrastar (ver js/admin-arrastar.js) */
          var pares = [
            ["titulo", $("#ob-titulo").value.trim()],
            ["gancho", $("#ob-gancho").value.trim()],
            ["sinopse", $("#ob-sinopse").value.trim()],
            ["apoio_texto", $("#ob-apoio").value.trim()],
            ["capa", capaUrl],
            ["link_tapas", $("#ob-tapas").value.trim()],
            ["link_webtoon", $("#ob-webtoon").value.trim()],
            ["link_apoiase", $("#ob-apoiase").value.trim()]
          ];
          var corrente = Promise.resolve();
          pares.forEach(function(par){
            corrente = corrente.then(function(){ return salvarObraChave(par[0], par[1]); });
          });
          return corrente.then(function(){ return capaUrl; });
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

  /* === bloco "personagens" (lista + form + mini galeria) === */

  function recarregarPersonagens(){
    return authFetchJson(SUPA_URL + "/rest/v1/personagens?select=id,nome,descricao,img_url,ordem&order=ordem")
      .then(function(linhas){ personagens = linhas; });
  }

  function recarregarImagens(){
    return authFetchJson(SUPA_URL + "/rest/v1/personagem_imagens?select=id,personagem_id,url,ordem&order=ordem")
      .then(function(linhas){ montarImagensPorPersonagem(linhas); });
  }

  function renderPersonagens(){
    var host = container.querySelector("#fim-personagens-admin");
    var listaHtml = personagens.map(function(p){
      if (editandoPersonagem === p.id) return formPersonagem(p);
      var fotos = imagensPorPersonagem[p.id] || [];
      return '<div class="item-admin" data-id-arrastar="' + p.id + '">' +
        '<span class="alca-arrastar" title="Arrastar pra reordenar">&#8801;</span>' +
        (p.img_url ? '<img class="miniatura" src="' + escapeHtml(p.img_url) + '" alt="">' : '<span class="miniatura-vazia"></span>') +
        '<div class="info">' +
          '<span class="titulo">' + escapeHtml(p.nome) + '</span>' +
          '<span class="sub">' + fotos.length + ' foto(s) na galeria · ordem ' + p.ordem + '</span>' +
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
        '<p class="ajuda" style="margin-bottom:10px">Arraste pela alcinha pra mudar a ordem.</p>' +
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
      '<div class="upload-imagem" style="margin-bottom:12px">' +
        (vazio || !p.img_url ? '<span class="preview-vazia">sem foto</span>' : '<img class="preview-atual" src="' + escapeHtml(p.img_url) + '" alt="">') +
        '<div class="campo" style="flex:1;min-width:160px"><label for="pz-img">Foto principal</label><input type="file" id="pz-img" accept="image/*"></div>' +
      '</div>' +
      '<div class="campo" style="max-width:140px"><label>Ordem</label><input type="number" id="pz-ordem" value="' + (vazio ? (personagens.length + 1) : p.ordem) + '"></div>' +
      '<p class="erro" id="pz-erro" hidden></p>' +
      '<div class="form-acoes">' +
        '<button class="cta pequeno" type="button" id="pz-salvar">Salvar</button>' +
        '<button class="cta pequeno fantasma" type="button" id="pz-cancelar">Cancelar</button>' +
      '</div>' +
      (vazio
        ? '<p class="ajuda" style="margin-top:14px">Salve o personagem primeiro — só dá pra adicionar fotos na galeria depois que ele já existe.</p>'
        : galeriaSecaoHtml(p.id)) +
    '</div>';
  }

  /* mini galeria (fotos extras, além da principal): miniaturas com campo
     de ordem + excluir, mais upload de foto nova */
  function galeriaSecaoHtml(personagemId){
    var fotos = imagensPorPersonagem[personagemId] || [];
    var itensHtml = fotos.map(function(im){
      return '<div class="item-admin">' +
        '<img class="miniatura" src="' + escapeHtml(im.url) + '" alt="">' +
        '<div class="info">' +
          '<div class="campo" style="margin-bottom:0"><label>ordem</label>' +
            '<input type="number" style="max-width:80px" data-ordem-img="' + im.id + '" value="' + im.ordem + '"></div>' +
        '</div>' +
        '<div class="acoes">' +
          '<button class="botao-icone perigo" type="button" data-excluir-img="' + im.id + '" aria-label="Excluir foto">&#10005;</button>' +
        '</div>' +
      '</div>';
    }).join("");

    return '<div class="painel-secao sticker" style="margin-top:16px;padding:16px 14px">' +
      '<h3 style="margin-top:0">Fotos da galeria</h3>' +
      '<p class="ajuda" style="margin-bottom:10px">Fotos extras, além da principal — aparecem num carrossel embaixo da descrição.</p>' +
      '<div class="lista-admin">' + (itensHtml || '<p class="ajuda">Nenhuma foto ainda.</p>') + '</div>' +
      '<div class="upload-imagem" style="margin-top:12px">' +
        '<div class="campo" style="flex:1;min-width:160px"><label for="pz-img-nova">Adicionar foto</label><input type="file" id="pz-img-nova" accept="image/*"></div>' +
        '<button class="cta pequeno fantasma" type="button" id="pz-img-add" data-personagem-id="' + personagemId + '">Adicionar</button>' +
      '</div>' +
      '<p class="erro" id="pz-img-erro" hidden></p>' +
    '</div>';
  }

  function ligarPersonagens(host){
    var $ = function(s){ return host.querySelector(s); };

    host.querySelectorAll("[data-editar-p]").forEach(function(b){
      b.addEventListener("click", function(){ editandoPersonagem = Number(b.dataset.editarP); renderPersonagens(); });
    });
    host.querySelectorAll("[data-excluir-p]").forEach(function(b){
      b.addEventListener("click", function(){
        if (!confirm("Excluir esse personagem e as fotos dele? Não dá pra desfazer.")) return;
        authFetch(SUPA_URL + "/rest/v1/personagens?id=eq." + b.dataset.excluirP, { method: "DELETE" })
          .then(function(){ return recarregarPersonagens(); })
          .then(function(){ return recarregarImagens(); })
          .then(function(){ editandoPersonagem = null; renderPersonagens(); })
          .catch(function(erro){ alert("Erro ao excluir: " + erro.message); });
      });
    });

    var listaEl = host.querySelector(".lista-admin");
    if (listaEl) ligarArrastar(listaEl, function(ids){
      /* a lista já está visualmente na ordem certa (foi reordenada durante
         o arrasto) — só atualiza os números em memória e manda pro banco
         em segundo plano, sem recarregar a lista inteira (isso é o que
         deixava o arrastar lento) */
      ids.forEach(function(id, i){
        var p = personagens.filter(function(x){ return x.id === Number(id); })[0];
        if (p) p.ordem = i + 1;
      });
      persistirOrdemArrastada("personagens", ids).catch(function(erro){
        alert("Erro ao salvar a nova ordem: " + erro.message);
        recarregarPersonagens().then(renderPersonagens);
      });
    });

    var novoBtn = $("#pz-novo");
    if (novoBtn) novoBtn.addEventListener("click", function(){ editandoPersonagem = "novo"; renderPersonagens(); });

    var cancelar = $("#pz-cancelar");
    if (cancelar) cancelar.addEventListener("click", function(){ editandoPersonagem = null; renderPersonagens(); });

    var salvar = $("#pz-salvar");
    if (salvar) salvar.addEventListener("click", function(){
      var atual = editandoPersonagem === "novo" ? null : personagens.filter(function(p){ return p.id === editandoPersonagem; })[0];
      var arquivo = $("#pz-img").files[0];
      var nome = $("#pz-nome").value.trim();

      if (!nome){
        $("#pz-erro").textContent = "Preencha o nome.";
        $("#pz-erro").hidden = false;
        return;
      }

      salvar.disabled = true;

      (arquivo ? authSubirImagem("personagens", arquivo) : Promise.resolve(atual ? atual.img_url : ""))
        .then(function(imgUrl){
          var corpo = {
            nome: nome,
            descricao: $("#pz-desc").value.trim(),
            img_url: imgUrl,
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

    /* mini galeria: mudar ordem de uma foto */
    host.querySelectorAll("[data-ordem-img]").forEach(function(input){
      input.addEventListener("change", function(){
        authFetch(SUPA_URL + "/rest/v1/personagem_imagens?id=eq." + input.dataset.ordemImg, {
          method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({ ordem: Number(input.value) })
        }).then(function(resp){
          if (!resp.ok) return resp.text().then(function(t){ throw new Error(t); });
          return recarregarImagens();
        }).then(function(){ renderPersonagens(); })
          .catch(function(erro){ alert("Erro ao reordenar: " + erro.message); });
      });
    });

    /* mini galeria: excluir foto */
    host.querySelectorAll("[data-excluir-img]").forEach(function(b){
      b.addEventListener("click", function(){
        if (!confirm("Excluir essa foto? Não dá pra desfazer.")) return;
        authFetch(SUPA_URL + "/rest/v1/personagem_imagens?id=eq." + b.dataset.excluirImg, { method: "DELETE" })
          .then(function(){ return recarregarImagens(); })
          .then(function(){ renderPersonagens(); })
          .catch(function(erro){ alert("Erro ao excluir foto: " + erro.message); });
      });
    });

    /* mini galeria: adicionar foto nova */
    var addBtn = $("#pz-img-add");
    if (addBtn) addBtn.addEventListener("click", function(){
      var arquivo = $("#pz-img-nova").files[0];
      var erroEl = $("#pz-img-erro");
      if (!arquivo){
        erroEl.textContent = "Escolha um arquivo primeiro.";
        erroEl.hidden = false;
        return;
      }
      var personagemId = Number(addBtn.dataset.personagemId);
      var proximaOrdem = (imagensPorPersonagem[personagemId] || []).length + 1;
      addBtn.disabled = true;

      authSubirImagem("personagens", arquivo)
        .then(function(url){
          return authFetch(SUPA_URL + "/rest/v1/personagem_imagens", {
            method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
            body: JSON.stringify({ personagem_id: personagemId, url: url, ordem: proximaOrdem })
          });
        }).then(function(resp){
          if (!resp.ok) return resp.text().then(function(t){ throw new Error(t); });
          return recarregarImagens();
        }).then(function(){
          renderPersonagens();
        }).catch(function(erro){
          erroEl.textContent = "Erro ao subir foto: " + erro.message;
          erroEl.hidden = false;
          addBtn.disabled = false;
        });
    });
  }
}
