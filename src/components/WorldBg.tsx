"use client";

import { useEffect, useRef } from "react";
import styles from "./WorldBg.module.css";

/**
 * The page's backdrop: a quiet voxel valley at dusk, drawn with three.js at low resolution
 * so it reads as 3D pixel art. It stays dark and close to the page colour on purpose: it is
 * atmosphere, never a second subject. Scrolling drifts the camera slowly down the valley and
 * the sun lifts a little as the page goes on. Sections sit on top as dark glass (see .world-on in globals.css).
 *
 * Progressive: three.js is loaded after first paint; without WebGL the page keeps its flat
 * background; with reduced motion the world is drawn once and stays still.
 */
export function WorldBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let stop = () => {};
    let cancelled = false;
    import("three").then((THREE) => {
      if (cancelled) return;
      try {
        stop = start(THREE, canvas);
      } catch {
        document.documentElement.classList.remove("world-on");
      }
    });
    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  return <canvas ref={ref} className={styles.world} aria-hidden="true" />;
}

/** A see-through strip between sections: a window onto the world. Hidden when the world is off. */
export function WorldGap() {
  return <div className="world-gap" aria-hidden="true" />;
}

type Three = typeof import("three");

const S = 2; // cell size in world units
const COLS = 46;
const ROWS = 64;
const LEN = ROWS * S; // one terrain chunk, and the wrap distance for everything else
const STEP_Y = 1.15;
const TAU = Math.PI * 2;

