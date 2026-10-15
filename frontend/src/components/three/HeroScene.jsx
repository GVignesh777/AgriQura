import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';

function PlantOrb() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.35;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.12;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      {/* Compact 3D Ball with plenty of surrounding space */}
      <mesh ref={meshRef} scale={1.25} position={[0, 0, -0.2]}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color="#4ade80"
          wireframe
          emissive="#22c55e"
          emissiveIntensity={0.95}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-[520px] sm:h-[580px] md:h-[640px] relative overflow-visible bg-transparent pointer-events-auto flex items-center justify-center -my-8 sm:-my-12">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        style={{ background: 'transparent', width: '100%', height: '100%', overflow: 'visible' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 12, 6]} intensity={2.4} color="#bbf7d0" />
        <pointLight position={[-10, -10, -5]} intensity={1.6} color="#fef08a" />
        <PlantOrb />

        {/* Freely Floating Sparkles Spreading Over Massive Surrounding Space */}
        <Sparkles
          count={110}
          scale={[10, 10, 8]}
          size={3.0}
          speed={0.3}
          opacity={0.85}
          noise={0.6}
          color="#86efac"
        />

        {/* Warm Golden Ambient Sparkles */}
        <Sparkles
          count={45}
          scale={[9, 9, 7]}
          size={2.4}
          speed={0.22}
          opacity={0.7}
          noise={0.4}
          color="#fef08a"
        />
      </Canvas>
    </div>
  );
}
