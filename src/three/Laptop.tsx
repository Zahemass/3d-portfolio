import React from "react";
import { useGLTF } from "@react-three/drei";

const Laptop: React.FC = () => {
  const { scene } = useGLTF("/laptop.glb"); // place laptop.glb in public/
  return <primitive object={scene} scale={0.4} position={[0, -1, 0]} />;
};

export default Laptop;
