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
| *(en [`textos/expedientes-x.md`](../textos/expedientes-x.md))* | **Expedientes χ** (ji griega minúscula, que la página no pasa a mayúsculas: como los expedientes X, pero sin alienígenas): los textos fundacionales. En `## expedientes-x` va uno por línea (`- nombre`, o `- nombre · piramide` / `- nombre · mundial` (el reto del gran maestro) si lleva minijuego); no entran en la fila por fecha y van fijados abajo del archivo, en todas las páginas, con cinta de escena, el sello `expedientes-x-sello` («Sin explicación oficial»). Se ordenan por fecha (el más reciente arriba) y se numeran por antigüedad (χ-001 el más antiguo). El minijuego **el negocio perfecto** (`piramide`, sin instrucción): el botón pone en marcha la pirámide un año, en versión dramática: cifras inventadas pero salidas de una simulación (la cuota sube de 500 a 30.000 $, promete el 15 % al mes de lo invertido, hasta 5.000 inscritos; las cabezas se quedan un 20 % de cada cuota y lo que sobre; ahorros al azar con semilla fija para saber quién pidió un préstamo y quién perdió su casa). La pirámide crece y se derrumba, y sale el balance en tres fichas (`piramide-titulo`, `piramide-cabezas`, `piramide-perdieron`, `piramide-cada-una`), una barra de quién perdió, los préstamos y las casas perdidas (`piramide-drama`), el remate (`piramide-final`) y «Leer el expediente». No se puede perder. Los textos del final de los dos minijuegos (`piramide-final`, `mundial-final`) van en celeste, con la tipografía de las instrucciones de los minijuegos de arriba. El minijuego **el reto del Gran Maestro** (`mundial`, en «Todo en contra»): `mundial-reto` (la frase en blanco, «Gran Maestro» en verde y el nombre en rosa) dice que para leer hay que derrotar al Gran Maestro `mundial-gm` (un ruso de parodia; `{gm}` es su nombre completo y `{nombre}`, el de pila). El botón `mundial-agente` («Usar habilidad de súper agente secreto») lo despacha con el mate del pastor, que se juega en un tablero casi transparente de fondo, a la derecha (piezas de texto); luego cae confeti de caracteres y sale `mundial-final`, y aparece «Leer el expediente». No se puede perder |
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

### Página «Ficción» — [`textos/ficcion.md`](../textos/ficcion.md)
Se entra desde el botón «Ficción (más real que la no ficción)» de la portada. Usa el concepto **Bolsilibro** ([`conceptos/06-bolsilibro.html`](../conceptos/06-bolsilibro.html)): una colección de novelas baratas de quiosco («Colección Medianoche») en papel claro. **Hoy la página gira entera alrededor del lanzamiento de *Odio este clima*:** cabecera, la carta `intro`, el bloque de noche con nieve y, debajo, sólo un enlace (`tienda`) a Payhip para los demás relatos. Ya no hay catálogo de relatos (se quitó para no distraer). *La sonrisa de Hera* y *Una línea más* tienen su `.md` y su página sólo en local, con texto de prueba en *lorem ipsum*: no se suben a GitHub ni están en `## relatos`.

