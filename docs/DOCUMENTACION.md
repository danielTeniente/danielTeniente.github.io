# La Página de Daniel DB · Documentación

<!-- Guía completa del proyecto. El README.md de la raíz es sólo la portada para quien visita el repositorio. -->

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

1. Abre [`textos/portada.md`](../textos/portada.md) en VS Code.
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

### Página «No ficción» — [`textos/no-ficcion.md`](../textos/no-ficcion.md)
Se entra desde el botón «No ficción (demasiado pretensioso)» de la portada. Usa el concepto **Misión**:
un briefing que se autodestruye (al pulsar «Aceptar la misión» o cuando la mecha se consume, a los 14 s) y, detrás, el **archivo de expedientes**. Al aceptar sale, debajo de «Este mensaje se autodestruirá», que la sección está inspirada en las películas de *Misión Imposible*. El briefing sale **siempre** que se entra desde la portada; solo se salta al volver de un artículo con «Volver al archivo» o con el botón «atrás».

El **último expediente publicado** (el de fecha más reciente) está **en custodia**: un **minijuego** elegido al azar cada vez que se abre la página tapa su tarjeta, y al ganarlo aparece «Leer el expediente» ([`js/minijuegos.js`](../js/minijuegos.js)): todos siguen el modelo de los láseres: la tarjeta se sigue viendo, el efecto la cruza por encima y debajo va la instrucción (izquierda) con el botón (derecha); el efecto nunca tapa la instrucción. Hoy hay seis: láseres, código para memorizar, caja fuerte (un número), contraseña desordenada, descenso desde el techo e inmersión (la tarjeta se hunde en el agua y al llegar al fondo se abre la cerradura). Al fallar sale un mensaje corto unos segundos y el juego vuelve a empezar solo; al tercer fallo «llegan los refuerzos» (ese mensaje se queda) y se abre igual. **Provisional:** en localhost (o con `?probar` en la dirección) sale una barra para probar cada minijuego; en la web publicada no aparece. Los demás son **evidencia recolectada** y se abren directo. (El enlace directo a un artículo funciona sin juego, para poder compartirlo.)

| Sección | Qué controla |
|---|---|
| `hud-izquierda`, `hud-derecha`, `para`, `titulo`, `mision`, `aceptar`, `cuenta` | El briefing. En `cuenta`, `{n}` son los segundos. |
| `homenaje` | Mensaje discreto al aceptar la misión |
| `estado-custodia`, `custodia-leer`, `estado-evidencia` | Etiquetas del último expediente (en custodia) y de los anteriores |
| `juego-laseres`, `juego-codigo`, `juego-caja`, `juego-anagrama`, `juego-descenso`, `juego-bucear` | Instrucción de cada minijuego (`juego-anagrama` es el de la contraseña) |
| `juego-bucear-fondo` | Mensaje de la inmersión al llegar al fondo |
| `juego-palabras` | Diccionario del juego de la contraseña: una palabra por línea (`- palabra`); para añadir otra, una línea nueva. Cada error destapa una letra (`--s----`); al tercero llegan los refuerzos |
| `juego-exito`, `juego-fallo`, `juego-refuerzos` | Mensajes al ganar, al perder (dura unos segundos) y al tercer fallo (se queda) |
| `archivo-titulo`, `archivo-intro`, `repetir`, `pie` | El archivo de expedientes |
| `expedientes` | Lista de artículos: solo el **nombre del archivo** de cada uno (`- mi-articulo`, sin `.md`). Título, categoría, fecha y subtítulo se leen del propio `.md`. Se ordenan solos por fecha (el más reciente, en custodia) y se numeran por antigüedad. La primera página muestra 3 (el minijuego ocupa sitio) y las demás 4: si hay más, aparecen flechas (y en el móvil se puede deslizar el dedo). Los que siguen en Substack están en un comentario debajo, por traer. |
| `autodestruir-boton`, `autodestruir-mensaje` | El botón del final de cada artículo (que no destruye nada) |

### Página «Videojuegos» — [`textos/videojuegos.md`](../textos/videojuegos.md)
Se entra desde el botón «Videojuegos (consulta al Gran Mago, gratis)» de la portada. Usa el concepto **Cartucho** ([`conceptos/07-cartucho.html`](../conceptos/07-cartucho.html)): pantalla de título de una consola de 16 bits sobre un paisaje en píxeles con paralaje, y ventanas de RPG. Arriba van las **reseñas** («Selecciona partida») y abajo la **galería de pixel art**. **Hasta pulsar START y terminar el mensaje de bienvenida solo se ve la pantalla de título**; al volver de una reseña («Volver a la selección» o el botón atrás) se salta la bienvenida.

