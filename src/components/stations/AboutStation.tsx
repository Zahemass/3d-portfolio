import React, { useRef, useState, useEffect } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

interface AboutStationProps {
  shipPos: Vector3;
  onOpen: () => void;
  activeStation: string | null; 
}

const AboutStation: React.FC<AboutStationProps> = ({ shipPos, onOpen, activeStation }) => {
  const stationPos: [number, number, number] = [-30, 0, -50];
  const dist = shipPos.distanceTo(new Vector3(...stationPos));
  const { scene } = useGLTF("/models/about_station.glb");
  const ref = useRef<any>(null);
  const glowRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/tablet devices and orientation
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;
      const isMobileDevice = width <= 1024; // Covers tablets too
      setIsMobile(isMobileDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  // Animation loop for dynamic effects
  useFrame((state) => {
    if (ref.current && glowRef.current) {
      // Gentle rotation
      ref.current.rotation.y += 0.002;
      
      // Pulsing glow effect
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.4;
      glowRef.current.material.emissiveIntensity = pulse;
      
      // Distance-based scaling with mobile adjustment
      const baseScale = isMobile ? 3 : 5;
      const proximityScale = Math.max(0.8, Math.min(1.2, (200 - dist) / 100));
      ref.current.scale.setScalar(baseScale * proximityScale);
      
      setPulsePhase(state.clock.elapsedTime);
    }
  });

  

  // Calculate interaction intensity based on distance
  const intensity = Math.max(0, (100 - dist) / 100);
 const cardScale = hovered ? 1.2 : 1.05;


  // Particle positions for floating elements (fewer on mobile)
  const particleCount = isMobile ? 4 : 8;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = (isMobile ? 15 : 25) + Math.sin(pulsePhase + i) * 3;
    return [
      Math.cos(angle) * radius,
      Math.sin(pulsePhase * 0.5 + i) * 2,
      Math.sin(angle) * radius
    ];
  });

  // Responsive values
  const cardWidth = isMobile ? "95vw" : "800px";
