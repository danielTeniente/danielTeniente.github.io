<!--
  TEXTOS DE LA PÁGINA «NO FICCIÓN» (no-ficcion/index.html)
  Mismas reglas que textos/portada.md:
  - Cambia solo el texto debajo de cada "## nombre". No cambies los nombres.
  - **negrita**, *cursiva*, [enlaces](https://…), ||texto tachado|| (se revela al pasar el cursor).
  - Guarda y recarga.
-->

## hud-izquierda
Transmisión segura

## hud-derecha
<!-- {canal} = un número al azar entre 0 y 255; {cifrado} = uno de la lista de abajo, al azar en cada visita. -->
Canal {canal} · Cifrado {cifrado}

## cifrados
<!-- Cifrados que pueden salir en la barra de arriba. Uno por línea. Mejor nombres cortos (en el móvil no hay mucho sitio).
     «Alienígena 2» es el segundo alfabeto alienígena de Futurama: un cifrado de suma modular de verdad. -->
- AES-256
- RSA-4096
- Enigma
- César
- Vigenère
- ROT13
- ChaCha20
- Blowfish
- Libreta de un solo uso
- Alienígena 2

## para
Para: el visitante · De: Daniel DB

## titulo
No ficción

## mision
Su misión, si decide aceptarla, es leer textos que no son ficción. Algunos son demasiado pretenciosos. Otros, peor: son sinceros.

## aceptar
Aceptar la misión

## cuenta
<!-- {n} se cambia por los segundos que faltan -->
Este mensaje se autodestruirá en {n}

## archivo-titulo
Archivo de expedientes

## archivo-intro
Puede leer los expedientes recuperados, agente. O puede aventurarse para obtener uno nuevo.

## repetir
Volver a empezar

## expedientes
<!--
  LISTA DE ARTÍCULOS
  Cada artículo es un archivo .md en la carpeta textos/no-ficcion/.
  Para publicar uno nuevo:
    1. Copia textos/no-ficcion/_plantilla.md, ponle un nombre (minúsculas y guiones, p. ej. mi-articulo.md)
       y pega tu texto.
    2. Añade aquí una línea con ese nombre, sin ".md":  - mi-articulo
  El título, la categoría, la fecha y el subtítulo se leen del propio .md.
  El orden no importa: se ordenan solos por fecha. El más reciente queda «en custodia» (con minijuego)
  y los demás salen como «evidencia recolectada».
  (Esta lista hace falta porque GitHub Pages no deja que la página vea qué archivos hay en una carpeta.)
-->
- no-preguntes-por-que
- sobre-virus-de-arn
<!-- Pendiente de pegar su texto (hoy tiene un texto de ejemplo):
- comentando-libros-1-nassim-taleb
-->

## homenaje
<!-- Sale al aceptar la misión, debajo de «Este mensaje se autodestruirá». -->
Esta sección de la web está inspirada en las películas de Misión Imposible protagonizadas por Tom Cruise.

## estado-custodia
<!-- El último expediente publicado (por fecha) está en custodia: un minijuego lo tapa y hay que ganarlo para leerlo. -->
En custodia

## custodia-leer
<!-- Botón que sale tras el tercer fallo (cuando llegan los refuerzos). -->
Leer el expediente

## estado-evidencia
<!-- Los expedientes anteriores se abren directo. -->
Recuperado

## juego-laseres
<!-- MINIJUEGOS: uno al azar cada vez que se abre la página. -->
Cruce cuando se apaguen los láseres.

## juego-codigo
Memorice el código. Tiene dos segundos y medio para hacerlo.

## juego-caja
Abra la caja fuerte: pulse «Fijar» cuando el dial marque el número de la combinación.

## juego-anagrama
La contraseña está desordenada. Ordénela antes de que alguien se dé cuenta.

## juego-palabras
<!--
  Diccionario del juego de la contraseña: se elige una palabra al azar y se muestra desordenada.
  Cada error destapa una letra en su sitio (western → --s----); al tercer error llegan los refuerzos.
  Una palabra por línea, empezando por «- ». Para añadir otra, escribe una línea nueva y guarda.
  No importan tildes ni mayúsculas. Mejor palabras sueltas (sin espacios).
-->
- cisne
- misterio
- homero
- simpson
- detective
- ajedrez
- western
- terror
- futurama
- pista

## juego-descenso
<!-- Colgado del techo de la bóveda. -->
Descienda desde el techo y frene en la franja verde: el suelo tiene sensores de presión. (Y de vergüenza.)

## juego-bucear
<!-- Inmersión: la tarjeta se hunde en el agua y al llegar al fondo se abre la cerradura. -->
Contenga la respiración, agente. (No tiene que hacerlo, pero es divertido.)

## juego-bucear-fondo
<!-- Sustituye al de arriba al llegar al fondo. -->
Hemos llegado al fondo, agente. Ya puede respirar.

## juego-exito
Bien hecho, agente.

## juego-fallo
<!-- Sale unos segundos y el juego vuelve a empezar solo. -->
Misión fallida. Tranquilo: esta saga tiene secuela.

## juego-refuerzos
<!-- Sale al tercer fallo: el expediente se abre igual. -->
Tres misiones fallidas. Llegaron los refuerzos y desactivaron la seguridad por usted. No se lo contaremos a nadie.

## autodestruir-boton
Destruir expediente

## autodestruir-mensaje
Es broma. Los buenos textos no se destruyen.

## pie
<!-- Sale una frase al azar en cada visita. Una por línea. Las de abajo de la primera son propuestas: borra las que no te gusten. -->
- Ningún economista fue consultado para escribir estos textos.
- Ningún becario resultó herido durante la redacción de estos expedientes.
- Cualquier parecido con la realidad es, en este caso, el objetivo.
- Leer más de tres expedientes seguidos puede provocar opiniones.
- Ningún algoritmo le recomendó esta página. Llegó usted solo, qué admirable.
- Su dispositivo se autodestruirá en 3, 2, 1… bueno, mañana.
- Las opiniones vertidas en estos textos no reflejan necesariamente las del autor. A veces cambia de opinión.
- Si usted fuera un espía, ya habría notado que el canal y el cifrado de arriba cambian en cada visita. Y eso no significa nada. ¿O sí?
- Si usted es un espía de verdad, sepa que aquí no hay secretos (sólo los del autor).
- Un economista predijo que estos textos le gustarían. Le deseamos suerte a los dos.
- La demanda de estos textos es baja, pero la oferta no se rinde.
- Estos textos son gratis, y aun así algún economista diría que están sobrevalorados.
- Si usted fuera inteligente, notaría que este pie cambia cada vez que entra. Ya lo notó. Felicidades.
- Si usted fuera inteligente, no leería los pies de página. Y nosotros no los escribiríamos.
- Sólo un espía se detiene a leer un pie de página. Bien hecho.
- Si usted fuera inteligente, no habría contenido la respiración en la inmersión. Le dijimos que no hacía falta.
- Le advertimos que el autor era pretensioso.