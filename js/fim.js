(function(){
  "use strict";

  /*
   * Toda a sinopse, os personagens e os links moram aqui — igual à regra do
   * DADOS na página de orçamento. Na Fase 3 isso vira uma consulta ao
   * Supabase, então nenhum texto de personagem pode ficar escrito direto no
   * HTML: se mudar aqui, a página inteira acompanha sozinha.
   *
   * Tudo marcado com [texto de exemplo] é só pra preencher a página — troque
   * pelo texto de verdade da Anne quando ela mandar.
   */
  var DADOS = {
    obra: {
      titulo: "Fim Anti-Herói",
      gancho: "[texto de exemplo] Um herói que não escolheu ser herói, numa história que também não escolheu.",
      sinopse: "[texto de exemplo] Aqui entra a sinopse de verdade, escrita pela Anne — de onde vem o Finn, o que ele quer, e o que o empurra pra dentro da própria história. Pode ter mais de um parágrafo; o texto quebra normalmente conforme o tamanho da tela.",
      apoioTexto: "[texto de exemplo] Quem apoia no Apoia.se recebe conteúdo em primeira mão, acompanha os bastidores do processo e ajuda a Anne a continuar desenhando a HQ.",
      capa: "" // TODO: solte o arquivo em assets/ (ex.: "assets/fim-capa.webp") e cole o caminho aqui
    },
    links: {
      tapas:   "", // TODO: cole aqui a URL da obra no Tapas
      webtoon: "", // TODO: cole aqui a URL da obra no Webtoon
      apoiase: ""  // TODO: cole aqui a URL do Apoia.se
    },
    personagens: [
      {
        id: "finn",
        nome: "Finn",
        descricao: "[texto de exemplo] Descrição curta do protagonista — quem ele é, o que ele quer, e o que marca o visual dele.",
        mudancas: "[texto de exemplo] Como o design do Finn mudou desde a primeira versão até a atual — traço, cores, roupa, o que for relevante.",
        img: "",       // TODO: "assets/finn.webp" — arte atual do personagem
        imgAntiga: "", // TODO: "assets/finn-antigo.webp" — versão antiga, pro comparativo
        ordem: 1
      },
      {
        id: "personagem-2",
        nome: "[nome do 2º personagem — exemplo]",
        descricao: "[texto de exemplo] Descrição curta do segundo personagem.",
        mudancas: "[texto de exemplo] Evolução do design deste personagem.",
        img: "",
        imgAntiga: "",
        ordem: 2
      }
    ]
  };

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

  function renderHero(){
    $("#fim-capa").innerHTML = imgOuPlaceholder(
      DADOS.obra.capa,
      "Capa de " + DADOS.obra.titulo,
      "espaço da capa — solte o arquivo em assets/ e preencha DADOS.obra.capa em js/fim.js",
      false /* capa aparece sem rolar a página, por isso não é lazy */
    );
    $("#fim-titulo").textContent = DADOS.obra.titulo;
    $("#fim-gancho").textContent = DADOS.obra.gancho;
    $("#fim-sinopse").textContent = DADOS.obra.sinopse;
    $("#fim-apoio-texto").textContent = DADOS.obra.apoioTexto;
  }

  /* Liga um botão grande a um link de DADOS.links. Se o link ainda estiver
     vazio, o botão fica visível (o pedido era "não pode ficar escondido")
     mas esmaecido e sem clique, pra ninguém publicar um link morto. */
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

  function renderCtas(){
    ligarCta("#fim-cta-tapas", DADOS.links.tapas);
    ligarCta("#fim-cta-webtoon", DADOS.links.webtoon);
    ligarCta("#fim-cta-apoiase", DADOS.links.apoiase);
  }

  function renderPersonagens(){
    var lista = DADOS.personagens.slice().sort(function(a, b){ return a.ordem - b.ordem; });

    $("#fim-personagens").innerHTML = lista.map(function(p){
      return '<details class="fim-personagem">' +
        '<summary>' + p.nome + '</summary>' +
        '<div class="fim-personagem-corpo">' +
          '<div class="fim-personagem-arte">' +
            imgOuPlaceholder(p.img, "Arte de " + p.nome, "arte de " + p.nome + " — solte em assets/ e preencha img em js/fim.js", true) +
          '</div>' +
          '<p class="fim-personagem-desc">' + p.descricao + '</p>' +
          '<div class="fim-mudancas">' +
            '<h3>As mudanças</h3>' +
            '<p>' + p.mudancas + '</p>' +
            '<div class="fim-compare">' +
              '<div class="fim-compare-item">' +
                '<span class="fim-compare-label">antes</span>' +
                imgOuPlaceholder(p.imgAntiga, "Versão antiga de " + p.nome, "versão antiga — preencha imgAntiga", true) +
              '</div>' +
              '<div class="fim-compare-item">' +
                '<span class="fim-compare-label">agora</span>' +
                imgOuPlaceholder(p.img, "Versão atual de " + p.nome, "versão atual — preencha img", true) +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</details>';
    }).join("");
  }

  renderHero();
  renderCtas();
  renderPersonagens();
})();
