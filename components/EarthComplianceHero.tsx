"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createArcCurve, latLonToVector3 } from "@/lib/geo";
import { cn } from "@/lib/utils";
import { supportsWebGL } from "@/lib/webgl";

type EarthComplianceHeroProps = {
  className?: string;
};

type HeatRegion = {
  id: string;
  label: string;
  lat: number;
  lon: number;
  radius: number;
  intensity: number;
  tier: "high" | "medium" | "low";
};

type ArcLink = {
  id: string;
  from: string;
  to: string;
};

type ArcRuntime = {
  curve: ReturnType<typeof createArcCurve>;
  phase: number;
  signal: THREE.Mesh;
  speed: number;
};

const EARTH_RADIUS = 1.32;
const AXIAL_TILT = -0.26;
const ROTATION_SPEED = 0.048;
const HEAT_BREATHE_SPEED = 0.55;
const SCAN_BAND_SPEED = 0.14;
const PARALLAX_STRENGTH = 0.08;
const MAX_DPR = 1.5;
const MOBILE_BREAKPOINT = 768;

const MOBILE_SEGMENTS = 36;
const DESKTOP_SEGMENTS = 56;
const MOBILE_ARCS_ENABLED = false;
const MOBILE_SCAN_ENABLED = false;

const HEAT_REGIONS: HeatRegion[] = [
  { id: "eu", label: "GDPR / EU", lat: 50, lon: 10, radius: 0.44, intensity: 0.95, tier: "high" },
  { id: "us", label: "US Federal/State", lat: 37, lon: -95, radius: 0.5, intensity: 0.76, tier: "medium" },
  { id: "ca", label: "CPRA / California", lat: 36, lon: -119, radius: 0.35, intensity: 0.9, tier: "high" },
  { id: "india", label: "DPDP / India", lat: 22, lon: 78, radius: 0.4, intensity: 0.7, tier: "medium" },
  { id: "brazil", label: "LGPD / Brazil", lat: -15, lon: -51, radius: 0.34, intensity: 0.46, tier: "low" },
  { id: "apac", label: "APAC", lat: 10, lon: 116, radius: 0.38, intensity: 0.42, tier: "low" },
  { id: "uk", label: "UK GDPR", lat: 54, lon: -2, radius: 0.24, intensity: 0.62, tier: "medium" }
];

const ARC_LINKS: ArcLink[] = [
  { id: "arc-eu-us", from: "eu", to: "us" },
  { id: "arc-eu-india", from: "eu", to: "india" },
  { id: "arc-us-apac", from: "us", to: "apac" },
  { id: "arc-us-brazil", from: "us", to: "brazil" },
  { id: "arc-india-apac", from: "india", to: "apac" },
  { id: "arc-uk-us", from: "uk", to: "us" }
];

function heatColor(region: HeatRegion): THREE.Color {
  if (region.tier === "high") return new THREE.Color("#18B6A4");
  if (region.tier === "medium") return new THREE.Color("#3B82F6");
  return new THREE.Color("#7DB9FF");
}

function createHeatTexture(): THREE.CanvasTexture {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 256;
  textureCanvas.height = 256;
  const context = textureCanvas.getContext("2d");

  if (context) {
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.42, "rgba(216,244,255,0.62)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
  }

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.needsUpdate = true;
  return texture;
}

function getArcColor(index: number): THREE.Color {
  return index % 2 === 0 ? new THREE.Color("#3B82F6") : new THREE.Color("#18B6A4");
}

export function EarthComplianceHero({ className }: EarthComplianceHeroProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [webglReady, setWebglReady] = useState(false);
  const [motionReduced, setMotionReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setWebglReady(supportsWebGL());

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

    const sync = () => {
      setMotionReduced(motionQuery.matches);
      setIsMobile(mobileQuery.matches);
    };

    sync();
    motionQuery.addEventListener("change", sync);
    mobileQuery.addEventListener("change", sync);

    return () => {
      motionQuery.removeEventListener("change", sync);
      mobileQuery.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!webglReady || !hostRef.current) return;

    const host = hostRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(isMobile ? 40 : 36, 1, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 4.95 : 4.7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance"
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const segments = isMobile ? MOBILE_SEGMENTS : DESKTOP_SEGMENTS;

    const ambient = new THREE.AmbientLight("#dbe9ff", 0.7);
    const key = new THREE.DirectionalLight("#a6c7ff", 0.72);
    key.position.set(3.8, 2.2, 4);
    const fill = new THREE.PointLight("#18B6A4", 0.3);
    fill.position.set(-3, -1.5, 2.5);
    scene.add(ambient, key, fill);

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = AXIAL_TILT;
    earthGroup.position.set(isMobile ? 0 : 0.95, 0, 0);
    scene.add(earthGroup);

    const baseSphere = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS, segments, segments),
      new THREE.MeshStandardMaterial({
        color: "#0d1a49",
        emissive: "#1E2A78",
        emissiveIntensity: 0.24,
        metalness: 0.08,
        roughness: 0.88
      })
    );
    earthGroup.add(baseSphere);

    const wireSphere = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS + 0.014, segments, segments),
      new THREE.MeshBasicMaterial({
        color: "#4866b8",
        opacity: 0.2,
        transparent: true,
        wireframe: true
      })
    );
    earthGroup.add(wireSphere);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS, 36, 36),
      new THREE.MeshBasicMaterial({
        color: "#3B82F6",
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    atmosphere.scale.setScalar(1.07);
    earthGroup.add(atmosphere);

    const regionPositionMap = new Map<string, THREE.Vector3>();
    for (const region of HEAT_REGIONS) {
      regionPositionMap.set(region.id, latLonToVector3(region.lat, region.lon, EARTH_RADIUS + 0.03));
    }

    const heatTexture = createHeatTexture();
    const heatMaterials: Array<{ material: THREE.SpriteMaterial; region: HeatRegion; index: number }> = [];
    for (let index = 0; index < HEAT_REGIONS.length; index += 1) {
      const region = HEAT_REGIONS[index];
      const position = regionPositionMap.get(region.id);
      if (!position) continue;

      const material = new THREE.SpriteMaterial({
        map: heatTexture,
        color: heatColor(region),
        depthWrite: false,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: region.intensity * 0.42
      });

      const sprite = new THREE.Sprite(material);
      sprite.position.copy(position);
      sprite.scale.set(region.radius, region.radius, 1);
      earthGroup.add(sprite);
      heatMaterials.push({ material, region, index });
    }

    for (const region of HEAT_REGIONS.filter((item) => item.tier !== "low")) {
      const position = regionPositionMap.get(region.id);
      if (!position) continue;

      const pin = new THREE.Group();
      pin.position.copy(position);
      pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize());

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 10, 10),
        new THREE.MeshBasicMaterial({ color: "#edf4ff" })
      );

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.034, 0.042, 24),
        new THREE.MeshBasicMaterial({
          color: "#b3ceff",
          transparent: true,
          opacity: 0.64,
          side: THREE.DoubleSide
        })
      );

      ring.position.z = 0.006;
      pin.add(dot, ring);
      earthGroup.add(pin);
    }

    const showScanBand = !motionReduced && (!isMobile || MOBILE_SCAN_ENABLED);
    const scanBand = showScanBand
      ? new THREE.Mesh(
          new THREE.TorusGeometry(EARTH_RADIUS + 0.026, 0.012, 10, 82),
          new THREE.MeshBasicMaterial({
            color: "#8fd9ff",
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          })
        )
      : null;

    if (scanBand) {
      scanBand.rotation.x = Math.PI / 2;
      earthGroup.add(scanBand);
    }

    const showArcs = !isMobile || MOBILE_ARCS_ENABLED;
    const arcRuntimes: ArcRuntime[] = [];
    if (showArcs) {
      ARC_LINKS.forEach((link, index) => {
        const from = regionPositionMap.get(link.from);
        const to = regionPositionMap.get(link.to);
        if (!from || !to) return;

        const curve = createArcCurve(from, to, 0.5);
        const points = curve.getPoints(64);
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({
            color: "#8fb8ff",
            transparent: true,
            opacity: 0.12 + (index % 3) * 0.03
          })
        );
        earthGroup.add(line);

        if (!motionReduced) {
          const signal = new THREE.Mesh(
            new THREE.SphereGeometry(0.028, 10, 10),
            new THREE.MeshBasicMaterial({
              color: getArcColor(index),
              transparent: true,
              opacity: 0.92,
              blending: THREE.AdditiveBlending,
              depthWrite: false
            })
          );
          earthGroup.add(signal);
          arcRuntimes.push({
            curve,
            phase: (index * 0.17) % 1,
            signal,
            speed: 0.08 + index * 0.012
          });
        }
      });
    }

    const parallaxTarget = { x: 0, y: 0 };
    const parallaxCurrent = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      if (isMobile) return;
      parallaxTarget.x = event.clientX / window.innerWidth - 0.5;
      parallaxTarget.y = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    };
    window.addEventListener("resize", onResize);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const render = () => {
      const delta = clock.getDelta();
      const elapsed = clock.elapsedTime;

      parallaxCurrent.x += (parallaxTarget.x - parallaxCurrent.x) * 0.06;
      parallaxCurrent.y += (parallaxTarget.y - parallaxCurrent.y) * 0.06;

      const px = isMobile ? 0 : parallaxCurrent.x * PARALLAX_STRENGTH;
      const py = isMobile ? 0 : -parallaxCurrent.y * (PARALLAX_STRENGTH * 0.62);
      earthGroup.position.set((isMobile ? 0 : 0.95) + px, py, 0);

      if (!motionReduced) earthGroup.rotation.y += ROTATION_SPEED * delta;

      for (const item of heatMaterials) {
        const breathe = motionReduced
          ? 1
          : 0.78 + Math.sin(elapsed * HEAT_BREATHE_SPEED + item.index * 0.8) * 0.18;
        item.material.opacity = item.region.intensity * 0.46 * breathe;
      }

      if (scanBand) {
        const latitude = Math.sin(elapsed * SCAN_BAND_SPEED) * 1.02;
        const ringScale = Math.max(0.22, Math.cos(latitude));
        scanBand.position.y = Math.sin(latitude) * (EARTH_RADIUS + 0.02);
        scanBand.scale.set(ringScale, 1, ringScale);
        (scanBand.material as THREE.MeshBasicMaterial).opacity = 0.12 + Math.sin(elapsed * 0.9) * 0.03;
      }

      if (!motionReduced) {
        for (const arc of arcRuntimes) {
          const t = (elapsed * arc.speed + arc.phase) % 1;
          arc.signal.position.copy(arc.curve.getPointAt(t));
        }
      }

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };

    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Sprite) {
          if ("geometry" in obj && obj.geometry) obj.geometry.dispose();
          if ("material" in obj && obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((material) => material.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
      });

      heatTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [isMobile, motionReduced, webglReady]);

  if (!webglReady) {
    return (
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_62%_45%,rgba(59,130,246,0.2),transparent_38%),radial-gradient(circle_at_78%_28%,rgba(24,182,164,0.18),transparent_36%),linear-gradient(150deg,#050b21_0%,#101d55_52%,#070f2a_100%)]",
          className
        )}
      >
        <div className="absolute left-[68%] top-[52%] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7ea0e8]/25 bg-[radial-gradient(circle,rgba(37,75,175,0.22),rgba(16,34,90,0.1)_55%,transparent_80%)] shadow-[0_0_60px_rgba(59,130,246,0.25)]" />
      </div>
    );
  }

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="h-full w-full" ref={hostRef} />
    </div>
  );
}
