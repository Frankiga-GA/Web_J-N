"""
Normaliza los logos de "Entidades y organizaciones atendidas" para que todos se vean
del mismo tamaño visual dentro de sus tarjetas.

Uso (desde la carpeta estudio-jyn):
    python -m pip install pillow
    python scripts/normalizar-logos.py

Qué hace con cada logo de assets/img/cajas/:
  1. Recorta el blanco o la transparencia sobrante alrededor del logo.
  2. Lo escala para que ocupe aproximadamente la MISMA SUPERFICIE que los demás
     (un logo ancho y uno cuadrado quedan con el mismo peso visual), sin pasarse
     de los márgenes del lienzo.
  3. Lo centra en un lienzo blanco de 640x400 (misma proporción que la tarjeta)
     y lo guarda en assets/img/cajas/norm/<nombre>.webp

Para agregar una entidad nueva: sumar su archivo a LOGOS y volver a ejecutar.
"""
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'img', 'cajas')
OUT = os.path.join(SRC, 'norm')

CANVAS = (640, 400)
TARGET_AREA = 0.20          # fracción del lienzo que ocupa cada logo
MAX_W, MAX_H = 0.80, 0.62   # límites para logos muy anchos o muy altos

# archivo de origen -> ajuste óptico (los logos macizos se ven más grandes: se reducen un poco)
LOGOS = {
    'caja-municipal-ica.png': 1.0,
    'card-caja-arequipa.png': 1.0,
    'caja-sullana-logo.png': 1.0,
    'caja-luren-logo.png': 1.0,
    'efe-financiera-efectiva.png': 0.9,
    'elektra-logo.png': 0.93,
    'agrobanco-logo.png': 1.0,
    'inversiones-kaliptra.png': 1.0,
    'caja-huancayo-logo.png': 1.0,
}


def trim(im):
    """Recorta el fondo blanco/transparente alrededor del logo."""
    flat = Image.alpha_composite(Image.new('RGBA', im.size, (255, 255, 255, 255)), im).convert('L')
    box = flat.point(lambda v: 255 if v < 240 else 0).getbbox()
    return im.crop(box) if box else im


def main():
    os.makedirs(OUT, exist_ok=True)
    cw, ch = CANVAS
    for name, optical in LOGOS.items():
        im = trim(Image.open(os.path.join(SRC, name)).convert('RGBA'))
        w, h = im.size
        scale = ((TARGET_AREA * cw * ch) / (w * h)) ** 0.5 * optical
        scale = min(scale, MAX_W * cw / w, MAX_H * ch / h)
        nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
        logo = im.resize((nw, nh), Image.LANCZOS)
        canvas = Image.new('RGBA', CANVAS, (255, 255, 255, 255))
        canvas.alpha_composite(logo, ((cw - nw) // 2, (ch - nh) // 2))
        out = os.path.join(OUT, os.path.splitext(name)[0] + '.webp')
        canvas.convert('RGB').save(out, 'WEBP', quality=88, method=6)
        print(f'{name:<32} {w}x{h} -> {nw}x{nh}  ({os.path.getsize(out) // 1024} KB)')


if __name__ == '__main__':
    main()
