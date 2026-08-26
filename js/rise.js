(function(){
  var q=function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};
  if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window){
    q("section, footer").forEach(function(e){e.classList.add("rise");});
    var io=new IntersectionObserver(function(en){en.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{rootMargin:"0px 0px -8% 0px"});
    q(".rise").forEach(function(e){io.observe(e);});
  }
})();
