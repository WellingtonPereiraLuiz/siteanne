(function(){
  "use strict";

  var $  = function(s){ return document.querySelector(s); };
  var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var brl = function(n){ return "R$ " + n.toFixed(2).replace(".", ","); };
  var faixa = function(min, max){ return brl(min) + " a " + brl(max); };
  /* subtotal de item pode ser um número (personagem) ou {min,max} (cenário) —
     essa função escolhe o texto certo pros dois casos */
  var valorTexto = function(v){ return typeof v === "number" ? brl(v) : faixa(v.min, v.max); };

  var acabamentoPorId = function(id){ return DADOS.acabamentos.filter(function(a){ return a.id === id; })[0]; };
  var cenarioPorId    = function(id){ return DADOS.cenarios.filter(function(c){ return c.id === id; })[0]; };
  var nomeEstilo = function(id){ return id === "cartoon" ? "Cartoon" : "Chibi"; };
  var nomeEnquadramento = function(id){ return { perfil:"Perfil", cintura:"Cintura", inteiro:"Corpo inteiro" }[id]; };

  /* === estado === */
  var proximoId = 1;
  var pedido = { itens: [], comercial: false };
  var modoAtual = "personagem"; // "personagem" | "cenario" — qual aba está aberta
  var rascunhoPersonagem = { estilo:"cartoon", personagens:1, enquadramento:"inteiro", acabamento:"completo", quantidade:1 };
  var rascunhoCenario = { categoria:"vegetacao", acabamento:"completo", quantidade:1 };

  /* ===================== CÁLCULO ===================== */

  /* Preço de UM item, já multiplicado por acabamento e quantidade.
     Personagem devolve um número. Cenário devolve {min,max}, porque
     cenário nunca tem preço fechado — só uma faixa. */
  function precoItem(item){
    var fator = acabamentoPorId(item.acabamento).fator;
    if (item.tipo === "cenario"){
      var c = cenarioPorId(item.categoria);
      return { min: c.min * fator * item.quantidade, max: c.max * fator * item.quantidade };
    }
    var tabela = DADOS.precos[item.estilo];
    var base = item.personagens === 2 ? tabela.dupla : tabela[item.enquadramento];
    return base * fator * item.quantidade;
  }

  /* trata um número como uma "faixa" de tamanho zero, pra poder somar
     personagem (número) com cenário ({min,max}) sem precisar de dois
     caminhos de soma diferentes */
  function paraFaixa(v){ return typeof v === "number" ? { min:v, max:v } : v; }

  function calcularPedido(){
    var detalhes = pedido.itens.map(function(item){
      return { item: item, subtotal: precoItem(item) };
    });

    var somaQtd = pedido.itens.reduce(function(t, i){ return t + i.quantidade; }, 0);

    var somaBruta = detalhes.reduce(function(acc, d){
      var f = paraFaixa(d.subtotal);
      return { min: acc.min + f.min, max: acc.max + f.max };
    }, { min:0, max:0 });

    /* escolhe a faixa de desconto por volume: a de maior "min" que a
       quantidade total ainda alcança */
    var faixaAtual = DADOS.descontosVolume.reduce(function(melhor, f){
      return somaQtd >= f.min ? f : melhor;
    }, DADOS.descontosVolume[0]);

    var comDesconto = {
      min: somaBruta.min * (1 - faixaAtual.pct / 100),
      max: somaBruta.max * (1 - faixaAtual.pct / 100)
    };

    var comComercial = pedido.comercial
      ? { min: comDesconto.min * 1.5, max: comDesconto.max * 1.5 }
      : comDesconto;

    var temCenario = pedido.itens.some(function(i){ return i.tipo === "cenario"; });

    var proximaFaixa = DADOS.descontosVolume
      .filter(function(f){ return f.min > somaQtd; })
      .sort(function(a, b){ return a.min - b.min; })[0];

    return {
      detalhes: detalhes,
      somaQtd: somaQtd,
      pctAtual: faixaAtual.pct,
      proximaFaixa: proximaFaixa,
      temCenario: temCenario,
      somaBruta: somaBruta,
      descontoValor: { min: somaBruta.min - comDesconto.min, max: somaBruta.max - comDesconto.max },
      comercialValor: pedido.comercial ? { min: comComercial.min - comDesconto.min, max: comComercial.max - comDesconto.max } : null,
      /* sem cenário as duas pontas da faixa são iguais — devolve só um número */
      total: temCenario ? comComercial : comComercial.min
    };
  }

  /* transforma {min,max} num número só quando o pedido não tem cenário
     (nesse caso min === max sempre); usado pra formatar linhas do recibo */
  function exatoOuFaixa(range, temCenario){ return temCenario ? range : range.min; }

  function descricaoItem(item){
    if (item.tipo === "cenario"){
      return "Cenário: " + cenarioPorId(item.categoria).nome + " (" + acabamentoPorId(item.acabamento).nome + ")";
    }
    var meio = item.personagens === 2
      ? nomeEstilo(item.estilo) + " · dupla"
      : nomeEstilo(item.estilo) + " · " + nomeEnquadramento(item.enquadramento).toLowerCase();
    return meio + " (" + acabamentoPorId(item.acabamento).nome + ")";
  }

  function resumoTexto(){
    var calc = calcularPedido();
    var L = ["Oi, Anne! Montei um pedido no seu site:", ""];

    if (calc.detalhes.length === 0){
      L.push("(nenhum item ainda)");
    } else {
      calc.detalhes.forEach(function(d){
        L.push("• " + d.item.quantidade + "x " + descricaoItem(d.item) + " — " + valorTexto(d.subtotal));
      });
      L.push("");
      if (calc.pctAtual > 0){
        L.push("Desconto de volume (" + calc.pctAtual + "% sobre " + calc.somaQtd + (calc.somaQtd === 1 ? " arte" : " artes") + ")");
      }
      if (pedido.comercial){
        L.push("Uso comercial: +50%");
      }
      L.push("");
      L.push(calc.temCenario
        ? "Total estimado: " + valorTexto(calc.total) + " — valor final fechado na conversa"
        : "Total: " + valorTexto(calc.total));
    }
    L.push("", "Pode me passar o prazo?");
    return L.join("\n");
  }

  /* ===================== RENDER ===================== */

  function renderTabs(){
    $("#tab-personagem").setAttribute("aria-selected", String(modoAtual === "personagem"));
    $("#tab-cenario").setAttribute("aria-selected", String(modoAtual === "cenario"));
    $("#config-personagem").hidden = modoAtual !== "personagem";
    $("#config-cenario").hidden = modoAtual !== "cenario";
  }

  function renderChipsEstaticos(){
    $$('.chip[data-grupo="estilo"]').forEach(function(b){
      b.setAttribute("aria-pressed", String(b.dataset.valor === rascunhoPersonagem.estilo));
    });
    $$('.chip[data-grupo="personagens"]').forEach(function(b){
      b.setAttribute("aria-pressed", String(Number(b.dataset.valor) === rascunhoPersonagem.personagens));
    });
    $$('.chip[data-grupo="enquadramento"]').forEach(function(b){
      b.setAttribute("aria-pressed", String(b.dataset.valor === rascunhoPersonagem.enquadramento));
      var pz = b.querySelector(".pz");
      if (pz) pz.textContent = brl(DADOS.precos[rascunhoPersonagem.estilo][b.dataset.valor]);
    });
    $("#step-enquadramento").hidden = rascunhoPersonagem.personagens === 2;
  }

  /* chips de acabamento e cartões de cenário vêm de DADOS, não do HTML —
     assim, se um dia mudar a lista (ex.: adicionar um 4º acabamento), o
     HTML nem precisa ser tocado */
  function renderAcabamentos(){
    function chipsHtml(valorAtual, grupo){
      return DADOS.acabamentos.map(function(a){
        return '<button type="button" class="chip" data-grupo="' + grupo + '" data-valor="' + a.id + '" aria-pressed="' +
          (a.id === valorAtual) + '">' + a.nome + '</button>';
      }).join("");
    }
    $('[data-chips-acabamento="personagem"]').innerHTML = chipsHtml(rascunhoPersonagem.acabamento, "acabamento-personagem");
    $('[data-chips-acabamento="cenario"]').innerHTML = chipsHtml(rascunhoCenario.acabamento, "acabamento-cenario");
  }

  function renderCenarioCards(){
    $("#cenario-cards").innerHTML = DADOS.cenarios.map(function(c){
      return '<button type="button" class="cenario-card" data-valor="' + c.id + '" aria-pressed="' + (c.id === rascunhoCenario.categoria) + '">' +
        '<span class="nome">' + c.nome + '</span>' +
        '<span class="desc">' + c.desc + '</span>' +
        '<span class="faixa">' + faixa(c.min, c.max) + '</span>' +
      '</button>';
    }).join("");
  }

  function renderQuantidades(){
    $("#qtd-personagem").textContent = String(rascunhoPersonagem.quantidade);
    $('[data-draft-menos="personagem"]').disabled = rascunhoPersonagem.quantidade <= 1;
    $('[data-draft-mais="personagem"]').disabled  = rascunhoPersonagem.quantidade >= 20;

    $("#qtd-cenario").textContent = String(rascunhoCenario.quantidade);
    $('[data-draft-menos="cenario"]').disabled = rascunhoCenario.quantidade <= 1;
    $('[data-draft-mais="cenario"]').disabled  = rascunhoCenario.quantidade >= 20;
  }

  function chaveExemplo(){
    return rascunhoPersonagem.estilo + (rascunhoPersonagem.personagens === 2 ? "_dupla" : "");
  }

  function renderPreview(){
    var ex = EXEMPLOS[chaveExemplo()];
    var img = $("#pv-img");
    if (img.getAttribute("src") !== ex.img) img.src = ex.img;
    $("#pv-t").textContent = rascunhoPersonagem.personagens === 2
      ? nomeEstilo(rascunhoPersonagem.estilo) + " · dupla"
      : nomeEstilo(rascunhoPersonagem.estilo) + " · " + nomeEnquadramento(rascunhoPersonagem.enquadramento).toLowerCase();
    $("#pv-d").textContent = ex.desc;
  }

  function renderDraftPrecos(){
    var itemPersonagem = {
      tipo:"personagem", estilo:rascunhoPersonagem.estilo, personagens:rascunhoPersonagem.personagens,
      enquadramento:rascunhoPersonagem.enquadramento, acabamento:rascunhoPersonagem.acabamento, quantidade:rascunhoPersonagem.quantidade
    };
    $("#preco-personagem").textContent = "= " + valorTexto(precoItem(itemPersonagem));

    var itemCenario = {
      tipo:"cenario", categoria:rascunhoCenario.categoria, acabamento:rascunhoCenario.acabamento, quantidade:rascunhoCenario.quantidade
    };
    $("#preco-cenario").textContent = "= " + valorTexto(precoItem(itemCenario));
  }

  function textoAvisoDesconto(calc){
    var txt = calc.somaQtd + (calc.somaQtd === 1 ? " arte" : " artes") + " no pedido";
    if (calc.pctAtual > 0) txt += " — " + calc.pctAtual + "% de desconto aplicado";
    if (calc.proximaFaixa){
      var faltam = calc.proximaFaixa.min - calc.somaQtd;
      txt += " · adicione mais " + faltam + (faltam === 1 ? " arte" : " artes") + " e ganhe " + calc.proximaFaixa.pct + "%";
    }
    return txt;
  }

  function row(label, valor){
    return '<div class="row"><span>' + label + '</span><span>' + valor + '</span></div>';
  }

  function renderReceipt(calc){
    var linhas = [];
    linhas.push(row(
      "Subtotal (" + calc.somaQtd + (calc.somaQtd === 1 ? " arte" : " artes") + ")",
      valorTexto(exatoOuFaixa(calc.somaBruta, calc.temCenario))
    ));
    if (calc.pctAtual > 0){
      linhas.push(row("Desconto de volume (" + calc.pctAtual + "%)", "&minus; " + valorTexto(exatoOuFaixa(calc.descontoValor, calc.temCenario))));
    }
    if (calc.comercialValor){
      linhas.push(row("Uso comercial (+50%)", valorTexto(exatoOuFaixa(calc.comercialValor, calc.temCenario))));
    }
    var comparar = calc.temCenario ? calc.total.max : calc.total;
    if (pedido.comercial && comparar < DADOS.comercial.minimoCapaLivro){
      linhas.push('<div class="row muted"><span>Se for capa de livro, o mínimo é ' + brl(DADOS.comercial.minimoCapaLivro) + '</span><span></span></div>');
    }
    $("#receipt").innerHTML = linhas.join("");
  }

  function renderItens(calc){
    var vazio = pedido.itens.length === 0;
    $("#pedido-vazio").hidden = !vazio;
    $("#lista-itens").hidden = vazio;
    $("#desconto-aviso").hidden = vazio;
    $("#linha-comercial").hidden = vazio;
    $("#receipt").hidden = vazio;
    if (vazio) return;

    $("#lista-itens").innerHTML = calc.detalhes.map(function(d){
      return '<div class="item-pedido" data-id="' + d.item.id + '">' +
        '<span class="info">' +
          '<span class="desc">' + d.item.quantidade + 'x ' + descricaoItem(d.item) + '</span>' +
          '<span class="valor">' + valorTexto(d.subtotal) + '</span>' +
        '</span>' +
        '<span class="acoes">' +
          '<span class="stepper">' +
            '<button type="button" data-item-acao="menos" aria-label="Diminuir quantidade"' + (d.item.quantidade <= 1 ? ' disabled' : '') + '>&minus;</button>' +
            '<output>' + d.item.quantidade + '</output>' +
            '<button type="button" data-item-acao="mais" aria-label="Aumentar quantidade"' + (d.item.quantidade >= 20 ? ' disabled' : '') + '>+</button>' +
          '</span>' +
          '<button type="button" class="item-remover" data-item-acao="remover" aria-label="Remover item">&times;</button>' +
        '</span>' +
      '</div>';
    }).join("");

    $("#desconto-aviso").textContent = textoAvisoDesconto(calc);
    renderReceipt(calc);
  }

  function renderBarra(calc){
    var tot = $("#total");
    if (pedido.itens.length === 0){
      tot.textContent = "R$ 0,00";
      tot.classList.remove("consulta");
    } else if (calc.temCenario){
      tot.innerHTML = valorTexto(calc.total);
      tot.classList.add("consulta");
    } else {
      tot.innerHTML = brl(calc.total).replace(" ", "&nbsp;");
      tot.classList.remove("consulta");
    }
  }

  function renderCtas(){
    var vazio = pedido.itens.length === 0;
    var href = CONFIG.whatsapp
      ? "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(resumoTexto())
      : "https://ig.me/m/" + CONFIG.instagram;
    $("#cta-main").href = href;
    $("#cta-mid").href  = href;
    $("#cta-main").setAttribute("aria-disabled", String(vazio));
    $("#cta-mid").setAttribute("aria-disabled", String(vazio));
    $("#cta-main").textContent = CONFIG.whatsapp ? "Fechar no WhatsApp" : "Fechar na DM";
    $("#cta-mid").textContent  = CONFIG.whatsapp ? "Chamar no WhatsApp" : "Chamar na DM";
  }

  function render(){
    renderTabs();
    renderChipsEstaticos();
    renderAcabamentos();
    renderCenarioCards();
    renderQuantidades();
    renderPreview();
    renderDraftPrecos();
    var calc = calcularPedido();
    renderItens(calc);
    renderBarra(calc);
    renderCtas();
  }

  /* ===================== EVENTOS ===================== */

  /* chips, cartão de cenário e abas usam UM listener só (delegação),
     porque os chips de acabamento e os cartões de cenário são recriados
     a cada render() — um addEventListener direto neles se perderia */
  document.addEventListener("click", function(e){
    var tab = e.target.closest(".tab[data-modo]");
    if (tab){ modoAtual = tab.dataset.modo; render(); return; }

    var chip = e.target.closest(".chip[data-grupo]");
    if (chip){
      var grupo = chip.dataset.grupo, valor = chip.dataset.valor;
      if (grupo === "estilo") rascunhoPersonagem.estilo = valor;
      else if (grupo === "personagens") rascunhoPersonagem.personagens = Number(valor);
      else if (grupo === "enquadramento") rascunhoPersonagem.enquadramento = valor;
      else if (grupo === "acabamento-personagem") rascunhoPersonagem.acabamento = valor;
      else if (grupo === "acabamento-cenario") rascunhoCenario.acabamento = valor;
      render();
      return;
    }

    var card = e.target.closest(".cenario-card[data-valor]");
    if (card){ rascunhoCenario.categoria = card.dataset.valor; render(); return; }

    var itemBtn = e.target.closest("[data-item-acao]");
    if (itemBtn){
      var id = Number(itemBtn.closest(".item-pedido").dataset.id);
      var acao = itemBtn.dataset.itemAcao;
      if (acao === "remover"){
        pedido.itens = pedido.itens.filter(function(i){ return i.id !== id; });
      } else {
        var item = pedido.itens.filter(function(i){ return i.id === id; })[0];
        if (item){
          if (acao === "mais" && item.quantidade < 20) item.quantidade++;
          if (acao === "menos" && item.quantidade > 1) item.quantidade--;
        }
      }
      render();
      return;
    }
  });

  $('[data-draft-mais="personagem"]').addEventListener("click", function(){
    if (rascunhoPersonagem.quantidade < 20){ rascunhoPersonagem.quantidade++; render(); }
  });
  $('[data-draft-menos="personagem"]').addEventListener("click", function(){
    if (rascunhoPersonagem.quantidade > 1){ rascunhoPersonagem.quantidade--; render(); }
  });
  $('[data-draft-mais="cenario"]').addEventListener("click", function(){
    if (rascunhoCenario.quantidade < 20){ rascunhoCenario.quantidade++; render(); }
  });
  $('[data-draft-menos="cenario"]').addEventListener("click", function(){
    if (rascunhoCenario.quantidade > 1){ rascunhoCenario.quantidade--; render(); }
  });

  $("#add-personagem").addEventListener("click", function(){
    pedido.itens.push({
      id: proximoId++,
      tipo: "personagem",
      estilo: rascunhoPersonagem.estilo,
      personagens: rascunhoPersonagem.personagens,
      enquadramento: rascunhoPersonagem.enquadramento,
      acabamento: rascunhoPersonagem.acabamento,
      quantidade: rascunhoPersonagem.quantidade
    });
    rascunhoPersonagem.quantidade = 1;
    render();
  });

  $("#add-cenario").addEventListener("click", function(){
    pedido.itens.push({
      id: proximoId++,
      tipo: "cenario",
      categoria: rascunhoCenario.categoria,
      acabamento: rascunhoCenario.acabamento,
      quantidade: rascunhoCenario.quantidade
    });
    rascunhoCenario.quantidade = 1;
    render();
  });

  $("#comercial").addEventListener("change", function(e){ pedido.comercial = e.target.checked; render(); });

  function copiar(txt, ok, falhou){
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(ok, tenta);
    } else { tenta(); }
    function tenta(){
      var ta = document.createElement("textarea");
      ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch(e){ if (falhou) falhou(); }
      document.body.removeChild(ta);
    }
  }

  $("#copiar").addEventListener("click", function(){
    var btn = this, antes = "Copiar resumo";
    copiar(resumoTexto(),
      function(){ btn.textContent = "Copiado!"; setTimeout(function(){ btn.textContent = antes; }, 1800); },
      function(){ btn.textContent = "Selecione o resumo acima"; setTimeout(function(){ btn.textContent = antes; }, 2600); });
  });

  /* na DM do Instagram não dá para pré-preencher: copiamos o resumo antes de sair */
  ["#cta-main", "#cta-mid"].forEach(function(sel){
    $(sel).addEventListener("click", function(e){
      if (pedido.itens.length === 0){ e.preventDefault(); return; }
      if (!CONFIG.whatsapp) copiar(resumoTexto(), function(){}, function(){});
    });
  });

  /* tabelas em tamanho grande */
  var lb = $("#lb");
  $$(".sheets button").forEach(function(b){
    b.addEventListener("click", function(){
      $("#lb-img").src = b.dataset.full;
      $("#lb-img").alt = b.querySelector("img").alt;
      if (lb.showModal) lb.showModal();
    });
  });
  if (lb){
    lb.querySelector(".close").addEventListener("click", function(){ lb.close(); });
    lb.addEventListener("click", function(e){ if (e.target === lb || e.target.id === "lb-img") lb.close(); });
  }

  /* espera CONFIG/DADOS chegarem do Supabase (ver js/dados.js) antes do
     primeiro desenho — os cliques nos chips/cartões chamam render() de
     novo depois, e a essa altura os dados já estarão prontos */
  DADOS_PRONTO.then(render).catch(function(erro){ console.error(erro); });
})();
