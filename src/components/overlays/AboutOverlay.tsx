import React, { useState, useRef, useEffect } from "react";
import { ReactTyped } from "react-typed";
import { Github, Linkedin, Mail, Award, Code2, Gamepad2, Music } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";


interface AboutOverlayProps {
  onClose: () => void;
  firstTime: boolean;
  setFirstTime: (val: boolean) => void;
}

// 🎮 Gaming Achievement System
const achievements = [
  { icon: "🏆", title: "Hackathon Hero", desc: "Multiple hackathon wins", unlocked: true },
  { icon: "🚀", title: "Full Stack Master", desc: "React + Node.js + Flutter", unlocked: true },
  { icon: "🎨", title: "Creative Coder", desc: "3D + Design + Music", unlocked: true },
  { icon: "🧪", title: "QA Veteran", desc: "2.5+ years testing experience", unlocked: true },
  { icon: "🎵", title: "YouTube Creator", desc: "Kon'nichiwa music channel", unlocked: true },
  { icon: "🌟", title: "Innovation Seeker", desc: "Always exploring new tech", unlocked: true },
];



  // 🚀 Floating 3D Avatar with Hologram Effect
const HologramAvatar: React.FC = () => {
  const { scene } = useGLTF("/models/avatar.glb"); // <-- your man model
  const avatarRef = useRef<THREE.Group>(null);
  const hologramRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (avatarRef.current) {
      avatarRef.current.position.y = Math.sin(t * 0.8) * 0.3 - 1;
      avatarRef.current.rotation.y += 0.01;
    }
    if (hologramRef.current && hologramRef.current.material) {
      const material = hologramRef.current.material as any;
      material.opacity = 0.1 + Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <group>
      {/* Hologram Base */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 2, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
      </mesh>
      
      {/* Hologram Cylinder */}
      <mesh ref={hologramRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 2, 4, 32, 1, true]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Avatar Model */}
      <group ref={avatarRef}>
        <primitive object={scene} scale={2.2} position={[0, -1, 0]} />
      </group>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}
    </group>
  );
};


// ✨ Floating Particles around Avatar
const FloatingParticle: React.FC<{ index: number }> = ({ index }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      const radius = 3 + Math.sin(t + index) * 0.5;
      ref.current.position.x = Math.cos(t * 0.5 + index) * radius;
      ref.current.position.y = Math.sin(t * 0.3 + index) * 2;
      ref.current.position.z = Math.sin(t * 0.5 + index) * radius;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#00ffff" />
    </mesh>
  );
};



