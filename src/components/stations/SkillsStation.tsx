import React, { useRef, useState, useEffect } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

interface SkillsStationProps {
  shipPos: Vector3;
  activeStation: string | null; 
  onOpen: () => void;
}

const SkillsStation: React.FC<SkillsStationProps> = ({
  shipPos,
  activeStation,
  onOpen,
}) => {
  const stationPos: [number, number, number] = [-40, 0, -130];
  const dist = shipPos.distanceTo(new Vector3(...stationPos));
  const { scene } = useGLTF("/models/skills_station.glb");
  const ref = useRef<any>(null);
  const glowRef = useRef<any>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0.4);
  const [cardRotation, setCardRotation] = useState(0);
  const [particlePositions, setParticlePositions] = useState<Array<{x: number, y: number, opacity: number, scale: number}>>([]);

  // Initialize floating particles
  useEffect(() => {
    const particles = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
      opacity: Math.random() * 0.7 + 0.3,
      scale: Math.random() * 0.8 + 0.5,
    }));
    setParticlePositions(particles);
  }, []);

  // Animate glow and particles
  useFrame((state) => {
    if (glowRef.current) {
      // Pulsing glow effect
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 0.4;
      setPulseIntensity(pulse);
      glowRef.current.material.emissiveIntensity = pulse;
    }

    // Rotate card slightly
    setCardRotation(Math.sin(state.clock.elapsedTime * 0.5) * 2);

    // Animate particles
    setParticlePositions(prev => prev.map((particle, i) => ({
      ...particle,
      x: particle.x + Math.sin(state.clock.elapsedTime + i) * 0.5,
      y: particle.y + Math.cos(state.clock.elapsedTime * 0.7 + i) * 0.3,
      opacity: 0.3 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2,
    })));
  });

  

  return (
    <group ref={ref} position={stationPos} scale={5}>
      <primitive object={scene} />

      {/* Enhanced glow aura with multiple layers */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[18, 64, 64]} />
        <meshStandardMaterial
          emissive="yellow"
          emissiveIntensity={pulseIntensity}
          transparent
          opacity={0.07}
        />
      </mesh>
      
      {/* Outer glow ring */}
      <mesh>
        <sphereGeometry args={[22, 32, 32]} />
        <meshStandardMaterial
          emissive="#ffaa00"
          emissiveIntensity={pulseIntensity * 0.3}
          transparent
          opacity={0.03}
        />
      </mesh>

      {activeStation === null && (
        <Html distanceFactor={10} position={[0, 2.5, 2]}>
          <div
            onClick={onOpen}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
              position: "relative",
              padding: "50px 30px",
              borderRadius: "20px",
              background: isHovering 
                ? "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,20,0,0.9))"
                : "linear-gradient(135deg, rgba(0,0,0,0.85), rgba(10,10,0,0.8))",
              border: isHovering 
                ? "3px solid #ffdd00" 
                : "2px solid yellow",
              color: "#ffff88",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "24px",
              textAlign: "center",
              width: "850px" ,  // wider
              height: "650px" ,
              boxShadow: isHovering 
                ? "0 0 50px rgba(255,255,0,0.8), inset 0 0 20px rgba(255,255,0,0.1)"
                : "0 0 30px rgba(255,255,0,0.5)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: `scale(${isHovering ? 1.05 : 1}) rotateY(${cardRotation}deg)`,
              backdropFilter: "blur(10px)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* Floating particles background */}
            {particlePositions.map((particle, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${particle.x}px`,
                  top: `${particle.y}px`,
                  width: "4px",
                  height: "4px",
                  background: "rgba(255,255,0,0.6)",
                  borderRadius: "50%",
                  opacity: particle.opacity,
                  transform: `scale(${particle.scale})`,
                  filter: "blur(0.5px)",
                  pointerEvents: "none",
                }}
              />
            ))}
            
            {/* Animated border effect */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "20px",
                background: `conic-gradient(from ${cardRotation * 4}deg, transparent, rgba(255,255,0,0.3), transparent)`,
                opacity: isHovering ? 0.7 : 0.3,
                transition: "opacity 0.3s",
                pointerEvents: "none",
              }}
            />

            {/* Main icon with glow */}
            <div
              style={{
                fontSize: "48px",
                filter: isHovering ? "drop-shadow(0 0 20px #ffff00)" : "drop-shadow(0 0 10px #ffff00)",
                animation: isHovering ? "bounce 0.6s ease-in-out" : "none",
                transition: "all 0.3s",
                zIndex: 2,
              }}
            >
              ⚡
            </div>

            {/* Animated title */}
            <div
              style={{
                zIndex: 2,
                position: "relative",
                background: isHovering 
                  ? "linear-gradient(45deg, #ffff88, #ffdd00, #ffff88)"
                  : "none",
                backgroundClip: isHovering ? "text" : "none",
                WebkitBackgroundClip: isHovering ? "text" : "none",
                color: isHovering ? "transparent" : "#ffff88",
                backgroundSize: "200% 200%",
                animation: isHovering ? "gradientShift 2s ease-in-out infinite" : "none",
                lineHeight: "1.2",
                fontSize: "72px",
              }}
            >
              Skills Archive
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: "30px",
                opacity: 0.8,
                fontWeight: "normal",
                zIndex: 2,
                fontStyle: "italic",
              }}
            >
              Accumulated knowledge & abilities
            </div>

            {/* Progress indicator */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "4px",
                zIndex: 2,
              }}
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: i < 4 ? "#ffdd00" : "rgba(255,221,0,0.3)",
                    boxShadow: i < 4 ? "0 0 8px rgba(255,221,0,0.5)" : "none",
                  }}
                />
              ))}
            </div>

            {/* CSS animations */}
            <style>
              {`
                @keyframes bounce {
                  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                  40% { transform: translateY(-10px); }
                  60% { transform: translateY(-5px); }
                }
                @keyframes gradientShift {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}
            </style>
          </div>
        </Html>
      )}
    </group>
  );
};

export default SkillsStation;