"""Combinaison de deux incertitudes indépendantes : u(z) = sqrt(u(x)^2 + u(y)^2).

Génère propagation_somme.svg : distributions gaussiennes de x (en haut) et y (à droite),
densité jointe au centre, barres d'erreur u(x) et u(y), et u(z) radial jusqu'au point (u(x), u(y)).
"""

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

BLEU = "#2f6fb3"
BLACK = "#000000"

ux, uy = 0.8, 0.6  # triangle 3-4-5 : u(z) = 1
uz = np.hypot(ux, uy)
L = 1.8  # demi-largeur des axes

gauss = lambda t, s: np.exp(-t**2 / (2 * s**2))

# Figure carrée et grille symétrique : le panneau central est carré, donc à échelle égale en x et y
fig = plt.figure(figsize=(6, 6))
gs = fig.add_gridspec(2, 2, width_ratios=(4, 1), height_ratios=(1, 4), wspace=0.05, hspace=0.05,
                      left=0.1, right=0.95, bottom=0.1, top=0.95)
ax = fig.add_subplot(gs[1, 0])
ax_x = fig.add_subplot(gs[0, 0], sharex=ax)
ax_y = fig.add_subplot(gs[1, 1], sharey=ax)

# Densité jointe
t = np.linspace(-L, L, 400)
X, Y = np.meshgrid(t, t)
ax.pcolormesh(X, Y, gauss(X, ux) * gauss(Y, uy), cmap="Blues", vmax=1.8, shading="auto", rasterized=True)
ax.set_xlim(-L, L)
ax.set_ylim(-L, L)

# Rappel de u(x) et u(y) au centre
arrow = dict(arrowstyle="<->", lw=1.5, color="k", shrinkA=0, shrinkB=0)
ax.errorbar(0, 0, xerr=ux, yerr=uy, fmt="none", ecolor=BLACK, elinewidth=1.5, capsize=6, capthick=1.5)

# u(z) radial, du centre jusqu'au point (u(x), u(y)) : sa longueur vaut sqrt(u(x)² + u(y)²)
zx, zy = ux, uy
ax.annotate("", (zx, zy), (0, 0),
            arrowprops=dict(arrowstyle="-|>", lw=3, color=BLACK, mutation_scale=20, shrinkA=0, shrinkB=0))
ax.text(zx / 2 - 0.13 * uy / uz, zy / 2 + 0.13 * ux / uz, r"$u(z)$", color=BLACK, fontsize=22, ha="center", va="bottom")

ax.set_xticks([])
ax.set_yticks([])
ax.set_xlabel(r"$x$", fontsize=18)
ax.set_ylabel(r"$y$", fontsize=18, rotation=0, labelpad=12)

# Distribution de x
ax_x.plot(t, gauss(t, ux), color=BLEU, lw=1.5)
ax_x.fill_between(t, gauss(t, ux), where=np.abs(t) <= ux, color=BLEU, alpha=0.3, lw=0)
ax_x.annotate("", (ux, 0.25), (0, 0.25), arrowprops=arrow)
ax_x.text(ux / 2, 0.3, r"$u(x)$", ha="center", va="bottom", fontsize=16)
ax_x.set_ylim(0, 1.15)
ax_x.axis("off")

# Distribution de y
ax_y.plot(gauss(t, uy), t, color=BLEU, lw=1.5)
ax_y.fill_betweenx(t, gauss(t, uy), where=np.abs(t) <= uy, color=BLEU, alpha=0.3, lw=0)
ax_y.annotate("", (0.25, uy), (0.25, 0), arrowprops=arrow)
ax_y.text(0.32, uy / 2, r"$u(y)$", ha="left", va="center", fontsize=16)
ax_y.set_xlim(0, 1.15)
ax_y.axis("off")

fig.savefig(Path(__file__).with_suffix(".svg"), bbox_inches="tight", transparent=True)
