# -*- coding: utf-8 -*-
import base64, os, re, sys

A = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets')
def uri(n):
    return 'data:image/webp;base64,' + base64.b64encode(open(os.path.join(A, n + '.webp'), 'rb').read()).decode()

FONTS = '''<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Gluten:wght@500;700;800&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap">'''

CSS = '''<style>
/* ===== TOKENS: papel salmão, laranja terroso, rosa empoeirado ===== */
:root{
  --ink:#38222B; --ink-soft:#6E4E57;
  --paper:#FBEDE5; --card:#FFF8F3;
  --salmon:#ED9A6E; --rose:#E5A0A2; --peach:#F8D6C2;
  --orange:#D9855A; --clay:#A85331; --plum:#8A6382; --mint:#C3D2B3;
  --line:#38222B; --shadow:#38222B; --ring:#A85331; --on-clay:#FFF8F3;
  --wash-a:rgba(237,154,110,.38); --wash-b:rgba(248,214,194,.55); --wash-c:rgba(229,160,162,.30);
  --wash-d:rgba(217,133,90,.20); --wash-e:rgba(195,210,179,.24);
  --r:18px; --maxw:600px;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --ink:#F9E8E0; --ink-soft:#CFA99C;
    --paper:#241720; --card:#37242C;
    --salmon:#C9806C; --rose:#B87E80; --peach:#5C3942;
    --orange:#D9855A; --clay:#F0A578; --plum:#BC93B1; --mint:#7E9070;
    --line:#140B10; --shadow:#140B10; --ring:#F0A578; --on-clay:#2A1119;
    --wash-a:rgba(237,154,110,.11); --wash-b:rgba(200,128,108,.10); --wash-c:rgba(155,100,130,.13);
    --wash-d:rgba(217,133,90,.08); --wash-e:rgba(126,144,112,.09);
  }
}
:root[data-theme="dark"]{
  --ink:#F9E8E0; --ink-soft:#CFA99C;
  --paper:#241720; --card:#37242C;
  --salmon:#C9806C; --rose:#B87E80; --peach:#5C3942;
  --orange:#D9855A; --clay:#F0A578; --plum:#BC93B1; --mint:#7E9070;
  --line:#140B10; --shadow:#140B10; --ring:#F0A578; --on-clay:#2A1119;
  --wash-a:rgba(237,154,110,.11); --wash-b:rgba(200,128,108,.10); --wash-c:rgba(155,100,130,.13);
  --wash-d:rgba(217,133,90,.08); --wash-e:rgba(126,144,112,.09);
}

*{box-sizing:border-box}
body{
  margin:0; background:var(--paper);
  background-image:
    radial-gradient(circle at 14% 4%, var(--wash-a), transparent 40%),
    radial-gradient(circle at 92% 22%, var(--wash-b), transparent 38%),
    radial-gradient(circle at 4% 52%, var(--wash-c), transparent 34%),
    radial-gradient(circle at 96% 74%, var(--wash-d), transparent 36%),
    radial-gradient(circle at 40% 97%, var(--wash-e), transparent 40%);
  background-attachment:fixed;
  color:var(--ink);
  font-family:"Nunito",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  font-size:clamp(16px,4.5vw,18px); line-height:1.6; -webkit-font-smoothing:antialiased;
  padding:0 16px 40px;
}
@media (max-width:480px){
  body{padding:0 14px 40px}
}
.wrap{max-width:var(--maxw);margin:0 auto}
h1,h2,h3{font-family:"Gluten","Nunito",system-ui,sans-serif;font-weight:800;line-height:1.06;margin:0;text-wrap:balance;letter-spacing:-.01em}
p{margin:0}
a{color:inherit}
img{max-width:100%;display:block}
button{font:inherit;color:inherit}
:focus-visible{outline:3px solid var(--ring);outline-offset:3px;border-radius:8px}
s{opacity:.55;font-weight:600}

.sticker{background:var(--card);border:2.5px solid var(--line);border-radius:var(--r);box-shadow:5px 5px 0 var(--shadow)}

/* ===== grama desenhada ===== */
.grass{display:block;margin:28px auto;width:172px;height:26px;color:var(--rose);opacity:.85}

/* ===== eyebrow ===== */
.eyebrow{font-family:"Caveat Brush","Nunito",cursive;font-size:1.5rem;color:var(--plum);display:flex;align-items:center;gap:10px;margin-bottom:14px}
.eyebrow::after{content:"";flex:1;height:2.5px;background:var(--line);border-radius:2px;opacity:.3}
section{margin-top:36px}

/* ===== hero ===== */
header{padding:clamp(32px,6vw,42px) 0 6px;text-align:center}
@media (max-width:480px){
  header{padding:28px 0 4px}
}
.avatar-wrap{position:relative;width:clamp(100px,28vw,132px);margin:0 auto 16px}
.avatar{width:132px;height:132px;border-radius:50%;object-fit:cover;object-position:center;border:3px solid var(--line);box-shadow:5px 6px 0 var(--salmon)}
.badge{position:absolute;right:-30px;top:4px;font-family:"Caveat Brush","Nunito",cursive;font-size:1.05rem;
  background:var(--mint);color:#38222B;border:2.5px solid var(--line);padding:3px 12px 4px;border-radius:14px;
  transform:rotate(7deg);box-shadow:3px 3px 0 var(--shadow);white-space:nowrap}
h1{font-size:clamp(2rem,10vw,3.6rem)}
.handle{font-family:"Caveat Brush","Nunito",cursive;font-size:clamp(1.1rem,5vw,1.35rem);color:var(--clay);margin-top:2px}
.tagline{margin-top:12px;color:var(--ink-soft);font-size:clamp(0.95rem,4vw,1.02rem);max-width:34ch;margin-inline:auto}

/* ===== botao grande p/ orcamento ===== */
.big-cta{
  text-align:left;display:flex;align-items:center;gap:14px;text-decoration:none;margin-top:30px;
  background:var(--peach);border:3px solid var(--line);border-radius:22px;
  box-shadow:6px 6px 0 var(--shadow);padding:18px 16px;transform:rotate(-.6deg);
  transition:transform .16s ease,box-shadow .16s ease;
  min-height:108px;
}
@media (max-width:480px){
  .big-cta{padding:20px 14px;gap:12px;min-height:120px;flex-direction:column;text-align:center}
}
.big-cta:hover,.big-cta:focus-visible{transform:rotate(0deg) translate(3px,3px);box-shadow:3px 3px 0 var(--shadow)}
.big-cta img{width:74px;height:96px;object-fit:cover;object-position:top center;border:2.5px solid var(--line);border-radius:14px;background:var(--card);flex:0 0 auto}
@media (max-width:480px){
  .big-cta img{width:64px;height:80px}
}
.big-cta .t{flex:1;min-width:0}
.big-cta .kicker{font-family:"Caveat Brush","Nunito",cursive;font-size:clamp(1rem,4.5vw,1.15rem);color:var(--clay);line-height:1.1;display:block}
.big-cta .name{font-family:"Gluten","Nunito",system-ui,sans-serif;font-weight:800;font-size:clamp(1.1rem,5vw,1.35rem);line-height:1.12;display:block;margin:2px 0 4px}
.big-cta .sub{display:block;font-size:clamp(0.8rem,3.5vw,0.87rem);color:var(--ink-soft);line-height:1.35}
.big-cta .go{font-family:"Gluten","Nunito",system-ui,sans-serif;font-weight:800;font-size:1.6rem;color:var(--clay);flex:0 0 auto}
@media (max-width:480px){
  .big-cta .go{font-size:1.4rem;flex:none}
}

/* ===== links ===== */
.links{display:flex;flex-direction:column;gap:14px}
.link{display:flex;align-items:center;gap:14px;padding:16px;text-decoration:none;transition:transform .16s ease,box-shadow .16s ease;min-height:60px}
@media (max-width:480px){
  .link{padding:18px 14px;min-height:68px}
}
.link:nth-child(odd){transform:rotate(-.5deg)}
.link:nth-child(even){transform:rotate(.5deg)}
.link:hover,.link:focus-visible{transform:rotate(0deg) translate(3px,3px);box-shadow:2px 2px 0 var(--shadow)}
.link .ico{flex:0 0 48px;height:48px;border-radius:12px;border:2.5px solid var(--line);display:grid;place-items:center;
  font-family:"Gluten","Nunito",system-ui,sans-serif;font-weight:800;font-size:clamp(1rem,5vw,1.1rem);color:#38222B}
.link .txt{flex:1;min-width:0;display:block}
.link .name{display:block;font-family:"Gluten","Nunito",system-ui,sans-serif;font-weight:700;font-size:clamp(1rem,4.5vw,1.05rem);line-height:1.25}
.link .desc{display:block;font-size:clamp(0.8rem,3.5vw,0.85rem);color:var(--ink-soft);line-height:1.35;margin-top:2px}
.link .arrow{font-size:clamp(1.1rem,5vw,1.25rem);color:var(--ink-soft);flex:0 0 auto}
.i-ig{background:linear-gradient(135deg,#F8D2C0,#D9855A)}
.i-tapas{background:#F3C0B4}
.i-webtoon{background:#C3D2B3}
.i-apoia{background:#B25B37;color:#FFF8F3!important}
.i-art{background:#B9C6C4}
.i-itch{background:#E5A0A2}

/* ===== galeria ===== */
.gal{columns:2;column-gap:12px}
@media (max-width:480px){
  .gal{columns:1;column-gap:0}
}
.gal figure{margin:0 0 12px;break-inside:avoid;border:2.5px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:4px 4px 0 var(--shadow);background:var(--card)}
.gal img{width:100%;height:auto}
.gal figure:nth-child(3n+1){transform:rotate(-.7deg)}
.gal figure:nth-child(3n+2){transform:rotate(.6deg)}
.gal-note{font-family:"Caveat Brush","Nunito",cursive;font-size:clamp(1rem,4.5vw,1.1rem);color:var(--ink-soft);text-align:center;margin-top:10px}

/* ===== callout ===== */
.callout{padding:16px 18px;font-size:.94rem;line-height:1.55;background:var(--peach);border:2.5px solid var(--line);
  border-radius:16px;box-shadow:4px 4px 0 var(--shadow);transform:rotate(-.4deg)}
.callout b{font-family:"Gluten","Nunito",system-ui,sans-serif}

footer{margin-top:44px;text-align:center;color:var(--ink-soft);font-size:.85rem;padding-bottom:8px}
footer .sig{font-family:"Caveat Brush","Nunito",cursive;font-size:1.3rem;color:var(--salmon);display:block;margin-bottom:4px}
footer a{color:var(--clay);font-weight:700}

/* ===== animacao ===== */
.rise{opacity:0;transform:translateY(14px)}
.rise.in{opacity:1;transform:none;transition:opacity .5s ease,transform .5s cubic-bezier(.2,.7,.3,1)}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.rise{opacity:1;transform:none}}
</style>'''

CSS_ORC = '''<style>
body{padding-bottom:150px}
.topbar{display:flex;align-items:center;gap:12px;padding:20px 0 4px}
.back{display:inline-flex;align-items:center;gap:6px;text-decoration:none;font-weight:700;font-size:.9rem;
  background:var(--card);border:2.5px solid var(--line);border-radius:999px;padding:7px 14px 7px 11px;box-shadow:3px 3px 0 var(--shadow);
  transition:transform .13s ease,box-shadow .13s ease}
.back:hover,.back:focus-visible{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--shadow)}
.topbar .who{margin-left:auto;display:flex;align-items:center;gap:8px;font-family:"Caveat Brush","Nunito",cursive;font-size:1.15rem;color:var(--ink-soft)}
.topbar .who img{width:38px;height:38px;border-radius:50%;border:2.5px solid var(--line);object-fit:cover}
.page-title{margin-top:16px}
.page-title h1{font-size:clamp(2.1rem,9vw,2.8rem)}
.page-title p{color:var(--ink-soft);margin-top:8px;max-width:40ch}

.builder{padding:20px 18px 22px;margin-top:22px}
.step{margin-bottom:22px}
.step:last-child{margin-bottom:0}
.step-label{font-family:"Gluten","Nunito",system-ui,sans-serif;font-weight:700;font-size:1.02rem;display:flex;align-items:baseline;gap:8px;margin-bottom:10px}
.step-num{font-family:"Caveat Brush","Nunito",cursive;font-size:1.25rem;color:var(--clay);font-weight:400}
.step-hint{font-size:.82rem;color:var(--ink-soft);font-weight:400;font-family:"Nunito",sans-serif}
.chips{display:flex;flex-wrap:wrap;gap:9px}
.chip{border:2.5px solid var(--line);background:var(--paper);color:var(--ink);border-radius:999px;padding:8px 15px;cursor:pointer;
  font-weight:700;font-size:.94rem;box-shadow:3px 3px 0 var(--shadow);transition:transform .13s ease,box-shadow .13s ease,background .13s ease}
.chip .pz{font-weight:600;opacity:.62;font-size:.86em;font-variant-numeric:tabular-nums}
.chip:hover{transform:translate(1px,1px);box-shadow:2px 2px 0 var(--shadow)}
.chip[aria-pressed="true"]{background:var(--salmon);color:#38222B;transform:translate(3px,3px);box-shadow:0 0 0 var(--shadow)}
.chip[aria-pressed="true"] .pz{opacity:.75}

/* preview ao vivo com exemplo real da Anne */
.preview{display:flex;gap:14px;align-items:center;padding:12px;margin-bottom:22px;background:var(--peach);
  border:2.5px solid var(--line);border-radius:16px;box-shadow:4px 4px 0 var(--shadow)}
.preview .ph{flex:0 0 118px;height:132px;border:2.5px solid var(--line);border-radius:12px;overflow:hidden;background:var(--card)}
.preview .ph img{width:100%;height:100%;object-fit:cover;object-position:top center;transition:opacity .2s ease}
.preview .cap{font-size:.85rem;line-height:1.45;color:var(--ink-soft)}
.preview .cap b{display:block;font-family:"Gluten","Nunito",system-ui,sans-serif;font-size:1.02rem;color:var(--ink);margin-bottom:3px}
.preview .cap .tag{font-family:"Caveat Brush","Nunito",cursive;font-size:1rem;color:var(--clay);display:block;margin-top:5px}

.stepper{display:flex;align-items:center;gap:12px}
.stepper button{width:42px;height:42px;border-radius:12px;border:2.5px solid var(--line);background:var(--peach);cursor:pointer;
  font-family:"Gluten","Nunito",system-ui,sans-serif;font-weight:800;font-size:1.35rem;line-height:1;box-shadow:3px 3px 0 var(--shadow);
  transition:transform .13s ease,box-shadow .13s ease}
.stepper button:active{transform:translate(3px,3px);box-shadow:0 0 0 var(--shadow)}
.stepper button:disabled{opacity:.38;cursor:not-allowed}
.stepper output{font-family:"Gluten","Nunito",system-ui,sans-serif;font-weight:800;font-size:1.5rem;min-width:2ch;text-align:center;font-variant-numeric:tabular-nums}
.stepper .each{font-size:.85rem;color:var(--ink-soft);font-variant-numeric:tabular-nums}

.switch{display:flex;align-items:flex-start;gap:12px;cursor:pointer;padding:12px 14px;border:2.5px dashed var(--line);border-radius:14px;background:var(--paper)}
.switch input{appearance:none;flex:0 0 24px;width:24px;height:24px;margin:2px 0 0;border:2.5px solid var(--line);border-radius:7px;
  background:var(--card);cursor:pointer;position:relative}
.switch input:checked{background:var(--clay)}
.switch input:checked::after{content:"";position:absolute;inset:3px 4px 5px 4px;border:0 solid var(--on-clay);border-width:0 0 3px 3px;transform:rotate(-45deg)}
.switch .sw-t{font-weight:700;font-size:.96rem;line-height:1.3}
.switch .sw-d{font-size:.83rem;color:var(--ink-soft);line-height:1.4;margin-top:2px}

.receipt{margin-top:20px;border-top:2.5px dashed var(--line);padding-top:14px;display:flex;flex-direction:column;gap:6px;font-size:.93rem}
.receipt .row{display:flex;justify-content:space-between;gap:12px;align-items:baseline}
.receipt .row span:last-child{font-variant-numeric:tabular-nums;font-weight:700;white-space:nowrap}
.receipt .row.muted{color:var(--ink-soft);font-size:.86rem}
.receipt .row.muted span:last-child{font-weight:600}

.bar{position:fixed;left:0;right:0;bottom:0;z-index:40;background:var(--card);border-top:3px solid var(--line);padding:12px 18px calc(12px + env(safe-area-inset-bottom))}
.bar-in{max-width:var(--maxw);margin:0 auto;display:flex;align-items:center;gap:14px}
.bar .tot-l{font-family:"Caveat Brush","Nunito",cursive;font-size:1.05rem;color:var(--ink-soft);line-height:1}
.bar .tot-v{font-family:"Gluten","Nunito",system-ui,sans-serif;font-weight:800;font-size:1.85rem;line-height:1.1;font-variant-numeric:tabular-nums}
.bar .tot-v.consulta{font-size:1.15rem;max-width:11ch;line-height:1.15}
.cta{margin-left:auto;display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--clay);color:var(--on-clay);
  border:2.5px solid var(--line);border-radius:14px;padding:12px 18px;font-family:"Gluten","Nunito",system-ui,sans-serif;font-weight:800;font-size:1rem;
  cursor:pointer;text-decoration:none;box-shadow:4px 4px 0 var(--shadow);transition:transform .13s ease,box-shadow .13s ease;text-align:center;line-height:1.15}
.cta:hover,.cta:focus-visible{transform:translate(2px,2px);box-shadow:2px 2px 0 var(--shadow)}
.cta.alt{background:var(--mint);color:#38222B}
.cta-row{display:flex;gap:10px;margin-top:16px}
.cta-row .cta{margin-left:0;flex:1}

/* tabelas originais */
.sheets{display:flex;gap:12px;overflow-x:auto;padding:4px 2px 14px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}
.sheets button{flex:0 0 76%;scroll-snap-align:center;padding:0;border:2.5px solid var(--line);border-radius:14px;overflow:hidden;
  background:var(--card);box-shadow:4px 4px 0 var(--shadow);cursor:zoom-in}
.sheets img{width:100%;height:auto}
.sheets-hint{font-family:"Caveat Brush","Nunito",cursive;font-size:1.05rem;color:var(--ink-soft);text-align:center;margin-top:-4px}

dialog{border:none;background:transparent;padding:0;max-width:100vw;max-height:100vh}
dialog::backdrop{background:rgba(35,15,22,.86)}
dialog img{max-width:94vw;max-height:88vh;width:auto;border:3px solid var(--line);border-radius:12px;background:var(--card)}
dialog .close{position:fixed;top:14px;right:14px;width:44px;height:44px;border-radius:50%;border:2.5px solid var(--line);
  background:var(--card);color:var(--ink);font-size:1.3rem;font-weight:800;cursor:pointer;box-shadow:3px 3px 0 var(--shadow)}

details{border:2.5px solid var(--line);border-radius:14px;background:var(--card);box-shadow:4px 4px 0 var(--shadow);margin-bottom:12px;overflow:hidden}
summary{cursor:pointer;padding:13px 16px;font-family:"Gluten","Nunito",system-ui,sans-serif;font-weight:700;font-size:1rem;
  list-style:none;display:flex;align-items:center;gap:10px}
summary::-webkit-details-marker{display:none}
summary::before{content:"+";font-size:1.4rem;line-height:1;color:var(--clay);flex:0 0 auto;transition:transform .2s ease}
details[open] summary::before{transform:rotate(45deg)}
details .body{padding:0 16px 15px;font-size:.94rem;color:var(--ink-soft);line-height:1.55}
details .body strong{color:var(--ink)}

@media (max-width:400px){
  .bar-in{gap:10px}
  .cta{padding:11px 13px;font-size:.92rem}
  .preview .ph{flex:0 0 96px;height:112px}
}
</style>'''