**Tres horas del día**, según el reloj del visitante ([`js/paisaje.js`](../js/paisaje.js)), con colores saturados: **mañana** (6 a 12, «montes rosados»: cielo cian claro, sol lima a la izquierda, opuesto a la luna, nubes, montes rosa y magenta, ventanas magenta oscuro), **tarde** (12 a 19, «hora dorada lima»: de magenta arriba a lima en el horizonte, sol blanco tras montes magenta oscuro, ventanas magenta) y **noche** (19 a 6, «noche cian»: cian muy oscuro que brilla en el horizonte, luna rosa, estrellas lima, ventanas cian). Todos los colores salen de la paleta global. Los colores del cielo y los montes están al inicio de `js/paisaje.js`; los de las ventanas y el título, en las variables `--v-*` al inicio de `css/videojuegos.css` (una tanda por hora). Para ver una hora concreta: `?hora=manana`, `?hora=tarde` o `?hora=noche` en la dirección. **Provisional:** en localhost (o con `?probar`) sale abajo a la derecha una barra para cambiar de hora; en la web publicada no aparece.

| Sección | Qué controla |
|---|---|
| `hud-derecha`, `editor`, `titulo`, `lema`, `start` | Pantalla de título (`titulo`: cada línea es una línea) |
| `quien`, `intro` | Caja de diálogo que se abre al pulsar START: cada párrafo es una página (se pasa con clic, Enter o espacio); al terminar baja a las reseñas |
| `resenas-cabecera` | Título y frase de la lista de reseñas: `- Título \| frase`, sale una pareja al azar en cada visita |
| `resenas-vacio` | Sale si no hay reseñas |
| `resenas` | Lista de reseñas: solo el **nombre del archivo** (`- mi-resena`). Se ordenan por fecha (la más reciente arriba) y se numeran por antigüedad («Partida 01») |
| `galeria-titulo`, `galeria-intro`, `galeria-vacia` | Galería (`galeria-vacia` sale mientras no haya dibujos) |
| `galeria` | Un dibujo por línea: `- archivo.png \| Título \| nota opcional`. Las imágenes van en [`imagenes/pixel-art/`](../imagenes/pixel-art/) (pueden ir en subcarpetas). **Animaciones** de fotogramas sueltos: `- carpeta/dibujo_{0-3}.png \| Título \| nota \| 250` (`{0-3}` = fotogramas 0 a 3; el último número, opcional, son los milisegundos de cada fotograma). **Subsecciones:** una línea `### Título` abre una serie aparte, con dibujos más grandes; la línea siguiente sin `- ` es su descripción (así están las tres animaciones de Quito, hechas para un evento de cine) |
| `obra-letrero`, `obra-quien`, `obra-dialogo` | **El camino cortado**, al final de la página: como en los RPG clásicos, una obra con valla y conos no deja pasar a la «Torre del mago». Al intentar pasar, el obrero dice las frases de `obra-dialogo` en orden (la última se repite) |
| `guardar-boton`, `guardar-mensaje` | El botón del final de cada reseña (que no guarda nada) |
| `pie` | Frase al azar al final |

**Secretos (spoilers)** — [`js/secretos.js`](../js/secretos.js); textos al final de `textos/videojuegos.md`. Cuatro homenajes a juegos favoritos de Daniel (mecánicas, nunca personajes ni música):

| Secreto | Homenaje | Cómo se encuentra | Qué pasa |
|---|---|---|---|
| Hierba alta | *Pokémon Rojo* | pasar el cursor (o el dedo) por la hierba que hay entre las reseñas y la galería | encuentro al azar, poco frecuente: la página se vuelve en blanco y negro y hay un combate contra un POLÍGONO salvaje escapado de la torre, que se vence con PÍXEL A PÍXEL (no se puede huir, ni con Escape) |
| Base de datos | *Her Story* | un clic (o un toque) en «1 jugador · 16 bits» | el viajero revisa el interrogatorio al Gran Mago (noviembre de 1998): un chico amante de los juegos en 3D vino a pedirle consejo, despreció el pixel art y desapareció. El mago lo niega todo. Se busca por palabras en sus declaraciones (`## base-datos`, `- fecha \| texto`; empieza con «dimensiones») y, como en el juego, sólo se ven las cinco primeras. El final (fue una trampa: lo hizo entrar en la torre, que conecta con otros mundos que ni el mago conoce) está escondido: chico → libreta → otros. El buscador admite una sola palabra de 20 letras como máximo (quita espacios y signos mientras se escribe). Las palabras muy comunes no cuentan al buscar (`## base-palabra-comun`). Si alguien busca «píxel», el Gran Mago aparece en persona, dibujado en píxeles con CSS, y lo felicita (`## base-pixel-quien`, `## base-pixel-mago`). Daniel irá añadiendo declaraciones relacionadas con lo que construya |
| Barril | *beat 'em up* | golpear tres veces el barril de la galería | «COMBO ×3», la pantalla tiembla y sale un premio al azar de `## barril-premios` (`- clave \| mensaje`): pollo, monedas, tubería, vida extra, pergamino, píxel de la torre o nada; la estatuilla dorada, súper coleccionable, sale 1 de cada 25 barriles. Al llegar a la galería parpadea «GO! →» |
| Sacrificio | *LISA: The Painful* | pulsar «Guardar partida» tres veces en una reseña ([`js/resena.js`](../js/resena.js)) | hay que elegir qué sacrificar; las dos opciones acaban igual |