const AboutOverlay: React.FC<AboutOverlayProps> = ({
  onClose,
  firstTime,
  setFirstTime,
}) => {
  const [currentSection, setCurrentSection] = useState<'intro' | 'journey' | 'achievements'>('intro');
  const [experience, setExperience] = useState(2850);
  const [level, setLevel] = useState(12);
  const [showStats, setShowStats] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const timer = setTimeout(() => setShowStats(true), 2000);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const show3D = currentSection === 'intro' || currentSection === 'journey';

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "linear-gradient(45deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)",
    color: "white",
    fontFamily: "'Space Mono', monospace",
    zIndex: 1000,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle: React.CSSProperties = {
    padding: isMobile ? "10px 15px" : "20px",
    background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 3000,
    flexShrink: 0,
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    overflow: "hidden",
  };

  const navigationStyle: React.CSSProperties = {
    padding: isMobile ? "10px" : "20px",
    display: "flex",
    flexDirection: isMobile ? "row" : "column",
    gap: isMobile ? "5px" : "10px",
    flexShrink: 0,
    justifyContent: isMobile ? "center" : "flex-start",
    overflowX: isMobile ? "auto" : "visible",
  };

  const contentAreaStyle: React.CSSProperties = {
    flex: show3D && !isMobile ? 1 : currentSection === 'achievements' ? 2 : 1,
    padding: isMobile ? "10px 15px" : "20px",
    overflowY: "auto",
    zIndex: 2000,
  };

  const sceneStyle: React.CSSProperties = {
    flex: 1,
    borderRadius: isMobile ? "12px" : "16px",
    overflow: "hidden",
    border: "1px solid #00ffff40",
    background: "rgba(0,0,0,0.3)",
    margin: isMobile ? "10px" : "0 20px 20px 0",
    minHeight: isMobile ? "200px" : "auto",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={containerStyle}
    >
      {/* Gaming HUD Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ 
            fontSize: isMobile ? "16px" : "24px", 
            color: "#00ffff",
            textShadow: "0 0 10px #00ffff",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            👨‍🚀 DEVELOPER PROFILE
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: isMobile ? "10px" : "12px", color: "#ff6b6b" }}
            >
              [ONLINE]
            </motion.span>
          </h1>
        </div>

        {/* Player Stats */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={{
                display: "flex",
                gap: isMobile ? "10px" : "20px",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: isMobile ? "10px" : "12px", opacity: 0.7 }}>LEVEL</div>
                <div style={{ fontSize: isMobile ? "16px" : "20px", color: "#ffd700", fontWeight: "bold" }}>{level}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: isMobile ? "10px" : "12px", opacity: 0.7 }}>XP</div>
                <div style={{ fontSize: isMobile ? "14px" : "16px", color: "#00ff00" }}>{experience}</div>
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: isMobile ? "8px 12px" : "10px 20px",
                  background: "linear-gradient(45deg, #ff4757, #ff3838)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(255,71,87,0.5)",
                  fontSize: isMobile ? "12px" : "14px",
                }}
              >
                ✖ EXIT
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={mainContentStyle}>
        {/* Navigation Tabs */}
        <div style={navigationStyle}>
          {[
            { key: 'intro', label: '🎮 Intro', icon: <Gamepad2 size={isMobile ? 14 : 16} /> },
            { key: 'journey', label: '🚀 Journey', icon: <Code2 size={isMobile ? 14 : 16} /> },
            { key: 'achievements', label: '🏆 Wins', icon: <Music size={isMobile ? 14 : 16} /> },
          ].map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.05, x: isMobile ? 0 : 5 }}
              onClick={() => setCurrentSection(tab.key as any)}
              style={{
                padding: isMobile ? "8px 12px" : "12px 16px",
                background: currentSection === tab.key ? 
                  "linear-gradient(45deg, #00ffff, #0099cc)" : 
                  "rgba(0,255,255,0.1)",
                border: `1px solid ${currentSection === tab.key ? "#00ffff" : "#333"}`,
                borderRadius: "8px",
                color: currentSection === tab.key ? "black" : "#00ffff",
                cursor: "pointer",
                fontSize: isMobile ? "10px" : "12px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                minWidth: isMobile ? "80px" : "120px",
                whiteSpace: "nowrap",
              }}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={contentAreaStyle}>
          <AnimatePresence mode="wait">
            {currentSection === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
              >
                <h2 style={{ 
                  color: "#00ffff", 
                  fontSize: isMobile ? "1.2rem" : "1.8rem", 
                  marginBottom: "20px" 
                }}>
                  👤 About Me
                </h2>
                
                {firstTime ? (
                  <ReactTyped
                    strings={[
                      `Hi, I'm **Mohammed Zaheer** — a passionate **Full Stack Developer & App Developer** based in **Chennai, India**. 

I specialize in building **scalable web applications, mobile apps, and 3D interactive experiences** that merge creativity with functionality.

My journey into tech started with **Quality Assurance (QA)**, where I spent over 2.5 years honing my skills in **manual and automation testing**...`
                    ]}
                    typeSpeed={50}
                    backSpeed={0}
                    showCursor={true}
                    cursorChar="|"
                    onComplete={() => setFirstTime(false)}
                    style={{
                      fontSize: isMobile ? "14px" : "16px",
                      lineHeight: "1.8",
                      color: "#f0f0f0",
                    }}
                  />
                ) : (
                  <div style={{ 
                    fontSize: isMobile ? "14px" : "16px", 
                    lineHeight: "1.8", 
                    color: "#f0f0f0" 
                  }}>
                    <p>
                      Hi, I'm <strong style={{ color: "#00ffff" }}>Mohammed Zaheer</strong> — a passionate 
                      <strong> Full Stack Developer & App Developer</strong> based in <strong>Chennai, India</strong>, 
                      currently pursuing my <strong>B.Sc. in Information Technology (Final Year)</strong>.
                    </p>
                    <p>
                      I specialize in building <strong style={{ color: "#ffd700" }}>scalable web applications, 
                      mobile apps, and 3D interactive experiences</strong> that merge creativity with functionality.
                    </p>
                    <p>
                      Alongside development, I've gained hands-on exposure to 
                      <strong> Quality Assurance (QA)</strong>, which strengthened my skills in 
                      <strong> debugging, problem-solving, and delivering reliable applications</strong>. 
                      This foundation helps me ensure that the products I build are both <strong>quality-driven</strong> 
                      and <strong>user-focused</strong>.
                    </p>
                    <p>
                      I've also participated in multiple <strong>hackathons</strong>, earning recognition 
                      for innovative projects in <strong>AI, full-stack development, and interactive apps</strong>. 
                      My goal is to leverage my skills to build <strong>impactful products</strong> while exploring 
                      emerging technologies like <strong>AI, 3D Web, and Blockchain</strong>.
                    </p>
                  </div>
                )}

                {/* Social Links */}
                <div style={{
                  marginTop: "30px",
                  display: "flex",
                  gap: "15px",
                  justifyContent: isMobile ? "center" : "flex-start",
                  flexWrap: "wrap",
                }}>
                  {[
                    { icon: <Github size={isMobile ? 20 : 24} />, href: "https://github.com/Zahemass", label: "GitHub" },
                    { icon: <Linkedin size={isMobile ? 20 : 24} />, href: "https://www.linkedin.com/in/mohammed-zaheer-m-425793215", label: "LinkedIn" },
                    { icon: <Mail size={isMobile ? 20 : 24} />, href: "mailto:zaheemass009@gmail.com", label: "Email" },
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: isMobile ? "44px" : "50px",
                        height: isMobile ? "44px" : "50px",
                        background: "linear-gradient(45deg, #00ffff20, #0099cc20)",
                        border: "1px solid #00ffff",
                        borderRadius: "12px",
                        color: "#00ffff",
                        textDecoration: "none",
                        boxShadow: "0 0 20px rgba(0,255,255,0.3)",
                      }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            {currentSection === 'journey' && (
              <motion.div
                key="journey"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
              >
                <h2 style={{ 
                  color: "#00ffff", 
                  fontSize: isMobile ? "1.2rem" : "1.8rem", 
                  marginBottom: "20px" 
                }}>
                  🚀 My Tech Journey
                </h2>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {[
                    { phase: "QA Engineer", years: "2.5+", desc: "Manual & Automation Testing", color: "#ff6b6b" },
                    { phase: "Full Stack Dev", years: "Current", desc: "React, Node.js, Flutter", color: "#4ecdc4" },
                    { phase: "3D Creator", years: "Ongoing", desc: "Three.js & Blender", color: "#45b7d1" },
                    { phase: "AI Explorer", years: "Latest", desc: "Python, OpenCV, ML", color: "#96ceb4" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        padding: isMobile ? "12px" : "15px",
                        background: `linear-gradient(45deg, ${item.color}20, transparent)`,
                        border: `1px solid ${item.color}40`,
                        borderRadius: "12px",
                      }}
                    >
                      <div style={{
                        width: isMobile ? "40px" : "50px",
                        height: isMobile ? "40px" : "50px",
                        background: item.color,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "black",
                        fontSize: isMobile ? "10px" : "12px",
                      }}>
                        {item.years}
                      </div>
                      <div>
                        <h3 style={{ 
                          color: item.color, 
                          margin: 0, 
                          fontSize: isMobile ? "14px" : "16px" 
                        }}>
                          {item.phase}
                        </h3>
                        <p style={{ 
                          margin: "5px 0 0 0", 
                          opacity: 0.8, 
                          fontSize: isMobile ? "12px" : "14px" 
                        }}>
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentSection === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                style={{ width: "100%" }}
              >
                <h2 style={{ 
                  color: "#00ffff", 
                  fontSize: isMobile ? "1.2rem" : "1.8rem", 
                  marginBottom: "20px",
                  textAlign: "center",
                }}>
                  🏆 Achievements Unlocked
                </h2>
                
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: isMobile ? "repeat(auto-fit, minmax(140px, 1fr))" : "repeat(auto-fit, minmax(200px, 1fr))", 
                  gap: isMobile ? "12px" : "15px",
                  maxWidth: "100%",
                }}>
                  {achievements.map((achievement, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                      style={{
                        padding: isMobile ? "12px" : "15px",
                        background: achievement.unlocked ? 
                          "linear-gradient(45deg, #ffd70020, #ff851b20)" : 
                          "rgba(100,100,100,0.1)",
                        border: `1px solid ${achievement.unlocked ? "#ffd700" : "#666"}`,
                        borderRadius: "12px",
                        textAlign: "center",
                        opacity: achievement.unlocked ? 1 : 0.5,
                      }}
                    >
                      <div style={{ fontSize: isMobile ? "20px" : "24px", marginBottom: "8px" }}>
                        {achievement.icon}
                      </div>
                      <h4 style={{ 
                        color: achievement.unlocked ? "#ffd700" : "#999", 
                        margin: "0 0 5px 0",
                        fontSize: isMobile ? "12px" : "14px"
                      }}>
                        {achievement.title}
                      </h4>
                      <p style={{ 
                        margin: 0, 
                        fontSize: isMobile ? "10px" : "12px", 
                        opacity: 0.8 
                      }}>
                        {achievement.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3D Scene - Only for intro and journey */}
        {show3D && (
          <div style={sceneStyle}>
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
              
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[0, 0, 0]} intensity={0.5} color="#00ffff" />

              {currentSection === 'intro' && <HologramAvatar />}
              {currentSection === 'journey' && <HologramAvatar />}

              <OrbitControls 
                enableZoom={true} 
                enablePan={false}
                minDistance={5}
                maxDistance={12}
                autoRotate={true}
                autoRotateSpeed={0.5}
              />
            </Canvas>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AboutOverlay;