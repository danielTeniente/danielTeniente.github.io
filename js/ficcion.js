/* ==========================================================
   Ficción (concepto Bolsilibro): el gran lanzamiento y la
   pegatina que se despega.
   Textos en textos/ficcion.md; el relato que se estrena, en
   textos/ficcion/<nombre>.md («## lanzamiento» dice cuál).
   ========================================================== */
(async () => {
  const $ = (id) => document.getElementById(id);
  const textos = await Textos.cargar('../textos/ficcion.md');
  const lista = (t) => (t || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());
  const plano = (t) => (t || '').replace(/\s*\n\s*/g, ' ').trim();
  const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const leer = async (id) => {
    if (!/^[a-z0-9-]+$/i.test(id)) return {};
    try {
      const r = await fetch(`../textos/ficcion/${id}.md`, { cache: 'no-cache' });
      return r.ok ? Textos.parsear(await r.text()) : {};
    } catch (e) { return {}; }
  };

  // ---------- Pegatina al azar; SECRETO: al despegarla, lo de debajo ----------
  // cada línea de «## pegatina»: «lo que dice → lo que hay debajo»
  const pegatinas = lista(textos.pegatina).map((l) => l.split('→').map((x) => x.trim()));
  const pegatina = $('pegatina');
  const [cara, debajo] = pegatinas.length ? pegatinas[Math.floor(Math.random() * pegatinas.length)] : [];
  if (cara) pegatina.innerHTML = Textos.enLinea(cara);
  if (debajo) pegatina.addEventListener('click', () => {
    if (pegatina.classList.contains('despegada')) return;
    $('debajo').innerHTML = Textos.enLinea(debajo);
    pegatina.classList.add('despegada');
    pegatina.setAttribute('tabindex', '-1');
  });

  // ---------- GRAN LANZAMIENTO: «## lanzamiento» = el relato que se estrena ----------
  const id = plano(textos.lanzamiento);
  if (!id) return;
  const r = await leer(id);
  if (!r.titulo) return;
  // su número en la colección: su puesto en «## relatos»
  const puesto = Math.max(0, lista(textos.relatos).indexOf(id));
  const n = String(puesto + 1).padStart(3, '0');
  const titulo = escapar(plano(r.titulo)), genero = escapar(plano(r.genero));
  const lectura = plano(r.lectura).toLowerCase();
  const pagina = `${encodeURIComponent(id)}.html`; // su página: ficcion/<nombre>.html
  const etiqueta = { completo: plano(textos['leer-completo']) || 'Leer aquí', adelanto: plano(textos['leer-adelanto']) || 'Leer el comienzo', nota: plano(textos['leer-nota']) || 'Nota del autor' };
  const seLee = !!etiqueta[lectura] && !!plano(r.cuerpo);
  const pronto = lectura === 'proximamente'; // aún no se publica: su página es el simulador (y la portada)

  const tapa = `<a class="tapa" href="${pagina}" tabindex="-1" aria-hidden="true">
        <span class="tapa-serie">Medianoche · Nº ${n}</span>
        <span class="tapa-genero">${genero}</span>
        <span class="tapa-titulo">${titulo}</span>
        <span class="tapa-autor">Daniel DB</span>
      </a>`;
  const boton = (texto) => `<div class="acciones"><a class="leer leer-grande" href="${pagina}">${texto} →</a></div>`;
  const parte = lista(textos['lanzamiento-parte']);
  // la promesa: se leerá entero aquí
  const promesa = plano(textos['lanzamiento-promesa-titulo'])
    ? `<div class="promesa"><p class="promesa-titulo">${Textos.enLinea(plano(textos['lanzamiento-promesa-titulo']))}</p>${plano(textos['lanzamiento-promesa']) ? `<p>${Textos.enLinea(plano(textos['lanzamiento-promesa']))}</p>` : ''}</div>`
    : '';
  const caja = $('lanzamiento');
  caja.innerHTML = `
    <div class="nevada" id="nevada"></div>
    <p class="lanz-etiqueta">${Textos.enLinea(plano(textos['lanzamiento-etiqueta']) || '¡Gran lanzamiento!')}</p>
    <div class="lanz-grid">
      ${tapa}
      <div class="lanz-ficha">
        <p class="ficha-numero">Nº ${n} · ${genero}</p>
        <h2 class="lanz-titulo">${titulo}</h2>
        ${plano(r.gancho) ? `<p class="lanz-gancho">${Textos.enLinea(plano(r.gancho))}</p>` : ''}
        ${promesa}
        ${parte.length ? `<div class="parte"><p class="parte-titulo">${Textos.enLinea(plano(textos['lanzamiento-parte-titulo']) || 'Parte meteorológico')}</p><ul>${parte.map((l) => `<li>${Textos.enLinea(l)}</li>`).join('')}</ul></div>` : ''}
        ${pronto ? `<p class="proximamente"><span>${Textos.enLinea(plano(textos.proximamente) || 'Próximamente')}</span> ${Textos.enLinea(plano(textos['proximamente-nota']))}</p>` : ''}
        ${pronto ? boton(Textos.enLinea(plano(textos['lanzamiento-avance']) || 'Ver el simulador')) : (seLee ? boton(escapar(etiqueta[lectura])) : '')}
      </div>
    </div>`;
  caja.hidden = false;

  Nieve.caer($('nevada'));
})();