Pendiente: la bomba de *Super Bomberman 4* con un pixel art secreto, apuntada en `ideas-sin-implementar.md` (no se sube a GitHub).

**Reseñas — `textos/videojuegos/<nombre>.md`.** Secciones `titulo`, `subtitulo`, `ficha` (juego · consola · año), `fecha`, `original` (no se muestra) y `cuerpo`, con el mismo formato que los artículos de No ficción y dos añadidos, cada uno solo en su párrafo: `![texto alternativo](imagenes/games/foto.png)` pone una **imagen** (enmarcada como una pantalla) y `[Título](https://www.youtube.com/watch?v=…)` pone un **vídeo**: un televisor pequeño de los de antes, con antena y el título al lado; al pulsar ▶ el vídeo se reproduce dentro de su pantalla, sin agrandarse. YouTube (sin cookies, `youtube-nocookie.com`) sólo se carga al pulsarlo. Se abren con `videojuegos/resena.html?id=<nombre>`. Para publicar una: copia [`_plantilla.md`](../textos/videojuegos/_plantilla.md) y añade su nombre a `## resenas`. Reseñas: «Her Story» (con una captura y el tráiler), «LISA: The Painful» (con una captura al inicio) y «Immortality» (con una captura al inicio y el tráiler). La de prueba en *lorem ipsum* está oculta con `_` (`_ejemplo-lorem-ipsum.md`, no se sube a GitHub).

**Pixel art.** Copia la imagen o la carpeta de fotogramas (png o gif) en `imagenes/pixel-art/` y añade su línea a `## galeria`. Da igual si se exportó ya agrandada (p. ej. 32×32 guardado a 512×512): la página calcula el tamaño de cada píxel y la agranda siempre un número entero de veces, sin difuminar; las animaciones cargan todos sus fotogramas antes de empezar y se quedan quietas con «reducir movimiento»; al pulsarla se abre en grande (se cierra con Escape o con un clic fuera).

### Artículos — `textos/no-ficcion/<nombre>.md`
Cada artículo es un archivo con las secciones `titulo`, `subtitulo`, `categoria`, `fecha`, `original` (enlace a Substack/Medium, solo de referencia: no se muestra) y `cuerpo`.
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

**Para publicar un artículo nuevo:** copia [`textos/no-ficcion/_plantilla.md`](../textos/no-ficcion/_plantilla.md) en la misma carpeta con un nombre en minúsculas y guiones (`mi-articulo.md`), pega el texto en `## cuerpo`, rellena título, subtítulo, categoría y fecha, y añade `- mi-articulo` a la sección `## expedientes` de `textos/no-ficcion.md`. (Esa línea hace falta porque GitHub Pages no deja que la página vea qué archivos hay en una carpeta.) Los artículos de prueba en *lorem ipsum* siguen en la carpeta con `_` delante (así no se publican); para usarlos, quítales el `_` y añade su nombre a la lista.

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
js/no-ficcion.js        Briefing, archivo y expediente en custodia
js/minijuegos.js        Los cinco minijuegos del expediente en custodia
js/articulo.js          Convierte el .md de un artículo en la página

videojuegos/index.html  Página «Videojuegos»: pantalla de título, reseñas y galería de pixel art
videojuegos/resena.html Lectura de una reseña (?id=<nombre>)
textos/videojuegos.md   Textos de la página Videojuegos, lista de reseñas y de dibujos
textos/videojuegos/     Un .md por reseña
imagenes/pixel-art/     Los dibujos de la galería
imagenes/games/         Imágenes de las reseñas
css/videojuegos.css     Estilos de Videojuegos (paleta global, concepto Cartucho)
js/paisaje.js           Paisaje en píxeles con paralaje y tres horas del día (fondo de Videojuegos)
js/videojuegos.js       Diálogo, selección de partida y galería
js/resena.js            Convierte el .md de una reseña en la página (y el secreto de LISA)
js/secretos.js          Los secretos de Videojuegos (hierba alta, base de datos, barril)

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
ideas-sin-implementar.md  Libreta de ideas de Daniel (no se sube a GitHub)
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

