/* ==========================================================
   Videojuegos: paisaje en píxeles de fondo (concepto «Cartucho»).
   Tres horas según el reloj del visitante:
     mañana (6–12)  cielo cian claro, sol lima y nubes, montes rosa y magenta
     tarde  (12–19) hora dorada lima: de magenta a lima, sol blanco tras montes magenta
     noche  (19–6)  noche cian: cian oscuro que brilla en el horizonte, luna rosa, estrellas lima
   Para ver una hora concreta: ?hora=manana, ?hora=tarde o ?hora=noche.
   La hora se marca en <html data-hora="…"> para que el CSS cambie las ventanas.
   Se dibuja a baja resolución y se escala sin difuminar.
   Con «reducir movimiento» queda quieto.
   ========================================================== */
const Paisaje = (() => {
  const HORAS = {
    // M3c · amanecer con montes rosados: cielo cian claro, sol lima (en el lado opuesto a la luna), montes rosa y magenta
    manana: {
      cielo: ['#5FC2D6', '#86D2E0', '#ADE0E8', '#D2ECEE', '#EAF6F4', '#F6FBF2'],
      astro: { x: 0.2, y: 0.16, r: 10, luz: '#DDFF00', borde: '#BAC954', detras: false },
      nubes: { color: '#FFFFFF', sombra: '#C2E4E8' },
      estrellas: false,
      montes: ['#F6B4EE', '#DA4EC7', '#7A1270'],
    },
    // T2 · hora dorada lima: de magenta arriba a lima en el horizonte; montes magenta oscuro
    tarde: {
      cielo: ['#8C0E7E', '#B0249A', '#DA4EC7', '#E8B07A', '#DDFF00', '#EEFF6A', '#F2FF9A'],
      horizonte: 0.62, // las franjas acaban antes: el lima queda a la vista sobre los montes
      astro: { x: 0.7, y: 0.56, r: 22, luz: '#FFFFFF', borde: '#F2FF9A', detras: true },
      nubes: { color: '#F3E7F1', sombra: '#C0359E' },
      estrellas: false,
      montes: ['#6B1660', '#3E0A3A', '#1A0418'],
    },
    // N2 · noche cian: cian muy oscuro que brilla en el horizonte, luna rosa y estrellas lima
    noche: {
      cielo: ['#011012', '#021A1E', '#03262C', '#06404A', '#0A6070', '#0A7A8A', '#00DDFF'],
      astro: { x: 0.8, y: 0.16, r: 7, luz: '#FBD3F3', borde: '#DA4EC7', detras: false },
      nubes: null,
      estrellas: ['#DDFF00', '#FFFFFF'], // casi todas lima, alguna blanca
      montes: ['#0D4A55', '#06303A', '#010A0C'],
    },
  };
  const deReloj = (h = new Date().getHours()) => (h >= 6 && h < 12 ? 'manana' : h >= 12 && h < 19 ? 'tarde' : 'noche');
  const pedida = new URLSearchParams(location.search).get('hora');
  let hora = HORAS[pedida] ? pedida : deReloj();
  document.documentElement.dataset.hora = hora;

  const c = document.getElementById('paisaje');
  const ctx = c && c.getContext('2d');
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ESCALA = 4;
  let capas = [], estrellas = [], nubes = [];

  function preparar() {
    if (!c) return;
    const W = Math.ceil(innerWidth / ESCALA), H = Math.ceil(innerHeight / ESCALA);
    if (!W || !H) return;
    c.width = W; c.height = H; ctx.imageSmoothingEnabled = false;
    estrellas = Array.from({ length: 80 }, () => ({ x: Math.random() * W, y: Math.random() * H * 0.6, f: Math.random() * 6, cian: Math.random() < 0.15 }));
    nubes = Array.from({ length: 7 }, () => ({ x: Math.random() * W * 1.5, y: 4 + Math.random() * H * 0.4, w: 10 + Math.floor(Math.random() * 18), v: 0.002 + Math.random() * 0.004 }));
    // montes: una línea de cumbres al azar, el doble de ancha que la pantalla para poder desplazarla
    const montes = (base, amp, paso, vel) => {
      const p = []; let y = base;
      for (let x = 0; x <= W * 2; x += paso) { y = Math.max(base - amp, Math.min(base + amp * 0.3, y + (Math.random() - 0.5) * amp * 0.6)); p.push(Math.round(y)); }
      return { p, paso, vel };
    };
    capas = [montes(H * 0.62, H * 0.12, 6, 0.05), montes(H * 0.74, H * 0.1, 4, 0.12), montes(H * 0.86, H * 0.06, 3, 0.25)];
  }

  // sol o luna: un círculo de píxeles con el borde (o la sombra de la luna) de otro color
  function astro(W, H, a) {
    const cx = Math.round(W * a.x), cy = Math.round(H * a.y), r = a.r;
    for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) {
      const d = xx * xx + yy * yy;
      if (d > r * r) continue;
      const borde = hora === 'noche' ? xx + yy > 4 : d > (r - 1.5) * (r - 1.5);
      ctx.fillStyle = borde ? a.borde : a.luz;
      ctx.fillRect(cx + xx, cy + yy, 1, 1);
    }
  }

  function dibujar(t) {
    if (!c) return;
    const W = c.width, H = c.height;
    if (!W) return;
    const p = HORAS[hora];
    // cielo en franjas, de arriba al horizonte
    const alto = H * (p.horizonte || 0.78) / p.cielo.length;
    p.cielo.forEach((color, i) => { ctx.fillStyle = color; ctx.fillRect(0, Math.floor(i * alto), W, H); });
    if (p.estrellas) for (const s of estrellas) {
      if (Math.sin(t * 0.003 + s.f) > -0.3) { ctx.fillStyle = p.estrellas[s.cian ? 1 : 0]; ctx.fillRect(Math.round(s.x), Math.round(s.y), 1, 1); }
    }
    if (p.astro.detras) astro(W, H, p.astro); // el sol de la tarde se esconde tras los montes
    if (p.nubes) for (const n of nubes) {
      const x = Math.round(((n.x + t * n.v) % (W + 40)) - 30), y = Math.round(n.y);
      ctx.fillStyle = p.nubes.color;
      ctx.fillRect(x, y, n.w, 3);
      ctx.fillRect(x + 2, y - 2, n.w - 6, 2);
      ctx.fillRect(x + 4, y - 3, Math.round(n.w * 0.35), 1);
      ctx.fillStyle = p.nubes.sombra;
      ctx.fillRect(x + 1, y + 3, n.w - 2, 1);
    }
    if (!p.astro.detras) astro(W, H, p.astro);
    capas.forEach((capa, i) => {
      const off = (t * capa.vel / 16) % W;
      ctx.fillStyle = p.montes[i];
      capa.p.forEach((y, j) => { const x = Math.round(j * capa.paso - off); if (x > -capa.paso && x < W) ctx.fillRect(x, y, capa.paso, H - y); });
    });
  }

  if (c) {
    preparar();
    addEventListener('resize', () => { preparar(); if (quieto) dibujar(0); });
    if (quieto) dibujar(0);
    else (function bucle(t) { dibujar(t); requestAnimationFrame(bucle); })(0);
  }

  // cambiar de hora sin recargar (lo usa la barra de prueba)
  function poner(nueva) {
    if (!HORAS[nueva]) return;
    hora = nueva;
    document.documentElement.dataset.hora = hora;
    if (quieto) dibujar(0);
  }

  // PROVISIONAL: botones para ver cada hora. Solo salen en localhost (o con ?probar en la dirección).
  const probando = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || new URLSearchParams(location.search).has('probar');
  if (probando && c) {
    const barra = document.createElement('div');
    barra.className = 'probador';
    const nombres = { manana: 'Mañana', tarde: 'Tarde', noche: 'Noche' };
    barra.innerHTML = '<span>Hora (solo en localhost):</span> ' + Object.keys(HORAS).map((h) => `<button type="button" data-hora="${h}" aria-pressed="${h === hora}">${nombres[h]}</button>`).join('');
    document.body.append(barra);
    barra.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-hora]');
      if (!b) return;
      poner(b.dataset.hora);
      barra.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    });
  }

  return { poner, hora: () => hora };
})();
