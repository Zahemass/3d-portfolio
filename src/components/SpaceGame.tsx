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

// CSS styles
import "../styles/spacegame.css";

interface SpaceGameProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpaceGame: React.FC<SpaceGameProps> = ({ darkMode, setDarkMode }) => {
  // Device and orientation detection
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    // Detect if it's a mobile device
    const checkIfMobile = () => {
      const isMobile = window.innerWidth <= 1024 || 
                      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
      console.log("Mobile device check:", isMobile);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // If you're still getting errors, use this even simpler version:

useEffect(() => {
  // Simple orientation detection based on dimensions only
  const checkOrientation = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const landscape = width > height;
    
    setIsLandscape(landscape);
    
    console.log("=== SIMPLE ORIENTATION CHECK ===");
    console.log("Window size:", width, "x", height);
    console.log("Is landscape:", landscape);
    console.log("===============================");
  };

  // Initial check
  checkOrientation();

  // Debounced version
  let timeoutId: number | null = null;
  const debouncedCheck = () => {
    if (timeoutId) window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(checkOrientation, 150);
  };

  // Listen for resize events
  window.addEventListener("resize", debouncedCheck);
  window.addEventListener("orientationchange", debouncedCheck);

  return () => {
    if (timeoutId) window.clearTimeout(timeoutId);
    window.removeEventListener("resize", debouncedCheck);
    window.removeEventListener("orientationchange", debouncedCheck);
  };
}, []);

// Mobile detection (also simplified):
useEffect(() => {
  const checkIfMobile = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isMobileScreen = window.innerWidth <= 1024;
    const hasTouchScreen = 'ontouchstart' in window;
    
    const isMobile = isMobileUA || (isMobileScreen && hasTouchScreen);
    
    setIsMobileDevice(isMobile);
    
    console.log("=== MOBILE CHECK ===");
    console.log("User agent mobile:", isMobileUA);
    console.log("Small screen:", isMobileScreen);
    console.log("Has touch:", hasTouchScreen);
    console.log("Final mobile result:", isMobile);
    console.log("==================");
  };

  checkIfMobile();
  
  let timeoutId: number | null = null;
  const debouncedMobileCheck = () => {
    if (timeoutId) window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(checkIfMobile, 100);
  };
  
  window.addEventListener('resize', debouncedMobileCheck);
  
  return () => {
    if (timeoutId) window.clearTimeout(timeoutId);
    window.removeEventListener('resize', debouncedMobileCheck);
  };
}, []);

  // Mobile control states
  const [joystickDir, setJoystickDir] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mobileVertical, setMobileVertical] = useState<'up' | 'down' | null>(null);
  const [mobileBoost, setMobileBoost] = useState(false);

  // ⬇️ Add here
