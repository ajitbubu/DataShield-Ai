"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  clamp,
  createSeededRandom,
  distanceSquared,
  quadraticBezierLength,
  quadraticBezierPoint,
  seededRange,
  type Point
} from "@/lib/neural-canvas";

type NeuralBackdropProps = {
  className?: string;
  density?: "low" | "medium" | "high";
  seed?: number;
};

type NodeRole = "core" | "source" | "destination" | "relay";

type Node = {
  id: number;
  role: NodeRole;
  x: number;
  y: number;
  layer: 0 | 1 | 2;
  radius: number;
  driftPhase: number;
  driftSpeed: number;
  driftAmp: number;
};

type Edge = {
  id: number;
  a: number;
  b: number;
  control: Point;
  length: number;
  layer: 0 | 1 | 2;
  dotted: boolean;
  phase: number;
  coreProximity: number;
};

type Segment = {
  edgeId: number;
  from: number;
  to: number;
};

type Signal = {
  id: number;
  segments: Segment[];
  segmentIndex: number;
  t: number;
  speed: number;
  x: number;
  y: number;
  layer: 0 | 1 | 2;
  color: "teal" | "blue";
  alpha: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
};

type Graph = {
  nodes: Node[];
  edges: Edge[];
  coreNodeId: number;
  sourceNodeIds: number[];
  edgeByPair: Map<string, number>;
  adjacency: Array<Array<{ to: number; edgeId: number }>>;
};

const NODE_COUNTS = {
  low: { desktop: 44, mobile: 30 },
  medium: { desktop: 62, mobile: 38 },
  high: { desktop: 78, mobile: 44 }
} as const;

const CONFIG = {
  maxDpr: 1.5,
  resizeDebounceMs: 130,
  maxSignalsDesktop: 34,
  maxSignalsMobile: 18,
  signalSpawnMinMs: 350,
  signalSpawnMaxMs: 900,
  pulseMinMs: 3000,
  pulseMaxMs: 6000,
  pulseDecayPerSec: 0.68,
  parallaxMaxPx: 10,
  backgroundA: "#0B1220",
  backgroundB: "#121C4D",
  backgroundC: "#0D163F"
} as const;

function pairKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, index) => index);
    this.rank = Array.from({ length: size }, () => 0);
  }

  find(value: number): number {
    if (this.parent[value] !== value) {
      this.parent[value] = this.find(this.parent[value]);
    }
    return this.parent[value];
  }

  union(a: number, b: number): boolean {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return false;

    if (this.rank[rootA] < this.rank[rootB]) {
      this.parent[rootA] = rootB;
    } else if (this.rank[rootA] > this.rank[rootB]) {
      this.parent[rootB] = rootA;
    } else {
      this.parent[rootB] = rootA;
      this.rank[rootA] += 1;
    }
    return true;
  }
}

function chooseLayer(random: () => number): 0 | 1 | 2 {
  const roll = random();
  if (roll < 0.4) return 0;
  if (roll < 0.8) return 1;
  return 2;
}

