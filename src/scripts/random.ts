// Seeded random numbers (mulberry32 + Box–Muller), so drawings and build checks are reproducible.
export const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};

export const gaussian = (random: () => number) => () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
