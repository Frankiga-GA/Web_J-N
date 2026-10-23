"""
Genera un subconjunto local de Font Awesome Free 6.5.0 con SOLO los íconos que usa el sitio.

Uso (desde la carpeta estudio-jyn):
    python -m pip install fonttools brotli
    python scripts/generar-iconos.py RUTA_A_FONTAWESOME

RUTA_A_FONTAWESOME es una copia de Font Awesome Free 6.5.0 con las carpetas
css/all.css y webfonts/*.ttf (se descarga de https://fontawesome.com/download o de
https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/).

El script:
  1. Busca las clases fa-* usadas en index.html y assets/**/*.js.
  2. Toma sus códigos del all.css original.
  3. Recorta las fuentes (solid, regular, brands) a esos glifos con fonttools.
  4. Escribe assets/vendor/fontawesome/icons.css + las fuentes .woff2.

Si se agrega un ícono nuevo al sitio, basta con volver a ejecutar el script.
"""
import glob
import os
import re
import sys

from fontTools import subset

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'assets', 'vendor', 'fontawesome')

# Clases auxiliares de Font Awesome que no son íconos
NOT_ICONS = {'fa-solid', 'fa-regular', 'fa-brands', 'fa-classic', 'fa-sharp'}

FONTS = {
    # archivo ttf de origen: (familia, peso, clases de estilo)
    'fa-solid-900': ('Font Awesome 6 Free', 900),
    'fa-regular-400': ('Font Awesome 6 Free', 400),
    'fa-brands-400': ('Font Awesome 6 Brands', 400),
}


def used_icons():
    files = [os.path.join(ROOT, 'index.html')]
    files += glob.glob(os.path.join(ROOT, 'assets', '**', '*.js'), recursive=True)
    found = {}
    for path in files:
        if os.sep + 'vendor' + os.sep in path:
            continue
        text = open(path, encoding='utf-8').read()
        for prefix, name in re.findall(r'\b(fas|far|fab|fa-solid|fa-regular|fa-brands)?\s*\b(fa-[a-z0-9-]+)', text):
            if name in NOT_ICONS:
                continue
            found.setdefault(name, set()).add(prefix or 'fas')
    return found


def icon_codes(all_css):
    """Mapa nombre-de-clase -> código unicode (los alias comparten código)."""
    codes = {}
    # Los íconos sólidos usan "::before" y los de marcas ":before"
    for selectors, code in re.findall(r'((?:\.fa-[a-z0-9-]+::?before,?\s*)+)\{\s*content:\s*"\\([0-9a-f]+)"', all_css):
        for name in re.findall(r'\.(fa-[a-z0-9-]+)::?before', selectors):
            codes[name] = code
    return codes


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    fa_dir = sys.argv[1]
    all_css = open(os.path.join(fa_dir, 'css', 'all.css'), encoding='utf-8').read()
    codes = icon_codes(all_css)
    icons = used_icons()

    missing = sorted(n for n in icons if n not in codes)
    if missing:
        print('Aviso: clases sin ícono en Font Awesome (se ignoran):', ', '.join(missing))
    icons = {n: s for n, s in icons.items() if n in codes}

    brands = {n for n, styles in icons.items() if 'fab' in styles or 'fa-brands' in styles}
    regular = {n for n, styles in icons.items() if 'far' in styles or 'fa-regular' in styles}
    solid = {n for n, styles in icons.items() if styles & {'fas', 'fa-solid'}}

    os.makedirs(OUT_DIR, exist_ok=True)
    sets = {'fa-solid-900': solid, 'fa-regular-400': regular, 'fa-brands-400': brands}
    for font, names in sets.items():
        if not names:
            continue
        unicodes = ','.join('U+' + codes[n] for n in sorted(names))
        out = os.path.join(OUT_DIR, font + '.woff2')
        subset.main([
            os.path.join(fa_dir, 'webfonts', font + '.ttf'),
            '--unicodes=' + unicodes,
            '--flavor=woff2',
            '--output-file=' + out,
            '--layout-features=*',
            '--no-hinting',
        ])
        print(f'{font}: {len(names)} íconos -> {os.path.getsize(out)} bytes')

    css = [
        '/* Subconjunto de Font Awesome Free 6.5.0 (generado por scripts/generar-iconos.py).',
        ' * Licencia: https://fontawesome.com/license/free (Íconos: CC BY 4.0, Fuentes: SIL OFL 1.1, Código: MIT) */',
        "@font-face { font-family: 'Font Awesome 6 Free'; font-style: normal; font-weight: 900; font-display: block; src: url('fa-solid-900.woff2') format('woff2'); }",
    ]
    if regular:
        css.append("@font-face { font-family: 'Font Awesome 6 Free'; font-style: normal; font-weight: 400; font-display: block; src: url('fa-regular-400.woff2') format('woff2'); }")
    if brands:
        css.append("@font-face { font-family: 'Font Awesome 6 Brands'; font-style: normal; font-weight: 400; font-display: block; src: url('fa-brands-400.woff2') format('woff2'); }")
    css += [
        '.fa, .fas, .far, .fab, .fa-solid, .fa-regular, .fa-brands {',
        '  -moz-osx-font-smoothing: grayscale; -webkit-font-smoothing: antialiased;',
        '  display: inline-block; font-style: normal; font-variant: normal; line-height: 1; text-rendering: auto;',
        '}',
        ".fa, .fas, .fa-solid { font-family: 'Font Awesome 6 Free'; font-weight: 900; }",
        ".far, .fa-regular { font-family: 'Font Awesome 6 Free'; font-weight: 400; }",
        ".fab, .fa-brands { font-family: 'Font Awesome 6 Brands'; font-weight: 400; }",
    ]
    for name in sorted(icons):
        css.append(f'.{name}::before {{ content: "\\{codes[name]}"; }}')
    with open(os.path.join(OUT_DIR, 'icons.css'), 'w', encoding='utf-8', newline='\n') as fh:
        fh.write('\n'.join(css) + '\n')
    print('icons.css:', len(icons), 'íconos')


if __name__ == '__main__':
    main()
