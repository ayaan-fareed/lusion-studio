"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const INSTANCE_COUNT = 34;

interface JackData {
  basePos: THREE.Vector3;
  currPos: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotVelocity: THREE.Vector3;
  scale: number;
}

export default function HeroJacksScene() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Build the merged 3D Jack geometry procedurally
  const geometry = useMemo(() => {
    const r = 0.12;
    const len = 1.3;
    const sphR = 0.22;

    const cylX = new THREE.CylinderGeometry(r, r, len, 16).rotateZ(Math.PI / 2);
    const cylY = new THREE.CylinderGeometry(r, r, len, 16);
    const cylZ = new THREE.CylinderGeometry(r, r, len, 16).rotateX(Math.PI / 2);

    const half = len / 2;
    const sX1 = new THREE.SphereGeometry(sphR, 16, 16).translate(half, 0, 0);
    const sX2 = new THREE.SphereGeometry(sphR, 16, 16).translate(-half, 0, 0);
    const sY1 = new THREE.SphereGeometry(sphR, 16, 16).translate(0, half, 0);
    const sY2 = new THREE.SphereGeometry(sphR, 16, 16).translate(0, -half, 0);
    const sZ1 = new THREE.SphereGeometry(sphR, 16, 16).translate(0, 0, half);
    const sZ2 = new THREE.SphereGeometry(sphR, 16, 16).translate(0, 0, -half);

    const merged = mergeGeometries([cylX, cylY, cylZ, sX1, sX2, sY1, sY2, sZ1, sZ2]);
    return merged;
  }, []);

  // Ceramic/pearlescent studio material
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#E8E8EE"),
      roughness: 0.18,
      metalness: 0.08,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      reflectivity: 0.6,
    });
  }, []);

  // Memory lifecycle cleanup on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Initial distributed jack instances
  const jacks = useMemo<JackData[]>(() => {
    const items: JackData[] = [];
    for (let i = 0; i < INSTANCE_COUNT; i++) {
      // Stratified organic cloud distribution
      const u = Math.random();
      const v = Math.random();
      const x = (u - 0.5) * 8.5;
      const y = (v - 0.5) * 5.8;
      const z = (Math.random() - 0.5) * 3.2 - 0.5;

      const basePos = new THREE.Vector3(x, y, z);
      items.push({
        basePos: basePos.clone(),
        currPos: basePos.clone(),
        velocity: new THREE.Vector3(),
        rotation: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotVelocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008
        ),
        scale: 0.65 + Math.random() * 0.45,
      });
    }
    return items;
  }, []);

  // Temporary vectors for physics loop
  const mouse3D = useRef(new THREE.Vector3());
  const diff = useRef(new THREE.Vector3());
  const spring = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Map pointer to 3D plane coordinates
    const targetX = (state.pointer.x * viewport.width) / 2;
    const targetY = (state.pointer.y * viewport.height) / 2;
    mouse3D.current.set(targetX, targetY, 0);

    const time = state.clock.elapsedTime;
    const dtFactor = Math.min(delta / 0.016, 2.0); // normalize frame rate spikes

    for (let i = 0; i < jacks.length; i++) {
      const jack = jacks[i];

      // Subtle ambient harmonic drift
      const ambientY = Math.sin(time * 1.2 + i * 0.8) * 0.004;
      const ambientX = Math.cos(time * 0.9 + i * 0.5) * 0.002;
      jack.currPos.y += ambientY;
      jack.currPos.x += ambientX;

      // Mouse Repulsion Force
      diff.current.subVectors(jack.currPos, mouse3D.current);
      // Flatten Z slightly for stronger screen-space feel
      diff.current.z *= 0.6;
      const dist = diff.current.length();
      const repulsionRadius = 2.8;

      if (dist < repulsionRadius && dist > 0.001) {
        const forceMagnitude = Math.pow(1 - dist / repulsionRadius, 2) * 0.22 * dtFactor;
        diff.current.normalize().multiplyScalar(forceMagnitude);
        jack.velocity.add(diff.current);

        // Impart interactive rotational spin when repelled
        jack.rotVelocity.x += diff.current.y * 0.08;
        jack.rotVelocity.y += diff.current.x * 0.08;
      }

      // Harmonic Spring Return Force towards basePos
      spring.current.subVectors(jack.basePos, jack.currPos).multiplyScalar(0.045 * dtFactor);
      jack.velocity.add(spring.current);

      // Velocity Damping
      jack.velocity.multiplyScalar(0.91);
      jack.currPos.addScaledVector(jack.velocity, dtFactor);

      // Rotation update
      jack.rotation.x += jack.rotVelocity.x * dtFactor;
      jack.rotation.y += jack.rotVelocity.y * dtFactor;
      jack.rotation.z += jack.rotVelocity.z * dtFactor;
      jack.rotVelocity.multiplyScalar(0.97);

      // Update InstancedMesh transform matrix
      dummy.position.copy(jack.currPos);
      dummy.rotation.copy(jack.rotation);
      dummy.scale.setScalar(jack.scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Studio Lighting Rig */}
      <ambientLight intensity={0.75} color="#F8F8FC" />
      <directionalLight position={[8, 10, 6]} intensity={1.8} color="#FFFFFF" />
      {/* Soft warm blush fill light */}
      <directionalLight position={[-7, -4, 5]} intensity={0.9} color="#F2E6E6" />
      {/* Signature studio cyan rim light */}
      <directionalLight position={[0, -6, -4]} intensity={1.4} color="#2DE2E6" />
      <pointLight position={[0, 4, 3]} intensity={0.8} color="#FFFFFF" />

      {/* Instanced Geometry Mesh */}
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, INSTANCE_COUNT]}
        castShadow
        receiveShadow
      />
    </>
  );
}
