import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { motion, AnimatePresence } from "framer-motion";
import Spaceship from "./Spaceship";

// Your existing components
import AboutStation from "./stations/AboutStation";
import ProjectsStation from "./stations/ProjectsStation";
import SkillsStation from "./stations/SkillsStation";
import ContactStation from "./stations/ContactStation";

// Your existing overlays
import AboutOverlay from "./overlays/AboutOverlay";
import ProjectsOverlay from "./overlays/ProjectsOverlay";
import SkillsOverlay from "./overlays/SkillsOverlay";
import ContactOverlay from "./overlays/ContactOverlay";

// Your professional components
import Header from "./Header";
import Hero from "./Hero";
import About from "./About";
import Projects from "./Projects";
import Skills from "./Skills";
import Contact from "./Contact";
import Footer from "./Footer";

interface SpaceGameProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpaceGame: React.FC<SpaceGameProps> = ({ darkMode, setDarkMode }) => {
  const [hud, setHud] = useState<any>({
    speed: "0.00",
    position: new Vector3(),
    velocity: new Vector3(),
    fuel: 100,
    health: 100,
  });

  const [paused, setPaused] = useState(false);
  const [gameMode, setGameMode] = useState<'exploration' | 'professional'>('exploration');
  
  // Enhanced overlay states
  const [showAbout, setShowAbout] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Interactive features
  const [nearbyStation, setNearbyStation] = useState<string | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [experience, setExperience] = useState(0);
  const [level, setLevel] = useState(1);
  
  const [firstTimeAbout, setFirstTimeAbout] = useState(true);

  // Enhanced station data
  const stations = [
    {
      id: 'about',
      name: 'Identity Station',
      position: new Vector3(-50, 20, -30),
      color: '#00ffff',
      icon: '👨‍🚀',
      description: 'Personal Profile & Background',
    },
    {
      id: 'projects',
      name: 'Project Observatory',
      position: new Vector3(60, -10, 40),
      color: '#ff6b6b', 
      icon: '🚀',
      description: 'Mission Archives & Developments',
    },
    {
      id: 'skills',
      name: 'Technology Hub',
      position: new Vector3(-40, -30, 60),
      color: '#4ecdc4',
      icon: '⚡',
      description: 'Skill Matrix & Capabilities',
    },
    {
      id: 'contact',
      name: 'Communication Array',
      position: new Vector3(45, 35, -20),
      color: '#ffd700',
      icon: '📡',
      description: 'Establish Contact Protocols',
    },
  ];

  // Check proximity to stations
  useEffect(() => {
    const checkProximity = () => {
      let closestStation = null;
      let minDistance = Infinity;

      stations.forEach(station => {
        const distance = hud.position.distanceTo(station.position);
        if (distance < 15 && distance < minDistance) {
          minDistance = distance;
          closestStation = station.id;
        }
      });

      setNearbyStation(closestStation);
    };

    checkProximity();
  }, [hud.position]);

  // Experience system
  const gainExperience = (amount: number) => {
    const newExp = experience + amount;
    const newLevel = Math.floor(newExp / 100) + 1;
    setExperience(newExp);
    setLevel(newLevel);
  };

  // Professional mode toggle
  const toggleGameMode = () => {
    setGameMode(gameMode === 'exploration' ? 'professional' : 'exploration');
    if (gameMode === 'exploration') {
      setPaused(true);
    } else {
      setPaused(false);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* Enhanced 3D Scene */}
      <Canvas
        shadows
        style={{ width: "100%", height: "100%", background: "radial-gradient(ellipse at center, #001122 0%, #000000 100%)" }}
        camera={{ fov: 60, near: 0.1, far: 2000 }}
      >
        {/* Enhanced Background */}
        <Stars radius={300} depth={80} count={10000} factor={6} fade speed={0.5} />
        
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.4} color="#001122" />
        <directionalLight 
          intensity={2} 
          position={[100, 100, -50]} 
          color="#ffffff"
          castShadow
        />
        <pointLight position={[0, 0, 0]} intensity={1} color="#00ffff" distance={100} />

