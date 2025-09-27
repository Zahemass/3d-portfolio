// src/components/stations/ProjectsStation.tsx
import React, { useRef, useState, useEffect } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

interface ProjectsStationProps {
  shipPos: Vector3;
  activeStation: string | null; 
  onOpen: () => void;
}

const ProjectsStation: React.FC<ProjectsStationProps> = ({
  shipPos,
  activeStation,
  onOpen,
}) => {
  const stationPos: [number, number, number] = [35, 0, -100];
  const dist = shipPos.distanceTo(new Vector3(...stationPos));
  const { scene } = useGLTF("/models/projects_station.glb");
  const ref = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{x: number, y: number, id: number}>>([]);

  // Floating animation for the station
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.5;
      ref.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  // Generate particles on hover
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setParticles(prev => [
          ...prev.slice(-20),
          {
            x: Math.random() * 600 - 300,
            y: 600,
            id: Date.now() + Math.random()
          }
        ]);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  

  return (
    <group ref={ref} position={stationPos} scale={5}>
      {/* 3D Station */}
      <primitive object={scene} />

      {/* Dynamic glow aura */}
      <mesh>
        <sphereGeometry args={[18, 64, 64]} />
        <meshStandardMaterial
          emissive="magenta"
          emissiveIntensity={isHovered ? 0.8 : 0.5}
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Secondary pulse ring */}
      {isHovered && (
        <mesh scale={[1, 1, 1]}>
          <ringGeometry args={[20, 22, 64]} />
          <meshBasicMaterial
            color="cyan"
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* 🚀 SUPER CARD DESIGN */}
      {activeStation === null && (
        <Html distanceFactor={10} position={[0, 2.5, 2]}>
          <div
            onClick={onOpen}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              position: "relative",
             width: isHovered ? "850px" : "800px",  // wider
  height: isHovered ? "650px" : "600px",
              cursor: "pointer",
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Floating particles */}
            {particles.map((particle) => (
              <div
                key={particle.id}
                style={{
                  position: "absolute",
                  left: `${particle.x + 300}px`,
                  top: `${particle.y}px`,
                  width: "6px",
                  height: "6px",
                  background: "cyan",
                  borderRadius: "50%",
                  boxShadow: "0 0 15px cyan",
                  animation: "float-up 3s linear forwards",
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* Main holographic card */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "60px",
                borderRadius: "30px",
                background: `
                  linear-gradient(135deg, 
                    rgba(255,0,255,0.1) 0%, 
                    rgba(0,255,255,0.1) 50%, 
                    rgba(255,0,255,0.1) 100%),
                  linear-gradient(45deg,
                    rgba(0,0,0,0.9) 0%,
                    rgba(0,0,0,0.7) 100%)
                `,
                border: "3px solid",
                borderImage: "linear-gradient(45deg, magenta, cyan, magenta) 1",
                backdropFilter: "blur(15px)",
                boxShadow: isHovered
                  ? `
                    0 0 80px rgba(255,0,255,0.8),
                    inset 0 0 80px rgba(0,255,255,0.3),
                    0 0 150px rgba(0,255,255,0.4),
                    0 15px 60px rgba(0,0,0,0.8)
                  `
                  : `
                    0 0 40px rgba(255,0,255,0.5),
                    inset 0 0 40px rgba(0,255,255,0.1),
                    0 10px 30px rgba(0,0,0,0.5)
                  `,
                transform: isHovered 
                  ? "rotateX(-5deg) rotateY(5deg) translateZ(30px) scale(1.05)" 
                  : "rotateX(0) rotateY(0) translateZ(0) scale(1)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {/* Animated background grid */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 2px,
                      rgba(0,255,255,0.03) 2px,
                      rgba(0,255,255,0.03) 4px
                    ),
                    repeating-linear-gradient(
                      90deg,
                      transparent,
                      transparent 2px,
                      rgba(255,0,255,0.03) 2px,
                      rgba(255,0,255,0.03) 4px
                    )
                  `,
                  animation: "grid-move 10s linear infinite",
                  pointerEvents: "none",
                }}
              />

              {/* Scanning line effect */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, cyan, transparent)",
                  animation: "scan 3s linear infinite",
                  pointerEvents: "none",
                }}
              />

              {/* Corner decorations */}
              {[
                { top: 0, left: 0, rotate: "0deg" },
                { top: 0, right: 0, rotate: "90deg" },
                { bottom: 0, right: 0, rotate: "180deg" },
                { bottom: 0, left: 0, rotate: "270deg" },
              ].map((corner, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    ...corner,
                    width: "50px",
                    height: "50px",
                    border: "3px solid cyan",
                    borderRight: i % 2 === 0 ? "none" : undefined,
                    borderBottom: i % 2 === 0 ? "none" : undefined,
                    borderLeft: i % 2 === 1 ? "none" : undefined,
                    borderTop: i % 2 === 1 ? "none" : undefined,
                    transform: `rotate(${corner.rotate})`,
                    animation: isHovered ? "corner-pulse 1s ease-in-out infinite" : "none",
                  }}
                />
              ))}

              {/* Glowing orb icon */}
              <div
                style={{
                  fontSize: "120px",
                  marginBottom: "40px",
                  filter: "drop-shadow(0 0 40px rgba(0,255,255,0.8))",
                  animation: "float 3s ease-in-out infinite",
                  transform: isHovered ? "scale(1.2)" : "scale(1)",
                  transition: "transform 0.3s",
                }}
              >
                <span style={{
                  background: "linear-gradient(135deg, magenta, cyan)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "block",
                  animation: "rotate-icon 4s linear infinite",
                }}>
                  🌌
                </span>
              </div>

              {/* Main title with glitch effect */}
              <h2
                style={{
                  fontSize: "52px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  textTransform: "uppercase",
                  letterSpacing: "4px",
                  background: "linear-gradient(45deg, magenta, cyan, magenta)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: isHovered 
                    ? `
                      3px 3px 0 rgba(255,0,255,0.3),
                      -3px -3px 0 rgba(0,255,255,0.3)
                    ` 
                    : "none",
                  animation: isHovered ? "glitch 0.3s infinite" : "none",
                  position: "relative",
                  lineHeight: 1.2,
                }}
              >
                Explore My
                <br />
                Projects
              </h2>

              {/* Subtitle with typing animation */}
              <p
                style={{
                  fontSize: "18px",
                  color: "rgba(0,255,255,0.8)",
                  marginBottom: "40px",
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: "2px",
                }}
              >
                {isHovered ? "> INITIALIZING..." : "> READY_TO_LAUNCH"}
              </p>

              {/* Interactive button */}
              <div
                style={{
                  padding: "20px 60px",
                  background: isHovered
                    ? "linear-gradient(45deg, rgba(255,0,255,0.3), rgba(0,255,255,0.3))"
                    : "linear-gradient(45deg, rgba(255,0,255,0.1), rgba(0,255,255,0.1))",
                  border: "2px solid",
                  borderImage: "linear-gradient(45deg, magenta, cyan) 1",
                  borderRadius: "50px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  boxShadow: isHovered
                    ? "0 0 40px rgba(0,255,255,0.6), inset 0 0 30px rgba(255,0,255,0.2)"
                    : "0 0 20px rgba(0,255,255,0.3)",
                  transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                  transition: "all 0.3s",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <span style={{ position: "relative", zIndex: 1 }}>
                  Enter Station →
                </span>
                {/* Button shimmer effect */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    animation: isHovered ? "shimmer 1s infinite" : "none",
                  }}
                />
              </div>

              {/* Tech stack preview */}
              <div
                style={{
                  position: "absolute",
                  bottom: "30px",
                  display: "flex",
                  gap: "15px",
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.3s",
                }}
              >
                {["React", "Three.js", "Node.js", "AI/ML"].map((tech, i) => (
                  <span
                    key={tech}
                    style={{
                      padding: "8px 16px",
                      background: "rgba(0,255,255,0.1)",
                      border: "2px solid rgba(0,255,255,0.3)",
                      borderRadius: "25px",
                      fontSize: "14px",
                      color: "cyan",
                      animation: `fade-in 0.3s ${i * 0.1}s both`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Holographic effect overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    linear-gradient(
                      180deg,
                      transparent 0%,
                      rgba(0,255,255,0.05) 50%,
                      transparent 100%
                    )
                  `,
                  animation: "hologram 2s linear infinite",
                  pointerEvents: "none",
                  mixBlendMode: "screen",
                }}
              />
            </div>

            {/* CSS Animations */}
            <style>{`
              @keyframes float-up {
                to {
                  transform: translateY(-450px);
                  opacity: 0;
                }
              }
              
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
              }
              
              @keyframes rotate-icon {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              
              @keyframes scan {
                0% { top: 0; }
                100% { top: 100%; }
              }
              
              @keyframes grid-move {
                0% { transform: translate(0, 0); }
                100% { transform: translate(4px, 4px); }
              }
              
              @keyframes glitch {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-2px); }
                40% { transform: translateX(2px); }
                60% { transform: translateX(-1px); }
                80% { transform: translateX(1px); }
              }
              
              @keyframes shimmer {
                to { left: 100%; }
              }
              
              @keyframes hologram {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(100%); }
              }
              
              @keyframes corner-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
              }
              
              @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        </Html>
      )}
    </group>
  );
};

export default ProjectsStation;