function buildGraph(width: number, height: number, isMobile: boolean, density: NeuralBackdropProps["density"], seed: number): Graph {
  const pickedDensity = density ?? "medium";
  const nodeCount = isMobile ? NODE_COUNTS[pickedDensity].mobile : NODE_COUNTS[pickedDensity].desktop;
  const sourceCount = isMobile ? 4 : 6;
  const destinationCount = isMobile ? 5 : 7;
  const neighbors = isMobile ? 2 : 3;
  const maxEdgeDistance = Math.min(width * (isMobile ? 0.52 : 0.56), 380);
  const random = createSeededRandom(seed + width * 17 + height * 29);

  const nodes: Node[] = [];
  const sourceNodeIds: number[] = [];
  const destinationNodeIds: number[] = [];

  const coreNodeId = 0;
  nodes.push({
    id: coreNodeId,
    role: "core",
    x: width * 0.62,
    y: height * 0.53,
    layer: 2,
    radius: isMobile ? 5.4 : 6.8,
    driftPhase: seededRange(random, 0, Math.PI * 2),
    driftSpeed: seededRange(random, 0.14, 0.28),
    driftAmp: isMobile ? 1.4 : 2
  });

  for (let index = 0; index < sourceCount; index += 1) {
    const layer = chooseLayer(random);
    const y = height * (0.15 + ((index + 1) / (sourceCount + 1)) * 0.68) + seededRange(random, -26, 26);
    const node: Node = {
      id: nodes.length,
      role: "source",
      x: seededRange(random, width * 0.08, width * 0.24),
      y: clamp(y, height * 0.1, height * 0.9),
      layer,
      radius: layer === 2 ? 3.3 : layer === 1 ? 2.8 : 2.2,
      driftPhase: seededRange(random, 0, Math.PI * 2),
      driftSpeed: seededRange(random, 0.18, 0.34),
      driftAmp: seededRange(random, 0.7, 2.6)
    };
    sourceNodeIds.push(node.id);
    nodes.push(node);
  }

  for (let index = 0; index < destinationCount; index += 1) {
    const layer = chooseLayer(random);
    const y = height * (0.14 + ((index + 1) / (destinationCount + 1)) * 0.72) + seededRange(random, -26, 26);
    const node: Node = {
      id: nodes.length,
      role: "destination",
      x: seededRange(random, width * 0.76, width * 0.93),
      y: clamp(y, height * 0.1, height * 0.9),
      layer,
      radius: layer === 2 ? 3.4 : layer === 1 ? 2.9 : 2.2,
      driftPhase: seededRange(random, 0, Math.PI * 2),
      driftSpeed: seededRange(random, 0.18, 0.34),
      driftAmp: seededRange(random, 0.6, 2.4)
    };
    destinationNodeIds.push(node.id);
    nodes.push(node);
  }

  while (nodes.length < nodeCount) {
    const layer = chooseLayer(random);
    nodes.push({
      id: nodes.length,
      role: "relay",
      x: seededRange(random, width * 0.2, width * 0.85),
      y: seededRange(random, height * 0.1, height * 0.9),
      layer,
      radius: layer === 2 ? 3.2 : layer === 1 ? 2.6 : 2,
      driftPhase: seededRange(random, 0, Math.PI * 2),
      driftSpeed: seededRange(random, 0.18, 0.38),
      driftAmp: seededRange(random, 0.5, 2.1)
    });
  }

  const edgePairs: Array<{ a: number; b: number }> = [];
  const pairMap = new Map<string, true>();
  const addPair = (a: number, b: number) => {
    if (a === b) return;
    const key = pairKey(a, b);
    if (pairMap.has(key)) return;
    pairMap.set(key, true);
    edgePairs.push({ a, b });
  };

  for (let index = 0; index < nodes.length; index += 1) {
    const near = nodes
      .map((candidate, candidateIndex) => ({
        candidateIndex,
        distance: Math.sqrt(distanceSquared(nodes[index], candidate))
      }))
      .filter(({ candidateIndex, distance }) => candidateIndex !== index && distance < maxEdgeDistance)
      .sort((left, right) => left.distance - right.distance)
      .slice(0, neighbors);

    near.forEach(({ candidateIndex }) => addPair(index, candidateIndex));
  }

  for (const sourceId of sourceNodeIds) {
    addPair(sourceId, coreNodeId);
  }
  for (const destinationId of destinationNodeIds) {
    addPair(destinationId, coreNodeId);
  }

  const unionFind = new UnionFind(nodes.length);
  for (const pair of edgePairs) {
    unionFind.union(pair.a, pair.b);
  }

  while (true) {
    const roots = new Set<number>();
    for (let index = 0; index < nodes.length; index += 1) roots.add(unionFind.find(index));
    if (roots.size <= 1) break;

    let bestA = -1;
    let bestB = -1;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        if (unionFind.find(i) === unionFind.find(j)) continue;
        const distance = distanceSquared(nodes[i], nodes[j]);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestA = i;
          bestB = j;
        }
      }
    }
    if (bestA === -1 || bestB === -1) break;
    addPair(bestA, bestB);
    unionFind.union(bestA, bestB);
  }

  const edges: Edge[] = edgePairs.map((pair, index) => {
    const from = nodes[pair.a];
    const to = nodes[pair.b];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const invDistance = distance === 0 ? 0 : 1 / distance;
    const midX = (from.x + to.x) * 0.5;
    const midY = (from.y + to.y) * 0.5;
    const normalX = -dy * invDistance;
    const normalY = dx * invDistance;
    const curveFactor = clamp(distance * seededRange(random, 0.04, 0.09), 5, 26) * seededRange(random, -1, 1);
    const control = { x: midX + normalX * curveFactor, y: midY + normalY * curveFactor };
    const layer = Math.round((from.layer + to.layer) * 0.5) as 0 | 1 | 2;
    const length = quadraticBezierLength(from, control, to, 14);
    const coreDistance = Math.min(
      Math.sqrt(distanceSquared(from, nodes[coreNodeId])),
      Math.sqrt(distanceSquared(to, nodes[coreNodeId]))
    );
    const coreProximity = clamp(1 - coreDistance / (Math.max(width, height) * 0.56), 0, 1);

    return {
      id: index,
      a: pair.a,
      b: pair.b,
      control,
      length,
      layer,
      dotted: random() < 0.08,
      phase: seededRange(random, 0, Math.PI * 2),
      coreProximity
    };
  });

  const edgeByPair = new Map<string, number>();
  const adjacency = Array.from({ length: nodes.length }, () => [] as Array<{ to: number; edgeId: number }>);

  for (const edge of edges) {
    edgeByPair.set(pairKey(edge.a, edge.b), edge.id);
    adjacency[edge.a].push({ to: edge.b, edgeId: edge.id });
    adjacency[edge.b].push({ to: edge.a, edgeId: edge.id });
  }

  return { nodes, edges, coreNodeId, sourceNodeIds, edgeByPair, adjacency };
}

