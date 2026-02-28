"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type HeroAnimationProps = {
  className?: string;
};

type Particle = {
  angle: number;
  baseRadius: number;
  radius: number;
  orbitSpeed: number;
  size: number;
  depth: number;
  phase: number;
  floatAmp: number;
  floatSpeed: number;
  driftAmp: number;
  driftSpeed: number;
  colorIndex: number;
  pullStrength: number;
};

type Star = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
};

type RenderPoint = {
  x: number;
  y: number;
  depth: number;
};

type LayerConfig = {
  particleCount: number;
  starCount: number;
  connectionDistance: number;
  maxConnections: number;
};

const DESKTOP_CONFIG: LayerConfig = {
  particleCount: 78,
  starCount: 68,
  connectionDistance: 132,
  maxConnections: 150
};

const MOBILE_CONFIG: LayerConfig = {
  particleCount: 34,
  starCount: 30,
  connectionDistance: 92,
  maxConnections: 52
};

const NODE_COLORS = [
  "rgba(59, 130, 246, 0.95)",
  "rgba(24, 182, 164, 0.95)",
  "rgba(143, 217, 255, 0.94)"
];

const MAX_DPR = 2;

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function HeroAnimation({ className }: HeroAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId = 0;
    let isMobile = false;
    let config: LayerConfig = DESKTOP_CONFIG;
    let lastFrameTime = performance.now();

    const parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const cursor = { x: 0, y: 0, active: false };
    let allowPointerInteraction = false;

    let particles: Particle[] = [];
    let stars: Star[] = [];
    let renderPoints: RenderPoint[] = [];

    const createParticles = (count: number, minRadius: number, maxRadius: number): Particle[] =>
      Array.from({ length: count }, () => {
        const baseRadius = randomBetween(minRadius, maxRadius);
        return {
          angle: randomBetween(0, Math.PI * 2),
          baseRadius,
          radius: baseRadius,
          orbitSpeed: randomBetween(0.08, 0.2) * (Math.random() > 0.5 ? 1 : -1),
          size: randomBetween(1.2, 2.9),
          depth: randomBetween(0.45, 1.35),
          phase: randomBetween(0, Math.PI * 2),
          floatAmp: randomBetween(4, 14),
          floatSpeed: randomBetween(0.6, 1.6),
          driftAmp: randomBetween(10, 24),
          driftSpeed: randomBetween(0.26, 0.62),
          colorIndex: Math.floor(randomBetween(0, NODE_COLORS.length)),
          pullStrength: randomBetween(0.045, 0.085)
        };
      });

    const createStars = (count: number, frameWidth: number, frameHeight: number): Star[] =>
      Array.from({ length: count }, () => ({
        x: Math.random() * frameWidth,
        y: Math.random() * frameHeight,
        size: randomBetween(0.6, 2),
        alpha: randomBetween(0.2, 0.85),
        twinkleSpeed: randomBetween(0.8, 2.2),
        twinklePhase: randomBetween(0, Math.PI * 2)
      }));

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = Math.max(1, Math.floor(bounds.width));
      height = Math.max(1, Math.floor(bounds.height));
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      isMobile = window.matchMedia("(max-width: 768px)").matches;
      config = isMobile ? MOBILE_CONFIG : DESKTOP_CONFIG;
      allowPointerInteraction = !isMobile && window.matchMedia("(pointer:fine)").matches;

      const minAxis = Math.min(width, height);
      const minRadius = minAxis * 0.14;
      const maxRadius = minAxis * 0.46;

      particles = createParticles(config.particleCount, minRadius, maxRadius);
      stars = createStars(config.starCount, width, height);
      renderPoints = Array.from({ length: config.particleCount }, () => ({ x: 0, y: 0, depth: 1 }));

      if (!allowPointerInteraction) {
        cursor.active = false;
        parallax.targetX = 0;
        parallax.targetY = 0;
      }
    };

    const drawNebula = (x: number, y: number, radius: number, color: string) => {
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    };

    const drawBackground = (timeMs: number) => {
      const cosmic = context.createLinearGradient(0, 0, width, height);
      cosmic.addColorStop(0, "#050a1d");
      cosmic.addColorStop(0.55, "#0d1745");
      cosmic.addColorStop(1, "#070d24");
      context.fillStyle = cosmic;
      context.fillRect(0, 0, width, height);

      const driftA = Math.sin(timeMs * 0.00008) * 14;
      const driftB = Math.cos(timeMs * 0.00007) * 12;
      drawNebula(width * 0.2 + driftA + parallax.x * 0.35, height * 0.22 + driftB, width * 0.42, "rgba(59, 130, 246, 0.2)");
      drawNebula(width * 0.78 - driftB + parallax.x * 0.2, height * 0.3 - driftA, width * 0.32, "rgba(24, 182, 164, 0.16)");
      drawNebula(width * 0.62 + driftB * 0.6, height * 0.74 + driftA * 0.4, width * 0.38, "rgba(30, 42, 120, 0.24)");
    };

    const drawStars = (timeSec: number) => {
      for (const star of stars) {
        const twinkle = 0.45 + 0.55 * ((Math.sin(timeSec * star.twinkleSpeed + star.twinklePhase) + 1) * 0.5);
        context.globalAlpha = star.alpha * twinkle;
        context.fillStyle = "#ffffff";
        context.beginPath();
        context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    };

    const updateParticles = (deltaSec: number, timeSec: number) => {
      const centerX = width * 0.63;
      const centerY = height * 0.47;

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        particle.angle += particle.orbitSpeed * deltaSec;

        const antiGravity = Math.sin(timeSec * 0.48 + particle.phase) * 12;
        const radialDrift = Math.sin(timeSec * particle.driftSpeed + particle.phase) * particle.driftAmp;
        const targetRadius = particle.baseRadius + radialDrift + antiGravity;
        particle.radius += (targetRadius - particle.radius) * particle.pullStrength;

        const ellipse = 0.58 + particle.depth * 0.16;
        let x = centerX + Math.cos(particle.angle) * particle.radius + parallax.x * particle.depth;
        let y =
          centerY +
          Math.sin(particle.angle) * particle.radius * ellipse +
          Math.sin(timeSec * particle.floatSpeed + particle.phase) * particle.floatAmp +
          parallax.y * particle.depth;

        if (allowPointerInteraction && cursor.active) {
          const dx = x - cursor.x;
          const dy = y - cursor.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 130;
          if (distance < influenceRadius && distance > 0) {
            const repel = (1 - distance / influenceRadius) * 16 * particle.depth;
            x += (dx / distance) * repel;
            y += (dy / distance) * repel;
          }
        }

        renderPoints[i] = { x, y, depth: particle.depth };
      }
    };

    const drawConnections = (timeSec: number) => {
      let linesDrawn = 0;
      const threshold = config.connectionDistance;
      const thresholdSq = threshold * threshold;

      for (let i = 0; i < renderPoints.length; i += 1) {
        if (linesDrawn >= config.maxConnections) break;
        const pointA = renderPoints[i];

        for (let j = i + 1; j < renderPoints.length; j += 1) {
          const pointB = renderPoints[j];
          const dx = pointA.x - pointB.x;
          const dy = pointA.y - pointB.y;
          const distSq = dx * dx + dy * dy;

          if (distSq > thresholdSq) continue;

          const distance = Math.sqrt(distSq);
          const proximity = 1 - distance / threshold;
          const flicker = 0.65 + 0.35 * Math.sin(timeSec * 0.85 + i + j * 0.37);
          const alpha = Math.min(0.24, proximity * 0.28 * flicker * ((pointA.depth + pointB.depth) * 0.5));

          context.strokeStyle = `rgba(157, 228, 219, ${alpha.toFixed(4)})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(pointA.x, pointA.y);
          context.lineTo(pointB.x, pointB.y);
          context.stroke();

          linesDrawn += 1;
          if (linesDrawn >= config.maxConnections) break;
        }
      }
    };

    const drawParticles = () => {
      for (let i = 0; i < renderPoints.length; i += 1) {
        const point = renderPoints[i];
        const particle = particles[i];
        const radius = particle.size * (0.72 + point.depth * 0.36);

        const glow = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius * 4.2);
        glow.addColorStop(0, NODE_COLORS[particle.colorIndex]);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(point.x, point.y, radius * 4.2, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = NODE_COLORS[particle.colorIndex];
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    const drawCore = (timeSec: number) => {
      const centerX = width * 0.63 + parallax.x * 0.35;
      const centerY = height * 0.47 + parallax.y * 0.35;
      const baseRadius = Math.min(width, height) * 0.082;
      const pulse = 1 + Math.sin(timeSec * 1.2) * 0.03;
      const radius = baseRadius * pulse;

      const halo = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2.7);
      halo.addColorStop(0, "rgba(59, 130, 246, 0.42)");
      halo.addColorStop(0.55, "rgba(24, 182, 164, 0.22)");
      halo.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = halo;
      context.beginPath();
      context.arc(centerX, centerY, radius * 2.7, 0, Math.PI * 2);
      context.fill();

      const innerOffsetX = Math.cos(timeSec * 0.8) * radius * 0.18;
      const innerOffsetY = Math.sin(timeSec * 0.9) * radius * 0.12;
      const sphere = context.createRadialGradient(
        centerX - innerOffsetX,
        centerY - innerOffsetY,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      sphere.addColorStop(0, "rgba(184, 236, 255, 0.98)");
      sphere.addColorStop(0.45, "rgba(59, 130, 246, 0.92)");
      sphere.addColorStop(1, "rgba(30, 42, 120, 0.96)");
      context.fillStyle = sphere;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.fill();

      context.save();
      context.translate(centerX, centerY);
      context.rotate(timeSec * 0.12);
      context.strokeStyle = "rgba(143, 217, 255, 0.35)";
      context.lineWidth = 1;
      context.beginPath();
      context.arc(0, 0, radius * 1.55, 0, Math.PI * 2);
      context.stroke();
      context.rotate(-timeSec * 0.2);
      context.strokeStyle = "rgba(24, 182, 164, 0.28)";
      context.beginPath();
      context.ellipse(0, 0, radius * 1.95, radius * 1.2, Math.PI / 6, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!allowPointerInteraction) return;

      const rect = host.getBoundingClientRect();
      cursor.x = event.clientX - rect.left;
      cursor.y = event.clientY - rect.top;
      cursor.active = true;

      const nx = (cursor.x / rect.width - 0.5) * 2;
      const ny = (cursor.y / rect.height - 0.5) * 2;
      parallax.targetX = nx * 14;
      parallax.targetY = ny * 10;
    };

    const onPointerLeave = () => {
      cursor.active = false;
      parallax.targetX = 0;
      parallax.targetY = 0;
    };

    const animate = (now: number) => {
      const deltaSec = Math.min((now - lastFrameTime) / 1000, 0.05);
      lastFrameTime = now;
      const timeSec = now * 0.001;

      parallax.x += (parallax.targetX - parallax.x) * 0.065;
      parallax.y += (parallax.targetY - parallax.y) * 0.065;

      drawBackground(now);
      drawStars(timeSec);
      updateParticles(deltaSec, timeSec);
      drawConnections(timeSec);
      drawParticles();
      drawCore(timeSec);

      frameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(host);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    resize();
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reduceMotion]);

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {reduceMotion ? (
        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_78%_22%,rgba(24,182,164,0.14),transparent_42%),linear-gradient(160deg,#060b1f_0%,#111f57_48%,#0a122f_100%)]" />
      ) : (
        <canvas ref={canvasRef} className="h-full w-full" />
      )}
    </div>
  );
}
