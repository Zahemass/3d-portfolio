import React, { useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mesh, Group } from "three";

// Rotating Space Ship Loader
const SpaceshipLoader: React.FC = () => {
  const shipRef = useRef<Group>(null);
  const engineRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (shipRef.current) {
      shipRef.current.rotation.y = time * 0.5;
      shipRef.current.position.y = Math.sin(time * 2) * 0.3;
    }
    
    if (engineRef.current) {
      engineRef.current.scale.setScalar(1 + Math.sin(time * 10) * 0.3);
    }
  });

  return (
    <group ref={shipRef}>
      {/* Ship Body */}
      <mesh>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial
          color="#4FC3F7"
          emissive="#4FC3F7"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Wings */}
      <mesh position={[-0.8, -0.5, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[1.5, 0.1, 0.3]} />
        <meshStandardMaterial color="#00ffff" />
      </mesh>
      <mesh position={[0.8, -0.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[1.5, 0.1, 0.3]} />
        <meshStandardMaterial color="#00ffff" />
      </mesh>
      
      {/* Engine Glow */}
      <mesh ref={engineRef} position={[0, -1.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          emissive="#ff4500"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

// Orbital Loading Ring
const LoadingRing: React.FC<{ progress: number }> = ({ progress }) => {
  const ringRef = useRef<Group>(null);

  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group ref={ringRef}>
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const isActive = i <= progress * 20;
        
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 4, Math.sin(angle) * 4, 0]}
          >
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              emissive={isActive ? "#00ff00" : "#333333"}
              emissiveIntensity={isActive ? 1 : 0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const Loader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(0);
  const [showZ, setShowZ] = useState(true);

  const loadingTexts = [
    "INITIALIZING SYSTEMS...",
    "LOADING PORTFOLIO DATA...",
    "CALIBRATING ENGINES...",
    "PREPARING FOR LAUNCH...",
    "LAUNCH SEQUENCE ACTIVATED!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 0.02;
        if (newProgress >= 1) {
          clearInterval(interval);
          return 1;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText(prev => (prev + 1) % loadingTexts.length);
    }, 1200);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(45deg, #000428 0%, #004e92 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "'Space Mono', monospace",
        overflow: "hidden"
      }}
    >
      {/* 3D Space Scene */}
      <div style={{ width: "400px", height: "400px", marginBottom: "40px" }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <Stars radius={200} depth={50} count={5000} factor={4} fade />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#4FC3F7" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#ff1493" />
          
          <SpaceshipLoader />
          <LoadingRing progress={progress} />
        </Canvas>
      </div>

      {/* Animated Z Logo */}
      <AnimatePresence>
        {showZ && (
          <motion.svg
            width="150"
            height="150"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginBottom: "30px" }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 1, type: "spring", stiffness: 200 }}
          >
            <motion.path
              d="M 30 40 H 170 L 30 160 H 170"
              stroke="url(#spaceGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="spaceGradient" x1="0" y1="0" x2="200" y2="200">
                <stop offset="0%" stopColor="#00ffff" />
                <stop offset="50%" stopColor="#ff1493" />
                <stop offset="100%" stopColor="#4FC3F7" />
              </linearGradient>
            </defs>
            
            {/* Glow Effect */}
            <motion.path
              d="M 30 40 H 170 L 30 160 H 170"
              stroke="#00ffff"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.3}
              filter="blur(5px)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Loading Text */}
      <motion.div
        key={currentText}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "30px",
          textAlign: "center",
          color: "#00ffff",
          textShadow: "0 0 20px #00ffff50"
        }}
      >
        {loadingTexts[currentText]}
      </motion.div>

      {/* Progress Bar */}
      <div style={{
        width: "400px",
        height: "6px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "3px",
        overflow: "hidden",
        marginBottom: "20px"
      }}>
        <motion.div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #00ffff, #ff1493, #4FC3F7)",
            borderRadius: "3px",
            boxShadow: "0 0 20px rgba(0,255,255,0.5)"
          }}
          animate={{
            width: `${progress * 100}%`
          }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Progress Percentage */}
      <motion.div
        style={{
          fontSize: "18px",
          color: "#4FC3F7",
          marginBottom: "40px"
        }}
        animate={{
          textShadow: [
            "0 0 10px #4FC3F7",
            "0 0 20px #4FC3F7",
            "0 0 10px #4FC3F7"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {Math.round(progress * 100)}% COMPLETE
      </motion.div>

      {/* Welcome Message */}
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{
          fontSize: "32px",
          textAlign: "center",
          background: "linear-gradient(45deg, #00ffff, #ff1493)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "20px"
        }}
      >
        Welcome to Zaheer's Space
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          fontSize: "16px",
          color: "#4FC3F7",
          textAlign: "center",
          opacity: 0.8
        }}
      >
        Preparing for portfolio exploration mission...
      </motion.div>

      {/* Floating Particles */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden"
      }}>
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: "2px",
              height: "2px",
              background: i % 3 === 0 ? "#00ffff" : i % 3 === 1 ? "#ff1493" : "#4FC3F7",
              borderRadius: "50%",
              left: `${Math.random() * 100}%`,
              top: `${100 + Math.random() * 20}%`,
            }}
            animate={{
              y: [-50, -window.innerHeight - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* System Status */}
      <div style={{
        position: "absolute",
        bottom: "30px",
        left: "30px",
        fontSize: "12px",
        color: "#666",
        fontFamily: "'Space Mono', monospace"
      }}>
        <div>SYSTEM STATUS: ONLINE</div>
        <div>ENGINES: CHARGING</div>
        <div>PORTFOLIO: READY</div>
      </div>

      {/* Version Info */}
      <div style={{
        position: "absolute",
        bottom: "30px",
        right: "30px",
        fontSize: "12px",
        color: "#666",
        fontFamily: "'Space Mono', monospace"
      }}>
        SPACE PORTFOLIO v2.0
      </div>
    </motion.div>
  );
};

export default Loader;