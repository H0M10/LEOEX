import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Earth() {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.003;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial color="#2b6fb3" />
    </mesh>
  );
}

function OrbitingImage({ img, radius, inclination = 0.2, speed = 0.5, phase = 0 }) {
  const groupRef = useRef();
  const angleRef = useRef(phase);
  useFrame((_, delta) => {
    angleRef.current += speed * delta;
    const angle = angleRef.current;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.sin(angle * 2.0) * inclination;
    if (groupRef.current) groupRef.current.position.set(x, y, z);
  });
  return (
    <group ref={groupRef}>
      <mesh scale={[0.7, 0.7, 0.7]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial map={new THREE.TextureLoader().load(img.image_url)} transparent />
      </mesh>
    </group>
  );
}

export default function SpaceTourism3D({ images = [] }) {
  const orbitItems = useMemo(() => {
    return images.map((img, i) => ({
      img,
      radius: 2.8 + (i % 5) * 0.3,
      inclination: 0.15 + Math.random() * 0.25,
      speed: 0.6 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2
    }));
  }, [images]);
  return (
    <div style={{ width: '100%', height: 420, background: '#000', borderRadius: 12, boxShadow: '0 2px 12px #0008' }}>
      <Canvas camera={{ position: [6, 3, 6], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Earth />
        <Stars radius={100} depth={50} count={400} factor={4} />
        {/* Orbit bands */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`ring-${i}`} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.8 + i * 0.3, 2.81 + i * 0.3, 64]} />
            <meshBasicMaterial color={["#44ff44", "#ffaa44", "#ff4444", "#33ccff", "#cc33ff"][i % 5]} transparent opacity={0.15} />
          </mesh>
        ))}
        {/* Orbiting thumbnails */}
        {orbitItems.map((o, idx) => (
          <OrbitingImage key={`orbit-${idx}`} {...o} />
        ))}
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}
