/* ==========================================================
   Videojuegos: lectura de una reseña.
   resena.html?id=nombre  →  textos/videojuegos/nombre.md
   Secciones del .md: titulo, subtitulo, ficha, fecha, original (solo de referencia, no se muestra), cuerpo.
   ========================================================== */
(async () => {
  const $ = (id) => document.getElementById(id);
  const id = new URLSearchParams(location.search).get('id') || '';
  const leer = async (ruta) => {
    try { const r = await fetch(ruta, { cache: 'no-cache' }); return r.ok ? Textos.parsear(await r.text()) : {}; } catch (e) { return {}; }
  };
  // Solo nombres de archivo simples: nada de rutas raras
  const a = /^[a-z0-9-]+$/i.test(id) ? await leer(`../textos/videojuegos/${id}.md`) : {};
  const general = await leer('../textos/videojuegos.md');
  const plano = (t) => (t || '').replace(/\s*\n\s*/g, ' ').trim();

  // Al volver a la selección desde aquí no se repite la bienvenida (videojuegos.js lee esta marca)
  document.querySelectorAll('a[href^="index.html"]').forEach((enlace) => enlace.addEventListener('click', () => {
    try { sessionStorage.setItem('db-videojuegos-volver', '1'); } catch (e) {}
  }));

  if (!a.titulo) {
    $('estado').textContent = 'Error de lectura';
    $('titulo').textContent = 'Partida no encontrada';
    $('cuerpo').innerHTML = '<p>Los datos guardados están dañados. O la pila del cartucho se agotó, o esta partida nunca existió.</p>';
    $('guardar').hidden = true;
    return;
  }

  document.title = `${plano(a.titulo)} — Daniel DB`;
  $('titulo').innerHTML = Textos.enLinea(plano(a.titulo));
  $('subtitulo').innerHTML = Textos.enLinea(plano(a.subtitulo));
  $('ficha').innerHTML = Textos.enLinea(plano(a.ficha));
  $('fecha').innerHTML = Textos.enLinea(plano(a.fecha));

  // Cuerpo: bloques separados por línea en blanco (mismo formato que los artículos de No ficción)
  const bloques = (a.cuerpo || '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  $('cuerpo').innerHTML = bloques.map((b) => {
    if (b.startsWith('### ')) return `<h2>${Textos.enLinea(b.slice(4).trim())}</h2>`;
    if (/^-{3,}$/.test(b)) return '<hr>';
    // ![texto alternativo](imagenes/carpeta/foto.png) solo en su párrafo: una imagen (rutas desde la raíz de la web)
    const img = b.match(/^!\[([^\]]*)\]\(([\w./-]+\.(?:png|jpe?g|gif|webp))\)$/i);
    if (img && !img[2].includes('..')) {
      const alt = Textos.enLinea(img[1]).replace(/<[^>]+>/g, '');
      return `<figure class="foto"><img src="../${img[2]}" alt="${alt}" loading="lazy"></figure>`;
    }
    // [Título](enlace de YouTube) solo en su párrafo: el vídeo. No se carga nada de YouTube hasta pulsar «play».
    const yt = b.match(/^\[([^\]]+)\]\(https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})[^)\s]*\)$/);
    if (yt) {
      // un televisor pequeño de los de antes; el vídeo se ve dentro de su pantalla
      return `<figure class="video"><div class="tele"><span class="tele-pantalla">
        <button type="button" class="tele-play" data-video="${yt[2]}" aria-label="Ver: ${Textos.enLinea(yt[1]).replace(/<[^>]+>/g, '')}"><span class="tele-icono" aria-hidden="true">▶</span></button>
        </span></div><figcaption class="video-titulo">${Textos.enLinea(yt[1])}</figcaption></figure>`;
    }
    const lineas = b.split('\n').map((l) => l.trim());
    if (lineas.every((l) => l.startsWith('> '))) return `<blockquote><p>${Textos.enLinea(lineas.map((l) => l.slice(2)).join(' '))}</p></blockquote>`;
    if (lineas.every((l) => l.startsWith('- '))) return `<ul>${lineas.map((l) => `<li>${Textos.enLinea(l.slice(2))}</li>`).join('')}</ul>`;
    return `<p>${Textos.enLinea(lineas.join(' '))}</p>`;
  }).join('');
  // Vídeos: al pulsar, el botón se cambia por el reproductor (youtube-nocookie: sin cookies hasta que se reproduce)
  $('cuerpo').addEventListener('click', (e) => {
    const b = e.target.closest('.tele-play');
    if (!b) return;
    const marco = document.createElement('iframe');
    marco.src = `https://www.youtube-nocookie.com/embed/${b.dataset.video}?autoplay=1&rel=0`;
    marco.title = b.closest('.video').querySelector('.video-titulo').textContent;
    marco.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    marco.allowFullscreen = true;
    b.replaceWith(marco);
  });

  // El botón que no guarda nada
  const boton = $('guardar'), aviso = $('aviso');
  if (general['guardar-boton']) boton.textContent = plano(general['guardar-boton']);
  const mensaje = plano(general['guardar-mensaje']) || 'Partida guardada.';
  // SECRETO (LISA: The Painful): a la tercera vez, para guardar hay que sacrificar algo.
  // Las dos opciones llevan al mismo final. Sólo una vez por visita.
  let intentos = 0;
  const sacrificio = () => {
    const caja = document.createElement('div');
    caja.className = 'sacrificio';
    caja.setAttribute('role', 'group');
    caja.innerHTML = `<p>${Textos.enLinea(plano(general['lisa-pregunta']) || 'Para guardar esta partida, debes sacrificar algo.')}</p>
      <div class="opciones">
        <button class="boton" type="button">${Textos.enLinea(plano(general['lisa-opcion-1']) || 'Mi brazo')}</button>
        <button class="boton" type="button">${Textos.enLinea(plano(general['lisa-opcion-2']) || 'Mi partida guardada')}</button>
      </div>`;
    aviso.textContent = '';
    aviso.after(caja);
    boton.disabled = true;
    // cada opción tiene su final: el brazo (lisa-final) o la partida guardada (lisa-final-partida)
    caja.querySelectorAll('button').forEach((b, i) => b.addEventListener('click', () => {
      const fin = i === 0 ? plano(general['lisa-final']) || 'Elegiste el brazo.' : plano(general['lisa-final-partida']) || 'Elegiste tu partida guardada.';
      caja.innerHTML = `<p role="status">${Textos.enLinea(fin)}</p>`;
      boton.disabled = false;
    }));
    caja.querySelector('button').focus();
  };
  boton.addEventListener('click', () => {
    intentos++;
    if (intentos === 3) { sacrificio(); return; }
    boton.disabled = true;
    aviso.textContent = 'Guardando… No apagues la consola.';
    setTimeout(() => { aviso.textContent = mensaje; boton.disabled = false; }, 1400);
  });

  // Tachados: en pantallas táctiles se revelan al tocarlos
  document.addEventListener('click', (e) => { const t = e.target.closest('.tachado'); if (t) t.classList.toggle('visto'); });
})();
