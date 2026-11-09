/* ==========================================================
   Textos desde Markdown
   Lee un archivo .md dividido en secciones "## nombre" y coloca
   cada sección en el elemento con data-texto="nombre".

   Formatos (atributo data-formato):
     (ninguno)  una línea con **negrita**, *cursiva* y [enlaces](url)
     plano      texto tal cual, sin formato
     lineas     cada línea del .md es una línea en la página
     parrafos   párrafos separados por una línea en blanco (con revelado)
     parrafos-fijos  párrafos separados por una línea en blanco (sin revelado)
     menu       lista de botones: - [Texto](enlace) ¡NUEVO!
     noticias   lista: - **fecha** texto (grupos separados por ---; se muestra uno al azar)
     insignias  lista de botones de 88×31
     aleatorio  lista: muestra un elemento al azar en cada visita
     firmas     lista: - **Nombre** · desde dónde: mensaje

   Si el archivo no se puede leer, la página conserva su texto por defecto.
   ========================================================== */
const Textos = (() => {
  function parsear(md) {
    md = md.replace(/<!--[\s\S]*?-->/g, '');
    const secciones = {};
    let clave = null, buf = [];
    for (const linea of md.split(/\r?\n/)) {
      const m = linea.match(/^##\s+(.+?)\s*$/);
      if (m) {
        if (clave) secciones[clave] = buf.join('\n').trim();
        clave = m[1].trim().toLowerCase();
        buf = [];
      } else if (clave) buf.push(linea);
    }
    if (clave) secciones[clave] = buf.join('\n').trim();
    return secciones;
  }

  const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // enlaces permitidos: web, correo, anclas y rutas internas (p. ej. no-ficcion/index.html)
  const URL_SEGURA = /^(https?:\/\/|mailto:|#|\.{0,2}\/|[\w-]+(\/[\w-]+)*(\.html)?\/?(\?[\w=&%-]*)?(#[\w-]*)?$)/i;

  function enLinea(s) {
    let h = escapar(s);
    h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, texto, url) => {
      const destino = URL_SEGURA.test(url) ? url : '#';
      const externo = /^https?:/i.test(destino) ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${destino}"${externo}>${texto}</a>`;
    });
    h = h.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<i>$2</i>');
    // ||texto|| = texto tachado como en un expediente; se revela al pasar el cursor o al tocarlo
    h = h.replace(/\|\|(.+?)\|\|/g, '<span class="tachado" tabindex="0" title="Información clasificada">$1</span>');
    return h;
  }

  const elementos = (texto) => texto.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());

  const ESTILOS_INSIGNIA = [
    'background:#C0C0C0;color:#000',
    'background:#000;color:var(--p-triada1-sat)',
    'background:var(--p-luz-sat);color:#FFF',
    'background:var(--p-triada2-sat);color:#000',
    'background:var(--p-triada1-sat);color:#000',
  ];

  const FORMATOS = {
    plano: (el, t) => { el.textContent = t.replace(/\s*\n\s*/g, ' '); },
    lineas: (el, t) => { el.innerHTML = t.split('\n').map((l) => enLinea(l.trim())).join('<br>'); },
    parrafos: (el, t) => {
      const ritmo = el.dataset.ritmo || '28';
      el.innerHTML = t.split(/\n\s*\n/).map((p) => `<p class="revelar" data-ritmo="${ritmo}">${enLinea(p.replace(/\s*\n\s*/g, ' ').trim())}</p>`).join('');
    },
    'parrafos-fijos': (el, t) => {
      el.innerHTML = t.split(/\n\s*\n/).map((p) => `<p>${enLinea(p.replace(/\s*\n\s*/g, ' ').trim())}</p>`).join('');
    },
    aleatorio: (el, t) => {
      const opciones = elementos(t);
      if (!opciones.length) { el.innerHTML = enLinea(t.replace(/\s*\n\s*/g, ' ')); return; }
      el.innerHTML = enLinea(opciones[Math.floor(Math.random() * opciones.length)]);
    },
    firmas: (el, t) => {
      el.innerHTML = elementos(t).map((item) => {
        const i = item.indexOf(': ');
        const quien = i > 0 ? item.slice(0, i) : item, dice = i > 0 ? item.slice(i + 2) : '';
        // "original [traducción] texto" o "original [traducción Fuente] línea // línea // …"
        const m = dice.match(/^(.*?)\s*\[traducción(?:\s+([^\]]+))?\]\s*(.*)$/i);
        const original = m ? m[1] : dice;
        let extra = '';
        if (m) {
          const etiqueta = `Traducción automática${m[2] ? ` (${escapar(m[2].trim())})` : ''}:`;
          const lineas = m[3].split(/\s*\/\/\s*/).filter(Boolean);
          if (lineas.length > 1) {
            // varias líneas: cada "Etiqueta: valor" se muestra como una ficha
            const fichas = lineas.map((l) => { const j = l.indexOf(': '); return j > 0 ? `<span class="ficha"><b>${enLinea(l.slice(0, j))}:</b> ${enLinea(l.slice(j + 2))}</span>` : `<span class="ficha">${enLinea(l)}</span>`; }).join('');
            extra = `<span class="traduccion"><b>${etiqueta}</b>${fichas}</span>`;
          } else {
            extra = `<span class="traduccion"><b>${etiqueta}</b> ${enLinea(m[3])}</span>`;
          }
        }
        return `<li><span class="firma-quien">${enLinea(quien)}</span><br>${enLinea(original)}${extra}</li>`;
      }).join('');
    },
    menu: (el, t) => {
      el.innerHTML = elementos(t).map((item) => {
        const nuevo = /¡NUEVO!\s*$/.test(item);
        const limpio = item.replace(/¡NUEVO!\s*$/, '').trim();
        const m = limpio.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        const enlace = m ? enLinea(limpio).replace('<a ', '<a class="boton-menu" ') : `<span class="boton-menu">${enLinea(limpio)}</span>`;
        return `<li>${enlace}${nuevo ? ' <span class="nuevo">¡NUEVO!</span>' : ''}</li>`;
      }).join('');
    },
    noticias: (el, t) => {
      // grupos separados por una línea "---": se muestra uno al azar
      const grupos = t.split(/^\s*---\s*$/m).map(elementos).filter((g) => g.length);
      const grupo = grupos.length ? grupos[Math.floor(Math.random() * grupos.length)] : [];
      el.innerHTML = grupo.map((item) => `<li>${enLinea(item).replace(/^(<b>.*?<\/b>)\s*/, '$1<br>')}</li>`).join('');
    },
    insignias: (el, t) => {
      el.innerHTML = elementos(t).map((item, i) => `<span class="boton88" style="${ESTILOS_INSIGNIA[i % ESTILOS_INSIGNIA.length]}">${enLinea(item)}</span>`).join('');
    },
  };

  function formatear(el, t) {
    const f = FORMATOS[el.dataset.formato];
    if (f) f(el, t); else el.innerHTML = enLinea(t.replace(/\s*\n\s*/g, ' '));
  }

  function aplicar(secciones) {
    document.querySelectorAll('[data-texto]').forEach((el) => {
      const t = secciones[el.dataset.texto];
      if (t === undefined || t === '') return;
      formatear(el, t);
    });
  }

  async function cargar(ruta) {
    try {
      const r = await fetch(ruta, { cache: 'no-cache' });
      if (!r.ok) return {};
      const secciones = parsear(await r.text());
      aplicar(secciones);
      return secciones;
    } catch (e) {
      return {}; // sin servidor (abriendo el archivo directamente) se queda el texto por defecto
    }
  }

  return { cargar, parsear, formatear, enLinea };
})();
