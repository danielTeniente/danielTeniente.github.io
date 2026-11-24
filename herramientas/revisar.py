#!/usr/bin/env python3
"""
Revisor de la web: comprueba que todo lo que se va a publicar funcione.

    python herramientas/revisar.py             revisa y avisa
    python herramientas/revisar.py --arreglar  además pone al día los ?v= de CSS y JS

Sale con código 1 si hay ERRORES (el gancho pre-push no deja subir).
Los AVISOS no bloquean: son cosas que conviene mirar.

Qué revisa:
  1. Enlaces y recursos locales de cada página (href/src): que existan y que se vayan a publicar.
  2. Caché: el ?v= de cada CSS/JS debe ser la huella de su contenido (se arregla con --arreglar).
  3. Listas de los .md (expedientes, reseñas, relatos, galería, portadas, menú): que cada archivo exista,
     se vaya a publicar y tenga sus secciones obligatorias (sólo mira los títulos «## …», no el texto).
  4. Que no se publique nada con «lorem ipsum».
  5. Sintaxis de todos los .js (con Node, si está instalado).
  6. Seguridad: política CSP en cada página, enlaces target=_blank con rel=noopener.
  7. Contador de visitas (js/visitas.js) en cada página pública.
  8. Secciones data-texto del HTML que no estén en su .md (aviso: se usa el texto por defecto).
  9. Peso de las imágenes.

Sólo usa la biblioteca estándar de Python. No lee el texto de los artículos ni de las reseñas.
"""
import hashlib
import re
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote

RAIZ = Path(__file__).resolve().parent.parent
ARREGLAR = '--arreglar' in sys.argv

errores, avisos = [], []
def error(msg): errores.append(msg)
def aviso(msg): avisos.append(msg)


# ---------- qué se publica ----------
def git(*args):
    r = subprocess.run(['git', *args], cwd=RAIZ, capture_output=True, text=True, encoding='utf-8')
    return r.stdout.splitlines() if r.returncode == 0 else None

_lista = git('ls-files', '--cached', '--others', '--exclude-standard')
if _lista is None:
    print('No se pudo usar git: se revisa todo como si se publicara.')
    PUBLICABLES = {p.relative_to(RAIZ).as_posix() for p in RAIZ.rglob('*') if p.is_file() and '.git' not in p.parts}
else:
    PUBLICABLES = {p for p in _lista if (RAIZ / p).exists()}

def publicable(rel): return rel in PUBLICABLES
def rel(p): return p.relative_to(RAIZ).as_posix()

# Laboratorio y material de trabajo: no se revisan
FUERA = ('conceptos/', 'referencias/', 'campana/', 'herramientas/', '.claude/')
PAGINAS = sorted(p for p in PUBLICABLES if p.endswith('.html') and not p.startswith(FUERA))

# Páginas internas (no se cuentan las visitas)
SIN_VISITAS = {'guia-visual.html', 'ficcion/relato.html'}
# Textos de Daniel que este revisor no lee (sólo sus títulos «## …» y rutas de imágenes)
PRIVADOS = ('textos/no-ficcion/', 'textos/videojuegos/')


# ---------- utilidades de Markdown (sólo estructura) ----------
def secciones(path):
    """Devuelve {nombre: texto} de un .md (sin comentarios)."""
    md = re.sub(r'<!--[\s\S]*?-->', '', path.read_text(encoding='utf-8'))
    out, clave, buf = {}, None, []
    for linea in md.splitlines():
        m = re.match(r'^##\s+(.+?)\s*$', linea)
        if m:
            if clave: out[clave] = '\n'.join(buf).strip()
            clave, buf = m.group(1).strip().lower(), []
        elif clave:
            buf.append(linea)
    if clave: out[clave] = '\n'.join(buf).strip()
    return out

def titulos(path):
    """Sólo los nombres de las secciones «## …» (para los textos que no se leen)."""
    md = re.sub(r'<!--[\s\S]*?-->', '', path.read_text(encoding='utf-8'))
    return {m.group(1).strip().lower() for m in re.finditer(r'^##\s+(.+?)\s*$', md, re.M)}

