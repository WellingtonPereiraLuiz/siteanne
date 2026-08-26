(function(){
  "use strict";

  /* Navegador que já tem a View Transition API cuida da troca de página
     sozinho (regra @view-transition no css/base.css) — não faz sentido
     duplicar o efeito aqui. Esse fallback só entra em ação onde ela ainda
     não existe (Safari e navegadores dentro de apps, por exemplo). */
  if (document.startViewTransition) return;

  /* respeita quem pediu menos animação no sistema: sai da página na hora,
     sem esperar nenhum fade */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.addEventListener("click", function(e){
    var a = e.target.closest("a[href]");
    if (!a) return;

    /* deixa o navegador cuidar sozinho quando: o link abre em nova aba, é
       uma âncora dentro da própria página, é um link desabilitado (os
       CTAs sem URL ainda), aponta pra outro site, ou o clique veio com uma
       tecla modificadora (ctrl/cmd/shift abrem em nova aba/janela) */
    if (a.target === "_blank") return;
    if (a.getAttribute("aria-disabled") === "true") return;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#") return;
    if (a.origin !== location.origin) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    document.body.classList.add("saindo");

    var foi = false;
    var ir = function(){ if (!foi){ foi = true; location.href = href; } };
    document.body.addEventListener("transitionend", ir, { once:true });
    setTimeout(ir, 220); /* rede de segurança, caso o transitionend não dispare */
  });
})();
