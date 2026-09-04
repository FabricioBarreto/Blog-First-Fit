// Autoevaluación: revelar respuesta correcta/incorrecta al elegir una opción.
document.querySelectorAll('.quiz-card').forEach(function(card){
  var opts = card.querySelectorAll('.opt');
  var explain = card.querySelector('.explain');
  opts.forEach(function(btn){
    btn.addEventListener('click', function(){
      if (card.dataset.answered) return;
      card.dataset.answered = 'true';
      opts.forEach(function(o){
        o.disabled = true;
        if (o.dataset.correct === 'true') o.classList.add('correct');
        else if (o === btn) o.classList.add('wrong');
      });
      explain.classList.add('show');
    });
  });
});

// Resalta en la navegación la sección visible.
var links = Array.prototype.slice.call(document.querySelectorAll('nav.toc a'));
var map = {};
links.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });
if ('IntersectionObserver' in window){
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var link = map[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) links.forEach(function(l){ l.classList.remove('active'); }), link.classList.add('active');
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  document.querySelectorAll('main section[id]').forEach(function(s){ obs.observe(s); });
}
