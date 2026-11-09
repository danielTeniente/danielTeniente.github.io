# La Página de Daniel DB

Web de artista de **Daniel DB**: escritor, músico, guionista y científico de datos.
Es una página personal al estilo de 1998, inspirada en la web del **Señor X** de *Los Simpson*
(temporada 12, episodio 6, «The Computer Wore Menace Shoes»), con humor de *Los Simpson* y *Futurama*.

- HTML, CSS y JavaScript puros. Sin frameworks, sin compilación, sin dependencias.
- Pensada para publicarse en **GitHub Pages**.
- **Los textos los escribe Daniel en Markdown** (`textos/portada.md`), sin tocar código.

---

## 1. Cómo verla en tu computadora

La página lee sus textos con `fetch`, así que **necesita un servidor**. Si abres `index.html` con doble clic, verás solo los textos por defecto.

Desde la carpeta del proyecto:

```bash
python -m http.server 5173
```

y abre <http://localhost:5173>. (En Claude Code el servidor está configurado en `.claude/launch.json` con el nombre `web-artista`.)

### Publicada en internet
La web vive en **https://danielteniente.github.io/** (GitHub Pages, rama `master`, carpeta raíz).
Repositorio: <https://github.com/danielTeniente/danielTeniente.github.io>.

**Para publicar una actualización**, desde la carpeta del proyecto:

```bash
git add -A
git commit -m "Qué cambié, en una frase"
git push
```

GitHub actualiza la web sola en uno o dos minutos. Si tus amigos no ven el cambio, que recarguen con Ctrl + F5.
Antes de publicar, revisa en `localhost` que todo se vea bien: lo que subes es lo que verán.

---

## 2. Cómo editar los textos (para Daniel)

1. Abre [`textos/portada.md`](textos/portada.md) en VS Code.
2. Cambia el texto **debajo** de cada `## nombre`. **No cambies los nombres de los `##`**: la página los usa para saber dónde va cada texto.
3. Guarda y recarga el navegador (si algo no cambia, **Ctrl + F5**).

Formato que puedes usar:

| Escribes | Se ve |
|---|---|
| `*texto*` | *cursiva* (frases en inglés, títulos de películas, libros, discos) |
| `**texto**` | **negrita** |
| `[texto](https://…)` | un enlace |
| `- ` al principio de la línea | un elemento de una lista |
| `---` solo en una línea | separa grupos (en *Grandes sucesos*) |
| `<!-- … -->` | un comentario: la página lo ignora (sirve para guardar ideas) |

Si borras una sección entera, la página usa su texto por defecto (el que está en `index.html`).

### Qué controla cada sección

| Sección | Dónde sale | Cómo funciona |
|---|---|---|
| `bienvenidos` | «¡¡¡BIENVENIDOS!!!» sobre el título | texto |
| `titulo` | Título WordArt | cada línea del `.md` es una línea |
| `lema`, `lema-pequeno` | Bajo el título | texto |
| `obras` | Cinta amarilla de arriba | texto plano |
| `marquesina` | Letrero que se desplaza | **estado del artista del mes**: lista con `- `, en orden, separada por `***`. `{visitante}` marca dónde va la frase según la hora. Se pasa a mayúsculas solo. |
| `marquesina-visitante` | Dentro de la marquesina | `- DESDE a HASTA: frase` (horas 0–24, puede cruzar medianoche: `22 a 3`). `{hora}` = hora del visitante. |
| `menu` | Botones de la izquierda | `- [Texto](enlace)`; añade `¡NUEVO!` al final para que parpadee |
| `contador-nota` | Bajo el contador | texto |
| `carta-titulo`, `saludo`, `carta`, `firma` | Columna central | `carta`: párrafos separados por una línea en blanco |
| `posdata` | Bajo la firma | lista: **sale una al azar** en cada visita |
| `noticias-titulo` | Título de la caja derecha («Grandes sucesos») | texto plano |
| `noticias` | Caja «Grandes sucesos» | chistes en tres actos: grupos de `- **fecha** texto` separados por `---`. **Sale un grupo al azar.** |
| `libro-visitas` | Caja del libro de visitas | los enlaces `(#firmar)` y `(#leer)` abren las ventanas: **no los cambies** |
| `firmar-titulo`, `firmar-aviso` | Ventana de error al pulsar «Firmar» | `firmar-aviso`: lista, **sale un motivo al azar** en cada intento |
| `leer-titulo`, `firmas` | Ventana al pulsar «Leer» | `- **Nombre** · desde dónde: mensaje`. Traducción: `original [traducción] texto` o `[traducción Fuente] …`. Varias fichas con `//`. |
| `reproductor` | Reproductor MIDI que no suena | 1.ª línea = canción; las demás, mensajes al pulsar PLAY. `{fibonacci}` = barra de carga 1, 1, 2, 3, 5… % hasta 1597 %. Las líneas que empiezan con `error` duran más y ocultan la barra. |
| `insignias` | Botones de 88×31 del pie | lista |
| `pie` | Pie de página | texto |
| `secreto-titulo`, `secreto`, `secreto-boton` | Easter egg al pulsar la **@** giratoria | párrafos |

