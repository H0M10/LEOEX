import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Earth({ radius = 1 }) {
  const earthRef = useRef();

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002; // Earth rotation
    }
  });

  const earthGeometry = useMemo(() => new THREE.SphereGeometry(radius, 64, 64), [radius]);

  return (
    <group ref={earthRef}>
      <mesh geometry={earthGeometry}>
        <meshStandardMaterial
          color="#4A90E2"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      {/* Earth atmosphere */}
      <mesh geometry={earthGeometry} scale={1.02}>
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Orbital path component
function OrbitalPath({ radius, inclination = 0, color = '#ffffff' }) {
  const points = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius);
    const points = curve.getPoints(100);
    return points.map(p => new THREE.Vector3(p.x, 0, p.y));
  }, [radius]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.3} />
    </line>
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
      radius: 1.3 + (i % 5) * 0.2,
      inclination: 0.15 + Math.random() * 0.25,
      speed: 0.6 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2
    }));
  }, [images]);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#000' }}>
      <Canvas
        camera={{ position: [3, 2, 3], fov: 60 }}
        style={{ width: '100%', height: '100vh' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Stars radius={300} depth={50} count={1000} factor={4} />

        <Earth />

        {/* LEO orbital zones */}
        <OrbitalPath radius={1.3} color="#44ff44" />
        <OrbitalPath radius={1.5} color="#ffaa44" />
        <OrbitalPath radius={1.8} color="#ff4444" />

        {/* Orbiting images */}
        {orbitItems.map((o, idx) => (
          <OrbitingImage key={`orbit-${idx}`} {...o} />
        ))}

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}