const [cameraControl, setCameraControl] = useState({
  isDragging: false,
  lastTouch: { x: 0, y: 0 },
  rotation: { horizontal: 0, vertical: 0 },
  sensitivity: 0.005,
  distance: 12, // For zoom support (snippet 3)
  minDistance: 6,
  maxDistance: 25
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

  const [activeStation, setActiveStation] = useState<string | null>(null);


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

  // Debug joystick values
  useEffect(() => {
    if (joystickDir.x !== 0 || joystickDir.y !== 0) {
      console.log("Joystick moving:", joystickDir);
    }
  }, [joystickDir]);

  // Log control visibility conditions
  useEffect(() => {
    console.log("Control visibility check:");
    console.log("- paused:", paused);
    console.log("- gameMode:", gameMode);
    console.log("- isLandscape:", isLandscape);
    console.log("- isMobileDevice:", isMobileDevice);
    console.log("- Should show mobile controls:", !paused && gameMode === "exploration" && isLandscape && isMobileDevice);
    console.log("- Should show desktop controls:", !paused && gameMode === "exploration" && isLandscape && !isMobileDevice);
    console.log("- Should show orientation overlay:", !isLandscape && isMobileDevice);
  }, [paused, gameMode, isLandscape, isMobileDevice]);

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

        {/* Spaceship */}
        <Spaceship 
          setHud={setHud} 
          paused={paused} 
          joystickDir={joystickDir}
          isMobile={isMobileDevice}
          mobileVertical={mobileVertical}
          mobileBoost={mobileBoost}
          cameraControl={cameraControl} 
        />

        {/* Stations */}
        <AboutStation
  shipPos={hud.position}
  activeStation={activeStation}
  onOpen={() => {
    setPaused(true);
    setActiveStation("about");
    gainExperience(25);
  }}
/>

<ProjectsStation
  shipPos={hud.position}
  activeStation={activeStation}
  onOpen={() => {
    setPaused(true);
    setActiveStation("projects");
    gainExperience(25);
  }}
/>

<SkillsStation
  shipPos={hud.position}
  activeStation={activeStation}
  onOpen={() => {
    setPaused(true);
    setActiveStation("skills");
    gainExperience(25);
  }}
/>

<ContactStation
  shipPos={hud.position}
  activeStation={activeStation}
  onOpen={() => {
    setPaused(true);
    setActiveStation("contact");
    gainExperience(25);
  }}
/>


        {/* Controls only when paused */}
        {paused && <OrbitControls enablePan={false} enableZoom={true} />}
      </Canvas>

      {/* HUD Overlay - show in landscape */}
      <AnimatePresence>
        {!paused && gameMode === "exploration" && isLandscape && (
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
                <button onClick={() => setScannerActive(!scannerActive)} style={{ zIndex: 1000 }}>📊 SCAN</button>
                <button onClick={toggleGameMode} style={{ zIndex: 9999 }}>
  💼 PROFESSIONAL
</button>

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
  {activeStation === "skills" && (
    <SkillsOverlay onClose={() => { setActiveStation(null); setPaused(false); }} />
  )}
  {activeStation === "about" && (
    <AboutOverlay 
      onClose={() => { setActiveStation(null); setPaused(false); setFirstTimeAbout(false); }}
      firstTime={firstTimeAbout}
      setFirstTime={setFirstTimeAbout}
    />
  )}
  {activeStation === "projects" && (
    <ProjectsOverlay onClose={() => { setActiveStation(null); setPaused(false); }} />
  )}
  {activeStation === "contact" && (
    <ContactOverlay onClose={() => { setActiveStation(null); setPaused(false); }} />
  )}
</AnimatePresence>


      {/* MOBILE CONTROLS - Force show with inline styles for testing */}
      {/* MOBILE CONTROLS - Simplified with force visibility */}
{!paused && gameMode === "exploration" && isMobileDevice && (
  <div 
    style={{ 
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      height: '160px',
      zIndex: '99999',
      display: isLandscape ? 'flex' : 'none',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      padding: '0 30px 20px 30px',
      pointerEvents: 'none',
      background: 'rgba(0,0,0,0.1)' // Debug background
    }}
  >
    {/* Debug info */}
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      color: 'white',
      fontSize: '12px',
      background: 'rgba(0,0,0,0.8)',
      padding: '5px'
    }}>
    </div>

    {/* Left side: Joystick */}
    <div style={{ pointerEvents: 'auto' }}>
      <Joystick
        size={80}
        baseColor="rgba(0,255,255,0.3)"
        stickColor="#00ffff"
        move={(e) => {
          if (e && e.x !== null && e.y !== null) {
            const nx = (e.x / 50) * 10;
            const ny = (e.y / 50) * 10;
            console.log("Joystick:", nx, ny);
            setJoystickDir({ x: nx, y: ny });
          }
        }}
        stop={() => {
          console.log("Joystick stopped");
          setJoystickDir({ x: 0, y: 0 });
        }}
      />
    </div>

    {/* Right side: Action buttons */}
    <div style={{ 
      display: 'flex', 
      gap: '10px', 
      alignItems: 'flex-end',
      pointerEvents: 'auto'
    }}>
      {/* UP Button */}
      <button 
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'rgba(0, 255, 100, 0.2)',
          border: '2px solid #00ff64',
          color: '#00ff64',
          fontSize: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
          cursor: 'pointer'
        }}
        onTouchStart={(e) => { 
          e.preventDefault(); 
          setMobileVertical('up'); 
          console.log('UP pressed');
        }}
        onTouchEnd={(e) => { 
          e.preventDefault(); 
          setMobileVertical(null); 
          console.log('UP released');
        }}
        onMouseDown={() => setMobileVertical('up')}
        onMouseUp={() => setMobileVertical(null)}
        onMouseLeave={() => setMobileVertical(null)}
      >
        ↑
      </button>
      
      {/* DOWN Button */}
      <button 
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'rgba(100, 100, 255, 0.2)',
          border: '2px solid #6464ff',
          color: '#6464ff',
          fontSize: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
          cursor: 'pointer'
        }}
        onTouchStart={(e) => { 
          e.preventDefault(); 
          setMobileVertical('down');
          console.log('DOWN pressed');
        }}
        onTouchEnd={(e) => { 
          e.preventDefault(); 
          setMobileVertical(null);
          console.log('DOWN released');
        }}
        onMouseDown={() => setMobileVertical('down')}
        onMouseUp={() => setMobileVertical(null)}
        onMouseLeave={() => setMobileVertical(null)}
      >
        ↓
      </button>

      {/* BOOST Button */}
      <button 
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(255, 100, 0, 0.2)',
          border: '2px solid #ff6400',
          color: '#ff6400',
          fontSize: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
          cursor: 'pointer',
          opacity: hud.fuel < 10 ? 0.3 : 1
        }}
        onTouchStart={(e) => { 
          e.preventDefault(); 
          if (hud.fuel >= 10) {
            setMobileBoost(true);
            console.log('BOOST pressed');
          }
        }}
        onTouchEnd={(e) => { 
          e.preventDefault(); 
          setMobileBoost(false);
          console.log('BOOST released');
        }}
        onMouseDown={() => hud.fuel >= 10 && setMobileBoost(true)}
        onMouseUp={() => setMobileBoost(false)}
        onMouseLeave={() => setMobileBoost(false)}
        disabled={hud.fuel < 10}
      >
        ⚡
      </button>
    </div>
  </div>
)}

