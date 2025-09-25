import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

const OrbitingIcon = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const ref = useRef<Mesh>(null!);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial emissive={color} emissiveIntensity={1} />
    </mesh>
  );
};

const SkillsOrbit: React.FC = () => {
  return (
    <>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial emissive="#00e5ff" emissiveIntensity={1.2} />
      </mesh>
      <OrbitingIcon position={[2, 0, 0]} color="#ff00cc" />
      <OrbitingIcon position={[-2, 0, 0]} color="#00e5ff" />
      <OrbitingIcon position={[0, 2, 0]} color="#39ff14" />
      <OrbitingIcon position={[0, -2, 0]} color="#ffaa00" />
    </>
  );
};

export default SkillsOrbit;