def elementos(texto):
    return [l.strip()[2:].strip() for l in (texto or '').splitlines() if l.strip().startswith('- ')]

def exigir_archivo(ruta, quien):
    if not (RAIZ / ruta).exists():
        error(f'{quien}: no existe «{ruta}»')
        return False
    if not publicable(ruta):
        error(f'{quien}: «{ruta}» existe pero NO se va a publicar (está en .gitignore)')
        return False
    return True


# ---------- 1, 2, 6, 7. Páginas HTML ----------
RE_ATRIB = re.compile(r'\b(href|src)="([^"]*)"')
RE_VERSION = re.compile(r'((?:href|src)="([^"?#]+\.(?:css|js))\?v=)([^"]*)(")')
huellas = {}

def huella(ruta):
    if ruta not in huellas:
        huellas[ruta] = hashlib.sha1((RAIZ / ruta).read_bytes()).hexdigest()[:8]
    return huellas[ruta]

def resolver(pagina, destino):
    """Ruta relativa a la raíz para un enlace local, o None si es externo/ancla."""
    if re.match(r'^(https?:|mailto:|tel:|data:|javascript:|#|//)', destino, re.I) or not destino:
        return None
    limpio = unquote(destino.split('#')[0].split('?')[0])
    if not limpio:
        return None
    if limpio.startswith('/'):
        aviso(f'{pagina}: ruta absoluta «{destino}» (usa rutas relativas, sin / inicial)')
        limpio = limpio[1:]
    base = (RAIZ / pagina).parent
    destino_abs = (base / limpio).resolve()
    if destino_abs.is_dir():
        destino_abs = destino_abs / 'index.html'
    try:
        return rel(destino_abs)
    except ValueError:
        error(f'{pagina}: «{destino}» apunta fuera de la web')
        return None

for pagina in PAGINAS:
    archivo = RAIZ / pagina
    html = archivo.read_text(encoding='utf-8')
    sin_comentarios = re.sub(r'<!--[\s\S]*?-->', '', html)

    # 1. recursos y enlaces locales
    for _, destino in RE_ATRIB.findall(sin_comentarios):
        r = resolver(pagina, destino)
        if r: exigir_archivo(r, pagina)

    # 2. versiones de caché
    def poner_version(m):
        r = resolver(pagina, m.group(2))
        if not r or not (RAIZ / r).exists():
            return m.group(0)
        bien = huella(r)
        if m.group(3) != bien:
            if ARREGLAR:
                return f'{m.group(1)}{bien}{m.group(4)}'
            error(f'{pagina}: «{m.group(2)}?v={m.group(3)}» está desactualizado (ejecuta con --arreglar)')
        return m.group(0)
    nuevo = RE_VERSION.sub(poner_version, html)
    if nuevo != html:
        archivo.write_text(nuevo, encoding='utf-8', newline='')
        print(f'  ?v= actualizado en {pagina}')
    for m in re.finditer(r'(?:href|src)="([^":?#]+\.(?:css|js))"', sin_comentarios):
        if pagina != 'guia-visual.html':
            aviso(f'{pagina}: «{m.group(1)}» sin ?v= (el navegador puede servir una versión vieja)')

    # 6. seguridad
    if 'http-equiv="Content-Security-Policy"' not in html:
        error(f'{pagina}: falta la política de seguridad (<meta http-equiv="Content-Security-Policy">)')
    for m in re.finditer(r'<a\b[^>]*target="_blank"[^>]*>', sin_comentarios):
        if 'noopener' not in m.group(0):
            error(f'{pagina}: enlace target="_blank" sin rel="noopener": {m.group(0)[:80]}')
    if re.search(r'<script(?![^>]*\bsrc=)[^>]*>\s*\S', sin_comentarios):
        error(f'{pagina}: tiene un <script> en línea (la política de seguridad lo bloquea: muévelo a un .js)')
    if re.search(r'\son[a-z]+="', sin_comentarios):
        error(f'{pagina}: tiene un atributo onclick/onload… (la política de seguridad lo bloquea)')

    # 7. contador de visitas
    if pagina not in SIN_VISITAS and 'js/visitas.js' not in sin_comentarios:
        error(f'{pagina}: no carga js/visitas.js (sus visitas no se contarían)')


