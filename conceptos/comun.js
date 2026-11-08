/* Utilidades compartidas de las pruebas de concepto */
const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Revelado palabra a palabra. <p class="revelar" data-inicio="800" data-ritmo="45"> */
(() => {
  let acumulado = 0;
  document.querySelectorAll('.revelar').forEach((el) => {
    const inicio = el.dataset.inicio ? parseInt(el.dataset.inicio, 10) : acumulado;
    const ritmo = parseInt(el.dataset.ritmo || '40', 10);
    const texto = el.textContent.trim();
    const palabras = texto.split(/\s+/);
    el.setAttribute('aria-label', texto);
    el.textContent = '';
    palabras.forEach((p, i) => {
      const s = document.createElement('span');
      s.className = 'palabra';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = p;
      s.style.setProperty('--d', (inicio + i * ritmo) + 'ms');
      el.append(s, ' ');
    });
    acumulado = inicio + palabras.length * ritmo + 400;
  });
})();

/* Descifrado: el texto llega como símbolos y se resuelve letra a letra.
   <h1 data-descifrar data-inicio="600">Texto</h1> */
(() => {
  const GLIFOS = '☉☽♄♃♂♀☿△▽◇⊕∴∵ΣΔΦΨΩ0123456789#%&§†‡';
  document.querySelectorAll('[data-descifrar]').forEach((el) => {
    const final = el.textContent;
    el.setAttribute('aria-label', final);
    if (quieto) return;
    const inicio = parseInt(el.dataset.inicio || '0', 10);
    const duracion = parseInt(el.dataset.duracion || '2200', 10);
    const azar = () => GLIFOS[Math.floor(Math.random() * GLIFOS.length)];
    el.textContent = final.replace(/\S/g, azar);
    setTimeout(() => {
      const t0 = performance.now();
      const paso = (t) => {
        const progreso = Math.min(1, (t - t0) / duracion);
        const fijas = Math.floor(progreso * final.length);
        el.textContent = final.split('').map((c, i) => (i < fijas || c === ' ' ? c : azar())).join('');
        if (progreso < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    }, inicio);
  });
})();

/* Máquina de escribir. <p data-escribir data-inicio="500" data-ritmo="45">Texto</p> */
(() => {
  document.querySelectorAll('[data-escribir]').forEach((el) => {
    const final = el.textContent;
    el.setAttribute('aria-label', final);
    if (quieto) return;
    el.textContent = '';
    const inicio = parseInt(el.dataset.inicio || '0', 10);
    const ritmo = parseInt(el.dataset.ritmo || '45', 10);
    let i = 0;
    setTimeout(function escribir() {
      el.textContent = final.slice(0, ++i);
      if (i < final.length) setTimeout(escribir, ritmo + Math.random() * ritmo);
    }, inicio);
  });
})();

/* Revelado bajo demanda: para textos que llegan tras una interacción.
   revelarAhora(contenedor) convierte cada .revelar-tarde dentro del contenedor. */
function revelarAhora(contenedor, inicio = 200) {
  let acumulado = inicio;
  contenedor.querySelectorAll('.revelar-tarde').forEach((el) => {
    const ritmo = parseInt(el.dataset.ritmo || '34', 10);
    const texto = el.textContent.trim();
    const palabras = texto.split(/\s+/);
    el.classList.add('revelar');
    el.setAttribute('aria-label', texto);
    el.textContent = '';
    palabras.forEach((p, i) => {
      const s = document.createElement('span');
      s.className = 'palabra';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = p;
      s.style.setProperty('--d', (acumulado + i * ritmo) + 'ms');
      el.append(s, ' ');
    });
    acumulado += palabras.length * ritmo + 400;
  });
  return acumulado;
}

/* Lienzo a pantalla completa con redibujado seguro. */
function lienzo(id, dibujar, preparar) {
  const c = document.getElementById(id);
  if (!c) return;
  const ctx = c.getContext('2d');
  const estado = { W: 0, H: 0 };
  const ajustar = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    estado.W = window.innerWidth; estado.H = window.innerHeight;
    if (!estado.W || !estado.H) return;
    c.width = estado.W * dpr; c.height = estado.H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (preparar) preparar(ctx, estado);
    if (quieto) dibujar(ctx, estado, 0);
  };
  window.addEventListener('resize', ajustar);
  ajustar();
  if (!quieto) {
    const bucle = (t) => { if (estado.W && estado.H) dibujar(ctx, estado, t); requestAnimationFrame(bucle); };
    requestAnimationFrame(bucle);
  }
}
