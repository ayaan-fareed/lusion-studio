"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import AstronautModel from "./AstronautModel";

interface ClimaxAstronautSceneProps {
  scrollProgress?: number;
}

const PARTICLE_COUNT = 240;

export default function ClimaxAstronautScene({ scrollProgress = 0 }: ClimaxAstronautSceneProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Procedural Starfield / Cosmic Dust Points
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const cyan = new THREE.Color("#2DE2E6");
    const white = new THREE.Color("#FFFFFF");
    const violet = new THREE.Color("#A78BFA");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Cylindrical / spherical volume around camera
      const theta = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 6.5;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const y = (Math.random() - 0.5) * 8.0;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color distribution: 50% white, 35% cyan, 15% violet
      const r = Math.random();
      const chosenColor = r < 0.5 ? white : r < 0.85 ? cyan : violet;

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return { positions: pos, colors: col };
  }, []);

  // Create buffer geometry with attributes
  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  const particleTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.3, "rgba(255, 255, 255, 0.7)");
      grad.addColorStop(0.8, "rgba(45, 226, 230, 0.2)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = false;
    return tex;
  }, []);

  useEffect(() => {
    return () => {
      pointsGeometry.dispose();
      if (particleTexture) particleTexture.dispose();
    };
  }, [pointsGeometry, particleTexture]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (pointsRef.current) {
      // Cosmic rotation
      pointsRef.current.rotation.y = time * 0.035;
      pointsRef.current.rotation.x = Math.sin(time * 0.02) * 0.05;
    }
  });

  return (
    <>
      {/* Studio Cosmic Lighting Rig */}
      <ambientLight intensity={0.65} color="#16182E" />
      {/* Main Crisp Key Light */}
      <directionalLight position={[6, 8, 5]} intensity={2.2} color="#FFFFFF" />
      {/* Signature Studio Cyan Rim Light */}
      <directionalLight position={[-6, -4, -3]} intensity={3.0} color="#2DE2E6" />
      {/* Soft Blush Warm Fill */}
      <directionalLight position={[-4, 4, 3]} intensity={0.7} color="#F2E6E6" />
      {/* Visor Iridescence Specular Highlight Point */}
      <pointLight position={[0, 1.4, 2.2]} intensity={1.5} distance={8} color="#FFFFFF" />

      {/* Cosmic Dust / Starfield */}
      {particleTexture && (
        <points ref={pointsRef} geometry={pointsGeometry}>
          <pointsMaterial
            size={0.14}
            map={particleTexture}
            vertexColors
            transparent
            opacity={0.8}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* EVA Astronaut Model */}
      <AstronautModel scrollProgress={scrollProgress} />
    </>
  );
}
