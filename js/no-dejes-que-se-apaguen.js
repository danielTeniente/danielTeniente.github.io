/* ==========================================================
   Minijuego «No dejes que se apaguen» (avance de Odio este clima).
   Sin ver nunca a Blab (como «Inmersión» en No ficción), con aspecto
   retro de píxeles gordos y los colores de la portada del relato.
   - CAMINATA: la nieve vista con los ojos de Blab. Pulsas «Caminar» una
     vez y avanzas solo hasta la máquina, a grandes zancadas: la vista
     sube, cae con cada paso y se mece de lado (se mueve el dibujo, no la
     imagen entera), y la nieve se te viene encima con cada paso. Delante sólo
     hay una pared de nieve blanca celeste, sin suelo ni cielo. Las máquinas no tienen luz
     (Blab sabe dónde están): al acercarte aparece un bloque oscuro entre la
     nieve, cada vez más grande, y al llegar sale su nombre. El viaje empieza
     de día y acaba de noche: la pared se va oscureciendo hacia los violetas
     y azules de la parte alta de la portada.
     Desde el segundo tramo puede llegar una ráfaga (o ninguna): te detienes.
     Todos los textos del juego van en segunda persona (caminas, te detienes…).
   - EL PANEL: al llegar sólo se ve el panel de la máquina (un cuadrado con
     sus huecos). Blab saca las piezas de un saco: casi siempre sale una que
     falta; a veces, otra cosa. Las que llevan «(no está)» no aparecen.
     Después, sus frases salen de una en una sobre la nieve, sin el panel.
   - ANTES DEL PANEL (## <máquina>-antes): frases sobre la nieve antes de
     reparar (la espera de ModelG_33, que aún no ha aterrizado): con cada
     frase anochece un poco más.
   - «(se va)» al final de una frase: el bloque de la máquina se marcha
     (ModelG_33 se aleja volando; los demás se pierden en la nieve).
   Textos (orden del viaje, piezas, frases) en textos/no-dejes-que-se-apaguen.md.
   NoDejesQueSeApaguen.montar(contenedor) lo pone en la página.
   ========================================================== */
