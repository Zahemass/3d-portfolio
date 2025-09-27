import React, { useState, useRef, useEffect } from "react";
import { ReactTyped } from "react-typed";
import { Github, Linkedin, Mail, Award, Code2, Gamepad2, Music } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stars, Text, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

import "../../styles/aboutOverlay.css";


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
  const { scene } = useGLTF("/models/avatar.glb");
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

      {/* Avatar */}
      <group ref={avatarRef}>
        <primitive object={scene} scale={2.2} position={[0, 0, 0]} />
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

// 🎮 Interactive Skill Nodes
const SkillNode: React.FC<{
  position: [number, number, number];
  skill: string;
  level: number;
  color: string;
  onClick: () => void;
}> = ({ position, skill, level, color, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.2;
    }
  });

  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <mesh scale={hovered ? 1.2 : 1}>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      
      {hovered && (
        <Html center>
          <div style={{
            background: "rgba(0,0,0,0.8)",
            padding: "8px 12px",
            borderRadius: "8px",
            border: `1px solid ${color}`,
            color: "white",
            fontSize: "12px",
            whiteSpace: "nowrap",
          }}>
            <strong>{skill}</strong>
            <div style={{ display: "flex", gap: "2px", marginTop: "4px" }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: i < level ? color : "#333" }}>★</span>
              ))}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

