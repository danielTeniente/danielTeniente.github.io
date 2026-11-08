/* ==========================================================
   Noche: cielo casi vacío, bancos de niebla que se desplazan,
   luces rojas de señal a lo lejos y la linterna del cursor.
   Uso: <canvas id="cielo" data-densidad="1" data-niebla="1" data-faros="1"></canvas>
   ========================================================== */
(() => {
  const canvas = document.getElementById('cielo');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const raiz = document.documentElement;
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const densidad = parseFloat(canvas.dataset.densidad || '1');
  const intensidadNiebla = parseFloat(canvas.dataset.niebla || '1');
  const conFaros = canvas.dataset.faros !== '0';

  let W = 0, H = 0, dpr = 1;
  let estrellas = [];
  let bancos = []; // capas de niebla pre-renderizadas
  let faros = [];
  let px = 0, py = 0, tx = 0, ty = 0; // paralaje

  const azar = (a, b) => a + Math.random() * (b - a);

  // Pocas estrellas, apagadas, sobre todo en la parte alta: la ciudad no deja ver más
  function crearEstrellas() {
    const total = Math.round((W * H) / 9000 * densidad);
    estrellas = Array.from({ length: total }, () => {
      const y = Math.pow(Math.random(), 1.8) * H * 0.75;
      return {
        x: Math.random() * W,
        y,
        r: azar(0.3, 1.0),
        capa: Math.random() < 0.8 ? 0 : 1,
        base: azar(0.15, 0.55) * (1 - y / H),
        fase: Math.random() * Math.PI * 2,
        vel: azar(0.0002, 0.0008),
      };
    });
  }

  // Un banco de niebla: manchas suaves que se repiten en horizontal sin costura
  function crearBanco(alturaCentro, grosor, cantidad, alfa, tono) {
    const lienzo = document.createElement('canvas');
    lienzo.width = W * dpr; lienzo.height = H * dpr;
    const f = lienzo.getContext('2d');
    f.scale(dpr, dpr);
    for (let i = 0; i < cantidad; i++) {
      const x = Math.random() * W;
      const y = alturaCentro * H + azar(-grosor, grosor) * H;
      const r = azar(0.18, 0.42) * Math.max(W, H * 1.2);
      const a = alfa * azar(0.5, 1) * intensidadNiebla;
      for (const dx of [-W, 0, W]) {
        const g = f.createRadialGradient(x + dx, y, 0, x + dx, y, r);
        g.addColorStop(0, `rgba(${tono},${a})`);
        g.addColorStop(0.6, `rgba(${tono},${a * 0.35})`);
        g.addColorStop(1, `rgba(${tono},0)`);
        f.fillStyle = g;
        f.fillRect(0, 0, W, H);
      }
    }
    return lienzo;
  }

  function crearNiebla() {
    bancos = [
      { img: crearBanco(0.82, 0.12, 14, 0.07, '70,120,78'),  vel: 0.006, desfase: 0 },
      { img: crearBanco(0.62, 0.10, 10, 0.045, '150,95,140'), vel: 0.011, desfase: W * 0.4 },
      { img: crearBanco(0.35, 0.18, 6,  0.025, '80,110,85'), vel: 0.004, desfase: W * 0.7 },
    ];
  }

  // Luces de señal: rojas, lejanas, latiendo despacio
  function crearFaros() {
    if (!conFaros) { faros = []; return; }
    faros = [
      { x: 0.14, y: 0.71, periodo: 4200, fase: 0 },
      { x: 0.86, y: 0.69, periodo: 4200, fase: 2100 },
      { x: 0.63, y: 0.58, periodo: 5600, fase: 900, r: 0.7 },
    ];
  }

  function redimensionar() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!W || !H) { bancos = []; return; } // ventana oculta: esperar al siguiente resize
    crearEstrellas();
    crearNiebla();
    crearFaros();
    if (quieto) dibujar(0);
  }

  function dibujar(t) {
    if (!W || !H) return;
    ctx.fillStyle = '#09110A';
    ctx.fillRect(0, 0, W, H);

    px += (tx - px) * 0.03;
    py += (ty - py) * 0.03;

    // estrellas
    for (const s of estrellas) {
      const prof = (s.capa + 1) * 5;
      const x = (((s.x + px * prof) % W) + W) % W;
      const y = s.y + py * prof;
      const brillo = quieto ? s.base : s.base * (0.7 + 0.3 * Math.sin(t * s.vel + s.fase));
      ctx.fillStyle = `rgba(243,231,241,${brillo})`;
      ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill();
    }

    // faros (bajo la niebla más alta, sobre la más baja)
    for (const f of faros) {
      const pulso = quieto ? 0.8 : 0.5 + 0.5 * Math.pow(Math.max(0, Math.sin(((t + f.fase) / f.periodo) * Math.PI * 2)), 3);
      const x = f.x * W + px * 3, y = f.y * H + py * 3;
      const escala = (f.r || 1) * Math.min(1, W / 900 + 0.35);
      const halo = ctx.createRadialGradient(x, y, 0, x, y, 38 * escala);
      halo.addColorStop(0, `rgba(218,78,199,${0.38 * pulso})`);
      halo.addColorStop(0.3, `rgba(218,78,199,${0.10 * pulso})`);
      halo.addColorStop(1, 'rgba(218,78,199,0)');
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(x, y, 38 * escala, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(245,150,230,${0.55 + 0.45 * pulso})`;
      ctx.beginPath(); ctx.arc(x, y, 1.8 * escala, 0, Math.PI * 2); ctx.fill();
    }

    // niebla que se desplaza
    for (const b of bancos) {
      const off = quieto ? b.desfase : (b.desfase + t * b.vel + px * 8) % W;
      const x = -((off % W) + W) % W;
      ctx.drawImage(b.img, x, py * 4, W, H);
      ctx.drawImage(b.img, x + W, py * 4, W, H);
    }
  }

  function bucle(t) { dibujar(t); requestAnimationFrame(bucle); }

  // La linterna: el cursor ilumina lo oculto
  function mover(e) {
    const x = e.clientX, y = e.clientY;
    raiz.style.setProperty('--x', x + 'px');
    raiz.style.setProperty('--y', y + 'px');
    tx = (x / W - 0.5) * -2;
    ty = (y / H - 0.5) * -2;
  }
  window.addEventListener('pointermove', mover, { passive: true });
  window.addEventListener('pointerdown', mover, { passive: true });
  window.addEventListener('resize', redimensionar);

  redimensionar();
  if (!quieto) requestAnimationFrame(bucle);
})();

/* ==========================================================
   Revelado: divide el texto en palabras que aparecen
   como si la señal llegara poco a poco.
   Uso: <p class="revelar" data-inicio="800" data-ritmo="45">
   ========================================================== */
(() => {
  const bloques = document.querySelectorAll('.revelar');
  let acumulado = 0;
  bloques.forEach((el) => {
    const inicio = el.dataset.inicio ? parseInt(el.dataset.inicio, 10) : acumulado;
    const ritmo = parseInt(el.dataset.ritmo || '45', 10);
    const palabras = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.textContent = '';
    palabras.forEach((p, i) => {
      const s = document.createElement('span');
      s.className = 'palabra';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = p;
      s.style.setProperty('--d', (inicio + i * ritmo) + 'ms');
      el.appendChild(s);
      el.appendChild(document.createTextNode(' '));
    });
    acumulado = inicio + palabras.length * ritmo + 500;
  });
})();
