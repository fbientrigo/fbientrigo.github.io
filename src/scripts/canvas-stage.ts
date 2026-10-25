// Shared canvas engine for the site's schematic drawings (not data or simulation output).
// Each stage draws only while on screen; animation stops for prefers-reduced-motion and hidden tabs.
export type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
interface Stage { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; w: number; h: number; dpr: number; visible: boolean; draw: Draw }

export const TAU = Math.PI * 2;
// Plex Mono ships no Greek subset; σ/θ fall back to a named system mono instead of an arbitrary one.
export const MONO = '"IBM Plex Mono", ui-monospace, Consolas, "DejaVu Sans Mono", monospace';
export const motion = matchMedia('(prefers-reduced-motion: reduce)');
export const pointer = { x: 0.55, y: 0.45, tx: 0.55, ty: 0.45 };
export const color = { ink: '', paper: '', accent: '', secondary: '' };
export const clock = { t: 0 };

const readColors = () => {
  const css = getComputedStyle(document.documentElement);
  for (const key of Object.keys(color) as (keyof typeof color)[]) color[key] = css.getPropertyValue(`--${key}`).trim();
};

export const stroke = (ctx: CanvasRenderingContext2D, style: string, alpha: number, width = 1, dash: number[] = []) => {
  ctx.strokeStyle = style;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.stroke();
  ctx.setLineDash([]);
};
export const fill = (ctx: CanvasRenderingContext2D, style: string, alpha: number) => {
  ctx.fillStyle = style;
  ctx.globalAlpha = alpha;
  ctx.fill();
};
export const dot = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, style: string, alpha: number) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  fill(ctx, style, alpha);
};
export const cubic = (p: number[], u: number) => {
  const v = 1 - u;
  return v * v * v * p[0] + 3 * v * v * u * p[1] + 3 * v * u * u * p[2] + u * u * u * p[3];
};

// Render loop: one rAF while anything visible animates; otherwise single redraws on demand.
const stages = new Map<Element, Stage>();
let frame = 0;
const frameHooks: ((animated: boolean) => void)[] = [];
/** Runs once per frame before drawing; `animated` is false under prefers-reduced-motion. */
export const onFrame = (hook: (animated: boolean) => void) => frameHooks.push(hook);
const animating = () => !motion.matches && !document.hidden && [...stages.values()].some((s) => s.visible);
const tick = () => {
  frame = 0;
  if (motion.matches) {
    pointer.x = pointer.tx;
    pointer.y = pointer.ty;
  } else {
    clock.t += 0.011;
    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;
  }
  for (const hook of frameHooks) hook(!motion.matches);
  for (const s of stages.values()) {
    if (!s.visible || !s.w) continue;
    s.ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
    s.ctx.clearRect(0, 0, s.w, s.h);
    s.draw(s.ctx, s.w, s.h);
    s.ctx.globalAlpha = 1;
  }
  if (animating() && !frame) frame = requestAnimationFrame(tick);
};
export const requestDraw = () => {
  if (!frame) frame = requestAnimationFrame(tick);
};

const visibility = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const stage = stages.get(entry.target);
    if (stage) stage.visible = entry.isIntersecting;
  }
  requestDraw();
});
const sizes = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const stage = stages.get(entry.target);
    if (!stage) continue;
    stage.w = entry.contentRect.width;
    stage.h = entry.contentRect.height;
    stage.dpr = Math.min(2, devicePixelRatio || 1);
    stage.canvas.width = Math.round(stage.w * stage.dpr);
    stage.canvas.height = Math.round(stage.h * stage.dpr);
  }
  requestDraw();
});

/** Attach a draw function to a canvas by id; it redraws while visible and on resize or theme change. */
export const registerStage = (id: string, draw: Draw) => {
  const canvas = document.getElementById(id);
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  stages.set(canvas, { canvas, ctx, w: 0, h: 0, dpr: 1, visible: false, draw });
  visibility.observe(canvas);
  sizes.observe(canvas);
};

readColors();
new MutationObserver(() => {
  readColors();
  requestDraw();
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
motion.addEventListener('change', requestDraw);
document.addEventListener('visibilitychange', requestDraw);
document.fonts.load(`10px ${MONO}`).then(requestDraw, requestDraw);
addEventListener('pointermove', (event) => {
  pointer.tx = event.clientX / Math.max(1, innerWidth);
  pointer.ty = event.clientY / Math.max(1, innerHeight);
  if (motion.matches) requestDraw();
}, { passive: true });

