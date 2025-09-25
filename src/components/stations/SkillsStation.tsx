// src/components/stations/SkillsStation.tsx
import React, { useRef } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { Vector3 } from "three";

interface SkillsStationProps {
  shipPos: Vector3;
  showSkills: boolean;
  onOpen: () => void;
}

const SkillsStation: React.FC<SkillsStationProps> = ({
  shipPos,
  showSkills,
  onOpen,
}) => {
  const stationPos: [number, number, number] = [-60, 0, -200];
  const dist = shipPos.distanceTo(new Vector3(...stationPos));
  const { scene } = useGLTF("/models/skills_station.glb"); // ⚡ replace with skills hub
  const ref = useRef<any>(null);

  if (dist > 150) return null;

  return (
    <group ref={ref} position={stationPos} scale={5}>
      <primitive object={scene} />

      {/* Glow aura */}
      <mesh>
        <sphereGeometry args={[18, 64, 64]} />
        <meshStandardMaterial
          emissive="yellow"
          emissiveIntensity={0.4}
          transparent
          opacity={0.07}
        />
      </mesh>

      {dist < 80 && !showSkills && (
  <Html distanceFactor={10} position={[0, 2.5, 2]}>
    <div
      onClick={onOpen}
      style={{
        padding: "70px 40px",
        borderRadius: "14px",
        background: "rgba(0,0,0,0.85)",
        border: "2px solid yellow",
        color: "yellow",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "30px",
        textAlign: "center",
        width: "300px",
        height: "300px",
        boxShadow: "0 0 20px rgba(255,255,0,0.5)",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.1)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 35px rgba(255,255,0,0.8)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 20px rgba(255,255,0,0.5)";
      }}
    >
      ⚡ Skills which I acquired over time
    </div>
  </Html>
)}

    </group>
  );
};

export default SkillsStation;
