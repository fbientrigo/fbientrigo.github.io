// Home-page canvases: the normalizing-flow sketch, the interactive muon shield and one helper graph per featured project.
import { MONO, TAU, clock, color, cubic, dot, fill, pointer, registerStage, requestDraw, stroke, type Draw } from './canvas-stage';
import { ANGLE, FIELD, MOMENTUM, SHIELD, VESSEL, background, backgroundRolls, disCounts, disOf, newRoll, reaches, xAt, type Dis, type Muon, type Roll } from './muon-shield';

let glyph = document.querySelector<HTMLElement>('.work-item')?.dataset.glyph ?? 'tracks';

// 01 · Normalizing flow: Gaussian base → two coupling layers → bimodal tail target.
const FLOW_LABELS = ['z₀ ~ N(0,I)', 'f₁ (s_θ, t_θ)', 'f₂ (affine)', 'q_θ(x) tail'];
const drawFlow: Draw = (ctx, w, h) => {
  const { t } = clock;
  const { ink, accent, secondary } = color;
  const cols = [0.08, 0.36, 0.64, 0.92].map((f) => 16 + (w - 32) * f);
  const cy = h * 0.53;
  const hh = h * 0.4;
  ctx.font = `10px ${MONO}`;
  ctx.textAlign = 'center';
  cols.forEach((x, i) => {
    ctx.beginPath();
    ctx.moveTo(x, cy - hh);
    ctx.lineTo(x, cy + hh);
    stroke(ctx, ink, 0.14, 1, [3, 3]);
    ctx.fillStyle = ink;
    ctx.globalAlpha = 0.55;
    ctx.fillText(FLOW_LABELS[i], x, cy - hh - 10);
  });
  for (let i = 0; i < 18; i++) {
    const u = (i / 17) * 2 - 1;
    const sign = u >= 0 ? 1 : -1;
    const tail = Math.abs(u) > 0.42;
    const ys = [
      cy + u * hh * 0.72,
      cy + (u * 0.85 + 0.18 * Math.sin(u * 2.5 + t)) * hh * 0.78 + (pointer.y - 0.5) * 11,
      cy + (sign * 0.48 + u * 0.42) * hh * 0.85 + Math.cos(t + i * 0.4) * 5,
      cy + (sign * 0.62 + u * 0.25) * hh * 0.88,
    ];
    ctx.beginPath();
    ctx.moveTo(cols[0], ys[0]);
    for (let k = 1; k < 4; k++) {
      const mx = (cols[k - 1] + cols[k]) / 2;
      ctx.bezierCurveTo(mx, ys[k - 1], mx, ys[k], cols[k], ys[k]);
    }
    stroke(ctx, tail ? accent : secondary, tail ? 0.72 : 0.26, tail ? 1.45 : 0.95);
    cols.forEach((x, k) => dot(ctx, x, ys[k], k === 3 && tail ? 2.8 : 1.8, tail ? accent : secondary, tail ? 0.88 : 0.45));
    if (tail) {
      const progress = ((t * 0.45 + i * 0.13) % 1) * 3;
      const seg = Math.min(2, Math.floor(progress));
      const s = progress - seg;
      dot(ctx, cols[seg] + (cols[seg + 1] - cols[seg]) * s, ys[seg] + (ys[seg + 1] - ys[seg]) * s, 2.5, accent, 0.95);
    }
  }
};

// 02 · Muon shield. Background muons bend by charge and momentum; the visitor steers a probe muon
// with the pointer (or the sliders) and can change the field strength.
const muons = background();
const probe: Muon = { p: 120, theta: 0, q: 1 };
const rolls = backgroundRolls();
let probeRoll: Roll = { u: 0.1, uz: 0.6, angles: [0.8, 0.25, 0.65, 0.4] };
let field = FIELD.default;
const Z_END = 54;
const X_RANGE = 9;
const trackPath = (ctx: CanvasRenderingContext2D, m: Muon, X: (z: number) => number, Y: (x: number) => number) => {
  ctx.beginPath();
  for (let z = 0; z <= Z_END; z += 1) {
    const x = xAt(m, field, z);
    if (z === 0) ctx.moveTo(X(z), Y(x));
    else ctx.lineTo(X(z), Y(x));
    if (Math.abs(x) > X_RANGE * 1.2) break;
  }
};