# ---------- 8. data-texto sin sección en su .md ----------
PAGINA_MD = {
    'index.html': 'textos/portada.md',
    'no-ficcion/index.html': 'textos/no-ficcion.md',
    'videojuegos/index.html': 'textos/videojuegos.md',
    'ficcion/index.html': 'textos/ficcion.md',
}
for pagina, md in PAGINA_MD.items():
    if not (RAIZ / pagina).exists() or not (RAIZ / md).exists():
        continue
    s = secciones(RAIZ / md)
    for nombre in sorted(set(re.findall(r'data-texto="([^"]+)"', (RAIZ / pagina).read_text(encoding='utf-8')))):
        if nombre not in s:
            aviso(f'{pagina}: data-texto="{nombre}" no tiene «## {nombre}» en {md} (sale el texto por defecto)')


# ---------- 3. Listas de los .md ----------
def revisar_articulos(lista_md, seccion, carpeta, obligatorias, quien):
    if not (RAIZ / lista_md).exists():
        return
    for item in elementos(secciones(RAIZ / lista_md).get(seccion)):
        nombre = item.split('·')[0].strip()
        if not re.fullmatch(r'[a-z0-9-]+', nombre):
            error(f'{lista_md} ## {seccion}: «{nombre}» no es un nombre válido (minúsculas, números y guiones)')
            continue
        ruta = f'{carpeta}/{nombre}.md'
        if exigir_archivo(ruta, f'{lista_md} ## {seccion}'):
            faltan = [o for o in obligatorias if o not in titulos(RAIZ / ruta)]
            if faltan:
                error(f'{ruta}: le faltan las secciones {", ".join("## " + f for f in faltan)} ({quien})')

revisar_articulos('textos/no-ficcion.md', 'expedientes', 'textos/no-ficcion',
                  ['titulo', 'fecha', 'cuerpo'], 'artículo')
revisar_articulos('textos/expedientes-x.md', 'expedientes-x', 'textos/no-ficcion',
                  ['titulo', 'fecha', 'cuerpo'], 'expediente χ')
revisar_articulos('textos/videojuegos.md', 'resenas', 'textos/videojuegos',
                  ['titulo', 'fecha', 'cuerpo'], 'reseña')

# Relatos: .md, su página .html y su portada
if (RAIZ / 'textos/ficcion.md').exists():
    f = secciones(RAIZ / 'textos/ficcion.md')
    relatos = elementos(f.get('relatos'))
    lanz = (f.get('lanzamiento') or '').strip()
    if lanz and lanz not in relatos:
        error(f'textos/ficcion.md ## lanzamiento: «{lanz}» no está en ## relatos')
    for nombre in relatos:
        ruta = f'textos/ficcion/{nombre}.md'
        if not exigir_archivo(ruta, 'textos/ficcion.md ## relatos'):
            continue
        r = secciones(RAIZ / ruta)
        lectura = (r.get('lectura') or '').strip().lower()
        if lectura not in ('completo', 'adelanto', 'nota', 'no', 'proximamente'):
            error(f'{ruta}: ## lectura debe ser completo, adelanto, nota, no o proximamente (pone «{lectura}»)')
        if 'titulo' not in r:
            error(f'{ruta}: falta ## titulo')
        if lectura != 'no':
            pagina = f'ficcion/{nombre}.html'
            if exigir_archivo(pagina, ruta) and f'data-relato="{nombre}"' not in (RAIZ / pagina).read_text(encoding='utf-8'):
                error(f'{pagina}: su data-relato no es «{nombre}»')
        portada = (r.get('portada') or '').strip()
        if portada:
            exigir_archivo(f'imagenes/portadas/{portada}', ruta)

