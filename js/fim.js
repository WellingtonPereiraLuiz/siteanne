(function(){
  "use strict";

  var $ = function(s){ return document.querySelector(s); };

  /* Caixa tracejada mostrada no lugar de uma imagem que ainda não existe —
     evita ícone de imagem quebrada e já avisa o que falta preencher. */
  function placeholder(texto){
    return '<div class="fim-ph"><span>' + texto + '</span></div>';
  }

  /* As caixas de imagem têm tamanho fixo via CSS (como .avatar e .preview .ph
     já fazem no resto do site), então não precisamos saber a largura/altura
     real do arquivo — a imagem entra e a caixa recorta com object-fit. */
  function imgOuPlaceholder(src, alt, textoPlaceholder, lazy){
    if (!src) return placeholder(textoPlaceholder);
    return '<img src="' + src + '" alt="' + alt + '"' + (lazy ? ' loading="lazy"' : '') + '>';
  }

  function renderHero(obra){
    $("#fim-capa").innerHTML = imgOuPlaceholder(
      obra.capa,
      "Capa de " + obra.titulo,
      "espaço da capa — preencha a chave \"capa\" na tabela obra do Supabase",
      false /* capa aparece sem rolar a página, por isso não é lazy */
    );
    $("#fim-titulo").textContent = obra.titulo;
    $("#fim-gancho").textContent = obra.gancho;
    $("#fim-sinopse").textContent = obra.sinopse;
    $("#fim-apoio-texto").textContent = obra.apoioTexto;
  }

  /* Liga um botão grande a um link. Se o link ainda estiver vazio, o botão
     fica visível (o pedido era "não pode ficar escondido") mas esmaecido e
     sem clique, pra ninguém publicar um link morto. */
  function ligarCta(seletor, url){
    var a = $(seletor);
    if (url){
      a.href = url;
      a.removeAttribute("aria-disabled");
    } else {
      a.href = "#";
      a.setAttribute("aria-disabled", "true");
    }
  }

  function renderCtas(links){
    ligarCta("#fim-cta-tapas", links.tapas);
    ligarCta("#fim-cta-webtoon", links.webtoon);
    ligarCta("#fim-cta-apoiase", links.apoiase);
  }

  function renderPersonagens(lista){
    var ordenados = lista.slice().sort(function(a, b){ return a.ordem - b.ordem; });

    $("#fim-personagens").innerHTML = ordenados.map(function(p){
      return '<details class="fim-personagem">' +
        '<summary>' + p.nome + '</summary>' +
        '<div class="fim-personagem-corpo">' +
          '<div class="fim-personagem-arte">' +
            imgOuPlaceholder(p.img, "Arte de " + p.nome, "arte de " + p.nome + " — preencha img_url na tabela personagens", true) +
          '</div>' +
          '<p class="fim-personagem-desc">' + p.descricao + '</p>' +
          '<div class="fim-mudancas">' +
            '<h3>As mudanças</h3>' +
            '<p>' + p.mudancas + '</p>' +
            '<div class="fim-compare">' +
              '<div class="fim-compare-item">' +
                '<span class="fim-compare-label">antes</span>' +
                imgOuPlaceholder(p.imgAntiga, "Versão antiga de " + p.nome, "versão antiga — preencha img_antiga_url", true) +
              '</div>' +
              '<div class="fim-compare-item">' +
                '<span class="fim-compare-label">agora</span>' +
                imgOuPlaceholder(p.img, "Versão atual de " + p.nome, "versão atual — preencha img_url", true) +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</details>';
    }).join("");
  }

  /*
   * A sinopse, os links e os personagens moram no Supabase (tabelas "obra"
   * e "personagens" — ver supabase/schema.sql). "obra" guarda tudo em
   * pares chave/valor (mesmo formato de "configuracao" em js/dados.js),
   * então primeiro vira um objeto por chave pra ficar fácil de ler.
   */
  Promise.all([
    supaSelect("obra", "select=chave,valor"),
    supaSelect("personagens", "select=nome,descricao,mudancas,img_url,img_antiga_url,ordem&order=ordem")
  ]).then(function(resultados){
    var obraLinhas = resultados[0];
    var personagensLinhas = resultados[1];

    var obraPorChave = {};
    obraLinhas.forEach(function(l){ obraPorChave[l.chave] = l.valor; });

    var obra = {
      titulo: obraPorChave.titulo || "",
      gancho: obraPorChave.gancho || "",
      sinopse: obraPorChave.sinopse || "",
      apoioTexto: obraPorChave.apoio_texto || "",
      capa: obraPorChave.capa || ""
    };
    var links = {
      tapas: obraPorChave.link_tapas || "",
      webtoon: obraPorChave.link_webtoon || "",
      apoiase: obraPorChave.link_apoiase || ""
    };
    var personagens = personagensLinhas.map(function(p){
      return {
        nome: p.nome,
        descricao: p.descricao,
        mudancas: p.mudancas,
        img: p.img_url,
        imgAntiga: p.img_antiga_url,
        ordem: p.ordem
      };
    });

    renderHero(obra);
    renderCtas(links);
    renderPersonagens(personagens);
  }).catch(function(erro){ console.error(erro); });
})();
