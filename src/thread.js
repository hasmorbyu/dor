// The Dor — a single persistent SVG path, present on every screen, that
// gains a mark at each milestone and, at the finale, morphs itself (the
// same path element, not a swapped-in asset) into a tied bow.
import { reducedMotion } from './utils.js';

const VB_W = 1000;
const VB_H = 200;

// 11 anchor points -> 10 cubic-bezier segments via Catmull-Rom smoothing.
const WAVE_POINTS = [
  [10, 100], [108, 70], [206, 128], [304, 72], [402, 126],
  [500, 78], [598, 124], [696, 74], [794, 122], [892, 76], [990, 100],
];

// Same point count, traced as a bow-tie/ribbon knot so the morph is a
// straightforward point-for-point interpolation, not a shape swap.
const BOW_POINTS = [
  [500, 150], [500, 100], [320, 40], [212, 100], [320, 160],
  [500, 100], [680, 40], [788, 100], [680, 160], [500, 100], [500, 150],
];

const MARK_STYLE = {
  knot: { kind: 'knot' },
  loop: { kind: 'loop' },
  bead: { kind: 'bead' },
  stitch: { kind: 'stitch' },
  charm: { kind: 'charm' },
  finalKnot: { kind: 'knot' },
  star: { kind: 'star' },
};

// Where along the thread (0..1) each mark tends to land, spread out so they
// don't stack on top of one another as the story progresses.
const MARK_FRACTION = {
  knot: 0.14,
  loop: 0.28,
  bead: 0.42,
  stitch: 0.56,
  charm: 0.7,
  finalKnot: 0.84,
  star: 0.92,
};

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpPoints(a, b, t) {
  return a.map((p, i) => [lerp(p[0], b[i][0], t), lerp(p[1], b[i][1], t)]);
}

function catmullRomPath(pts) {
  let d = `M ${pts[0][0]},${pts[0][1]} `;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]} `;
  }
  return d.trim();
}

class Thread {
  constructor() {
    this.marksLayer = null;
    this.path = null;
    this.svg = null;
    this.shell = null;
    this.currentPoints = WAVE_POINTS.map((p) => [...p]);
  }

  mount(root) {
    root.innerHTML = `
      <div class="thread-shell" data-state="bar">
        <svg class="thread-svg" viewBox="0 0 ${VB_W} ${VB_H}" preserveAspectRatio="none" aria-hidden="true">
          <path class="thread-highlight" d="" fill="none"/>
          <path class="thread-spine" d="" fill="none"/>
          <g class="thread-marks"></g>
        </svg>
      </div>
    `;
    this.shell = root.querySelector('.thread-shell');
    this.svg = root.querySelector('.thread-svg');
    this.path = root.querySelector('.thread-spine');
    this.highlight = root.querySelector('.thread-highlight');
    this.marksLayer = root.querySelector('.thread-marks');

    const d = catmullRomPath(this.currentPoints);
    this.path.setAttribute('d', d);
    this.highlight.setAttribute('d', d);

    this.drawIn();
  }

  drawIn() {
    const len = this.path.getTotalLength();
    if (reducedMotion()) {
      this.path.style.strokeDasharray = 'none';
      this.highlight.style.opacity = '1';
      return;
    }
    this.path.style.strokeDasharray = `${len}`;
    this.path.style.strokeDashoffset = `${len}`;
    this.highlight.style.strokeDasharray = `${len}`;
    this.highlight.style.strokeDashoffset = `${len}`;
    // force a layout flush so the transition actually animates from the set values
    // eslint-disable-next-line no-unused-expressions
    this.path.getBoundingClientRect();
    this.path.style.transition = 'stroke-dashoffset 900ms ease-out';
    this.highlight.style.transition = 'stroke-dashoffset 900ms ease-out 60ms';
    requestAnimationFrame(() => {
      this.path.style.strokeDashoffset = '0';
      this.highlight.style.strokeDashoffset = '0';
    });
  }

  addMark(id) {
    if (!this.path || !MARK_STYLE[id]) return;
    const len = this.path.getTotalLength();
    const frac = MARK_FRACTION[id] ?? 0.5;
    const pt = this.path.getPointAtLength(len * frac);
    const { kind } = MARK_STYLE[id];
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    el.setAttribute('class', `thread-mark thread-mark--${kind}`);
    el.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
    el.innerHTML = markMarkup(kind);
    if (!reducedMotion()) el.classList.add('thread-mark--pop');
    this.marksLayer.appendChild(el);
  }

  hasMark(id) {
    return !!this.marksLayer?.querySelector(`.thread-mark--${MARK_STYLE[id]?.kind}`);
  }

  async morphToBow({ onDone } = {}) {
    this.shell.dataset.state = 'finale';
    const from = this.currentPoints.map((p) => [...p]);
    const to = BOW_POINTS;

    if (reducedMotion()) {
      this.path.setAttribute('d', catmullRomPath(to));
      this.highlight.style.opacity = '0';
      this.marksLayer.style.opacity = '0';
      this.currentPoints = to.map((p) => [...p]);
      onDone?.();
      return;
    }

    this.highlight.style.transition = 'opacity 500ms ease-out';
    this.highlight.style.opacity = '0';
    this.marksLayer.style.transition = 'opacity 500ms ease-out';
    this.marksLayer.style.opacity = '0';

    const duration = 1400;
    const start = performance.now();
    return new Promise((resolve) => {
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic
        const pts = lerpPoints(from, to, eased);
        this.path.setAttribute('d', catmullRomPath(pts));
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          this.currentPoints = to.map((p) => [...p]);
          onDone?.();
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });
  }

  reset() {
    if (!this.marksLayer) return;
    this.marksLayer.innerHTML = '';
    this.currentPoints = WAVE_POINTS.map((p) => [...p]);
    this.shell.dataset.state = 'bar';
    const d = catmullRomPath(this.currentPoints);
    this.path.style.transition = 'none';
    this.highlight.style.transition = 'none';
    this.path.style.strokeDasharray = 'none';
    this.highlight.style.strokeDasharray = 'none';
    this.highlight.style.opacity = '1';
    this.path.setAttribute('d', d);
    this.highlight.setAttribute('d', d);
  }
}

function markMarkup(kind) {
  switch (kind) {
    case 'knot':
      return `<circle r="7.5" fill="none" stroke="var(--maroon)" stroke-width="3"/><circle r="2.4" fill="var(--maroon)"/>`;
    case 'loop':
      return `<path d="M-9,-5 C-9,-14 9,-14 9,-5 C9,4 -6,4 -6,-2" fill="none" stroke="var(--crayon-red)" stroke-width="3" stroke-linecap="round"/>`;
    case 'bead':
      return `<circle r="6" fill="var(--crayon-yellow)" stroke="var(--maroon)" stroke-width="1.6"/>`;
    case 'stitch':
      return `<path d="M-14,0 L14,0" stroke="var(--crayon-red)" stroke-width="4" stroke-dasharray="4 4" stroke-linecap="round"/>`;
    case 'charm':
      return `<path d="M0,-4 L4,4 L-4,4 Z" fill="var(--crayon-green)" stroke="var(--maroon)" stroke-width="1.2"/>`;
    case 'star':
      return `<path d="M0,-7 L2,-2 L7,-2 L3,1 L4.5,6.5 L0,3.4 L-4.5,6.5 L-3,1 L-7,-2 L-2,-2 Z" fill="var(--crayon-yellow)" stroke="var(--maroon)" stroke-width="0.8"/>`;
    default:
      return '';
  }
}

export const thread = new Thread();
