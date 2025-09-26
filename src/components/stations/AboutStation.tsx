import React, { useRef, useState, useEffect } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

interface AboutStationProps {
  shipPos: Vector3;
  onOpen: () => void;
  showAbout: boolean;
}

const AboutStation: React.FC<AboutStationProps> = ({ shipPos, onOpen, showAbout }) => {
  const stationPos: [number, number, number] = [0, 0, -60];
  const dist = shipPos.distanceTo(new Vector3(...stationPos));
  const { scene } = useGLTF("/models/about_station.glb");
  const ref = useRef<any>(null);
  const glowRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);

  // Animation loop for dynamic effects
  useFrame((state) => {
    if (ref.current && glowRef.current) {
      // Gentle rotation
      ref.current.rotation.y += 0.002;
      
      // Pulsing glow effect
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.4;
      glowRef.current.material.emissiveIntensity = pulse;
      
      // Distance-based scaling
      const proximityScale = Math.max(0.8, Math.min(1.2, (200 - dist) / 100));
      ref.current.scale.setScalar(5 * proximityScale);
      
      setPulsePhase(state.clock.elapsedTime);
    }
  });

  if (dist > 150) return null;

  // Calculate interaction intensity based on distance
  const intensity = Math.max(0, (100 - dist) / 100);
  const cardScale = hovered ? 1.15 : 1 + intensity * 0.1;

  // Particle positions for floating elements
  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 25 + Math.sin(pulsePhase + i) * 3;
    return [
      Math.cos(angle) * radius,
      Math.sin(pulsePhase * 0.5 + i) * 2,
      Math.sin(angle) * radius
    ];
  });

  return (
    <group ref={ref} position={stationPos} scale={5}>
      {/* 🚀 3D Station */}
      <primitive object={scene} />

      {/* Enhanced Glow Aura with Multiple Layers */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[18, 64, 64]} />
        <meshStandardMaterial
          emissive="cyan"
          emissiveIntensity={0.4}
          transparent
          opacity={0.07}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh>
        <sphereGeometry args={[22, 32, 32]} />
        <meshStandardMaterial
          emissive="#00ffff"
          emissiveIntensity={0.2}
          transparent
          opacity={0.03}
        />
      </mesh>

      {/* Floating Particles */}
      {particles.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial
            emissive="cyan"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* 📝 Interactive Card */}
      {dist < 80 && !showAbout && (
        <Html distanceFactor={14} position={[0, 1.5, 2]}>
          <div
            onClick={onOpen}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              padding: "35px 45px",
              borderRadius: "25px",
              background: `linear-gradient(135deg, 
                rgba(0,0,0,0.95) 0%, 
                rgba(0,20,40,0.95) 50%, 
                rgba(0,0,0,0.95) 100%)`,
              border: "3px solid cyan",
              borderImage: "linear-gradient(45deg, cyan, #00ffff, cyan) 1",
              color: "cyan",
              textAlign: "center",
              fontFamily: "'Space Mono', monospace",
              width: "520px",
              boxShadow: `
                0 0 40px rgba(0,255,255,${0.8 + intensity * 0.4}), 
                0 0 80px rgba(0,255,255,${0.4 + intensity * 0.3}),
                inset 0 0 20px rgba(0,255,255,0.1)
              `,
              cursor: "pointer",
              transform: `scale(${cardScale}) translateZ(0)`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              backdropFilter: "blur(10px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Animated background overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "200%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.1), transparent)",
                transform: hovered ? "translateX(100%)" : "translateX(-100%)",
                transition: "transform 1.5s ease",
                zIndex: 1,
              }}
            />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 2 }}>
              {/* Header with animated icon */}
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    fontSize: "3rem",
                    marginBottom: "10px",
                    transform: hovered ? "rotateY(360deg)" : "rotateY(0deg)",
                    transition: "transform 0.8s ease",
                    display: "inline-block",
                    filter: "drop-shadow(0 0 10px cyan)",
                  }}
                >
                  👨‍🚀
                </div>
                <h2
                  style={{
                    fontSize: "2.2rem",
                    marginBottom: "0",
                    textShadow: "0 0 20px cyan, 0 0 40px rgba(0,255,255,0.5)",
                    background: "linear-gradient(45deg, cyan, #00ffff, cyan)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: hovered ? "textGlow 2s infinite alternate" : "none",
                  }}
                >
                  About Me
                </h2>
              </div>

              {/* Interactive elements */}
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginBottom: "15px",
                  }}
                >
                  {["🚀", "💻", "🌟"].map((emoji, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: "1.5rem",
                        padding: "10px",
                        borderRadius: "10px",
                        background: "rgba(0,255,255,0.1)",
                        transform: hovered ? `translateY(-${5 + i * 2}px) rotateZ(${i * 10}deg)` : "translateY(0)",
                        transition: `transform 0.3s ease ${i * 0.1}s`,
                        boxShadow: "0 0 15px rgba(0,255,255,0.3)",
                      }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action text with pulsing effect */}
              <p
                style={{
                  fontSize: "1.3rem",
                  opacity: 0.9,
                  marginBottom: "15px",
                  animation: "pulse 2s infinite ease-in-out",
                }}
              >
                Click to explore my journey 🚀
              </p>

              {/* Progress bar indicator */}
              <div
                style={{
                  width: "100%",
                  height: "3px",
                  background: "rgba(0,255,255,0.2)",
                  borderRadius: "2px",
                  overflow: "hidden",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    width: `${intensity * 100}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, cyan, #00ffff)",
                    transition: "width 0.3s ease",
                    boxShadow: "0 0 10px cyan",
                  }}
                />
              </div>

              {/* Distance indicator */}
              <div
                style={{
                  fontSize: "0.9rem",
                  opacity: 0.7,
                  marginTop: "10px",
                  fontWeight: "300",
                }}
              >
                Distance: {Math.round(dist)}m • Signal: {Math.round(intensity * 100)}%
              </div>
            </div>

            {/* Corner accent lines */}
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "20px",
                  height: "20px",
                  border: "2px solid cyan",
                  [i < 2 ? "top" : "bottom"]: "10px",
                  [i % 2 === 0 ? "left" : "right"]: "10px",
                  [i < 2 ? "borderBottom" : "borderTop"]: "none",
                  [i % 2 === 0 ? "borderRight" : "borderLeft"]: "none",
                  opacity: hovered ? 1 : 0.5,
                  transform: `scale(${hovered ? 1.2 : 1})`,
                  transition: "all 0.3s ease",
                  boxShadow: "0 0 5px cyan",
                }}
              />
            ))}
          </div>

          {/* CSS Animations */}
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.9; }
              50% { opacity: 1; }
            }
            @keyframes textGlow {
              from { text-shadow: 0 0 20px cyan, 0 0 40px rgba(0,255,255,0.5); }
              to { text-shadow: 0 0 30px cyan, 0 0 60px rgba(0,255,255,0.8), 0 0 80px rgba(0,255,255,0.3); }
            }
          `}</style>
        </Html>
      )}
    </group>
  );
};

export default AboutStation;