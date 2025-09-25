// filename: src/components/SpaceGame.tsx
import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { motion, AnimatePresence } from "framer-motion";
import Spaceship from "./Spaceship";
import { Joystick } from "react-joystick-component";

// Stations
import AboutStation from "./stations/AboutStation";
import ProjectsStation from "./stations/ProjectsStation";
import SkillsStation from "./stations/SkillsStation";
import ContactStation from "./stations/ContactStation";

// Overlays
import AboutOverlay from "./overlays/AboutOverlay";
import ProjectsOverlay from "./overlays/ProjectsOverlay";
import SkillsOverlay from "./overlays/SkillsOverlay";
import ContactOverlay from "./overlays/ContactOverlay";

// Professional sections
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [joystickDir, setJoystickDir] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [hud, setHud] = useState<any>({
    speed: "0.00",
    position: new Vector3(),
    velocity: new Vector3(),
    fuel: 100,
    health: 100,
  });

  const [paused, setPaused] = useState(false);
  const [gameMode, setGameMode] = useState<"exploration" | "professional">("exploration");

  const [showAbout, setShowAbout] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const [nearbyStation, setNearbyStation] = useState<string | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [experience, setExperience] = useState(0);
  const [level, setLevel] = useState(1);
  const [firstTimeAbout, setFirstTimeAbout] = useState(true);

  const stations = [
    {
      id: "about",
      name: "Identity Station",
      position: new Vector3(-50, 20, -30),
      color: "#00ffff",
      icon: "👨‍🚀",
      description: "Personal Profile & Background",
    },
    {
      id: "projects",
      name: "Project Observatory",
      position: new Vector3(60, -10, 40),
      color: "#ff6b6b",
      icon: "🚀",
      description: "Mission Archives & Developments",
    },
    {
      id: "skills",
      name: "Technology Hub",
      position: new Vector3(-40, -30, 60),
      color: "#4ecdc4",
      icon: "⚡",
      description: "Skill Matrix & Capabilities",
    },
    {
      id: "contact",
      name: "Communication Array",
      position: new Vector3(45, 35, -20),
      color: "#ffd700",
      icon: "📡",
      description: "Establish Contact Protocols",
    },
  ];

  useEffect(() => {
    const checkProximity = () => {
      let closestStation = null;
      let minDistance = Infinity;

      stations.forEach((station) => {
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

  const gainExperience = (amount: number) => {
    const newExp = experience + amount;
    const newLevel = Math.floor(newExp / 100) + 1;
    setExperience(newExp);
    setLevel(newLevel);
  };

  const toggleGameMode = () => {
    setGameMode(gameMode === "exploration" ? "professional" : "exploration");
    setPaused(gameMode === "exploration");
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* 3D Scene */}
      <Canvas
        shadows
        style={{
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse at center, #001122 0%, #000000 100%)",
        }}
        camera={{ fov: 60, near: 0.1, far: 2000 }}
      >
        <Stars radius={300} depth={80} count={10000} factor={6} fade speed={0.5} />
        <ambientLight intensity={0.4} color="#001122" />
        <directionalLight intensity={2} position={[100, 100, -50]} color="#ffffff" castShadow />
        <pointLight position={[0, 0, 0]} intensity={1} color="#00ffff" distance={100} />

        <Spaceship setHud={setHud} paused={paused} joystickDir={joystickDir} isMobile={isMobile} />

        {/* Stations */}
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

        {paused && <OrbitControls enablePan={false} enableZoom={true} />}
      </Canvas>

      {/* HUD */}
      <AnimatePresence>
        {!paused && gameMode === "exploration" && (
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  background: "rgba(0,255,255,0.1)",
                  border: "1px solid #00ffff",
                  borderRadius: "12px",
                  padding: "12px 20px",
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "10px", opacity: 0.7 }}>VELOCITY</div>
                  <div style={{ fontSize: "16px", color: "#00ffff", fontWeight: "bold" }}>
                    {parseFloat(hud.speed) > 1 ? parseFloat(hud.speed).toFixed(1) : hud.speed} U/s
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", opacity: 0.7 }}>FUEL</div>
                  <div
                    style={{
                      width: "60px",
                      height: "8px",
                      background: "#333",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${hud.fuel || 100}%`,
                        height: "100%",
                        background: (hud.fuel || 100) > 30 ? "#00ff00" : "#ff4500",
                        transition: "all 0.3s",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", opacity: 0.7 }}>LEVEL</div>
                  <div style={{ fontSize: "16px", color: "#ffd700", fontWeight: "bold" }}>{level}</div>
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: "24px", color: "#00ffff", textShadow: "0 0 10px #00ffff50" }}>
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
                      color: "#ffd700",
                    }}
                  >
                    📡 APPROACHING: {stations.find((s) => s.id === nearbyStation)?.name.toUpperCase()}
                  </motion.div>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setScannerActive(!scannerActive)}
                  style={{
                    padding: "8px 12px",
                    background: scannerActive ? "rgba(0,255,0,0.2)" : "rgba(0,0,0,0.3)",
                    border: `1px solid ${scannerActive ? "#00ff00" : "#666"}`,
                    borderRadius: "8px",
                    color: scannerActive ? "#00ff00" : "#ccc",
                    cursor: "pointer",
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
                  }}
                >
                  💼 PROFESSIONAL
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Instructions - Only Desktop */}
      {!paused && gameMode === "exploration" && !isMobile && (
        <motion.div
          key="desktop-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            background: "rgba(0,0,0,0.8)",
            border: "1px solid #00ffff30",
            borderRadius: 12,
            padding: 15,
            color: "white",
            fontSize: 12,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 15,
            }}
          >
            <div>
              <strong>🎮 NAVIGATION:</strong>
            </div>
            <div>W/↑ - Forward Thrust</div>
            <div>A/← D/→ - Strafe Left/Right</div>
            <div>S/↓ - Reverse</div>
            <div>SPACE - Ascend</div>
            <div>SHIFT - Descend</div>
            <div>
              <strong>🎯 INTERACTION:</strong>
            </div>
            <div>Approach stations to dock</div>
          </div>
        </motion.div>
      )}

      {/* Professional Mode */}
      {gameMode === "professional" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "absolute",
            inset: 0,
            background: darkMode
              ? "linear-gradient(135deg, #172435ff, #302b63, #24243e)"
              : "#fff",
            color: darkMode ? "white" : "black",
            overflowY: "auto",
            zIndex: 2000,
          }}
        >
          <Header
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode(!darkMode)}
            gameMode={gameMode}
            toggleGameMode={toggleGameMode}
          />
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
          <Footer />
        </motion.div>
      )}

      {/* Overlays */}
      <AnimatePresence mode="wait">
        {showSkills && (
          <SkillsOverlay
            onClose={() => {
              setShowSkills(false);
              setPaused(false);
            }}
          />
        )}
        {showAbout && (
          <AboutOverlay
            onClose={() => {
              setShowAbout(false);
              setPaused(false);
              setFirstTimeAbout(false);
            }}
            firstTime={firstTimeAbout}
            setFirstTime={setFirstTimeAbout}
          />
        )}
        {showProjects && (
          <ProjectsOverlay
            onClose={() => {
              setShowProjects(false);
              setPaused(false);
            }}
          />
        )}
        {showContact && (
          <ContactOverlay
            onClose={() => {
              setShowContact(false);
              setPaused(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* 🎮 Joystick - Only Mobile Landscape */}
      {!paused && gameMode === "exploration" && isMobile && !isPortrait && (
        <div
          style={{
            position: "fixed",
            bottom: "5vh",
            left: "5vw",
            zIndex: 99999,
          }}
        >
          <Joystick
            size={100}
            baseColor="rgba(0,255,255,0.15)"
            stickColor="#00ffff"
            move={(e) => setJoystickDir({ x: e.x || 0, y: e.y || 0 })}
            stop={() => setJoystickDir({ x: 0, y: 0 })}
          />
        </div>
      )}

      {/* 🔄 Orientation Overlay */}
      {isMobile && isPortrait && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "black",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            zIndex: 9999,
            textAlign: "center",
          }}
        >
          🔄 Please rotate your device to landscape
        </div>
      )}
    </div>
  );
};

export default SpaceGame;