const AboutOverlay: React.FC<AboutOverlayProps> = ({
  onClose,
  firstTime,
  setFirstTime,
}) => {
  const [currentSection, setCurrentSection] = useState<'intro' | 'journey' | 'skills' | 'achievements'>('intro');
  const [experience, setExperience] = useState(2850); // XP points
  const [level, setLevel] = useState(12);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);

  const skillNodes = [
    { skill: "React", level: 5, color: "#61DAFB", position: [-2, 1, 0] as [number, number, number] },
    { skill: "Node.js", level: 4, color: "#339933", position: [2, 1.5, -1] as [number, number, number] },
    { skill: "Flutter", level: 5, color: "#02569B", position: [0, 2, 1] as [number, number, number] },
    { skill: "Three.js", level: 4, color: "#000000", position: [-1.5, 0.5, 1.5] as [number, number, number] },
    { skill: "Python", level: 4, color: "#3776AB", position: [1.8, 0.8, 0.5] as [number, number, number] },
    { skill: "Firebase", level: 4, color: "#FFCA28", position: [0, -0.5, -1] as [number, number, number] },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSkillClick = (skill: string) => {
    setSelectedSkill(skill);
    setExperience(prev => prev + 10); // Gain XP for interaction
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(45deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)",
        color: "white",
        fontFamily: "'Space Mono', monospace",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      {/* Gaming HUD Header */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "20px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 3000,
      }}>
        <div>
          <h1 style={{ 
            fontSize: "24px", 
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
              style={{ fontSize: "12px", color: "#ff6b6b" }}
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
                gap: "20px",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>LEVEL</div>
                <div style={{ fontSize: "20px", color: "#ffd700", fontWeight: "bold" }}>{level}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>XP</div>
                <div style={{ fontSize: "16px", color: "#00ff00" }}>{experience}</div>
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(45deg, #ff4757, #ff3838)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(255,71,87,0.5)",
                }}
              >
                ✖ EXIT
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        position: "absolute",
        top: "80px",
        left: "20px",
        zIndex: 3000,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}>
        {[
          { key: 'intro', label: '🎮 Intro', icon: <Gamepad2 size={16} /> },
          { key: 'journey', label: '🚀 Journey', icon: <Code2 size={16} /> },
          { key: 'skills', label: '⚡ Skills', icon: <Award size={16} /> },
          { key: 'achievements', label: '🏆 Wins', icon: <Music size={16} /> },
        ].map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.05, x: 5 }}
            onClick={() => setCurrentSection(tab.key as any)}
            style={{
              padding: "12px 16px",
              background: currentSection === tab.key ? 
                "linear-gradient(45deg, #00ffff, #0099cc)" : 
                "rgba(0,255,255,0.1)",
              border: `1px solid ${currentSection === tab.key ? "#00ffff" : "#333"}`,
              borderRadius: "8px",
              color: currentSection === tab.key ? "black" : "#00ffff",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              minWidth: "120px",
            }}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{
        position: "absolute",
        top: "80px",
        left: "200px",
        right: "50%",
        bottom: "20px",
        padding: "20px",
        overflowY: "auto",
        zIndex: 2000,
      }}>
        <AnimatePresence mode="wait">
          {currentSection === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
            >
              <h2 style={{ color: "#00ffff", fontSize: "1.8rem", marginBottom: "20px" }}>
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
                    fontSize: "16px",
                    lineHeight: "1.8",
                    color: "#f0f0f0",
                  }}
                />
              ) : (
                <div style={{ fontSize: "16px", lineHeight: "1.8", color: "#f0f0f0" }}>
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
    Alongside development, I’ve gained hands-on exposure to 
    <strong> Quality Assurance (QA)</strong>, which strengthened my skills in 
    <strong> debugging, problem-solving, and delivering reliable applications</strong>. 
    This foundation helps me ensure that the products I build are both <strong>quality-driven</strong> 
    and <strong>user-focused</strong>.
  </p>
  <p>
    I’ve also participated in multiple <strong>hackathons</strong>, earning recognition 
    for innovative projects in <strong>AI, full-stack development, and interactive apps</strong>. 
    My goal is to leverage my skills to build <strong>impactful products</strong> while exploring 
    emerging technologies like <strong>AI, 3D Web, and Blockchain</strong>.
  </p>
</div>

              )}

              {/* Social Links with Gaming Style */}
              <div style={{
                marginTop: "30px",
                display: "flex",
                gap: "15px",
              }}>
                {[
                  { icon: <Github size={24} />, href: "https://github.com/Zahemass", label: "GitHub" },
                  { icon: <Linkedin size={24} />, href: "https://www.linkedin.com/in/mohammed-zaheer-m-425793215", label: "LinkedIn" },
                  { icon: <Mail size={24} />, href: "mailto:zaheemass009@gmail.com", label: "Email" },
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
                      width: "50px",
                      height: "50px",
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
              <h2 style={{ color: "#00ffff", fontSize: "1.8rem", marginBottom: "20px" }}>
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
                      padding: "15px",
                      background: `linear-gradient(45deg, ${item.color}20, transparent)`,
                      border: `1px solid ${item.color}40`,
                      borderRadius: "12px",
                    }}
                  >
                    <div style={{
                      width: "50px",
                      height: "50px",
                      background: item.color,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      color: "black",
                      fontSize: "12px",
                    }}>
                      {item.years}
                    </div>
                    <div>
                      <h3 style={{ color: item.color, margin: 0, fontSize: "16px" }}>{item.phase}</h3>
                      <p style={{ margin: "5px 0 0 0", opacity: 0.8, fontSize: "14px" }}>{item.desc}</p>
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
            >
              <h2 style={{ color: "#00ffff", fontSize: "1.8rem", marginBottom: "20px" }}>
                🏆 Achievements Unlocked
              </h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                {achievements.map((achievement, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                    style={{
                      padding: "15px",
                      background: achievement.unlocked ? 
                        "linear-gradient(45deg, #ffd70020, #ff851b20)" : 
                        "rgba(100,100,100,0.1)",
                      border: `1px solid ${achievement.unlocked ? "#ffd700" : "#666"}`,
                      borderRadius: "12px",
                      textAlign: "center",
                      opacity: achievement.unlocked ? 1 : 0.5,
                    }}
                  >
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                      {achievement.icon}
                    </div>
                    <h4 style={{ 
                      color: achievement.unlocked ? "#ffd700" : "#999", 
                      margin: "0 0 5px 0",
                      fontSize: "14px"
                    }}>
                      {achievement.title}
                    </h4>
                    <p style={{ 
                      margin: 0, 
                      fontSize: "12px", 
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

      {/* 3D Scene - Right Side */}
      <div style={{
        position: "absolute",
        top: "80px",
        right: "20px",
        bottom: "20px",
        width: "45%",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #00ffff40",
        background: "rgba(0,0,0,0.3)",
      }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[0, 0, 0]} intensity={0.5} color="#00ffff" />

          {currentSection === 'intro' && <HologramAvatar />}
          
          {currentSection === 'skills' && (
            <>
              {skillNodes.map((node, i) => (
                <SkillNode
                  key={i}
                  position={node.position}
                  skill={node.skill}
                  level={node.level}
                  color={node.color}
                  onClick={() => handleSkillClick(node.skill)}
                />
              ))}
              
              <Text
                position={[0, -3, 0]}
                fontSize={0.5}
                color="#00ffff"
                anchorX="center"
                anchorY="middle"
              >
                Interactive Skills Galaxy
              </Text>
            </>
          )}

          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            minDistance={5}
            maxDistance={12}
            autoRotate={currentSection === 'intro'}
            autoRotateSpeed={0.5}
          />
        </Canvas>

        {/* Skill Selection Info */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                right: "20px",
                background: "rgba(0,0,0,0.9)",
                border: "1px solid #00ffff",
                borderRadius: "12px",
                padding: "15px",
                textAlign: "center",
              }}
            >
              <h3 style={{ color: "#00ffff", margin: "0 0 10px 0" }}>
                {selectedSkill} Mastery
              </h3>
              <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>
                +10 XP gained for exploration!
              </p>
              <button
                onClick={() => setSelectedSkill(null)}
                style={{
                  marginTop: "10px",
                  padding: "5px 15px",
                  background: "transparent",
                  border: "1px solid #00ffff",
                  borderRadius: "6px",
                  color: "#00ffff",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Experience Gain Notification */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            style={{
              position: "absolute",
              top: "120px",
              right: "20px",
              background: "linear-gradient(45deg, #00ff00, #32cd32)",
              color: "black",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "14px",
              zIndex: 4000,
            }}
          >
            +10 XP • Skill Explored!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AboutOverlay;