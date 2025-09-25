// src/components/stations/ContactStation.tsx
import React, { useRef } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { Vector3 } from "three";

interface ContactStationProps {
  shipPos: Vector3;
  showContact: boolean;
  onOpen: () => void;
}

const ContactStation: React.FC<ContactStationProps> = ({
  shipPos,
  showContact,
  onOpen,
}) => {
  const stationPos: [number, number, number] = [0, -40, -280];
  const dist = shipPos.distanceTo(new Vector3(...stationPos));
  const { scene } = useGLTF("/models/contact_station.glb"); // 📡 replace with antenna/satellite
  const ref = useRef<any>(null);

  if (dist > 180) return null;

  return (
    <group ref={ref} position={stationPos} scale={5}>
      <primitive object={scene} />

      {/* Glow aura */}
      <mesh>
        <sphereGeometry args={[20, 64, 64]} />
        <meshStandardMaterial
          emissive="cyan"
          emissiveIntensity={0.4}
          transparent
          opacity={0.07}
        />
      </mesh>

      {dist < 100 && !showContact && (
  <Html distanceFactor={10} position={[0, 2.5, 2]}>
    <div
      onClick={onOpen}
      style={{
        padding: "70px 40px",
        borderRadius: "14px",
        background: "rgba(0,0,0,0.85)",
        border: "2px solid cyan",
        color: "cyan",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "30px",
        textAlign: "center",
        width: "300px",
        height: "300px",
        boxShadow: "0 0 20px rgba(0,255,255,0.5)",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.1)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 35px rgba(0,255,255,0.8)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 20px rgba(0,255,255,0.5)";
      }}
    >
      📡 Connect with me bro!
    </div>
  </Html>
)}

    </group>
  );
};

export default ContactStation;
