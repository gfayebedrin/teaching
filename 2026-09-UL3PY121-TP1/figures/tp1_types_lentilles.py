"""Redessine la figure 1.2 du poly (types de lentilles) en SVG, pour l'avoir nette à la projection.

Chaque lentille est décrite par l'épaisseur au bord w et le bombement de chaque face :
a > 0 la face est bombée vers l'extérieur (convexe), a < 0 elle est creusée (concave).
"""

from pathlib import Path

BLEU = "#a9c3e0"       # remplissage des lentilles
BLEU_TRAIT = "#5b7fa6"  # contour
ORANGE = "#e2571e"      # numéros
H = 100                 # demi-hauteur des lentilles
Y = 140                 # ordonnée du centre des lentilles

lentilles = [
    # (x du centre, w, face gauche, face droite)
    (130, 14, 34, 34),    # 1 biconvexe
    (285, 14, 0, 55),     # 2 plan-convexe
    (440, 30, -22, 48),   # 3 ménisque convergent
    (640, 70, -28, -28),  # 4 biconcave
    (795, 70, 0, -52),    # 5 plan-concave
    (950, 58, 22, -48),   # 6 ménisque divergent
]

colonnes = [
    (60, "Lentilles convergentes", ["1 - lentille biconvexe", "2 - lentille plan-convexe", "3 - ménisque convergent"]),
    (570, "Lentilles divergentes", ["4 - lentille biconcave", "5 - lentille plan-concave", "6 - ménisque divergent"]),
]


def lentille(x, w, ag, ad):
    """Contour fermé : face gauche (haut → bas), bord bas, face droite (bas → haut), bord haut."""
    xg, xd = x - w / 2, x + w / 2
    return (f'M {xg} {Y - H} Q {xg - 2 * ag} {Y} {xg} {Y + H} '
            f'L {xd} {Y + H} Q {xd + 2 * ad} {Y} {xd} {Y - H} Z')


parts = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 530" width="1040" height="530"'
         ' font-family="Century Gothic, Inter, system-ui, sans-serif">']

for (x, w, ag, ad) in lentilles:
    parts.append(f'  <path d="{lentille(x, w, ag, ad)}" fill="{BLEU}" stroke="{BLEU_TRAIT}" stroke-width="2.5" />')

for numero, (x, *_) in enumerate(lentilles, start=1):
    parts.append(f'  <text x="{x}" y="{Y + H + 70}" text-anchor="middle" font-size="34" font-weight="bold"'
                 f' fill="{ORANGE}">{numero}</text>')

for x, titre, items in colonnes:
    parts.append(f'  <text x="{x}" y="400" font-size="30" font-weight="bold">{titre}</text>')
    for i, item in enumerate(items):
        parts.append(f'  <text x="{x}" y="{445 + i * 42}" font-size="27">{item}</text>')

parts.append('</svg>')

Path(__file__).with_suffix(".svg").write_text("\n".join(parts) + "\n", encoding="utf-8")