GRASS = ('<svg class="grass" viewBox="0 0 170 26" fill="none" aria-hidden="true">'
 '<g stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">'
 '<path d="M6 22c0-7 2.5-10 4.5-10s4 3 4 9c0-7 2-10 4-10s4.5 3 4.5 11"/>'
 '<path d="M45 22c0-6 2-8.5 3.5-8.5s3.5 2.5 3.5 7.5c0-6 1.5-8.5 3-8.5s3.5 2.5 3.5 9.5"/>'
 '<path d="M84 22c0-9 3-12.5 5-12.5s4.5 3.5 4.5 11c0-8.5 2.5-12 4.5-12s5 3.5 5 13.5"/>'
 '<path d="M126 22c0-6 2-8.5 3.5-8.5s3.5 2.5 3.5 7.5c0-6 1.5-8.5 3-8.5s3.5 2.5 3.5 9.5"/>'
 '<path d="M156 22c0-7 2-9.5 3.5-9.5s3.5 2.5 3.5 8.5"/>'
 '</g></svg>')

RISE_JS = '''<script>
(function(){
  var q=function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};
  if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window){
    q("section, footer").forEach(function(e){e.classList.add("rise");});
    var io=new IntersectionObserver(function(en){en.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{rootMargin:"0px 0px -8% 0px"});
    q(".rise").forEach(function(e){io.observe(e);});
  }
})();
</script>'''

