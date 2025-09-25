import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, Stars, useGLTF, Html } from "@react-three/drei";
import { Group } from "three";

// ✅ Spaceship model
function Spaceship() {
  const ref = useRef<Group>(null!);
  const { scene } = useGLTF("/spaceship.glb"); // place spaceship.glb in public/
  const scroll = useScroll();

  useFrame(() => {
    const offset = scroll.offset; // scroll progress 0 → 1
    if (ref.current) {
      ref.current.position.z = -offset * 20; // 🚀 move forward
    }
  });

  return <primitive ref={ref} object={scene} scale={0.3} position={[0, -1, 0]} />;
}

// ✅ Space Station (About)
function AboutStation() {
  return (
    <mesh position={[0, -1, -10]}>
      <torusGeometry args={[2, 0.2, 16, 100]} />
      <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={0.6} />
      <Html distanceFactor={10} position={[0, 2, 0]}>
        <div className="glass-card p-3 text-center">
          <h2 className="glass-text">About Me</h2>
          <p>
            Hi, I’m Zaheer 👋 <br />
            A Full Stack Developer building 3D immersive experiences.
          </p>
        </div>
      </Html>
    </mesh>
  );
}

const SpaceJourney: React.FC = () => {
  return (
    <Canvas style={{ width: "100%", height: "100vh", background: "black" }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />
      <Stars radius={200} depth={60} count={5000} factor={4} fade />

      {/* 🔥 Scroll Controls: 2 pages (Hero + About) */}
      <ScrollControls pages={2} damping={6}>
        <Spaceship />
        <AboutStation />
      </ScrollControls>
    </Canvas>
  );
};

export default SpaceJourney;
