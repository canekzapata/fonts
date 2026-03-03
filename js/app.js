// ──────────────────────────────────────────────────────────
// 0) Persistir y recuperar semilla de localStorage
const STORAGE_KEY = 'pixelSequencerSeed';
let seed = localStorage.getItem(STORAGE_KEY);
if (!seed) {
  seed = 45398669963;                     // semilla por defecto la primera vez
  localStorage.setItem(STORAGE_KEY, seed);
}
seed = Number(seed);

// 1) Añade AL TOPE tu PRNG con seed:
// ──────────────────────────────────────────────────────────
function mulberry32(a) {
  return function() {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

let rng = mulberry32(seed);
function setSeed(n) {
  seed = Number(n) || 0;
  localStorage.setItem(STORAGE_KEY, seed);
  rng = mulberry32(seed);
  Math.random = rng;
  console.log(`🔢 Semilla actualizada a ${seed}`);
}

// Inicializa PRNG inmediatamente
setSeed(seed);

// Función random usando el PRNG
function random(max) {
  return Math.floor(Math.random() * max);
}
// ──────────────────────────────────────────────────────────

// Ahora tu app en sí:
console.log("app");

$(document).ready(function() {

   function loadGrammar(name) {
   $("#output").html("");
      // Si quieres reproducir siempre la misma frase al recargar gramática,
       // descomenta la siguiente línea:
     // setSeed(seed);
     // ¡Resiembramos justo aquí para que la expansión sea idéntica!
     setSeed(seed);

   var grammar = tracery.createGrammar(grammars[name]);
   $("#grammar").html(grammar.toText());
   for (var i = 0; i < 1; i++) {
     var s = grammar.flatten("#origin#");
      console.log(s);
      var div = $("<div/>", {
        class: "outputSample",
        html: s
      });
      $("#output").append(div);
    }
  }

  setTimeout(function() { loadGrammar("e"); }, 30);
  $('#grammarSelect').on('change', function() {
    loadGrammar(this.value);
  });
});


// Hacemos accesible la función de resembrar y relanzar la app desde afuera
window.reseedAndRestart = function(newSeed) {
  // 1) Actualiza la semilla y persístela si quieres
  setSeed(newSeed);

  // 2) Reinicia el estado de la animación
  canvasAnimationStarted = false;
  frameCount            = 0;
  particles             = [];
  distortions           = [];
  

  // 3) Vuelve a recargar el texto y arranca
  loadGrammar($('#grammarSelect').val() || 'e');
};

