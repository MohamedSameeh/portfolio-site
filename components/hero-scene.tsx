"use client";

import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Component, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* Pointer position in -1..1, shared with the render loop. The canvas sits
   behind the page content, so the listener lives on the window. */
const pointer = { x: 0, y: 0 };

/* Clock for the knot's vertex shader. One hero, one sculpture, one uniform. */
const knotUniforms = { uTime: { value: 0 } };

/* Five beads, one per agent in the lead project. Radius, speed, phase, size. */
const BEADS = [
  { r: 2.02, speed: 0.22, phase: 0.4, size: 0.05, lift: 0.5 },
  { r: 2.3, speed: -0.16, phase: 1.9, size: 0.038, lift: -0.7 },
  { r: 1.86, speed: 0.3, phase: 3.3, size: 0.044, lift: 0.9 },
  { r: 2.42, speed: 0.12, phase: 4.6, size: 0.062, lift: -0.3 },
  { r: 2.12, speed: -0.26, phase: 5.5, size: 0.034, lift: 0.2 },
] as const;

function Sculpture({ rtl, animate }: { rtl: boolean; animate: boolean }) {
  const rig = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const cage = useRef<THREE.LineSegments>(null);
  const rings = useRef<THREE.Group>(null);
  const beads = useRef<(THREE.Mesh | null)[]>([]);
  const time = useRef(0);
  const settled = useRef(false);

  const knotMaterial = useMemo(() => {
    const material = new THREE.MeshPhysicalMaterial({
      color: "#0a0e15",
      metalness: 1,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
      iridescence: 0.42,
      iridescenceIOR: 1.45,
      iridescenceThicknessRange: [180, 420],
      envMapIntensity: 1.9,
    });
    // A slow breathing displacement along the normals: the surface is never
    // quite still, which is what makes the reflections travel.
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = knotUniforms.uTime;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nuniform float uTime;")
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          float wave = sin(position.x * 2.4 + uTime * 0.9)
                     * sin(position.y * 2.1 + uTime * 0.7)
                     * sin(position.z * 2.7 + uTime * 1.1);
          transformed += normal * wave * 0.05;`,
        );
    };
    return material;
  }, []);

  const cageGeometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.92, 1)),
    [],
  );

  useEffect(() => {
    return () => {
      knotMaterial.dispose();
      cageGeometry.dispose();
    };
  }, [knotMaterial, cageGeometry]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (animate) time.current += dt;
    const t = time.current;
    knotUniforms.uTime.value = t;

    const { width, height } = state.viewport;
    const compact = state.size.width < 900;
    const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.6);

    // The sculpture sits on the trailing side of the headline, and crosses
    // the stage when the language (and the reading direction) flips.
    const side = rtl ? -1 : 1;
    const targetX = compact ? 0 : side * width * 0.245;
    const targetY = (compact ? height * 0.3 : height * 0.02) + scroll * 1.1;
    const targetScale = compact ? Math.min(width / 3.3, 0.74) : Math.min(height / 4.55, 0.86);

    const g = rig.current;
    if (g) {
      if (!settled.current) {
        g.position.set(targetX, targetY, 0);
        g.scale.setScalar(targetScale);
        settled.current = true;
      } else {
        g.position.x = THREE.MathUtils.damp(g.position.x, targetX, 2.6, dt);
        g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 6, dt);
        g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, targetScale, 4, dt));
      }
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.x * 0.42, 2.4, dt);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.y * 0.26 + scroll * 0.35, 2.4, dt);
    }

    if (knot.current) {
      knot.current.rotation.x = 0.62 + t * 0.11 + scroll * 0.9;
      knot.current.rotation.y = 0.35 + t * 0.17;
      knot.current.rotation.z = -0.2 + t * 0.05;
    }
    if (cage.current) {
      cage.current.rotation.y = 0.3 - t * 0.045;
      cage.current.rotation.x = 0.42 + t * 0.03;
    }
    if (rings.current) {
      rings.current.rotation.z = t * 0.04;
    }
    BEADS.forEach((b, i) => {
      const mesh = beads.current[i];
      if (!mesh) return;
      const a = b.phase + t * b.speed;
      mesh.position.set(Math.cos(a) * b.r, Math.sin(a * 1.3 + b.phase) * 0.55 + b.lift * 0.6, Math.sin(a) * b.r);
    });
  });

  return (
    <group ref={rig}>
      <mesh ref={knot} material={knotMaterial}>
        <torusKnotGeometry args={[1.06, 0.27, 420, 64, 2, 3]} />
      </mesh>

      <lineSegments ref={cage} geometry={cageGeometry}>
        <lineBasicMaterial color="#a9c4e0" transparent opacity={0.17} />
      </lineSegments>

      <group ref={rings}>
        <mesh rotation={[1.25, 0.18, 0]}>
          <torusGeometry args={[2.16, 0.0045, 8, 220]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[1.9, -0.5, 0.3]}>
          <torusGeometry args={[2.42, 0.003, 8, 220]} />
          <meshBasicMaterial color="#e2e8f0" transparent opacity={0.16} />
        </mesh>
      </group>

      <group rotation={[0.35, 0, 0.18]}>
        {BEADS.map((b, i) => (
          <mesh
            key={i}
            ref={(m) => {
              beads.current[i] = m;
            }}
          >
            <sphereGeometry args={[b.size, 32, 32]} />
            <meshPhysicalMaterial
              color={i === 3 ? "#7dd3fc" : "#cfe3f7"}
              emissive={i === 3 ? "#38bdf8" : "#7fb6dd"}
              emissiveIntensity={i === 3 ? 1.6 : 0.35}
              metalness={0}
              roughness={0.45}
              envMapIntensity={0.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* Studio lighting, built in code so nothing is fetched: a large softbox key,
   a cyan rim strip behind, a cool kicker, and a warm bounce from below. */
function Studio() {
  return (
    <>
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#04050a"]} />
        <Lightformer form="rect" intensity={5.2} color="#ffffff" position={[-4, 5, 4]} scale={[7, 3.4, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={11} color="#38bdf8" position={[5.5, 0.6, -5]} scale={[1.6, 9, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3.2} color="#93c5fd" position={[-6.5, -1.5, -3]} scale={[1.8, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={1.5} color="#ffe6cc" position={[0.5, -5.5, 2]} scale={4.2} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.1} color="#e0ecff" position={[0, 0.5, 7]} scale={[11, 0.8, 1]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={2.2} color="#ffffff" position={[3.5, 4.5, 2.5]} scale={1.6} target={[0, 0, 0]} />
      </Environment>
      <directionalLight position={[4, 5, 4]} intensity={0.9} />
      <pointLight position={[3.2, 0.4, -3.4]} intensity={26} color="#38bdf8" />
    </>
  );
}

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function HeroScene({
  rtl,
  animate,
  fallback,
}: {
  rtl: boolean;
  animate: boolean;
  fallback: ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  // Never render more pixels than the screen has. Start at 1.5x at most and
  // let the monitor raise or lower it from the measured frame rate.
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio || 1, 1.5));
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Stop rendering once the hero has scrolled away.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={host}
      className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
      style={{ opacity: shown ? 1 : 0 }}
    >
      <SceneBoundary fallback={fallback}>
        <Canvas
          dpr={dpr}
          camera={{ position: [0, 0, 6.5], fov: 32 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={!visible ? "never" : animate ? "always" : "demand"}
          onCreated={() => {
            requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
          }}
        >
          <PerformanceMonitor
            flipflops={2}
            onDecline={() => setDpr(1)}
            onIncline={() => setDpr(Math.min(window.devicePixelRatio || 1, 1.5))}
            onFallback={() => setDpr(1)}
          />
          <Studio />
          <Sculpture rtl={rtl} animate={animate} />
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
