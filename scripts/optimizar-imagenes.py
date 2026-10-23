"""
Genera versiones WebP optimizadas de las imágenes JPG/PNG que usa el sitio.

Uso (desde la carpeta estudio-jyn):
    python -m pip install pillow
    python scripts/optimizar-imagenes.py            # crea los .webp que falten
    python scripts/optimizar-imagenes.py --force    # vuelve a generar todos
    python scripts/optimizar-imagenes.py --list     # solo muestra qué haría

Qué hace:
  1. Busca en index.html y assets/**/*.js las rutas assets/img/*.jpg|*.png que se usan.
  2. Crea al lado un .webp con el mismo nombre (máx. 1600 px de ancho; los logos,
     600 px), calidad 80 y conservando la transparencia.
  3. Muestra el ahorro. NO modifica el HTML ni los JS: después hay que cambiar la
     referencia al .webp (o usar <picture> con el original como respaldo).
"""
import glob
import os
import re
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAX_WIDTH = 1600
MAX_WIDTH_LOGO = 600
QUALITY = 80


def referenced_images():
    files = [os.path.join(ROOT, 'index.html')]
    files += [f for f in glob.glob(os.path.join(ROOT, 'assets', '**', '*.js'), recursive=True)
              if os.sep + 'vendor' + os.sep not in f]
    refs = set()
    for path in files:
        text = open(path, encoding='utf-8').read()
        refs.update(re.findall(r'assets/img/[\w/.-]+?\.(?:jpe?g|png)', text, flags=re.I))
    return sorted(refs)


def convert(rel, force=False, dry=False):
    src = os.path.join(ROOT, rel.replace('/', os.sep))
    if not os.path.exists(src):
        print(f'  (no existe) {rel}')
        return 0
    dst = os.path.splitext(src)[0] + '.webp'
    if os.path.exists(dst) and not force:
        print(f'  ya existe   {rel[len("assets/img/"):]} -> .webp')
        return 0
    if dry:
        print(f'  convertiría {rel}')
        return 0
    im = Image.open(src)
    limit = MAX_WIDTH_LOGO if 'logo' in os.path.basename(src).lower() else MAX_WIDTH
    if im.width > limit:
        im = im.resize((limit, round(im.height * limit / im.width)), Image.LANCZOS)
    has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
    im = im.convert('RGBA' if has_alpha else 'RGB')
    im.save(dst, 'WEBP', quality=QUALITY, method=6)
    before, after = os.path.getsize(src), os.path.getsize(dst)
    print(f'  {rel[len("assets/img/"):]:<45} {before // 1024:>5} KB -> {after // 1024:>4} KB')
    return before - after


def main():
    force = '--force' in sys.argv
    dry = '--list' in sys.argv
    extra = [a for a in sys.argv[1:] if not a.startswith('--')]
    refs = extra or referenced_images()
    print(f'{len(refs)} imágenes JPG/PNG referenciadas:')
    saved = sum(convert(r, force, dry) for r in refs)
    if saved:
        print(f'Ahorro total: {saved // 1024} KB')


if __name__ == '__main__':
    main()
