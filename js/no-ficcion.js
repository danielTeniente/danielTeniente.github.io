/* ==========================================================
   No ficción: briefing que se autodestruye y archivo de expedientes.
   Textos en textos/no-ficcion.md.
   ========================================================== */
(async () => {
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const textos = await Textos.cargar('../textos/no-ficcion.md');
  const $ = (id) => document.getElementById(id);
  const informe = $('informe'), archivo = $('archivo'), aviso = $('aviso'), mecha = $('mecha');
  const CLAVE_VISTO = 'db-no-ficcion-mision';

  // ---------- Archivo de expedientes ----------
  const lista = $('lista');
  const filas = (textos.expedientes || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('- ')).map((l) => l.slice(2));
  let n = 0;
  const html = filas.map((fila) => {
    const m = fila.match(/^\[([^\]]+)\]\(([^)\s]+)\)\s*(.*)$/);
    if (!m) return '';
    const [, titulo, destino, resto] = m;
    const [categoria = '', fecha = '', ...sub] = resto.replace(/^·\s*/, '').split(/\s*·\s*/);
    const externo = /^https?:\/\//i.test(destino);
    const href = externo ? destino : `articulo.html?id=${encodeURIComponent(destino)}`;
    n++;
    const numero = String(n).padStart(3, '0');
    return `<li><a class="expediente" href="${href}"${externo ? ' target="_blank" rel="noopener"' : ''}>
      <span class="cabecera"><span>Expediente ${numero} · ${Textos.enLinea(categoria)}</span><span class="estado${externo ? ' fuera' : ''}">${externo ? 'En Substack ↗' : 'Desclasificado'}</span></span>
      <span class="titulo">${Textos.enLinea(titulo)}</span>
      <span class="subtitulo">${Textos.enLinea(sub.join(' · '))}</span>
      <span class="meta">${Textos.enLinea(fecha)}</span>
    </a></li>`;
  }).join('');

  // Expediente 000: clasificado, pide un código de acceso
  const clasificado = textos['clasificado-clave'] ? `<li>
    <div class="expediente clasificado" id="clasificado">
      <button type="button" class="abrir-clasificado" id="abrir-clasificado" aria-expanded="false" aria-controls="acceso">
        <span class="cabecera"><span>Expediente 000 · Clasificado</span><span class="estado" style="color:var(--p-luz)">Acceso restringido</span></span>
        <span class="titulo">${Textos.enLinea(textos['clasificado-titulo'] || 'Expediente 000')}</span>
        <span class="subtitulo">Se requiere código de acceso.</span>
      </button>
      <form class="acceso" id="acceso" hidden>
        <label class="sr-only" for="codigo">Código de acceso</label>
        <input id="codigo" autocomplete="off" spellcheck="false" placeholder="CÓDIGO">
        <button class="boton" type="submit" style="padding:0.4rem 1rem">Entrar</button>
        <span class="respuesta" id="respuesta" aria-live="polite"></span>
      </form>
      <div class="revelado" id="revelado" hidden></div>
    </div>
  </li>` : '';
  lista.innerHTML = clasificado + html;

  const abrirClasificado = $('abrir-clasificado');
  if (abrirClasificado) {
    const acceso = $('acceso'), codigo = $('codigo'), respuesta = $('respuesta'), revelado = $('revelado');
    abrirClasificado.addEventListener('click', () => {
      acceso.hidden = !acceso.hidden;
      abrirClasificado.setAttribute('aria-expanded', String(!acceso.hidden));
      if (!acceso.hidden) codigo.focus();
    });
    acceso.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = codigo.value.trim().toLowerCase() === textos['clasificado-clave'].trim().toLowerCase();
      if (!ok) {
        respuesta.innerHTML = 'Acceso denegado. ' + Textos.enLinea(textos['clasificado-pista'] || '');
        codigo.select();
        return;
      }
      acceso.hidden = true;
      const estado = abrirClasificado.querySelector('.estado'), sub = abrirClasificado.querySelector('.subtitulo');
      estado.textContent = 'Acceso concedido'; estado.style.color = 'var(--p-triada1)';
      sub.textContent = 'Código aceptado.';
      revelado.dataset.formato = 'parrafos-fijos';
      Textos.formatear(revelado, textos['clasificado-contenido'] || '');
      revelado.hidden = false;
    });
  }

  // ---------- Briefing ----------
  const mostrarArchivo = () => {
    informe.hidden = true;
    mecha.classList.add('apagada');
    archivo.hidden = false;
  };
  let hecho = false;
  function autodestruir() {
    if (hecho) return; hecho = true;
    try { localStorage.setItem(CLAVE_VISTO, '1'); } catch (e) {}
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

  // Quien ya aceptó la misión va directo al archivo
  let visto = false;
  try { visto = localStorage.getItem(CLAVE_VISTO) === '1'; } catch (e) {}
  if (visto) { hecho = true; mostrarArchivo(); }
  else setTimeout(autodestruir, 14000); // si nadie acepta, la mecha decide

  $('repetir').addEventListener('click', () => {
    try { localStorage.removeItem(CLAVE_VISTO); } catch (e) {}
    location.reload();
  });

  // Tachados: en pantallas táctiles se revelan al tocarlos
  document.addEventListener('click', (e) => { const t = e.target.closest('.tachado'); if (t) t.classList.toggle('visto'); });
})();
