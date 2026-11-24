/* ==========================================================
   Visitas: cuenta las páginas vistas en GoatCounter (goatcounter.com).

   - Sin cookies y sin guardar nada del visitante: sólo se envía qué página
     se vio, de dónde venía, el tamaño de pantalla y el título.
   - No carga ningún script de fuera: se pide una imagen de 1×1 px.
   - No cuenta en localhost ni al abrir el archivo con doble clic.
   - Para que no cuenten TUS visitas: abre una vez cualquier página con
     ?no-contarme al final de la dirección (en cada navegador que uses).
     Para volver a contar: ?contarme.
   ========================================================== */
(() => {
  const CODIGO = 'danieldb'; // el código de la cuenta (https://CODIGO.goatcounter.com); vacío = no cuenta nada

  const params = new URLSearchParams(location.search);
  try {
    if (params.has('no-contarme')) localStorage.setItem('db-no-contarme', '1');
    if (params.has('contarme')) localStorage.removeItem('db-no-contarme');
    if (localStorage.getItem('db-no-contarme')) return;
  } catch (e) { /* sin almacenamiento: se cuenta igual */ }

  if (!CODIGO) return;
  if (location.protocol === 'file:') return;
  if (/^(localhost|127\.0\.0\.1|\[::1\]|.+\.localhost|.+\.test)$/.test(location.hostname)) return;
  if (navigator.webdriver) return; // navegadores automáticos (robots, pruebas)

  // La ruta: /no-ficcion/articulo.html?id=x se cuenta como una página por artículo
  const ruta = () => {
    let p = location.pathname.replace(/index\.html$/, '');
    const id = params.get('id');
    if (id && /^[\w-]+$/.test(id)) p += `?id=${id}`;
    return p;
  };

  let enviado = false;
  function enviar() {
    if (enviado) return;
    enviado = true;
    const datos = new URLSearchParams({
      p: ruta(),
      t: document.title,
      r: document.referrer,
      s: `${screen.width},${screen.height},${window.devicePixelRatio || 1}`,
      q: location.search, // campañas: ?ref=whatsapp, ?utm_source=…
      rnd: Math.random().toString(36).slice(2),
    });
    new Image().src = `https://${CODIGO}.goatcounter.com/count?${datos}`;
  }

  // Se espera un poco para que la página ponga su título (los artículos lo leen del .md);
  // si el visitante se va antes, se envía al salir.
  const empezar = () => setTimeout(enviar, 1500);
  if (document.prerendering) document.addEventListener('prerenderingchange', empezar, { once: true });
  else if (document.readyState === 'complete') empezar();
  else window.addEventListener('load', empezar, { once: true });
  window.addEventListener('pagehide', () => { if (!document.prerendering) enviar(); }, { once: true });
})();
