/* ==========================================================
   Videojuegos: los secretos de la página (spoilers).
   1. Hierba alta (Pokémon Rojo): un combate en blanco y negro.
   2. Base de datos (Her Story): buscador de fragmentos.
   3. Barril (beat 'em up): se rompe a golpes y deja un premio al azar (o nada).
   4. (El sacrificio de LISA está en js/resena.js.)
   Textos en textos/videojuegos.md.
   ========================================================== */
(async () => {
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (id) => document.getElementById(id);
  // se leen con fetch + parsear (Textos.cargar volvería a sortear el pie de página)
  let t = {};
  try { const r = await fetch('../textos/videojuegos.md', { cache: 'no-cache' }); if (r.ok) t = Textos.parsear(await r.text()); } catch (e) {}
  const texto = (clave, defecto) => Textos.enLinea((t[clave] || defecto).replace(/\s*\n\s*/g, ' ').trim());
  const sacudir = (el) => { if (quieto) return; el.classList.remove('sacudida'); void el.offsetWidth; el.classList.add('sacudida'); };
  const main = document.querySelector('main');

  // ---------- 1. Hierba alta: pasar el cursor (o el dedo) por la hierba puede provocar un encuentro ----------
  const hierba = $('hierba'), combate = $('combate'), combateTexto = $('combate-texto'), menu = $('combate-menu');
  let recorrido = 0, ultimo = null, enCombate = false, escribiendo = null;
  const escribir = (html, luego) => {
    clearInterval(escribiendo);
    const plano = Object.assign(document.createElement('div'), { innerHTML: html }).textContent;
    if (quieto) { combateTexto.innerHTML = html; if (luego) luego(); return; }
    let n = 0; combateTexto.textContent = '';
    escribiendo = setInterval(() => { combateTexto.textContent = plano.slice(0, ++n); if (n >= plano.length) { clearInterval(escribiendo); combateTexto.innerHTML = html; if (luego) luego(); } }, 28);
  };
  const empezarCombate = () => {
    enCombate = true;
    document.body.classList.add('destello');
    setTimeout(() => {
      document.body.classList.remove('destello');
      document.documentElement.classList.add('gameboy');
      menu.hidden = true;
      combate.showModal();
      escribir(texto('hierba-aparece', '¡Un POLÍGONO salvaje apareció!'), () => { menu.hidden = false; menu.querySelector('button').focus(); });
    }, quieto ? 0 : 900);
  };
  const terminarCombate = () => { combate.close(); };
  // ▼ «Seguir»: los mensajes del ataque esperan a que el viajero termine de leer
  const seguir = $('combate-seguir');
  let alSeguir = null;
  const esperar = (despues) => { alSeguir = despues; seguir.hidden = false; seguir.focus(); };
  seguir.addEventListener('click', () => { seguir.hidden = true; const f = alSeguir; alSeguir = null; if (f) f(); });
  combate.addEventListener('close', () => { document.documentElement.classList.remove('gameboy'); enCombate = false; recorrido = 0; seguir.hidden = true; alSeguir = null; });
  // no se puede huir con Escape: sería demasiado fácil (pero mientras se lee el ataque, Escape no hace nada)
  combate.addEventListener('cancel', (e) => { e.preventDefault(); if (!menu.hidden) escribir(texto('hierba-huir', '¡No puedes huir de una reseña!')); });
  menu.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-accion]');
    if (!b) return;
    const accion = b.dataset.accion;
    if (accion === 'luchar') {
      menu.hidden = true;
      escribir(texto('hierba-luchar', 'Usaste PÍXEL A PÍXEL. ¡Es súper eficaz!'), () => esperar(() => {
        escribir(texto('hierba-final', '¡El POLÍGONO se deshizo en triangulitos!'), () => esperar(terminarCombate));
      }));
    } else if (accion === 'mochila') escribir(texto('hierba-mochila', 'En la mochila sólo hay un cartucho.'));
    else escribir(texto('hierba-huir', '¡No puedes huir de una reseña!'));
  });
  const pisar = (x, y) => {
    if (enCombate) return;
    if (ultimo) recorrido += Math.hypot(x - ultimo.x, y - ultimo.y);
    ultimo = { x, y };
    // cada 40 px de hierba recorrida, una probabilidad entre 30 de encuentro (baja: pasar por encima no debe molestar)
    while (recorrido > 40) {
      recorrido -= 40;
      if (Math.random() < 1 / 30) { empezarCombate(); return; }
    }
  };
  hierba.addEventListener('mousemove', (e) => pisar(e.clientX, e.clientY));
  hierba.addEventListener('mouseleave', () => { ultimo = null; });
  hierba.addEventListener('touchmove', (e) => pisar(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  hierba.addEventListener('touchend', () => { ultimo = null; });

  // ---------- 2. Base de datos: un clic (o un toque) en «1 jugador · 16 bits» ----------
  const base = $('base'), form = $('base-form'), q = $('base-q'), estado = $('base-estado'), resultados = $('base-resultados');
  const normal = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const fragmentos = (t['base-datos'] || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('- ')).map((l, i) => {
    const [fecha, ...resto] = l.slice(2).split('|');
    const cuerpo = resto.join('|').trim(), f = fecha.trim();
    const [d, m, a] = f.split('/').map(Number);
    return { n: i + 1, fecha: f, cuerpo, orden: (a * 10000 + m * 100 + d || 0) * 1000 + i, palabras: new Set(normal(cuerpo).split(/[^a-z0-9ñ]+/).filter(Boolean)) };
  }).sort((a, b) => a.orden - b.orden);
  const COMUNES = new Set(('a al el la lo los las le les un una uno unos unas y e o u de del en es son se que por para con sin no ni si mi me te tu su sus ya '
    + 'eso esto este esta estan ese esa aquel he ha hay mas muy todo toda todos todas pero como yo cada bien fue solo').split(' '));
  const vistos = new Set();
  const MAXIMO = 5; // como en el juego: sólo se ven los cinco primeros resultados
  // Quien busca «píxel» recibe una visita: el Gran Mago aparece en una nube de chispas y lo felicita
  const mago = $('mago-aparece'), magoTexto = $('mago-texto');
  // el mago, dibujado píxel a píxel (cada letra es un color; «.» es transparente)
  const DIBUJO = [
    '......M......',
    '.....MMM.....',
    '....MMMMM....',
    '...MMMMMMM...',
    '..MMMMMMMMM..',
    '.HHHHHHHHHHH.',
    '...SSSSSSS...',
    '...SOSSSOS..G',
    '...WWWWWWW..L',
    '..RWWWWWWWR.L',
    '.RRRWWWWWRRRL',
    '.RRRRWWWRRR.L',
    '.RRRRRRRRRR.L',
    '.RRRRRRRRRR.L',
    '..RRRRRRRR..L',
    '..RR....RR..L',
  ];
  const COLORES = { M: '#DA4EC7', H: '#7A1270', S: '#E8B07A', O: '#000', W: '#F3E7F1', R: '#0A7A8A', L: '#2C3F2E', G: '#DDFF00' };
  const P = 5; // tamaño de cada píxel del dibujo
  $('mago-dibujo').style.boxShadow = DIBUJO.flatMap((fila, y) => [...fila].map((c, x) => (COLORES[c] ? `${(x + 1) * P}px ${(y + 1) * P}px 0 ${COLORES[c]}` : null))).filter(Boolean).join(',');
  let escribiendoMago = null;
  const aparecerMago = () => {
    const html = texto('base-pixel-mago', 'Bien hecho, viajero. Me entendiste. Mereces mi sabiduría.');
    mago.hidden = false;
    mago.classList.remove('llega'); void mago.offsetWidth; mago.classList.add('llega');
    clearInterval(escribiendoMago);
    if (quieto) { magoTexto.innerHTML = html; return; }
    const plano = Object.assign(document.createElement('div'), { innerHTML: html }).textContent;
    let n = 0; magoTexto.textContent = '';
    setTimeout(() => {
      escribiendoMago = setInterval(() => { magoTexto.textContent = plano.slice(0, ++n); if (n >= plano.length) { clearInterval(escribiendoMago); magoTexto.innerHTML = html; } }, 32);
    }, 700);
  };
  const buscar = () => {
    const escritos = normal(q.value).split(/[^a-z0-9ñ]+/).filter(Boolean);
    if (escritos.some((p) => p.startsWith('pixel'))) aparecerMago(); else mago.hidden = true;
    // las palabras demasiado comunes no cuentan: así la confesión no sale buscando «y» o «de»
    const terminos = escritos.filter((p) => !COMUNES.has(p));
    if (!escritos.length) { estado.textContent = ''; resultados.innerHTML = ''; return; }
    if (!terminos.length) { estado.innerHTML = texto('base-palabra-comun', 'Esa palabra la dice todo el mundo, viajero.'); resultados.innerHTML = ''; return; }
    const hallados = fragmentos.filter((f) => terminos.every((p) => f.palabras.has(p)));
    hallados.slice(0, MAXIMO).forEach((f) => vistos.add(f.n));
    const visto = `Declaraciones vistas: ${vistos.size} de ${fragmentos.length}.`;
    if (!hallados.length) estado.innerHTML = `${texto('base-sin-resultados', 'El mago no dijo esa palabra.')} ${visto}`;
    else estado.textContent = `${hallados.length} ${hallados.length === 1 ? 'resultado' : 'resultados'}${hallados.length > MAXIMO ? ` · se muestran ${MAXIMO}` : ''}. ${visto}`;
    resultados.innerHTML = hallados.slice(0, MAXIMO).map((f) => `<li><span class="base-clip">Declaración ${String(f.n).padStart(2, '0')} · ${Textos.enLinea(f.fecha)}</span>${Textos.enLinea(f.cuerpo)}</li>`).join('');
  };
  // Una sola palabra y corta: se quitan los espacios y lo que no sea letra o número mientras se escribe
  const LARGO = 20;
  const limpiar = () => {
    const limpio = q.value.replace(/[^\p{L}\p{N}]/gu, '').slice(0, LARGO);
    if (limpio !== q.value) q.value = limpio;
  };
  q.addEventListener('input', limpiar);
  form.addEventListener('submit', (e) => { e.preventDefault(); limpiar(); buscar(); });
  const abrirBase = () => {
    if (base.open) return;
    if (!q.value) q.value = (t['base-inicial'] || 'dimensiones').trim().toUpperCase();
    base.showModal();
    buscar();
    q.focus(); q.select();
  };
  $('base-cerrar').addEventListener('click', () => base.close());
  const hud = $('hud-derecha');
  // no tiene pinta de botón (es el secreto), así que basta un clic
  hud.addEventListener('click', abrirBase);

  // ---------- 3. Barril: tres golpes y sale un premio al azar ----------
  // «- clave | mensaje» en «## barril-premios»; la estatuilla (súper coleccionable) sale 1 de cada 25 veces.
  const PREMIOS = ['pollo', 'monedas', 'tuberia', 'vida', 'pergamino', 'pixel', 'nada', 'estatuilla'];
  const premios = (t['barril-premios'] || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('- ')).map((l) => {
    const i = l.indexOf('|');
    return i > 0 ? { clave: l.slice(2, i).trim().toLowerCase(), mensaje: l.slice(i + 1).trim() } : null;
  }).filter((p) => p && PREMIOS.includes(p.clave) && p.mensaje);
  if (!premios.length) premios.push({ clave: 'pollo', mensaje: '+100 de vida.' });
  const sortearPremio = () => {
    const raro = premios.find((p) => p.clave === 'estatuilla');
    const comunes = premios.filter((p) => p.clave !== 'estatuilla');
    if (raro && (Math.random() < 1 / 25 || !comunes.length)) return raro;
    return comunes[Math.floor(Math.random() * comunes.length)];
  };
  const barril = $('barril');
  let golpes = 0;
  const flotar = (el, html, clase) => {
    const r = el.getBoundingClientRect();
    const p = document.createElement('span');
    p.className = `flotante ${clase || ''}`;
    p.innerHTML = html;
    p.style.left = `${r.left + r.width / 2}px`; p.style.top = `${r.top}px`;
    document.body.append(p);
    setTimeout(() => p.remove(), 1200);
  };
  barril.addEventListener('click', () => {
    if (barril.classList.contains('roto')) return;
    golpes++;
    sacudir(barril);
    flotar(barril, golpes < 3 ? '¡PAF!' : 'COMBO ×3', golpes < 3 ? '' : 'combo');
    if (golpes < 3) return;
    barril.classList.add('roto');
    barril.setAttribute('aria-label', 'Un barril roto');
    sacudir(main);
    const premio = document.createElement('p');
    premio.className = 'secreto-premio';
    premio.setAttribute('role', 'status');
    const p = sortearPremio();
    if (p.clave === 'estatuilla') premio.classList.add('raro');
    premio.innerHTML = `${p.clave === 'nada' ? '' : `<span class="premio-icono premio-${p.clave}" aria-hidden="true"></span>`}${Textos.enLinea(p.mensaje)}`;
    $('galeria-titulo').after(premio);
  });

  // «GO! →»: parpadea una vez la primera vez que la galería aparece en pantalla
  const go = $('go');
  if (window.IntersectionObserver) {
    const vigia = new IntersectionObserver((entradas) => {
      if (!entradas.some((e) => e.isIntersecting) || document.body.classList.contains('esperando')) return;
      vigia.disconnect();
      go.classList.add('activo');
      setTimeout(() => go.classList.remove('activo'), 2600);
    }, { threshold: 0.3 });
    vigia.observe($('galeria'));
  }
})();
