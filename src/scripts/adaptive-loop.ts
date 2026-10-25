// Toy version of the adaptive search loop on a schematic 2D phase space (x₁, x₂).
// A Gaussian proposal stands in for the normalizing flow. Seeded, so build checks can pin the numbers.

import { gaussian, seeded } from './random';

export const REGION = { x: 1.8, y: 1.2, r: 0.8 }; // DIS-like region; the sampler never reads it directly
export const PER_GEN = 100;
export const GENERATIONS = 6;
const BASE_SHARE = 0.2; // share still drawn from the original distribution, so support never collapses
const BANDWIDTH = 0.6;
const MIN_WIDTH = 0.35;

export interface Point { x: number; y: number; hit: boolean }
export interface Proposal { mx: number; my: number; s: number }
export interface Generation { proposal: Proposal; retrained: Proposal; points: Point[]; hits: number }

/** Simulator stand-in: marks a candidate as DIS-like. */
export const isDisLike = (x: number, y: number) => (x - REGION.x) ** 2 + (y - REGION.y) ** 2 <= REGION.r ** 2;

/** Proxy U(x) in [0, 1]: kernel-weighted share of DIS-like outcomes among simulated neighbours. */
export const proxy = (history: readonly Point[], x: number, y: number) => {
  let hits = 0;
  let all = 0;
  for (const p of history) {
    const k = Math.exp(-((p.x - x) ** 2 + (p.y - y) ** 2) / (2 * BANDWIDTH ** 2));
    all += k;
    if (p.hit) hits += k;
  }
  return all > 1e-9 ? hits / all : 0;
};

export const runLoop = (): Generation[] => {
  const random = seeded(20261020);
  const normal = gaussian(random);
  const history: Point[] = [];
  const generations: Generation[] = [];
  let proposal: Proposal = { mx: 0, my: 0, s: 1 };
  for (let g = 0; g < GENERATIONS; g++) {
    // 1 Propose, 2 Simulate.
    const points = Array.from({ length: PER_GEN }, () => {
      const base = g === 0 || random() < BASE_SHARE;
      const x = base ? normal() : proposal.mx + proposal.s * normal();
      const y = base ? normal() : proposal.my + proposal.s * normal();
      return { x, y, hit: isDisLike(x, y) };
    });
    history.push(...points);
    // 3 Score every simulated point with U(x), 4 retrain the proposal on U-weighted moments.
    const scores = history.map((p) => proxy(history, p.x, p.y));
    const weight = scores.reduce((a, b) => a + b, 0);
    let retrained = proposal;
    if (weight > 0) {
      const mx = history.reduce((a, p, i) => a + scores[i] * p.x, 0) / weight;
      const my = history.reduce((a, p, i) => a + scores[i] * p.y, 0) / weight;
      const v = history.reduce((a, p, i) => a + scores[i] * ((p.x - mx) ** 2 + (p.y - my) ** 2), 0) / (2 * weight);
      retrained = { mx, my, s: Math.max(MIN_WIDTH, Math.sqrt(v)) };
    }
    generations.push({ proposal, retrained, points, hits: points.filter((p) => p.hit).length });
    proposal = retrained;
  }
  return generations;
};
