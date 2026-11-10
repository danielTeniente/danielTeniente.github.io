/* ==========================================================
   Minijuegos de la bóveda (No ficción).
   El último expediente publicado está «en custodia»: un minijuego
   elegido al azar se superpone a su tarjeta y al ganarlo se abre el artículo.
   Homenaje a las películas de Misión Imposible.

   Todos siguen el modelo de los láseres: la tarjeta se sigue viendo,
   el efecto la cruza por encima (.efecto) y debajo va una fila con la
   instrucción a la izquierda y los controles a la derecha (.juego-pie).
   El efecto no tapa la instrucción: la caja fuerte y el descenso usan
   una franja propia a la derecha (la tarjeta les deja sitio con
   data-juego) y lo que flota se queda en la zona de la ficha.

   Minijuegos.jugar(nombre, capa, textos, { ganar, perder })
     dibuja el juego en «capa» y devuelve una función que lo detiene.
   Los textos de cada juego están en textos/no-ficcion.md (## juego-…).
   ========================================================== */
window.Minijuegos = (() => {
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const azar = (n) => Math.floor(Math.random() * n);
  const barajar = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = azar(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const limpio = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9ñ ]/g, '').replace(/\s+/g, ' ').trim();
  const lista = (textos, clave, defecto) => {
    const l = (textos[clave] || '').split('\n').map((x) => x.trim()).filter((x) => x.startsWith('- ')).map((x) => x.slice(2).trim());
    return l.length ? l : defecto;
  };
  const instruccion = (textos, clave, defecto) => `<p class="juego-instruccion">${Textos.enLinea((textos[clave] || defecto).replace(/\s*\n\s*/g, ' ').trim())}</p>`;
  // efecto: lo que cruza la tarjeta; pie: instrucción (izquierda) y controles (derecha)
  const montar = (capa, efecto, instr, controles) => {
    capa.innerHTML = `<div class="efecto" aria-hidden="true">${efecto}</div><div class="juego-pie">${instr}<div class="juego-controles">${controles}</div></div>`;
    return { efecto: capa.querySelector('.efecto'), pie: capa.querySelector('.juego-pie') };
  };
  // Lo que debe quedarse sobre la ficha (título, subtítulo, fecha) sin tapar la instrucción va en una capa
  // dentro de la propia ficha: así toma su tamaño por CSS, sin medir nada. (Medir no sirve: el juego se
  // dibuja mientras el archivo sigue oculto tras el briefing, y oculto todo mide 0 px.)
  // Devuelve la capa y la función que la quita.
  const sobreFicha = (capa, html) => {
    const ficha = capa.parentElement.querySelector('.custodia-ficha');
    if (!ficha) return { capaFicha: document.createElement('div'), quitar: () => {} };
    ficha.querySelectorAll('.efecto-ficha').forEach((e) => e.remove());
    const capaFicha = document.createElement('div');
    capaFicha.className = 'efecto-ficha';
    capaFicha.setAttribute('aria-hidden', 'true');
    capaFicha.innerHTML = html;
    ficha.appendChild(capaFicha);
    return { capaFicha, quitar: () => capaFicha.remove() };
  };

  // 1. Láseres: pulsar «Cruzar» cuando están apagados
  function laseres(capa, textos, fin) {
    montar(capa, '<span class="laseres"><i></i><i></i><i></i></span>',
      instruccion(textos, 'juego-laseres', 'Cruce cuando se apaguen los láseres.'), '<button type="button" class="boton juego-accion">Cruzar</button>');
    let encendidos = true, vivo = true, t;
    const ciclo = () => {
      if (!vivo) return;
      encendidos = !encendidos;
      capa.classList.toggle('apagados', !encendidos);
      t = setTimeout(ciclo, encendidos ? 1200 + azar(900) : 750);
    };
    t = setTimeout(ciclo, 1200);
    capa.querySelector('.juego-accion').addEventListener('click', () => {
      if (!vivo) return;
      vivo = false; clearTimeout(t);
      encendidos ? fin.perder() : fin.ganar();
    });
    return () => { vivo = false; clearTimeout(t); capa.classList.remove('apagados'); };
  }

  // 2. Código: 5 cifras proyectadas sobre la ficha durante 2,5 segundos
  function codigo(capa, textos, fin) {
    const clave = String(10000 + azar(90000));
    montar(capa, '',
      instruccion(textos, 'juego-codigo', 'Memorice el código.'),
      `<button type="button" class="boton juego-accion juego-ver">Ver el código</button>
       <form class="juego-form" hidden>
         <label class="sr-only" for="juego-entrada">Código</label>
         <input id="juego-entrada" inputmode="numeric" autocomplete="off" maxlength="5" placeholder="·····">
         <button class="boton juego-accion" type="submit">Leer</button>
       </form>`);
    // la proyección va sobre la ficha y toma su tamaño por CSS
    const { capaFicha, quitar } = sobreFicha(capa, `<p class="proyeccion">${clave}</p>`);
    const form = capa.querySelector('form'), entrada = capa.querySelector('input');
    let t;
    capa.querySelector('.juego-ver').addEventListener('click', (e) => {
      e.currentTarget.hidden = true;
      capaFicha.classList.add('visible');
      t = setTimeout(() => {
        capaFicha.classList.remove('visible');
        form.hidden = false; entrada.focus();
      }, 2500);
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      entrada.value.trim() === clave ? fin.ganar() : fin.perder();
    });
    return () => { clearTimeout(t); quitar(); };
  }

  // 3. Caja fuerte: un dial gira en la franja derecha de la tarjeta; fijarlo en un número
  function caja(capa, textos, fin) {
    const meta = azar(40);
    const fmt = (x) => String(x).padStart(2, '0');
    const { efecto } = montar(capa, '<span class="dial">00</span>',
      instruccion(textos, 'juego-caja', 'Pulse «Fijar» cuando el dial marque el número de la combinación.'),
      `<p class="juego-dato">Combinación: <b>${fmt(meta)}</b></p>
       <button type="button" class="boton juego-accion">Fijar</button>`);
    const dial = efecto.querySelector('.dial');
    let valor = azar(40), vivo = true;
    const t = setInterval(() => { valor = (valor + 1) % 40; dial.textContent = fmt(valor); }, 110);
    capa.querySelector('.juego-accion').addEventListener('click', () => {
      if (!vivo) return;
      vivo = false; clearInterval(t);
      Math.min(Math.abs(valor - meta), 40 - Math.abs(valor - meta)) <= 1 ? fin.ganar() : fin.perder(); // ±1 de margen
    });
    return () => { vivo = false; clearInterval(t); };
  }

  // 4. Contraseña: las letras desordenadas flotan sobre la ficha
  function contrasena(capa, textos, fin) {
    const palabras = lista(textos, 'juego-palabras', ['misión', 'agente', 'expediente']);
    const palabra = palabras[azar(palabras.length)];
    const letras = [...limpio(palabra)];
    let mezcla;
    do { mezcla = barajar(letras); } while (mezcla.join('') === letras.join('') && letras.length > 1);
    montar(capa, '',
      instruccion(textos, 'juego-anagrama', 'La contraseña está desordenada. Ordénela.'),
      `<p class="juego-dato juego-pista" aria-live="polite" hidden></p>
       <form class="juego-form">
         <label class="sr-only" for="juego-entrada">Contraseña (letras: ${mezcla.join(' ')})</label>
         <input id="juego-entrada" autocomplete="off" spellcheck="false" placeholder="CONTRASEÑA">
         <button class="boton juego-accion" type="submit">Leer</button>
       </form>`);
    // las letras flotan sobre la ficha (dejan libre la instrucción): repartidas a lo ancho, a alturas al azar
    // en % de la ficha, así se recolocan solas si cambia de tamaño
    const { quitar } = sobreFicha(capa, mezcla.map((l, i) =>
      `<span class="letra" style="left:${6 + (i * 86) / Math.max(1, mezcla.length - 1)}%;top:${5 + azar(55)}%;animation-delay:${-azar(3000)}ms">${l.toUpperCase()}</span>`).join(''));
    // cada error destapa una letra en su sitio (western → --s----); al tercero llegan los refuerzos
    const pista = capa.querySelector('.juego-pista'), entrada = capa.querySelector('input');
    const destapadas = new Set();
    let errores = 0;
    capa.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (limpio(entrada.value) === limpio(palabra)) { fin.ganar(); return; }
      if (++errores >= 3 && fin.refuerzos) { fin.refuerzos(); return; }
      const tapadas = letras.map((_, i) => i).filter((i) => !destapadas.has(i));
      if (tapadas.length) destapadas.add(tapadas[azar(tapadas.length)]);
      pista.innerHTML = `Pista: <b>${letras.map((l, i) => (destapadas.has(i) ? l.toUpperCase() : '-')).join('')}</b>`;
      pista.hidden = false;
      const tarjeta = capa.closest('.expediente');
      if (tarjeta) { tarjeta.classList.remove('alarma'); void tarjeta.offsetWidth; tarjeta.classList.add('alarma'); }
      entrada.select();
    });
    return quitar;
  }

  // 5. Descenso: bajar colgado del techo por la franja derecha y frenar antes del suelo
  function descenso(capa, textos, fin) {
    const { efecto } = montar(capa, '<span class="pozo"><span class="zona-freno"></span><span class="suelo"></span><span class="cuerda"><span class="agente">◆</span></span></span>',
      instruccion(textos, 'juego-descenso', 'Descienda y frene antes de tocar el suelo.'), '<button type="button" class="boton juego-accion">Descender</button>');
    const cuerda = efecto.querySelector('.cuerda'), boton = capa.querySelector('.juego-accion');
    let bajando = false, vivo = true, inicio, raf;
    const DURACION = 2600; // ms de techo a suelo
    const paso = (ahora) => {
      if (!vivo) return;
      const p = Math.min(1, (ahora - inicio) / DURACION);
      cuerda.style.height = `${p * 100}%`;
      if (p >= 1) { vivo = false; fin.perder(); return; }
      raf = requestAnimationFrame(paso);
    };
    boton.addEventListener('click', () => {
      if (!vivo) return;
      if (!bajando) { bajando = true; boton.textContent = 'Frenar'; inicio = performance.now(); raf = requestAnimationFrame(paso); return; }
      vivo = false; cancelAnimationFrame(raf);
      const p = parseFloat(cuerda.style.height) / 100;
      p >= 0.78 && p < 0.94 ? fin.ganar() : fin.perder(); // la zona de freno, justo encima del suelo
    });
    return () => { vivo = false; cancelAnimationFrame(raf); };
  }

  // 6. Inmersión: la tarjeta se hunde en el agua, cada vez más azul y más oscura; al llegar al fondo se abre
  function bucear(capa, textos, fin) {
    const burbujas = Array.from({ length: 7 }, (_, i) => `<i style="left:${84 + azar(12)}%;animation-delay:${i * 0.7}s"></i>`).join('');
    const { efecto } = montar(capa, `<span class="agua"></span><span class="burbujas">${burbujas}</span>`,
      instruccion(textos, 'juego-bucear', 'Contenga la respiración. No tiene que hacerlo, pero es divertido.'),
      `<p class="juego-dato profundidad" aria-live="off">Profundidad: <b>0 m</b></p>
       <button type="button" class="boton juego-accion">Sumergirse</button>`);
    const boton = capa.querySelector('.juego-accion'), metros = capa.querySelector('.profundidad b');
    const DURACION = quieto ? 600 : 6000, FONDO = 40;
    let vivo = true, inicio, raf, abajo = false;
    const paso = (ahora) => {
      if (!vivo) return;
      const p = Math.min(1, (ahora - inicio) / DURACION);
      efecto.style.setProperty('--hondo', p.toFixed(3));
      metros.textContent = `${Math.round(p * FONDO)} m`;
      if (p < 1) { raf = requestAnimationFrame(paso); return; }
      abajo = true;
      // en el fondo cambia el mensaje: ya no hace falta contener la respiración
      capa.querySelector('.juego-instruccion').innerHTML = Textos.enLinea((textos['juego-bucear-fondo'] || 'Hemos llegado, agente.').replace(/\s*\n\s*/g, ' ').trim());
      boton.disabled = false;
      boton.textContent = 'Abrir la cerradura';
      boton.focus();
    };
    boton.addEventListener('click', () => {
      if (!vivo) return;
      if (abajo) { vivo = false; fin.ganar(); return; }
      boton.disabled = true;
      boton.textContent = 'Bajando…';
      efecto.classList.add('sumergido');
      inicio = performance.now();
      raf = requestAnimationFrame(paso);
    });
    return () => { vivo = false; cancelAnimationFrame(raf); };
  }

  const JUEGOS = { laseres, codigo, caja, contrasena, descenso, bucear };
  const nombres = Object.keys(JUEGOS);
  return {
    nombres,
    etiquetas: { laseres: 'Láseres', codigo: 'Código', caja: 'Caja fuerte', contrasena: 'Contraseña', descenso: 'Descenso', bucear: 'Inmersión' },
    elegir: () => nombres[azar(nombres.length)],
    jugar: (nombre, capa, textos, fin) => {
      const tarjeta = capa.closest('.expediente');
      if (tarjeta) tarjeta.dataset.juego = nombre; // para que la ficha deje sitio a la franja del juego
      return JUEGOS[nombre](capa, textos, fin);
    },
  };
})();
