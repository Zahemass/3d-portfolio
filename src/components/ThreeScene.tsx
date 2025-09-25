import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const RotatingCube: React.FC = () => {
  const mesh = useRef<any>(null);
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#00e5ff"
        transparent
        opacity={0.7}
        metalness={0.5}
        roughness={0.2}
      />
    </mesh>
  );
};

const ThreeScene: React.FC = () => {
  return (
    <Canvas style={{ height: "100vh", position: "absolute", top: 0, left: 0 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <RotatingCube />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export default ThreeScene;
