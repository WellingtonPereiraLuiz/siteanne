"use strict";

/*
 * Aplica o fundo customizado da Anne (tabela configuracao, chave "perfil",
 * campo "fundo" — ver supabase/schema.sql) num elemento (por padrão o
 * <body>). Reaproveita a mesma técnica dos radial-gradient em
 * --wash-a..--wash-e de css/base.css, só que com as cores que ela escolher
 * no lugar das fixas.
 *
 * É uma função pura, sem fetch: js/avatar.js chama ela nas 3 páginas
 * públicas assim que o perfil chega do Supabase (reaproveitando o mesmo
 * fetch que já busca o avatar), e js/admin-precos.js chama ela direto —
 * sem salvar nada — toda vez que a Anne mexe nos campos do formulário, pra
 * dar uma prévia "ao vivo" no próprio painel.
 *
 * Se "fundo" não existir (site de quem já estava no ar antes dessa fase)
 * ou vier sem o dado que o tipo escolhido precisa, essa função não faz
 * nada — o elemento continua com o fundo padrão de css/base.css.
 */
function aplicarFundo(fundo, alvo){
  alvo = alvo || document.body;
  if (!fundo || !fundo.tipo) return;

  if (fundo.tipo === "imagem" && fundo.url){
    alvo.style.backgroundColor = "";
    alvo.style.backgroundImage = 'url("' + fundo.url + '")';
    alvo.style.backgroundSize = "cover";
    alvo.style.backgroundPosition = "center";
  } else if (fundo.tipo === "cor" && fundo.cor){
    alvo.style.backgroundImage = "none";
    alvo.style.backgroundColor = fundo.cor;
  } else if (fundo.tipo === "gradiente" && fundo.cores && fundo.cores.length){
    /* pontos parecidos com os dos --wash-a..e originais, pra manter o
       "espalhado pelos cantos" mesmo com menos de 4 cores escolhidas */
    var pontos = ["14% 4%", "92% 22%", "6% 60%", "94% 88%"];
    alvo.style.backgroundColor = "";
    alvo.style.backgroundImage = fundo.cores.map(function(cor, i){
      /* "5c" no fim = ~36% de opacidade (hex de 8 dígitos), pra ficar uma
         mancha suave em vez de uma cor chapada — mesmo espírito das cores
         translúcidas em --wash-a..e */
      return "radial-gradient(circle at " + pontos[i % pontos.length] + ", " + cor + "5c, transparent 42%)";
    }).join(",");
  } else {
    return;
  }

  /* fundo livre pode deixar texto solto difícil de ler — essa classe liga
     uma sombra leve atrás do texto (ver .fundo-custom em css/base.css) */
  alvo.classList.add("fundo-custom");
}
