"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  clamp,
  createSeededRandom,
  distanceSquared,
  lerp,
  Point,
  quadraticBezierLength,
  quadraticBezierPoint,
  seededRange
} from "@/lib/neural-canvas";

type ConsentState = "granted" | "denied" | "mixed";
type Density = "low" | "medium" | "high";
type EdgeCategory = "essential" | "functional" | "analytics" | "marketing";
type NodeRole = "core" | "source" | "destination" | "relay";

type NeuralConsentHeroProps = {
  className?: string;
  consentState?: ConsentState;
  density?: Density;
  interactive?: boolean;
  seed?: number;
};

type NetworkNode = {
  id: number;
  role: NodeRole;
  label: string;
  x: number;
  y: number;
  layer: 0 | 1 | 2;
  radius: number;
  driftPhase: number;
  driftSpeed: number;
  driftAmp: number;
  destinationCategory?: EdgeCategory;
};

type NetworkEdge = {
  id: number;
  a: number;
  b: number;
  category: EdgeCategory;
  control: Point;
  length: number;
  dotted: boolean;
  phase: number;
  layer: 0 | 1 | 2;
};

type EdgePathSegment = {
  edgeId: number;
  from: number;
  to: number;
  blocked: boolean;
  category: EdgeCategory;
};

type FlowRoute = {
  key: string;
  sourceId: number;
  destinationId: number;
  destinationCategory: EdgeCategory;
  segments: EdgePathSegment[];
};

type ActiveSignal = {
  id: number;
  route: FlowRoute;
  segmentIndex: number;
  t: number;
  speed: number;
  alpha: number;
  blocked: boolean;
  color: string;
  trail: Array<{ x: number; y: number; alpha: number }>;
  x: number;
  y: number;
  layer: 0 | 1 | 2;
};

type BuiltNetwork = {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  coreNodeId: number;
  sourceNodeIds: number[];
  destinationNodeIds: number[];
  edgeIndexByPair: Map<string, number>;
  adjacency: Array<Array<{ to: number; edgeId: number }>>;
};

type RuntimeConfig = {
  nodeCount: number;
  sourceCount: number;
  destinationCount: number;
  edgeNeighbors: number;
  maxEdgeDistance: number;
  signalRate: number;
  maxSignals: number;
  burstCount: number;
  stars: number;
};

const DENSITY_MULTIPLIER: Record<Density, number> = {
  low: 0.8,
  medium: 1,
  high: 1.24
};

const COLOR_BACKGROUND_A = "#050b21";
const COLOR_BACKGROUND_B = "#101d55";
const COLOR_BACKGROUND_C = "#070f2a";

const EDGE_COLOR_BY_CATEGORY: Record<EdgeCategory, [number, number, number]> = {
  essential: [170, 193, 255],
  functional: [157, 228, 219],
  analytics: [138, 171, 246],
  marketing: [126, 152, 226]
};

const SIGNAL_COLORS = ["rgba(24, 182, 164, 0.95)", "rgba(59, 130, 246, 0.94)"];
const LAYER_PARALLAX = [0.3, 0.58, 0.98];
const MAX_DPR = 2;
const RESIZE_DEBOUNCE_MS = 120;
const CLICK_BURST_COOLDOWN_MS = 800;

const SOURCE_LABELS = ["Web", "Mobile SDK", "Tags", "CRM", "CMP", "API Gateway", "Edge SDK"];
const DESTINATION_LABELS = ["Policy Core", "CDP", "Data Lake", "Ads", "Warehouse", "Attribution", "Analytics"];
const DESTINATION_CATEGORIES: EdgeCategory[] = ["essential", "functional", "analytics", "marketing"];

function edgePairKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function getRuntimeConfig(width: number, isMobile: boolean, density: Density): RuntimeConfig {
  const scale = DENSITY_MULTIPLIER[density];
  const baseNodes = isMobile ? 34 : 58;
  const nodeCount = Math.round(baseNodes * scale);
  const sourceCount = isMobile ? 4 : 6;
  const destinationCount = isMobile ? 5 : 7;

  return {
    nodeCount,
    sourceCount,
    destinationCount,
    edgeNeighbors: isMobile ? 2 : 3,
    maxEdgeDistance: Math.min(width * (isMobile ? 0.5 : 0.55), 360),
    signalRate: isMobile ? 1.05 * scale : 1.95 * scale,
    maxSignals: isMobile ? Math.round(34 * scale) : Math.round(82 * scale),
    burstCount: isMobile ? 4 : 9,
    stars: isMobile ? 22 : 52
  };
}

function pickCategoryForDestination(index: number): EdgeCategory {
  return DESTINATION_CATEGORIES[index % DESTINATION_CATEGORIES.length];
}

function isCategoryAllowed(category: EdgeCategory, consentState: ConsentState): boolean {
  if (consentState === "granted") return true;
  if (consentState === "mixed") return category === "essential" || category === "functional";
  return category === "essential";
}

function inferEdgeCategory(a: NetworkNode, b: NetworkNode, random: () => number): EdgeCategory {
  if (a.role === "core" && b.role === "destination") return b.destinationCategory ?? "functional";
  if (b.role === "core" && a.role === "destination") return a.destinationCategory ?? "functional";
  if (a.role === "destination") return a.destinationCategory ?? "functional";
  if (b.role === "destination") return b.destinationCategory ?? "functional";

  if (a.role === "source" || b.role === "source") {
    const roll = random();
    if (roll < 0.5) return "essential";
    if (roll < 0.85) return "functional";
    if (roll < 0.95) return "analytics";
    return "marketing";
  }

  const roll = random();
  if (roll < 0.32) return "essential";
  if (roll < 0.67) return "functional";
  if (roll < 0.87) return "analytics";
  return "marketing";
}

class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
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
  if (roll < 0.38) return 0;
  if (roll < 0.78) return 1;
  return 2;
}

function nodeRadiusForLayer(layer: 0 | 1 | 2): number {
  return layer === 0 ? 2.1 : layer === 1 ? 2.8 : 3.5;
}

