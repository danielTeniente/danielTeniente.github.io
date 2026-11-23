# Textos del minijuego «No dejes que se apaguen»

<!-- Sale en el avance de Odio este clima (ficcion/odio-este-clima.html mientras sea «proximamente»).
     Cambia el texto DEBAJO de cada "## nombre". No cambies los nombres de los ##.
     Dos partes: la CAMINATA (ves la nieve con los ojos de Blab, nunca a Blab) y, al llegar,
     el PANEL de la máquina: sacas sus piezas de un saco y las pones en su sitio.
     Todos los textos van en segunda persona (caminas, te detienes…), nunca «Blab hace…».
     Para cada máquina:
       ## <máquina>-antes     (opcional) frases sobre la nieve antes de abrir el panel, de una en una.
                              Cada línea: «botón → texto» (la primera, sin botón). Con cada una anochece
                              un poco más (es una espera).
       ## <máquina>-llegar    (opcional) lo que sale dentro del panel al abrirlo
       ## <máquina>-piezas    sus piezas (2 o 3); «(no está)» = no la tienes
       ## <máquina>           frases al terminar, ya sin el panel: una a una con «Siguiente», sobre la nieve
     Una frase que acaba en «(se va)» hace que la máquina se marche (no se ve ese «(se va)»):
     ModelG_33 se aleja volando; las demás se pierden en la nieve. -->

## titulo
No dejes que se apaguen

## instrucciones
<!-- La pantalla de inicio. Párrafos separados por una línea en blanco. -->
Mira el mundo a través de los ojos de Blab.

## levantarse
<!-- Sale al empezar, antes de pulsar «Caminar» la primera vez -->
Te levantas temprano para poder visitar a tus amigos.

## boton
Empezar

## ruta
<!-- El orden del viaje. Cada línea: la máquina · kilómetros desde la anterior (caminas 0,15 km por segundo). -->
- ModelS_69 · 2,5
- ModelG_33 · 3
- ModelH_44 · 3,5

## caminar
Caminar

## en-camino
<!-- Mientras caminas (también al volver a caminar tras una ráfaga) -->
Caminas sin descanso...

## caminando-boton
<!-- El botón mientras caminas -->
Caminando…

## rafaga-aviso
<!-- Desde el segundo tramo puede llegar una ráfaga, o ninguna (en el primero, nunca) -->
Se acerca una ráfaga.

## rafaga-detenerse
<!-- Durante la ráfaga te quedas quieto; después sigues solo -->
Te detienes.

## llegar
<!-- Al llegar (a las máquinas sin «-antes»). {maquina} = la máquina -->
Has llegado a {maquina}.

## reparar
Reparar

## saco
<!-- El botón para sacar piezas -->
Buscar pieza en el saco

## saco-saca
<!-- Cuando sale una pieza que falta. {pieza} = cuál -->
Sacas {pieza} y la pones en su sitio.

## saco-fallo
<!-- A veces (4 de cada 10) sale otra cosa: una al azar -->
- Sacas un tornillo torcido. No sirve.
- Sacas un guante sin pareja.
- Sacas una piedra. ¿Cómo llegó aquí?
- Sacas nieve. Sólo nieve.
- Sacas una pieza de otra máquina. Mejor la guardas.

## saco-no-esta
<!-- Cuando sólo faltan piezas «(no está)». {pieza} = cuál -->
No queda ninguna {pieza} en el saco.

## seguir
Seguir caminando

## siguiente
Siguiente

## final
<!-- Al terminar el viaje. Cada línea, una debajo de otra, en el mismo bloque. -->
Fin.
Gracias por probar este simulador (sumamente realista) del mundo de Blab.

## reintentar
Otra vez

## ModelS_69-piezas
- p11
- p35

## ModelS_69
- Revisas las últimas fotografías de la zona.
- El cementerio de robots luce bien.
- Todavía tienes tiempo de visitarlo.
- Antes de que la nieve lo sepulte.

## ModelG_33-antes
<!-- Todavía no ha aterrizado: no se ve. Con cada frase anochece un poco más. -->
- Llegas a la zona de aterrizaje de ModelG_33 y esperas su llegada.
- Esperar → El tiempo pasa y tienes hambre.
- Esperar → Te preocupa que algo le haya pasado.
- Esperar → Pasa una hora y piensas en lo peor.
- Siguiente → Tal vez una pieza se soltó en su vuelo.
- Siguiente → Por Dios, que no sea cierto.
- Esperar → ...
- Siguiente → Escuchas su aleteo y te tranquilizas.
- Siguiente → ModelG_33 aterriza.

## ModelG_33-piezas
- p8-1
- p21

## ModelG_33
- Revisas si hay mensajes nuevos.
- No hay nada.
- Miras el antiguo mensaje que grabó tu padre.
- Grabas un mensaje nuevo.
- ModelG_33 se aleja volando. (se va)

## ModelH_44-piezas
<!-- Se abre directamente su panel, que parpadea. La que lleva «(no está)» no se encuentra: su hueco se queda vacío. -->
- p44-1
- p44-2
- p44-3 (no está)

## ModelH_44
<!-- Con «(se va)» su bloque se aleja despacio y se pierde en la nieve. -->
- Haces los últimos cambios que tienes permitido hacer.
- Y dejas que el robot continúe. (se va)
- Sabes que no volverás a verlo.
- No puedes parar de lamentarte por semejante pérdida.
- Es hora de volver a casa.