# =========================================================
#  PÁGINA 1 — central de links
# =========================================================
INDEX_BODY = '''<div class="wrap">

<header>
  <div class="avatar-wrap">
    <img class="avatar" src="{avatar}" alt="Foto de perfil da Anne: ilustração de perfil de uma garota de cabelo castanho">
    <span class="badge">aceito encomendas!</span>
  </div>
  <h1>Anne</h1>
  <p class="handle">@anne_ilustradora</p>
  <p class="tagline">Ilustradora de personagens em estilo cartoon e chibi. Criadora de <b>Finn, o Anti&#8209;Herói</b>.</p>

  <a class="big-cta" href="{orc_url}">
    <img src="{ex_cartoon}" alt="Exemplo de personagem de corpo inteiro em estilo cartoon">
    <span class="t">
      <span class="kicker">quer uma arte sua?</span>
      <span class="name">Monte sua encomenda</span>
      <span class="sub">Escolha o estilo, veja o preço na hora e feche direto comigo. A partir de R$&nbsp;15,00.</span>
    </span>
    <span class="go" aria-hidden="true">&#8594;</span>
  </a>
</header>

{grass}

<section id="links">
  <h2 class="eyebrow">onde me achar</h2>
  <div class="links">
    <a class="link sticker" href="https://www.instagram.com/anne_ilustradora" target="_blank" rel="noopener">
      <span class="ico i-ig">IG</span>
      <span class="txt"><span class="name">Instagram</span><span class="desc">Artes novas, processos e avisos de encomenda</span></span>
      <span class="arrow" aria-hidden="true">&#8599;</span>
    </a>
    <a class="link sticker" href="https://tapas.io/series/finn-o-antiheroi" target="_blank" rel="noopener">
      <span class="ico i-tapas">Ta</span>
      <span class="txt"><span class="name">Finn, o Anti-Herói &middot; Tapas</span><span class="desc">Leia a HQ em episódios</span></span>
      <span class="arrow" aria-hidden="true">&#8599;</span>
    </a>
    <a class="link sticker" href="https://www.webtoons.com/en/canvas/finn-o-anti-heroi/list?title_no=1162705" target="_blank" rel="noopener">
      <span class="ico i-webtoon">W</span>
      <span class="txt"><span class="name">Finn, o Anti-Herói &middot; Webtoon</span><span class="desc">A mesma HQ, no formato de rolagem</span></span>
      <span class="arrow" aria-hidden="true">&#8599;</span>
    </a>
    <a class="link sticker" href="https://annestudios.itch.io/a-carta-no-livro" target="_blank" rel="noopener">
      <span class="ico i-itch">itch</span>
      <span class="txt"><span class="name">A Carta no Livro</span><span class="desc">Visual novel na itch.io &mdash; jogue de graça</span></span>
      <span class="arrow" aria-hidden="true">&#8599;</span>
    </a>
    <a class="link sticker" href="https://www.artstation.com/annestudios" target="_blank" rel="noopener">
      <span class="ico i-art">As</span>
      <span class="txt"><span class="name">Portfólio na ArtStation</span><span class="desc">Trabalhos reunidos em alta resolução</span></span>
      <span class="arrow" aria-hidden="true">&#8599;</span>
    </a>
    <a class="link sticker" href="https://apoia.se/anneilustradora" target="_blank" rel="noopener">
      <span class="ico i-apoia">&#9829;</span>
      <span class="txt"><span class="name">Apoia.se</span><span class="desc">Apoie a HQ e receba conteúdo antes de todo mundo</span></span>
      <span class="arrow" aria-hidden="true">&#8599;</span>
    </a>
  </div>
</section>

<section id="galeria">
  <h2 class="eyebrow">galeria</h2>
  <div class="gal">
    <figure><img src="{girls4}" alt="Quatro retratos de personagens femininas em cores fortes" loading="lazy"></figure>
    <figure><img src="{tv}" alt="Personagem sentada sobre televisores antigos em um quarto roxo" loading="lazy"></figure>
    <figure><img src="{dragon}" alt="Personagem ao lado de um dragão branco em uma paisagem verde" loading="lazy"></figure>
    <figure><img src="{cats}" alt="Dois personagens em estilo cartoon segurando gatinhos" loading="lazy"></figure>
    <figure><img src="{port2}" alt="Quatro retratos de personagens de fantasia" loading="lazy"></figure>
    <figure><img src="{forest}" alt="Personagem de chifres sentada à beira de uma cachoeira" loading="lazy"></figure>
    <figure><img src="{duo}" alt="Dois personagens de corpo inteiro com roupas detalhadas" loading="lazy"></figure>
    <figure><img src="{swords}" alt="Cinco espadas do Finn desenhadas lado a lado" loading="lazy"></figure>
    <figure><img src="{outfits}" alt="Quatro versões de uma mesma personagem com roupas diferentes" loading="lazy"></figure>
    <figure><img src="{port1}" alt="Quatro retratos de personagens de cabelo escuro" loading="lazy"></figure>
  </div>
  <p class="gal-note">e tem muito mais no Instagram &#8599;</p>
</section>

{grass}

<section>
  <a class="big-cta" href="{orc_url}" style="transform:rotate(.5deg);margin-top:0">
    <img src="{ex_chibi}" alt="Exemplo de personagem em estilo chibi">
    <span class="t">
      <span class="kicker">tabela de preços</span>
      <span class="name">Monte sua encomenda</span>
      <span class="sub">Cartoon ou chibi, com o total calculado enquanto você escolhe.</span>
    </span>
    <span class="go" aria-hidden="true">&#8594;</span>
  </a>
</section>

<footer>
  <span class="sig">obrigada por chegar até aqui &#9825;</span>
  Anne &middot; ilustradora &middot; encomendas abertas
</footer>

</div>'''

