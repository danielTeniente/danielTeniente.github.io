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
    // la flecha da la vuelta al dial con los números: 40 posiciones, 9° cada una.
    // El ángulo se acumula (no vuelve a 0) para que al cerrar la vuelta no gire hacia atrás.
    let giro = valor * 9;
    const marcar = () => { dial.textContent = fmt(valor); dial.style.setProperty('--giro', `${giro}deg`); };
    marcar();
    const t = setInterval(() => { valor = (valor + 1) % 40; giro += 9; marcar(); }, 110);
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

  // 7. La pirámide (sólo para los «Expedientes Χ»): «el negocio perfecto», versión dramática.
  //    Un botón pone en marcha la pirámide un año. Cifras inventadas, pero salidas de esta simulación:
  //    la codicia sube la cuota cada mes (de 500 a 30.000 $), se promete el 15 % al mes de lo invertido
  //    (se paga primero a los más antiguos, mientras haya caja) y cada inscrito trae 0,68 personas al mes,
  //    hasta 5.000 inscritos. Las cabezas se quedan un 20 % de cada cuota y lo que sobre al final.
  //    Cada persona que pierde tiene unos ahorros al azar (media 5.000 $): si la cuota los superaba, pidió
  //    un préstamo; si tenía casa (4 de cada 10) y el préstamo pasaba los 8.000 $, la puso de garantía y la perdió.
  //    El azar usa siempre la misma semilla: el balance sale igual en cada visita. No se puede perder.
  function piramide(capa, textos, fin) {
    const FUNDADORES = 10, COMISION = 0.2, MAXIMO = 5000, CRECIMIENTO = 0.68, RENTA = 0.15;
    const CUOTAS = [500, 500, 1000, 1500, 2500, 4000, 6000, 9000, 13000, 18000, 24000, 30000];
    const AHORRO_MEDIO = 5000, CON_CASA = 0.4, PRESTAMO_CASA = 8000;
    const num = (x) => Math.round(x).toLocaleString('es-ES');
    const dinero = (x) => `${num(x)} $`;
    // azar con semilla fija (mulberry32), para que las cifras no cambien de una visita a otra
    const azarFijo = (semilla) => () => {
      semilla = (semilla + 0x6D2B79F5) | 0;
      let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const texto = (clave, defecto, datos = {}) => {
      let t = (textos[clave] || defecto).replace(/\s*\n\s*/g, ' ').trim();
      Object.entries(datos).forEach(([k, v]) => { t = t.split(`{${k}}`).join(v); });
      return Textos.enLinea(t);
    };
    const { efecto } = montar(capa, '<pre class="piramide-dibujo"></pre>',
      '', // sin instrucción: el botón lo dice todo
      `<div class="piramide-panel">
         <div class="piramide-acciones"><button type="button" class="boton juego-accion piramide-iniciar">Iniciar el negocio perfecto</button></div>
         <p class="juego-dato piramide-estado" aria-live="polite"></p>
         <div class="piramide-resultado" role="status" hidden></div>
       </div>`);
    const dibujo = efecto.querySelector('.piramide-dibujo'), boton = capa.querySelector('.piramide-iniciar');
    const estado = capa.querySelector('.piramide-estado'), resultado = capa.querySelector('.piramide-resultado');
    let t, vivo = true;

    const pintarPiramide = (inscritos) => {
      // una fila más cada vez que se duplica la gente (hasta 9 filas)
      const filas = Math.max(1, Math.min(9, Math.ceil(Math.log2(inscritos / FUNDADORES + 1))));
      dibujo.textContent = Array.from({ length: filas }, (_, i) => ' '.repeat(filas - 1 - i) + '▲'.repeat(2 * i + 1)).join('\n');
    };
    const simular = () => {
      const cohortes = [], meses = [];   // cohortes: [cuántos, cuota pagada, recibido por persona]
      let inscritos = FUNDADORES, caja = 0, cabezas = 0;
      CUOTAS.forEach((cuota, i) => {
        for (const c of cohortes) { const puede = Math.min(c[0] * c[1] * RENTA, caja); c[2] += puede / c[0]; caja -= puede; }
        const nuevos = Math.max(0, Math.min(Math.round(inscritos * CRECIMIENTO), MAXIMO - inscritos));
        if (!nuevos) return;
        cohortes.push([nuevos, cuota, 0]);
        inscritos += nuevos;
        cabezas += nuevos * cuota * COMISION;
        caja += nuevos * cuota * (1 - COMISION);
        meses.push({ mes: i + 1, cuota, inscritos, caja });
      });
      cabezas += caja; // al final las cabezas huyen con lo que queda
      const perdidas = cohortes.filter((c) => c[2] < c[1]).map((c) => ({ cuanto: c[1] - c[2], gente: c[0], cuota: c[1] }));
      const perdedores = perdidas.reduce((n, p) => n + p.gente, 0);
      // quién pidió un préstamo para entrar y quién perdió su casa
      const azar = azarFijo(1998);
      let prestamos = 0, casas = 0;
      for (const p of perdidas) {
        for (let k = 0; k < p.gente; k++) {
          const ahorros = -AHORRO_MEDIO * Math.log(1 - azar());
          const prestamo = Math.max(0, p.cuota - ahorros);
          if (prestamo > 0) {
            prestamos++;
            if (azar() < CON_CASA && prestamo > PRESTAMO_CASA) casas++;
          }
        }
      }
      return {
        meses, cabezas, perdedores, prestamos, casas, entraron: inscritos - FUNDADORES,
        minimo: Math.min(...perdidas.map((p) => p.cuanto)),
        maximo: Math.max(...perdidas.map((p) => p.cuanto)),
        promedio: perdidas.reduce((n, p) => n + p.cuanto * p.gente, 0) / perdedores,
      };
    };
    boton.addEventListener('click', () => {
      boton.disabled = true;
      const r = simular();
      let i = 0;
      // el negocio circula mes a mes delante del lector
      const paso = () => {
        if (!vivo) return;
        const m = r.meses[i];
        estado.innerHTML = `Mes <b>${m.mes}</b> · Cuota <b>${dinero(m.cuota)}</b> · Inscritos <b>${num(m.inscritos)}</b> · Caja <b>${dinero(m.caja)}</b>`;
        pintarPiramide(m.inscritos);
        i++;
        if (i < r.meses.length) { t = setTimeout(paso, quieto ? 0 : 320); return; }
        dibujo.classList.add('derrumbe');
        boton.closest('.piramide-acciones').hidden = true;
        const pct = Math.round((r.perdedores / r.entraron) * 100);
        const ANCHO = 30, llenos = Math.round((pct / 100) * ANCHO);
        resultado.innerHTML = `<p class="balance-titulo">${texto('piramide-titulo', 'Balance del ejercicio')}</p>
          <div class="balance">
            <div class="ficha-balance ganancia"><span class="ficha-etiqueta">${texto('piramide-cabezas', 'Las cabezas ganaron')}</span>
              <b class="ficha-cifra" data-hasta="${Math.round(r.cabezas)}" data-sufijo=" $">0 $</b><span class="ficha-nota">10 personas</span></div>
            <div class="ficha-balance perdida"><span class="ficha-etiqueta">${texto('piramide-perdieron', 'Perdieron dinero')}</span>
              <b class="ficha-cifra" data-hasta="${r.perdedores}" data-sufijo="">0</b><span class="ficha-nota">de ${num(r.entraron)} personas (${pct} %)</span></div>
            <div class="ficha-balance perdida"><span class="ficha-etiqueta">${texto('piramide-cada-una', 'Cada una perdió')}</span>
              <b class="ficha-cifra">${num(r.minimo)}–${num(r.maximo)} $</b><span class="ficha-nota">promedio ${dinero(r.promedio)}</span></div>
          </div>
          <p class="balance-barra" aria-label="${pct} % perdió dinero"><span class="perdieron">${'▓'.repeat(llenos)}</span><span class="ganaron">${'█'.repeat(ANCHO - llenos)}</span></p>
          <p class="balance-leyenda"><span class="perdieron">▓ perdieron ${pct} %</span> · <span class="ganaron">█ ganaron ${100 - pct} %</span></p>
          <p class="balance-drama">${texto('piramide-drama', '{prestamos} personas pidieron un préstamo para entrar. {casas} perdieron su casa.',
            { prestamos: `**${num(r.prestamos)}**`, casas: `**${num(r.casas)}**` })}</p>
          <p class="piramide-remate">${texto('piramide-final', 'Es el negocio perfecto para quien está en la punta. Para los demás, es una clase de geometría.')}</p>`;
        resultado.hidden = false;
        // las cifras suben como en un marcador (en un segundo); con «reducir movimiento», aparecen ya puestas
        resultado.querySelectorAll('[data-hasta]').forEach((el) => {
          const hasta = Number(el.dataset.hasta), sufijo = el.dataset.sufijo, PASOS = quieto ? 1 : 20;
          let k = 0;
          const subir = () => { k++; el.textContent = num((hasta * k) / PASOS) + sufijo; if (k < PASOS) setTimeout(subir, 50); };
          subir();
        });
        vivo = false;
        fin.ganar(null, { conservar: true }); // se queda el balance a la vista y aparece «Leer el expediente»
      };
      paso();
    });
    pintarPiramide(FUNDADORES);
    return () => { vivo = false; clearTimeout(t); };
  }

  // 8. El reto del gran maestro (sólo para los «Expedientes χ», en «Todo en contra»): para leer el expediente
  //    hay que derrotar a un Gran Maestro ruso (parodia). La habilidad de súper agente secreto lo despacha con el
  //    mate del pastor, que se juega en un tablero casi transparente de fondo; luego, confeti (de caracteres, sin
  //    imágenes), el mensaje de felicitación y «Leer el expediente». No se puede perder.
  function mundial(capa, textos, fin) {
    // {gm} = el nombre del gran maestro (## mundial-gm); {nombre} = sólo su nombre de pila
    const gm = (textos['mundial-gm'] || 'Dmitri Zhelezovsky').replace(/\s*\n\s*/g, ' ').trim();
    const nombre = gm.split(' ')[0];
    const texto = (clave, defecto) => Textos.enLinea((textos[clave] || defecto).replace(/\s*\n\s*/g, ' ').trim()
      .split('{gm}').join(gm).split('{nombre}').join(nombre));
    // en el reto, «Gran Maestro» y el nombre van con un texto especial
    const reto = texto('mundial-reto', 'Para leer este material debe derrotar al Gran Maestro {gm}.')
      .replace(/gran maestro/i, (m) => `<span class="gm-titulo">${m}</span>`)
      .replace(gm, `<span class="gm-nombre">${gm}</span>`);
    // tablero de fondo (casi transparente) con la posición inicial; al usar la habilidad se juega el mate del pastor
    const INICIO = ['♜♞♝♛♚♝♞♜', '♟♟♟♟♟♟♟♟', '        ', '        ', '        ', '        ', '♙♙♙♙♙♙♙♙', '♖♘♗♕♔♗♘♖'];
    const piezas = INICIO.map((fila) => [...fila]);
    const MATE = [['e2', 'e4'], ['e7', 'e5'], ['f1', 'c4'], ['b8', 'c6'], ['d1', 'h5'], ['g8', 'f6'], ['h5', 'f7']];
    const casilla = (c) => [8 - Number(c[1]), c.charCodeAt(0) - 97]; // 'e4' → [fila, columna]
    // ︎: que las piezas salgan como texto y no como emoji de colores (en el móvil, ♟ suele volverse emoji)
    const glifo = (p) => (p.trim() ? p + '︎' : '');
    const celdas = [];
    for (let f = 0; f < 8; f++) for (let c = 0; c < 8; c++) celdas.push(`<span class="${(f + c) % 2 ? 'oscura' : 'clara'}" data-f="${f}" data-c="${c}">${glifo(piezas[f][c])}</span>`);
    const { efecto } = montar(capa, `<div class="tablero-fondo">${celdas.join('')}</div>`,
      '', // sin instrucción: en los Expedientes χ el botón lo dice todo
      `<div class="piramide-panel">
         <p class="juego-instruccion mundial-reto">${reto}</p>
         <div class="piramide-acciones"><button type="button" class="boton juego-accion mundial-agente">${texto('mundial-agente', 'Usar habilidad de súper agente secreto')}</button></div>
         <p class="piramide-remate mundial-final" role="status" hidden>${texto('mundial-final', 'Muy bien, agente, derrotó a {nombre} con un mate pastor, felicitaciones.')}</p>
       </div>`);
    const agente = capa.querySelector('.mundial-agente'), final = capa.querySelector('.mundial-final');
    let t, vivo = true;
    const confeti = () => {
      const COLORES = ['var(--p-luz)', 'var(--p-triada1)', 'var(--p-triada2)', 'var(--p-titulos)'];
      const PIEZAS = ['✦', '●', '▲', '■', '♦', '♚', '♔', '★'];
      const lluvia = document.createElement('div');
      lluvia.className = 'confeti';
      lluvia.innerHTML = Array.from({ length: quieto ? 0 : 60 }, (_, k) =>
        `<i style="left:${azar(100)}%;color:${COLORES[k % COLORES.length]};animation-duration:${1.4 + azar(14) / 10}s;animation-delay:${azar(500)}ms">${PIEZAS[azar(PIEZAS.length)]}</i>`).join('');
      efecto.appendChild(lluvia);
      setTimeout(() => lluvia.remove(), 3500);
    };
    const celda = (f, c) => efecto.querySelector(`[data-f="${f}"][data-c="${c}"]`);
    agente.addEventListener('click', () => {
      if (!vivo) return;
      agente.closest('.piramide-acciones').hidden = true;
      let k = 0;
      // el mate del pastor, jugada a jugada, en el tablero de fondo
      const mover = () => {
        if (!vivo) return;
        const [de, a] = MATE[k];
        const [f1, c1] = casilla(de), [f2, c2] = casilla(a);
        piezas[f2][c2] = piezas[f1][c1]; piezas[f1][c1] = ' ';
        efecto.querySelectorAll('.ultima').forEach((e) => e.classList.remove('ultima'));
        celda(f1, c1).textContent = ''; celda(f2, c2).textContent = glifo(piezas[f2][c2]);
        celda(f1, c1).classList.add('ultima'); celda(f2, c2).classList.add('ultima');
        k++;
        if (k < MATE.length) { t = setTimeout(mover, quieto ? 0 : 550); return; }
        // jaque mate: el rey negro se queda en rojo y el tablero se ilumina un momento
        celda(0, 4).classList.add('mate');
        efecto.querySelector('.tablero-fondo').classList.add('en-mate'); // ojo: «final» ya es el pie del artículo
        t = setTimeout(() => {
          if (!vivo) return;
          vivo = false;
          final.hidden = false;
          confeti();
          fin.ganar(null, { conservar: true }); // el mensaje se queda a la vista y aparece «Leer el expediente»
        }, quieto ? 0 : 700);
      };
      mover();
    });
    return () => { vivo = false; clearTimeout(t); };
  }

  const JUEGOS = { laseres, codigo, caja, contrasena, descenso, bucear, piramide, mundial };
  // la pirámide y la entrada al duelo no entran en el sorteo ni en la barra de prueba: son de los Expedientes χ
  const nombres = Object.keys(JUEGOS).filter((n) => !['piramide', 'mundial'].includes(n));
  return {
    nombres,
    todos: Object.keys(JUEGOS),
    etiquetas: { laseres: 'Láseres', codigo: 'Código', caja: 'Caja fuerte', contrasena: 'Contraseña', descenso: 'Descenso', bucear: 'Inmersión' },
    elegir: () => nombres[azar(nombres.length)],
    jugar: (nombre, capa, textos, fin) => {
      const tarjeta = capa.closest('.expediente');
      if (tarjeta) tarjeta.dataset.juego = nombre; // para que la ficha deje sitio a la franja del juego
      return JUEGOS[nombre](capa, textos, fin);
    },
  };
})();
