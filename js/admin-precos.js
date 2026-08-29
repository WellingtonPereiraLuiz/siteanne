/*
 * Aba "Preços & Perfil" do painel. Cada bloco (preços, acabamentos,
 * descontos, comercial, perfil) é um <form> separado com o próprio botão
 * "Salvar" — assim salvar um não mexe nos outros, e um erro num bloco não
 * trava os demais.
 */
function adminPrecosIniciar(container){
  container.innerHTML = '<p class="carregando">Carregando…</p>';

  return authFetch(SUPA_URL + "/rest/v1/configuracao?select=chave,valor")
    .then(function(resp){ return resp.json(); })
    .then(function(linhas){
      var porChave = {};
      linhas.forEach(function(l){ porChave[l.chave] = l.valor; });
      render(porChave);
    })
    .catch(function(erro){
      container.innerHTML = '<p class="erro">Não foi possível carregar: ' + erro.message + '</p>';
    });

  function campoNum(id, label, valor){
    return '<div class="campo"><label for="' + id + '">' + label + '</label>' +
      '<input type="number" step="0.01" id="' + id + '" value="' + valor + '"></div>';
  }

  function statusHtml(){
    return '<p class="sucesso" hidden></p><p class="erro" hidden></p>';
  }

  function mostrarStatus(form, ok, texto){
    var okEl = form.querySelector(".sucesso"), erroEl = form.querySelector(".erro");
    okEl.hidden = !ok; erroEl.hidden = ok;
    (ok ? okEl : erroEl).textContent = texto;
    if (ok) setTimeout(function(){ okEl.hidden = true; }, 2500);
  }

  function salvarConfiguracao(chave, valor){
    return authFetch(SUPA_URL + "/rest/v1/configuracao?chave=eq." + encodeURIComponent(chave), {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ valor: valor })
    }).then(function(resp){
      if (!resp.ok) return resp.text().then(function(t){ throw new Error(t); });
    });
  }

  function ligarSubmit(form, montarValor, chave){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var botao = form.querySelector('button[type="submit"]');
      botao.disabled = true;
      salvarConfiguracao(chave, montarValor())
        .then(function(){ mostrarStatus(form, true, "Salvo!"); })
        .catch(function(erro){ mostrarStatus(form, false, "Erro ao salvar: " + erro.message); })
        .then(function(){ botao.disabled = false; });
    });
  }

  /* Fundo do site (Fase 4): quatro caixas de cor, cada uma com uma
     checkbox "usar" — só as marcadas entram na mistura, na ordem em que
     aparecem. As cores padrão são só um chute pra quando a Anne ainda não
     escolheu nada; ela pode trocar qualquer uma. */
  var CORES_PADRAO_GRADIENTE = ["#ED9A6E", "#E5A0A2", "#F8D6C2", "#8A6382"];

  function fundoSecaoHtml(fundo){
    var cores = fundo.cores || [];
    var caixasCor = [0, 1, 2, 3].map(function(i){
      return '<label class="fundo-cor-item">' +
        '<input type="checkbox" id="fd-grad-on-' + i + '"' + (cores[i] ? " checked" : "") + '>' +
        '<input type="color" id="fd-grad-' + i + '" value="' + (cores[i] || CORES_PADRAO_GRADIENTE[i]) + '">' +
      '</label>';
    }).join("");

    return (
      '<h3>Fundo do site</h3>' +
      '<p class="ajuda" style="margin-bottom:12px">Aparece atrás de tudo, nas 3 páginas do site (início, orçamento e Fim Anti-Herói).</p>' +
      '<div class="linha-campos" role="radiogroup" aria-label="Tipo de fundo" style="margin-bottom:14px">' +
        '<label><input type="radio" name="fd-tipo" value="imagem"' + (fundo.tipo === "imagem" ? " checked" : "") + '> Imagem</label>' +
        '<label><input type="radio" name="fd-tipo" value="cor"' + (fundo.tipo === "cor" ? " checked" : "") + '> Cor sólida</label>' +
        '<label><input type="radio" name="fd-tipo" value="gradiente"' + (fundo.tipo === "gradiente" ? " checked" : "") + '> Mistura de cores</label>' +
      '</div>' +
      '<div class="upload-imagem" id="fd-painel-imagem" style="margin-bottom:16px">' +
        (fundo.url
          ? '<img class="preview-atual" id="fd-imagem-preview" src="' + escapeHtml(fundo.url) + '" alt="">'
          : '<span class="preview-vazia" id="fd-imagem-preview">sem foto</span>') +
        '<div class="campo" style="flex:1;min-width:180px"><label for="fd-imagem-arquivo">Foto de fundo</label><input type="file" id="fd-imagem-arquivo" accept="image/*"></div>' +
      '</div>' +
      '<div class="campo" id="fd-painel-cor" style="max-width:160px;margin-bottom:16px">' +
        '<label for="fd-cor">Cor sólida</label><input type="color" id="fd-cor" value="' + (fundo.cor || CORES_PADRAO_GRADIENTE[0]) + '">' +
      '</div>' +
      '<div id="fd-painel-gradiente" style="margin-bottom:16px">' +
        '<p class="ajuda" style="margin-bottom:8px">Marque até 4 cores — quanto mais marcadas, mais misturado fica o fundo.</p>' +
        '<div class="linha-campos">' + caixasCor + '</div>' +
      '</div>'
    );
  }

  function render(dados){
    var precos = dados.precos, acabamentos = dados.acabamentos, descontos = dados.descontosVolume,
        comercial = dados.comercial, perfil = dados.perfil;

    /* banco de quem já estava no ar antes da Fase 4 não tem "fundo" ainda —
       preenche com um valor vazio (tipo imagem, sem url) pra não quebrar:
       aplicarFundo() não faz nada com url vazia, então o visual padrão
       continua igual até a Anne escolher algo de propósito */
    perfil.fundo = perfil.fundo || { tipo: "imagem", url: "", cor: "", cores: [] };

    container.innerHTML =
      '<form class="painel-secao sticker" id="form-precos">' +
        '<h2>Preços</h2>' +
        '<h3>Cartoon</h3>' +
        '<div class="linha-campos">' +
          campoNum("pr-cartoon-perfil", "Perfil", precos.cartoon.perfil) +
          campoNum("pr-cartoon-cintura", "Cintura", precos.cartoon.cintura) +
          campoNum("pr-cartoon-inteiro", "Corpo inteiro", precos.cartoon.inteiro) +
          campoNum("pr-cartoon-dupla", "Dupla", precos.cartoon.dupla) +
        '</div>' +
        '<h3>Chibi</h3>' +
        '<div class="linha-campos">' +
          campoNum("pr-chibi-perfil", "Perfil", precos.chibi.perfil) +
          campoNum("pr-chibi-cintura", "Cintura", precos.chibi.cintura) +
          campoNum("pr-chibi-inteiro", "Corpo inteiro", precos.chibi.inteiro) +
          campoNum("pr-chibi-dupla", "Dupla", precos.chibi.dupla) +
        '</div>' +
        statusHtml() +
        '<button class="cta pequeno" type="submit">Salvar preços</button>' +
      '</form>' +

      '<form class="painel-secao sticker" id="form-acabamentos">' +
        '<h2>Acabamentos</h2>' +
        '<p class="ajuda" style="margin-bottom:14px">O nome aparece nos botões da calculadora; o fator multiplica o preço (1 = preço cheio, 0.6 = 60% do preço).</p>' +
        acabamentos.map(function(a, i){
          return '<div class="linha-campos">' +
            '<div class="campo" style="flex:2"><label for="ac-nome-' + i + '">Nome (' + escapeHtml(a.id) + ')</label>' +
              '<input type="text" id="ac-nome-' + i + '" value="' + escapeHtml(a.nome) + '"></div>' +
            campoNum("ac-fator-" + i, "Fator", a.fator) +
          '</div>';
        }).join("") +
        statusHtml() +
        '<button class="cta pequeno" type="submit">Salvar acabamentos</button>' +
      '</form>' +

      '<form class="painel-secao sticker" id="form-descontos">' +
        '<h2>Descontos de volume</h2>' +
        '<p class="ajuda" style="margin-bottom:14px">A partir de quantas artes no pedido, e quanto de desconto.</p>' +
        descontos.map(function(d, i){
          return '<div class="linha-campos">' +
            campoNum("de-min-" + i, "A partir de (artes)", d.min) +
            campoNum("de-pct-" + i, "Desconto (%)", d.pct) +
          '</div>';
        }).join("") +
        statusHtml() +
        '<button class="cta pequeno" type="submit">Salvar descontos</button>' +
      '</form>' +

      '<form class="painel-secao sticker" id="form-comercial">' +
        '<h2>Uso comercial</h2>' +
        '<div class="linha-campos">' +
          campoNum("co-pct", "Acréscimo (%)", comercial.pct) +
          campoNum("co-min", "Mínimo pra capa de livro (R$)", comercial.minimoCapaLivro) +
        '</div>' +
        statusHtml() +
        '<button class="cta pequeno" type="submit">Salvar</button>' +
      '</form>' +

      '<form class="painel-secao sticker" id="form-perfil">' +
        '<h2>Perfil</h2>' +
        '<div class="upload-imagem" style="margin-bottom:16px">' +
          (perfil.avatar_url
            ? '<img class="preview-atual" id="pe-avatar-preview" src="' + escapeHtml(perfil.avatar_url) + '" alt="Avatar atual">'
            : '<span class="preview-vazia" id="pe-avatar-preview">sem foto</span>') +
          '<div class="campo" style="flex:1;min-width:180px">' +
            '<label for="pe-avatar-arquivo">Trocar avatar</label>' +
            '<input type="file" id="pe-avatar-arquivo" accept="image/*">' +
          '</div>' +
        '</div>' +
        '<div class="campo"><label for="pe-instagram">Usuário do Instagram (sem @)</label><input type="text" id="pe-instagram" value="' + escapeHtml(perfil.instagram) + '"></div>' +
        '<div class="campo"><label for="pe-whatsapp">WhatsApp (só números, com DDI+DDD — vazio usa a DM do Instagram)</label><input type="text" id="pe-whatsapp" value="' + escapeHtml(perfil.whatsapp) + '"></div>' +
        fundoSecaoHtml(perfil.fundo) +
        statusHtml() +
        '<button class="cta pequeno" type="submit">Salvar perfil</button>' +
      '</form>';

    ligarSubmit(container.querySelector("#form-precos"), function(){
      return {
        cartoon: {
          perfil: Number(byId("pr-cartoon-perfil").value), cintura: Number(byId("pr-cartoon-cintura").value),
          inteiro: Number(byId("pr-cartoon-inteiro").value), dupla: Number(byId("pr-cartoon-dupla").value)
        },
        chibi: {
          perfil: Number(byId("pr-chibi-perfil").value), cintura: Number(byId("pr-chibi-cintura").value),
          inteiro: Number(byId("pr-chibi-inteiro").value), dupla: Number(byId("pr-chibi-dupla").value)
        }
      };
    }, "precos");

    ligarSubmit(container.querySelector("#form-acabamentos"), function(){
      return acabamentos.map(function(a, i){
        return { id: a.id, nome: byId("ac-nome-" + i).value, fator: Number(byId("ac-fator-" + i).value) };
      });
    }, "acabamentos");

    ligarSubmit(container.querySelector("#form-descontos"), function(){
      return descontos.map(function(d, i){
        return { min: Number(byId("de-min-" + i).value), pct: Number(byId("de-pct-" + i).value) };
      });
    }, "descontosVolume");

    ligarSubmit(container.querySelector("#form-comercial"), function(){
      return { pct: Number(byId("co-pct").value), minimoCapaLivro: Number(byId("co-min").value) };
    }, "comercial");

    var formPerfil = container.querySelector("#form-perfil");

    /* === fundo: prévia ao vivo no próprio painel + troca dos 3 painéis === */

    function tipoFundoSelecionado(){
      var marcado = formPerfil.querySelector('input[name="fd-tipo"]:checked');
      return marcado ? marcado.value : "imagem";
    }

    function fundoAtualDoForm(){
      var tipo = tipoFundoSelecionado();
      if (tipo === "cor") return { tipo: "cor", cor: byId("fd-cor").value };
      if (tipo === "gradiente"){
        return {
          tipo: "gradiente",
          cores: [0, 1, 2, 3]
            .filter(function(i){ return byId("fd-grad-on-" + i).checked; })
            .map(function(i){ return byId("fd-grad-" + i).value; })
        };
      }
      var arquivo = byId("fd-imagem-arquivo").files[0];
      return { tipo: "imagem", url: arquivo ? URL.createObjectURL(arquivo) : (perfil.fundo.url || "") };
    }

    function atualizarFundoPainel(){
      var tipo = tipoFundoSelecionado();
      byId("fd-painel-imagem").hidden = tipo !== "imagem";
      byId("fd-painel-cor").hidden = tipo !== "cor";
      byId("fd-painel-gradiente").hidden = tipo !== "gradiente";
      if (typeof aplicarFundo === "function") aplicarFundo(fundoAtualDoForm(), document.body);
    }

    formPerfil.querySelectorAll('input[name="fd-tipo"], #fd-cor').forEach(function(el){
      el.addEventListener("change", atualizarFundoPainel);
      el.addEventListener("input", atualizarFundoPainel);
    });
    [0, 1, 2, 3].forEach(function(i){
      byId("fd-grad-on-" + i).addEventListener("change", atualizarFundoPainel);
      byId("fd-grad-" + i).addEventListener("input", atualizarFundoPainel);
    });
    byId("fd-imagem-arquivo").addEventListener("change", function(){
      var arquivo = byId("fd-imagem-arquivo").files[0];
      if (arquivo){
        byId("fd-imagem-preview").outerHTML =
          '<img class="preview-atual" id="fd-imagem-preview" src="' + URL.createObjectURL(arquivo) + '" alt="">';
      }
      atualizarFundoPainel();
    });
    atualizarFundoPainel();

    formPerfil.addEventListener("submit", function(e){
      e.preventDefault();
      var botao = formPerfil.querySelector('button[type="submit"]');
      var arquivoAvatar = byId("pe-avatar-arquivo").files[0];
      var arquivoFundo = byId("fd-imagem-arquivo").files[0];
      var tipoFundo = tipoFundoSelecionado();
      botao.disabled = true;

      Promise.all([
        arquivoAvatar ? authSubirImagem("perfil", arquivoAvatar) : Promise.resolve(perfil.avatar_url),
        (tipoFundo === "imagem" && arquivoFundo) ? authSubirImagem("perfil", arquivoFundo) : Promise.resolve(perfil.fundo.url || "")
      ]).then(function(urls){
        var avatarUrl = urls[0];
        var fundo = tipoFundo === "cor" ? { tipo: "cor", cor: byId("fd-cor").value }
          : tipoFundo === "gradiente" ? {
              tipo: "gradiente",
              cores: [0, 1, 2, 3]
                .filter(function(i){ return byId("fd-grad-on-" + i).checked; })
                .map(function(i){ return byId("fd-grad-" + i).value; })
            }
          : { tipo: "imagem", url: urls[1] };

        return salvarConfiguracao("perfil", {
          avatar_url: avatarUrl,
          fundo: fundo,
          instagram: byId("pe-instagram").value.trim(),
          whatsapp: byId("pe-whatsapp").value.trim()
        }).then(function(){
          perfil.avatar_url = avatarUrl;
          perfil.fundo = fundo;
        });
      })
        .then(function(){ mostrarStatus(formPerfil, true, "Salvo!"); })
        .catch(function(erro){ mostrarStatus(formPerfil, false, "Erro ao salvar: " + erro.message); })
        .then(function(){ botao.disabled = false; });
    });
  }

  function byId(id){ return container.querySelector("#" + id); }
}