# =========================================================
#  PÁGINA 2 — monte sua encomenda
# =========================================================
ORC_BODY = '''<div class="wrap">

<div class="topbar">
  <a class="back" href="{index_url}"><span aria-hidden="true">&#8592;</span> voltar</a>
  <span class="who"><img src="{avatar}" alt="">Anne</span>
</div>

<div class="page-title">
  <h1>Monte sua encomenda</h1>
  <p>Escolha o que você quer e o preço aparece na hora. No fim, é só mandar o resumo pra Anne.</p>
</div>

<div class="builder sticker">

  <div class="preview">
    <span class="ph"><img id="pv-img" src="{ex_cartoon}" alt="Exemplo de arte da Anne no estilo escolhido"></span>
    <span class="cap">
      <b id="pv-t">Cartoon &middot; corpo inteiro</b>
      <span id="pv-d">Traço encorpado, cores chapadas e proporção normal.</span>
      <span class="tag" id="pv-tag">exemplo real da Anne</span>
    </span>
  </div>

  <div class="step">
    <div class="step-label"><span class="step-num">1.</span> O que você quer?</div>
    <div class="chips" role="group" aria-label="Tipo de arte">
      <button class="chip" data-group="tipo" data-value="individual" aria-pressed="true">Um personagem</button>
      <button class="chip" data-group="tipo" data-value="dupla" aria-pressed="false">Combo dupla</button>
      <button class="chip" data-group="tipo" data-value="cenario" aria-pressed="false">Cenário / ilustração</button>
    </div>
  </div>

  <div class="step">
    <div class="step-label"><span class="step-num">2.</span> Estilo</div>
    <div class="chips" role="group" aria-label="Estilo">
      <button class="chip" data-group="estilo" data-value="cartoon" aria-pressed="true">Cartoon</button>
      <button class="chip" data-group="estilo" data-value="chibi" aria-pressed="false">Chibi</button>
    </div>
  </div>

  <div class="step" id="step-enq">
    <div class="step-label"><span class="step-num">3.</span> Enquadramento</div>
    <div class="chips" role="group" aria-label="Enquadramento">
      <button class="chip" data-group="enq" data-value="perfil" aria-pressed="false">Perfil <span class="pz"></span></button>
      <button class="chip" data-group="enq" data-value="cintura" aria-pressed="false">Cintura <span class="pz"></span></button>
      <button class="chip" data-group="enq" data-value="inteiro" aria-pressed="true">Corpo inteiro <span class="pz"></span></button>
    </div>
  </div>

  <div class="step" id="step-extras">
    <div class="step-label"><span class="step-num">4.</span> Personagens extras <span class="step-hint" id="extra-hint"></span></div>
    <div class="stepper">
      <button type="button" id="minus" aria-label="Remover um personagem extra">&minus;</button>
      <output id="extra-count" aria-live="polite">0</output>
      <button type="button" id="plus" aria-label="Adicionar um personagem extra">+</button>
      <span class="each" id="extra-each"></span>
    </div>
  </div>

  <div class="step">
    <label class="switch">
      <input type="checkbox" id="comercial">
      <span>
        <span class="sw-t">É para uso comercial</span>
        <span class="sw-d">Capa de livro, adesivo, botton ou qualquer produto que você vai revender. Acrescenta 50% ao valor &mdash; capa de livro tem mínimo de R$&nbsp;120,00.</span>
      </span>
    </label>
  </div>

  <div class="receipt" id="receipt"></div>

  <div class="cta-row">
    <button class="cta alt" id="copiar" type="button">Copiar resumo</button>
    <a class="cta" id="cta-mid" href="#" target="_blank" rel="noopener">Chamar na DM</a>
  </div>
</div>

<p class="callout" style="margin-top:16px"><b>Cenário conta à parte.</b> Céu, campo e fundos simples já estão inclusos. Rua com casas, quarto detalhado ou sala de aula dão bem mais trabalho &mdash; nesses casos a Anne olha a referência e passa o orçamento na DM.</p>

{grass}

<section id="tabelas">
  <h2 class="eyebrow">as tabelas da Anne</h2>
  <div class="sheets">
    <button type="button" data-full="{tab_chibi_extras}"><img src="{tab_chibi_extras}" alt="Tabela de preços por personagens extras"></button>
    <button type="button" data-full="{tab_combos}"><img src="{tab_combos}" alt="Tabela de combos de dupla"></button>
    <button type="button" data-full="{tab_responde}"><img src="{tab_responde}" alt="Página Anne Responde com regras de prazo e pagamento"></button>
    <button type="button" data-full="{tab_obs}"><img src="{tab_obs}" alt="Observações sobre cenários e estilo semirrealista"></button>
  </div>
  <p class="sheets-hint">arraste para o lado &middot; toque para ampliar</p>
</section>

<section id="faq">
  <h2 class="eyebrow">a Anne responde</h2>

  <details>
    <summary>Quanto tempo demora?</summary>
    <div class="body">De <strong>2 a 3 semanas</strong> no mínimo. Quanto mais trabalhosa a arte, maior o prazo &mdash; a Anne combina a data com você antes de começar.</div>
  </details>

  <details>
    <summary>Como funciona o pagamento?</summary>
    <div class="body">Por <strong>Pix</strong>. Você pode mandar metade na hora de fechar e metade na entrega, ou o valor completo de uma vez.</div>
  </details>

  <details>
    <summary>E se eu for revender a arte?</summary>
    <div class="body">Aí entra a taxa de <strong>uso comercial: +50%</strong> sobre o valor. Para capa de livro o mínimo é <strong>R$&nbsp;120,00</strong>, mesmo que a soma dê menos. Se a arte pedir mais trabalho, o valor sobe a partir daí.</div>
  </details>

  <details>
    <summary>O que a Anne não faz?</summary>
    <div class="body"><strong>HQs, comics e páginas de quadrinhos</strong> &mdash; já cansa bastante fazendo as próprias. E <strong>animação</strong>, que ela não desenha ainda.</div>
  </details>

  <details>
    <summary>Tem o estilo semirrealista?</summary>
    <div class="body">Tem, e dá para ver alguns exemplos no perfil. Por enquanto ela não vende esse estilo em arte grande, porque ainda demanda muito tempo &mdash; mas <strong>ícone semirrealista ou algo mais simples, pode pedir!</strong></div>
  </details>

  <details>
    <summary>"Tá muito caro" / "Tá muito barato"</summary>
    <div class="body">Se achou caro, não compre &mdash; sem ressentimento. Se achou barato, pode mandar uma gorjeta. 🙂<br><br>Comprando a arte da Anne você ajuda ela a se manter e a continuar produzindo <strong>Finn, o Anti-Herói</strong> e o resto do trabalho dela.</div>
  </details>
</section>

<footer>
  <span class="sig">até já &#9825;</span>
  <a href="{index_url}">voltar para a página da Anne</a>
</footer>

</div>

<dialog id="lb">
  <button class="close" type="button" aria-label="Fechar">&times;</button>
  <img id="lb-img" src="" alt="">
</dialog>

<div class="bar">
  <div class="bar-in">
    <div>
      <div class="tot-l">total</div>
      <div class="tot-v" id="total">R$&nbsp;30,00</div>
    </div>
    <a class="cta" id="cta-main" href="#" target="_blank" rel="noopener">Fechar pedido</a>
  </div>
</div>'''

