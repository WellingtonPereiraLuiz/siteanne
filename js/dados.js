"use strict";

/* ===================== CONFIGURE AQUI ===================== */
var CONFIG = {
  instagram: "anne_ilustradora",
  whatsapp: ""   /* ex.: "5569999999999" — país + DDD + número, só dígitos. Vazio = usa a DM do Instagram. */
};
/* ========================================================== */

var PRECOS = {
  cartoon:{ perfil:17, cintura:25, inteiro:30, extra:{cintura:20, inteiro:25}, dupla:45, duplaDe:50 },
  chibi:  { perfil:15, cintura:20, inteiro:25, extra:{cintura:15, inteiro:20}, dupla:35, duplaDe:40 }
};
var EX = {
  cartoon:"assets/ex_cartoon.webp", chibi:"assets/ex_chibi.webp",
  cartoon_dupla:"assets/ex_cartoon_duo.webp", chibi_dupla:"assets/ex_chibi_duo.webp",
  cenario:"assets/ex_cenario.webp"
};
var NOMES = {
  tipo:{individual:"Um personagem", dupla:"Combo dupla", cenario:"Cenário / ilustração"},
  estilo:{cartoon:"Cartoon", chibi:"Chibi"},
  enq:{perfil:"Perfil", cintura:"Cintura", inteiro:"Corpo inteiro"}
};
var DESC = {
  cartoon:"Traço encorpado, cores chapadas e proporção normal.",
  chibi:"Cabeça grande e corpinho pequeno — ótimo para emoji e ícone.",
  cartoon_dupla:"Dois personagens juntos, com cenário simples incluso.",
  chibi_dupla:"Dupla em chibi, perfeita para casal, amigos ou dupla de OCs.",
  cenario:"Ilustração com ambiente construído — orçamento feito caso a caso."
};