function shortestPathToCore(graph: Graph, start: number): number[] | null {
  const { nodes, adjacency, edges, coreNodeId } = graph;
  const distances = Array.from({ length: nodes.length }, () => Number.POSITIVE_INFINITY);
  const previous = Array.from({ length: nodes.length }, () => -1);
  const visited = Array.from({ length: nodes.length }, () => false);
  distances[start] = 0;

  for (let step = 0; step < nodes.length; step += 1) {
    let current = -1;
    let best = Number.POSITIVE_INFINITY;
    for (let index = 0; index < nodes.length; index += 1) {
      if (!visited[index] && distances[index] < best) {
        current = index;
        best = distances[index];
      }
    }
    if (current === -1 || current === coreNodeId) break;
    visited[current] = true;

    for (const next of adjacency[current]) {
      const cost = edges[next.edgeId].length;
      const candidate = distances[current] + cost;
      if (candidate < distances[next.to]) {
        distances[next.to] = candidate;
        previous[next.to] = current;
      }
    }
  }

  if (!Number.isFinite(distances[coreNodeId])) return null;
  const path: number[] = [];
  let cursor = coreNodeId;
  while (cursor !== -1) {
    path.push(cursor);
    if (cursor === start) break;
    cursor = previous[cursor];
  }
  if (path[path.length - 1] !== start) return null;
  path.reverse();
  return path;
}

