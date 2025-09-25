import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Text, useGLTF } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Mesh, Group, Vector3, Color } from "three";


// Massive Rotating Space Station
const SpaceStation: React.FC<{ phase: number }> = ({ phase }) => {
  const stationRef = useRef<Group>(null);
  const ringsRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (stationRef.current) {
      stationRef.current.rotation.y += 0.005;
      stationRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
    }
    
    if (ringsRef.current) {
      ringsRef.current.rotation.x += 0.01;
      ringsRef.current.rotation.z += 0.008;
    }
  });

  return (
    <group ref={stationRef} scale={phase >= 1 ? 1 : 0}>
      {/* Central Core */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#4FC3F7"
          emissive="#4FC3F7"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Rotating Rings */}
      <group ref={ringsRef}>
        {[4, 6, 8, 10].map((radius, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, i * Math.PI / 4]}>
            <torusGeometry args={[radius, 0.3, 16, 100]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#00ffff" : "#ff1493"}
              emissive={i % 2 === 0 ? "#00ffff" : "#ff1493"}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Docking Bays */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[12, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.8, 2]} />
              <meshStandardMaterial
                color="#ffd700"
                emissive="#ffd700"
                emissiveIntensity={0.5}
              />
            </mesh>
            {/* Docking Lights */}
            <mesh position={[12, 0, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial
                emissive="#ffffff"
                emissiveIntensity={2}
              />
            </mesh>
          </group>
        );
      })}

      {/* Energy Streams */}
      {phase >= 2 && [...Array(12)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((Date.now() * 0.001) + i) * 15,
            Math.cos((Date.now() * 0.002) + i) * 8,
            Math.sin((Date.now() * 0.0015) + i) * 12
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            emissive="#00ff88"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
};

// Floating Debris Field
const DebrisField: React.FC = () => {
  const debrisRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (debrisRef.current) {
      debrisRef.current.children.forEach((debris, i) => {
        const time = clock.getElapsedTime();
        debris.rotation.x += 0.01 * (i % 3 + 1);
        debris.rotation.y += 0.008 * (i % 2 + 1);
        debris.position.x = Math.sin(time * 0.1 + i) * 20;
        debris.position.z = Math.cos(time * 0.08 + i) * 25;
      });
    }
  });

  return (
    <group ref={debrisRef}>
      {[...Array(30)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 40 - 20,
            Math.random() * 30 - 15,
            Math.random() * 50 - 25
          ]}
          scale={Math.random() * 0.5 + 0.2}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#666666"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

// Massive Nebula Effect
const NebulaCloud: React.FC<{ phase: number }> = ({ phase }) => {
  const cloudRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.002;
      cloudRef.current.children.forEach((cloud, i) => {
        cloud.rotation.x = Math.sin(time * 0.3 + i) * 0.5;
        cloud.rotation.z = Math.cos(time * 0.2 + i) * 0.3;
      });
    }
  });

  return (
    <group ref={cloudRef}>
      {phase >= 1 && [...Array(15)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / 15) * Math.PI * 2) * 30,
            Math.random() * 20 - 10,
            Math.cos((i / 15) * Math.PI * 2) * 30
          ]}
          scale={[8, 4, 8]}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={`hsl(${240 + i * 20}, 100%, 70%)`}
            transparent
            opacity={0.1}
            emissive={`hsl(${240 + i * 20}, 100%, 50%)`}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

// Dynamic Camera Controller
const CameraController: React.FC<{ phase: number }> = ({ phase }) => {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    switch (phase) {
      case 0:
        // Wide establishing shot
        camera.position.x = Math.sin(time * 0.1) * 50;
        camera.position.y = 20;
        camera.position.z = Math.cos(time * 0.1) * 50;
        camera.lookAt(0, 0, 0);
        break;
      case 1:
        // Closer orbit around station
        camera.position.x = Math.sin(time * 0.2) * 25;
        camera.position.y = 10;
        camera.position.z = Math.cos(time * 0.2) * 25;
        camera.lookAt(0, 0, 0);
        break;
      case 2:
        // Dramatic approach
        camera.position.x = Math.sin(time * 0.15) * 15;
        camera.position.y = 5;
        camera.position.z = Math.cos(time * 0.15) * 15;
        camera.lookAt(0, 0, 0);
        break;
      case 3:
        // Final positioning
        camera.position.x = 0;
        camera.position.y = 3;
        camera.position.z = 20;
        camera.lookAt(0, 0, 0);
        break;
    }
  });

  return null;
};

