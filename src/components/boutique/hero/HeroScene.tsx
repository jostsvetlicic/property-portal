"use client";

import { Component, Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Float,
  RoundedBox,
  AdaptiveDpr,
  useGLTF,
} from "@react-three/drei";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { heroProgress } from "./heroProgress";

/*
 * Cinematic 3D hero centerpiece.
 *
 * A slowly rotating luxury villa (loaded from /models/villa.glb) cradled by
 * three tilted champagne-gold rings, lit by in-scene lightformers plus a soft
 * gold rim light (no network HDRI, so it works offline and stays on-brand). A
 * drifting dust-light field adds atmosphere; the whole group tilts gently toward
 * the cursor. Depth of field, a whisper of bloom on the gold and a soft vignette
 * finish the frame.
 *
 * The villa is auto-centered and auto-scaled, so any .glb export size just fits.
 * Until the file is present it falls back to an elegant gold monolith, so the
 * hero never looks broken.
 *
 * Performance: capped DPR + AdaptiveDpr, modest particle count. Honors
 * prefers-reduced-motion.
 */

/** Drop your villa model here → public/models/villa.glb  (served at this URL). */
const MODEL_PATH = "/models/villa.glb";

const GOLD = "#C9A24B";
const GOLD_SOFT = "#DCBD7A";
const CREAM = "#F5F1E8";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The luxury villa, loaded from /models/villa.glb.
 *
 * Auto-centered and auto-scaled from its bounding box so any export size fits
 * the frame. Meshes get a gentle envMap boost + shadows for the cinematic,
 * gold-lit look. `useGLTF` suspends while loading and throws if the file is
 * missing — handled by the Suspense boundary + <ModelBoundary> in <Centerpiece>.
 */
function Villa() {
  const { scene } = useGLTF(MODEL_PATH);

  const model = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && "envMapIntensity" in mat) mat.envMapIntensity = 1.15;
      }
    });

    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    // Target ~3.4 world units on the longest side to sit nicely inside the rings.
    const scale = 3.4 / maxDim;

    return { cloned, center, scale };
  }, [scene]);

  return (
    <group scale={model.scale}>
      <primitive
        object={model.cloned}
        position={[-model.center.x, -model.center.y, -model.center.z]}
      />
    </group>
  );
}
useGLTF.preload(MODEL_PATH);

/** Elegant gold monolith shown while the villa loads, or if the file is absent. */
function PlaceholderForm() {
  return (
    <>
      <RoundedBox args={[1.15, 2.15, 1.15]} radius={0.16} smoothness={8} castShadow>
        <meshStandardMaterial
          color={GOLD}
          metalness={1}
          roughness={0.18}
          envMapIntensity={1.4}
        />
      </RoundedBox>
      <mesh>
        <cylinderGeometry args={[0.34, 0.34, 2.55, 64]} />
        <meshStandardMaterial
          color={CREAM}
          metalness={0.35}
          roughness={0.35}
          envMapIntensity={0.8}
        />
      </mesh>
    </>
  );
}

