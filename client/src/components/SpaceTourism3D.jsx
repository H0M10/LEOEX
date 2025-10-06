import React, { useRef } from 'react';import React, { useMemo } from 'react';

import { Canvas, useFrame } from '@react-three/fiber';import { Canvas, useFrame } from '@react-three/fiber';

import { OrbitControls, Stars } from '@react-three/drei';import { OrbitControls, Html, Stars } from '@react-three/drei';

import * as THREE from 'three';import * as THREE from 'three';



function Earth() {function Earth({ radius = 1 }) {

  const ref = useRef();  const earthRef = React.useRef();

  useFrame(() => {  const geom = useMemo(() => new THREE.SphereGeometry(radius, 64, 64), [radius]);

    if (ref.current) ref.current.rotation.y += 0.003;  useFrame(() => {

  });    if (earthRef.current) earthRef.current.rotation.y += 0.002;

  return (  });

    <mesh ref={ref}>  return (

      <sphereGeometry args={[2, 64, 64]} />    <group ref={earthRef}>

      <meshStandardMaterial color="#2b6fb3" />      <mesh geometry={geom}>

    </mesh>        <meshStandardMaterial color="#2a72b5" roughness={0.8} metalness={0.1} />

  );      </mesh>

}      {/* Atmosphere */}

      <mesh geometry={geom} scale={1.02}>

function OrbitingImage({ url, idx, total }) {        <meshBasicMaterial color="#87CEEB" transparent opacity={0.12} side={THREE.BackSide} />

  const ref = useRef();      </mesh>

  useFrame(({ clock }) => {    </group>

    if (!ref.current) return;  );

    const t = clock.getElapsedTime();}

    const phase = idx * (2 * Math.PI / total);

    const r = 3.2;function OrbitingImage({ img, radius, inclination = 0.2, speed = 0.5, phase = 0 }) {

    ref.current.position.x = Math.cos(t * 0.4 + phase) * r;  const groupRef = React.useRef();

    ref.current.position.z = Math.sin(t * 0.4 + phase) * r;  const angleRef = React.useRef(phase);

    ref.current.position.y = Math.sin(t * 0.2 + phase) * 0.7;  useFrame((_, delta) => {

    ref.current.lookAt(0, 0, 0);    angleRef.current += speed * delta; // radians per second

  });    const angle = angleRef.current;

  return (    const x = Math.cos(angle) * radius;

    <mesh ref={ref} scale={[0.7, 0.7, 0.7]}>    const z = Math.sin(angle) * radius;

      <planeGeometry args={[0.7, 0.7]} />    const y = Math.sin(angle * 2.0) * inclination; // slight up/down oscillation

      <meshBasicMaterial map={new THREE.TextureLoader().load(url)} transparent />    if (groupRef.current) groupRef.current.position.set(x, y, z);

    </mesh>  });

  );  return (

}    <group ref={groupRef}>

      <Html center>

export default function SpaceTourism3D({ images }) {        <div

  return (          style={{

    <div style={{ width: '100%', height: '420px', background: '#000', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px #0008' }}>            width: 56,

      <Canvas camera={{ position: [6, 3, 6], fov: 60 }}>            height: 56,

        <ambientLight intensity={0.5} />            background: `url(${img.image_url}) center/cover no-repeat`,

        <pointLight position={[10, 10, 10]} intensity={1} />            borderRadius: 8,

        <Earth />            boxShadow: '0 2px 8px rgba(0,0,0,0.6)',

        <Stars radius={100} depth={50} count={400} factor={4} />            outline: '1px solid rgba(255,255,255,0.08)',

        {images.map((img, idx) => (            animation: 'spin 12s linear infinite'

          <OrbitingImage key={img.id || idx} url={img.image_url} idx={idx} total={images.length} />          }}

        ))}          title={`ID ${img.id}`}

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />          onClick={() => window.open(img.image_url, '_blank')}

      </Canvas>        />

    </div>      </Html>

  );    </group>

}  );

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
