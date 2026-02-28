export type Point = {
  x: number;
  y: number;
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function distanceSquared(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export function quadraticBezierPoint(p0: Point, p1: Point, p2: Point, t: number): Point {
  const oneMinusT = 1 - t;
  const x = oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x;
  const y = oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y;
  return { x, y };
}

export function quadraticBezierLength(p0: Point, p1: Point, p2: Point, segments = 18): number {
  let length = 0;
  let previous = p0;

  for (let index = 1; index <= segments; index += 1) {
    const t = index / segments;
    const current = quadraticBezierPoint(p0, p1, p2, t);
    const dx = current.x - previous.x;
    const dy = current.y - previous.y;
    length += Math.sqrt(dx * dx + dy * dy);
    previous = current;
  }

  return Math.max(length, 1);
}

export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededRange(random: () => number, min: number, max: number): number {
  return min + (max - min) * random();
}