const IntroScene: React.FC = () => {
  const [phase, setPhase] = useState(0);
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 3000),
      setTimeout(() => setPhase(2), 6000),
      setTimeout(() => setPhase(3), 9000),
      setTimeout(() => setShowUI(true), 12000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const phaseTexts = [
    "ENTERING DEEP SPACE SECTOR...",
    "SPACE STATION DETECTED...",
    "INITIALIZING DOCKING SEQUENCE...",
    "WELCOME TO THE PORTFOLIO STATION"
  ];

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "radial-gradient(ellipse at center, #001122 0%, #000000 100%)",
      overflow: "hidden"
    }}>
      {/* Massive 3D Scene */}
      <Canvas
        camera={{ position: [0, 20, 50], fov: 60 }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Epic Background */}
        <Stars radius={500} depth={100} count={15000} factor={8} fade speed={2} />
        
        {/* Dramatic Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[50, 50, 25]} intensity={2} color="#ffffff" />
        <pointLight position={[0, 0, 0]} intensity={3} color="#4FC3F7" distance={100} />
        <pointLight position={[20, 20, 20]} intensity={2} color="#ff1493" distance={80} />
        <pointLight position={[-20, -20, -20]} intensity={2} color="#00ff88" distance={80} />

        <CameraController phase={phase} />
        <SpaceStation phase={phase} />
        <NebulaCloud phase={phase} />
        <DebrisField />

        {/* 3D Title Text */}
        {phase >= 2 && (
          <Text
            position={[0, -15, 0]}
            fontSize={3}
            color="#00ffff"
            anchorX="center"
            anchorY="middle"
            outlineColor="#000000"
            outlineWidth={0.02}
          >
            PORTFOLIO STATION
          </Text>
        )}
      </Canvas>

      {/* Status Display */}
      <div style={{
        position: "absolute",
        top: "50px",
        left: "50px",
        color: "#00ffff",
        fontFamily: "'Space Mono', monospace",
        fontSize: "18px",
        textShadow: "0 0 10px #00ffff"
      }}>
        <div>STATUS: {phaseTexts[phase]}</div>
        <div style={{ marginTop: "10px", fontSize: "14px", opacity: 0.7 }}>
          PHASE {phase + 1}/4
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        position: "absolute",
        bottom: "50px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "400px",
        height: "6px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "3px",
        overflow: "hidden"
      }}>
        <motion.div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #00ffff, #ff1493, #00ff88)",
            borderRadius: "3px",
          }}
          animate={{
            width: `${((phase + 1) / 4) * 100}%`
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Final UI */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontFamily: "'Space Mono', monospace",
              textAlign: "center"
            }}
          >
            <motion.h1
              style={{
                fontSize: "4rem",
                marginBottom: "20px",
                background: "linear-gradient(45deg, #00ffff, #ff1493)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              MOHAMMED ZAHEER
            </motion.h1>
            
            <motion.h2
              style={{ fontSize: "1.5rem", marginBottom: "40px", color: "#4FC3F7" }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Space Portfolio Explorer Ready
            </motion.h2>

            <motion.div
  style={{ fontSize: "16px", opacity: 0.8 }}
  initial={{ opacity: 0 }}
  animate={{ opacity: [0.8, 1, 0.8] }}
  transition={{
    delay: 1.5,
    duration: 2,
    repeat: Infinity
  }}
>
  Press any key to begin exploration...
</motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntroScene;