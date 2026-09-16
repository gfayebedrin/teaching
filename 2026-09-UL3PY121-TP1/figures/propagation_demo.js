/* Figure interactive : propagation d'une incertitude à travers une fonction affine f(x) = a x + b.
   Chargée par index.html via <div class="interactive" data-src="..."></div>. */

export default function propagationDemo(host) {
    const style = document.createElement('style');
    style.textContent = `
    .reveal .demo-svg {
        width: 85%;
        height: auto;
        display: block;
        margin: 0 auto;
    }

    .reveal .demo-svg .axe {
        stroke: #333;
        stroke-width: 2;
    }

    .reveal .demo-svg .courbe {
        stroke: #2f6fb3;
        stroke-width: 4;
    }

    .reveal .demo-svg .trait {
        stroke: #333;
        stroke-width: 2;
    }

    .reveal .demo-svg .pointille {
        stroke: #d9822b;
        stroke-width: 2.5;
        stroke-dasharray: 8 6;
    }

    .reveal .demo-svg .cote {
        stroke: #d9822b;
        stroke-width: 2.5;
        marker-start: url(#pd-pointe);
        marker-end: url(#pd-pointe);
    }

    .reveal .demo-svg .cote-label {
        fill: #d9822b;
    }

    .reveal .demo-svg .courbe-label {
        fill: #2f6fb3;
    }

    .reveal .demo-svg text {
        font-size: 22px;
        fill: #333;
    }

    .reveal .demo-slider {
        display: block;
        text-align: center;
        font-size: 0.6em;
        margin-top: 0.4em;
    }

    .reveal .demo-slider input {
        vertical-align: middle;
        margin-left: 0.5em;
        width: 40%;
    }`;
    document.head.appendChild(style);

    const W = 800, H = 430, M = { l: 60, r: 30, t: 20, b: 55 };
    const xmax = 2, ymax = 2.6;          // le repère commence en (0, 0)
    const xm = 1, u = 0.25, fm = 1.3;    // mesure, incertitude, et f(xm) fixé
    const X = x => M.l + x / xmax * (W - M.l - M.r);
    const Y = y => H - M.b - y / ymax * (H - M.t - M.b);
    const f = (x, a) => a * (x - xm) + fm;

    const ligne = (id, cls) => `<line id="${id}" class="${cls}" />`;
    host.innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" class="demo-svg">
            <defs>
                <marker id="pd-pointe" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#d9822b" />
                </marker>
            </defs>
            <line class="axe" x1="${X(0)}" y1="${Y(0)}" x2="${X(xmax)}" y2="${Y(0)}" />
            <line class="axe" x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(ymax)}" />
            <text class="axe-label" x="${X(xmax)}" y="${Y(0) + 34}" text-anchor="end">x</text>
            <text class="axe-label" x="${X(0) - 14}" y="${Y(ymax) + 6}" text-anchor="end">y</text>
            ${ligne('pd-f', 'courbe')}
            ${ligne('pd-vx', 'trait')}
            ${ligne('pd-vmin', 'pointille')}
            ${ligne('pd-vmax', 'pointille')}
            ${ligne('pd-hy', 'trait')}
            ${ligne('pd-hmin', 'pointille')}
            ${ligne('pd-hmax', 'pointille')}
            ${ligne('pd-ax', 'cote')}
            ${ligne('pd-ay', 'cote')}
            <text id="pd-tf" class="courbe-label" text-anchor="end">y = f(x)</text>
            <text class="cote-label" x="${X(xm + u / 2)}" y="${Y(0.16) - 12}" text-anchor="middle">u(x)</text>
            <text id="pd-ty" class="cote-label" x="${X(0.3)}" y="${Y(fm) + 8}" text-anchor="start">u(y)</text>
            <text class="mesure-label" x="${X(xm)}" y="${Y(0) + 34}" text-anchor="middle">xₘ</text>
            <text class="mesure-label" x="${X(0) - 14}" y="${Y(fm) + 8}" text-anchor="end">yₘ</text>
        </svg>
        <div class="demo-slider">
            <input id="pd-pente" type="range" min="0.2" max="3" step="0.05" value="1" />
        </div>`;

    const set = (id, x1, y1, x2, y2) => {
        const el = document.getElementById(id);
        el.setAttribute('x1', X(x1)); el.setAttribute('y1', Y(y1));
        el.setAttribute('x2', X(x2)); el.setAttribute('y2', Y(y2));
    };
    const dessine = () => {
        const a = parseFloat(document.getElementById('pd-pente').value);
        const xg = Math.max(0, xm - fm / a), xd = Math.min(xmax, xm + (ymax - fm) / a);
        set('pd-f', xg, f(xg, a), xd, f(xd, a));
        const etiquette = document.getElementById('pd-tf');
        etiquette.setAttribute('x', X(xd) - 8);
        etiquette.setAttribute('y', Math.max(Y(f(xd, a)) - 14, 26));
        set('pd-vx', xm, 0, xm, fm);
        set('pd-vmin', xm - u, 0, xm - u, f(xm - u, a));
        set('pd-vmax', xm + u, 0, xm + u, f(xm + u, a));
        set('pd-hy', 0, fm, xm, fm);
        set('pd-hmin', 0, f(xm - u, a), xm - u, f(xm - u, a));
        set('pd-hmax', 0, f(xm + u, a), xm + u, f(xm + u, a));
        set('pd-ax', xm, 0.16, xm + u, 0.16);
        set('pd-ay', 0.22, fm, 0.22, f(xm + u, a));
        document.getElementById('pd-ty').setAttribute('y', Y((fm + f(xm + u, a)) / 2) + 8);
    };
    document.getElementById('pd-pente').addEventListener('input', dessine);
    dessine();
}
