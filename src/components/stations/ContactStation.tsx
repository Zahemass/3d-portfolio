import React, { useRef, useState, useEffect } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

interface ContactStationProps {
  shipPos: Vector3;
  activeStation: string | null; 
  onOpen: () => void;
}

const ContactStation: React.FC<ContactStationProps> = ({
  shipPos,
  activeStation,
  onOpen,
}) => {
  const stationPos: [number, number, number] = [20, 10, -170];
  const dist = shipPos.distanceTo(new Vector3(...stationPos));
  const { scene } = useGLTF("/models/contact_station.glb");
  const ref = useRef<any>(null);
  const glowRef = useRef<any>(null);
  const outerGlowRef = useRef<any>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0.4);
  const [signalRings, setSignalRings] = useState<Array<{size: number, opacity: number, rotation: number}>>([]);
  const [dataStream, setDataStream] = useState<Array<{x: number, y: number, char: string, opacity: number}>>([]);
  const [connectionStatus, setConnectionStatus] = useState("SCANNING...");

  // Initialize signal rings
  useEffect(() => {
    const rings = Array.from({ length: 4 }, (_, i) => ({
      size: 50 + i * 30,
      opacity: 0.3 - i * 0.05,
      rotation: i * 45,
    }));
    setSignalRings(rings);
  }, []);

  // Initialize data stream
  useEffect(() => {
    const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}[]|;':,.<>?";
    const stream = Array.from({ length: 25 }, () => ({
      x: Math.random() * 280 - 140,
      y: Math.random() * 240 - 120,
      char: chars[Math.floor(Math.random() * chars.length)],
      opacity: Math.random() * 0.6 + 0.2,
    }));
    setDataStream(stream);
  }, []);

  // Connection status cycle
  useEffect(() => {
    const statuses = ["SCANNING...", "SIGNAL FOUND", "ESTABLISHING LINK", "READY TO CONNECT"];
    let index = 0;
    const interval = setInterval(() => {
      setConnectionStatus(statuses[index]);
      index = (index + 1) % statuses.length;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate all effects
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Pulsing glow effect
    const pulse = Math.sin(time * 3) * 0.2 + 0.5;
    setPulseIntensity(pulse);
    
    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = pulse;
    }
    if (outerGlowRef.current) {
      outerGlowRef.current.material.emissiveIntensity = pulse * 0.4;
    }

    // Animate signal rings
    setSignalRings(prev => prev.map((ring, i) => ({
      ...ring,
      rotation: ring.rotation + 0.5 + i * 0.2,
      opacity: 0.3 + Math.sin(time * 2 + i) * 0.1,
    })));

    // Animate data stream
    setDataStream(prev => prev.map((item, i) => ({
      ...item,
      y: item.y + 1 + Math.sin(time + i) * 0.5,
      opacity: 0.3 + Math.sin(time * 1.5 + i) * 0.3,
      char: Math.random() > 0.98 ? 
        "01ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}[]|;':,.<>?"[Math.floor(Math.random() * 59)] : 
        item.char,
    })));
  });

 

  return (
    <group ref={ref} position={stationPos} scale={5}>
      {dist < 70 ? (
  <primitive object={scene} />
) : (
  <mesh>
    <sphereGeometry args={[12, 32, 32]} />
    <meshBasicMaterial 
      color="cyan" 
      wireframe 
      transparent 
      opacity={0.15} 
    />
  </mesh>
)}

{/* Multi-layered glow system (always visible) */}
<mesh ref={glowRef}>
  <sphereGeometry args={[20, 64, 64]} />
  <meshStandardMaterial
    emissive="cyan"
    emissiveIntensity={pulseIntensity}
    transparent
    opacity={0.07}
  />
</mesh>
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[25, 32, 32]} />
        <meshStandardMaterial
          emissive="#00aaff"
          emissiveIntensity={pulseIntensity * 0.4}
          transparent
          opacity={0.04}
        />
      </mesh>

      {/* Signal transmission rings */}
      <mesh>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial
          emissive="#0088cc"
          emissiveIntensity={pulseIntensity * 0.2}
          transparent
          opacity={0.02}
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
              padding: "45px 35px",
              borderRadius: "18px",
              background: isHovering 
                ? "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,20,30,0.9))"
                : "linear-gradient(135deg, rgba(0,0,0,0.85), rgba(0,10,20,0.8))",
              border: isHovering 
                ? "3px solid #00ffff" 
                : "2px solid cyan",
              color: "#88ffff",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "40px",
              textAlign: "center",
              width: "640px",
              height: "600px",
              boxShadow: isHovering 
                ? "0 0 60px rgba(0,255,255,0.8), inset 0 0 30px rgba(0,255,255,0.1)"
                : "0 0 35px rgba(0,255,255,0.5)",
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: `scale(${isHovering ? 1.08 : 1}) rotateX(${isHovering ? '5deg' : '0deg'})`,
              backdropFilter: "blur(12px)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Data stream background */}
            {dataStream.map((item, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${item.x + 170}px`,
                  top: `${item.y + 150}px`,
                  color: "rgba(0,255,255,0.4)",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  opacity: item.opacity,
                  pointerEvents: "none",
                  animation: "dataGlow 2s ease-in-out infinite alternate",
                }}
              >
                {item.char}
              </div>
            ))}

            {/* Signal rings overlay */}
            {signalRings.map((ring, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: `${ring.size}px`,
                  height: `${ring.size}px`,
                  border: `1px solid rgba(0,255,255,${ring.opacity})`,
                  borderRadius: "50%",
                  transform: `translate(-50%, -50%) rotate(${ring.rotation}deg)`,
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* Header section */}
            <div style={{ zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              {/* Connection status indicator */}
              <div
                style={{
                  fontSize: "10px",
                  color: "#00cccc",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  opacity: 0.7,
                  fontFamily: "monospace",
                }}
              >
                {connectionStatus}
              </div>
              
              {/* Main antenna icon with radar sweep */}
              <div
                style={{
                  position: "relative",
                  fontSize: "54px",
                  filter: isHovering ? "drop-shadow(0 0 25px #00ffff)" : "drop-shadow(0 0 15px #00ffff)",
                  animation: isHovering ? "pulse 1s ease-in-out infinite" : "none",
                }}
              >
                📡
                {/* Radar sweep line */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "60px",
                    height: "2px",
                    background: "linear-gradient(90deg, transparent, #00ffff, transparent)",
                    transformOrigin: "left center",
                    transform: "translate(-50%, -50%)",
                    animation: "radarSweep 3s linear infinite",
                    opacity: isHovering ? 0.8 : 0.4,
                  }}
                />
              </div>
            </div>

            {/* Main title */}
            <div
              style={{
                zIndex: 10,
                background: isHovering 
                  ? "linear-gradient(45deg, #88ffff, #00ffff, #88ffff)"
                  : "none",
                backgroundClip: isHovering ? "text" : "none",
                WebkitBackgroundClip: isHovering ? "text" : "none",
                color: isHovering ? "transparent" : "#88ffff",
                backgroundSize: "200% 200%",
                animation: isHovering ? "gradientShift 2s ease-in-out infinite" : "none",
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
                lineHeight: "1.2",
              }}
            >
              Communication Hub
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: "14px",
                opacity: 0.8,
                fontWeight: "normal",
                zIndex: 10,
                fontStyle: "italic",
                color: "#66dddd",
              }}
            >
              Establish contact & transmit data
            </div>

            {/* Connection indicators */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                zIndex: 10,
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#00ff00",
                  boxShadow: "0 0 10px rgba(0,255,0,0.5)",
                  animation: "blink 1s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: "12px", color: "#88ffff" }}>ONLINE</span>
              <div
                style={{
                  marginLeft: "20px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  color: "#44cccc",
                }}
              >
                FREQ: 144.39 MHz
              </div>
            </div>

            {/* Progress bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "80%", zIndex: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#66cccc" }}>
                <span>Signal Strength</span>
                <span>████▓░░░</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#66cccc" }}>
                <span>Data Integrity</span>
                <span>██████▓░</span>
              </div>
            </div>

            {/* CSS animations */}
            <style>
              {`
                @keyframes pulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.1); }
                }
                @keyframes gradientShift {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                @keyframes radarSweep {
                  0% { transform: translate(-50%, -50%) rotate(0deg); }
                  100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
                @keyframes blink {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.3; }
                }
                @keyframes dataGlow {
                  0% { text-shadow: 0 0 5px rgba(0,255,255,0.5); }
                  100% { text-shadow: 0 0 10px rgba(0,255,255,0.8), 0 0 15px rgba(0,255,255,0.3); }
                }
              `}
            </style>
          </div>
        </Html>
      )}
    </group>
  );
};

export default ContactStation;