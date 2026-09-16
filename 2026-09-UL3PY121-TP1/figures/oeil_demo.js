/* Figure interactive : modèle de l'œil — objet, cristallin, rétine et rayons particuliers.
   Deux curseurs : position de l'objet et distance focale du cristallin.
   Chargée par index.html via <div class="interactive" data-src="..."></div>. */

export default function oeilDemo(host) {
    const style = document.createElement('style');
    style.textContent = `
    .reveal .optique-svg {
        width: 92%;
        height: auto;
        display: block;
        margin: 0 auto;
    }

    .reveal .optique-svg .axe {
        stroke: #999;
        stroke-width: 1.5;
    }

    .reveal .optique-svg .corps {
        fill: #dbe8f6;
        stroke: none;
    }

    .reveal .optique-svg .lentille {
        stroke: #2f6fb3;
        stroke-width: 3;
        fill: none;
    }

    .reveal .optique-svg .objet {
        stroke: #333;
        stroke-width: 4;
        marker-end: url(#opt-pointe);
    }

    .reveal .optique-svg .image {
        stroke: #d9822b;
        stroke-width: 4;
        marker-end: url(#opt-pointe-image);
    }

    .reveal .optique-svg .ecran {
        stroke: #555;
        stroke-width: 6;
    }

    .reveal .optique-svg .tache {
        stroke: #d9822b;
        stroke-width: 9;
        stroke-linecap: round;
    }

    .reveal .optique-svg .rayon {
        stroke: #cc3311;
        stroke-width: 2;
        fill: none;
    }

    .reveal .optique-svg .virtuel {
        stroke: #cc3311;
        stroke-width: 2;
        stroke-dasharray: 7 6;
        fill: none;
    }

    .reveal .optique-svg text {
        font-size: 20px;
        fill: #333;
    }

    .reveal .optique-curseurs {
        display: flex;
        justify-content: center;
        gap: 2em;
        font-size: 0.5em;
        margin-top: 0.3em;
    }

    .reveal .optique-curseurs input {
        vertical-align: middle;
        margin-left: 0.4em;
        width: 9em;
    }`;
    document.head.appendChild(style);

    // Scène en centimètres, repère centré sur la lentille
    const W = 900, H = 430;
    const ech = 5.8;                       // pixels par cm, identique en x et en y
    const x0 = W / 2 - 20, y0 = H / 2 + 20; // origine (centre de la lentille) en pixels
    const X = x => x0 + x * ech;
    const Y = y => y0 - y * ech;
    const OUVERTURE = 22;                  // demi-hauteur de la lentille (cm)
    const H_OBJET = 12;                    // hauteur de l'objet (cm)
    const X_ECRAN = 40;                    // position de la rétine (cm)
    const F_MIN = 15, F_MAX = 26;          // plage de distances focales du cristallin (cm)

    host.innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" class="optique-svg">
            <defs>
                <marker id="opt-pointe" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="5" markerHeight="5" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#333" />
                </marker>
                <marker id="opt-pointe-image" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="5" markerHeight="5" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#d9822b" />
                </marker>
            </defs>
            <line class="axe" x1="${X(-72)}" y1="${Y(0)}" x2="${X(72)}" y2="${Y(0)}" />
            <ellipse id="opt-corps" class="corps" cx="${X(0)}" cy="${Y(0)}" ry="${OUVERTURE * ech}" />
            <path class="lentille" d="M ${X(0)} ${Y(-OUVERTURE)} L ${X(0)} ${Y(OUVERTURE)}
                  M ${X(-3)} ${Y(OUVERTURE - 4)} L ${X(0)} ${Y(OUVERTURE)} L ${X(3)} ${Y(OUVERTURE - 4)}
                  M ${X(-3)} ${Y(-OUVERTURE + 4)} L ${X(0)} ${Y(-OUVERTURE)} L ${X(3)} ${Y(-OUVERTURE + 4)}" />
            <line class="ecran" x1="${X(X_ECRAN)}" y1="${Y(-26)}" x2="${X(X_ECRAN)}" y2="${Y(26)}" />
            <text x="${X(0)}" y="${Y(28)}" text-anchor="middle">cristallin</text>
            <text x="${X(X_ECRAN)}" y="${Y(28)}" text-anchor="middle">rétine</text>
            <polyline id="opt-r1" class="rayon" />
            <polyline id="opt-r2" class="rayon" />
            <polyline id="opt-r3" class="rayon" />
            <polyline id="opt-v1" class="virtuel" />
            <polyline id="opt-v2" class="virtuel" />
            <polyline id="opt-v3" class="virtuel" />
            <line id="opt-tache" class="tache" />
            <line id="opt-objet" class="objet" />
            <line id="opt-image" class="image" />
            <text id="opt-foyer" text-anchor="middle">F</text>
            <text id="opt-fp" text-anchor="middle">F'</text>
        </svg>
        <div class="optique-curseurs">
            <label>objet
                <input id="opt-obj" type="range" min="-65" max="-10" step="0.5" value="-45" />
            </label>
            <label>distance focale
                <input id="opt-focale" type="range" min="${F_MIN}" max="${F_MAX}" step="0.25" value="20" />
            </label>
        </div>`;

    const el = id => document.getElementById(id);
    const segment = (id, x1, y1, x2, y2) => {
        el(id).setAttribute('x1', X(x1)); el(id).setAttribute('y1', Y(y1));
        el(id).setAttribute('x2', X(x2)); el(id).setAttribute('y2', Y(y2));
    };
    const brisee = (id, points) => el(id).setAttribute('points',
        points.map(([x, y]) => `${X(x)},${Y(y)}`).join(' '));

    const dessine = () => {
        const xa = parseFloat(el('opt-obj').value);           // position de l'objet (< 0)
        const f = parseFloat(el('opt-focale').value);         // distance focale en cm
        const h = H_OBJET;

        // Position et taille de l'image par la relation de conjugaison
        const inverse = 1 / f + 1 / xa;
        const loin = Math.abs(inverse) < 1e-3;                // objet au foyer : image à l'infini
        const xap = loin ? Infinity : 1 / inverse;
        const hp = loin ? 0 : h * xap / xa;

        segment('opt-objet', xa, 0, xa, h);
        const demi = 2 + 180 * (1 / f - 1 / F_MAX);           // courte focale : cristallin plus bombé
        el('opt-corps').setAttribute('rx', demi * ech);
        el('opt-foyer').setAttribute('x', X(-f)); el('opt-foyer').setAttribute('y', Y(0) + 26);
        el('opt-fp').setAttribute('x', X(f)); el('opt-fp').setAttribute('y', Y(0) + 26);

        // Les trois rayons : hauteur sur la lentille, puis pente après la lentille
        const y3 = Math.abs(xa + f) < 1e-3 ? NaN : h * f / (xa + f);
        const rayons = [
            { id: 'opt-r1', v: 'opt-v1', yl: h, pente: -h / f },                 // parallèle → passe par F'
            { id: 'opt-r2', v: 'opt-v2', yl: 0, pente: h / xa },                 // passe par le centre
            { id: 'opt-r3', v: 'opt-v3', yl: y3, pente: 0 },                     // passe par F → ressort parallèle
        ];

        const hauteurs = [];
        rayons.forEach(({ id, v, yl, pente }) => {
            const visible = Number.isFinite(yl) && Math.abs(yl) <= OUVERTURE;
            el(id).style.display = visible ? '' : 'none';
            el(v).style.display = visible && !loin && xap < 0 ? '' : 'none';
            if (!visible) return;
            const ys = yl + pente * (X_ECRAN - 0);            // hauteur du rayon sur l'écran
            hauteurs.push(ys);
            brisee(id, [[xa, h], [0, yl], [X_ECRAN, ys]]);
            if (!loin && xap < 0) brisee(v, [[0, yl], [xap, hp]]);  // image virtuelle : prolongements
        });

        // Tache sur l'écran : écart entre les rayons là où ils frappent l'écran
        const tache = el('opt-tache');
        if (hauteurs.length) {
            segment('opt-tache', X_ECRAN, Math.min(...hauteurs), X_ECRAN, Math.max(...hauteurs));
            tache.style.display = '';
        } else {
            tache.style.display = 'none';
        }

        // Image, seulement si elle tient dans le champ
        const image = el('opt-image');
        if (!loin && Math.abs(xap) < 70 && Math.abs(hp) < 26) {
            segment('opt-image', xap, 0, xap, hp);
            image.style.display = '';
        } else {
            image.style.display = 'none';
        }
    };

    el('opt-obj').addEventListener('input', dessine);
    el('opt-focale').addEventListener('input', dessine);
    dessine();
}
