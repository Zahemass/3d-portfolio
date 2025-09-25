import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { motion, AnimatePresence } from "framer-motion";
import Spaceship from "./Spaceship";

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

// CSS styles
import "../styles/spacegame.css";

interface SpaceGameProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpaceGame: React.FC<SpaceGameProps> = ({ darkMode, setDarkMode }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile control states - all arrow buttons
  const [mobileControls, setMobileControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    boost: false,
  });

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

  // Station Data
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

  // Check proximity
  useEffect(() => {
    let raf: number;

    const updateProximity = () => {
      let closestStation: string | null = null;
      let minDistance = Infinity;

      stations.forEach((station) => {
        const distance = hud.position.distanceTo(station.position);
        if (distance < 15 && distance < minDistance) {
          minDistance = distance;
          closestStation = station.id;
        }
      });

      setNearbyStation((prev) =>
        prev !== closestStation ? closestStation : prev
      );

      raf = requestAnimationFrame(updateProximity);
    };

    raf = requestAnimationFrame(updateProximity);
    return () => cancelAnimationFrame(raf);
  }, [hud.position, stations]);

  // XP & Levels
  const gainExperience = (amount: number) => {
    const newExp = experience + amount;
    const newLevel = Math.floor(newExp / 100) + 1;
    setExperience(newExp);
    setLevel(newLevel);
  };

  // Game Mode Toggle
  const toggleGameMode = () => {
    setGameMode(gameMode === "exploration" ? "professional" : "exploration");
    setPaused(gameMode === "exploration");
  };

  // Mobile control handlers
  const handleControlDown = (control: keyof typeof mobileControls) => {
    setMobileControls(prev => ({ ...prev, [control]: true }));
  };

  const handleControlUp = (control: keyof typeof mobileControls) => {
    setMobileControls(prev => ({ ...prev, [control]: false }));
  };

  return (
    <div className="spacegame-container">
      {/* 3D Scene */}
      <Canvas
        shadows
        style={{ width: "100%", height: "100%" }}
        camera={{ fov: 60, near: 0.1, far: 2000 }}
      >
        {/* Stars + Lights */}
        <Stars radius={300} depth={80} count={10000} factor={6} fade speed={0.5} />
        <ambientLight intensity={0.4} color="#001122" />
        <directionalLight intensity={2} position={[100, 100, -50]} color="#ffffff" castShadow />
        <pointLight position={[0, 0, 0]} intensity={1} color="#00ffff" distance={100} />

        {/* Spaceship with mobile controls */}
        <Spaceship 
          setHud={setHud} 
          paused={paused} 
          isMobile={isMobile}
          mobileControls={isMobile ? mobileControls : undefined}
        />

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

        {/* Controls only when paused */}
        {paused && <OrbitControls enablePan={false} enableZoom={true} />}
      </Canvas>

      {/* HUD Overlay */}
      <AnimatePresence>
        {!paused && gameMode === "exploration" && (
          <motion.div className="hud-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="hud-topbar">
              {/* Status */}
              <div className="hud-status">
                <div>
                  <div className="hud-label">VELOCITY</div>
                  <div className="hud-value">{hud.speed} U/s</div>
                </div>
                <div>
                  <div className="hud-label">FUEL</div>
                  <div className="hud-fuel-bar">
                    <div style={{ width: `${hud.fuel}%` }} />
                  </div>
                </div>
                <div>
                  <div className="hud-label">LEVEL</div>
                  <div className="hud-value">{level}</div>
                </div>
              </div>

              {/* Title + Station Info */}
              <div className="hud-center">
                <h1 className="hud-center-title">🚀 SPACE PORTFOLIO EXPLORER</h1>
                {nearbyStation && (
                  <motion.div className="hud-nearby" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                    📡 APPROACHING: {stations.find((s) => s.id === nearbyStation)?.name.toUpperCase()}
                  </motion.div>
                )}
              </div>

              {/* Controls */}
              <div className="hud-controls">
                <button onClick={() => setScannerActive(!scannerActive)}>📊 SCAN</button>
                <button onClick={toggleGameMode}>💼 PROFESSIONAL</button>
              </div>
            </div>

            {/* Scanner Panel */}
            {scannerActive && (
              <motion.div className="hud-scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {stations.map((station) => {
                  const distance = hud.position.distanceTo(station.position);
                  return (
                    <div key={station.id} className="scanner-item">
                      <span style={{ color: station.color }}>
                        {station.icon} {station.name}
                      </span>
                      <span>{distance.toFixed(1)}u</span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Controls */}
      {!paused && gameMode === "exploration" && !isMobile && (
        <motion.div className="desktop-controls" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div><strong>🎮 NAVIGATION:</strong></div>
          <div>W/↑ - Forward Thrust</div>
          <div>A/← D/→ - Strafe Left/Right</div>
          <div>S/↓ - Reverse</div>
          <div>SPACE - Ascend</div>
          <div>SHIFT - Descend</div>
          <div><strong>🎯 INTERACTION:</strong></div>
          <div>Approach stations to dock</div>
        </motion.div>
      )}

      {/* Professional Mode */}
      {gameMode === "professional" && (
        <motion.div className="professional-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
        {showSkills && <SkillsOverlay onClose={() => { setShowSkills(false); setPaused(false); }} />}
        {showAbout && <AboutOverlay onClose={() => { setShowAbout(false); setPaused(false); setFirstTimeAbout(false); }} firstTime={firstTimeAbout} setFirstTime={setFirstTimeAbout} />}
        {showProjects && <ProjectsOverlay onClose={() => { setShowProjects(false); setPaused(false); }} />}
        {showContact && <ContactOverlay onClose={() => { setShowContact(false); setPaused(false); }} />}
      </AnimatePresence>

      {/* Mobile Arrow Controls - Show on screens < 1000px */}
      {!paused && gameMode === "exploration" && isMobile && (
        <div className="mobile-controls-container">
          {/* Left side: Movement D-Pad */}
          <div className="mobile-dpad">
            <button 
              className="dpad-btn dpad-up"
              onTouchStart={() => handleControlDown('forward')}
              onTouchEnd={() => handleControlUp('forward')}
              onMouseDown={() => handleControlDown('forward')}
              onMouseUp={() => handleControlUp('forward')}
              onMouseLeave={() => handleControlUp('forward')}
            >
              ▲
            </button>
            <button 
              className="dpad-btn dpad-left"
              onTouchStart={() => handleControlDown('left')}
              onTouchEnd={() => handleControlUp('left')}
              onMouseDown={() => handleControlDown('left')}
              onMouseUp={() => handleControlUp('left')}
              onMouseLeave={() => handleControlUp('left')}
            >
              ◄
            </button>
            <button 
              className="dpad-btn dpad-center"
              disabled
            >
              ◉
            </button>
            <button 
              className="dpad-btn dpad-right"
              onTouchStart={() => handleControlDown('right')}
              onTouchEnd={() => handleControlUp('right')}
              onMouseDown={() => handleControlDown('right')}
              onMouseUp={() => handleControlUp('right')}
              onMouseLeave={() => handleControlUp('right')}
            >
              ►
            </button>
            <button 
              className="dpad-btn dpad-down"
              onTouchStart={() => handleControlDown('backward')}
              onTouchEnd={() => handleControlUp('backward')}
              onMouseDown={() => handleControlDown('backward')}
              onMouseUp={() => handleControlUp('backward')}
              onMouseLeave={() => handleControlUp('backward')}
            >
              ▼
            </button>
          </div>

          {/* Right side: Action buttons */}
          <div className="mobile-action-buttons">
            {/* Vertical controls */}
            <button 
              className="mobile-btn up-btn"
              onTouchStart={() => handleControlDown('up')}
              onTouchEnd={() => handleControlUp('up')}
              onMouseDown={() => handleControlDown('up')}
              onMouseUp={() => handleControlUp('up')}
              onMouseLeave={() => handleControlUp('up')}
            >
              ↑<span>UP</span>
            </button>
            
            <button 
              className="mobile-btn down-btn"
              onTouchStart={() => handleControlDown('down')}
              onTouchEnd={() => handleControlUp('down')}
              onMouseDown={() => handleControlDown('down')}
              onMouseUp={() => handleControlUp('down')}
              onMouseLeave={() => handleControlUp('down')}
            >
              ↓<span>DOWN</span>
            </button>

            {/* Boost button */}
            <button 
              className={`mobile-btn boost-btn ${hud.fuel < 10 ? 'disabled' : ''}`}
              onTouchStart={() => hud.fuel >= 10 && handleControlDown('boost')}
              onTouchEnd={() => handleControlUp('boost')}
              onMouseDown={() => hud.fuel >= 10 && handleControlDown('boost')}
              onMouseUp={() => handleControlUp('boost')}
              onMouseLeave={() => handleControlUp('boost')}
              disabled={hud.fuel < 10}
            >
              ⚡<span>BOOST</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceGame;