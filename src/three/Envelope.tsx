import React from "react";

const Envelope: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[1.5, 1, 0.3]} />
      <meshStandardMaterial emissive="#00e5ff" emissiveIntensity={0.8} />
    </mesh>
  );
};

export default Envelope;
