import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Earth({ radius = 1 }) {
  const earthRef = React.useRef();
  const geom = useMemo(() => new THREE.SphereGeometry(radius, 64, 64), [radius]);
  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.002;
  });
  return (
    <group ref={earthRef}>
      <mesh geometry={geom}>
        <meshStandardMaterial color="#2a72b5" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Atmosphere */}
      <mesh geometry={geom} scale={1.02}>
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function OrbitingImage({ img, radius, inclination = 0.2, speed = 0.5, phase = 0 }) {
  const groupRef = React.useRef();
  const angleRef = React.useRef(phase);
  useFrame((_, delta) => {
    angleRef.current += speed * delta; // radians per second
    const angle = angleRef.current;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.sin(angle * 2.0) * inclination; // slight up/down oscillation
    if (groupRef.current) groupRef.current.position.set(x, y, z);
  });
  return (
    <group ref={groupRef}>
      <Html center>
        <div
          style={{
            width: 56,
            height: 56,
            background: `url(${img.image_url}) center/cover no-repeat`,
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
            outline: '1px solid rgba(255,255,255,0.08)',
            animation: 'spin 12s linear infinite'
          }}
          title={`ID ${img.id}`}
          onClick={() => window.open(img.image_url, '_blank')}
        />
      </Html>
    </group>
  );
}

export default function SpaceTourism3D({ images = [] }) {
  const orbitItems = useMemo(() => {
    return images.map((img, i) => ({
      img,
      radius: 1.35 + (i % 5) * 0.12, // distribute across bands
      inclination: 0.15 + Math.random() * 0.25,
      speed: 0.6 + Math.random() * 0.6, // radians/sec
      phase: Math.random() * Math.PI * 2
    }));
  }, [images]);

  return (
    <div style={{ width: '100%', height: 500, background: '#000', borderRadius: 12, boxShadow: '0 2px 12px #0008' }}>
      <Canvas camera={{ position: [3, 2, 3], fov: 60 }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Stars radius={300} depth={50} count={1000} factor={4} />
        <Earth />
        {/* Orbit bands (subtle guides) */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`ring-${i}`} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.3 + i * 0.12, 1.301 + i * 0.12, 64]} />
            <meshBasicMaterial color={["#44ff44", "#ffaa44", "#ff4444", "#33ccff", "#cc33ff"][i % 5]} transparent opacity={0.15} />
          </mesh>
        ))}
        {/* Orbiting thumbnails */}
        {orbitItems.map((o, idx) => (
          <OrbitingImage key={`orbit-${idx}`} img={o.img} radius={o.radius} inclination={o.inclination} speed={o.speed} phase={o.phase} />
        ))}
        <OrbitControls enableDamping dampingFactor={0.06} minDistance={2} maxDistance={10} />
      </Canvas>
      <style>{`
        @keyframes spin { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
      `}</style>
    </div>
  );
}
