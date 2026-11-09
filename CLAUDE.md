# Reglas para trabajar en este proyecto

Web de artista de Daniel DB. Lee primero el [README.md](README.md): explica la estructura, cada sección de texto y las decisiones de diseño.

## No romper
- **Los textos son de Daniel.** Viven en `textos/` (`portada.md`, `no-ficcion.md` y un `.md` por artículo en `textos/no-ficcion/`). No reescribas sus frases ni sus chistes sin que lo pida: si algo se ve mal (desborda, lista mal escrita), avisa y propone. Cuando diga «el texto ha sido actualizado», relee el `.md` y comprueba que la página lo muestra bien.
- **No renombres las secciones `## nombre`** del `.md` ni los atributos `data-texto` del HTML: están emparejados. Si añades una sección, añade su elemento en `index.html` con texto por defecto.
- `marquesina`, `marquesina-visitante` y `reproductor` no tienen `data-texto`: las lee `js/senor-x.js` directamente.
- **No cambies `(#firmar)` ni `(#leer)`**: abren las ventanas del libro de visitas.
- **Al cambiar CSS o JS, sube el `?v=…`** de los enlaces de cada HTML que los use (`index.html`, `no-ficcion/*.html`; `js/textos.js` lo usan todas), o el navegador servirá la versión vieja.
- **Colores:** usa las variables de `css/paleta.css` (`--p-*`). Los colores propios de la portada (`--x-*`) están al inicio de `css/senor-x.css` y no forman parte de la paleta global.
- **`conceptos/` es un laboratorio**, no la web pública. Los descartados se mueven a `conceptos/descartados/`; no se borran.
- **Sin frameworks ni compilación**: HTML, CSS y JS puros para GitHub Pages.

## Estilo y contenido
- La portada imita una página personal de 1998 (Señor X de *Los Simpson*) con humor de *Los Simpson* y *Futurama*: estructura en tres actos, remates que se conectan entre sí (callbacks) y chistes escondidos para quien se fija.
- **Sin imágenes** en la web: todo es texto, juegos y easter eggs.
- Homenajes de estilo, nunca copias: sin logotipos, personajes ni letras de canciones.
- Evitar: look corporativo, violetas/galaxias («astrología»), tipografía manuscrita, revelado lento de texto en la portada.
- Daniel decide mejor viendo: muestra prototipos que funcionen en lugar de describir opciones.

## Publicar
- Repositorio `danielTeniente/danielTeniente.github.io`, rama `master`; GitHub Pages sirve la raíz en https://danielteniente.github.io/ (hay `.nojekyll`).
- Publicar = commit + `git push`, **solo cuando Daniel lo pida**. Revisa en localhost antes.
- Usa siempre rutas relativas (sin `/` inicial): así la web funciona igual en localhost, en la raíz del dominio o en una subcarpeta.

## Comprobar
- Servidor: `python -m http.server 5173` (o `web-artista` en `.claude/launch.json`).
- Si el panel del navegador está oculto, mide 0 px y congela animaciones: emula 1024×768 para revisar el diseño.
- Revisa la consola: debe quedar sin errores.