export function NeuralBackdrop({ className, density = "medium", seed = 2026 }: NeuralBackdropProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isMobile = false;
    let interactive = false;
    let frameId = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    let graph: Graph | null = null;
    let routes: Segment[][] = [];
    let signals: Signal[] = [];
    let nextSignalAt = 0;
    let signalIdCounter = 1;
    let pulseAmount = 0;
    let nextPulseAt = 0;

    let backdropCanvas: HTMLCanvasElement | null = null;
    const random = createSeededRandom(seed + 13);
    const resolvedNodes: Array<{ x: number; y: number; layer: 0 | 1 | 2 }> = [];

    const pointer = { x: 0, y: 0, active: false };
    const parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const parallaxLayer = [0.2, 0.5, 0.9] as const;

    const buildBackdrop = () => {
      backdropCanvas = document.createElement("canvas");
      backdropCanvas.width = Math.max(1, Math.floor(width * dpr));
      backdropCanvas.height = Math.max(1, Math.floor(height * dpr));
      const backdropContext = backdropCanvas.getContext("2d");
      if (!backdropContext) return;

      backdropContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gradient = backdropContext.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, CONFIG.backgroundA);
      gradient.addColorStop(0.5, CONFIG.backgroundB);
      gradient.addColorStop(1, CONFIG.backgroundC);
      backdropContext.fillStyle = gradient;
      backdropContext.fillRect(0, 0, width, height);

      const stars = isMobile ? 24 : 42;
      const starsRandom = createSeededRandom(seed + width * 11 + height * 7);
      for (let index = 0; index < stars; index += 1) {
        const x = seededRange(starsRandom, 0, width);
        const y = seededRange(starsRandom, 0, height);
        const radius = seededRange(starsRandom, 0.4, 1.4);
        const alpha = seededRange(starsRandom, 0.16, 0.5);
        backdropContext.fillStyle = `rgba(182, 204, 255, ${alpha})`;
        backdropContext.beginPath();
        backdropContext.arc(x, y, radius, 0, Math.PI * 2);
        backdropContext.fill();
      }
    };

    const rebuildGraph = () => {
      graph = buildGraph(width, height, isMobile, density, seed);
      routes = [];
      signals = [];
      signalIdCounter = 1;
      nextSignalAt = performance.now() + seededRange(random, CONFIG.signalSpawnMinMs, CONFIG.signalSpawnMaxMs);
      nextPulseAt = performance.now() + seededRange(random, CONFIG.pulseMinMs, CONFIG.pulseMaxMs);

      if (!graph) return;
      resolvedNodes.length = graph.nodes.length;

      for (const sourceId of graph.sourceNodeIds) {
        const path = shortestPathToCore(graph, sourceId);
        if (!path || path.length < 2) continue;
        const segments: Segment[] = [];
        for (let index = 0; index < path.length - 1; index += 1) {
          const from = path[index];
          const to = path[index + 1];
          const edgeId = graph.edgeByPair.get(pairKey(from, to));
          if (edgeId === undefined) continue;
          segments.push({ edgeId, from, to });
        }
        if (segments.length) routes.push(segments);
      }
    };

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = Math.max(1, Math.floor(bounds.width));
      height = Math.max(1, Math.floor(bounds.height));
      dpr = Math.min(CONFIG.maxDpr, window.devicePixelRatio || 1);
      isMobile = window.matchMedia("(max-width: 768px)").matches;
      interactive = !isMobile && !reduceMotion && window.matchMedia("(pointer:fine)").matches;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildBackdrop();
      rebuildGraph();
      if (reduceMotion) drawFrame(performance.now(), 0, true);
    };

    const scheduleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, CONFIG.resizeDebounceMs);
    };

    const resolveNode = (node: Node, time: number): Point => {
      const layerFactor = parallaxLayer[node.layer];
      const driftX = Math.sin(time * node.driftSpeed + node.driftPhase) * node.driftAmp;
      const driftY = Math.cos(time * node.driftSpeed * 0.8 + node.driftPhase) * node.driftAmp * 0.7;
      return {
        x: node.x + driftX + parallax.x * layerFactor,
        y: node.y + driftY + parallax.y * layerFactor
      };
    };

    const drawBackdrop = () => {
      if (!backdropCanvas) return;
      context.drawImage(backdropCanvas, 0, 0, width, height);

      const glowA = context.createRadialGradient(width * 0.18, height * 0.2, 0, width * 0.18, height * 0.2, width * 0.42);
      glowA.addColorStop(0, "rgba(59,130,246,0.14)");
      glowA.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glowA;
      context.fillRect(0, 0, width, height);

      const glowB = context.createRadialGradient(width * 0.8, height * 0.28, 0, width * 0.8, height * 0.28, width * 0.34);
      glowB.addColorStop(0, "rgba(24,182,164,0.10)");
      glowB.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glowB;
      context.fillRect(0, 0, width, height);
    };

    const drawEdges = (time: number) => {
      if (!graph) return;

      for (const edge of graph.edges) {
        const from = resolvedNodes[edge.a];
        const to = resolvedNodes[edge.b];
        const pulse = 0.86 + Math.sin(time * 0.35 + edge.phase) * 0.14;
        const layerAlpha = edge.layer === 2 ? 1 : edge.layer === 1 ? 0.82 : 0.66;
        const pulseBoost = 1 + pulseAmount * (0.3 + edge.coreProximity * 0.6);
        const alpha = 0.12 * layerAlpha * pulse * pulseBoost;
        const lineWidth = edge.layer === 2 ? 1.15 : edge.layer === 1 ? 1 : 0.85;
        const controlLayer = parallaxLayer[edge.layer];
        const control = {
          x: edge.control.x + parallax.x * controlLayer,
          y: edge.control.y + parallax.y * controlLayer
        };

        context.strokeStyle = `rgba(116,149,235,${alpha.toFixed(4)})`;
        context.lineWidth = lineWidth;
        context.setLineDash(edge.dotted ? [4, 7] : []);
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.quadraticCurveTo(control.x, control.y, to.x, to.y);
        context.stroke();
      }
      context.setLineDash([]);
    };

    const drawNodes = (time: number) => {
      if (!graph) return;
      const hoverRadius = 70;

      for (const node of graph.nodes) {
        const render = resolvedNodes[node.id];
        let hoverBoost = 0;

        if (interactive && pointer.active) {
          const dx = render.x - pointer.x;
          const dy = render.y - pointer.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < hoverRadius) hoverBoost = 1 - distance / hoverRadius;
        }

        if (node.role === "core") {
          const breath = 1 + Math.sin(time * 0.82) * 0.028;
          const radius = (isMobile ? 14 : 17) * breath;
          const halo = context.createRadialGradient(render.x, render.y, 0, render.x, render.y, radius * 3.2);
          halo.addColorStop(0, "rgba(59,130,246,0.36)");
          halo.addColorStop(0.6, "rgba(24,182,164,0.2)");
          halo.addColorStop(1, "rgba(0,0,0,0)");
          context.fillStyle = halo;
          context.beginPath();
          context.arc(render.x, render.y, radius * 3.2, 0, Math.PI * 2);
          context.fill();

          const coreGradient = context.createRadialGradient(render.x, render.y, radius * 0.15, render.x, render.y, radius);
          coreGradient.addColorStop(0, "rgba(226,240,255,0.98)");
          coreGradient.addColorStop(0.45, "rgba(59,130,246,0.9)");
          coreGradient.addColorStop(1, "rgba(30,42,120,0.94)");
          context.fillStyle = coreGradient;
          context.beginPath();
          context.arc(render.x, render.y, radius, 0, Math.PI * 2);
          context.fill();
          continue;
        }

        const glowRadius = node.radius * (4.2 + hoverBoost * 1.4);
        const glow = context.createRadialGradient(render.x, render.y, 0, render.x, render.y, glowRadius);
        glow.addColorStop(0, `rgba(188,211,255,${(0.2 + hoverBoost * 0.14).toFixed(4)})`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(render.x, render.y, glowRadius, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = node.role === "source" ? "rgba(186,236,229,0.92)" : "rgba(220,230,255,0.9)";
        context.beginPath();
        context.arc(render.x, render.y, node.radius + hoverBoost * 0.38, 0, Math.PI * 2);
        context.fill();
      }
    };

    const spawnSignal = () => {
      if (!graph || routes.length === 0) return;
      const maxSignals = isMobile ? CONFIG.maxSignalsMobile : CONFIG.maxSignalsDesktop;
      if (signals.length >= maxSignals) return;

      const route = routes[Math.floor(random() * routes.length)];
      if (!route?.length) return;

      const first = route[0];
      const fromNode = resolvedNodes[first.from] ?? graph.nodes[first.from];
      const edge = graph.edges[first.edgeId];
      signals.push({
        id: signalIdCounter,
        segments: route,
        segmentIndex: 0,
        t: 0,
        speed: seededRange(random, 70, 110),
        x: fromNode.x,
        y: fromNode.y,
        layer: edge.layer,
        color: random() < 0.76 ? "teal" : "blue",
        alpha: 1,
        trail: []
      });
      signalIdCounter += 1;
    };

    const drawSignals = (deltaSec: number) => {
      if (!graph || reduceMotion) return;

      for (let index = signals.length - 1; index >= 0; index -= 1) {
        const signal = signals[index];
        const segment = signal.segments[signal.segmentIndex];
        const edge = graph.edges[segment.edgeId];
        const from = resolvedNodes[segment.from];
        const to = resolvedNodes[segment.to];
        const control = {
          x: edge.control.x + parallax.x * parallaxLayer[edge.layer],
          y: edge.control.y + parallax.y * parallaxLayer[edge.layer]
        };

        signal.t += (signal.speed * deltaSec) / edge.length;
        const point = quadraticBezierPoint(from, control, to, clamp(signal.t, 0, 1));
        signal.x = point.x;
        signal.y = point.y;
        signal.layer = edge.layer;
        signal.alpha = Math.min(1, signal.alpha + deltaSec * 0.4);

        signal.trail.unshift({ x: signal.x, y: signal.y, alpha: signal.alpha });
        if (signal.trail.length > 7) signal.trail.pop();
        for (const trail of signal.trail) trail.alpha *= 0.84;

        if (signal.t >= 1) {
          signal.segmentIndex += 1;
          signal.t = 0;
          if (signal.segmentIndex >= signal.segments.length) {
            signals.splice(index, 1);
            continue;
          }
        }

        for (let tIndex = signal.trail.length - 1; tIndex >= 0; tIndex -= 1) {
          const trail = signal.trail[tIndex];
          const ratio = (signal.trail.length - tIndex) / signal.trail.length;
          const radius = 0.62 + ratio * (0.6 + signal.layer * 0.35);
          context.fillStyle =
            signal.color === "teal"
              ? `rgba(24,182,164,${(trail.alpha * 0.26).toFixed(4)})`
              : `rgba(59,130,246,${(trail.alpha * 0.24).toFixed(4)})`;
          context.beginPath();
          context.arc(trail.x, trail.y, radius, 0, Math.PI * 2);
          context.fill();
        }

        const glow = context.createRadialGradient(signal.x, signal.y, 0, signal.x, signal.y, 8 + signal.layer * 2.2);
        glow.addColorStop(
          0,
          signal.color === "teal"
            ? `rgba(24,182,164,${(signal.alpha * 0.58).toFixed(4)})`
            : `rgba(59,130,246,${(signal.alpha * 0.54).toFixed(4)})`
        );
        glow.addColorStop(1, "rgba(0,0,0,0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(signal.x, signal.y, 8 + signal.layer * 2.2, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = signal.color === "teal" ? "rgba(24,182,164,0.94)" : "rgba(59,130,246,0.9)";
        context.beginPath();
        context.arc(signal.x, signal.y, 1.8 + signal.layer * 0.45, 0, Math.PI * 2);
        context.fill();
      }
    };

    const drawFrame = (now: number, deltaSec: number, staticMode: boolean) => {
      if (!graph) return;
      const time = now * 0.001;

      if (!staticMode) {
        parallax.x += (parallax.targetX - parallax.x) * 0.07;
        parallax.y += (parallax.targetY - parallax.y) * 0.07;
      } else {
        parallax.x = 0;
        parallax.y = 0;
      }

      for (const node of graph.nodes) {
        const point = resolveNode(node, time);
        resolvedNodes[node.id] = { x: point.x, y: point.y, layer: node.layer };
      }

      drawBackdrop();
      drawEdges(time);
      drawSignals(deltaSec);
      drawNodes(time);
    };

    let lastFrame = performance.now();
    const animate = (now: number) => {
      const deltaSec = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;

      if (!reduceMotion) {
        if (now >= nextSignalAt) {
          spawnSignal();
          nextSignalAt = now + seededRange(random, CONFIG.signalSpawnMinMs, CONFIG.signalSpawnMaxMs);
        }

        if (now >= nextPulseAt) {
          pulseAmount = 1;
          nextPulseAt = now + seededRange(random, CONFIG.pulseMinMs, CONFIG.pulseMaxMs);
        }
        pulseAmount = Math.max(0, pulseAmount - CONFIG.pulseDecayPerSec * deltaSec);
      }

      drawFrame(now, deltaSec, false);
      frameId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!interactive) return;
      const bounds = host.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      pointer.active = x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height;
      pointer.x = x;
      pointer.y = y;

      const nx = (x / bounds.width - 0.5) * 2;
      const ny = (y / bounds.height - 0.5) * 2;
      parallax.targetX = nx * CONFIG.parallaxMaxPx;
      parallax.targetY = ny * (CONFIG.parallaxMaxPx * 0.72);
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      parallax.targetX = 0;
      parallax.targetY = 0;
    };

    const resizeObserver = new ResizeObserver(scheduleResize);
    resizeObserver.observe(host);
    window.addEventListener("resize", scheduleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    resize();
    lastFrame = performance.now();
    if (reduceMotion) {
      drawFrame(lastFrame, 0, true);
    } else {
      frameId = window.requestAnimationFrame(animate);
    }

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [density, reduceMotion, seed]);

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} ref={hostRef}>
      <canvas className="h-full w-full" ref={canvasRef} />
    </div>
  );
}