function buildNetwork(width: number, height: number, config: RuntimeConfig, random: () => number): BuiltNetwork {
  const nodes: NetworkNode[] = [];
  const sourceNodeIds: number[] = [];
  const destinationNodeIds: number[] = [];

  const coreNodeId = 0;
  nodes.push({
    id: coreNodeId,
    role: "core",
    label: "Policy Core",
    x: width * 0.63,
    y: height * 0.5,
    layer: 2,
    radius: 7.2,
    driftPhase: seededRange(random, 0, Math.PI * 2),
    driftSpeed: seededRange(random, 0.16, 0.34),
    driftAmp: 2.2
  });

  for (let index = 0; index < config.sourceCount; index += 1) {
    const yBase = lerp(height * 0.14, height * 0.84, (index + 1) / (config.sourceCount + 1));
    const node: NetworkNode = {
      id: nodes.length,
      role: "source",
      label: SOURCE_LABELS[index % SOURCE_LABELS.length],
      x: seededRange(random, width * 0.08, width * 0.24),
      y: clamp(yBase + seededRange(random, -height * 0.06, height * 0.06), height * 0.08, height * 0.92),
      layer: chooseLayer(random),
      radius: 3.4,
      driftPhase: seededRange(random, 0, Math.PI * 2),
      driftSpeed: seededRange(random, 0.18, 0.36),
      driftAmp: seededRange(random, 1.2, 4.2)
    };
    sourceNodeIds.push(node.id);
    nodes.push(node);
  }

  for (let index = 0; index < config.destinationCount; index += 1) {
    const yBase = lerp(height * 0.15, height * 0.88, (index + 1) / (config.destinationCount + 1));
    const category = pickCategoryForDestination(index);
    const node: NetworkNode = {
      id: nodes.length,
      role: "destination",
      label: DESTINATION_LABELS[index % DESTINATION_LABELS.length],
      x: seededRange(random, width * 0.76, width * 0.94),
      y: clamp(yBase + seededRange(random, -height * 0.055, height * 0.055), height * 0.08, height * 0.92),
      layer: chooseLayer(random),
      radius: 3.6,
      driftPhase: seededRange(random, 0, Math.PI * 2),
      driftSpeed: seededRange(random, 0.18, 0.34),
      driftAmp: seededRange(random, 1.1, 4.4),
      destinationCategory: category
    };
    destinationNodeIds.push(node.id);
    nodes.push(node);
  }

  const relayCount = Math.max(0, config.nodeCount - nodes.length);
  for (let index = 0; index < relayCount; index += 1) {
    const layer = chooseLayer(random);
    const node: NetworkNode = {
      id: nodes.length,
      role: "relay",
      label: `Relay ${index + 1}`,
      x: seededRange(random, width * 0.2, width * 0.84),
      y: seededRange(random, height * 0.1, height * 0.9),
      layer,
      radius: nodeRadiusForLayer(layer),
      driftPhase: seededRange(random, 0, Math.PI * 2),
      driftSpeed: seededRange(random, 0.18, 0.42),
      driftAmp: seededRange(random, 0.8, 3.6)
    };
    nodes.push(node);
  }

  const pairMap = new Map<string, number>();
  const edgePairs: Array<{ a: number; b: number }> = [];

  const addPair = (a: number, b: number) => {
    if (a === b) return;
    const key = edgePairKey(a, b);
    if (pairMap.has(key)) return;
    pairMap.set(key, edgePairs.length);
    edgePairs.push({ a, b });
  };

  for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex += 1) {
    const near = nodes
      .map((candidate, candidateIndex) => ({
        candidateIndex,
        distance: Math.sqrt(distanceSquared(nodes[nodeIndex], candidate))
      }))
      .filter(({ candidateIndex, distance }) => candidateIndex !== nodeIndex && distance < config.maxEdgeDistance)
      .sort((left, right) => left.distance - right.distance)
      .slice(0, config.edgeNeighbors);

    near.forEach(({ candidateIndex }) => addPair(nodeIndex, candidateIndex));
  }

  for (const sourceId of sourceNodeIds) {
    const nearest = nodes
      .map((candidate) => ({
        id: candidate.id,
        distance: Math.sqrt(distanceSquared(nodes[sourceId], candidate))
      }))
      .filter(({ id }) => id !== sourceId && nodes[id].role !== "destination")
      .sort((left, right) => left.distance - right.distance)
      .slice(0, 2);

    nearest.forEach(({ id }) => addPair(sourceId, id));
    addPair(sourceId, coreNodeId);
  }

  for (const destinationId of destinationNodeIds) {
    const nearest = nodes
      .map((candidate) => ({
        id: candidate.id,
        distance: Math.sqrt(distanceSquared(nodes[destinationId], candidate))
      }))
      .filter(({ id }) => id !== destinationId && nodes[id].role !== "source")
      .sort((left, right) => left.distance - right.distance)
      .slice(0, 2);

    nearest.forEach(({ id }) => addPair(destinationId, id));
    addPair(destinationId, coreNodeId);
  }

  const unionFind = new UnionFind(nodes.length);
  for (const pair of edgePairs) {
    unionFind.union(pair.a, pair.b);
  }

  while (true) {
    const roots = new Set<number>();
    for (let index = 0; index < nodes.length; index += 1) {
      roots.add(unionFind.find(index));
    }
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

  const edges: NetworkEdge[] = edgePairs.map((pair, index) => {
    const fromNode = nodes[pair.a];
    const toNode = nodes[pair.b];
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const invDistance = distance === 0 ? 0 : 1 / distance;

    const midX = (fromNode.x + toNode.x) * 0.5;
    const midY = (fromNode.y + toNode.y) * 0.5;
    const normalX = -dy * invDistance;
    const normalY = dx * invDistance;
    const curvature = clamp(distance * seededRange(random, 0.05, 0.12), 7, 32) * seededRange(random, -1, 1);
    const control = {
      x: midX + normalX * curvature,
      y: midY + normalY * curvature
    };

    const category = inferEdgeCategory(fromNode, toNode, random);
    const layer = Math.round((fromNode.layer + toNode.layer) * 0.5) as 0 | 1 | 2;
    const length = quadraticBezierLength(fromNode, control, toNode, 14);

    return {
      id: index,
      a: pair.a,
      b: pair.b,
      category,
      control,
      length,
      dotted: random() < 0.12,
      phase: seededRange(random, 0, Math.PI * 2),
      layer
    };
  });

  const edgeIndexByPair = new Map<string, number>();
  const adjacency = Array.from({ length: nodes.length }, () => [] as Array<{ to: number; edgeId: number }>);

  for (const edge of edges) {
    edgeIndexByPair.set(edgePairKey(edge.a, edge.b), edge.id);
    adjacency[edge.a].push({ to: edge.b, edgeId: edge.id });
    adjacency[edge.b].push({ to: edge.a, edgeId: edge.id });
  }

  return {
    nodes,
    edges,
    coreNodeId,
    sourceNodeIds,
    destinationNodeIds,
    edgeIndexByPair,
    adjacency
  };
}

