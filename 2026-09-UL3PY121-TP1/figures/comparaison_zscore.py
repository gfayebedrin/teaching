"""Comparaison d'une mesure à une valeur de référence : z = 2 (compatible) et z = 4 (incompatible).

Génère comparaison_zscore.svg : pour chaque z, la gaussienne de la mesure et celle de la référence,
écartées de z * sqrt(u(x)^2 + u_ref^2).
"""

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

BLEU = "#2f6fb3"
ORANGE = "#d9822b"

u, u_ref = 1.0, 0.5
u_tot = np.hypot(u, u_ref)

gauss = lambda t, m, s: np.exp(-((t - m) ** 2) / (2 * s**2)) / (s * np.sqrt(2 * np.pi))

t = np.linspace(-3.5, 7.5, 1000)
fig, axes = plt.subplots(1, 2, figsize=(10, 3), sharey=True)

for ax, z, verdict in zip(axes, (2, 4), ("compatible", "incompatible")):
    x_ref = z * u_tot
    ax.plot(t, gauss(t, 0, u), color=BLEU, lw=2, label=r"mesure $x \pm u(x)$")
    ax.fill_between(t, gauss(t, 0, u), color=BLEU, alpha=0.2, lw=0)
    ax.plot(t, gauss(t, x_ref, u_ref), color=ORANGE, lw=2, label=r"référence $x_\mathrm{ref} \pm u_\mathrm{ref}$")
    ax.fill_between(t, gauss(t, x_ref, u_ref), color=ORANGE, alpha=0.2, lw=0)

    ax.annotate("", (x_ref, 0.9), (0, 0.9), arrowprops=dict(arrowstyle="<->", lw=1.5, color="k", shrinkA=0, shrinkB=0))
    ax.text(x_ref / 2, 0.95, rf"$z = {z}$", ha="center", va="bottom", fontsize=18)
    ax.set_title(verdict, fontsize=18)

    ax.set_xlim(t[0], t[-1])
    ax.set_ylim(0, 1.15)
    ax.set_xticks([])
    ax.set_yticks([])
    for side in ("top", "right", "left"):
        ax.spines[side].set_visible(False)

fig.legend(*axes[0].get_legend_handles_labels(), loc="upper center", bbox_to_anchor=(0.5, 0.02), ncol=2, frameon=False, fontsize=15)

fig.savefig(Path(__file__).with_suffix(".svg"), bbox_inches="tight", transparent=True)