// Secondaries from a DIS vertex, drawn up to depth zEnd. Charged hadrons that land in the window are the dangerous ones.
const drawProducts = (ctx: CanvasRenderingContext2D, dis: Dis, zEnd: number, X: (z: number) => number, Y: (x: number) => number, alpha: number, width: number) => {
  const { ink, accent, secondary } = color;
  const end = Math.min(zEnd, SHIELD.detector);
  if (end <= dis.z) return;
  for (const q of dis.products) {
    const xAtEnd = dis.x + (dis.slope + q.angle) * (end - dis.z);
    const lands = Math.abs(dis.x + (dis.slope + q.angle) * (SHIELD.detector - dis.z)) <= SHIELD.window;
    ctx.beginPath();
    ctx.moveTo(X(dis.z), Y(dis.x));
    ctx.lineTo(X(end), Y(xAtEnd));
    if (!q.charged) stroke(ctx, ink, 0.35 * alpha, 1, [3, 4]);
    else if (q.kind === 'muon') stroke(ctx, secondary, 0.9 * alpha, width);
    else stroke(ctx, lands ? accent : ink, (lands ? 0.95 : 0.55) * alpha, lands ? width + 0.6 : width);
  }
};

const drawShield: Draw = (ctx, w, h) => {
  const { t } = clock;
  const { ink, accent, secondary } = color;
  const panH = h - 36;
  const cy = panH / 2;
  const X = (z: number) => w * (0.04 + (0.92 * z) / Z_END);
  const Y = (x: number) => cy - (x / X_RANGE) * (panH / 2 - 12);

  // Shield body, with the field strength as fill.
  ctx.fillStyle = secondary;
  ctx.globalAlpha = 0.05 + 0.1 * (field / FIELD.max);
  ctx.fillRect(X(SHIELD.start), Y(X_RANGE), X(SHIELD.end) - X(SHIELD.start), Y(-X_RANGE) - Y(X_RANGE));
  ctx.beginPath();
  ctx.rect(X(SHIELD.start), Y(X_RANGE), X(SHIELD.end) - X(SHIELD.start), Y(-X_RANGE) - Y(X_RANGE));
  stroke(ctx, secondary, 0.35);
  ctx.font = `11px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.6;
  ctx.fillText(`B = ${field.toFixed(1)} T`, (X(SHIELD.start) + X(SHIELD.end)) / 2, Y(X_RANGE) + 16);

  // Gas vessel after the shield: walls are dashed; DIS happens in the gas or on the walls.
  ctx.beginPath();
  ctx.rect(X(VESSEL.start), Y(VESSEL.half), X(VESSEL.end) - X(VESSEL.start), Y(-VESSEL.half) - Y(VESSEL.half));
  stroke(ctx, ink, 0.3, 1, [5, 4]);

  // Target and detector plane; the window is the acceptance.
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.8;
  ctx.fillRect(X(0) - 4, Y(0.6), 8, Y(-0.6) - Y(0.6));
  ctx.beginPath();
  ctx.moveTo(X(SHIELD.detector), Y(X_RANGE));
  ctx.lineTo(X(SHIELD.detector), Y(-X_RANGE));
  stroke(ctx, ink, 0.2, 1, [3, 4]);
  ctx.beginPath();
  ctx.moveTo(X(SHIELD.detector), Y(SHIELD.window));
  ctx.lineTo(X(SHIELD.detector), Y(-SHIELD.window));
  stroke(ctx, accent, 0.9, 4);

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, w, panH);
  ctx.clip();
  muons.forEach((m, i) => {
    const hit = reaches(m, field);
    trackPath(ctx, m, X, Y);
    stroke(ctx, hit ? accent : ink, hit ? 0.75 : 0.13, hit ? 1.4 : 0.9);
    if (hit) {
      const z = ((t * 0.35 + i / muons.length) % 1) * SHIELD.detector;
      dot(ctx, X(z), Y(xAt(m, field, z)), 2.4, accent, 0.9);
    }
    const dis = disOf(m, field, rolls[i]);
    if (dis) {
      if (dis.dangerous) drawProducts(ctx, dis, SHIELD.detector, X, Y, 0.7, 1);
      ctx.beginPath();
      ctx.arc(X(dis.z), Y(dis.x), 3.2, 0, TAU);
      stroke(ctx, dis.dangerous ? accent : ink, dis.dangerous ? 0.95 : 0.45, 1.2);
    }
  });
  const probeHit = reaches(probe, field);
  trackPath(ctx, probe, X, Y);
  stroke(ctx, probeHit ? accent : secondary, 0.95, 2.6);
  const z = ((t * 0.5) % 1) * Z_END;
  dot(ctx, X(z), Y(xAt(probe, field, z)), 4, probeHit ? accent : secondary, 1);
  const probeDis = disOf(probe, field, probeRoll);
  if (probeDis && z > probeDis.z) {
    drawProducts(ctx, probeDis, z, X, Y, 1, 1.8);
    ctx.beginPath();
    ctx.arc(X(probeDis.z), Y(probeDis.x), 5 + 3 * Math.sin(t * 6), 0, TAU);
    stroke(ctx, accent, 0.9, 1.6);
  } else if (probeDis) {
    ctx.beginPath();
    ctx.arc(X(probeDis.z), Y(probeDis.x), 4, 0, TAU);
    stroke(ctx, accent, 0.5, 1.2, [2, 3]);
  }
  ctx.restore();
};

// Controls: sliders are the accessible source of truth; the pointer over the drawing drives them too.
const shieldCanvas = document.getElementById('shield-canvas');
const pSlider = document.querySelector<HTMLInputElement>('#probe-p');
const thetaSlider = document.querySelector<HTMLInputElement>('#probe-theta');
const fieldSlider = document.querySelector<HTMLInputElement>('#shield-field');
const chargeButtons = document.querySelectorAll<HTMLButtonElement>('[data-charge]');
const probeOut = document.querySelector<HTMLElement>('[data-probe-readout]');
const escapesOut = document.querySelector<HTMLElement>('[data-escapes-readout]');
const funnelOut = document.querySelector<HTMLElement>('[data-funnel-readout]');
const rerollButton = document.querySelector<HTMLButtonElement>('[data-reroll]');
const sliderText = () => {
  pSlider?.setAttribute('aria-valuetext', `${Math.round(probe.p)} GeV/c`);
  thetaSlider?.setAttribute('aria-valuetext', `${Math.round(probe.theta * 1000)} mrad`);
  fieldSlider?.setAttribute('aria-valuetext', `${field.toFixed(1)} T`);
};
const updateShield = () => {
  if (probeOut) {
    const verdict = reaches(probe, field) ? probeOut.dataset.reaches : probeOut.dataset.swept;
    const dis = disOf(probe, field, probeRoll);
    const d = probeOut.dataset;
    const disText = dis ? `${d.disYes}, ${dis.dangerous ? d.dangerYes : d.dangerNo}` : d.disNo;
    probeOut.textContent = `μ${probe.q > 0 ? '⁺' : '⁻'} · ${Math.round(probe.p)} GeV/c · ${Math.round(probe.theta * 1000)} mrad → ${verdict} · ${disText}`;
    probeOut.dataset.hit = String(reaches(probe, field));
  }
  if (escapesOut) {
    const n = muons.filter((m) => reaches(m, field)).length;
    escapesOut.textContent = (escapesOut.dataset.template ?? '').replace('{n}', String(n)).replace('{total}', String(muons.length));
  }
  if (funnelOut) {
    const { dis, dangerous } = disCounts(field);
    funnelOut.textContent = (funnelOut.dataset.template ?? '').replace('{dis}', String(dis)).replace('{total}', String(muons.length)).replace('{danger}', String(dangerous));
  }
  sliderText();
  requestDraw();
};
const setCharge = (q: 1 | -1) => {
  probe.q = q;
  chargeButtons.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.charge) === q)));
  updateShield();
};
pSlider?.addEventListener('input', () => {
  probe.p = Number(pSlider.value);
  updateShield();
});
thetaSlider?.addEventListener('input', () => {
  probe.theta = Number(thetaSlider.value) / 1000;
  updateShield();
});
fieldSlider?.addEventListener('input', () => {
  field = Number(fieldSlider.value);
  updateShield();
});
rerollButton?.addEventListener('click', () => {
  probeRoll = newRoll(Math.random);
  updateShield();
});
chargeButtons.forEach((b) => b.addEventListener('click', () => setCharge(Number(b.dataset.charge) === 1 ? 1 : -1)));
// Pointer: left→right raises p on a log scale, up/down sets the launch angle; a tap or click flips the charge.
const aim = (event: PointerEvent) => {
  if (!(shieldCanvas instanceof HTMLElement)) return;
  const box = shieldCanvas.getBoundingClientRect();
  const fx = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
  const fy = Math.min(1, Math.max(0, (event.clientY - box.top) / (box.height - 36)));
  probe.p = MOMENTUM.min * (MOMENTUM.max / MOMENTUM.min) ** fx;
  probe.theta = ((0.5 - fy) * 2 * ANGLE.max) / 1000;
  if (pSlider) pSlider.value = String(Math.round(probe.p));
  if (thetaSlider) thetaSlider.value = String(Math.round(probe.theta * 1000));
  updateShield();
};
shieldCanvas?.addEventListener('pointermove', aim);
shieldCanvas?.addEventListener('pointerdown', aim);
// Only a mouse click flips the charge; on touch a tap just aims (the μ⁺/μ⁻ buttons flip it).
shieldCanvas?.addEventListener('click', (event) => {
  if ((event as PointerEvent).pointerType === 'mouse') setCharge(probe.q === 1 ? -1 : 1);
});
registerStage('shield-canvas', drawShield);
updateShield();

// 03 · One helper graph per featured project glyph, drawn in a 460×300 box scaled to fit.
const NOTES = [
  // Generic placeholders taken from labos.json wording; no measurements or validation claims.
  { dx: -155, dy: -95, rot: -0.24, col: 0, row: 0, tag: 'note', label: 'bench note' },
  { dx: -130, dy: 10, rot: 0.19, col: 0, row: 1, tag: 'setup', label: 'setup config' },
  { dx: -160, dy: 90, rot: -0.15, col: 0, row: 2, tag: 'checkpoint', label: 'Obsidian note' },
  { dx: -65, dy: -80, rot: 0.22, col: 1, row: 0, tag: 'device', label: 'device compare' },
  { dx: -50, dy: 35, rot: -0.2, col: 1, row: 1, tag: 'ledger', label: 'SQLite session' },
  { dx: -70, dy: 105, rot: 0.14, col: 1, row: 2, tag: 'report', label: 'session report' },
];
const STORY = [0, 1, 3, 4, 2, 5];

const drawContours = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
  const { t } = clock;
  for (let ring = 1; ring <= 6; ring++) {
    ctx.beginPath();
    for (let a = 0; a <= 64; a++) {
      const theta = (a / 64) * TAU;
      const rad = ring * 24 + Math.sin(theta * 2 + t) * 16 * (pointer.x - 0.3);
      ctx.lineTo(cx + Math.cos(theta) * rad * 1.3, cy + Math.sin(theta) * rad * 0.75);
    }
    ctx.closePath();
    stroke(ctx, ring <= 2 ? color.accent : color.ink, ring <= 2 ? 0.65 : 0.16, ring === 2 ? 1.6 : 1);
  }
};

const drawHistogram = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
  const bins = 15;
  const binW = 21;
  const left = cx - (bins * binW) / 2;
  const base = cy + 88;
  ctx.strokeStyle = color.ink;
  ctx.globalAlpha = 0.28;
  ctx.lineWidth = 1;
  for (let b = 0; b < bins; b++) {
    const z = (b - 7) / 2.6;
    const height = Math.exp(-0.5 * z * z) * 135;
    ctx.strokeRect(left + b * binW + 2, base - height, binW - 4, height);
  }
  ctx.beginPath();
  for (let s = 0; s <= 80; s++) {
    const z = (s / 80 - 0.5) * 5.2;
    ctx.lineTo(left + (s / 80) * bins * binW, base - Math.exp(-0.5 * z * z) * 142);
  }
  stroke(ctx, color.accent, 0.88, 2.1);
};

const drawNotes = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
  const { t } = clock;
  const { ink, paper, accent, secondary } = color;
  const slots = NOTES.map((note, i) => {
    const rx = cx + note.dx + Math.sin(t * 0.9 + i) * 3;
    const ry = cy + note.dy + Math.cos(t * 0.8 + i) * 3;
    const sx = cx + 24 + note.col * 128;
    const sy = cy - 82 + note.row * 82;
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(note.rot);
    ctx.beginPath();
    ctx.rect(-26, -18, 52, 36);
    fill(ctx, paper, 0.85);
    stroke(ctx, ink, 0.22);
    ctx.beginPath();
    ctx.moveTo(-18, -6);
    ctx.lineTo(14, -6);
    ctx.moveTo(-18, 2);
    ctx.lineTo(8, 2);
    stroke(ctx, ink, 0.25);
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(rx + 22, ry);
    ctx.bezierCurveTo((rx + sx) / 2, ry, (rx + sx) / 2, sy, sx - 50, sy);
    stroke(ctx, secondary, 0.22, 1, [3, 3]);
    ctx.beginPath();
    ctx.rect(sx - 50, sy - 22, 100, 44);
    fill(ctx, paper, 0.96);
    stroke(ctx, ink, 0.32, 1.1);
    if (workScale < 0.85) return { x: sx, y: sy }; // text would render below ~8px
    ctx.textAlign = 'left';
    ctx.font = `9.5px ${MONO}`;
    ctx.fillStyle = secondary;
    ctx.globalAlpha = 0.92;
    ctx.fillText(note.tag, sx - 42, sy - 5);
    ctx.font = `8.8px ${MONO}`;
    ctx.fillStyle = ink;
    ctx.globalAlpha = 0.78;
    ctx.fillText(note.label, sx - 42, sy + 11);
    return { x: sx, y: sy };
  });
  const path = STORY.map((i) => slots[i]);
  ctx.beginPath();
  path.forEach((pt, step) => {
    if (step === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.bezierCurveTo(path[step - 1].x + 28, path[step - 1].y, pt.x - 28, pt.y, pt.x, pt.y);
  });
  stroke(ctx, accent, 0.88, 2.2);
  path.forEach((pt) => dot(ctx, pt.x, pt.y, 3.6, accent, 1));
  const progress = (t * 0.55) % (path.length - 1);
  const seg = Math.floor(progress);
  const [a, b] = [path[seg], path[seg + 1]];
  const u = progress - seg;
  const px = cubic([a.x, a.x + 28, b.x - 28, b.x], u);
  const py = cubic([a.y, a.y, b.y, b.y], u);
  dot(ctx, px, py, 5.5, accent, 0.28);
  dot(ctx, px, py, 2.8, accent, 1);
};

const drawConstellation = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
  const { t } = clock;
  for (let n = 0; n < 12; n++) {
    const angle = (n / 12) * TAU + t * 0.14;
    const rad = n % 2 === 0 ? 108 : 66;
    const x = cx + Math.cos(angle) * rad;
    const y = cy + Math.sin(angle) * rad;
    const hit = n === 0;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    stroke(ctx, hit ? color.accent : color.ink, hit ? 0.85 : 0.18, hit ? 1.9 : 0.9);
    dot(ctx, x, y, hit ? 4.5 : 2.5, hit ? color.accent : color.ink, hit ? 0.95 : 0.38);
  }
};

const WORK_DRAWS: Partial<Record<string, typeof drawConstellation>> = { tracks: drawContours, histogram: drawHistogram, pulse: drawNotes };
let workScale = 1;
const drawWork: Draw = (ctx, w, h) => {
  workScale = Math.min(1, w / 460, h / 300);
  ctx.translate((w - 460 * workScale) / 2, (h - 300 * workScale) / 2);
  ctx.scale(workScale, workScale);
  (WORK_DRAWS[glyph] ?? drawConstellation)(ctx, 239, 144);
};

registerStage('flow-canvas', drawFlow);
registerStage('work-canvas', drawWork);

// 03 project list: disclosure buttons pick the graph; hover only previews it.
const items = [...document.querySelectorAll<HTMLElement>('.work-item')];
const caption = document.querySelector('[data-work-caption]');
const preview = (item: HTMLElement) => {
  glyph = item.dataset.glyph ?? 'tracks';
  if (caption) caption.textContent = item.dataset.caption ?? '';
  requestDraw();
};
const activate = (active: HTMLElement) => {
  for (const item of items) {
    const on = item === active;
    item.dataset.active = String(on);
    const button = item.querySelector('button');
    button?.setAttribute('aria-expanded', String(on));
    const body = document.getElementById(button?.getAttribute('aria-controls') ?? '');
    if (body) body.hidden = !on;
  }
  preview(active);
};
for (const item of items) {
  item.querySelector('button')?.addEventListener('click', () => activate(item));
  item.addEventListener('pointerenter', () => preview(item));
}
const list = document.querySelector('[data-works]');
list?.addEventListener('pointerleave', () => {
  const active = items.find((item) => item.dataset.active === 'true');
  if (active) preview(active);
});
if (items[0]) activate(items[0]);
