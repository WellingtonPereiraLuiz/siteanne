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

  /* Grade simples de miniaturas — clicar abre maior no lightbox compartilhado
     (js/lightbox.js, mesmo <dialog id="lb"> usado pelas tabelas de preço da
     página de orçamento). */
  function galeriaHtml(nome, imagens){
    if (!imagens.length) return "";
    return '<div class="fim-galeria">' + imagens.map(function(im){
      return '<button type="button" class="fim-galeria-item" data-full="' + im.url + '" data-alt="Foto de ' + nome + '">' +
        '<img src="' + im.url + '" alt="" loading="lazy">' +
      '</button>';
    }).join("") + '</div>';
  }

  function renderPersonagens(lista){
    var ordenados = lista.slice().sort(function(a, b){ return a.ordem - b.ordem; });

    $("#fim-personagens").innerHTML = ordenados.map(function(p){
      var imagens = p.imagens.slice().sort(function(a, b){ return a.ordem - b.ordem; });
      return '<details class="fim-personagem">' +
        '<summary>' + p.nome + '</summary>' +
        '<div class="fim-personagem-corpo">' +
          '<div class="fim-personagem-arte">' +
            imgOuPlaceholder(p.imgUrl, "Arte de " + p.nome, "arte de " + p.nome + " — preencha a foto principal no painel", true) +
          '</div>' +
          '<p class="fim-personagem-desc">' + p.descricao + '</p>' +
          galeriaHtml(p.nome, imagens) +
        '</div>' +
      '</details>';
    }).join("");
  }

  /*
   * A sinopse, os links, os personagens e as fotos de cada um moram no
   * Supabase (tabelas "obra", "personagens" e "personagem_imagens" — ver
   * supabase/schema.sql). "obra" guarda tudo em pares chave/valor (mesmo
   * formato de "configuracao" em js/dados.js), então primeiro vira um
   * objeto por chave pra ficar fácil de ler; "personagem_imagens" vira um
   * mapa por personagem_id, pra cada personagem já sair com sua galeria
   * pronta.
   */
  Promise.all([
    supaSelect("obra", "select=chave,valor"),
    supaSelect("personagens", "select=id,nome,descricao,img_url,ordem&order=ordem"),
    supaSelect("personagem_imagens", "select=personagem_id,url,ordem&order=ordem")
  ]).then(function(resultados){
    var obraLinhas = resultados[0];
    var personagensLinhas = resultados[1];
    var imagensLinhas = resultados[2];

    var obraPorChave = {};
    obraLinhas.forEach(function(l){ obraPorChave[l.chave] = l.valor; });

    var imagensPorPersonagem = {};
    imagensLinhas.forEach(function(im){
      (imagensPorPersonagem[im.personagem_id] = imagensPorPersonagem[im.personagem_id] || []).push(im);
    });

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
        imgUrl: p.img_url,
        ordem: p.ordem,
        imagens: imagensPorPersonagem[p.id] || []
      };
    });

    renderHero(obra);
    renderCtas(links);
    renderPersonagens(personagens);
  }).catch(function(erro){ console.error(erro); });
})();