ORC_JS = '''<script>
(function(){
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
    cartoon:"{ex_cartoon}", chibi:"{ex_chibi}",
    cartoon_dupla:"{ex_cartoon_duo}", chibi_dupla:"{ex_chibi_duo}",
    cenario:"{ex_cenario}"
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

  var st = { tipo:"individual", estilo:"cartoon", enq:"inteiro", extras:0, comercial:false };

  var $  = function(s){ return document.querySelector(s); };
  var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var brl = function(n){ return "R$ " + n.toFixed(2).replace(".", ","); };
  var precoExtra = function(){ return PRECOS[st.estilo].extra[st.enq] || 0; };

  function calcular(){
    var p = PRECOS[st.estilo], itens = [], base = 0;

    if (st.tipo === "cenario"){
      return { consulta:true, itens:[{ l:"Cenário / ilustração (" + NOMES.estilo[st.estilo] + ")", v:"a combinar" }] };
    }
    if (st.tipo === "dupla"){
      base = p.dupla;
      itens.push({ l:"Combo dupla " + NOMES.estilo[st.estilo] + " (2 personagens)", v:brl(base), de:p.duplaDe });
    } else {
      base = p[st.enq];
      itens.push({ l:NOMES.estilo[st.estilo] + " \\u00b7 " + NOMES.enq[st.enq], v:brl(base) });
      if (st.extras > 0){
        var ex = precoExtra() * st.extras;
        base += ex;
        itens.push({ l:st.extras + (st.extras > 1 ? " personagens extras" : " personagem extra"), v:brl(ex) });
      }
    }
    var total = base;
    if (st.comercial){
      var taxa = base * 0.5;
      total = base + taxa;
      itens.push({ l:"Uso comercial (+50%)", v:brl(taxa) });
    }
    return { consulta:false, total:total, itens:itens };
  }

  function resumo(r){
    var L = ["Oi, Anne! Montei uma encomenda no seu site:", ""];
    r.itens.forEach(function(i){ L.push("\\u2022 " + i.l + " \\u2014 " + i.v); });
    L.push("", r.consulta ? "Total: a combinar com voc\\u00ea" : "Total: " + brl(r.total), "", "Pode me passar o prazo?");
    return L.join("\\n");
  }

  function chaveExemplo(){
    if (st.tipo === "cenario") return "cenario";
    if (st.tipo === "dupla") return st.estilo + "_dupla";
    return st.estilo;
  }

  function render(){
    var indiv = st.tipo === "individual";
    $("#step-enq").hidden = !indiv;
    $("#step-extras").hidden = !indiv || st.enq === "perfil";

    $$('[data-group="enq"]').forEach(function(b){
      var pz = b.querySelector(".pz");
      if (pz) pz.textContent = brl(PRECOS[st.estilo][b.dataset.value]);
    });
    $$(".chip").forEach(function(b){
      b.setAttribute("aria-pressed", String(st[b.dataset.group] === b.dataset.value));
    });

    $("#extra-count").textContent = String(st.extras);
    $("#minus").disabled = st.extras === 0;
    $("#plus").disabled  = st.extras >= 4;
    $("#extra-each").textContent = brl(precoExtra()) + " cada";
    $("#extra-hint").textContent = st.enq === "perfil" ? "" : "(no mesmo enquadramento)";

    /* preview com exemplo real */
    var k = chaveExemplo();
    var img = $("#pv-img");
    if (img.getAttribute("src") !== EX[k]){ img.src = EX[k]; }
    $("#pv-t").textContent = st.tipo === "cenario" ? "Cenário / ilustração"
      : st.tipo === "dupla" ? NOMES.estilo[st.estilo] + " \\u00b7 dupla"
      : NOMES.estilo[st.estilo] + " \\u00b7 " + NOMES.enq[st.enq].toLowerCase();
    $("#pv-d").textContent = DESC[k];

    var r = calcular();

    $("#receipt").innerHTML = r.itens.map(function(i){
      var de = i.de ? "<s>" + brl(i.de) + "</s> " : "";
      return '<div class="row"><span>' + i.l + "</span><span>" + de + i.v + "</span></div>";
    }).join("") + (
      r.consulta
        ? '<div class="row muted"><span>Depende do tamanho e da complexidade do cen\\u00e1rio</span><span></span></div>'
        : (st.comercial && r.total < 120
            ? '<div class="row muted"><span>Se for capa de livro, o m\\u00ednimo \\u00e9 R$ 120,00</span><span></span></div>'
            : "")
    );

    var tot = $("#total");
    if (r.consulta){ tot.textContent = "a combinar"; tot.classList.add("consulta"); }
    else { tot.innerHTML = brl(r.total).replace(" ", "&nbsp;"); tot.classList.remove("consulta"); }

    var href = CONFIG.whatsapp
      ? "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(resumo(r))
      : "https://ig.me/m/" + CONFIG.instagram;
    $("#cta-main").href = href;
    $("#cta-mid").href  = href;
    $("#cta-main").textContent = CONFIG.whatsapp ? "Fechar no WhatsApp" : "Fechar na DM";
    $("#cta-mid").textContent  = CONFIG.whatsapp ? "Chamar no WhatsApp" : "Chamar na DM";
  }

  $$(".chip").forEach(function(b){
    b.addEventListener("click", function(){
      st[b.dataset.group] = b.dataset.value;
      if (b.dataset.group === "enq" && b.dataset.value === "perfil") st.extras = 0;
      render();
    });
  });
  $("#plus").addEventListener("click",  function(){ if (st.extras < 4){ st.extras++; render(); } });
  $("#minus").addEventListener("click", function(){ if (st.extras > 0){ st.extras--; render(); } });
  $("#comercial").addEventListener("change", function(e){ st.comercial = e.target.checked; render(); });

  function copiar(txt, ok, falhou){
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(ok, tenta);
    } else { tenta(); }
    function tenta(){
      var ta = document.createElement("textarea");
      ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch(e){ if (falhou) falhou(); }
      document.body.removeChild(ta);
    }
  }

  $("#copiar").addEventListener("click", function(){
    var btn = this, antes = "Copiar resumo";
    copiar(resumo(calcular()),
      function(){ btn.textContent = "Copiado!"; setTimeout(function(){ btn.textContent = antes; }, 1800); },
      function(){ btn.textContent = "Selecione o resumo acima"; setTimeout(function(){ btn.textContent = antes; }, 2600); });
  });

  /* na DM do Instagram não dá para pré-preencher: copiamos o resumo antes de sair */
  ["#cta-main", "#cta-mid"].forEach(function(sel){
    $(sel).addEventListener("click", function(){
      if (!CONFIG.whatsapp) copiar(resumo(calcular()), function(){}, function(){});
    });
  });

  /* tabelas em tamanho grande */
  var lb = $("#lb");
  $$(".sheets button").forEach(function(b){
    b.addEventListener("click", function(){
      $("#lb-img").src = b.dataset.full;
      $("#lb-img").alt = b.querySelector("img").alt;
      if (lb.showModal) lb.showModal();
    });
  });
  if (lb){
    lb.querySelector(".close").addEventListener("click", function(){ lb.close(); });
    lb.addEventListener("click", function(e){ if (e.target === lb || e.target.id === "lb-img") lb.close(); });
  }

  render();
})();
</script>'''