### Página «No ficción» — [`textos/no-ficcion.md`](textos/no-ficcion.md)
Se entra desde el botón «No ficción (demasiado pretensioso)» de la portada. Usa el concepto **Misión**:
un briefing que se autodestruye y, detrás, el **archivo de expedientes**. Quien ya aceptó la misión entra directo al archivo (hay un botón «Repetir el briefing»).

| Sección | Qué controla |
|---|---|
| `hud-izquierda`, `hud-derecha`, `para`, `titulo`, `mision`, `aceptar`, `cuenta` | El briefing. En `cuenta`, `{n}` son los segundos. |
| `archivo-titulo`, `archivo-intro`, `repetir`, `pie` | El archivo de expedientes |
| `expedientes` | Lista: `- [Título](destino) · Categoría · fecha · subtítulo`. Si el destino es un **nombre de archivo** (sin `.md`) el texto vive en `textos/no-ficcion/`; si es un **enlace https** sale como «En Substack ↗». Se numeran solos. |
| `clasificado-titulo`, `clasificado-clave`, `clasificado-pista`, `clasificado-contenido` | **Expediente 000**: pide un código (hoy, `lupus`); si falla muestra la pista. |
| `autodestruir-boton`, `autodestruir-mensaje` | El botón del final de cada artículo (que no destruye nada) |

### Artículos — `textos/no-ficcion/<nombre>.md`
Cada artículo es un archivo con las secciones `titulo`, `subtitulo`, `categoria`, `fecha`, `original` (enlace a Substack/Medium) y `cuerpo`.
Se abre con `no-ficcion/articulo.html?id=<nombre>`. En el **cuerpo**:

| Escribes | Se ve |
|---|---|
| una línea en blanco | separa párrafos |
| `### Título` | título de sección |
| `> texto` | cita destacada |
| `- texto` | lista |
| `---` | separador |
| `\|\|texto\|\|` | **texto tachado de expediente**: se revela al pasar el cursor o al tocarlo (también funciona en la portada) |

Sin imágenes: todo es texto. Al pegar desde Substack, cambia las cursivas `_así_` por `*así*`.

**Para traer un artículo nuevo:** crea `textos/no-ficcion/<nombre>.md` copiando la estructura del de Taleb, pega el texto en `## cuerpo` y en `textos/no-ficcion.md` cambia su destino de `https://…` a `<nombre>`.

---

## 3. Estructura del proyecto

```
index.html              Portada actual («La Página de Daniel DB»)
textos/portada.md       TODOS los textos de la portada (lo edita Daniel)
css/paleta.css          Paleta global (variables --p-*), compartida por toda la web
css/senor-x.css         Estilos de la portada (y sus colores propios --x-*)
js/textos.js            Lee el .md y coloca cada sección (objeto global `Textos`)
js/senor-x.js           Comportamiento de la portada (marquesina, contador, reproductor, ventanas, chispas)

no-ficcion/index.html   Página «No ficción»: briefing de misión y archivo de expedientes
no-ficcion/articulo.html  Lectura de un artículo (?id=<nombre>)
textos/no-ficcion.md    Textos de la página No ficción y lista de expedientes
textos/no-ficcion/      Un .md por artículo
css/no-ficcion.css      Estilos de No ficción (paleta global, concepto Misión)
js/no-ficcion.js        Briefing, archivo y expediente clasificado
js/articulo.js          Convierte el .md de un artículo en la página

guia-visual.html        Guía visual (paleta, tipografía, reglas)
css/tokens.css, css/base.css, css/portada.css, js/cielo.js
                        Estilos y cielo animado de la guía visual y del concepto 00 «Niebla»

conceptos/              Laboratorio: pruebas de concepto visuales (no es la web pública)
  index.html            Galería de conceptos
  paletas.html          Taller de paletas (tríada + sombras complementarias)
  00…14-*.html          Conceptos conservados (pueden usarse por temporadas o por secciones)
  descartados/          Conceptos descartados (se guardan, no se enlazan)
  comun.css, comun.js   Utilidades compartidas por los conceptos

referencias/            Imágenes de referencia (no se publican en la web)
.claude/launch.json     Servidor local para Claude Code
```

---

## 4. Diseño

### Paleta global — `css/paleta.css`
Elegida en el taller de paletas: **una luz, su tríada y su sombra complementaria**.

| Variable | Color | Papel |
|---|---|---|
| `--p-luz` | `#DA4EC7` magenta | acento principal |
| `--p-triada1` | `#BAC954` lima | tríada (+120°) |
| `--p-triada2` | `#73C6D3` cian | tríada (+240°) |
| `--p-sombra` | `#195721` verde | sombra complementaria (180°) |
| `--p-fondo`, `--p-superficie`, `--p-linea` | verdes oscuros | fondos y bordes |
| `--p-texto`, `--p-titulos` | lila grisáceo, blanco rosado | texto |

