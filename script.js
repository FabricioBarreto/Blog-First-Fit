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

// Simulador paso a paso del ejemplo First-Fit (5 huecos, 3 procesos).
(function(){
  var H1_FREE = {l:'H1', s:100, t:'free'};
  var H2_FREE = {l:'H2', s:500, t:'free'};
  var H3_FREE = {l:'H3', s:200, t:'free'};
  var H4_FREE = {l:'H4', s:300, t:'free'};
  var H5_FREE = {l:'H5', s:600, t:'free'};
  var P1_PROC = {l:'P1', s:212, t:'proc'};
  var P2_PROC = {l:'P2', s:417, t:'proc'};
  var P3_PROC = {l:'P3', s:112, t:'proc'};
  var H2_FRAG_288 = {l:'H2 (resto)', s:288, t:'frag'};
  var H2_FRAG_176 = {l:'H2 (resto)', s:176, t:'frag'};
  var H5_FRAG_183 = {l:'H5 (resto)', s:183, t:'frag'};

  var afterP1 = [H1_FREE, P1_PROC, H2_FRAG_288, H3_FREE, H4_FREE, H5_FREE];
  var afterP2 = [H1_FREE, P1_PROC, H2_FRAG_288, H3_FREE, H4_FREE, P2_PROC, H5_FRAG_183];
  var afterP3 = [H1_FREE, P1_PROC, P3_PROC, H2_FRAG_176, H3_FREE, H4_FREE, P2_PROC, H5_FRAG_183];

  var STEPS = [
    { blocks:[H1_FREE,H2_FREE,H3_FREE,H4_FREE,H5_FREE], incoming:null, narration:'Estado inicial: cinco huecos libres (H1 a H5) y tres procesos por ubicar, en el orden P1, P2 y P3.' },
    { blocks:[H1_FREE,H2_FREE,H3_FREE,H4_FREE,H5_FREE], incoming:{n:'P1',s:212}, narration:'Llega P1, que necesita 212 KB. First-Fit empieza a recorrer los huecos desde el principio de la memoria.' },
    { blocks:[H1_FREE,H2_FREE,H3_FREE,H4_FREE,H5_FREE], incoming:{n:'P1',s:212}, hi:0, hs:'rejected', narration:'Revisa H1 (100 KB): no alcanza para P1 (212 KB). Sigue con el siguiente hueco.' },
    { blocks: afterP1, hi:1, hs:'accepted', incoming:null, narration:'Revisa H2 (500 KB): sí alcanza. First-Fit se detiene ahí mismo, ubica a P1 y deja un fragmento libre de 288 KB. Nunca llega a mirar H3, H4 ni H5.' },
    { blocks: afterP1, incoming:{n:'P2',s:417}, narration:'Llega P2, que necesita 417 KB. La búsqueda vuelve a empezar desde H1.' },
    { blocks: afterP1, hi:0, hs:'rejected', incoming:{n:'P2',s:417}, narration:'Revisa H1 (100 KB): no alcanza para P2 (417 KB).' },
    { blocks: afterP1, hi:2, hs:'rejected', incoming:{n:'P2',s:417}, narration:'Revisa el fragmento de H2 (288 KB): no alcanza.' },
    { blocks: afterP1, hi:3, hs:'rejected', incoming:{n:'P2',s:417}, narration:'Revisa H3 (200 KB): no alcanza.' },
    { blocks: afterP1, hi:4, hs:'rejected', incoming:{n:'P2',s:417}, narration:'Revisa H4 (300 KB): no alcanza. Ojo: 300 KB es el hueco que mejor hubiera ajustado, pero First-Fit no compara, solo sigue de largo.' },
    { blocks: afterP2, hi:5, hs:'accepted', incoming:null, narration:'Revisa H5 (600 KB): sí alcanza. Ubica a P2 ahí y deja un fragmento libre de 183 KB.' },
    { blocks: afterP2, incoming:{n:'P3',s:112}, narration:'Llega P3, que necesita 112 KB. La búsqueda arranca otra vez desde H1.' },
    { blocks: afterP2, hi:0, hs:'rejected', incoming:{n:'P3',s:112}, narration:'Revisa H1 (100 KB): no alcanza para P3 (112 KB), por poco.' },
    { blocks: afterP3, hi:2, hs:'accepted', incoming:null, narration:'Revisa el fragmento de H2 (288 KB): sí alcanza. Ubica a P3 ahí mismo y deja un nuevo fragmento libre de 176 KB.' },
    { blocks: afterP3, incoming:null, narration:'Estado final: H1, H3 y H4 quedan completamente libres e intactos (First-Fit nunca los revisó). Toda la ocupación - y los dos fragmentos, de 176 KB y 183 KB - quedó concentrada en H2 y H5, los únicos huecos que sí llegó a usar.' }
  ];

  var track = document.getElementById('simTrack');
  var incomingEl = document.getElementById('simIncoming');
  var narrationEl = document.getElementById('simNarration');
  var stepLabel = document.getElementById('simStepLabel');
  var prevBtn = document.getElementById('simPrev');
  var nextBtn = document.getElementById('simNext');
  if (track) {
    var idx = 0;

    var render = function(){
      var step = STEPS[idx];
      var total = step.blocks.reduce(function(sum,b){ return sum + b.s; }, 0);
      track.innerHTML = '';
      step.blocks.forEach(function(b, i){
        var el = document.createElement('div');
        el.className = 'sim-block ' + b.t + (i === step.hi ? ' ' + step.hs : '');
        el.style.flex = '0 0 ' + (b.s/total*100) + '%';
        el.innerHTML = '<span class="sim-block-label">' + b.l + '</span><span class="sim-block-size">' + b.s + ' KB</span>';
        track.appendChild(el);
      });
      incomingEl.innerHTML = step.incoming ? ('Proceso en espera: <span class="chip">' + step.incoming.n + ' &middot; ' + step.incoming.s + ' KB</span>') : '&nbsp;';
      narrationEl.textContent = step.narration;
      stepLabel.textContent = 'Paso ' + (idx+1) + ' de ' + STEPS.length;
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === STEPS.length - 1;
    };

    prevBtn.addEventListener('click', function(){ if (idx > 0){ idx--; render(); } });
    nextBtn.addEventListener('click', function(){ if (idx < STEPS.length - 1){ idx++; render(); } });
    render();
  }
})();

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