const NoDejesQueSeApaguen = (() => {
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const azar = (a, b) => a + Math.random() * (b - a);
  const plano = (s) => (s || '').replace(/\s*\n\s*/g, ' ').trim();
  const lista = (s) => (s || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());
  const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const VELOCIDAD = 0.15; // km por segundo caminando
  const FALLO_SACO = 0.4; // probabilidad de sacar del saco algo que no sirve

  // LA PARED DE NIEVE: delante sólo hay nieve, sin suelo ni cielo. De día, blanca celeste (colores de la
  // portada); de noche, cada color se cambia por su pareja violeta o azul de la parte alta de la portada.
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const PARED = ['#87D6E3', '#9DDDE8', '#B2E5ED', '#C9EFF5', '#DDF5F9'].map(hex);
  const PARED_NOCHE = ['#2F275C', '#3B3170', '#493F7C', '#484D80', '#465483'].map(hex);
  const BLOQUE = hex('#1C2A40'); // la máquina, de lejos: un bloque oscuro entre la nieve
  const rgb = (c) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
  const mezclar = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  // tramado de 8 bits (matriz de Bayer 4×4)
  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]].map((f) => f.map((v) => v / 16 - 0.47));

  // Lo único que se ve de cada máquina es su panel: un cuadrado con su nombre y los huecos
  // de las piezas, de dos en dos. [1_______] = hueco 1 (10 caracteres)
  function panel(id, huecos) {
    const ancho = 26;
    const linea = (txt = '') => `|${txt.padEnd(ancho)}|`;
    const filas = [` ${'_'.repeat(ancho)}`, linea(` ${id}`), linea()];
    for (let i = 0; i < huecos; i += 2) filas.push(linea(`  [${i + 1}_______]${i + 1 < huecos ? `  [${i + 2}_______]` : ''}`));
    filas.push(`|${'_'.repeat(ancho)}|`);
    return filas.join('\n');
  }

  async function leerTextos() {
    try {
      const r = await fetch('../textos/no-dejes-que-se-apaguen.md', { cache: 'no-cache' });
      return r.ok ? Textos.parsear(await r.text()) : {};
    } catch (e) { return {}; }
  }

  async function montar(cont) {
    // Textos.parsear guarda los nombres de las secciones en minúsculas: así T.ModelS_69 encuentra «## ModelS_69»
    const T = new Proxy(await leerTextos(), { get: (o, k) => (typeof k === 'string' ? o[k.toLowerCase()] : undefined) });
    const txt = (k, d) => plano(T[k]) || d;
    const t = (k, d, maquina = '') => Textos.enLinea(txt(k, d).replace(/\{maquina\}/g, maquina));
    const parrafos = (k, d) => (T[k] || d).split(/\n\s*\n/).map((p) => plano(p)).filter(Boolean).map((p) => `<p>${Textos.enLinea(p)}</p>`).join('');
    const ruta = (lista(T.ruta).length ? lista(T.ruta) : ['ModelS_69 · 2,5', 'ModelG_33 · 3', 'ModelH_44 · 3,5'])
      .map((l) => { const [id, d] = l.split('·').map((x) => x.trim()); return { id, objetivo: parseFloat((d || '2').replace(',', '.')) || 2 }; })
      .filter((m) => /^Model\w+$/.test(m.id));

    cont.innerHTML = `
      <div class="viaje">
        <div class="viaje-vista" id="viaje-vista">
          <canvas class="viaje-nieve" id="viaje-nieve" aria-hidden="true"></canvas>
          <p class="viaje-nombre" id="viaje-nombre" aria-hidden="true"></p>
          <div class="viaje-blanco" id="viaje-blanco" aria-hidden="true"></div>
          <p class="viaje-rotulo" id="viaje-rotulo" aria-live="polite" hidden></p>
          <div class="taller" id="taller" hidden>
            <pre class="taller-arte" id="taller-arte"></pre>
            <p class="taller-nota" id="taller-nota" aria-live="polite"></p>
          </div>
          <div class="juego-portada" id="viaje-portada">
            <p class="juego-titulo">${t('titulo', 'No dejes que se apaguen')}</p>
            <div class="juego-texto" id="viaje-portada-texto">${parrafos('instrucciones', 'Mira el mundo a través de los ojos de Blab.')}</div>
            <button type="button" class="retro-boton" id="viaje-empezar">${t('boton', 'Empezar')}</button>
          </div>
        </div>
        <div class="viaje-pie">
          <button type="button" class="retro-boton viaje-accion" id="viaje-accion" hidden></button>
        </div>
      </div>`;
    const $ = (id) => cont.querySelector(`#${id}`);
    const vista = $('viaje-vista'), lienzo = $('viaje-nieve'), ctx = lienzo.getContext('2d');
    const nombre = $('viaje-nombre'), taller = $('taller'), portada = $('viaje-portada');
    const accion = $('viaje-accion');
    const nota = $('taller-nota'), arte = $('taller-arte');

    // ---------- estado ----------
    let estado = 'portada', tramo = 0, avance = 0, caminando = false, pasos = 0, reloj = 0, pierna = 0;
    let tarde = 0, tardeObjetivo = 0; // lo que anochece de más mientras esperas
    let aterrizado = false; // ModelG_33: su bloque no se ve hasta que aterriza
    let salida = null; // la máquina se marcha: { t, vuela }
    const VUELA = (m) => m && m.id === 'ModelG_33'; // la que vuela: no está al llegar y se va por el aire
    const cam = { x: 0, y: 0 }; // dónde está la cabeza de Blab
    let rafaga = { fase: 'calma', t: 0, siguiente: 6 };
    const maquina = () => ruta[tramo];
    const decir = (texto) => { nota.innerHTML = Textos.enLinea(texto || ''); };

    // ---------- la vista, en píxeles gordos ----------
    const PIXEL = 3; // cada píxel del dibujo mide 3 px en pantalla
    let LW = 0, LH = 0, img = null;
    const copos = Array.from({ length: 120 }, () => ({ x: azar(-1.6, 1.6), y: azar(-1.2, 1.2), z: azar(0.2, 3) }));
    function medir() {
      const r = vista.getBoundingClientRect();
      LW = Math.max(100, Math.round(r.width / PIXEL)); LH = Math.max(70, Math.round(r.height / PIXEL));
      lienzo.width = LW; lienzo.height = LH;
      img = ctx.createImageData(LW, LH);
    }

    function dibujar(dt) {
      if (!img) return;
      const andando = caminando && estado === 'caminar' && rafaga.fase !== 'rafaga';
      // ZANCADAS: cada paso, la cabeza sube al sacar la pierna de la nieve, cae al hundirla
      // y se mece hacia el lado de la pierna que avanza (sin inclinarse)
      if (andando) pasos += dt * 1.9; // un paso (media vuelta) cada ~1,7 s: zancadas lentas, pesadas
      const fase = (pasos % Math.PI) / Math.PI; // 0 a 1 dentro de un paso
      pierna = andando ? Math.sin(fase * Math.PI) : 0;
      const hundirse = andando && fase > 0.82 ? (fase - 0.82) / 0.18 : 0; // el golpe al pisar
      // (en píxeles del dibujo: al subir la cabeza, el horizonte baja; se mueve todo lo dibujado, también el tramado)
      const objetivo = andando && !quieto ? { x: Math.sin(pasos) * 2.2, y: -pierna * 5 + hundirse * 2 } : { x: 0, y: 0 };
      const suave = Math.min(1, dt * (andando ? 14 : 4));
      cam.x += (objetivo.x - cam.x) * suave; cam.y += (objetivo.y - cam.y) * suave;
      const sx = Math.round(-cam.x), sy = Math.round(-cam.y);

      // DEL DÍA A LA NOCHE: la pared de nieve se va oscureciendo durante el viaje (y mientras esperas)
      tarde += (tardeObjetivo - tarde) * Math.min(1, dt * 1.5);
      const m = maquina();
      const viaje = Math.min(1, (tramo + (m ? avance / m.objetivo : 0)) / Math.max(1, ruta.length));
      const dia = estado === 'portada' ? 1 : Math.max(0, Math.min(1, 1 - viaje - tarde));
      const noche = 1 - dia;
      const hy = Math.round(LH * 0.5) + sy;
      const colores = PARED.map((c, i) => mezclar(c, PARED_NOCHE[i], noche));
      const d = img.data;
      for (let y = 0; y < LH; y++) {
        const yy = y - sy;
        for (let x = 0; x < LW; x++) {
          const xx = x - sx;
          // la nieve que sopla: manchas suaves que se mueven despacio (nada de franjas ni brillos)
          const sopla = 0.45 * Math.sin(xx * 0.09 + yy * 0.05 + reloj * 0.7) * Math.sin(yy * 0.11 - xx * 0.03 - reloj * 0.5);
          const f = 2.2 + (yy / LH - 0.5) * 0.6 + sopla; // apenas más claro abajo
          const k = Math.max(0, Math.min(colores.length - 1, Math.floor(f + BAYER[yy & 3][xx & 3]))); // el tramado va pegado al dibujo
          const c = colores[k];
          const i = (y * LW + x) * 4;
          d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);

      // LA MÁQUINA: un bloque oscuro que asoma entre la nieve y crece al acercarte. ModelG_33 no está
      // hasta que aterriza. Con «(se va)», el bloque se marcha: hacia arriba si vuela; si no, se pierde en la nieve.
      let bloqueAbajo = hy;
      let tam = -1; // 0 a 1; -1 = no se ve
      if (m && (estado === 'caminar' || estado === 'llegada')) { const cerca = avance / m.objetivo; if (!VUELA(m) && cerca > 0.3) tam = (cerca - 0.3) / 0.7; }
      else if (m && estado === 'antes') { if (!VUELA(m)) tam = 1; }
      else if (m && ['saco', 'sin-piezas', 'lectura'].includes(estado) && (aterrizado || !VUELA(m))) tam = 1;
      if (tam >= 0) {
        const q = salida ? Math.min(1, salida.t / 3.5) : 0;
        const escala = salida ? (salida.vuela ? 1 - q * 0.6 : 1 - q * 0.85) : 1;
        const sube = salida && salida.vuela ? q * LH * 0.7 : 0;
        const w = Math.max(1, Math.round((3 + tam * 22) * escala)), h = Math.max(1, Math.round(w * 1.25));
        const niebla = Math.min(1, (1 - tam) * 0.85 + q * 0.95);
        if (niebla < 0.98) {
          ctx.fillStyle = rgb(mezclar(BLOQUE, colores[2], niebla)); // de lejos (o al irse) casi se confunde con la pared
          ctx.fillRect(Math.round(LW / 2 + sx - w / 2), Math.round(hy - h / 2 - sube), w, h);
        }
        bloqueAbajo = Math.round(hy + h / 2 - sube);
      }

      // la nieve: se te viene encima a empujones, con cada zancada; de lado con la ráfaga
      const avanceNieve = andando ? 0.25 + pierna * 1.1 : 0.05;
      const viento = rafaga.fase === 'rafaga' ? 2.6 : 0.12;
      ctx.fillStyle = '#FFFFFF';
      copos.forEach((c) => {
        if (!quieto) {
          c.z -= avanceNieve * dt; c.y += 0.12 * dt; c.x += viento * dt * (0.5 + c.z * 0.3);
          if (c.z < 0.15 || c.y > 1.4 || c.x > 1.8) { c.z = azar(1.5, 3); c.x = azar(-1.8, 1.4); c.y = azar(-1.2, 1); }
        }
        const x = Math.round(LW / 2 + (c.x / c.z) * LW * 0.5), y = Math.round(hy + (c.y / c.z) * LH * 0.5);
        if (x < 0 || x >= LW || y < 0 || y >= LH) return;
        const s = c.z < 0.6 ? 2 : 1;
        ctx.fillRect(x, y, s, s);
        if (rafaga.fase === 'rafaga') ctx.fillRect(x - 3, y, 3, 1); // la estela del viento
      });

      // el nombre, sólo cuando ya has llegado, bajo el bloque
      nombre.textContent = m && estado === 'llegada' ? m.id : '';
      nombre.style.top = `${((bloqueAbajo + 3) / LH) * 100}%`;
    }

    // ---------- bucle ----------
    let antes = 0;
    function cuadro(ahora) {
      const dt = Math.min(0.05, (ahora - antes) / 1000 || 0);
      antes = ahora; reloj += dt;
      if (salida) salida.t += dt;
      if (estado === 'caminar') caminar(dt);
      dibujar(dt);
      requestAnimationFrame(cuadro);
    }

    function caminar(dt) {
      const m = maquina();
      // ráfagas: nunca en el primer tramo; en los demás, a veces una (aviso, ráfaga: te detienes, calma)
      if (tramo > 0) {
        if (caminando) rafaga.t += dt; // cuenta sólo mientras caminas
        if (rafaga.fase === 'calma' && rafaga.t > rafaga.siguiente && caminando) { rafaga = { ...rafaga, fase: 'aviso', t: 0 }; rotular(t('rafaga-aviso', 'Se acerca una ráfaga.')); vista.classList.add('aviso'); }
        else if (rafaga.fase === 'aviso' && rafaga.t > 1.4) { rafaga.fase = 'rafaga'; rafaga.t = 0; vista.classList.remove('aviso'); vista.classList.add('rafaga'); rotular(t('rafaga-detenerse', 'Te detienes.')); }
        else if (rafaga.fase === 'rafaga' && rafaga.t > 2.4) { rafaga = { fase: 'calma', t: 0, siguiente: azar(8, 24) }; vista.classList.remove('rafaga'); instruccionCaminar(); }
      }
      if (caminando && rafaga.fase !== 'rafaga') { avance += VELOCIDAD * dt; }
      if (avance >= m.objetivo) { avance = m.objetivo; llegar(); }
    }
    // LOS TEXTOS DEL CAMINO van en un rótulo dentro de la vista, para que no quede vacía:
    // en el centro «Te levantas temprano…»; los demás, un poco más arriba, para no tapar a la máquina
    const rotulo = $('viaje-rotulo');
    function rotular(html, centro = false) {
      rotulo.hidden = !html;
      rotulo.innerHTML = html || '';
      rotulo.classList.toggle('centro', centro);
    }
    // antes de pulsar «Caminar»: al levantarte, «Te levantas temprano…»; después, nada. Al caminar, «Caminas sin descanso...»
    function instruccionCaminar() {
      if (caminando) rotular(t('en-camino', 'Caminas sin descanso...'));
      else rotular(tramo === 0 ? t('levantarse', 'Te levantas temprano para poder visitar a tus amigos.') : '', true);
    }

    // ---------- de máquina en máquina ----------
    function empezarTramo() {
      estado = 'caminar'; avance = 0; caminando = false; aterrizado = false; salida = null;
      arte.classList.remove('debil');
      rafaga = { fase: 'calma', t: 0, siguiente: azar(8, 30) }; // nunca nada más echar a andar; a veces, ninguna
      vista.classList.remove('aviso', 'rafaga');
      taller.hidden = true;
      accion.hidden = false; accion.disabled = false;
      accion.innerHTML = t('caminar', 'Caminar');
      instruccionCaminar();
    }
    function siguienteTramo() {
      tramo++;
      if (tramo >= ruta.length) terminar(); else empezarTramo();
    }
    function llegar() {
      caminando = false;
      vista.classList.remove('aviso', 'rafaga');
      const m = maquina();
      estado = 'llegada';
      rotular(t('llegar', 'Has llegado a {maquina}.', m.id));
      accion.disabled = false;
      if (lista(T[`${m.id}-antes`]).length) return empezarAntes();
      accion.innerHTML = t('reparar', 'Reparar');
    }
    const ventana = (conPanel) => {
      rotular('');
      taller.hidden = false;
      arte.hidden = !conPanel;
      decir('');
    };

    // ---------- ANTES DEL PANEL: frases sobre la nieve, de una en una ----------
    // cada línea de «## <máquina>-antes»: «botón → texto» (la primera, sin botón).
    // Es una espera (ModelG_33): con cada frase anochece un poco más.
    let antesDe = [], pasoAntes = 0;
    const partirAntes = (l) => {
      const [boton, texto] = l.includes('→') ? l.split('→').map((x) => x.trim()) : ['', l];
      return { boton, texto };
    };
    function empezarAntes() {
      estado = 'antes';
      antesDe = lista(T[`${maquina().id}-antes`]).map(partirAntes);
      pasoAntes = 0;
      mostrarAntes();
    }
    function mostrarAntes() {
      const p = antesDe[pasoAntes], sig = antesDe[pasoAntes + 1];
      rotular(Textos.enLinea(p.texto));
      tardeObjetivo = Math.min(0.3, pasoAntes * 0.04); // mientras esperas, anochece
      accion.innerHTML = sig ? Textos.enLinea(sig.boton || txt('siguiente', 'Siguiente')) : t('reparar', 'Reparar');
    }
    function pasoDeAntes() {
      if (pasoAntes < antesDe.length - 1) { pasoAntes++; mostrarAntes(); return; }
      abrirPanel();
    }

    // ---------- el panel y el saco ----------
    let piezas = [], llenos = [];
    function abrirPanel() {
      const m = maquina();
      estado = 'saco';
      aterrizado = true;
      piezas = lista(T[`${m.id}-piezas`]).map((p) => ({ nombre: p.replace(/\s*\(no está\)\s*$/i, ''), falta: /\(no está\)\s*$/i.test(p) }));
      llenos = piezas.map(() => false);
      ventana(piezas.length > 0);
      arte.classList.toggle('debil', m.id === 'ModelH_44'); // ModelH_44: el panel parpadea, como si le costara seguir encendido
      pintarPanel();
      decir(txt(`${m.id}-llegar`, ''));
      if (!piezas.length) { accion.innerHTML = t('siguiente', 'Siguiente'); estado = 'sin-piezas'; return; }
      accion.hidden = false; accion.disabled = false;
      accion.innerHTML = t('saco', 'Buscar pieza en el saco');
    }
    function pintarPanel() {
      const m = maquina();
      arte.innerHTML = escapar(panel(m.id, piezas.length)).replace(/\[(\d)_{7}\]/g, (_, n) => {
        const i = Number(n) - 1, p = piezas[i];
        if (!p) return '          ';
        return `<span class="hueco${llenos[i] ? ' lleno' : ''}">[ ${escapar(p.nombre.slice(0, 7).padEnd(7))}]</span>`;
      });
    }
    // casi siempre sale una pieza que falta; a veces, otra cosa
    function buscarEnSaco() {
      const faltan = piezas.map((p, i) => (llenos[i] || p.falta ? -1 : i)).filter((i) => i >= 0);
      if (!faltan.length) return;
      if (Math.random() < FALLO_SACO) {
        const cosas = lista(T['saco-fallo']);
        decir(cosas.length ? cosas[Math.floor(Math.random() * cosas.length)] : 'No es la que necesitas.');
        return;
      }
      const i = faltan[Math.floor(Math.random() * faltan.length)];
      llenos[i] = true;
      decir(txt('saco-saca', 'Sacas {pieza} y la pones en su sitio.').replace(/\{pieza\}/g, piezas[i].nombre));
      pintarPanel();
      if (faltan.length === 1) { accion.disabled = true; setTimeout(terminada, 1100); }
    }
    function terminada() {
      const m = maquina();
      const sinEncontrar = piezas.filter((p) => p.falta).map((p) => txt('saco-no-esta', 'No queda ninguna {pieza} en el saco.').replace(/\{pieza\}/g, p.nombre));
      const despues = () => leer(lista(T[m.id]));
      if (sinEncontrar.length) return leer(sinEncontrar, despues, true); // esto aún se lee con el panel delante
      despues();
    }

    // frases una a una con «Siguiente»; al final, «Seguir caminando» (o lo que toque después).
    // Las de después de reparar salen sin el panel, de una en una sobre la nieve (encima del bloque, sin taparlo).
    // Una frase que acaba en «(se va)» hace que la máquina se marche.
    let lectura = null;
    function leer(frases, despues = null, enPanel = false) {
      if (!frases.length && despues) return despues();
      estado = 'lectura';
      lectura = { frases: frases.length ? frases : [''], i: 0, despues, enPanel };
      if (!enPanel) taller.hidden = true;
      mostrarFrase();
    }
    function mostrarFrase() {
      const { frases, i, despues, enPanel } = lectura;
      let frase = frases[i] || '';
      if (/\(se va\)\s*$/i.test(frase)) { frase = frase.replace(/\s*\(se va\)\s*$/i, ''); if (!salida) salida = { t: 0, vuela: VUELA(maquina()) }; }
      if (enPanel) decir(frase); else rotular(Textos.enLinea(frase));
      accion.hidden = false; accion.disabled = false;
      const ultima = i >= frases.length - 1;
      accion.innerHTML = !ultima || despues || tramo >= ruta.length - 1 ? t('siguiente', 'Siguiente') : t('seguir', 'Seguir caminando');
    }

    function terminar() {
      estado = 'final';
      taller.hidden = true; accion.hidden = true; rotular('');
      // el final: todas sus líneas en un mismo bloque (una debajo de otra)
      const final = (T.final || 'Fin.').split(/\r?\n/).map((l) => plano(l)).filter(Boolean).map((l) => Textos.enLinea(l)).join('<br>');
      $('viaje-portada-texto').innerHTML = `<p>${final}</p>`;
      $('viaje-empezar').innerHTML = t('reintentar', 'Otra vez');
      portada.classList.add('final');
      portada.hidden = false;
    }

    // ---------- un solo botón para todo ----------
    accion.addEventListener('click', () => {
      if (estado === 'caminar') { // se pulsa una vez y Blab sigue solo hasta la máquina
        if (caminando) return;
        caminando = true;
        accion.disabled = true;
        accion.innerHTML = t('caminando-boton', 'Caminando…');
        instruccionCaminar();
      } else if (estado === 'llegada') abrirPanel();
      else if (estado === 'antes') pasoDeAntes();
      else if (estado === 'saco') buscarEnSaco();
      else if (estado === 'sin-piezas') leer(lista(T[maquina().id]));
      else if (estado === 'lectura') {
        if (lectura.i < lectura.frases.length - 1) { lectura.i++; mostrarFrase(); return; }
        rotular('');
        if (lectura.despues) lectura.despues(); else siguienteTramo();
      }
    });
    $('viaje-empezar').addEventListener('click', () => {
      tramo = 0; tarde = 0; tardeObjetivo = 0;
      portada.hidden = true; portada.classList.remove('final');
      empezarTramo();
      accion.focus({ preventScroll: true });
    });

    window.addEventListener('resize', medir);
    medir();
    requestAnimationFrame((a) => { antes = a; requestAnimationFrame(cuadro); });
  }

  return { montar };
})();