- **Caché del navegador.** Los enlaces a CSS/JS de cada página HTML (`index.html`, `no-ficcion/*.html`, `videojuegos/*.html`) llevan `?v=AAAAMMDDx`. **Cada vez que cambies un `.css` o un `.js`, sube ese número en los cuatro enlaces** o los visitantes seguirán viendo la versión vieja. Los textos del `.md` siempre se leen frescos (`cache: 'no-cache'`).
- **Textos por defecto.** Cada elemento con `data-texto="nombre"` en `index.html` tiene un texto de respaldo por si el `.md` no se puede leer. Al añadir una sección nueva, añade en el HTML el elemento con su `data-texto` y su `data-formato`.
- **Secciones que no usan `data-texto`:** `marquesina`, `marquesina-visitante` y `reproductor` las lee directamente `js/senor-x.js` (necesitan lógica: horas, orden, Fibonacci). No las borres del `.md` pensando que sobran.
- **Formatos disponibles** (`data-formato`, en `js/textos.js`): `plano`, `lineas`, `parrafos`, `parrafos-fijos`, `aleatorio`, `firmas`, `menu`, `noticias`, `insignias`. Sin formato = una línea con negrita/cursiva/enlaces.
- **Seguridad.** El Markdown se escapa antes de convertirlo: no se puede inyectar HTML. Los enlaces solo aceptan `http(s)://`, `mailto:`, `#…` y rutas relativas.
- **Accesibilidad.** Las ventanas son diálogos (`role="dialog"`/`alertdialog`), se cierran con Escape y devuelven el foco. Las animaciones se apagan con «reducir movimiento» del sistema. La marquesina tiene `aria-label` con su texto.
- **El contador de visitas** cuenta por navegador (`localStorage`), no visitas reales. Es intencional.
- **El panel del navegador de Claude Code**, si está oculto, congela animaciones y mide 0 px de ancho: para probar, emular un tamaño (p. ej. 1024×768).

---

## 6. Estado actual y lo que sigue

**Estado al 12/11/2026** (todo publicado en https://danielteniente.github.io/):
- [x] **Portada** («La Página de Daniel DB», estilo 1998), con su menú: *No ficción* y *Videojuegos* llevan a sus páginas y *Mis libros*, a Payhip.
- [x] **No ficción** (concepto Misión):
  - Briefing que se autodestruye (siempre al llegar desde la portada) con el homenaje a *Misión Imposible*; canal, cifrado y pie al azar en cada visita.
  - Archivo de expedientes ordenado por fecha y paginado (3 en la primera página, 4 en las demás).
  - El último expediente queda **en custodia** con un minijuego al azar (láseres, código, caja fuerte, contraseña, descenso, inmersión); al tercer fallo llegan los refuerzos. Los anteriores salen como «Recuperado».
- [x] **Formato universal del artículo**: un `.md` por artículo copiado de [`_plantilla.md`](../textos/no-ficcion/_plantilla.md), una sola página (`no-ficcion/articulo.html`) con letra grande y buen contraste.
- [x] **Artículos publicados:** «Nunca preguntes por qué» (2024) y «Sobre virus de ARN» (2025, hoy en custodia).
- [x] Herramientas de prueba: barra de minijuegos (solo en localhost o con `?probar`) y artículos *lorem ipsum* ocultos con `_` en `textos/no-ficcion/` (no se suben a GitHub).
- [x] Repositorio en GitHub y publicación en GitHub Pages.

**Siguiente paso: por decidir.** Ideas que quedaron abiertas, sin orden:
- [ ] **Interrogatorio al Gran Mago** (`## base-datos` de `textos/videojuegos.md`): ir añadiendo declaraciones relacionadas con lo que se construya en la web. Después de cada cambio, revisar que el final siga escondido (ver el comentario de esa sección).
- [ ] Traer más artículos: los 11 de Substack guardados en un comentario de `textos/no-ficcion.md` y el de Taleb (su archivo aún tiene un texto de ejemplo y está comentado en la lista).
- [ ] Afinar la página del artículo si al leer los reales hace falta (por ejemplo, otra tipografía más fina o un blanco menos brillante).
- [x] **Videojuegos** (concepto Cartucho, publicada el 12/11/2026): dos reseñas («Her Story», con captura y tráiler, y «LISA: The Painful») y galería de pixel art: el primer dibujo de Daniel y, en su propia subsección, las tres animaciones de Quito (de día, paseo por la plaza y de noche).
- [ ] Decidir el menú completo (relatos, corto de terror, cine y discos, matemáticas).
- [ ] Pie de página: correo o enlace de contacto.
- [ ] Revisar la portada en el móvil.
- [ ] Icono de pestaña (favicon) e imagen para compartir en redes.
- [ ] Más adelante: relatos del Detective Homero (hoy en Inkspired) publicados aquí, con comunidad.

Otros recursos de Daniel: [Substack «La mente del artista»](https://danieldbarte.substack.com/) · [Libros en Payhip](https://payhip.com/danieldb).