| Sección | Qué controla |
|---|---|
| `cabecera-izquierda`, `cabecera-derecha` | La franja de arriba, que imita la de los bolsilibros de quiosco (colecciones numeradas con el precio impreso) |
| `titulo`, `gancho` | Título y frase de la cabecera |
| `pegatina` | La pegatina amarilla: una al azar en cada visita. Cada línea es `- lo que dice → lo que hay debajo`. **Secreto:** al pulsarla se despega y deja ver lo de después de la flecha |
| `intro` | Presentación: párrafos separados por una línea en blanco (el primero, en cursiva) |
| `leer-completo`, `leer-adelanto` | El botón del lanzamiento cuando el relato ya se lee en la web (`completo` o `adelanto`) |
| `tienda` | El enlace a Payhip para los demás relatos |
| `relatos` | Lista de relatos: solo el **nombre del archivo** (`- mi-relato`). Se numeran en el orden de la lista (el primero es el Nº 001) y los colores de las tapas se turnan solos |
| `volver`, `fin`, `final-gratis`, `final-gratis-boton` | Página del relato: enlace de vuelta y el final de un relato completo |
| `final-pago-titulo`, `final-pago`, `final-pago-boton` | El **cupón recortable** que sale al final de un adelanto. `{precio}` = el precio de ese relato |
| `final-nota-titulo`, `final-nota`, `final-nota-boton` | El cupón de los relatos que sólo tienen nota del autor |
| `leer-nota`, `nota-titulo`, `nota-firma` | Botón del lanzamiento (si el relato sólo tiene nota del autor), título y firma de la nota |
| `pasalo-titulo`, `pasalo`, `pasalo-boton`, `pasalo-copiado` | **Pásalo**, al final de cada relato: «Compartir» abre el menú de compartir del móvil (o copia el enlace en la computadora) y «WhatsApp» abre un mensaje con el título y el enlace |
| `lanzamiento` | **Gran lanzamiento:** el nombre de un relato de la lista. Sale arriba de todo, en un bloque de noche con nieve, su tapa de texto, su frase de enganche, y el `lanzamiento-parte` (parte meteorológico, una línea por dato); en su página la cabecera es de noche, nieva y la franja de arriba repite `cabecera-izquierda` y `cabecera-derecha`, como en la portada de Ficción. Déjalo vacío cuando pase el estreno, y cambia entonces `cabecera-izquierda`, `intro` y `proximamente-nota`, que hablan del frío y no se apagan solas (están marcadas como TEMPORAL en el `.md`). Hoy: *Odio este clima* |
| `lanzamiento-promesa-titulo`, `lanzamiento-promesa` | **La promesa** del lanzamiento: un recuadro que deja claro que el relato se leerá completo en la web. Sale en el bloque del lanzamiento y, mientras sea `proximamente`, también en su página. Vacío = no sale. En el lanzamiento no hay botón de Payhip: cuando el relato pase a `completo`, sólo sale un botón grande «Leer aquí» |
| `lanzamiento-avance`, `avance-titulo` | El botón «Ver el simulador» del lanzamiento (y la tapa) llevan a la página del relato aunque sea `proximamente`: ahí está la sección «Simulador» (el avance), con el minijuego y la portada, que así no salen en la página principal |
| `pie` | Frase al azar al final |

**Portadas — [`imagenes/portadas/`](../imagenes/portadas/).** Copia la portada (png, jpg o webp) y pon su nombre en `## portada` del `.md` del relato: sale **sólo dentro**, al final de la página del relato, bajo el título `portada-titulo` («Portada original»). En el lanzamiento sigue la tapa de texto. Si falta o no carga, ese espacio no sale. **Que pesen poco** (menos de ~300 KB, unos 900 px de ancho, en jpg): los originales grandes van en `imagenes/portadas/originales/`, que no se sube a GitHub. Hoy: *Odio este clima* (en su simulador, bajo el minijuego); en local también las de *La sonrisa de Hera* y *Una línea más*, que no se suben. Para que salga al compartir, pon su dirección completa (`https://danielteniente.github.io/imagenes/portadas/…`) en el `og:image` de la página `.html` del relato (es la única dirección que no puede ser relativa).

**Relatos — `textos/ficcion/<nombre>.md`.** Secciones `titulo`, `genero`, `sinopsis`, `gancho` (opcional: frase de enganche bajo el título y al compartir), `portada` (opcional: sale al final, como «Portada original»), `payhip` (enlace), `precio`, `lectura` y `cuerpo`. Cada relato tiene **su propia página**, `ficcion/<nombre>.html`: así, al compartir el enlace (WhatsApp, redes), la vista previa muestra su título y sinopsis (esas páginas no ejecutan JavaScript, así que el título y la sinopsis van escritos en el HTML). `ficcion/relato.html?id=<nombre>` abre cualquiera (sirve para probar). `lectura` decide qué se ve en la web:

| `lectura` | Qué pasa |
|---|---|
| `completo` | El relato entero; al final, «Fin» y el botón al PDF (pensado para los gratis o de «paga lo que quieras») |
| `adelanto` | Sólo el comienzo (pega en `cuerpo` sólo esa parte): el texto se desvanece y sale el cupón para seguir en Payhip (pensado para los de pago) |
| `nota` | Una **nota del autor** sobre el relato (lo que pongas en `cuerpo`), en una tarjeta escrita a máquina, y el cupón (pensado para los de pago sin muestra) |
| `no` | No tiene página en la web (sólo está en Payhip) |
| `proximamente` | Aún no se publica: en el lanzamiento sale el sello `proximamente` con `proximamente-nota`, sin precio, sin enlace a su página ni a Payhip; si alguien abre su página, sólo ve el título, la frase de enganche y «Próximamente». Hoy: *Odio este clima* |