/** deterministic 0..1 hash */
function hash(a: number, b: number) {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
/** where the valley floor sits (in cells) at a given row; periodic over ROWS so chunks tile */
function centre(row: number) {
  const t = (row / ROWS) * TAU;
  return 5 * Math.sin(t * 2) + 2 * Math.sin(t * 5 + 1.3);
}
function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function heightAt(col: number, row: number) {
  const dx = Math.abs(col - centre(row));
  const rise = smooth(3.2, 15, dx);
  const t = (row / ROWS) * TAU;
  const ridge = 0.5 + 0.5 * Math.sin(col * 0.55 + Math.sin(t * 3) * 2.2) * Math.cos(t * 4 + col * 0.21);
  return 1 + Math.round(rise * (2.5 + 9 * ridge) + rise * hash(col, row) * 1.6);
}

function start(THREE: Three, canvas: HTMLCanvasElement) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "low-power" });
  renderer.setPixelRatio(1);

  const HORIZON = new THREE.Color("#5e2040");
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(HORIZON, 24, 112);
  const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 700);

  scene.add(new THREE.HemisphereLight("#b97a9c", "#180a22", 1.15));
  const sunLight = new THREE.DirectionalLight("#ffb48a", 1.25);
  sunLight.position.set(0.3, 0.8, -1);
  scene.add(sunLight);

  /* ---- sky: a gradient dome that follows the camera */
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(520, 24, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        top: { value: new THREE.Color("#140b17") },
        mid: { value: new THREE.Color("#32133a") },
        low: { value: HORIZON },
      },
      vertexShader: "varying vec3 d; void main(){ d = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader:
        "varying vec3 d; uniform vec3 top; uniform vec3 mid; uniform vec3 low; void main(){ float h = clamp(d.y, -0.2, 1.0); vec3 c = mix(low, mid, smoothstep(0.02, 0.36, h)); c = mix(c, top, smoothstep(0.3, 0.85, h)); c = mix(c, low * 0.55, smoothstep(0.0, -0.12, h)); gl_FragColor = vec4(c, 1.0); }",
    }),
  );
  sky.renderOrder = -3;
  scene.add(sky);

  /* ---- sun: banded disc plus a soft halo, parked far down the valley */
  const sun = new THREE.Mesh(
    new THREE.CircleGeometry(30, 40),
    new THREE.ShaderMaterial({
      depthWrite: false,
      fog: false,
      vertexShader: "varying vec2 p; void main(){ p = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader:
        "varying vec2 p; void main(){ float y = p.y; vec3 a = vec3(0.93, 0.62, 0.36); vec3 b = vec3(0.86, 0.42, 0.30); vec3 c = vec3(0.70, 0.25, 0.33); vec3 col = mix(c, b, smoothstep(0.1, 0.5, y)); col = mix(col, a, smoothstep(0.45, 0.95, y)); gl_FragColor = vec4(col, 1.0); }",
    }),
  );
  sun.renderOrder = -2;
  scene.add(sun);
  const halo = new THREE.Mesh(
    new THREE.CircleGeometry(120, 40),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      fog: false,
      blending: THREE.AdditiveBlending,
      vertexShader: "varying vec2 p; void main(){ p = uv - 0.5; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "varying vec2 p; void main(){ float r = length(p) * 2.0; float g = pow(max(0.0, 1.0 - r), 2.2); gl_FragColor = vec4(vec3(1.0, 0.42, 0.3) * g * 0.26, 1.0); }",
    }),
  );
  halo.renderOrder = -2;
  scene.add(halo);

  /* ---- terrain: one chunk of voxel columns and pines, built twice and leapfrogged */
  const box = new THREE.BoxGeometry(1, 1, 1);
  const land = new THREE.MeshLambertMaterial();
  type Cube = { x: number; y: number; z: number; sx: number; sy: number; sz: number; c: InstanceType<Three["Color"]> };
  const cubes: Cube[] = [];
  const cLow = new THREE.Color("#211029");
  const cMid = new THREE.Color("#43183f");
  const cTop = new THREE.Color("#7c3049");
  const cFloor = new THREE.Color("#190c20");
  const cPine = new THREE.Color("#1b0d25");
  const cPineTip = new THREE.Color("#2c5a5c");
  for (let r = 0; r < ROWS; r++) {
    const mid = Math.round(centre(r));
    for (let i = 0; i < COLS; i++) {
      const col = mid - COLS / 2 + i;
      const h = heightAt(col, r);
      const t = Math.min(1, (h - 1) / 11);
      const c = h === 1 ? cFloor.clone() : cLow.clone().lerp(cMid, smooth(0, 0.55, t)).lerp(cTop, smooth(0.6, 1, t));
      c.offsetHSL(0, 0, (hash(col + 9, r + 3) - 0.5) * 0.05);
      cubes.push({ x: col * S, y: (h * STEP_Y) / 2, z: -r * S, sx: S, sy: h * STEP_Y, sz: S, c });
      // voxel pines on the lower slopes
      if (h > 1 && h < 8 && hash(col + 31, r + 17) > 0.86) {
        const base = h * STEP_Y;
        const tiers = [1.7, 1.15, 0.6];
        tiers.forEach((w, k) => {
          cubes.push({ x: col * S, y: base + 0.9 + k * 1.25, z: -r * S, sx: w, sy: 1.25, sz: w, c: k === 2 ? cPineTip.clone() : cPine.clone() });
        });
        cubes.push({ x: col * S, y: base + 0.2, z: -r * S, sx: 0.4, sy: 0.6, sz: 0.4, c: cFloor.clone() });
      }
    }
  }
  const m4 = new THREE.Matrix4();
  const chunk = () => {
    const mesh = new THREE.InstancedMesh(box, land, cubes.length);
    cubes.forEach((q, i) => {
      m4.makeScale(q.sx, q.sy, q.sz).setPosition(q.x, q.y, q.z);
      mesh.setMatrixAt(i, m4);
      mesh.setColorAt(i, q.c);
    });
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  };
  const chunks = [chunk(), chunk()];

  /* ---- a path of lights down the valley floor */
  const tiles: Cube[] = [];
  for (let r = 0; r < ROWS; r += 4) tiles.push({ x: centre(r) * S, y: STEP_Y + 0.06, z: -r * S, sx: 0.5, sy: 0.1, sz: 0.5, c: new THREE.Color("#d9963f") });
  const lamp = new THREE.MeshBasicMaterial({ color: "#d9963f" });
  const paths = [0, 1].map(() => {
    const mesh = new THREE.InstancedMesh(box, lamp, tiles.length);
    tiles.forEach((q, i) => {
      m4.makeScale(q.sx, q.sy, q.sz).setPosition(q.x, q.y, q.z);
      mesh.setMatrixAt(i, m4);
    });
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  });

  /* ---- voxel clouds, far out and slow */
  const cloudMat = new THREE.MeshBasicMaterial({ color: "#6a2a52", transparent: true, opacity: 0.4 });
  const clouds = Array.from({ length: 6 }, (_, i) => {
    const g = new THREE.Group();
    const parts = 2 + Math.floor(hash(i, 23) * 3);
    for (let k = 0; k < parts; k++) {
      const part = new THREE.Mesh(box, cloudMat);
      part.scale.set(9 + hash(i, k + 29) * 9, 1.6, 4);
      part.position.set((k - parts / 2) * 6, k % 2 ? 1.6 : 0, 0);
      g.add(part);
    }
    scene.add(g);
    return { g, d0: (i / 6) * LEN * 2 + hash(i, 31) * 9, x: (i % 2 ? 1 : -1) * (26 + hash(i, 37) * 60), y: 26 + hash(i, 41) * 22 };
  });

  /* ---- state */
  let travel = 0;
  let target = 0;
  let px = 0;
  let py = 0;
  let tx = 0;
  let ty = 0;
  let progress = 0;
  let raf = 0;
  let last = performance.now();
  let drift = 0;
  let visible = true;

  const mod = (a: number, n: number) => ((a % n) + n) % n;
  const resize = () => {
    const q = window.innerWidth >= 900 ? 4 : 3;
    const w = Math.max(160, Math.ceil(window.innerWidth / q));
    const h = Math.max(120, Math.ceil(window.innerHeight / q));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < h ? 74 : 62;
    camera.updateProjectionMatrix();
  };
  const readScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress = Math.min(1, window.scrollY / max);
    target = window.scrollY * 0.012;
  };
  const onPointer = (e: PointerEvent) => {
    tx = e.clientX / window.innerWidth - 0.5;
    ty = e.clientY / window.innerHeight - 0.5;
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const time = now / 1000;
    if (!reduce) drift += dt * 0.3;
    const goal = target + drift;
    travel += (goal - travel) * (reduce ? 1 : Math.min(1, dt * 4.5));
    px += (tx - px) * 0.03;
    py += (ty - py) * 0.03;

    const z = -travel;
    const row = travel / S;
    const camX = centre(row) * S;
    camera.position.set(camX + px * 0.8, 5 + Math.sin(time * 0.5) * 0.08 - py * 0.4, z);
    camera.lookAt(centre(row + 9) * S + px * 2.4, 6.2 - py * 1.1 + progress * 1.2, z - 18);

    const k = Math.floor(travel / LEN);
    chunks[0].position.z = paths[0].position.z = -k * LEN;
    chunks[1].position.z = paths[1].position.z = -(k + 1) * LEN;

    sky.position.copy(camera.position);
    const sunY = 10 + progress * 22;
    sun.position.set(camera.position.x * 0.2, sunY, z - 330);
    halo.position.set(sun.position.x, sunY + 3, z - 331);

    for (const c of clouds) {
      const d = mod(c.d0 - travel * 0.35, LEN * 2);
      c.g.position.set(camera.position.x + c.x, c.y, z - 40 - d);
    }
    renderer.render(scene, camera);
  };
  const loop = (now: number) => {
    raf = 0;
    if (!visible) return;
    frame(now);
    if (!reduce) raf = requestAnimationFrame(loop);
  };
  const kick = () => {
    if (!raf && visible) raf = requestAnimationFrame(loop);
  };
  const onScroll = () => {
    readScroll();
    if (reduce) kick();
  };
  const onResize = () => {
    resize();
    readScroll();
    kick();
  };
  const onVisibility = () => {
    visible = document.visibilityState === "visible";
    last = performance.now();
    kick();
  };

  resize();
  readScroll();
  travel = target;
  frame(performance.now());
  document.documentElement.classList.add("world-on");
  canvas.classList.add(styles.ready);
  kick();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("pointermove", onPointer, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    document.documentElement.classList.remove("world-on");
    renderer.dispose();
  };
}
