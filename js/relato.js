/* ==========================================================
   Ficción: página de un relato.
   Cada relato tiene su página, ficcion/<nombre>.html, con
   <body data-relato="<nombre>"> (para que la vista previa del
   enlace en WhatsApp o redes muestre su título y sinopsis).
   relato.html?id=<nombre> sirve para cualquiera (y para probar).
   El texto está en textos/ficcion/<nombre>.md:
   titulo, genero, sinopsis, gancho, portada, payhip, precio, lectura, cuerpo.
   - completo: el relato entero y, al final, «Fin» y el enlace al PDF.
   - adelanto: sólo el comienzo, que se desvanece, y el cupón para seguir en Payhip.
   - nota:     una nota del autor (no el relato) y el cupón.
   ========================================================== */
(async () => {
  const $ = (id) => document.getElementById(id);
  const id = document.body.dataset.relato || new URLSearchParams(location.search).get('id') || '';
  const plano = (t) => (t || '').replace(/\s*\n\s*/g, ' ').trim();
  const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const general = await Textos.cargar('../textos/ficcion.md');
  let r = {};
  if (/^_?[a-z0-9-]+$/i.test(id)) { // los de prueba empiezan por _
    try {
      const res = await fetch(`../textos/ficcion/${id}.md`, { cache: 'no-cache' });
      if (res.ok) r = Textos.parsear(await res.text());
    } catch (e) { /* sin servidor */ }
  }
  if (general.volver) $('volver').textContent = plano(general.volver);

  const lectura = plano(r.lectura).toLowerCase();
  const pronto = lectura === 'proximamente'; // aún no se publica: sólo título, gancho y «Próximamente»
  if (!r.titulo || (!pronto && (!plano(r.cuerpo) || !['completo', 'adelanto', 'nota'].includes(lectura)))) {
    $('titulo').textContent = 'Este número no está en el quiosco';
    $('cuerpo').innerHTML = '<p>O se agotó, o nunca se imprimió.</p>';
    return;
  }

  // Número de la colección: su puesto en «## relatos»
  const ids = (general.relatos || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());
  const puesto = ids.indexOf(id);
  if (puesto >= 0) $('numero').textContent = `Nº ${String(puesto + 1).padStart(3, '0')}`;

  document.title = `${plano(r.titulo)} — Daniel DB`;
  $('titulo').innerHTML = Textos.enLinea(plano(r.titulo));
  $('genero').innerHTML = Textos.enLinea(plano(r.genero));
  const cabecera = document.querySelector('.relato-cabecera');
  // frase de enganche
  if (plano(r.gancho)) cabecera.insertAdjacentHTML('beforeend', `<p class="relato-gancho">${Textos.enLinea(plano(r.gancho))}</p>`);

  // GRAN LANZAMIENTO: si es el relato de «## lanzamiento», la cabecera es de noche y nieva
  if (id === plano(general.lanzamiento) && typeof Nieve !== 'undefined') {
    document.body.classList.add('estreno');
    cabecera.insertAdjacentHTML('afterbegin', '<div class="nevada" id="nevada"></div>');
    // la franja de arriba, igual que en la portada de Ficción (## cabecera-izquierda / ## cabecera-derecha)
    const franja = cabecera.querySelector('.cabecera span');
    if (plano(general['cabecera-izquierda'])) franja.textContent = plano(general['cabecera-izquierda']);
    if (plano(general['cabecera-derecha'])) $('numero').textContent = plano(general['cabecera-derecha']);
    Nieve.caer($('nevada'), { cantidad: 36 });
  }

  if (pronto) {
    const promesa = plano(general['lanzamiento-promesa-titulo']) && id === plano(general.lanzamiento)
      ? `<div class="promesa"><p class="promesa-titulo">${Textos.enLinea(plano(general['lanzamiento-promesa-titulo']))}</p>${plano(general['lanzamiento-promesa']) ? `<p>${Textos.enLinea(plano(general['lanzamiento-promesa']))}</p>` : ''}</div>`
      : '';
    $('cuerpo').innerHTML = `<p class="proximamente grande"><span>${Textos.enLinea(plano(general.proximamente) || 'Próximamente')}</span> ${Textos.enLinea(plano(general['proximamente-nota']))}</p>${promesa}`;
    // AVANCE (sólo el relato que se estrena): el minijuego y la portada, que no salen en la página principal
    if (id === plano(general.lanzamiento)) {
      const portadaP = plano(r.portada);
      const conPortada = /^[\w.-]+\.(png|jpe?g|webp|gif)$/i.test(portadaP);
      $('final').innerHTML = `
        <section class="avance" aria-labelledby="avance-titulo">
          <h2 class="avance-titulo" id="avance-titulo">${Textos.enLinea(plano(general['avance-titulo']) || 'Simulador')}</h2>
          <div id="juego"></div>
          ${conPortada ? `<figure class="portada-original" id="portada-original">
            <figcaption>${Textos.enLinea(plano(general['portada-titulo']) || 'Portada original')}</figcaption>
            <img src="../imagenes/portadas/${escapar(portadaP)}" alt="Portada original de ${escapar(plano(r.titulo))}" loading="lazy">
          </figure>` : ''}
        </section>`;
      const figura = $('portada-original');
      if (figura) figura.querySelector('img').addEventListener('error', () => figura.remove());
      // el minijuego vive en js/no-dejes-que-se-apaguen.js (sólo lo carga la página de este relato)
      if (typeof NoDejesQueSeApaguen !== 'undefined') NoDejesQueSeApaguen.montar($('juego'));
    }
    return;
  }

  // Cuerpo: párrafos separados por línea en blanco; «---» = cambio de escena
  const bloques = r.cuerpo.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const cuerpo = bloques.map((b) => (/^-{3,}$/.test(b)
    ? '<p class="escena" aria-label="Cambio de escena">* * *</p>'
    : `<p>${Textos.enLinea(b.split('\n').map((l) => l.trim()).join(' '))}</p>`)).join('');

  const enlace = /^https:\/\//.test(plano(r.payhip)) ? escapar(plano(r.payhip)) : '';
  const precio = escapar(plano(r.precio));
  // {precio} en los textos de ficcion.md = el precio de este relato
  const t = (clave, defecto) => Textos.enLinea(plano(general[clave]) || defecto).replace(/\{precio\}/g, precio);
  // el cupón: tras un adelanto, «final-pago-*»; tras una nota del autor, «final-nota-*»
  const cupon = (clave) => `
      <div class="cupon">
        <p class="cupon-titulo">${t(`${clave}-titulo`, '¿Quieres saber cómo termina?')}</p>
        <p>${t(clave, 'Sigue leyendo en Payhip.')}</p>
        <p class="cupon-precio">${precio}</p>
        ${enlace ? `<a class="comprar" href="${enlace}" target="_blank" rel="noopener">${t(`${clave}-boton`, 'Seguir leyendo en Payhip')} →</a>` : ''}
      </div>`;

  let final = '';
  if (lectura === 'completo') {
    $('cuerpo').innerHTML = cuerpo;
    final = `
      <p class="fin">${t('fin', 'Fin')}</p>
      <div class="final-gratis">
        <p>${t('final-gratis', '¿Te gustó? Descárgalo en PDF en Payhip.')}</p>
        ${enlace ? `<a class="comprar" href="${enlace}" target="_blank" rel="noopener">${t('final-gratis-boton', 'Descargar el PDF')} →</a>` : ''}
        <p class="precio">PDF · ${precio}</p>
      </div>`;
  } else if (lectura === 'adelanto') {
    $('cuerpo').innerHTML = cuerpo;
    $('cuerpo').classList.add('adelanto');
    final = cupon('final-pago');
  } else {
    // nota del autor: no es el relato, es Daniel hablando de él
    $('cuerpo').innerHTML = `<div class="nota-autor">
        <p class="nota-titulo">${t('nota-titulo', 'Nota del autor')}</p>
        ${cuerpo}
        <p class="nota-firma">${t('nota-firma', '— Daniel DB')}</p>
      </div>`;
    $('cuerpo').classList.add('es-nota');
    final = cupon('final-nota');
  }

  // Portada original, al final (imagenes/portadas/); si no carga, no sale
  const portada = plano(r.portada);
  if (/^[\w.-]+\.(png|jpe?g|webp|gif)$/i.test(portada)) {
    final += `
      <figure class="portada-original" id="portada-original">
        <figcaption>${t('portada-titulo', 'Portada original')}</figcaption>
        <img src="../imagenes/portadas/${escapar(portada)}" alt="Portada original de ${escapar(plano(r.titulo))}" loading="lazy">
      </figure>`;
  }

  // Pásalo: compartir el enlace de esta página
  final += `
      <div class="pasalo">
        <p class="pasalo-titulo">${t('pasalo-titulo', 'Pásalo')}</p>
        <p>${t('pasalo', 'Préstale este bolsilibro a un amigo.')}</p>
        <div class="pasalo-botones">
          <button type="button" class="leer" id="compartir">${t('pasalo-boton', 'Compartir')}</button>
          <a class="leer" id="whatsapp" target="_blank" rel="noopener">WhatsApp</a>
        </div>
        <p class="pasalo-aviso" id="pasalo-aviso" aria-live="polite"></p>
      </div>`;
  $('final').innerHTML = final;
  const figura = $('portada-original');
  if (figura) figura.querySelector('img').addEventListener('error', () => figura.remove());

  const url = document.body.dataset.relato ? location.origin + location.pathname : location.href;
  const titulo = plano(r.titulo);
  const gancho = plano(r.gancho) || plano(r.sinopsis);
  $('whatsapp').href = `https://wa.me/?text=${encodeURIComponent(`${titulo}. ${gancho} ${url}`)}`;
  $('compartir').addEventListener('click', async () => {
    // en el móvil abre el menú de compartir; si no hay, copia el enlace
    if (navigator.share) {
      try { await navigator.share({ title: titulo, text: gancho, url }); return; } catch (e) { if (e.name === 'AbortError') return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      $('pasalo-aviso').innerHTML = t('pasalo-copiado', 'Enlace copiado.');
    } catch (e) {
      $('pasalo-aviso').textContent = url;
    }
  });
})();
