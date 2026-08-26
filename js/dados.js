"use strict";

/* ===================== CONFIGURE AQUI ===================== */
var CONFIG = {
  instagram: "anne_ilustradora",
  whatsapp: ""   /* ex.: "5569999999999" — país + DDD + número, só dígitos. Vazio = usa a DM do Instagram. */
};
/* ========================================================== */

/*
 * Todo preço, desconto e categoria de cenário mora aqui dentro — nenhum
 * número desses pode aparecer direto no HTML ou espalhado pelo calculo.js.
 * Isso é proposital: numa fase futura este objeto some e vira um fetch no
 * Supabase, então o resto do código já precisa tratar isso como "dados de
 * fora", não como constantes fixas do programa.
 */
var DADOS = {
  precos: {
    cartoon: { perfil: 17, cintura: 25, inteiro: 30, dupla: 45 },
    chibi:   { perfil: 15, cintura: 20, inteiro: 25, dupla: 35 }
  },
  acabamentos: [
    { id:"completo",   nome:"Completo (cor e sombra)",      fator:1.00 },
    { id:"sem_sombra", nome:"Lineart e cor sem sombra",      fator:0.60 },
    { id:"lineart",    nome:"Só lineart / preto e branco",   fator:0.40 }
  ],
  descontosVolume: [
    { min:1, pct:0 }, { min:2, pct:5 }, { min:3, pct:10 }, { min:4, pct:15 }
  ],
  cenarios: [
    { id:"vegetacao", nome:"Vegetação e natureza",
      desc:"Floresta, jardim, campo aberto", min:60,  max:120, img:"" },
    { id:"fechado",   nome:"Espaço fechado / interior",
      desc:"Quarto, taverna, sala bagunçada", min:70, max:140, img:"" },
    { id:"cidade",    nome:"Cidade e ruas",
      desc:"Fachadas, calçada, perspectiva urbana", min:90, max:180, img:"" }
  ],
  comercial: { pct:50, minimoCapaLivro:120 }
};

/* Exemplos visuais do preview do configurador de personagem — não é preço,
   por isso fica fora do DADOS. Cenário não precisa disso: cada categoria em
   DADOS.cenarios já carrega seu próprio nome/desc. */
var EXEMPLOS = {
  cartoon:       { img:"assets/ex_cartoon.webp",     desc:"Traço encorpado, cores chapadas e proporção normal." },
  chibi:         { img:"assets/ex_chibi.webp",       desc:"Cabeça grande e corpinho pequeno — ótimo para emoji e ícone." },
  cartoon_dupla: { img:"assets/ex_cartoon_duo.webp", desc:"Dois personagens juntos, com cenário simples incluso." },
  chibi_dupla:   { img:"assets/ex_chibi_duo.webp",   desc:"Dupla em chibi, perfeita para casal, amigos ou dupla de OCs." }
};
