import { GENERATIONS, PER_GEN, REGION, proxy, runLoop, type Point, type Proposal } from './adaptive-loop';
import { MONO, TAU, color, dot, motion, onFrame, registerStage, requestDraw, stroke, type Draw } from './canvas-stage';

// Research page: adaptive search loop. Each generation animates the four steps: propose, simulate, score U(x), retrain.
const LOOP = runLoop();
const loop = { gen: 0, phase: 1, playing: false };
const VIEW = { x0: -3, x1: 3.6, y0: -2.6, y1: 3 };
const FOG = { cols: 48, rows: 40 };
const fogCache = new Map<string, HTMLCanvasElement>();
// U(x) rendered once per generation into a tiny canvas, then scaled up smoothly onto the map.
const fogFor = (count: number, tint: string) => {
  const key = `${count}|${tint}`;
  let fog = fogCache.get(key);
  if (fog) return fog;
  const history: Point[] = LOOP.slice(0, count).flatMap((g) => g.points);
  fog = document.createElement('canvas');
  fog.width = FOG.cols;
  fog.height = FOG.rows;
  const fctx = fog.getContext('2d');
  if (fctx && history.length) {
    fctx.fillStyle = tint;
    for (let r = 0; r < FOG.rows; r++) {
      for (let c = 0; c < FOG.cols; c++) {
        const x = VIEW.x0 + ((c + 0.5) / FOG.cols) * (VIEW.x1 - VIEW.x0);
        const y = VIEW.y1 - ((r + 0.5) / FOG.rows) * (VIEW.y1 - VIEW.y0);
        fctx.globalAlpha = proxy(history, x, y) * 0.32;
        fctx.fillRect(c, r, 1, 1);
      }
    }
  }
  fogCache.set(key, fog);
  return fog;
};
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

const drawLoop: Draw = (ctx, w, h) => {
  const { ink, accent, secondary } = color;
  const pad = 28;
  const scale = Math.min((w - 2 * pad) / (VIEW.x1 - VIEW.x0), (h - 2 * pad) / (VIEW.y1 - VIEW.y0));
  const mapW = (VIEW.x1 - VIEW.x0) * scale;
  const mapH = (VIEW.y1 - VIEW.y0) * scale;
  const left = (w - mapW) / 2;
  const top = (h - mapH) / 2;
  const X = (x: number) => left + (x - VIEW.x0) * scale;
  const Y = (y: number) => top + (VIEW.y1 - y) * scale;
  const { gen, phase } = loop;
  const current = LOOP[gen];

  // 3 · Proxy U(x) as fog, from everything simulated so far.
  ctx.globalAlpha = 1;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(fogFor(phase >= 0.5 ? gen + 1 : gen, accent), left, top, mapW, mapH);

  ctx.beginPath();
  ctx.rect(left, top, mapW, mapH);
  stroke(ctx, ink, 0.18);
  for (const r of [1, 2]) {
    ctx.beginPath();
    ctx.arc(X(0), Y(0), r * scale, 0, TAU);
    stroke(ctx, ink, 0.14, 1, [2, 4]);
  }
  ctx.beginPath();
  ctx.arc(X(REGION.x), Y(REGION.y), REGION.r * scale, 0, TAU);
  stroke(ctx, accent, 0.8, 1.2, [5, 4]);

  ctx.font = `11px ${MONO}`;
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.6;
  ctx.textAlign = 'right';
  ctx.fillText('x₁', left + mapW - 6, top + mapH - 8);
  ctx.textAlign = 'left';
  ctx.fillText('x₂', left + 6, top + 16);

  // Earlier generations stay as faint dots.
  for (const g of LOOP.slice(0, gen)) {
    for (const p of g.points) dot(ctx, X(p.x), Y(p.y), p.hit ? 2 : 1.5, p.hit ? accent : ink, p.hit ? 0.35 : 0.12);
  }
  // 1 · Propose (dots appear), then 2 · Simulate (DIS-like outcomes light up).
  const appear = Math.min(1, phase / 0.25);
  const simulated = phase >= 0.25;
  for (const p of current.points) {
    const hit = simulated && p.hit;
    dot(ctx, X(p.x), Y(p.y), hit ? 3.2 : 2.2, hit ? accent : ink, (hit ? 0.95 : 0.45) * appear);
  }

  // 4 · Retrain: the proposal slides to its next position; its past centres leave a trail.
  const u = Math.max(0, (phase - 0.75) / 0.25);
  const q: Proposal = phase < 0.75 ? current.proposal : {
    mx: lerp(current.proposal.mx, current.retrained.mx, u),
    my: lerp(current.proposal.my, current.retrained.my, u),
    s: lerp(current.proposal.s, current.retrained.s, u),
  };
  const trail = [...LOOP.slice(0, gen + 1).map((g) => g.proposal), q];
  ctx.beginPath();
  trail.forEach((c, i) => (i ? ctx.lineTo(X(c.mx), Y(c.my)) : ctx.moveTo(X(c.mx), Y(c.my))));
  stroke(ctx, secondary, 0.6, 1.2);
  trail.forEach((c) => dot(ctx, X(c.mx), Y(c.my), 2.4, secondary, 0.8));
  for (const r of [1, 2]) {
    ctx.beginPath();
    ctx.arc(X(q.mx), Y(q.my), r * q.s * scale, 0, TAU);
    stroke(ctx, secondary, r === 1 ? 0.75 : 0.4, 1.4);
  }
};

