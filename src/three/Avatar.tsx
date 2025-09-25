import React from "react";
import { useGLTF } from "@react-three/drei";

const Avatar: React.FC = () => {
  const { scene } = useGLTF("/avatar.glb"); // put avatar.glb inside public/
  return <primitive object={scene} scale={2} position={[0, -1, 0]} />;
};

export default Avatar;
