/* ==========================================================
   No ficción: briefing que se autodestruye y archivo de expedientes.
   El último expediente publicado está «en custodia»: un minijuego al
   azar (js/minijuegos.js) tapa su tarjeta y al ganarlo se abre el
   artículo. Los demás son «evidencia recolectada» y se abren directo.
   Textos en textos/no-ficcion.md.
   ========================================================== */
(async () => {
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const textos = await Textos.cargar('../textos/no-ficcion.md');
  // Los textos de los «Expedientes Χ» viven en su propio archivo; se suman a los de la página.
  // (fetch + parsear: no hay elementos data-texto que rellenar con ellos.)
  try {
    const r = await fetch('../textos/expedientes-x.md', { cache: 'no-cache' });
    if (r.ok) Object.assign(textos, Textos.parsear(await r.text()));
  } catch (e) { /* sin el archivo, simplemente no hay Expedientes Χ */ }
  const $ = (id) => document.getElementById(id);
  const informe = $('informe'), archivo = $('archivo'), aviso = $('aviso'), mecha = $('mecha');
  const plano = (clave, defecto) => Textos.enLinea((textos[clave] || defecto).replace(/\s*\n\s*/g, ' ').trim());
  // Barra de arriba: canal al azar (0–255) y un cifrado al azar de la lista «## cifrados»
  const hudCanal = $('hud-canal');
  if (hudCanal) {
    const cifrados = (textos.cifrados || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());
    const cifrado = cifrados.length ? cifrados[Math.floor(Math.random() * cifrados.length)] : 'AES-256';
    hudCanal.textContent = hudCanal.textContent.replace('{canal}', String(Math.floor(Math.random() * 256))).replace('{cifrado}', cifrado);
  }

  // articulo.js deja esta marca al pulsar «Volver al archivo»: así no se repite el briefing
  const CLAVE_VOLVER = 'db-no-ficcion-volver';

  // ---------- Archivo de expedientes ----------
  const lista = $('lista');
  // En «## expedientes» va solo el nombre de cada archivo de textos/no-ficcion/ (sin .md).
  // Título, subtítulo, categoría y fecha se leen del propio .md del artículo.
  // (Se lee con fetch + parsear, no con Textos.cargar: cargar escribiría el «titulo» del artículo en el de esta página.)
  const filas = (textos.expedientes || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());
  const una = (t) => (t || '').replace(/\s*\n\s*/g, ' ').trim();
  const leerArticulo = async (nombre) => {
    if (!/^[a-z0-9-]+$/i.test(nombre)) return null;
    try {
      const r = await fetch(`../textos/no-ficcion/${nombre}.md`, { cache: 'no-cache' });
      if (!r.ok) return null;
      const a = Textos.parsear(await r.text());
      if (!a.titulo) return null;
      const fecha = una(a.fecha);
      const [d, mes, an] = fecha.split('/').map(Number);
      return { destino: nombre, titulo: una(a.titulo), subtitulo: una(a.subtitulo), categoria: una(a.categoria), fecha, orden: an * 10000 + mes * 100 + d || 0 };
    } catch (e) { return null; }
  };
  // ordenados por fecha, el más reciente arriba; el número de expediente va por antigüedad (el primero publicado es el 001)
  // Los «Expedientes Χ» (## expedientes-x) son los textos fundacionales: no entran en la fila por fecha,
  // van fijados abajo del archivo. Cada línea: «- nombre» o «- nombre · minijuego».
  const fundacionales = (textos['expedientes-x'] || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('- '))
    .map((l) => { const [nombre, juego = ''] = l.slice(2).split('·').map((x) => x.trim()); return { nombre, juego }; });
  const nombresX = fundacionales.map((f) => f.nombre);
  const expedientes = (await Promise.all(filas.filter((n) => !nombresX.includes(n)).map(leerArticulo))).filter(Boolean).sort((a, b) => b.orden - a.orden);
  // también por fecha, el más reciente arriba; el número (χ-001…) va por antigüedad, como en el archivo
  const expedientesX = (await Promise.all(fundacionales.map(async (f) => { const a = await leerArticulo(f.nombre); return a && { ...a, juego: f.juego }; }))).filter(Boolean).sort((a, b) => b.orden - a.orden);

  // el más reciente queda en custodia
  const custodia = expedientes[0] || null;
  const enlace = (e) => `articulo.html?id=${encodeURIComponent(e.destino)}`;

  const html = expedientes.map((e, i) => {
    const numero = String(expedientes.length - i).padStart(3, '0');
    const cuerpo = `<span class="cabecera"><span>Expediente ${numero} · ${Textos.enLinea(e.categoria)}</span><span class="estado${e === custodia ? ' custodia' : ''}">${e === custodia ? plano('estado-custodia', 'En custodia') : plano('estado-evidencia', 'Evidencia recolectada')}</span></span>
      <span class="titulo">${Textos.enLinea(e.titulo)}</span>
      <span class="subtitulo">${Textos.enLinea(e.subtitulo)}</span>
      <span class="meta">${Textos.enLinea(e.fecha)}</span>`;
    if (e === custodia) {
      return `<li><div class="expediente en-custodia" id="custodia">
        <div class="custodia-ficha">${cuerpo}</div>
        <div class="custodia-capa" id="capa"></div>
      </div></li>`;
    }
    return `<li><a class="expediente" href="${enlace(e)}">${cuerpo}</a></li>`;
  }).join('');

  lista.innerHTML = html;

  // ---------- Páginas, con flechas y deslizando el dedo ----------
  // La primera lleva 3 (el minijuego ocupa sitio); las demás, 4.
  // Se ocultan y muestran las tarjetas (no se vuelven a dibujar) para no reiniciar el minijuego.
  const EN_LA_PRIMERA = 3, EN_LAS_DEMAS = 4;
  const paginaDe = (i) => (i < EN_LA_PRIMERA ? 0 : 1 + Math.floor((i - EN_LA_PRIMERA) / EN_LAS_DEMAS));
  const tarjetas = [...lista.children];
  const totalPaginas = tarjetas.length ? paginaDe(tarjetas.length - 1) + 1 : 1;
  if (totalPaginas > 1) {
    const nav = document.createElement('nav');
    nav.className = 'paginador';
    nav.setAttribute('aria-label', 'Páginas del archivo');
    nav.innerHTML = `<button type="button" class="pagina-anterior" aria-label="Expedientes más recientes">←</button>
      <span class="pagina-actual" aria-live="polite"></span>
      <button type="button" class="pagina-siguiente" aria-label="Expedientes más antiguos">→</button>`;
    lista.after(nav);
    const anterior = nav.querySelector('.pagina-anterior'), siguiente = nav.querySelector('.pagina-siguiente'), actual = nav.querySelector('.pagina-actual');
    let pagina = 0;
    const ir = (nueva, direccion) => {
      if (nueva < 0 || nueva >= totalPaginas) return;
      pagina = nueva;
      tarjetas.forEach((li, i) => { li.hidden = paginaDe(i) !== pagina; });
      actual.textContent = `Página ${pagina + 1} de ${totalPaginas}`;
      anterior.disabled = pagina === 0;
      siguiente.disabled = pagina === totalPaginas - 1;
      if (direccion) {
        lista.classList.remove('desde-derecha', 'desde-izquierda'); void lista.offsetWidth;
        lista.classList.add(direccion > 0 ? 'desde-derecha' : 'desde-izquierda');
      }
    };
    anterior.addEventListener('click', () => ir(pagina - 1, -1));
    siguiente.addEventListener('click', () => ir(pagina + 1, 1));
    // deslizar en pantallas táctiles (sin estorbar al desplazamiento vertical)
    let x0 = null, y0 = null;
    lista.addEventListener('touchstart', (e) => { if (e.target.closest('input, button')) return; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    lista.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) ir(pagina + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
    ir(0);
  }

  // ---------- Tarjetas con minijuego (el expediente en custodia y los Expedientes Χ) ----------
  // Al ganar (o al llegar los refuerzos) el artículo no se abre solo: se disfruta la victoria y se pulsa «Leer».
  // Al fallar, un mensaje corto y el juego vuelve a empezar; al tercer fallo llegan los refuerzos.
  const conMinijuego = (tarjeta, capa, destino, primerJuego, { estadoAlGanar = 'Acceso concedido' } = {}) => {
    const estado = tarjeta.querySelector('.estado');
    const estadoInicial = estado.innerHTML, clasesEstado = estado.className;
    let juego = primerJuego, detener = () => {}, fallos = 0, reintento;
    // conservar: el juego deja su propio desenlace a la vista y sólo se añade el botón (lo usa la pirámide)
    const abrir = (mensaje, { conservar = false } = {}) => {
      if (!conservar) detener();
      tarjeta.classList.add('superado');
      if (estadoAlGanar) { estado.textContent = estadoAlGanar; estado.classList.remove('custodia'); }
      const leer = `<a class="boton" href="${enlace(destino)}">${plano('custodia-leer', 'Leer el expediente')}</a>`;
      if (conservar) capa.insertAdjacentHTML('beforeend', `<div class="juego-leer">${leer}</div>`);
      else {
        capa.className = 'custodia-capa resultado';
        capa.innerHTML = `<p class="juego-resultado exito" role="status">${mensaje}</p>${leer}`;
      }
      capa.querySelector('a.boton').focus({ preventScroll: true });
    };
    const empezar = () => {
      detener();
      clearTimeout(reintento);
      tarjeta.classList.remove('superado');
      estado.innerHTML = estadoInicial; estado.className = clasesEstado;
      capa.className = `custodia-capa capa-${juego}`;
      detener = Minijuegos.jugar(juego, capa, textos, {
        // ganar puede traer su propio mensaje (la pirámide dice con cuánto dinero huyó)
        ganar: (mensaje, opciones) => abrir(mensaje || plano('juego-exito', 'Acceso concedido, agente.'), opciones),
        // juegos que cuentan sus propios errores (la contraseña) llaman aquí al tercero
        refuerzos: () => abrir(plano('juego-refuerzos', 'Llegaron los refuerzos.')),
        perder: (mensaje) => {
          detener();
          fallos++;
          // al tercer fallo llegan los refuerzos: ese mensaje se queda, para leerlo con calma
          if (fallos >= 3) { abrir(plano('juego-refuerzos', 'Llegaron los refuerzos.')); return; }
          // los demás fallos: mensaje corto y el juego vuelve a empezar solo
          const conFoco = tarjeta.contains(document.activeElement);
          tarjeta.classList.remove('alarma'); void tarjeta.offsetWidth; tarjeta.classList.add('alarma');
          capa.className = 'custodia-capa resultado';
          capa.innerHTML = `<p class="juego-resultado" role="status">${mensaje || plano('juego-fallo', 'Misión fallida.')}</p>`;
          if (conFoco) { capa.tabIndex = -1; capa.focus({ preventScroll: true }); }
          reintento = setTimeout(() => {
            empezar();
            if (conFoco) { const b = capa.querySelector('button, input'); if (b) b.focus({ preventScroll: true }); }
          }, mensaje ? 3200 : 2200);
        },
      });
    };
    empezar();
    return { juego: () => juego, cambiar: (nuevo) => { juego = nuevo; fallos = 0; empezar(); } };
  };

  // Expediente en custodia: un minijuego al azar lo tapa
  const tarjeta = $('custodia');
  if (tarjeta) {
    const custodiaJuego = conMinijuego(tarjeta, $('capa'), custodia, Minijuegos.elegir()); // uno por visita

    // PROVISIONAL: botones para ver cada minijuego. Solo salen en localhost (o con ?probar en la dirección).
    const probando = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || new URLSearchParams(location.search).has('probar');
    if (probando) {
      const barra = document.createElement('div');
      barra.className = 'probador';
      barra.innerHTML = '<span>Probar minijuego (solo en localhost):</span> ' +
        Minijuegos.nombres.map((n) => `<button type="button" data-juego="${n}" aria-pressed="${n === custodiaJuego.juego()}">${Minijuegos.etiquetas[n]}</button>`).join('');
      lista.before(barra);
      barra.addEventListener('click', (e) => {
        const b = e.target.closest('[data-juego]');
        if (!b) return;
        barra.querySelectorAll('[data-juego]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        custodiaJuego.cambiar(b.dataset.juego);
      });
    }
  }

  // Expedientes Χ: fijados abajo del archivo (en todas las páginas), con cinta de escena y sello.
  // χ es la ji griega: como los expedientes X, pero sin alienígenas. Los que tienen minijuego lo llevan encima.
  if (expedientesX.length) {
    const seccion = document.createElement('section');
    seccion.className = 'expedientes-x';
    seccion.setAttribute('aria-labelledby', 'expedientes-x-titulo');
    // la ji (χ) va aparte para que el texto en mayúsculas no la convierta en Χ, que es idéntica a una X
    const ji = (html) => html.replace(/[χΧ]/g, '<span class="ji">χ</span>');
    seccion.innerHTML = `<h3 id="expedientes-x-titulo">${ji(plano('expedientes-x-titulo', 'Expedientes χ'))}</h3>
      <p class="expedientes-x-intro">${plano('expedientes-x-intro', 'Lo inexplicable de la vida real. Sin alienígenas.')}</p>`;
    expedientesX.forEach((e, i) => {
      const ficha = `<span class="cabecera"><span>Expediente ${ji('χ')}-${String(expedientesX.length - i).padStart(3, '0')} · ${Textos.enLinea(e.categoria)}</span><span class="estado sello-x">${plano('expedientes-x-sello', 'Inexplicable')}</span></span>
        <span class="titulo">${Textos.enLinea(e.titulo)}</span>
        <span class="subtitulo">${Textos.enLinea(e.subtitulo)}</span>
        <span class="meta">${Textos.enLinea(e.fecha)}</span>`;
      if (e.juego && Minijuegos.todos.includes(e.juego)) {
        const tarjetaX = document.createElement('div');
        tarjetaX.className = 'expediente en-custodia expediente-x';
        tarjetaX.innerHTML = `<div class="custodia-ficha">${ficha}</div><div class="custodia-capa"></div>`;
        seccion.appendChild(tarjetaX);
        // el sello sigue diciendo «Inexplicable» aunque se gane
        conMinijuego(tarjetaX, tarjetaX.querySelector('.custodia-capa'), e, e.juego, { estadoAlGanar: null });
      } else {
        seccion.insertAdjacentHTML('beforeend', `<a class="expediente expediente-x" href="${enlace(e)}">${ficha}</a>`);
      }
    });
    $('repetir').parentElement.before(seccion);
  }

  // ---------- Briefing ----------
  const mostrarArchivo = () => {
    informe.hidden = true;
    mecha.classList.add('apagada');
    archivo.hidden = false;
  };
  const homenaje = $('homenaje');
  let hecho = false;
  function autodestruir() {
    if (hecho) return; hecho = true;
    if (homenaje) homenaje.hidden = false; // «inspirada en Misión Imposible», debajo de la cuenta atrás
    const plantilla = (textos.cuenta || 'Este mensaje se autodestruirá en {n}').trim();
    let s = 3;
    aviso.textContent = plantilla.replace('{n}', s);
    const cuenta = setInterval(() => {
      s--;
      if (s > 0) { aviso.textContent = plantilla.replace('{n}', s); return; }
      clearInterval(cuenta);
      informe.classList.add('destruir');
      setTimeout(() => { informe.classList.remove('destruir'); mostrarArchivo(); $('archivo-titulo').focus({ preventScroll: true }); }, quieto ? 0 : 900);
    }, quieto ? 10 : 1000);
  }
  $('aceptar').addEventListener('click', autodestruir);

  // Siempre hay briefing al llegar, salvo al volver de un artículo
  let volviendo = false;
  try { volviendo = sessionStorage.getItem(CLAVE_VOLVER) === '1'; sessionStorage.removeItem(CLAVE_VOLVER); } catch (e) {}
  const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if (nav && nav.type === 'back_forward') volviendo = true;
  if (volviendo) { hecho = true; mostrarArchivo(); }
  else setTimeout(autodestruir, 14000); // si nadie acepta, la mecha decide

  $('repetir').addEventListener('click', () => location.reload());

  // Tachados: en pantallas táctiles se revelan al tocarlos
  document.addEventListener('click', (e) => { const t = e.target.closest('.tachado'); if (t) t.classList.toggle('visto'); });
})();
