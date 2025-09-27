import React, { useState, useRef, useEffect } from "react";
import { ReactTyped } from "react-typed";
import { Github, Linkedin, Mail } from "lucide-react";
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

// 🎯 Highlight Cards Data with enhanced styling
const highlightCards = [
  { 
    icon: "🎥", 
    title: "YouTuber", 
    desc: "Kon'nichiwa music channel",
    color: "#ff4757",
    glow: "rgba(255,71,87,0.4)",
    level: 85
  },
  { 
    icon: "💡", 
    title: "Innovator", 
    desc: "Creative problem solver",
    color: "#ffd700",
    glow: "rgba(255,215,0,0.4)",
    level: 92
  },
  { 
    icon: "🏆", 
    title: "Hackathoner", 
    desc: "Multiple wins & recognitions",
    color: "#00ff88",
    glow: "rgba(0,255,136,0.4)",
    level: 88
  },
  { 
    icon: "👨‍💻", 
    title: "Developer", 
    desc: "Full-stack & Mobile apps",
    color: "#00ffff",
    glow: "rgba(0,255,255,0.4)",
    level: 95
  },
  { 
    icon: "📚", 
    title: "Mentor", 
    desc: "Sharing knowledge & guidance",
    color: "#9b59b6",
    glow: "rgba(155,89,182,0.4)",
    level: 78
  }
];

interface HologramAvatarProps {
  isMobile: boolean;
  isVerySmall: boolean;
}

