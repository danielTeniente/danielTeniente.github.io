<!--
  TEXTOS DE LA PÁGINA «VIDEOJUEGOS» (videojuegos/index.html)
  Mismas reglas que textos/portada.md:
  - Cambia solo el texto debajo de cada "## nombre". No cambies los nombres.
  - **negrita**, *cursiva*, [enlaces](https://…).
  - Guarda y recarga.
  Concepto: «Cartucho» (pantalla de título de una consola de 16 bits).
  Los textos de abajo son propuestas: cámbialos o bórralos a tu gusto.
-->

## hud-derecha
1 jugador · 16 bits

## editor
© 2026 DANIEL DB MIN POWER

## titulo
<!-- Cada línea es una línea del título -->
Video
juegos

## lema
Reseñas y Pixel art

## start
Pulsa start

## quien
Daniel DB

## intro
<!-- Caja de diálogo de RPG. Cada párrafo (separado por una línea en blanco) es una página: se pasa con un clic, Enter o espacio. -->
¡Hola, viajero! Has entrado al bosque del misterio. Aquí habita el Gran Mago del reino. Reparte su valiosa (valiosísima) sabiduría sobre los pocos videojuegos que ha jugado. 

También encontrarás algo de pixel art que el mago ha realizado en su limitado tiempo libre. No es mucho, pero es trabajo honesto.

## resenas-cabecera
<!-- Título y frase de la lista de reseñas. Sale una pareja al azar cada vez que se entra.
     Una por línea:   - Título | frase
     (Los títulos van con la letra pixelada: mejor que no empiecen con vocal mayúscula con tilde.) -->
- Los pergaminos del Gran Mago | Cada pergamino guarda una aventura diferente. No son muchos: el reino es grande, pero el tiempo libre del mago no.
- La biblioteca mágica | Aquí reposa la sabiduría del Gran Mago, ordenada por fecha. Lee con cuidado, viajero: algunas reseñas son tan valiosas que ni el mago las entiende.
- El oráculo del bosque | Pregunta por un juego y el Gran Mago responderá. Sólo si lo ha jugado. Casi nunca lo ha jugado.

## resenas
<!--
  LISTA DE RESEÑAS
  Cada reseña es un archivo .md en la carpeta textos/videojuegos/.
  Para publicar una nueva:
    1. Copia textos/videojuegos/_plantilla.md, ponle un nombre (minúsculas y guiones, p. ej. mi-resena.md)
       y pega tu texto.
    2. Añade aquí una línea con ese nombre, sin ".md":  - mi-resena
  El título, la ficha, la fecha y el subtítulo se leen del propio .md.
  El orden no importa: se ordenan solos por fecha (la más reciente arriba).
  (Esta lista hace falta porque GitHub Pages no deja que la página vea qué archivos hay en una carpeta.)
-->
- her-story
- lisa-the-painful
<!-- La de prueba en lorem ipsum está oculta con «_» (textos/videojuegos/_ejemplo-lorem-ipsum.md): no se publica. -->

## resenas-vacio
<!-- Sale si la lista de arriba está vacía -->
No hay partidas guardadas. Pulsa start para empezar una nueva.

## galeria-titulo
El taller del mago

## galeria-intro
Aquí el mago fabrica sus hechizos a mano. Pulsa uno para verlo en grande.

## galeria
<!--
  GALERÍA DE PIXEL ART
  Las imágenes van en la carpeta imagenes/pixel-art/ (pueden ir en subcarpetas).
  Una línea por dibujo:   - archivo.png | Título | nota opcional
  ANIMACIONES (fotogramas sueltos): pon el número de fotograma como {primero-último}:
    - carpeta/dibujo_{0-3}.png | Título | nota | 250
  El último número (opcional) es cuánto dura cada fotograma en milisegundos (250 = 4 por segundo).
  Da igual si exportaste el dibujo agrandado: la página calcula el tamaño de cada píxel y lo agranda sin difuminar.
  Se muestran en el orden de esta lista.
  SUBSECCIONES: una línea «### Título» abre una serie aparte (con dibujos más grandes); la línea siguiente,
  sin «- », es su descripción. Los dibujos de antes del primer «###» van sueltos, arriba.
-->
- primer_part.png | Mi primer pixel art | El primero que hice en mi vida

### Quito
<!-- Subsección: «### Título» y, debajo, una línea de descripción (opcional). Los dibujos que siguen van en esta serie, más grandes. -->
Tres animaciones que hice para participar en un evento de cine.
- quito/animacion1/quito-inicio_Animation 1_{0-3}.png | Quito de día | Animación de 4 fotogramas | 250
- quito/animacion2/plaza-andante_Animation 1_{0-3}.png | Paseo por la plaza | Animación de 4 fotogramas | 250
- quito/animacion3/quito-fin_Animation 1_{0-1}.png | Quito de noche | Animación de 2 fotogramas | 250

## galeria-vacia
<!-- Sale mientras la galería no tenga dibujos -->
No se detecta ningún cartucho en esta ranura. Sopla y vuelve a intentarlo.

## guardar-boton
<!-- Botón del final de cada reseña -->
Guardar partida

## guardar-mensaje
Partida guardada. (No es verdad: esta página no guarda nada. Pero se agradece la intención.)

## obra-letrero
<!-- EL CAMINO CORTADO: al final de la página, una obra que no deja pasar (como en los RPG clásicos). -->
Torre del mago · En construcción

## obra-quien
Obrero

## obra-dialogo
<!-- Lo que dice el obrero cada vez que intentas pasar, en orden. La última se repite. -->
- Alto ahí, viajero. La torre del mago está en construcción.
- ¿Que cuándo estará lista? Es difícil saberlo, el mago decidió construirla pixel a pixel.
- Llevamos 37 píxeles. El mago dice que es un buen ritmo: va más rápido que con sus juegos pendientes.
- Ayer borró una fila entera porque un píxel no le convencía. Seguimos en los cimientos.
- Debes quedarte aquí. Más allá de la valla no hay mapa. Los últimos que pasaron siguen cayendo.
- Ya te dije que no puedes pasar. Las obras son peligrosas y el mago, impuntual.

## pie
<!-- Sale una frase al azar en cada visita. Una por línea. Al viajero se le trata de tú. -->
- Si lees esto, ya pasaste la pantalla de título. Es más de lo que el mago lograba de niño.
- Este bosque funciona a 60 imágenes por segundo. El Gran Mago, a otro ritmo.
- El Gran Mago no cobra por su sabiduría. Tampoco la garantiza.
- El tiempo libre del mago se agotó escribiendo este pie de página.
- Si el mago tuviera más tiempo libre, la torre ya estaría terminada. Y el obrero, de vacaciones.
- Guarda tu partida antes de irte, viajero. No sirve de nada, pero es costumbre en este bosque.
- Dicen que en este bosque la hierba alta no es sólo decorado. El mago no confirma ni desmiente.
- No apagues la consola mientras el mago guarda sus datos. Se ofende.

<!--
  ==========================================================
  SECRETOS (spoilers). Hay cuatro escondidos en la página:
  1. La hierba alta (Pokémon Rojo): pasar el cursor por la hierba que hay entre las reseñas y la galería.
  2. La base de datos (Her Story), el interrogatorio al Gran Mago: un clic (o un toque) en «1 jugador · 16 bits».
  3. El barril (beat 'em up): golpear tres veces el barril de la galería.
  4. El sacrificio (LISA: The Painful): pulsar «Guardar partida» tres veces al final de una reseña.
  ==========================================================
-->

## hierba-aparece
<!-- 1. HIERBA ALTA: el combate se ve en blanco y negro, como la consola portátil original -->
¡Un POLÍGONO salvaje apareció! Se escapó de la torre.

## hierba-luchar
Usaste PÍXEL A PÍXEL. ¡Es súper eficaz! El POLÍGONO usó GIRAR CÁMARA. Te mareaste un poco.

## hierba-final
¡El POLÍGONO se deshizo en triangulitos! El Gran Mago estaría orgulloso.

## hierba-mochila
En la mochila hay un mando con una palanquita en el centro. No sabes usarlo. Lo guardas.

## hierba-huir
¡No puedes huir! El POLÍGONO te sigue con la cámara.

## base-titulo
<!-- 2. BASE DE DATOS: el viajero revisa el interrogatorio al Gran Mago, como en Her Story. -->
Archivo del reino · Interrogatorio al Gran Mago

## base-inicial
<!-- La palabra que aparece escrita en el buscador al abrirlo -->
dimensiones

## base-sin-resultados
El mago no dijo esa palabra. Prueba con otra, viajero.

## base-palabra-comun
<!-- Sale si se busca una palabra demasiado común (y, de, la, que, este…): el archivo las ignora para que la confesión no salga por casualidad. -->
Esa palabra la dice todo el mundo, viajero. Busca una que sólo diría el mago.

## base-pixel-quien
<!-- Si el viajero busca «píxel», el Gran Mago aparece en persona (en píxeles) y le dice esto. -->
Gran Mago

## base-pixel-mago
Bien hecho, viajero. Me entendiste. Mereces mi sabiduría.

## base-datos
<!--
  DECLARACIONES DEL GRAN MAGO (spoilers). Un chico, amante de los videojuegos modernos en 3D, vino a pedirle
  consejo al mago, despreció el pixel art («dibujitos») y el mago le tendió una trampa para que entrara en la torre.
  Nunca salió. El mago lo niega todo hasta el final. Sólo se oyen sus respuestas.
  Más adelante Daniel irá añadiendo declaraciones relacionadas con lo que vaya construyendo en la web.
  Una línea por declaración:   - fecha | texto
  El buscador encuentra las que contienen la palabra (sin importar tildes ni mayúsculas) y, como en el juego,
  sólo muestra las cinco primeras por fecha: hay que afinar la búsqueda para ver el resto.
  Las palabras muy comunes (y, de, la, más, este…) no cuentan al buscar.
  El buscador sólo admite una palabra, de 20 letras como máximo: no uses palabras clave más largas.

  MAPA (búsqueda inicial: «dimensiones»; las palabras «fue» y «sólo» no cuentan):
    Isla de las dimensiones (se ve al abrir): juegos en 3 dimensiones, siete dimensiones, «por lo menos diez»,
      el universo como una cuerda → «universo» lleva a la música del universo.
    Continente (sin puente con la isla: hay que adivinar «chico», «videojuegos»…):
      chico → la desaparición y el mando · videojuegos → «arriba, abajo…» · arriba → «Yo lo envié a la torre…»
      («torre» y «mundos» también llevan directo ahí).
    Isla del obrero: el obrero en la entrada ←obrero→ «Lo admito, fue una trampa. Pero dejé a un obrero vigilando…»
      (sin puente: hay que adivinar «obrero», «trampa» o «admito»).
    Islotes sueltos, sólo adivinando: la sabiduría y «anciano desfasado».
  Ojo: si añades o cambias declaraciones, revisa que las dos partes de la confesión no compartan palabras raras
  con las demás, o se encontrarán demasiado fácil.
-->
- 03/11/1998 | ¿Desapareció? Pobre chico, se veía que le gustaban los videojuegos, quizá demasiado.
- 03/11/1998 | El pixel art es la única forma de hacer un videojuego divertido. El 3D forma parte del aburrido mundo real.
- - 03/11/1998 | Dentro de cincuenta años, el pixel art seguiráa dominando. Ya lo verán.
- 03/11/1998 | Hablaba de juegos en tres dimensiones. Polígonos, cámaras que giran. Me parecía una abominación.
- 03/11/1998 | Vino a verme por mi sabiduría, como todos. Aunque al final no quiso aceptarla, seguía dando lata con su 3D.
- 03/11/1998 | Dijo que el píxel art estaba muerto y que yo era un anciano desfasado. No tenía opción.
- 10/11/1998 | Puse un obrero en la entrada por las obras. Y para que me avise si alguien sale. Digo, si alguien entra. Por las obras.
- 10/11/1998 | Le dije que había juegos de siete dimensiones. Después de eso, entró por cuenta propia.
- 10/11/1998 | El chico llevaba un mando con una palanquita en el centro. Horrendo, como todo lo que le gustaba.
- 10/11/1998 | Los videojuegos sólo necesitan arriba, abajo, izquierda y derecha.
- 17/11/1998 | ¿Que si existen siete dimensiones? Muchachos, existen por lo menos diez.
- 17/11/1998 | El universo vibra como una cuerda de guitarra y hay dimensiones enrolladas tan pequeñas que nadie las ve.
- 17/11/1998 | Es la música del universo. Nadie sabe a dónde te llevará.
- 24/11/1998 | Está bien, lo admito, fue una trampa. Pero dejé a un obrero vigilando, esperando que vuelva.
- 24/11/1998 | Yo lo envié a la torre. No sé cuántos mundos hay ahí arriba. Creo que nunca volveremos a verlo.


## barril-premios
<!--
  3. BARRIL: lo que sale al romperlo. Sale uno al azar, todos con la misma probabilidad,
  salvo «estatuilla», el súper coleccionable, que sale muy de vez en cuando (1 de cada 25 barriles).
  Una línea por premio:   - clave | mensaje
  La clave decide el dibujito (pollo, monedas, tuberia, vida, pergamino, pixel, nada, estatuilla): no la cambies.
  El mensaje sí lo puedes cambiar.
-->
- pollo | +100 de vida. Comer pollo encontrado dentro de un barril no es buena idea fuera de los videojuegos.
- monedas | +500 monedas. No sirven para nada: en este bosque no hay tienda. Todavía.
- tuberia | Tienes una tubería. No hay a quién pegarle, así que la dejas donde estaba.
- vida | ¡1UP! Tienes una vida extra. El mago la había guardado para terminar todos sus juegos pendientes.
- pergamino | Encontraste un pergamino del Gran Mago. Dice: «No olvides comprar pan». Sabiduría valiosísima.
- pixel | Un píxel de la torre. El obrero lo estaba buscando. No le digas que lo encontraste aquí.
- nada | El barril estaba vacío. Rompiste un barril perfectamente bueno en vano.
- estatuilla | ¡Encontraste la estatuilla dorada del Gran Mago! Sólo existe una en todo el reino. El mago la ganó en un concurso en el que era el único participante.

## lisa-pregunta
<!-- 4. SACRIFICIO: sale al pulsar «Guardar partida» por tercera vez -->
Para guardar esta partida, debes sacrificar algo.

## lisa-opcion-1
Mi brazo

## lisa-opcion-2
Mi partida guardada

## lisa-final
<!-- Sale si eliges la primera opción (el brazo) -->
Elegiste el brazo. Escribir reseñas con una mano es más lento. (Tampoco se guardó nada.)

## lisa-final-partida
<!-- Sale si eliges la segunda opción (la partida guardada). En LISA los puntos de guardado son cuervos que se van para siempre. -->
Elegiste tu partida guardada. Un cuervo se la llevó volando y no va a volver. Por lo menos conservas los dos brazos.
