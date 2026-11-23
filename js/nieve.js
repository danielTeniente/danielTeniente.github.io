/* ==========================================================
   Nieve hecha de caracteres, para el lanzamiento de Ficción.
   Nieve.caer(contenedor, { cantidad }) llena el contenedor de copos
   que caen. Con «reducir movimiento» la nieve se queda quieta.
   ========================================================== */
const Nieve = (() => {
  const COPOS = ['✻', '✼', '❄', '·', '*', '✽', '·', '·'];
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const azar = (a, b) => a + Math.random() * (b - a);

  function caer(caja, { cantidad = 46 } = {}) {
    caja.innerHTML = '';
    for (let i = 0; i < cantidad; i++) {
      const el = document.createElement('span');
      el.className = 'copo';
      el.textContent = COPOS[i % COPOS.length];
      el.style.left = `${azar(0, 98)}%`;
      el.style.fontSize = `${azar(0.6, 1.4)}rem`;
      el.style.setProperty('--deriva', `${azar(-3, 3)}rem`);
      el.style.animationDuration = `${azar(7, 16)}s`;
      el.style.animationDelay = `${-azar(0, 16)}s`; // ya está nevando al llegar
      if (quieto) el.style.top = `${azar(2, 92)}%`;
      el.setAttribute('aria-hidden', 'true');
      caja.append(el);
    }
  }
  return { caer };
})();