function shortestPath(
  network: BuiltNetwork,
  start: number,
  end: number,
  allowEdge: (edge: NetworkEdge) => boolean
): number[] | null {
  const { nodes, edges, adjacency } = network;
  const distance = Array.from({ length: nodes.length }, () => Number.POSITIVE_INFINITY);
  const previous = Array.from({ length: nodes.length }, () => -1);
  const visited = Array.from({ length: nodes.length }, () => false);
  distance[start] = 0;

  for (let step = 0; step < nodes.length; step += 1) {
    let current = -1;
    let best = Number.POSITIVE_INFINITY;

    for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex += 1) {
      if (!visited[nodeIndex] && distance[nodeIndex] < best) {
        best = distance[nodeIndex];
        current = nodeIndex;
      }
    }

    if (current === -1 || current === end) break;
    visited[current] = true;

    for (const next of adjacency[current]) {
      const edge = edges[next.edgeId];
      if (!allowEdge(edge)) continue;
      const candidate = distance[current] + edge.length;
      if (candidate < distance[next.to]) {
        distance[next.to] = candidate;
        previous[next.to] = current;
      }
    }
  }

  if (!Number.isFinite(distance[end])) return null;

  const nodePath: number[] = [];
  let cursor = end;
  while (cursor !== -1) {
    nodePath.push(cursor);
    if (cursor === start) break;
    cursor = previous[cursor];
  }

  if (nodePath[nodePath.length - 1] !== start) return null;
  nodePath.reverse();
  return nodePath;
}

function toEdgeSegments(network: BuiltNetwork, path: number[], consentState: ConsentState): EdgePathSegment[] {
  const segments: EdgePathSegment[] = [];

  for (let index = 0; index < path.length - 1; index += 1) {
    const from = path[index];
    const to = path[index + 1];
    const edgeId = network.edgeIndexByPair.get(edgePairKey(from, to));
    if (edgeId === undefined) continue;
    const edge = network.edges[edgeId];

    segments.push({
      edgeId,
      from,
      to,
      blocked: !isCategoryAllowed(edge.category, consentState),
      category: edge.category
    });
  }

  return segments;
}

function buildRoutes(network: BuiltNetwork, consentState: ConsentState): FlowRoute[] {
  const routes: FlowRoute[] = [];
  const allowByConsent = (edge: NetworkEdge) => isCategoryAllowed(edge.category, consentState);

  for (const sourceId of network.sourceNodeIds) {
    for (const destinationId of network.destinationNodeIds) {
      const strictToCore = shortestPath(network, sourceId, network.coreNodeId, allowByConsent);
      const strictToDestination = shortestPath(network, network.coreNodeId, destinationId, allowByConsent);

      let nodePath: number[] | null = null;
      if (strictToCore && strictToDestination) {
        nodePath = [...strictToCore, ...strictToDestination.slice(1)];
      } else {
        const fullToCore = shortestPath(network, sourceId, network.coreNodeId, () => true);
        const fullToDestination = shortestPath(network, network.coreNodeId, destinationId, () => true);
        if (fullToCore && fullToDestination) {
          nodePath = [...fullToCore, ...fullToDestination.slice(1)];
        }
      }

      if (!nodePath || nodePath.length < 2) continue;
      const segments = toEdgeSegments(network, nodePath, consentState);
      if (segments.length === 0) continue;

      routes.push({
        key: `${sourceId}-${destinationId}`,
        sourceId,
        destinationId,
        destinationCategory: network.nodes[destinationId].destinationCategory ?? "functional",
        segments
      });
    }
  }

  return routes;
}

