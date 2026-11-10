/* ==========================================================
   No ficción: lectura de un artículo.
   articulo.html?id=nombre  →  textos/no-ficcion/nombre.md
   Secciones del .md: titulo, subtitulo, categoria, fecha, original (solo de referencia, no se muestra), cuerpo.
   ========================================================== */
(async () => {
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (id) => document.getElementById(id);
  const id = new URLSearchParams(location.search).get('id') || '';

  // Al volver al archivo desde aquí no se repite el briefing (no-ficcion.js lee esta marca)
  document.querySelectorAll('a[href="index.html"]').forEach((a) => a.addEventListener('click', () => {
    try { sessionStorage.setItem('db-no-ficcion-volver', '1'); } catch (e) {}
  }));

  // Solo nombres de archivo simples: nada de rutas raras
  const valido = /^[a-z0-9-]+$/i.test(id);
  const a = valido ? await Textos.cargar(`../textos/no-ficcion/${id}.md`) : {};
  const general = await Textos.cargar('../textos/no-ficcion.md');

  if (!a.titulo) {
    $('estado').textContent = 'Expediente no encontrado';
    $('titulo').textContent = 'Este expediente no existe';
    $('cuerpo').innerHTML = '<p>O lo destruyeron, o nunca existió. Las dos opciones son igual de sospechosas.</p>';
    $('autodestruir').hidden = true;
    return;
  }

  const plano = (t) => (t || '').replace(/\s*\n\s*/g, ' ').trim();
  document.title = `${plano(a.titulo)} — Daniel DB`;
  $('titulo').innerHTML = Textos.enLinea(plano(a.titulo));
  $('subtitulo').innerHTML = Textos.enLinea(plano(a.subtitulo));
  $('categoria').innerHTML = Textos.enLinea(plano(a.categoria));
  $('fecha').innerHTML = Textos.enLinea(plano(a.fecha));

  // Cuerpo: bloques separados por línea en blanco
  const bloques = (a.cuerpo || '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  $('cuerpo').innerHTML = bloques.map((b) => {
    if (b.startsWith('### ')) return `<h2>${Textos.enLinea(b.slice(4).trim())}</h2>`;
    if (/^-{3,}$/.test(b)) return '<hr>';
    const lineas = b.split('\n').map((l) => l.trim());
    if (lineas.every((l) => l.startsWith('> '))) return `<blockquote><p>${Textos.enLinea(lineas.map((l) => l.slice(2)).join(' '))}</p></blockquote>`;
    if (lineas.every((l) => l.startsWith('- '))) return `<ul>${lineas.map((l) => `<li>${Textos.enLinea(l.slice(2))}</li>`).join('')}</ul>`;
    return `<p>${Textos.enLinea(lineas.join(' '))}</p>`;
  }).join('');

  // El botón que no autodestruye nada
  const boton = $('autodestruir'), aviso = $('aviso'), articulo = $('articulo');
  if (general['autodestruir-boton']) boton.textContent = plano(general['autodestruir-boton']);
  const mensaje = plano(general['autodestruir-mensaje']) || 'Es broma. Los buenos textos no se autodestruyen.';
  boton.addEventListener('click', () => {
    if (quieto) { aviso.textContent = mensaje; return; }
    articulo.classList.add('destruir');
    setTimeout(() => { articulo.classList.remove('destruir'); aviso.textContent = mensaje; aviso.focus?.(); }, 900);
  });

  // Tachados: en pantallas táctiles se revelan al tocarlos
  document.addEventListener('click', (e) => { const t = e.target.closest('.tachado'); if (t) t.classList.toggle('visto'); });
})();
