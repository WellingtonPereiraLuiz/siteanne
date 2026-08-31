"use strict";

/*
 * Conjunto de ícones prontos dos links da página inicial. Cada um é um
 * <svg> pequeno, desenhado no traço grosso do site e usando "currentColor"
 * (a cor vem do CSS, então funciona no tema claro e no escuro sem mudar
 * nada aqui). É a mesma ideia do EXEMPLOS em js/dados.js: um dado fixo que
 * mora num arquivo só, usado tanto pela home (js/index.js) quanto pelo
 * painel (js/admin-links.js).
 *
 * A chave (ex.: "instagram") é o que fica gravado em links.icone_preset no
 * Supabase. Pra adicionar um ícone novo: cole outro <svg> aqui com uma
 * chave nova — ele aparece sozinho na grade de escolha do painel.
 */
var ICONES_SITE = {
  instagram: {
    nome: "Instagram",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/></svg>'
  },
  livro: {
    nome: "Livro / HQ",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6C10 4.5 7 4 4 4v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z"/><path d="M12 6v14"/></svg>'
  },
  tapas: {
    nome: "Episódios",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="13" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/></svg>'
  },
  webtoon: {
    nome: "Rolagem / celular",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M9.5 7h5M9.5 11h5M9.5 15h3.5"/></svg>'
  },
  jogos: {
    nome: "Jogos",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="11" rx="5.5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r="1" fill="currentColor" stroke="none"/><circle cx="18" cy="13.5" r="1" fill="currentColor" stroke="none"/></svg>'
  },
  paleta: {
    nome: "Paleta / arte",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-1 1.6-2.2-.4-1.3.5-2.3 1.9-2.3H17a4 4 0 0 0 4-4c0-4.8-4-7.5-9-7.5z"/><circle cx="8" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r="1" fill="currentColor" stroke="none"/></svg>'
  },
  coracao: {
    nome: "Coração / apoio",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20S3.5 14.5 3.5 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.5 2.8C20.5 14.5 12 20 12 20z"/></svg>'
  },
  estrela: {
    nome: "Estrela",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l2.6 5.3 5.9.9-4.25 4.15 1 5.85L12 17l-5.25 2.75 1-5.85L3.5 9.7l5.9-.9z"/></svg>'
  },
  globo: {
    nome: "Site",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 2.7 2.8 15.3 0 18M12 3c-2.8 2.7-2.8 15.3 0 18"/></svg>'
  },
  loja: {
    nome: "Loja",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1 12H5z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>'
  },
  email: {
    nome: "Email",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7.5l8 5.5 8-5.5"/></svg>'
  },
  link: {
    nome: "Link genérico",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 15l6-6"/><path d="M11 6.5l1-1a4 4 0 0 1 5.7 5.7l-1 1"/><path d="M13 17.5l-1 1a4 4 0 0 1-5.7-5.7l1-1"/></svg>'
  }
};

/*
 * Devolve o HTML de dentro do quadradinho do ícone de um link, escolhendo
 * entre imagem enviada e ícone pronto. Usado pela home e pelo painel — pra
 * os dois mostrarem exatamente a mesma coisa.
 */
function iconeLinkHtml(tipo, preset, url){
  if (tipo === "imagem" && url) return '<img src="' + url + '" alt="">';
  var ic = ICONES_SITE[preset] || ICONES_SITE.link;
  return ic.svg;
}
