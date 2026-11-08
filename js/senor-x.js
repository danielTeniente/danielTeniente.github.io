/* ==========================================================
   Portada «La Página de Daniel DB»: carga los textos de
   textos/portada.md y anima la marquesina, el contador, el reproductor que no suena y las chispas.
   ========================================================== */
(async () => {
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const textos = await Textos.cargar('textos/portada.md');

  // Marquesina: estado del artista del mes + una frase según la hora del visitante
  const marquesina = document.getElementById('marquesina');
  if (marquesina && textos.marquesina) {
    const lista = (t) => (t || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());
    const ahora = new Date(), h = ahora.getHours();
    const hora = String(h).padStart(2, '0') + ':' + String(ahora.getMinutes()).padStart(2, '0');
    // franjas "- DESDE a HASTA: frase"; pueden cruzar la medianoche (22 a 3)
    let visitante = '';
    lista(textos['marquesina-visitante']).forEach((l) => {
      const m = l.match(/^(\d{1,2})\s*a\s*(\d{1,2})\s*:\s*(.+)$/i);
      if (!m || visitante) return;
      const desde = parseInt(m[1], 10) % 24, hasta = parseInt(m[2], 10) % 24;
      const dentro = desde < hasta ? (h >= desde && h < hasta) : (h >= desde || h < hasta);
      if (dentro) visitante = m[3].replace(/\{hora\}/g, hora);
    });
    const piezas = lista(textos.marquesina).map((p) => p.replace('{visitante}', visitante)).filter(Boolean);
    if (piezas.length) {
      const texto = '*** ' + piezas.join(' *** ') + ' ***';
      marquesina.textContent = texto;
      marquesina.parentElement.setAttribute('aria-label', 'Estado del artista: ' + piezas.map((p) => p.replace(/[.\s]+$/, '')).join('. ') + '.');
      marquesina.style.animationDuration = Math.max(14, texto.length * 0.13) + 's';
    }
  }

  // El contador sube uno por visita en este navegador
  const contador = document.getElementById('contador');
  if (contador) {
    let n = 347;
    try { n = parseInt(localStorage.getItem('db-visitas') || '346', 10) + 1; localStorage.setItem('db-visitas', String(n)); } catch (e) {}
    contador.innerHTML = String(n).padStart(6, '0').split('').map((c) => `<i>${c}</i>`).join('');
    contador.setAttribute('aria-label', `Contador de visitas: ${n}`);
  }

  // El reproductor MIDI que no reproduce nada (sus frases vienen del .md)
  const play = document.getElementById('play'), pista = document.getElementById('pista');
  if (play) {
    let lineas = ['cancion.mid', 'cargando… (módem de 56k)', 'cargando… {fibonacci}', 'error: esta canción solo se puede escuchar en vivo'];
    if (textos.reproductor) lineas = textos.reproductor.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const cancion = lineas[0], frases = lineas.slice(1);
    const barra = document.getElementById('barra-carga'), relleno = barra ? barra.querySelector('i') : null;
    pista.textContent = cancion;
    const espera = (ms) => new Promise((r) => setTimeout(r, ms));
    // {fibonacci}: la carga avanza 1, 1, 2, 3, 5, 8… % hasta pasarse de largo
    const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597];
    let enCurso = false;
    play.addEventListener('click', async () => {
      if (enCurso) return; enCurso = true;
      for (const frase of frases) {
        if (frase.includes('{fibonacci}')) {
          if (barra) barra.hidden = false;
          for (const n of FIBONACCI) {
            pista.textContent = frase.replace('{fibonacci}', n + '%');
            if (relleno) { relleno.style.width = Math.min(n, 100) + '%'; barra.classList.toggle('pasada', n > 100); }
            await espera(n > 100 ? 450 : 320);
          }
        } else {
          // la barra desaparece cuando llega el error
          if (barra && /^error/i.test(frase)) barra.hidden = true;
          pista.textContent = frase;
          // los errores se quedan más tiempo para que se puedan leer
          await espera(/^error/i.test(frase) ? 4500 : 1300);
        }
      }
      if (barra) { barra.hidden = true; barra.classList.remove('pasada'); if (relleno) relleno.style.width = '0'; }
      pista.textContent = cancion;
      enCurso = false;
    });
  }

  // Ventanas estilo Windows 95: la arroba (easter egg) y el libro de visitas
  let origen = null;
  const abrir = (ventana, desde) => { origen = desde; ventana.hidden = false; ventana.querySelector('.ventana-boton').focus(); };
  const cerrar = (ventana) => { ventana.hidden = true; if (origen) origen.focus(); };
  document.querySelectorAll('.ventana-fondo').forEach((v) => {
    v.querySelectorAll('[data-cerrar]').forEach((b) => b.addEventListener('click', () => cerrar(v)));
    v.addEventListener('click', (e) => { if (e.target === v) cerrar(v); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.ventana-fondo:not([hidden])').forEach(cerrar);
  });
  const arroba = document.getElementById('arroba');
  if (arroba) arroba.addEventListener('click', () => abrir(document.getElementById('secreto'), arroba));
  // los enlaces #firmar y #leer del libro de visitas vienen del .md
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#firmar"], a[href="#leer"]');
    if (!a) return;
    e.preventDefault();
    const ventana = document.getElementById(a.getAttribute('href') === '#firmar' ? 'ventana-firmar' : 'ventana-leer');
    // otro motivo al azar en cada intento, sin tocar el resto de la página
    if (a.getAttribute('href') === '#firmar' && textos['firmar-aviso']) Textos.formatear(document.getElementById('firmar-aviso'), textos['firmar-aviso']);
    abrir(ventana, a);
  });

  // Estela de chispas tras el cursor
  if (!quieto) {
    let ultimo = 0;
    const colores = ['#FF1FE1', '#DDFF00', '#00DDFF', '#FFFFFF'];
    window.addEventListener('pointermove', (e) => {
      if (e.timeStamp - ultimo < 40) return; ultimo = e.timeStamp;
      const s = document.createElement('span');
      s.className = 'chispa'; s.textContent = '✦'; s.setAttribute('aria-hidden', 'true');
      s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
      s.style.color = colores[Math.floor(Math.random() * colores.length)];
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }, { passive: true });
  }
})();
