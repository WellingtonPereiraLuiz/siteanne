(function(){
  "use strict";

  var $  = function(s){ return document.querySelector(s); };
  var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* Cada aba só busca os dados dela na primeira vez que é aberta (não teria
     sentido buscar as 4 de uma vez se a Anne só quer mexer no preço). */
  var ABAS = {
    precos:   function(){ return adminPrecosIniciar($("#aba-precos")); },
    cenarios: function(){ return adminCenariosIniciar($("#aba-cenarios")); },
    galeria:  function(){ return adminGaleriaIniciar($("#aba-galeria")); },
    fim:      function(){ return adminFimIniciar($("#aba-fim")); }
  };
  var carregadas = {};

  function mostrarAba(nome){
    Object.keys(ABAS).forEach(function(n){
      $("#aba-" + n).hidden = n !== nome;
      $('.tab[data-aba="' + n + '"]').setAttribute("aria-selected", String(n === nome));
    });
    if (!carregadas[nome]){
      carregadas[nome] = true;
      ABAS[nome]();
    }
  }

  $$(".tab[data-aba]").forEach(function(botao){
    botao.addEventListener("click", function(){ mostrarAba(botao.dataset.aba); });
  });

  function mostrarLogin(){
    $("#admin-login").hidden = false;
    $("#admin-painel").hidden = true;
  }

  function mostrarPainel(){
    $("#admin-login").hidden = true;
    $("#admin-painel").hidden = false;
    mostrarAba("precos");
  }

  $("#login-form").addEventListener("submit", function(e){
    e.preventDefault();
    var email = $("#login-email").value.trim();
    var senha = $("#login-senha").value;
    var botao = $("#login-botao");
    $("#login-erro").hidden = true;
    botao.disabled = true;
    botao.textContent = "Entrando...";
    authLogin(email, senha).then(function(){
      botao.disabled = false;
      botao.textContent = "Entrar";
      mostrarPainel();
    }).catch(function(erro){
      botao.disabled = false;
      botao.textContent = "Entrar";
      $("#login-erro").textContent = erro.message;
      $("#login-erro").hidden = false;
    });
  });

  $("#sair-botao").addEventListener("click", function(){
    authLogout();
    carregadas = {};
    mostrarLogin();
  });

  if (authSessao()) mostrarPainel(); else mostrarLogin();
})();