**Minijuego «No dejes que se apaguen» — [`textos/no-dejes-que-se-apaguen.md`](../textos/no-dejes-que-se-apaguen.md).** Está en el simulador (la página de *Odio este clima* mientras sea `proximamente`) ([`js/no-dejes-que-se-apaguen.js`](../js/no-dejes-que-se-apaguen.js), que sólo carga `ficcion/odio-este-clima.html`). Como «Inmersión» en No ficción, **nunca se ve a Blab**: todo es lo que ve él, y **todos los textos van en segunda persona** (caminas, te detienes…, nunca «Blab hace…»). Lo importante es sentir la caminata y la nieve. Arranque: la pantalla de inicio dice «Mira el mundo a través de los ojos de Blab.» (`## instrucciones`); al empezar sale «Te levantas temprano para poder visitar a tus amigos.» (`## levantarse`) en grande, en un rótulo en el centro de la vista (para que nadie se lo salte), con el botón «Caminar» y ninguna otra instrucción; el rótulo se va al pulsarlo; al pulsarlo, «Caminas sin descanso...» (`## en-camino`), que vuelve a salir después de cada ráfaga. Todos los textos del camino («Caminas sin descanso...», «Se acerca una ráfaga», «Te detienes», «Has llegado a…») salen en un rótulo dentro de la vista, un poco por encima del centro, para que la pantalla no quede vacía.

**Aspecto retro** con los colores de la portada del relato: la vista se dibuja en un `<canvas>` pequeño (un píxel del dibujo mide 3 px), con tramado de 8 bits y líneas de televisor; textos en VT323 y botones en Press Start 2P, con relieve. El cuadro mide como mucho 580 px de ancho. Delante sólo hay **una pared de nieve blanca celeste** (sin suelo, cielo ni horizonte), con manchas de nieve que soplan despacio. El viaje **empieza de día** y **acaba de noche**: la pared se va oscureciendo, y cada color se cambia por su pareja violeta o azul de la parte alta de la portada (no se oscurece sin más).

- **Caminata.** Se pulsa «Caminar» **una vez** y avanzas solo hasta la máquina, a **grandes zancadas**: la vista sube al sacar la pierna de la nieve, cae con un golpe al pisar y se mece de lado (sin inclinarse). Lo que se mueve es el dibujo por dentro (la pared y su tramado), no la imagen entera, así que nunca se le ven los bordes; además, los copos se te echan encima con cada paso.  Caminas 0,15 km por segundo (unos 20 segundos por tramo). Las máquinas **no tienen luz**: Blab sabe dónde están; a partir de la tercera parte del camino asoma en el centro un **bloque oscuro**, casi confundido con la nieve, que crece y se oscurece al acercarte; su nombre sólo sale al llegar, debajo del bloque (ModelG_33 no tiene bloque: todavía no ha aterrizado). Desde el segundo tramo (nunca en el primero, y nunca nada más echar a andar) puede llegar una **ráfaga** (o ninguna): «Se acerca una ráfaga», todo se vuelve blanco y «Te detienes»; después sigues solo. El orden del viaje y los kilómetros de cada tramo están en `## ruta`.
- **El panel.** Al llegar sólo se ve el panel de la máquina: un cuadrado con su nombre y los huecos de sus piezas (`[ p11    ]`), sin dibujo. Cada máquina tiene 2 o 3 piezas, que sacas de un saco con «Buscar pieza en el saco»: casi siempre sale una que falta y se pone sola en su sitio; 4 de cada 10 veces sale otra cosa (`## saco-fallo`; la probabilidad es `FALLO_SACO` en el `.js`). Una pieza con «(no está)» en `## <máquina>-piezas` no se encuentra: su hueco se queda vacío y sale `## saco-no-esta`.

