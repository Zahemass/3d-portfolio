import React from "react";

const HeroOrb: React.FC = () => {
  return (
    <mesh>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial emissive="#00e5ff" emissiveIntensity={1} />
    </mesh>
  );
};

export default HeroOrb;