const HologramAvatar: React.FC<HologramAvatarProps> = ({ isMobile, isVerySmall }) => {
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

  const scale = isVerySmall ? 1.4 : isMobile ? 1.8 : 2.2;
  const yOffset = isVerySmall ? -0.8 : isMobile ? -1 : -1.2;

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
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Avatar Model */}
      <group ref={avatarRef} scale={[scale, scale, scale]} position={[0, yOffset, 0]}>
        <primitive object={scene} />
      </group>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}
    </group>
  );
};

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
  const [experience, setExperience] = useState(2850);
  const [level, setLevel] = useState(12);
  const [showStats, setShowStats] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVerySmall, setIsVerySmall] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width <= 768);
      setIsVerySmall(width <= 480);
      setIsLandscape(width > height && width <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const timer = setTimeout(() => setShowStats(true), 2000);
    
    // Add custom CSS for hiding scrollbars
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .custom-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
      // Clean up the style element
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const show3D = !isMobile && !isLandscape;

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
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Gaming HUD Header */}
      <div style={{
        padding: isMobile ? "15px" : "20px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.7))",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 3000,
        flexShrink: 0,
        borderBottom: "1px solid #00ffff30",
      }}>
        <div>
          <h1 style={{ 
            fontSize: isVerySmall ? "14px" : isMobile ? "18px" : "24px", 
            color: "#00ffff",
            textShadow: "0 0 10px #00ffff",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}>
            👨‍🚀 DEVELOPER PROFILE
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ 
                fontSize: isVerySmall ? "10px" : isMobile ? "12px" : "12px", 
                color: "#ff6b6b",
                whiteSpace: "nowrap",
              }}
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
                gap: isMobile ? "12px" : "20px",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ 
                  fontSize: isVerySmall ? "10px" : isMobile ? "11px" : "12px", 
                  opacity: 0.7,
                  whiteSpace: "nowrap",
                }}>LEVEL</div>
                <div style={{ 
                  fontSize: isVerySmall ? "14px" : isMobile ? "18px" : "20px", 
                  color: "#ffd700", 
                  fontWeight: "bold" 
                }}>{level}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ 
                  fontSize: isVerySmall ? "10px" : isMobile ? "11px" : "12px", 
                  opacity: 0.7,
                  whiteSpace: "nowrap",
                }}>XP</div>
                <div style={{ 
                  fontSize: isVerySmall ? "12px" : isMobile ? "16px" : "16px", 
                  color: "#00ff00" 
                }}>{experience}</div>
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: isVerySmall ? "6px 10px" : isMobile ? "8px 12px" : "10px 20px",
                  background: "linear-gradient(45deg, #ff4757, #ff3838)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(255,71,87,0.5)",
                  fontSize: isVerySmall ? "11px" : isMobile ? "12px" : "14px",
                  whiteSpace: "nowrap",
                }}
              >
                ✖ EXIT
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        overflow: "hidden",
        background: isMobile ? "rgba(0,0,0,0.3)" : "transparent",
      }}>
        {/* Content Area - Hidden Scroll */}
        <div style={{
          flex: 1,
          padding: isMobile ? "20px 15px" : "20px",
          overflow: "hidden",
          zIndex: 2000,
          background: isMobile ? "rgba(0,0,0,0.5)" : "transparent",
          minHeight: isMobile ? "0" : "auto",
          position: "relative",
        }}>
          {/* Scrollable Inner Container */}
          <div 
            className="custom-scrollbar"
            style={{
              height: "100%",
              overflowY: "scroll",
              paddingRight: "20px",
              marginRight: "-20px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 style={{ 
                color: "#00ffff", 
                fontSize: isVerySmall ? "1.1rem" : isMobile ? "1.3rem" : "1.8rem", 
                marginBottom: isMobile ? "15px" : "20px",
                textAlign: isMobile ? "center" : "left",
              }}>
                👤 About Me
              </h2>
              
              {firstTime ? (
                <ReactTyped
                  strings={[
                    `Hi, I'm **Mohammed Zaheer** — a passionate **Computer Science Student** and aspiring **Software Engineer** based in **Chennai, India**, currently in my **Final Year of B.Sc. Information Technology**.

I specialize in building **scalable web applications, mobile apps, and 3D interactive experiences** that merge creativity with cutting-edge technology.`
                  ]}
                  typeSpeed={50}
                  backSpeed={0}
                  showCursor={true}
                  cursorChar="|"
                  onComplete={() => setFirstTime(false)}
                  style={{
                    fontSize: isVerySmall ? "13px" : isMobile ? "15px" : "16px",
                    lineHeight: isMobile ? "1.6" : "1.8",
                    color: "#f0f0f0",
                  }}
                />
              ) : (
                <div style={{
                  fontSize: isVerySmall ? "13px" : isMobile ? "15px" : "16px",
                  lineHeight: isMobile ? "1.6" : "1.8",
                  color: "#f0f0f0",
                }}>
                  <p style={{ marginBottom: isMobile ? "15px" : "20px" }}>
                    Hi, I'm <strong style={{ color: "#00ffff" }}>Mohammed Zaheer</strong> — a passionate{" "}
                    <strong>Computer Science Student</strong> and aspiring{" "}
                    <strong>Software Engineer</strong> based in{" "}
                    <strong>Chennai, India</strong>, currently in my{" "}
                    <strong>Final Year of B.Sc. Information Technology</strong>.
                  </p>

                  <p style={{ marginBottom: isMobile ? "15px" : "20px" }}>
                    I specialize in building{" "}
                    <strong style={{ color: "#ffd700" }}>
                      scalable web applications, mobile apps, and 3D interactive experiences
                    </strong>{" "}
                    that merge creativity with cutting-edge technology.
                  </p>

                  <p style={{ marginBottom: isMobile ? "15px" : "20px" }}>
                    🏆 <strong>Hackathon Achievements:</strong>
                    <br />
                    🥈 Semi-Finalist – Inde-Hub Hackathon (Swift Community)
                    <br />
                    🥉 2nd Runner-Up – BTI Ignite Incubation Council
                    <br />
                    🚀 Active Participant – Multiple inter-college hackathons with recognition
                    for innovative projects in <strong>AI</strong>,{" "}
                    <strong>full-stack development</strong>, and{" "}
                    <strong>interactive applications</strong>.
                  </p>

                  <p style={{ marginBottom: isMobile ? "15px" : "20px" }}>
                    💡 My goal is to leverage my student perspective and fresh ideas to build{" "}
                    <strong>impactful products</strong> while exploring emerging technologies like{" "}
                    <strong>AI</strong>, <strong>3D Web</strong>, and <strong>Blockchain</strong>.
                  </p>
                </div>
              )}

              {/* Enhanced Highlight Cards */}
              <div style={{ marginTop: isMobile ? "25px" : "30px" }}>
                <motion.h3 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    color: "#00ffff",
                    fontSize: isVerySmall ? "1rem" : isMobile ? "1.1rem" : "1.2rem",
                    marginBottom: isMobile ? "15px" : "20px",
                    textAlign: "center",
                    textShadow: "0 0 15px #00ffff",
                    background: "linear-gradient(45deg, #00ffff, #ffd700, #ff4757)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: "bold",
                  }}
                >
                  ⚡ CORE ABILITIES
                </motion.h3>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: isVerySmall ? "repeat(2, 1fr)" : isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: isMobile ? "12px" : "15px",
                  marginBottom: isMobile ? "25px" : "30px",
                }}>
                  {highlightCards.map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30, rotateX: -20 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ delay: i * 0.15, duration: 0.6 }}
                      whileHover={{ 
                        scale: 1.08,
                        rotateY: 5,
                        boxShadow: `0 0 30px ${card.glow}`,
                        borderColor: card.color,
                      }}
                      style={{
                        background: `linear-gradient(145deg, ${card.color}12, rgba(0,0,0,0.4), ${card.color}08)`,
                        border: `1px solid ${card.color}40`,
                        borderRadius: "16px",
                        padding: isMobile ? "16px" : "18px",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                        cursor: "pointer",
                        backdropFilter: "blur(10px)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Animated Background Particles */}
                      <motion.div
                        animate={{ 
                          background: [`radial-gradient(circle at 20% 80%, ${card.color}20 0%, transparent 50%)`,
                                     `radial-gradient(circle at 80% 20%, ${card.color}20 0%, transparent 50%)`,
                                     `radial-gradient(circle at 40% 40%, ${card.color}20 0%, transparent 50%)`]
                        }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "16px",
                          opacity: 0.3,
                        }}
                      />

                      {/* Level Progress Bar */}
                      <div style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        fontSize: isVerySmall ? "8px" : "10px",
                        color: card.color,
                        fontWeight: "bold",
                        background: `${card.color}20`,
                        padding: "2px 6px",
                        borderRadius: "8px",
                        border: `1px solid ${card.color}60`,
                      }}>
                        LV.{card.level}
                      </div>

                      <motion.div 
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        style={{
                          fontSize: isMobile ? "24px" : "28px",
                          marginBottom: "10px",
                          filter: `drop-shadow(0 0 8px ${card.color})`,
                          position: "relative",
                          zIndex: 2,
                        }}
                      >
                        {card.icon}
                      </motion.div>

                      <h4 style={{
                        color: card.color,
                        fontSize: isVerySmall ? "13px" : isMobile ? "14px" : "15px",
                        margin: "0 0 8px 0",
                        fontWeight: "bold",
                        textShadow: `0 0 10px ${card.color}60`,
                        position: "relative",
                        zIndex: 2,
                      }}>
                        {card.title}
                      </h4>

                      <p style={{
                        color: "#f0f0f0",
                        fontSize: isVerySmall ? "10px" : isMobile ? "11px" : "12px",
                        margin: "0 0 8px 0",
                        opacity: 0.9,
                        lineHeight: "1.4",
                        position: "relative",
                        zIndex: 2,
                      }}>
                        {card.desc}
                      </p>

                      {/* Skill Progress Bar */}
                      <div style={{
                        width: "100%",
                        height: "4px",
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "2px",
                        overflow: "hidden",
                        position: "relative",
                        zIndex: 2,
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${card.level}%` }}
                          transition={{ delay: i * 0.1 + 0.5, duration: 1 }}
                          style={{
                            height: "100%",
                            background: `linear-gradient(90deg, ${card.color}, ${card.color}80)`,
                            borderRadius: "2px",
                            boxShadow: `0 0 10px ${card.color}60`,
                          }}
                        />
                      </div>

                      {/* Corner Accent */}
                      <div style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "40px",
                        height: "40px",
                        background: `linear-gradient(135deg, transparent 50%, ${card.color}15 50%)`,
                        borderTopLeftRadius: "40px",
                      }} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Enhanced Social Links */}
              <div style={{
                marginTop: isMobile ? "25px" : "30px",
                display: "flex",
                gap: isMobile ? "15px" : "20px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}>
                {[
                  { icon: <Github size={isMobile ? 20 : 24} />, href: "https://github.com/Zahemass", label: "GitHub", color: "#333" },
                  { icon: <Linkedin size={isMobile ? 20 : 24} />, href: "https://www.linkedin.com/in/mohammed-zaheer-m-425793215", label: "LinkedIn", color: "#0077b5" },
                  { icon: <Mail size={isMobile ? 20 : 24} />, href: "mailto:zaheemass009@gmail.com", label: "Email", color: "#ea4335" },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.8 }}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 5,
                      boxShadow: `0 0 25px ${social.color}60`,
                    }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: isMobile ? "52px" : "56px",
                      height: isMobile ? "52px" : "56px",
                      background: `linear-gradient(45deg, #00ffff15, ${social.color}20)`,
                      border: `2px solid #00ffff60`,
                      borderRadius: "16px",
                      color: "#00ffff",
                      textDecoration: "none",
                      boxShadow: "0 0 20px rgba(0,255,255,0.3)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      animate={{ 
                        background: [`radial-gradient(circle at center, ${social.color}30 0%, transparent 70%)`,
                                   `radial-gradient(circle at center, transparent 0%, ${social.color}30 70%)`]
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "16px",
                      }}
                    />
                    <span style={{ position: "relative", zIndex: 2 }}>
                      {social.icon}
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* Add some bottom padding for scroll */}
              <div style={{ height: "50px" }} />
            </motion.div>
          </div>
        </div>

        {/* 3D Scene - Only for desktop */}
        {show3D && (
          <div style={{
            flex: 1,
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #00ffff40",
            background: "rgba(0,0,0,0.3)",
            margin: "0 20px 20px 0",
            minHeight: "400px",
          }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
              
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[0, 0, 0]} intensity={0.5} color="#00ffff" />

              <HologramAvatar isMobile={isMobile} isVerySmall={isVerySmall} />

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