/** Catches a failed model load (e.g. file not yet added) → renders the fallback. */
class ModelBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** The villa (or fallback) cradled by orbiting rings, floating + slow-rotating. */
function Centerpiece({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reduced) return;
    if (group.current) group.current.rotation.y += delta * 0.12;
    if (rings.current) {
      rings.current.rotation.z += delta * 0.06;
      rings.current.rotation.x += delta * 0.03;
    }
  });

  return (
    <Float
      speed={reduced ? 0 : 1.1}
      rotationIntensity={reduced ? 0 : 0.3}
      floatIntensity={reduced ? 0 : 0.6}
      floatingRange={[-0.08, 0.08]}
    >
      <group ref={group}>
        {/* The villa model — falls back to the monolith until the .glb exists. */}
        <ModelBoundary fallback={<PlaceholderForm />}>
          <Suspense fallback={<PlaceholderForm />}>
            <Villa />
          </Suspense>
        </ModelBoundary>

        {/* Three tilted concentric rings — the architectural gesture. */}
        <group ref={rings}>
          {[2.05, 2.45, 2.9].map((r, i) => (
            <mesh key={r} rotation={[Math.PI / 2 + i * 0.5, i * 0.6, i * 0.3]}>
              <torusGeometry args={[r, 0.018 + i * 0.004, 24, 220]} />
              <meshStandardMaterial
                color={i === 1 ? GOLD_SOFT : GOLD}
                metalness={1}
                roughness={0.12}
                envMapIntensity={1.6}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
}

/** Drifting champagne dust-light field for atmosphere. */
function DustField({ count = 600, reduced }: { count?: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      speeds[i] = 0.02 + Math.random() * 0.06;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((state, delta) => {
    if (reduced || !ref.current) return;
    const arr = ref.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta * 2.2;
      // slight horizontal sway
      arr[i * 3] += Math.sin(state.clock.elapsedTime * 0.3 + i) * delta * 0.02;
      if (arr[i * 3 + 1] > 6) arr[i * 3 + 1] = -6;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(245,241,232,1)");
    g.addColorStop(0.35, "rgba(220,189,122,0.6)");
    g.addColorStop(1, "rgba(220,189,122,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={0.09}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Smoothly tilts the scene toward the pointer for a parallax feel. */
function CursorParallax({
  children,
  reduced,
}: {
  children: React.ReactNode;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!ref.current) return;
    const tx = reduced ? 0 : pointer.y * 0.18;
    const ty = reduced ? 0 : pointer.x * 0.28;
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      tx,
      0.05,
    );
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      ty,
      0.05,
    );
  });

  return <group ref={ref}>{children}</group>;
}

/** In-scene studio lighting — soft champagne reflections without any HDRI. */
function StudioLighting() {
  return (
    <Environment resolution={256}>
      {/* Broad soft key from top. */}
      <Lightformer
        intensity={2.2}
        color={CREAM}
        position={[0, 5, -2]}
        scale={[10, 6, 1]}
      />
      {/* Warm gold rim from the right. */}
      <Lightformer
        intensity={3}
        color={GOLD_SOFT}
        position={[5, 1, 1]}
        scale={[3, 8, 1]}
      />
      {/* Cool cream fill from the left for dimensionality. */}
      <Lightformer
        intensity={1.4}
        color={CREAM}
        position={[-6, 0, 2]}
        scale={[3, 8, 1]}
      />
      {/* Subtle bottom bounce. */}
      <Lightformer
        intensity={1}
        color={GOLD}
        position={[0, -5, 1]}
        scale={[8, 3, 1]}
      />
    </Environment>
  );
}

/*
 * Camera fly-in. Reads the shared 0→1 scroll progress (written by the pinned
 * ScrollTrigger in <CinematicHero>) and, each frame, damps the camera from a far
 * wide shot toward the villa — like descending onto the property.
 *
 * Two layers of smoothing keep it buttery: the ScrollTrigger scrub eases the raw
 * scroll, and THREE.MathUtils.damp eases the camera toward that eased target — so
 * even a flicked scroll wheel resolves into a slow, expensive glide, never a jerk.
 */
const FAR = { z: 13.5, y: 0.7 }; // wide establishing shot
const NEAR = { z: 3.7, y: 0 }; //  close, cradled by the rings

function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state, delta) => {
    // Reduced-motion: hold a pleasant, static mid framing (no scroll drive).
    const p = reduced ? 0.6 : heroProgress.current;
    const targetZ = THREE.MathUtils.lerp(FAR.z, NEAR.z, p);
    const targetY = THREE.MathUtils.lerp(FAR.y, NEAR.y, p);

    const cam = state.camera;
    cam.position.z = THREE.MathUtils.damp(cam.position.z, targetZ, 4, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, targetY, 4, delta);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({ reduced }: { reduced: boolean }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      {/* Warm key from the front-right. */}
      <spotLight
        position={[6, 8, 6]}
        angle={0.4}
        penumbra={1}
        intensity={1.2}
        color={GOLD_SOFT}
      />
      {/* Soft gold rim light from behind, to trace the villa's silhouette. */}
      <directionalLight
        position={[-5, 5, -6]}
        intensity={2.4}
        color={GOLD}
      />
      <pointLight position={[0, 3, -4]} intensity={1.1} color={GOLD_SOFT} />

      <StudioLighting />

      <CameraRig reduced={reduced} />

      <CursorParallax reduced={reduced}>
        <Centerpiece reduced={reduced} />
        <DustField reduced={reduced} />
      </CursorParallax>

      <EffectComposer enableNormalPass={false}>
        <DepthOfField
          target={[0, 0, 0]}
          focalLength={0.045}
          bokehScale={4}
          height={480}
        />
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.65}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.28} darkness={0.85} />
      </EffectComposer>

      <AdaptiveDpr pixelated={false} />
    </>
  );
}

export default function HeroScene() {
  const [reduced] = useState(prefersReducedMotion);

  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.75]}
      camera={{ position: [0, FAR.y, FAR.z], fov: 34 }}
      style={{ background: "transparent" }}
    >
      <Scene reduced={reduced} />
    </Canvas>
  );
}
