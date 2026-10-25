// Schematic muon shield, side view: target at z = 0, one uniform dipole field, a detector window downstream.
// Small-angle bending only (curvature 0.3·B/p per metre); no multiple scattering, energy loss or real field map.
import { gaussian, seeded } from './random';

export const SHIELD = { start: 4, end: 38, detector: 50, window: 2 }; // metres
export const FIELD = { min: 0, max: 2, default: 1.7 }; // tesla
export const MOMENTUM = { min: 5, max: 350 }; // GeV/c
export const ANGLE = { max: 80 }; // mrad
export const BACKGROUND = 48;

export interface Muon { p: number; theta: number; q: 1 | -1 } // GeV/c, rad, charge

/** Transverse position x (m) at depth z (m) for field B (T). */
export const xAt = (m: Muon, field: number, z: number) => {
  const k = (m.q * 0.3 * field) / m.p;
  if (z <= SHIELD.start) return m.theta * z;
  const inside = Math.min(z, SHIELD.end) - SHIELD.start;
  let x = m.theta * z + 0.5 * k * inside * inside;
  if (z > SHIELD.end) x += k * (SHIELD.end - SHIELD.start) * (z - SHIELD.end);
  return x;
};

export const reaches = (m: Muon, field: number) => Math.abs(xAt(m, field, SHIELD.detector)) <= SHIELD.window;

/** Toy background: soft momentum spectrum (log-uniform), Gaussian angles, both charges. */
export const background = (): Muon[] => {
  const random = seeded(400);
  const normal = gaussian(random);
  return Array.from({ length: BACKGROUND }, () => ({
    p: MOMENTUM.min * (MOMENTUM.max / MOMENTUM.min) ** random(),
    theta: 0.03 * normal(),
    q: random() < 0.5 ? 1 : -1,
  }));
};

export const escapes = (field: number) => background().filter((m) => reaches(m, field)).length;

// Deep inelastic scattering (DIS) in the gas vessel after the shield. Toy rules, not a cross-section:
// the chance rises with momentum and is exaggerated so a few of the 48 muons show it. Fixed random rolls keep it repeatable.
export const VESSEL = { start: 40, end: 50, half: 4 }; // metres; gas between shield and detector, walls at ±half
const PRODUCT_SPREAD = 0.12; // rad, angular spread of the secondaries around the muon direction
export const disChance = (p: number) => 0.5 * Math.min(1, p / MOMENTUM.max);

export type ProductKind = 'muon' | 'pion' | 'kaon' | 'neutron';
export interface Product { kind: ProductKind; angle: number; charged: boolean }
export interface Dis { z: number; x: number; slope: number; wall: boolean; products: Product[]; dangerous: boolean }
/** Random rolls for one muon: whether it interacts, where, and the angles of its secondaries. */
export interface Roll { u: number; uz: number; angles: [number, number, number, number] }

export const newRoll = (random: () => number): Roll => ({
  u: random(),
  uz: random(),
  angles: [random(), random(), random(), random()],
});

const KINDS: ProductKind[] = ['muon', 'pion', 'kaon', 'neutron'];

/** DIS vertex and secondaries for a muon, or null when it does not interact. Dangerous = a charged hadron reaches the window. */
export const disOf = (m: Muon, field: number, roll: Roll): Dis | null => {
  if (roll.u >= disChance(m.p)) return null;
  let z = VESSEL.start + roll.uz * (VESSEL.end - VESSEL.start);
  let wall = false;
  for (let s = VESSEL.start; s <= VESSEL.end; s += 0.25) {
    if (Math.abs(xAt(m, field, s)) > VESSEL.half) {
      z = s;
      wall = true;
      break;
    }
  }
  const x = xAt(m, field, z);
  const slope = xAt(m, field, VESSEL.end) - xAt(m, field, VESSEL.end - 1);
  const products = KINDS.map((kind, i) => ({
    kind,
    angle: (roll.angles[i] - 0.5) * 2 * PRODUCT_SPREAD,
    charged: kind !== 'neutron',
  }));
  const dangerous = products.some(
    (q) => q.charged && q.kind !== 'muon' && Math.abs(x + (slope + q.angle) * (SHIELD.detector - z)) <= SHIELD.window,
  );
  return { z, x, slope, wall, products, dangerous };
};

const rolls = (() => {
  const random = seeded(900);
  return Array.from({ length: BACKGROUND }, () => newRoll(random));
})();
export const backgroundRolls = () => rolls;

export const disCounts = (field: number) => {
  const muons = background();
  const found = muons.map((m, i) => disOf(m, field, rolls[i]));
  return { dis: found.filter(Boolean).length, dangerous: found.filter((d) => d?.dangerous).length };
};
