(function(){
  "use strict";

  var st = { tipo:"individual", estilo:"cartoon", enq:"inteiro", extras:0, comercial:false };

  var $  = function(s){ return document.querySelector(s); };
  var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var brl = function(n){ return "R$ " + n.toFixed(2).replace(".", ","); };
  var precoExtra = function(){ return PRECOS[st.estilo].extra[st.enq] || 0; };

  function calcular(){
    var p = PRECOS[st.estilo], itens = [], base = 0;

    if (st.tipo === "cenario"){
      return { consulta:true, itens:[{ l:"Cenário / ilustração (" + NOMES.estilo[st.estilo] + ")", v:"a combinar" }] };
    }
    if (st.tipo === "dupla"){
      base = p.dupla;
      itens.push({ l:"Combo dupla " + NOMES.estilo[st.estilo] + " (2 personagens)", v:brl(base), de:p.duplaDe });
    } else {
      base = p[st.enq];
      itens.push({ l:NOMES.estilo[st.estilo] + " · " + NOMES.enq[st.enq], v:brl(base) });
      if (st.extras > 0){
        var ex = precoExtra() * st.extras;
        base += ex;
        itens.push({ l:st.extras + (st.extras > 1 ? " personagens extras" : " personagem extra"), v:brl(ex) });
      }
    }
    var total = base;
    if (st.comercial){
      var taxa = base * 0.5;
      total = base + taxa;
      itens.push({ l:"Uso comercial (+50%)", v:brl(taxa) });
    }
    return { consulta:false, total:total, itens:itens };
  }

  function resumo(r){
    var L = ["Oi, Anne! Montei uma encomenda no seu site:", ""];
    r.itens.forEach(function(i){ L.push("• " + i.l + " — " + i.v); });
    L.push("", r.consulta ? "Total: a combinar com você" : "Total: " + brl(r.total), "", "Pode me passar o prazo?");
    return L.join("\n");
  }

  function chaveExemplo(){
    if (st.tipo === "cenario") return "cenario";
    if (st.tipo === "dupla") return st.estilo + "_dupla";
    return st.estilo;
  }

  function render(){
    var indiv = st.tipo === "individual";
    $("#step-enq").hidden = !indiv;
    $("#step-extras").hidden = !indiv || st.enq === "perfil";

    $$('[data-group="enq"]').forEach(function(b){
      var pz = b.querySelector(".pz");
      if (pz) pz.textContent = brl(PRECOS[st.estilo][b.dataset.value]);
    });
    $$(".chip").forEach(function(b){
      b.setAttribute("aria-pressed", String(st[b.dataset.group] === b.dataset.value));
    });

    $("#extra-count").textContent = String(st.extras);
    $("#minus").disabled = st.extras === 0;
    $("#plus").disabled  = st.extras >= 4;
    $("#extra-each").textContent = brl(precoExtra()) + " cada";
    $("#extra-hint").textContent = st.enq === "perfil" ? "" : "(no mesmo enquadramento)";

    /* preview com exemplo real */
    var k = chaveExemplo();
    var img = $("#pv-img");
    if (img.getAttribute("src") !== EX[k]){ img.src = EX[k]; }
    $("#pv-t").textContent = st.tipo === "cenario" ? "Cenário / ilustração"
      : st.tipo === "dupla" ? NOMES.estilo[st.estilo] + " · dupla"
      : NOMES.estilo[st.estilo] + " · " + NOMES.enq[st.enq].toLowerCase();
    $("#pv-d").textContent = DESC[k];

    var r = calcular();

    $("#receipt").innerHTML = r.itens.map(function(i){
      var de = i.de ? "<s>" + brl(i.de) + "</s> " : "";
      return '<div class="row"><span>' + i.l + "</span><span>" + de + i.v + "</span></div>";
    }).join("") + (
      r.consulta
        ? '<div class="row muted"><span>Depende do tamanho e da complexidade do cenário</span><span></span></div>'
        : (st.comercial && r.total < 120
            ? '<div class="row muted"><span>Se for capa de livro, o mínimo é R$ 120,00</span><span></span></div>'
            : "")
    );

    var tot = $("#total");
    if (r.consulta){ tot.textContent = "a combinar"; tot.classList.add("consulta"); }
    else { tot.innerHTML = brl(r.total).replace(" ", "&nbsp;"); tot.classList.remove("consulta"); }

    var href = CONFIG.whatsapp
      ? "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(resumo(r))
      : "https://ig.me/m/" + CONFIG.instagram;
    $("#cta-main").href = href;
    $("#cta-mid").href  = href;
    $("#cta-main").textContent = CONFIG.whatsapp ? "Fechar no WhatsApp" : "Fechar na DM";
    $("#cta-mid").textContent  = CONFIG.whatsapp ? "Chamar no WhatsApp" : "Chamar na DM";
  }

  $$(".chip").forEach(function(b){
    b.addEventListener("click", function(){
      st[b.dataset.group] = b.dataset.value;
      if (b.dataset.group === "enq" && b.dataset.value === "perfil") st.extras = 0;
      render();
    });
  });
  $("#plus").addEventListener("click",  function(){ if (st.extras < 4){ st.extras++; render(); } });
  $("#minus").addEventListener("click", function(){ if (st.extras > 0){ st.extras--; render(); } });
  $("#comercial").addEventListener("change", function(e){ st.comercial = e.target.checked; render(); });

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
    copiar(resumo(calcular()),
      function(){ btn.textContent = "Copiado!"; setTimeout(function(){ btn.textContent = antes; }, 1800); },
      function(){ btn.textContent = "Selecione o resumo acima"; setTimeout(function(){ btn.textContent = antes; }, 2600); });
  });

  /* na DM do Instagram não dá para pré-preencher: copiamos o resumo antes de sair */
  ["#cta-main", "#cta-mid"].forEach(function(sel){
    $(sel).addEventListener("click", function(){
      if (!CONFIG.whatsapp) copiar(resumo(calcular()), function(){}, function(){});
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

  render();
})();