registerStage('loop-canvas', drawLoop);
onFrame((animated) => {
  if (animated && loop.phase < 1) loop.phase = Math.min(1, loop.phase + 0.0075);
  else if (!animated && loop.playing) loop.phase = 1;
  syncLoop();
  // Keep controls advancing even when the illustration is offscreen; draw a final frame after state changes.
  if (!document.hidden && (loop.playing || (animated && loop.phase < 1))) requestDraw();
});

// Controls: next / play / reset, the step list, the per-generation chart and a polite status line.
const nextButton = document.querySelector<HTMLButtonElement>('[data-loop="next"]');
const playButton = document.querySelector<HTMLButtonElement>('[data-loop="play"]');
const steps = [...document.querySelectorAll<HTMLElement>('[data-step]')];
const bars = [...document.querySelectorAll<HTMLElement>('[data-gen]')];
const status = document.querySelector<HTMLElement>('[data-loop-status]');
let shown = { step: -2, revealed: -2 };
const setPlaying = (on: boolean) => {
  loop.playing = on;
  playButton?.setAttribute('aria-pressed', String(on));
};
const startGeneration = (gen: number) => {
  loop.gen = gen;
  loop.phase = motion.matches ? 1 : 0;
};
// Called every frame from tick(); touches the DOM only when the visible step or chart changes.
function syncLoop() {
  if (loop.playing && loop.phase === 1) {
    if (loop.gen < GENERATIONS - 1) startGeneration(loop.gen + 1);
    else setPlaying(false);
  }
  const step = loop.phase === 1 ? -1 : Math.min(3, Math.floor(loop.phase * 4));
  const revealed = loop.phase >= 0.5 ? loop.gen : loop.gen - 1;
  if (step !== shown.step) steps.forEach((li, i) => (i === step ? li.setAttribute('aria-current', 'step') : li.removeAttribute('aria-current')));
  if (revealed !== shown.revealed) {
    bars.forEach((bar, i) => (bar.dataset.pending = String(i > revealed)));
    if (status && revealed >= 0) {
      status.textContent = (status.dataset.template ?? '').replace('{g}', String(revealed)).replace('{n}', String(LOOP[revealed].hits)).replace('{total}', String(PER_GEN));
    }
  }
  if (nextButton) nextButton.disabled = loop.gen >= GENERATIONS - 1 && loop.phase === 1;
  shown = { step, revealed };
}
nextButton?.addEventListener('click', () => {
  setPlaying(false);
  if (loop.phase < 1) loop.phase = 1;
  else if (loop.gen < GENERATIONS - 1) startGeneration(loop.gen + 1);
  requestDraw();
});
playButton?.addEventListener('click', () => {
  const on = !loop.playing;
  if (on && motion.matches) {
    loop.gen = GENERATIONS - 1;
    loop.phase = 1;
    setPlaying(false);
    requestDraw();
    return;
  }
  if (on && loop.gen >= GENERATIONS - 1 && loop.phase === 1) startGeneration(0);
  else if (on && loop.phase === 1) startGeneration(loop.gen + 1);
  setPlaying(on);
  requestDraw();
});
document.querySelector('[data-loop="reset"]')?.addEventListener('click', () => {
  setPlaying(false);
  loop.gen = 0;
  loop.phase = 1;
  requestDraw();
});
// Without JS every bar stays visible; with JS the chart starts at generation 0 and fills as the loop runs.
syncLoop();