{/* Camera Control Overlay - PUBG Style */}
{/* Camera Control Overlay */}
{!paused && gameMode === "exploration" && isMobileDevice && isLandscape && (
  <div 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: '160px',
      zIndex: 1, // put under HUD
      background: 'transparent',
      touchAction: 'none', // ✅ disable native scrolling
      pointerEvents: 'auto', // needed for touchmove
    }}
    onTouchStart={(e) => {
      // only activate if NOT touching inside HUD
      const target = e.target as HTMLElement;
      if (target.closest('.hud-controls')) return; // ✅ don't steal HUD touches

      if (e.touches.length === 1) {
        const touch = e.touches[0];
        setCameraControl(prev => ({
          ...prev,
          isDragging: true,
          lastTouch: { x: touch.clientX, y: touch.clientY }
        }));
      }
    }}
    onTouchMove={(e) => {
      if (cameraControl.isDragging && e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - cameraControl.lastTouch.x;
        const deltaY = touch.clientY - cameraControl.lastTouch.y;

        setCameraControl(prev => ({
          ...prev,
          rotation: {
            horizontal: prev.rotation.horizontal + deltaX * prev.sensitivity,
            vertical: Math.max(-Math.PI/3, Math.min(Math.PI/3, prev.rotation.vertical - deltaY * prev.sensitivity))
          },
          lastTouch: { x: touch.clientX, y: touch.clientY }
        }));
      }
    }}
    onTouchEnd={() => {
      setCameraControl(prev => ({
        ...prev,
        isDragging: false
      }));
    }}
  />
)}



{/* Orientation Overlay - Show on mobile portrait */}
{!isLandscape && isMobileDevice && (
  <div style={{
    position: 'fixed',
    inset: '0',
    background: 'black',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    zIndex: '9999',
    textAlign: 'center',
    fontFamily: "'Space Mono', monospace"
  }}>
    🔄 Please rotate your device to landscape
    <br />
    <small style={{ marginTop: '10px', fontSize: '14px' }}>
      Current: {window.innerWidth}x{window.innerHeight}
    </small>
  </div>
)}
      {/* Desktop Controls - Show on desktop in landscape */}
      {!paused && gameMode === "exploration" && isLandscape && !isMobileDevice && (
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

      {/* Orientation Overlay - Show on mobile portrait */}
      {!isLandscape && isMobileDevice && (
        <div className="orientation-overlay" style={{
          position: 'fixed',
          inset: '0',
          background: 'black',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          zIndex: 9999,
          textAlign: 'center'
        }}>
          🔄 Please rotate your device to landscape
        </div>
      )}
    </div>
  );
};

export default SpaceGame;