        {/* Your existing Spaceship */}
        <Spaceship 
          setHud={setHud} 
          paused={paused}
        />

        {/* Your existing stations */}
        <AboutStation
          shipPos={hud.position}
          showAbout={showAbout}
          onOpen={() => {
            setPaused(true);
            setShowAbout(true);
            gainExperience(25);
          }}
        />
        <ProjectsStation
          shipPos={hud.position}
          showProjects={showProjects}
          onOpen={() => {
            setPaused(true);
            setShowProjects(true);
            gainExperience(25);
          }}
        />
        <SkillsStation
          shipPos={hud.position}
          showSkills={showSkills}
          onOpen={() => {
            setPaused(true);
            setShowSkills(true);
            gainExperience(25);
          }}
        />
        <ContactStation
          shipPos={hud.position}
          showContact={showContact}
          onOpen={() => {
            setPaused(true);
            setShowContact(true);
            gainExperience(25);
          }}
        />

        {/* Remove OrbitControls - conflicts with spaceship camera */}
        {/* Only enable OrbitControls when paused/in overlays */}
        {paused && (
          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={100}
          />
        )}
      </Canvas>

      {/* Enhanced HUD System */}
      <AnimatePresence>
        {!paused && gameMode === 'exploration' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: "20px",
              background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
              color: "white",
              fontFamily: "'Space Mono', monospace",
              zIndex: 100,
            }}
          >
            {/* Top HUD Bar */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px"
            }}>
              {/* Left Side - Ship Status */}
              <div style={{
                background: "rgba(0,255,255,0.1)",
                border: "1px solid #00ffff",
                borderRadius: "12px",
                padding: "12px 20px",
                display: "flex",
                gap: "20px",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: "10px", opacity: 0.7, marginBottom: "2px" }}>VELOCITY</div>
                  <div style={{ fontSize: "16px", color: "#00ffff", fontWeight: "bold" }}>
                    {parseFloat(hud.speed) > 1 ? parseFloat(hud.speed).toFixed(1) : hud.speed} U/s
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", opacity: 0.7, marginBottom: "2px" }}>FUEL</div>
                  <div style={{
                    width: "60px",
                    height: "8px",
                    background: "#333",
                    borderRadius: "4px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${hud.fuel || 100}%`,
                      height: "100%",
                      background: (hud.fuel || 100) > 30 ? "#00ff00" : "#ff4500",
                      transition: "all 0.3s"
                    }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", opacity: 0.7, marginBottom: "2px" }}>LEVEL</div>
                  <div style={{ fontSize: "16px", color: "#ffd700", fontWeight: "bold" }}>
                    {level}
                  </div>
                </div>
              </div>

              {/* Center - Mission Status */}
              <div style={{ textAlign: "center" }}>
                <h1 style={{ 
                  margin: 0, 
                  fontSize: "24px", 
                  color: "#00ffff",
                  textShadow: "0 0 10px #00ffff50"
                }}>
                  🚀 SPACE PORTFOLIO EXPLORER
                </h1>
                {nearbyStation && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      marginTop: "8px",
                      padding: "6px 12px",
                      background: "rgba(255,215,0,0.2)",
                      border: "1px solid #ffd700",
                      borderRadius: "20px",
                      fontSize: "12px",
                      color: "#ffd700"
                    }}
                  >
                    📡 APPROACHING: {stations.find(s => s.id === nearbyStation)?.name.toUpperCase()}
                  </motion.div>
                )}
              </div>

              {/* Right Side - Controls */}
              <div style={{
                display: "flex",
                gap: "10px",
                alignItems: "center"
              }}>
                <button
                  onClick={() => setScannerActive(!scannerActive)}
                  style={{
                    padding: "8px 12px",
                    background: scannerActive ? "rgba(0,255,0,0.2)" : "rgba(0,0,0,0.3)",
                    border: `1px solid ${scannerActive ? "#00ff00" : "#666"}`,
                    borderRadius: "8px",
                    color: scannerActive ? "#00ff00" : "#ccc",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontFamily: "inherit"
                  }}
                >
                  📊 SCAN
                </button>
                <button
                  onClick={toggleGameMode}
                  style={{
                    padding: "8px 12px",
                    background: "rgba(255,107,107,0.2)",
                    border: "1px solid #ff6b6b",
                    borderRadius: "8px",
                    color: "#ff6b6b",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontFamily: "inherit"
                  }}
                >
                  💼 PROFESSIONAL
                </button>
              </div>
            </div>

            {/* Scanner Active Display */}
            {scannerActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  background: "rgba(0,255,0,0.1)",
                  border: "1px solid #00ff0050",
                  borderRadius: "8px",
                  padding: "15px",
                  marginTop: "10px"
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                  {stations.map(station => {
                    const distance = hud.position.distanceTo(station.position);
                    return (
                      <div key={station.id} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px",
                        background: distance < 15 ? "rgba(255,215,0,0.1)" : "rgba(0,0,0,0.2)",
                        borderRadius: "6px",
                        border: distance < 15 ? "1px solid #ffd700" : "1px solid #333"
                      }}>
                        <span style={{ color: station.color }}>{station.icon} {station.name}</span>
                        <span style={{ fontSize: "10px", opacity: 0.7 }}>
                          {distance.toFixed(1)}u
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Control Instructions */}
      {!paused && gameMode === 'exploration' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            right: "20px",
            background: "rgba(0,0,0,0.8)",
            border: "1px solid #00ffff30",
            borderRadius: "12px",
            padding: "15px",
            color: "white",
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px"
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
            <div><strong>🎮 NAVIGATION:</strong></div>
            <div>W/↑ - Forward Thrust</div>
            <div>A/← D/→ - Strafe Left/Right</div>
            <div>S/↓ - Reverse</div>
            <div>SPACE - Ascend</div>
            <div>SHIFT - Descend</div>
            <div><strong>🎯 INTERACTION:</strong></div>
            <div>Approach stations to dock</div>
          </div>
        </motion.div>
      )}

      {/* Professional Mode Overlay */}
      {gameMode === "professional" && (
  <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  style={{
    position: "absolute",
    inset: 0,
    background: darkMode
      ? "linear-gradient(135deg, #172435ff, #302b63, #24243e)" // dark space look
      : "#ffffffff", // cream white background for light mode
    color: darkMode ? "white" : "black",
    overflowY: "auto",
    zIndex: 2000,
  }}
>
    {/* Navbar */}
    <Header
  darkMode={darkMode}
  toggleDarkMode={() => setDarkMode(!darkMode)}
  gameMode={gameMode}
  toggleGameMode={toggleGameMode}
/>


    {/* Sections */}
    <Hero />
    <About />
    <Projects />
    <Skills />
    <Contact />
    <Footer />
  </motion.div>
)}



      {/* Your existing overlays */}
      {/* Overlays with exit animations */}
{/* Overlays with exit animations */}
<AnimatePresence mode="wait">
  {showSkills && (
    <motion.div
      key="skills-overlay"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      <SkillsOverlay
        onClose={() => {
          setShowSkills(false);
          setPaused(false);
        }}
      />
    </motion.div>
  )}
  {showAbout && (
    <motion.div
      key="about-overlay"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      <AboutOverlay
        onClose={() => {
          setShowAbout(false);
          setPaused(false);
          setFirstTimeAbout(false);
        }}
        firstTime={firstTimeAbout}
        setFirstTime={setFirstTimeAbout}
      />
    </motion.div>
  )}
  {showProjects && (
    <motion.div
      key="projects-overlay"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      <ProjectsOverlay
        onClose={() => {
          setShowProjects(false);
          setPaused(false);
        }}
      />
    </motion.div>
  )}
  {showContact && (
    <motion.div
      key="contact-overlay"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      <ContactOverlay
        onClose={() => {
          setShowContact(false);
          setPaused(false);
        }}
      />
    </motion.div>
  )}
</AnimatePresence>


    </div>
  );
};

export default SpaceGame;