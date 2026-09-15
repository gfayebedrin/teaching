"""Trois ajustements affines et leur chi2 réduit : barres trop grandes, bon ajustement, modèle rejeté.

Génère ajustement_chi2.svg. Le bruit des deux premiers cas est remis à l'échelle pour obtenir
exactement le chi2 réduit visé ; le troisième jeu de données est courbe, donc mal décrit par une droite.
"""

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

BLEU = "#2f6fb3"
ORANGE = "#d9822b"

rng = np.random.default_rng(1)
x = np.arange(1, 11)
N, p = len(x), 2


def ajuste(y, u):
    a, b = np.polyfit(x, y, 1, w=1 / u)
    chi2_red = np.sum(((y - (a * x + b)) / u) ** 2) / (N - p)
    return a, b, chi2_red


def avec_chi2(u, chi2_vise):
    bruit = rng.normal(0, 1, N)
    _, _, chi2 = ajuste(2 * x + 1 + bruit, u)
    return 2 * x + 1 + bruit * np.sqrt(chi2_vise / chi2)


cas = []
u = np.full(N, 3.0)
cas.append((avec_chi2(u, 0.1), u))  # barres d'erreur trop grandes
u = np.full(N, 1.0)
cas.append((avec_chi2(u, 1.1), u))  # bon ajustement
u = np.full(N, 0.5)
cas.append((2 * x + 1 + 0.35 * (x - 5.5) ** 2 - 3 + rng.normal(0, 0.5, N), u))  # données courbes

fig, axes = plt.subplots(1, 3, figsize=(10, 3), sharey=True)
xx = np.linspace(0, 11, 2)
for ax, (y, u) in zip(axes, cas):
    a, b, chi2_red = ajuste(y, u)
    ax.plot(xx, a * xx + b, color=ORANGE, lw=2, zorder=1)
    ax.errorbar(x, y, yerr=u, fmt="o", color=BLEU, ms=5, capsize=3, zorder=2)
    valeur = f"{chi2_red:.1f}".replace(".", "{,}")
    ax.set_title(rf"$\chi^2_\mathrm{{red}} = {valeur}$", fontsize=18)
    ax.set_xlim(0, 11)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_xlabel(r"$x$", fontsize=16)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
axes[0].set_ylabel(r"$y$", fontsize=16, rotation=0, labelpad=12)

fig.savefig(Path(__file__).with_suffix(".svg"), bbox_inches="tight", transparent=True)