# Galería de pixel art (las animaciones {0-3} se comprueban fotograma a fotograma)
if (RAIZ / 'textos/videojuegos.md').exists():
    for item in elementos(secciones(RAIZ / 'textos/videojuegos.md').get('galeria')):
        archivo = item.split('|')[0].strip()
        m = re.search(r'\{(\d+)-(\d+)\}', archivo)
        cuadros = [archivo.replace(m.group(0), str(i)) for i in range(int(m.group(1)), int(m.group(2)) + 1)] if m else [archivo]
        for c in cuadros:
            exigir_archivo(f'imagenes/pixel-art/{c}', 'textos/videojuegos.md ## galeria')

# Imágenes dentro de las reseñas (sólo las rutas «](imagenes/…)», no el texto)
for p in sorted((RAIZ / 'textos/videojuegos').glob('*.md')):
    if not publicable(rel(p)):
        continue
    sin_comentarios = re.sub(r'<!--[\s\S]*?-->', '', p.read_text(encoding='utf-8'))
    for ruta in re.findall(r'\]\((imagenes/[^)\s]+)\)', sin_comentarios):
        exigir_archivo(ruta, rel(p))

# Menú de la portada
if (RAIZ / 'textos/portada.md').exists():
    for item in elementos(secciones(RAIZ / 'textos/portada.md').get('menu')):
        m = re.search(r'\]\(([^)\s]+)\)', item)
        if m:
            r = resolver('index.html', m.group(1))
            if r: exigir_archivo(r, 'textos/portada.md ## menu')


# ---------- 4. lorem ipsum ----------
for p in sorted(PUBLICABLES):
    es_web = p.startswith('textos/') or p in PAGINAS
    if es_web and p.endswith(('.md', '.html')) and not p.startswith(PRIVADOS) and not re.search(r'(^|/)_', p):
        texto = re.sub(r'<!--[\s\S]*?-->', '', (RAIZ / p).read_text(encoding='utf-8', errors='ignore'))
        if re.search(r'lorem ipsum', texto, re.I):
            # un relato «proximamente» no muestra su cuerpo: se avisa, pero no bloquea
            if p.startswith('textos/ficcion/') and (secciones(RAIZ / p).get('lectura') or '').strip().lower() == 'proximamente':
                aviso(f'{p}: tiene «lorem ipsum» (no se ve porque es «proximamente», pero el .md es público)')
                continue
            error(f'{p}: tiene texto de prueba «lorem ipsum» y se va a publicar')


# ---------- 5. sintaxis JS ----------
node = shutil.which('node')
if node:
    for p in sorted((RAIZ / 'js').glob('*.js')):
        r = subprocess.run([node, '--check', str(p)], capture_output=True, text=True, encoding='utf-8')
        if r.returncode != 0:
            detalle = (r.stderr.strip().splitlines() or ['?'])
            error(f'{rel(p)}: error de sintaxis\n      ' + '\n      '.join(detalle[:4]))
else:
    aviso('Node no está instalado: no se revisó la sintaxis de los .js')


# ---------- 9. peso de las imágenes ----------
for p in sorted(PUBLICABLES):
    if p.startswith('imagenes/') and re.search(r'\.(png|jpe?g|gif|webp)$', p, re.I):
        kb = (RAIZ / p).stat().st_size / 1024
        limite = 150 if p.startswith('imagenes/pixel-art/') else 400
        if kb > limite:
            aviso(f'{p}: pesa {kb:.0f} KB (conviene menos de {limite} KB)')


# ---------- informe ----------
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass
for a in avisos: print(f'AVISO  {a}')
for e in errores: print(f'ERROR  {e}')
print(f'\n{len(PAGINAS)} páginas revisadas · {len(errores)} errores · {len(avisos)} avisos')
if not errores:
    print('Todo en orden.')
sys.exit(1 if errores else 0)