const maxCardWidth = isMobile ? "600px" : "800px";
const padding = isMobile ? "25px 30px" : "50px 60px";
const borderRadius = isMobile ? "20px" : "30px";

  const fontSize = {
    title: isMobile ? "1.6rem" : "2.2rem",
    emoji: isMobile ? "2rem" : "3rem",
    text: isMobile ? "1rem" : "1.3rem",
    small: isMobile ? "0.8rem" : "0.9rem",
    iconEmoji: isMobile ? "1.2rem" : "1.5rem"
  };

  return (
    <group ref={ref} position={stationPos} scale={isMobile ? 3 : 5}>
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
      {activeStation === null &&  (
        <Html 
          distanceFactor={isMobile ? 10 : 14} 
          position={[0, 1.5, 2]}
          style={{
            pointerEvents: 'auto',
            userSelect: 'none'
          }}
        >
          <div
            onClick={onOpen}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onTouchStart={() => setHovered(true)}
            onTouchEnd={() => setHovered(false)}
            style={{
              padding,
              borderRadius,
              background: `linear-gradient(135deg, 
                rgba(0,0,0,0.95) 0%, 
                rgba(0,20,40,0.95) 50%, 
                rgba(0,0,0,0.95) 100%)`,
              border: `${isMobile ? '2px' : '3px'} solid cyan`,
              borderImage: "linear-gradient(45deg, cyan, #00ffff, cyan) 1",
              color: "cyan",
              textAlign: "center",
              fontFamily: "'Space Mono', monospace",
              width: cardWidth,
              maxWidth: maxCardWidth,
               minWidth: isMobile ? "300px" : "500px",
              minHeight: isMobile ? "300px" : "450px",  
              
              boxShadow: `
                0 0 ${isMobile ? '20px' : '40px'} rgba(0,255,255,${0.8 + intensity * 0.4}), 
                0 0 ${isMobile ? '40px' : '80px'} rgba(0,255,255,${0.4 + intensity * 0.3}),
                inset 0 0 ${isMobile ? '10px' : '20px'} rgba(0,255,255,0.1)
              `,
              cursor: "pointer",
              transform: `scale(${cardScale}) translateZ(0)`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              backdropFilter: "blur(10px)",
              position: "relative",
              overflow: "hidden",
              // Mobile optimizations
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
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
              <div style={{ marginBottom: isMobile ? "15px" : "20px" }}>
                <div
                  style={{
                    fontSize: fontSize.emoji,
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
                    fontSize: fontSize.title,
                    marginBottom: "0",
                    textShadow: "0 0 20px cyan, 0 0 40px rgba(0,255,255,0.5)",
                    background: "linear-gradient(45deg, cyan, #00ffff, cyan)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: hovered ? "textGlow 2s infinite alternate" : "none",
                    lineHeight: 1.2,
                  }}
                >
                  About Me
                </h2>
              </div>

              {/* Interactive elements */}
              <div style={{ marginBottom: isMobile ? "15px" : "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginBottom: "15px",
                    flexWrap: "wrap",
                    gap: isMobile ? "5px" : "0",
                  }}
                >
                  {["🚀", "💻", "🌟"].map((emoji, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: fontSize.iconEmoji,
                        padding: isMobile ? "8px" : "10px",
                        borderRadius: "10px",
                        background: "rgba(0,255,255,0.1)",
                        transform: hovered ? `translateY(-${5 + i * 2}px) rotateZ(${i * 10}deg)` : "translateY(0)",
                        transition: `transform 0.3s ease ${i * 0.1}s`,
                        boxShadow: "0 0 15px rgba(0,255,255,0.3)",
                        flex: isMobile ? "0 1 auto" : "none",
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
                  fontSize: fontSize.text,
                  opacity: 0.9,
                  marginBottom: isMobile ? "12px" : "15px",
                  animation: "pulse 2s infinite ease-in-out",
                  lineHeight: 1.3,
                }}
              >
                {isMobile ? "Tap to explore my journey 🚀" : "Click to explore my journey 🚀"}
              </p>

              {/* Progress bar indicator */}
              <div
                style={{
                  width: "100%",
                  height: isMobile ? "2px" : "3px",
                  background: "rgba(0,255,255,0.2)",
                  borderRadius: "2px",
                  overflow: "hidden",
                  marginTop: isMobile ? "15px" : "20px",
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
                  fontSize: fontSize.small,
                  opacity: 0.7,
                  marginTop: isMobile ? "8px" : "10px",
                  fontWeight: "300",
                  lineHeight: 1.2,
                }}
              >
                Distance: {Math.round(dist)}m • Signal: {Math.round(intensity * 100)}%
              </div>
            </div>

            {/* Corner accent lines - hidden on very small screens */}
            {!isMobile && [0, 1, 2, 3].map(i => (
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

          {/* CSS Animations with mobile optimizations */}
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.9; }
              50% { opacity: 1; }
            }
            @keyframes textGlow {
              from { text-shadow: 0 0 20px cyan, 0 0 40px rgba(0,255,255,0.5); }
              to { text-shadow: 0 0 30px cyan, 0 0 60px rgba(0,255,255,0.8), 0 0 80px rgba(0,255,255,0.3); }
            }
            
            /* Mobile-specific styles */
            @media (max-width: 768px) and (orientation: landscape) {
              .about-station-card {
                max-height: 80vh;
                overflow-y: auto;
              }
            }
            
            /* Touch device optimizations */
            @media (hover: none) and (pointer: coarse) {
              .about-station-card {
                transform: scale(1) !important;
              }
              .about-station-card:active {
                transform: scale(0.95) !important;
              }
            }
          `}</style>
        </Html>
      )}
    </group>
  );
};

export default AboutStation;