function rgbaFromCategory(category: EdgeCategory, alpha: number): string {
  const [r, g, b] = EDGE_COLOR_BY_CATEGORY[category];
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(4)})`;
}

function chooseRoute(
  routes: FlowRoute[],
  consentState: ConsentState,
  random: () => number
): FlowRoute | null {
  if (routes.length === 0) return null;

  const byCategory = (category: EdgeCategory) => routes.filter((route) => route.destinationCategory === category);
  const essential = byCategory("essential");
  const functional = byCategory("functional");
  const analytics = byCategory("analytics");
  const marketing = byCategory("marketing");

  let pool = routes;
  if (consentState === "mixed") {
    pool = random() < 0.78 ? [...essential, ...functional] : routes;
  } else if (consentState === "denied") {
    pool = random() < 0.84 ? essential : [...essential, ...functional, ...analytics, ...marketing];
  }

  if (pool.length === 0) pool = routes;
  return pool[Math.floor(random() * pool.length)] ?? null;
}

export function NeuralConsentHero({
  className,
  consentState = "mixed",
  density = "medium",
  interactive = true,
  seed = 42
}: NeuralConsentHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const pointer = { x: 0, y: 0, active: false };
    const parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isMobile = false;
    let canInteract = false;
    let runtime = getRuntimeConfig(1280, false, density);
    let network: BuiltNetwork | null = null;
    let routes: FlowRoute[] = [];
    let signals: ActiveSignal[] = [];
    let signalAccumulator = 0;
    let lastFrame = performance.now();
    let signalIdCounter = 1;
    let frameId = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let lastBurst = 0;

    let backdropCanvas: HTMLCanvasElement | null = null;
    const random = createSeededRandom(seed + 17);

    const renderNodes: Array<{ x: number; y: number; layer: 0 | 1 | 2 }> = [];

    const buildBackdrop = () => {
      backdropCanvas = document.createElement("canvas");
      backdropCanvas.width = Math.max(1, width * dpr);
      backdropCanvas.height = Math.max(1, height * dpr);
      const backdropContext = backdropCanvas.getContext("2d");

      if (!backdropContext) return;
      backdropContext.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gradient = backdropContext.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, COLOR_BACKGROUND_A);
      gradient.addColorStop(0.52, COLOR_BACKGROUND_B);
      gradient.addColorStop(1, COLOR_BACKGROUND_C);
      backdropContext.fillStyle = gradient;
      backdropContext.fillRect(0, 0, width, height);

      const starsRandom = createSeededRandom(seed + width * 13 + height * 7 + runtime.stars);
      for (let index = 0; index < runtime.stars; index += 1) {
        const x = seededRange(starsRandom, 0, width);
        const y = seededRange(starsRandom, 0, height);
        const radius = seededRange(starsRandom, 0.5, 1.9);
        const alpha = seededRange(starsRandom, 0.2, 0.72);
        backdropContext.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        backdropContext.beginPath();
        backdropContext.arc(x, y, radius, 0, Math.PI * 2);
        backdropContext.fill();
      }
    };

    const rebuildNetwork = () => {
      const networkSeed = seed + width * 31 + height * 19 + (isMobile ? 3 : 11);
      const seeded = createSeededRandom(networkSeed);
      network = buildNetwork(width, height, runtime, seeded);
      routes = buildRoutes(network, consentState);
      signals = [];
      signalAccumulator = 0;
      signalIdCounter = 1;
      renderNodes.length = network.nodes.length;
    };

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = Math.max(1, Math.floor(bounds.width));
      height = Math.max(1, Math.floor(bounds.height));
      dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      isMobile = window.matchMedia("(max-width: 768px)").matches;
      canInteract = interactive && !isMobile && window.matchMedia("(pointer:fine)").matches;
      runtime = getRuntimeConfig(width, isMobile, density);
      buildBackdrop();
      rebuildNetwork();
      if (reduceMotion) render(performance.now(), 0, true);
    };

    const scheduleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, RESIZE_DEBOUNCE_MS);
    };

    const resolveNodePoint = (node: NetworkNode, time: number): Point => {
      const layerFactor = LAYER_PARALLAX[node.layer];
      const wobbleX = Math.sin(time * node.driftSpeed + node.driftPhase) * node.driftAmp;
      const wobbleY = Math.cos(time * node.driftSpeed * 0.8 + node.driftPhase) * node.driftAmp * 0.72;

      return {
        x: node.x + wobbleX + parallax.x * layerFactor,
        y: node.y + wobbleY + parallax.y * layerFactor
      };
    };

    const drawBackdrop = () => {
      if (!backdropCanvas) return;
      context.drawImage(backdropCanvas, 0, 0, width, height);

      const glowA = context.createRadialGradient(width * 0.18, height * 0.2, 0, width * 0.18, height * 0.2, width * 0.42);
      glowA.addColorStop(0, "rgba(59, 130, 246, 0.14)");
      glowA.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = glowA;
      context.fillRect(0, 0, width, height);

      const glowB = context.createRadialGradient(width * 0.78, height * 0.3, 0, width * 0.78, height * 0.3, width * 0.34);
      glowB.addColorStop(0, "rgba(24, 182, 164, 0.1)");
      glowB.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = glowB;
      context.fillRect(0, 0, width, height);
    };

    const drawEdges = (time: number) => {
      if (!network) return;

      const { edges, nodes } = network;
      for (const edge of edges) {
        const from = renderNodes[edge.a];
        const to = renderNodes[edge.b];
        const edgeLayer = edge.layer;
        const layerAlpha = edgeLayer === 0 ? 0.66 : edgeLayer === 1 ? 0.83 : 1;
        const allowed = isCategoryAllowed(edge.category, consentState);
        const pulse = 0.8 + Math.sin(time * 0.42 + edge.phase) * 0.2;
        const baseAlpha = allowed ? 0.2 : 0.055;
        const alpha = baseAlpha * layerAlpha * pulse;

        const controlLayer = LAYER_PARALLAX[Math.round((nodes[edge.a].layer + nodes[edge.b].layer) * 0.5) as 0 | 1 | 2];
        const control = {
          x: edge.control.x + parallax.x * controlLayer,
          y: edge.control.y + parallax.y * controlLayer
        };

        context.lineWidth = allowed ? (edgeLayer === 2 ? 1.2 : 1) : 0.8;
        context.strokeStyle = rgbaFromCategory(edge.category, alpha);
        if (edge.dotted) {
          context.setLineDash([4, 7]);
        } else {
          context.setLineDash([]);
        }
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.quadraticCurveTo(control.x, control.y, to.x, to.y);
        context.stroke();
      }

      context.setLineDash([]);
    };

    const drawNodes = (time: number) => {
      if (!network) return;

      const hoverRadius = 70;
      for (const node of network.nodes) {
        const render = renderNodes[node.id];
        let hoverBoost = 0;

        if (canInteract && pointer.active) {
          const dx = render.x - pointer.x;
          const dy = render.y - pointer.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < hoverRadius) hoverBoost = 1 - distance / hoverRadius;
        }

        if (node.role === "core") {
          const breath = 1 + Math.sin(time * 1.14) * 0.03;
          const radius = 17 * breath;
          const halo = context.createRadialGradient(render.x, render.y, 0, render.x, render.y, radius * 3.2);
          halo.addColorStop(0, "rgba(59, 130, 246, 0.42)");
          halo.addColorStop(0.55, "rgba(24, 182, 164, 0.24)");
          halo.addColorStop(1, "rgba(0, 0, 0, 0)");
          context.fillStyle = halo;
          context.beginPath();
          context.arc(render.x, render.y, radius * 3.2, 0, Math.PI * 2);
          context.fill();

          const innerX = render.x + Math.cos(time * 0.76) * radius * 0.18;
          const innerY = render.y + Math.sin(time * 0.64) * radius * 0.14;
          const coreGradient = context.createRadialGradient(innerX, innerY, radius * 0.1, render.x, render.y, radius);
          coreGradient.addColorStop(0, "rgba(212, 238, 255, 0.98)");
          coreGradient.addColorStop(0.45, "rgba(59, 130, 246, 0.92)");
          coreGradient.addColorStop(1, "rgba(30, 42, 120, 0.95)");
          context.fillStyle = coreGradient;
          context.beginPath();
          context.arc(render.x, render.y, radius, 0, Math.PI * 2);
          context.fill();

          context.strokeStyle = "rgba(157, 228, 219, 0.36)";
          context.lineWidth = 1;
          context.beginPath();
          context.arc(render.x, render.y, radius * 1.7, 0, Math.PI * 2);
          context.stroke();
          continue;
        }

        const glowRadius = node.radius * (4.3 + hoverBoost * 1.6);
        const glowAlpha = 0.16 + hoverBoost * 0.18;
        const glow = context.createRadialGradient(render.x, render.y, 0, render.x, render.y, glowRadius);
        glow.addColorStop(0, `rgba(173, 198, 255, ${(glowAlpha * 1.2).toFixed(4)})`);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(render.x, render.y, glowRadius, 0, Math.PI * 2);
        context.fill();

        let fill = "rgba(228, 236, 255, 0.92)";
        if (node.role === "source") fill = "rgba(196, 239, 232, 0.95)";
        if (node.role === "destination") fill = "rgba(214, 223, 255, 0.95)";
        context.fillStyle = fill;
        context.beginPath();
        context.arc(render.x, render.y, node.radius + hoverBoost * 0.5, 0, Math.PI * 2);
        context.fill();
      }
    };

    const spawnSignal = (burst = false) => {
      if (!network || routes.length === 0) return;
      if (signals.length >= runtime.maxSignals) return;

      const route = chooseRoute(routes, consentState, random);
      if (!route || route.segments.length === 0) return;

      const firstSegment = route.segments[0];
      const firstEdge = network.edges[firstSegment.edgeId];
      const blocked = firstSegment.blocked;
      const color = random() < 0.74 ? SIGNAL_COLORS[0] : SIGNAL_COLORS[1];

      signals.push({
        id: signalIdCounter,
        route,
        segmentIndex: 0,
        t: 0,
        speed: seededRange(random, burst ? 86 : 62, burst ? 124 : 98),
        alpha: 1,
        blocked,
        color,
        trail: [],
        x: network.nodes[firstSegment.from].x,
        y: network.nodes[firstSegment.from].y,
        layer: firstEdge.layer
      });
      signalIdCounter += 1;
    };

    const drawSignals = (deltaSec: number) => {
      if (!network || reduceMotion) return;

      for (let index = signals.length - 1; index >= 0; index -= 1) {
        const signal = signals[index];
        const segment = signal.route.segments[signal.segmentIndex];
        const edge = network.edges[segment.edgeId];
        const fromNode = renderNodes[segment.from];
        const toNode = renderNodes[segment.to];
        const controlLayer = LAYER_PARALLAX[edge.layer];
        const control = {
          x: edge.control.x + parallax.x * controlLayer,
          y: edge.control.y + parallax.y * controlLayer
        };

        signal.t += (signal.speed * deltaSec) / edge.length;
        const point = quadraticBezierPoint(fromNode, control, toNode, clamp(signal.t, 0, 1));
        signal.x = point.x;
        signal.y = point.y;
        signal.layer = edge.layer;
        signal.blocked = segment.blocked;

        signal.trail.unshift({ x: signal.x, y: signal.y, alpha: signal.alpha });
        if (signal.trail.length > 9) signal.trail.pop();
        for (const trailPoint of signal.trail) {
          trailPoint.alpha *= 0.84;
        }

        if (segment.blocked && signal.t > 0.24) {
          signal.alpha -= deltaSec * 2.1;
        } else {
          signal.alpha = Math.min(1, signal.alpha + deltaSec * 0.6);
        }

        if (signal.t >= 1) {
          if (segment.blocked || signal.alpha <= 0.03) {
            signals.splice(index, 1);
            continue;
          }

          signal.segmentIndex += 1;
          signal.t = 0;
          if (signal.segmentIndex >= signal.route.segments.length) {
            signals.splice(index, 1);
            continue;
          }
        }

        if (signal.alpha <= 0.03) {
          signals.splice(index, 1);
          continue;
        }

        for (let trailIndex = signal.trail.length - 1; trailIndex >= 0; trailIndex -= 1) {
          const trail = signal.trail[trailIndex];
          const ratio = (signal.trail.length - trailIndex) / signal.trail.length;
          const radius = (signal.layer + 1) * 0.65 * ratio + 0.6;
          context.fillStyle = `rgba(138, 224, 215, ${(trail.alpha * 0.22).toFixed(4)})`;
          context.beginPath();
          context.arc(trail.x, trail.y, radius, 0, Math.PI * 2);
          context.fill();
        }

        const glow = context.createRadialGradient(signal.x, signal.y, 0, signal.x, signal.y, 9 + signal.layer * 2.8);
        const glowAlpha = signal.blocked ? signal.alpha * 0.28 : signal.alpha * 0.55;
        glow.addColorStop(0, signal.color.replace("0.95", glowAlpha.toFixed(4)).replace("0.94", glowAlpha.toFixed(4)));
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(signal.x, signal.y, 9 + signal.layer * 2.8, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = signal.color.replace("0.95", clamp(signal.alpha, 0, 1).toFixed(4)).replace(
          "0.94",
          clamp(signal.alpha, 0, 1).toFixed(4)
        );
        context.beginPath();
        context.arc(signal.x, signal.y, 1.9 + signal.layer * 0.58, 0, Math.PI * 2);
        context.fill();
      }
    };

    const updateSignalSpawning = (deltaSec: number) => {
      if (reduceMotion) return;

      signalAccumulator += runtime.signalRate * deltaSec;
      while (signalAccumulator >= 1) {
        spawnSignal(false);
        signalAccumulator -= 1;
      }
    };

    const render = (now: number, deltaSec: number, staticMode: boolean) => {
      if (!network) return;
      const time = now * 0.001;

      if (!staticMode) {
        parallax.x += (parallax.targetX - parallax.x) * 0.068;
        parallax.y += (parallax.targetY - parallax.y) * 0.068;
      } else {
        parallax.x = 0;
        parallax.y = 0;
      }

      for (const node of network.nodes) {
        const point = resolveNodePoint(node, time);
        renderNodes[node.id] = { x: point.x, y: point.y, layer: node.layer };
      }

      drawBackdrop();
      drawEdges(time);
      drawSignals(deltaSec);
      drawNodes(time);
      updateSignalSpawning(deltaSec);
    };

    const animate = (timestamp: number) => {
      const deltaSec = Math.min((timestamp - lastFrame) / 1000, 0.05);
      lastFrame = timestamp;
      render(timestamp, deltaSec, false);
      frameId = requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!canInteract) return;
      const bounds = host.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= bounds.width && pointer.y <= bounds.height;

      const nx = (pointer.x / bounds.width - 0.5) * 2;
      const ny = (pointer.y / bounds.height - 0.5) * 2;
      parallax.targetX = nx * 16;
      parallax.targetY = ny * 10;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      parallax.targetX = 0;
      parallax.targetY = 0;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!canInteract || reduceMotion) return;
      const now = performance.now();
      if (now - lastBurst < CLICK_BURST_COOLDOWN_MS) return;

      const bounds = host.getBoundingClientRect();
      const within =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;
      if (!within) return;

      lastBurst = now;
      for (let count = 0; count < runtime.burstCount; count += 1) {
        spawnSignal(true);
      }
    };

    const resizeObserver = new ResizeObserver(scheduleResize);
    resizeObserver.observe(host);
    window.addEventListener("resize", scheduleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    resize();
    lastFrame = performance.now();

    if (reduceMotion) {
      render(lastFrame, 0, true);
    } else {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [consentState, density, interactive, reduceMotion, seed]);

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