Para cada máquina, en el `.md`: `## <máquina>-antes` (opcional: frases sobre la nieve antes de abrir el panel, de una en una; cada línea `botón → texto`; es una espera y con cada frase anochece un poco más), `## <máquina>-llegar` (opcional: lo que sale dentro del panel), `## <máquina>-piezas` y `## <máquina>` (frases al terminar: se cierra el panel y salen de una en una, con «Siguiente», sobre la nieve). Una frase que acaba en `(se va)` hace que la máquina se marche (ese «(se va)» no se ve): ModelG_33 se aleja volando hacia arriba; las demás se encogen y se pierden en la nieve. El viaje de hoy, con los textos de Daniel:
- **ModelS_69**: llegas, lo reparas (2 piezas) y, ya sin panel, las últimas fotografías de la zona y el cementerio de robots.
- **ModelG_33**: al llegar no está (no hay bloque). Esperas en su zona de aterrizaje: las frases salen sobre la nieve, y anochece mientras esperas (hambre, preocupación, lo peor…, «...», su aleteo). Aterriza, lo reparas (2 piezas) y después revisas sus mensajes, miras el antiguo mensaje que grabó tu padre, grabas uno nuevo y se aleja volando (su bloque sube y se pierde).
- **ModelH_44**, en las últimas: al llegar se abre directamente su panel, que **parpadea** como si le costara seguir encendido; 3 piezas, una «(no está)» (se ve que no las tienes todas). Después, sin panel: haces los últimos cambios «y dejas que el robot continúe» (su bloque se aleja despacio y desaparece en la nieve), te lamentas por semejante pérdida y «Es hora de volver a casa».

Al final, en un mismo bloque, `## final`: «Fin.» y «Gracias por probar este simulador (sumamente realista) del mundo de Blab.», una debajo de otra. No se puede perder. En la barra de abajo sólo está el botón, en el centro (sin distancia ni hora).

En el `cuerpo`, párrafos separados por una línea en blanco y `---` para un cambio de escena (sale `* * *`). La primera letra sale en grande. **Para publicar un relato:** (1) copia [`textos/ficcion/_plantilla.md`](../textos/ficcion/_plantilla.md) como `mi-relato.md` y rellénalo; (2) copia [`ficcion/_plantilla.html`](../ficcion/_plantilla.html) como `mi-relato.html` y cambia lo marcado con ✎ (título, sinopsis y `data-relato="mi-relato"`); (3) añade `- mi-relato` a `## relatos`. Para probar sin publicar: un `.md` con `_` delante (no se sube) se abre con `ficcion/relato.html?id=_nombre` (hay uno: `_prueba-nota`). *La sonrisa de Hera* (`completo`) y *Una línea más* (`adelanto`) sólo existen en local, con **texto de prueba en lorem ipsum**: para publicarlos hay que pegar el relato, añadirlos a `## relatos` y subir su `.md`, su `.html` y su portada.

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
| `\| A \| B \|` + línea `\|---\|---:\|` + filas | **tabla**: la segunda línea (guiones) marca la cabecera; `:---` alinea a la izquierda, `:---:` al centro, `---:` a la derecha. En el móvil se desliza de lado si no cabe |

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
textos/expedientes-x.md Textos de los Expedientes Χ (los textos fundacionales, fijados abajo, y su minijuego)
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

ficcion/index.html      Página «Ficción»: lanzamiento de Odio este clima (concepto Bolsilibro) y enlace a Payhip
textos/ficcion.md       Textos de la página Ficción y lista de relatos
ficcion/<nombre>.html   Página de cada relato (copia de ficcion/_plantilla.html)
ficcion/relato.html     Lector genérico (?id=<nombre>), para probar
textos/ficcion/         Un .md por relato
css/ficcion.css, js/ficcion.js, js/relato.js  Estilos, lanzamiento y lectura de Ficción
textos/no-dejes-que-se-apaguen.md, js/no-dejes-que-se-apaguen.js  Minijuego del simulador de Odio este clima
js/nieve.js             Nieve de caracteres del gran lanzamiento
imagenes/portadas/      Portadas de los relatos

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
- [x] **Ficción** (concepto Bolsilibro): gran lanzamiento de *Odio este clima* (nieve, parte meteorológico, promesa de lectura completa), lo único de la página; los demás relatos, sólo como enlace a Payhip. Su página es, mientras sea `proximamente`, el **simulador** «No dejes que se apaguen» y la portada. Lectura en la web lista para cuando se publique (completo, adelanto o nota del autor, con cupón), página propia por relato y botón «Pásalo».
- [ ] Decidir el menú completo ( corto de terror, cine y discos, matemáticas).
- [ ] Pie de página: correo o enlace de contacto.
- [ ] Revisar la portada en el móvil.
- [ ] Icono de pestaña (favicon) e imagen para compartir en redes.
- [ ] Más adelante: relatos del Detective Homero (hoy en Inkspired) publicados aquí, con comunidad.

Otros recursos de Daniel: [Substack «La mente del artista»](https://danieldbarte.substack.com/) · [Libros en Payhip](https://payhip.com/danieldb).
