/* ==========================================================
   Videojuegos: pantalla de título, caja de diálogo, selección de
   partida (reseñas) y galería de pixel art.
   Textos en textos/videojuegos.md; reseñas en textos/videojuegos/;
   dibujos en imagenes/pixel-art/.
   ========================================================== */
(async () => {
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (id) => document.getElementById(id);
  const textos = await Textos.cargar('../textos/videojuegos.md');
  const una = (t) => (t || '').replace(/\s*\n\s*/g, ' ').trim();
  const lista = (t) => (t || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());

  // ---------- Caja de diálogo: START la abre; cada párrafo de «## intro» es una página ----------
  const dialogo = $('dialogo'), texto = $('dialogo-texto'), flecha = $('dialogo-flecha');
  const paginas = [...$('intro').querySelectorAll('p')].map((p) => p.innerHTML);
  let pagina = -1, escribiendo = null;
  const terminar = () => { clearInterval(escribiendo); escribiendo = null; texto.innerHTML = paginas[pagina]; flecha.classList.remove('espera'); };
  function mostrar(i) {
    pagina = i; flecha.classList.add('espera'); clearInterval(escribiendo);
    if (quieto) { terminar(); return; }
    // se escribe letra a letra, como en un RPG (con el formato ya aplicado al terminar)
    const plano = Object.assign(document.createElement('div'), { innerHTML: paginas[i] }).textContent;
    let n = 0; texto.textContent = '';
    escribiendo = setInterval(() => { texto.textContent = plano.slice(0, ++n); if (n >= plano.length) terminar(); }, 32);
  }
  // Hasta terminar la bienvenida solo se ve la pantalla de título (body.esperando oculta lo demás).
  // Al volver de una reseña («Volver a la selección» o el botón atrás) no hace falta repetirla.
  const CLAVE_VOLVER = 'db-videojuegos-volver';
  let volviendo = false;
  try { volviendo = sessionStorage.getItem(CLAVE_VOLVER) === '1'; sessionStorage.removeItem(CLAVE_VOLVER); } catch (e) {}
  const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if (nav && nav.type === 'back_forward') volviendo = true;
  const destapar = () => document.body.classList.remove('esperando');
  if (volviendo) { destapar(); if (location.hash === '#resenas') $('resenas').scrollIntoView(); }

  function avanzar() {
    if (escribiendo) { terminar(); return; }
    if (pagina + 1 < paginas.length) { mostrar(pagina + 1); return; }
    // al acabar el diálogo aparece todo y se baja a la selección de partida
    destapar();
    $('resenas').scrollIntoView({ behavior: quieto ? 'auto' : 'smooth' });
    $('resenas-titulo').focus({ preventScroll: true });
  }
  $('start').addEventListener('click', () => {
    document.body.classList.add('jugando');
    dialogo.hidden = false;
    if (paginas.length) mostrar(0); else avanzar();
    flecha.focus({ preventScroll: true });
  });
  // clic en cualquier parte de la caja; con el teclado, Enter o espacio sobre la flecha (que tiene el foco)
  dialogo.addEventListener('click', avanzar);
  flecha.addEventListener('click', (e) => { e.stopPropagation(); avanzar(); });

  // ---------- El camino cortado: al intentar pasar, el obrero dice una frase (en orden; la última se repite) ----------
  const obraTexto = $('obra-texto'), obraDialogo = $('obra-dialogo');
  const frasesObra = lista(textos['obra-dialogo']);
  if (!frasesObra.length) frasesObra.push('Alto ahí, viajero. La torre del mago está en construcción.');
  let fraseObra = 0, escribiendoObra = null;
  $('obra-paso').addEventListener('click', () => {
    const html = Textos.enLinea(frasesObra[Math.min(fraseObra, frasesObra.length - 1)]);
    fraseObra++;
    obraDialogo.hidden = false;
    clearInterval(escribiendoObra);
    if (quieto) { obraTexto.innerHTML = html; return; }
    const plano = Object.assign(document.createElement('div'), { innerHTML: html }).textContent;
    let n = 0; obraTexto.textContent = '';
    escribiendoObra = setInterval(() => { obraTexto.textContent = plano.slice(0, ++n); if (n >= plano.length) { clearInterval(escribiendoObra); obraTexto.innerHTML = html; } }, 28);
  });

  // ---------- Cabecera de las reseñas: una pareja «Título | frase» al azar en cada visita ----------
  const parejas = lista(textos['resenas-cabecera']).map((l) => l.split('|').map((x) => x.trim())).filter(([t, f]) => t && f);
  if (parejas.length) {
    const [titulo, frase] = parejas[Math.floor(Math.random() * parejas.length)];
    $('resenas-titulo').innerHTML = Textos.enLinea(titulo);
    $('resenas-intro').innerHTML = Textos.enLinea(frase);
  }

  // ---------- Selección de partida: una reseña por archivo de textos/videojuegos/ ----------
  // (Se lee con fetch + parsear, no con Textos.cargar: cargar escribiría el «titulo» de la reseña en el de esta página.)
  const leerResena = async (nombre) => {
    if (!/^[a-z0-9-]+$/i.test(nombre)) return null;
    try {
      const r = await fetch(`../textos/videojuegos/${nombre}.md`, { cache: 'no-cache' });
      if (!r.ok) return null;
      const a = Textos.parsear(await r.text());
      if (!a.titulo) return null;
      const fecha = una(a.fecha);
      const [d, mes, an] = fecha.split('/').map(Number);
      return { nombre, titulo: una(a.titulo), subtitulo: una(a.subtitulo), ficha: una(a.ficha), fecha, orden: an * 10000 + mes * 100 + d || 0 };
    } catch (e) { return null; }
  };
  const resenas = (await Promise.all(lista(textos.resenas).map(leerResena))).filter(Boolean).sort((a, b) => b.orden - a.orden);
  // el número de partida va por antigüedad (la primera reseña es la 01)
  $('partidas').innerHTML = resenas.map((r, i) => `<li><a class="partida" href="resena.html?id=${encodeURIComponent(r.nombre)}">
      <span class="partida-cabecera"><span>Partida ${String(resenas.length - i).padStart(2, '0')}</span><span>${Textos.enLinea(r.fecha)}</span></span>
      <span class="partida-ficha">${Textos.enLinea(r.ficha)}</span>
      <span class="partida-titulo">${Textos.enLinea(r.titulo)}</span>
      <span class="partida-subtitulo">${Textos.enLinea(r.subtitulo)}</span>
    </a></li>`).join('');
  $('resenas-vacio').hidden = resenas.length > 0;

  // ---------- Galería: «- archivo.png | Título | nota | ms» ----------
  // Una animación son fotogramas sueltos: «carpeta/dibujo_{0-3}.png» = dibujo_0.png … dibujo_3.png.
  // El cuarto campo (opcional) es cuánto dura cada fotograma, en milisegundos.
  // «### Título» abre una subsección (una serie aparte); la línea siguiente sin «- » es su descripción.
  const RUTA = /^[\w .()-]+(\/[\w .()-]+)*\.(png|gif|webp|jpe?g)$/i;
  const leerCuadro = (l) => {
    const [archivo = '', titulo = '', nota = '', ms = ''] = l.split('|').map((x) => x.trim());
    const rango = archivo.match(/\{(\d+)-(\d+)\}/);
    const nombres = [];
    if (rango) for (let n = Number(rango[1]); n <= Number(rango[2]) && nombres.length < 60; n++) nombres.push(archivo.replace(rango[0], n));
    else nombres.push(archivo);
    if (!nombres.length || !nombres.every((n) => RUTA.test(n) && !n.includes('..'))) return null;
    return { fotogramas: nombres.map((n) => `../imagenes/pixel-art/${encodeURI(n)}`), titulo, nota, ms: Math.max(60, parseInt(ms, 10) || 250) };
  };
  const grupos = [{ titulo: '', descripcion: '', cuadros: [] }];
  for (const linea of (textos.galeria || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)) {
    if (linea.startsWith('### ')) grupos.push({ titulo: linea.slice(4).trim(), descripcion: '', cuadros: [] });
    else if (linea.startsWith('- ')) { const c = leerCuadro(linea.slice(2).trim()); if (c) grupos[grupos.length - 1].cuadros.push(c); }
    else { const g = grupos[grupos.length - 1]; if (g.titulo) g.descripcion += (g.descripcion ? ' ' : '') + linea; }
  }
  const cuadros = [];
  const galeria = $('cuadros');
  galeria.innerHTML = grupos.filter((g) => g.cuadros.length).map((g) => {
    const lista = g.cuadros.map((c) => {
      cuadros.push(c);
      return `<li><button type="button" class="cuadro" data-i="${cuadros.length - 1}">
      <span class="marco"><img src="${c.fotogramas[0]}" alt="${Textos.enLinea(c.titulo).replace(/<[^>]+>/g, '')}"></span>
      <span class="cuadro-titulo">${Textos.enLinea(c.titulo)}</span>
    </button></li>`;
    }).join('');
    if (!g.titulo) return `<ul class="galeria">${lista}</ul>`;
    return `<section class="serie"><h3>${Textos.enLinea(g.titulo)}</h3>${g.descripcion ? `<p class="serie-descripcion">${Textos.enLinea(g.descripcion)}</p>` : ''}<ul class="galeria grande">${lista}</ul></section>`;
  }).join('');
  $('galeria-vacia').hidden = cuadros.length > 0;

  // Tamaño del «píxel» del dibujo: si se exportó ya agrandado (32×32 guardado a 512×512), cada píxel mide 16.
  // Se calcula una vez por dibujo mirando dónde cambia el color.
  const mcd = (a, b) => (b ? mcd(b, a % b) : a);
  const tamPixel = (img) => {
    if (img.dataset.px) return Number(img.dataset.px);
    let g = 0;
    try {
      const W = img.naturalWidth, H = img.naturalHeight, lienzo = document.createElement('canvas');
      lienzo.width = W; lienzo.height = H;
      const cx = lienzo.getContext('2d', { willReadFrequently: true });
      cx.drawImage(img, 0, 0);
      const d = new Uint32Array(cx.getImageData(0, 0, W, H).data.buffer);
      g = mcd(W, H);
      for (let y = 0; y < H && g > 1; y += 3) for (let x = 1; x < W; x++) if (d[y * W + x] !== d[y * W + x - 1]) g = mcd(g, x);
      for (let x = 0; x < W && g > 1; x += 3) for (let y = 1; y < H; y++) if (d[y * W + x] !== d[(y - 1) * W + x]) g = mcd(g, y);
    } catch (e) { g = 1; }
    img.dataset.px = String(g || 1);
    return g || 1;
  };
  // Agrandar sin difuminar: un número entero de veces el tamaño real del dibujo (cada píxel, un cuadrado igual)
  const escalar = (img, ancho, alto) => {
    if (!img.naturalWidth || ancho <= 0) return;
    const px = tamPixel(img), w = img.naturalWidth / px, h = img.naturalHeight / px;
    const n = Math.min(ancho / w, alto / h);
    const veces = n >= 1 ? Math.floor(n) : n; // si no cabe ni a tamaño real, se encoge lo justo
    img.style.width = `${Math.round(w * veces)}px`;
    img.style.height = `${Math.round(h * veces)}px`;
  };
  const marcos = [...galeria.querySelectorAll('.marco')];
  const ajustarGaleria = () => marcos.forEach((m) => {
    const img = m.querySelector('img');
    const ajustar = () => escalar(img, m.clientWidth - 16, m.clientHeight - 16);
    if (img.complete) ajustar(); else img.addEventListener('load', ajustar, { once: true });
  });
  // se recalcula cuando cambia el ancho (también al aparecer la galería tras la bienvenida)
  if (window.ResizeObserver) new ResizeObserver(ajustarGaleria).observe(galeria);
  else { ajustarGaleria(); addEventListener('resize', ajustarGaleria); }

  // Animaciones: se cargan todos los fotogramas antes de empezar y se cambian cada «ms»
  const animar = (img, c) => {
    if (quieto || c.fotogramas.length < 2) return () => {};
    let f = 0, reloj = null, vivo = true;
    Promise.all(c.fotogramas.map((src) => new Promise((ok) => { const p = new Image(); p.onload = p.onerror = ok; p.src = src; }))).then(() => {
      if (vivo) reloj = setInterval(() => { f = (f + 1) % c.fotogramas.length; img.src = c.fotogramas[f]; }, c.ms);
    });
    return () => { vivo = false; clearInterval(reloj); };
  };
  marcos.forEach((m, i) => animar(m.querySelector('img'), cuadros[i]));

  // Visor en grande
  const visor = $('visor'), visorImg = $('visor-img');
  let pararVisor = () => {};
  const ajustarVisor = () => escalar(visorImg, Math.min(innerWidth * 0.86, 900), innerHeight * 0.66);
  galeria.addEventListener('click', (e) => {
    const b = e.target.closest('.cuadro');
    if (!b) return;
    const c = cuadros[Number(b.dataset.i)];
    pararVisor();
    visorImg.style.width = visorImg.style.height = '';
    delete visorImg.dataset.px;
    visorImg.onload = () => { visorImg.onload = null; ajustarVisor(); };
    visorImg.src = c.fotogramas[0]; visorImg.alt = b.querySelector('img').alt;
    $('visor-titulo').innerHTML = Textos.enLinea(c.titulo);
    $('visor-nota').innerHTML = Textos.enLinea(c.nota);
    pararVisor = animar(visorImg, c);
    visor.showModal();
  });
  visor.addEventListener('close', () => pararVisor());
  $('visor-cerrar').addEventListener('click', () => visor.close());
  visor.addEventListener('click', (e) => { if (e.target === visor) visor.close(); }); // clic fuera del dibujo
  addEventListener('resize', () => { if (visor.open) ajustarVisor(); });
})();
