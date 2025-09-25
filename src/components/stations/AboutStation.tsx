import React, { useRef } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { Vector3 } from "three";

interface AboutStationProps {
  shipPos: Vector3;
  onOpen: () => void;
  showAbout: boolean; // 👈 new prop to hide small card when expanded
}

const AboutStation: React.FC<AboutStationProps> = ({ shipPos, onOpen, showAbout }) => {
  const stationPos: [number, number, number] = [0, 0, -60];
  const dist = shipPos.distanceTo(new Vector3(...stationPos));
  const { scene } = useGLTF("/models/about_station.glb");
  const ref = useRef<any>(null);

  if (dist > 150) return null;

  return (
    <group ref={ref} position={stationPos} scale={5}>
      {/* 🚀 3D Station */}
      <primitive object={scene} />

      {/* Glow aura */}
      <mesh>
        <sphereGeometry args={[18, 64, 64]} />
        <meshStandardMaterial
          emissive="cyan"
          emissiveIntensity={0.4}
          transparent
          opacity={0.07}
        />
      </mesh>

      {/* 📝 Small Card → only show when close enough & not expanded */}
      {dist < 80 && !showAbout && (
        <Html distanceFactor={14} position={[0, 1.5, 2]}>
  <div
    onClick={onOpen}
    style={{
      padding: "30px 40px",
      borderRadius: "20px",
      background: "rgba(0,0,0,0.85)",
      border: "2px solid cyan",
      color: "cyan",
      textAlign: "center",
      fontFamily: "'Space Mono', monospace",
      width: "500px",
      boxShadow: "0 0 40px rgba(0,255,255,0.8), 0 0 80px rgba(0,255,255,0.4)",
      cursor: "pointer",
      transform: "scale(1.1)",
    }}
  >
    <h2 style={{ fontSize: "2rem", marginBottom: "12px", textShadow: "0 0 20px cyan" }}>
      👨‍🚀 About Me
    </h2>
    <p style={{ fontSize: "1.2rem", opacity: 0.9 }}>Click to expand 🚀</p>
  </div>
</Html>

      )}
    </group>
  );
};

export default AboutStation;
