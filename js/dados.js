"use strict";

/*
 * CONFIG e DADOS começam vazios e são preenchidos pelo Supabase (ver
 * DADOS_PRONTO logo abaixo). Ficam declarados como "var" aqui em cima
 * porque calculo.js referencia CONFIG.* e DADOS.* dentro de funções que só
 * rodam depois — nunca no carregamento do arquivo — então não tem problema
 * eles começarem vazios.
 */
var CONFIG = {
  instagram: "",
  whatsapp: ""
};

var DADOS = {
  precos: {},
  acabamentos: [],
  descontosVolume: [],
  cenarios: [],
  comercial: {}
};

/* Exemplos visuais do preview do configurador de personagem — não são
   preço nem vêm do banco ainda, por isso ficam fixos aqui. As imagens já
   moraram em assets/, mas na Fase 3 passaram pro bucket "estaticos" do
   Storage (ver supabase/migrar.mjs). */
var EXEMPLOS = {
  cartoon:       { img: supaStorageUrl("estaticos", "ex_cartoon.webp"),     desc:"Traço encorpado, cores chapadas e proporção normal." },
  chibi:         { img: supaStorageUrl("estaticos", "ex_chibi.webp"),       desc:"Cabeça grande e corpinho pequeno — ótimo para emoji e ícone." },
  cartoon_dupla: { img: supaStorageUrl("estaticos", "ex_cartoon_duo.webp"), desc:"Dois personagens juntos, com cenário simples incluso." },
  chibi_dupla:   { img: supaStorageUrl("estaticos", "ex_chibi_duo.webp"),   desc:"Dupla em chibi, perfeita para casal, amigos ou dupla de OCs." }
};

/*
 * Busca "configuracao" (precos, acabamentos, descontosVolume, comercial,
 * perfil) e "cenarios" no Supabase e preenche CONFIG/DADOS por cima dos
 * objetos vazios acima. calculo.js espera essa Promise resolver antes do
 * primeiro render() — é por isso que ela fica exposta como global.
 */
var DADOS_PRONTO = Promise.all([
  supaSelect("configuracao", "select=chave,valor"),
  supaSelect("cenarios", "select=slug,nome,descricao,preco_min,preco_max,imagem_url&order=ordem")
]).then(function(resultados){
  var configLinhas = resultados[0];
  var cenariosLinhas = resultados[1];

  configLinhas.forEach(function(linha){
    if (linha.chave === "precos") DADOS.precos = linha.valor;
    else if (linha.chave === "acabamentos") DADOS.acabamentos = linha.valor;
    else if (linha.chave === "descontosVolume") DADOS.descontosVolume = linha.valor;
    else if (linha.chave === "comercial") DADOS.comercial = linha.valor;
    else if (linha.chave === "perfil"){
      CONFIG.instagram = linha.valor.instagram || "";
      CONFIG.whatsapp = linha.valor.whatsapp || "";
    }
  });

  DADOS.cenarios = cenariosLinhas.map(function(c){
    return { id: c.slug, nome: c.nome, desc: c.descricao, min: c.preco_min, max: c.preco_max, img: c.imagem_url };
  });
});