Hay variantes **saturadas** (`--p-*-sat`) para la portada amateur, y versiones en canales RGB (`--p-*-rgb`) para transparencias: `rgba(var(--p-luz-rgb), 0.3)`.

### Colores propios de la portada — al inicio de `css/senor-x.css`
Solo afectan a la portada (no a la paleta global):

| Variable | Uso |
|---|---|
| `--x-cielo` `#0B2A6B` | fondo de mosaico azul oscuro |
| `--x-celeste` `#5CC8FF` | «¡¡¡BIENVENIDOS!!!» |
| `--x-tabla`, `--x-columna` | paneles verdes |

### Tipografía de la portada
Comic Neue (títulos y menús), Tinos (Times; texto), VT323 (contador, marquesina). Todas de Google Fonts.

### Lo que NO se hace (decisiones de Daniel)
- Nada que parezca un portafolio corporativo, un CV o una plantilla de Silicon Valley.
- Nada de copiar una referencia: los conceptos son homenajes de estilo, no recreaciones (sin logotipos, personajes ni letras de canciones).
- Nada de violetas ni galaxias de colores (se ve como «astrología»).
- Nada de tipografía manuscrita.
- En la portada, **sin revelado lento palabra a palabra** (ese efecto queda para otros espacios).

---

## 5. Notas técnicas importantes

- **Caché del navegador.** Los enlaces a CSS/JS de cada página HTML (`index.html`, `no-ficcion/*.html`) llevan `?v=AAAAMMDDx`. **Cada vez que cambies un `.css` o un `.js`, sube ese número en los cuatro enlaces** o los visitantes seguirán viendo la versión vieja. Los textos del `.md` siempre se leen frescos (`cache: 'no-cache'`).
- **Textos por defecto.** Cada elemento con `data-texto="nombre"` en `index.html` tiene un texto de respaldo por si el `.md` no se puede leer. Al añadir una sección nueva, añade en el HTML el elemento con su `data-texto` y su `data-formato`.
- **Secciones que no usan `data-texto`:** `marquesina`, `marquesina-visitante` y `reproductor` las lee directamente `js/senor-x.js` (necesitan lógica: horas, orden, Fibonacci). No las borres del `.md` pensando que sobran.
- **Formatos disponibles** (`data-formato`, en `js/textos.js`): `plano`, `lineas`, `parrafos`, `parrafos-fijos`, `aleatorio`, `firmas`, `menu`, `noticias`, `insignias`. Sin formato = una línea con negrita/cursiva/enlaces.
- **Seguridad.** El Markdown se escapa antes de convertirlo: no se puede inyectar HTML. Los enlaces solo aceptan `http(s)://`, `mailto:`, `#…` y rutas relativas.
- **Accesibilidad.** Las ventanas son diálogos (`role="dialog"`/`alertdialog`), se cierran con Escape y devuelven el foco. Las animaciones se apagan con «reducir movimiento» del sistema. La marquesina tiene `aria-label` con su texto.
- **El contador de visitas** cuenta por navegador (`localStorage`), no visitas reales. Es intencional.
- **El panel del navegador de Claude Code**, si está oculto, congela animaciones y mide 0 px de ancho: para probar, emular un tamaño (p. ej. 1024×768).

---

## 6. Lo que sigue

**Próxima sesión (en este orden):**
1. [ ] **Revisar la página del archivo de expedientes** (`no-ficcion/index.html`) hasta dejarla terminada, e incluir un easter egg que diga que es un homenaje a las películas de *Misión Imposible*.
2. [ ] **Definir el formato universal de los artículos** (`no-ficcion/articulo.html` + `textos/no-ficcion/*.md`): una sola plantilla que sirva para todos los textos, sin diseñar artículo por artículo.

- [x] Página **No ficción** creada (concepto Misión, archivo de expedientes, expediente 000). **De momento el botón de la portada lleva al Substack**; cuando la página esté lista, cambia su enlace en `textos/portada.md` a `no-ficcion/index.html`.
- [ ] Pegar el texto del primer artículo (Taleb) en `textos/no-ficcion/comentando-libros-1-nassim-taleb.md` y traer los demás de Substack/Medium.
- [ ] Decidir el menú completo (relatos, corto de terror, cine y discos, videojuego, pixel art, matemáticas).
- [ ] Pie de página: correo o enlace de contacto.
- [ ] Revisar la portada en el móvil.
- [ ] Icono de pestaña (favicon) e imagen para compartir en redes.
- [x] Repositorio en GitHub y publicación en GitHub Pages.
- [ ] Más adelante: relatos del Detective Homero (hoy en Inkspired) publicados aquí, con comunidad.

Otros recursos de Daniel: [Substack «La mente del artista»](https://danieldbarte.substack.com/) · [Libros en Payhip](https://payhip.com/danieldb).
