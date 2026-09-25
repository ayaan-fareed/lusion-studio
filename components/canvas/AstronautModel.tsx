"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface AstronautModelProps {
  scrollProgress?: number;
}

/**
 * Creates high-DPI canvas texture for floating orbital badges.
 */
function createBadgeTexture(tag: string, title: string, accentHex: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 144;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Clear background
    ctx.clearRect(0, 0, 512, 144);

    // Pill background with glassmorphic border
    const radius = 28;
    const x = 8;
    const y = 8;
    const w = 496;
    const h = 128;

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fillStyle = "rgba(10, 12, 18, 0.88)";
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = accentHex;
    ctx.stroke();

    // Subtle glow line at top
    const grad = ctx.createLinearGradient(x, y, x + w, y);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.4)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(x + 40, y + 2, w - 80, 2);

    // Accent dot
    ctx.beginPath();
    ctx.arc(44, 72, 8, 0, Math.PI * 2);
    ctx.fillStyle = accentHex;
    ctx.fill();

    // Tag text (mono)
    ctx.font = "600 18px monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.fillText(tag.toUpperCase(), 72, 54);

    // Title text
    ctx.font = "700 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(title, 72, 94);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

export default function AstronautModel({ scrollProgress = 0 }: AstronautModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const astronautRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const badgesGroupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Materials definitions
  const suitMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#E2E3EB"),
        roughness: 0.32,
        metalness: 0.08,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
      }),
    []
  );

  const darkTrimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1B1C24"),
        roughness: 0.3,
        metalness: 0.75,
      }),
    []
  );

  const visorMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#080B14"),
        roughness: 0.03,
        metalness: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        reflectivity: 1.0,
        ior: 1.6,
        sheen: 0.9,
        sheenColor: new THREE.Color("#2DE2E6"),
        iridescence: 0.85,
        iridescenceIOR: 1.45,
      }),
    []
  );

  const cyanGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#2DE2E6"),
      }),
    []
  );

  const amberGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#FF9F1C"),
      }),
    []
  );

  // Generate orbital badges textures
  const badgeTextures = useMemo(() => {
    if (typeof window === "undefined") return [];
    return [
      {
        texture: createBadgeTexture("Engine", "60 FPS RENDER LOOP", "#2DE2E6"),
        radius: 2.8,
        speed: 0.45,
        phase: 0,
        yOffset: 0.6,
      },
      {
        texture: createBadgeTexture("Stack", "THREE.JS + SHADERS", "#A78BFA"),
        radius: 3.1,
        speed: 0.38,
        phase: Math.PI * 0.5,
        yOffset: -0.4,
      },
      {
        texture: createBadgeTexture("Physics", "ZERO-G DRIFT", "#F2E6E6"),
        radius: 2.7,
        speed: 0.52,
        phase: Math.PI,
        yOffset: 0.8,
      },
      {
        texture: createBadgeTexture("Aesthetic", "CLEAN-ROOM CRAFT", "#2DE2E6"),
        radius: 3.0,
        speed: 0.42,
        phase: Math.PI * 1.5,
        yOffset: -0.7,
      },
    ];
  }, []);

  // Cleanup textures on unmount
  useEffect(() => {
    return () => {
      badgeTextures.forEach((b) => b.texture.dispose());
      suitMaterial.dispose();
      darkTrimMaterial.dispose();
      visorMaterial.dispose();
      cyanGlowMaterial.dispose();
      amberGlowMaterial.dispose();
    };
  }, [badgeTextures, suitMaterial, darkTrimMaterial, visorMaterial, cyanGlowMaterial, amberGlowMaterial]);

  // Dynamic animation frame
  const currentRotY = useRef(0);
  const currentRotX = useRef(0);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    // Target rotation based on pointer and scroll progress
    const pointerX = (state.pointer.x * viewport.width) / 14;
    const pointerY = (state.pointer.y * viewport.height) / 14;

    // Scroll progress influence
    // At scrollProgress = 0, astronaut is lower and angled slightly away
    // At scrollProgress = 0.5, astronaut faces forward and floats directly in center
    // At scrollProgress = 1.0, astronaut elevates upward
    const scrollRotY = (scrollProgress - 0.4) * 1.4;
    const scrollPosY = (scrollProgress - 0.5) * 1.8;

    // Smooth lerp to pointer
    currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, pointerX * 0.4 + scrollRotY, dt * 3.5);
    currentRotX.current = THREE.MathUtils.lerp(currentRotX.current, -pointerY * 0.35, dt * 3.5);

    if (astronautRef.current) {
      // Weightless micro-buoyancy oscillation
      const floatY = Math.sin(time * 1.2) * 0.08 + scrollPosY;
      const floatX = Math.cos(time * 0.9) * 0.04;
      const rollZ = Math.sin(time * 0.8) * 0.04;

      astronautRef.current.position.y = floatY;
      astronautRef.current.position.x = floatX;
      astronautRef.current.rotation.y = currentRotY.current;
      astronautRef.current.rotation.x = currentRotX.current;
      astronautRef.current.rotation.z = rollZ;
    }

    // Subtle head tracking
    if (headRef.current) {
      headRef.current.rotation.y = currentRotY.current * 0.4 + Math.sin(time * 0.7) * 0.03;
      headRef.current.rotation.x = currentRotX.current * 0.35 + Math.cos(time * 0.8) * 0.02;
    }

    // Floating arm kinematics
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = -0.35 + Math.sin(time * 1.1) * 0.05;
      leftArmRef.current.rotation.x = 0.2 + Math.cos(time * 0.9) * 0.04;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = 0.42 + Math.cos(time * 1.0) * 0.06;
      rightArmRef.current.rotation.x = -0.15 + Math.sin(time * 0.85) * 0.05;
    }

    // Orbiting badges rotation
    if (badgesGroupRef.current) {
      badgesGroupRef.current.children.forEach((child, idx) => {
        const badgeData = badgeTextures[idx];
        if (!badgeData) return;
        const angle = time * badgeData.speed + badgeData.phase;
        child.position.x = Math.cos(angle) * badgeData.radius;
        child.position.z = Math.sin(angle) * (badgeData.radius * 0.8);
        child.position.y = badgeData.yOffset + Math.sin(time * 1.5 + idx) * 0.12;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* 3D EVA Astronaut Hierarchy */}
      <group ref={astronautRef} position={[0, -0.35, 0]} scale={[1.15, 1.15, 1.15]}>
        {/* === HEAD & HELMET === */}
        <group ref={headRef} position={[0, 1.25, 0]}>
          {/* Outer Helmet Dome */}
          <mesh material={suitMaterial}>
            <sphereGeometry args={[0.62, 32, 28]} />
          </mesh>

          {/* Helmet Neck Collar Gasket */}
          <mesh position={[0, -0.48, 0]} rotation={[Math.PI / 2, 0, 0]} material={darkTrimMaterial}>
            <torusGeometry args={[0.48, 0.07, 16, 32]} />
          </mesh>

          {/* Bulbous Curved Visor */}
          <mesh position={[0, 0.04, 0.22]} rotation={[Math.PI / 2, 0, 0]} material={visorMaterial}>
            <sphereGeometry args={[0.5, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
          </mesh>

          {/* Visor Bezel / Rim Frame */}
          <mesh position={[0, 0.04, 0.22]} rotation={[Math.PI / 2, 0, 0]} material={darkTrimMaterial}>
            <torusGeometry args={[0.505, 0.025, 12, 36, Math.PI * 1.9]} />
          </mesh>

          {/* Helmet Side Light Pods (Left & Right) */}
          <mesh position={[-0.6, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} material={darkTrimMaterial}>
            <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
          </mesh>
          <mesh position={[-0.67, 0.05, 0]} material={cyanGlowMaterial}>
            <sphereGeometry args={[0.045, 16, 16]} />
          </mesh>

          <mesh position={[0.6, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} material={darkTrimMaterial}>
            <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
          </mesh>
          <mesh position={[0.67, 0.05, 0]} material={cyanGlowMaterial}>
            <sphereGeometry args={[0.045, 16, 16]} />
          </mesh>
        </group>

        {/* === TORSO & SUIT BODY === */}
        <group position={[0, 0.2, 0]}>
          {/* Main Chest Volume */}
          <mesh material={suitMaterial} scale={[1, 1, 0.85]}>
            <cylinderGeometry args={[0.54, 0.44, 1.25, 24]} />
          </mesh>

          {/* Chest Life-Support Control Console */}
          <group position={[0, 0.05, 0.42]}>
            {/* Console Base Box */}
            <mesh material={darkTrimMaterial}>
              <boxGeometry args={[0.48, 0.38, 0.14]} />
            </mesh>

            {/* Glowing Status Indicator Lights */}
            <mesh position={[-0.14, 0.08, 0.08]} material={cyanGlowMaterial}>
              <boxGeometry args={[0.06, 0.06, 0.02]} />
            </mesh>
            <mesh position={[-0.04, 0.08, 0.08]} material={amberGlowMaterial}>
              <boxGeometry args={[0.06, 0.06, 0.02]} />
            </mesh>
            <mesh position={[0.06, 0.08, 0.08]} material={cyanGlowMaterial}>
              <boxGeometry args={[0.06, 0.06, 0.02]} />
            </mesh>

            {/* Display Readout Strip */}
            <mesh position={[0, -0.06, 0.08]} material={darkTrimMaterial}>
              <planeGeometry args={[0.36, 0.1]} />
            </mesh>
          </group>

          {/* Waist Utility Belt */}
          <mesh position={[0, -0.64, 0]} material={darkTrimMaterial} scale={[1, 1, 0.86]}>
            <cylinderGeometry args={[0.46, 0.46, 0.14, 24]} />
          </mesh>
        </group>

        {/* === BACKPACK / LIFE SUPPORT UNIT (PLSS) === */}
        <group position={[0, 0.28, -0.46]}>
          {/* Main Pack Block */}
          <mesh material={suitMaterial}>
            <boxGeometry args={[0.82, 1.15, 0.38]} />
          </mesh>
          <mesh position={[0, 0, 0.19]} material={darkTrimMaterial}>
            <boxGeometry args={[0.76, 1.05, 0.04]} />
          </mesh>

          {/* Oxygen Cylinder Left */}
          <mesh position={[-0.44, 0.05, 0]} material={darkTrimMaterial}>
            <cylinderGeometry args={[0.13, 0.13, 0.95, 16]} />
          </mesh>
          <mesh position={[-0.44, 0.54, 0]} material={suitMaterial}>
            <sphereGeometry args={[0.13, 16, 16]} />
          </mesh>

          {/* Oxygen Cylinder Right */}
          <mesh position={[0.44, 0.05, 0]} material={darkTrimMaterial}>
            <cylinderGeometry args={[0.13, 0.13, 0.95, 16]} />
          </mesh>
          <mesh position={[0.44, 0.54, 0]} material={suitMaterial}>
            <sphereGeometry args={[0.13, 16, 16]} />
          </mesh>

          {/* Dual Thruster Nozzles at Bottom */}
          <group position={[-0.24, -0.64, 0]}>
            <mesh rotation={[Math.PI, 0, 0]} material={darkTrimMaterial}>
              <coneGeometry args={[0.1, 0.18, 16]} />
            </mesh>
            <mesh position={[0, -0.1, 0]} material={cyanGlowMaterial}>
              <sphereGeometry args={[0.04, 16, 16]} />
            </mesh>
          </group>

          <group position={[0.24, -0.64, 0]}>
            <mesh rotation={[Math.PI, 0, 0]} material={darkTrimMaterial}>
              <coneGeometry args={[0.1, 0.18, 16]} />
            </mesh>
            <mesh position={[0, -0.1, 0]} material={cyanGlowMaterial}>
              <sphereGeometry args={[0.04, 16, 16]} />
            </mesh>
          </group>
        </group>

        {/* === LEFT ARM (WEIGHTLESS POISE) === */}
        <group ref={leftArmRef} position={[-0.62, 0.65, 0]}>
          {/* Shoulder Pauldron */}
          <mesh material={suitMaterial}>
            <sphereGeometry args={[0.2, 16, 16]} />
          </mesh>
          {/* Upper Arm */}
          <mesh position={[-0.12, -0.28, 0.04]} rotation={[0, 0, 0.35]} material={suitMaterial}>
            <cylinderGeometry args={[0.14, 0.12, 0.48, 16]} />
          </mesh>
          {/* Elbow Joint */}
          <mesh position={[-0.22, -0.54, 0.08]} material={darkTrimMaterial}>
            <sphereGeometry args={[0.12, 16, 16]} />
          </mesh>
          {/* Forearm & Glove */}
          <mesh position={[-0.28, -0.82, 0.14]} rotation={[0.2, 0, 0.45]} material={suitMaterial}>
            <cylinderGeometry args={[0.12, 0.11, 0.44, 16]} />
          </mesh>
          <mesh position={[-0.34, -1.08, 0.2]} material={darkTrimMaterial}>
            <boxGeometry args={[0.16, 0.18, 0.14]} />
          </mesh>
        </group>

        {/* === RIGHT ARM (GENTLY REACHING FORWARD) === */}
        <group ref={rightArmRef} position={[0.62, 0.65, 0]}>
          {/* Shoulder Pauldron */}
          <mesh material={suitMaterial}>
            <sphereGeometry args={[0.2, 16, 16]} />
          </mesh>
          {/* Upper Arm */}
          <mesh position={[0.14, -0.26, 0.08]} rotation={[-0.2, 0, -0.38]} material={suitMaterial}>
            <cylinderGeometry args={[0.14, 0.12, 0.48, 16]} />
          </mesh>
          {/* Elbow Joint */}
          <mesh position={[0.24, -0.52, 0.16]} material={darkTrimMaterial}>
            <sphereGeometry args={[0.12, 16, 16]} />
          </mesh>
          {/* Forearm & Glove */}
          <mesh position={[0.3, -0.78, 0.26]} rotation={[-0.3, 0, -0.42]} material={suitMaterial}>
            <cylinderGeometry args={[0.12, 0.11, 0.44, 16]} />
          </mesh>
          <mesh position={[0.36, -1.02, 0.34]} material={darkTrimMaterial}>
            <boxGeometry args={[0.16, 0.18, 0.14]} />
          </mesh>
        </group>

        {/* === LEGS & BOOTS (MICROGRAVITY SPREAD) === */}
        <group position={[0, -0.55, 0]}>
          {/* Left Leg */}
          <group position={[-0.26, -0.15, 0]} rotation={[0.15, 0, 0.15]}>
            {/* Thigh */}
            <mesh position={[0, -0.32, 0]} material={suitMaterial}>
              <cylinderGeometry args={[0.17, 0.14, 0.58, 16]} />
            </mesh>
            {/* Knee Pad */}
            <mesh position={[0, -0.62, 0.08]} material={darkTrimMaterial}>
              <boxGeometry args={[0.18, 0.16, 0.1]} />
            </mesh>
            {/* Calf */}
            <mesh position={[0, -0.92, -0.02]} rotation={[-0.1, 0, 0]} material={suitMaterial}>
              <cylinderGeometry args={[0.14, 0.13, 0.52, 16]} />
            </mesh>
            {/* Boot */}
            <mesh position={[0, -1.22, 0.06]} material={darkTrimMaterial}>
              <boxGeometry args={[0.2, 0.18, 0.36]} />
            </mesh>
          </group>

          {/* Right Leg */}
          <group position={[0.26, -0.15, 0]} rotation={[-0.1, 0, -0.18]}>
            {/* Thigh */}
            <mesh position={[0, -0.32, 0]} material={suitMaterial}>
              <cylinderGeometry args={[0.17, 0.14, 0.58, 16]} />
            </mesh>
            {/* Knee Pad */}
            <mesh position={[0, -0.62, 0.08]} material={darkTrimMaterial}>
              <boxGeometry args={[0.18, 0.16, 0.1]} />
            </mesh>
            {/* Calf */}
            <mesh position={[0, -0.92, 0.02]} rotation={[0.12, 0, 0]} material={suitMaterial}>
              <cylinderGeometry args={[0.14, 0.13, 0.52, 16]} />
            </mesh>
            {/* Boot */}
            <mesh position={[0, -1.22, 0.1]} material={darkTrimMaterial}>
              <boxGeometry args={[0.2, 0.18, 0.36]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* === ORBITAL BILLBOARD BADGES === */}
      <group ref={badgesGroupRef}>
        {badgeTextures.map((badge, idx) => (
          <sprite key={idx} scale={[1.8, 0.52, 1]}>
            <spriteMaterial map={badge.texture} transparent opacity={0.92} depthWrite={false} />
          </sprite>
        ))}
      </group>
    </group>
  );
}