# =========================================================
#  MONTAGEM
# =========================================================
IMGS_INDEX = ['avatar','ex_cartoon','ex_chibi','girls4','tv','dragon','cats','port2','forest','duo','swords','outfits','port1']
IMGS_ORC   = ['avatar','ex_cartoon','ex_chibi','ex_cartoon_duo','ex_chibi_duo','ex_cenario',
              'tab_chibi_extras','tab_combos','tab_responde','tab_obs']

def fill(tpl, keys, extra=None):
    out = tpl.replace('{grass}', GRASS)
    for k in keys:
        out = out.replace('{' + k + '}', uri(k))
    for k, v in (extra or {}).items():
        out = out.replace('{' + k + '}', v)
    left = re.findall(r'\{([a-z_]+)\}', out)
    assert not left, left
    return out

def build(orc_url, index_url):
    meta = '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
    idx = ('<title>Anne Ilustradora</title>\n' + meta + '\n' + FONTS + '\n' + CSS + '\n'
           + fill(INDEX_BODY, IMGS_INDEX, {'orc_url': orc_url}) + '\n' + RISE_JS)
    orc = ('<title>Encomendas da Anne</title>\n' + meta + '\n' + FONTS + '\n' + CSS + '\n' + CSS_ORC + '\n'
           + fill(ORC_BODY, IMGS_ORC, {'index_url': index_url}) + '\n'
           + fill(ORC_JS, ['ex_cartoon','ex_chibi','ex_cartoon_duo','ex_chibi_duo','ex_cenario']) + '\n' + RISE_JS)
    open('index.html', 'w', encoding='utf-8').write(idx)
    open('orcamento.html', 'w', encoding='utf-8').write(orc)
    print('index.html   %.2f MB' % (len(idx.encode())/1048576))
    print('orcamento.html %.2f MB' % (len(orc.encode())/1048576))

if __name__ == '__main__':
    build(sys.argv[1] if len(sys.argv) > 1 else 'orcamento.html',
          sys.argv[2] if len(sys.argv) > 2 else 'index.html')
