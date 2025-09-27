import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF, Html, Text } from "@react-three/drei";
import { ReactTyped } from "react-typed";
import * as THREE from "three";
import "../../styles/projects-overlay.css";

interface ProjectsOverlayProps {
  onClose: () => void;
}

// 💻 Interactive CLI Demo Component
const CLIDemo: React.FC<{ codeDemo: string }> = ({ codeDemo }) => {
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsTyping(true);
  }, []);

  return (
    <div style={{
      background: "#0c0c0c",
      border: "1px solid #333",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "20px",
      fontFamily: "'Fira Code', monospace",
      fontSize: "14px",
      color: "#00ff00",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Terminal Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "15px",
        paddingBottom: "10px",
        borderBottom: "1px solid #333",
      }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ width: "12px", height: "12px", background: "#ff5f56", borderRadius: "50%" }} />
          <div style={{ width: "12px", height: "12px", background: "#ffbd2e", borderRadius: "50%" }} />
          <div style={{ width: "12px", height: "12px", background: "#27ca3f", borderRadius: "50%" }} />
        </div>
        <div style={{ marginLeft: "15px", color: "#666", fontSize: "12px" }}>
          terminal — CLI API Tester Demo
        </div>
      </div>

      {/* Typing Animation */}
      <ReactTyped
        strings={[codeDemo]}
        typeSpeed={30}
        backSpeed={0}
        showCursor={true}
        cursorChar="▊"
        onComplete={() => setIsTyping(false)}
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: "1.6",
        }}
      />
    </div>
  );
};

// 🤖 AI Emotion Detection Demo
const AIEmotionDemo: React.FC = () => {
  const [emotion, setEmotion] = useState('neutral');
  const [scanning, setScanning] = useState(false);
  const emotions = [
    { face: '😊', name: 'Happy', color: '#4CAF50', confidence: 92 },
    { face: '😔', name: 'Sad', color: '#2196F3', confidence: 15 },
    { face: '😡', name: 'Angry', color: '#f44336', confidence: 8 },
    { face: '😨', name: 'Anxious', color: '#FF9800', confidence: 45 },
    { face: '😌', name: 'Calm', color: '#9C27B0', confidence: 78 },
  ];

  const startScan = () => {
    setScanning(true);
    let index = 0;
    const interval = setInterval(() => {
      setEmotion(emotions[index].name.toLowerCase());
      index = (index + 1) % emotions.length;
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      setScanning(false);
      setEmotion('happy');
    }, 3000);
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #845EC220, rgba(0,0,0,0.8))",
      border: "1px solid #845EC240",
      borderRadius: "12px",
      padding: "30px",
      marginBottom: "20px",
    }}>
      <h4 style={{ color: "#845EC2", marginBottom: "20px", fontSize: "18px", textAlign: "center" }}>
        🎭 Real-Time Emotion Detection
      </h4>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Face Scanner */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <motion.div
            animate={scanning ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            } : {}}
            transition={{ duration: 0.5, repeat: scanning ? Infinity : 0 }}
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #845EC210, #845EC240)",
              border: `3px solid ${scanning ? '#845EC2' : '#845EC240'}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "80px",
              position: "relative",
              marginBottom: "20px",
            }}
          >
            {scanning && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: "-10px",
                  border: "2px dashed #845EC2",
                  borderRadius: "50%",
                }}
              />
            )}
            <motion.span
              key={emotion}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {emotions.find(e => e.name.toLowerCase() === emotion)?.face || '🙂'}
            </motion.span>
          </motion.div>
          
          <button
            onClick={startScan}
            disabled={scanning}
            style={{
              padding: "12px 30px",
              background: scanning ? "#666" : "linear-gradient(135deg, #845EC2, #B565D8)",
              border: "none",
              borderRadius: "25px",
              color: "white",
              fontWeight: "bold",
              cursor: scanning ? "not-allowed" : "pointer",
              fontSize: "14px",
              boxShadow: "0 4px 15px rgba(132, 94, 194, 0.4)",
            }}
          >
            {scanning ? "🔍 Scanning..." : "🎯 Start Scan"}
          </button>
        </div>

        {/* Emotion Metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "10px" }}>
            EMOTIONAL ANALYSIS
          </div>
          {emotions.map((e, i) => (
            <motion.div
              key={i}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px",
                background: emotion === e.name.toLowerCase() ? `${e.color}20` : "rgba(255,255,255,0.02)",
                borderRadius: "8px",
                border: `1px solid ${emotion === e.name.toLowerCase() ? e.color : 'transparent'}`,
              }}
            >
              <span style={{ fontSize: "20px" }}>{e.face}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", marginBottom: "4px" }}>{e.name}</div>
                <div style={{
                  width: "100%",
                  height: "4px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}>
                  <motion.div
                    animate={{ width: scanning && emotion === e.name.toLowerCase() ? `${e.confidence}%` : "0%" }}
                    transition={{ duration: 0.5 }}
                    style={{
                      height: "100%",
                      background: e.color,
                    }}
                  />
                </div>
              </div>
              <span style={{ fontSize: "11px", opacity: 0.7 }}>
                {emotion === e.name.toLowerCase() ? `${e.confidence}%` : '0%'}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendation Engine */}
      {emotion === 'happy' && !scanning && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "rgba(76, 175, 80, 0.1)",
            borderRadius: "8px",
            border: "1px solid #4CAF5040",
          }}
        >
          <div style={{ fontSize: "14px", color: "#4CAF50", marginBottom: "8px" }}>
            ✨ Personalized Recommendations
          </div>
          <div style={{ display: "flex", gap: "10px", fontSize: "12px", opacity: 0.8 }}>
            <span>🎵 Upbeat Playlist</span>
            <span>•</span>
            <span>📖 Gratitude Journal</span>
            <span>•</span>
            <span>🧘 5-min Meditation</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// 📱 Mobile App Interactive Demo
const MobileAppDemo: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState('map');
  const [pins, setPins] = useState([
    { id: 1, x: 30, y: 40, name: "Hidden Cafe" },
    { id: 2, x: 60, y: 60, name: "Secret Garden" },
    { id: 3, x: 45, y: 80, name: "Rooftop View" },
  ]);
  const [showAddPin, setShowAddPin] = useState(false);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "30px",
      background: "linear-gradient(135deg, #FF6B6B20, rgba(0,0,0,0.8))",
      borderRadius: "12px",
      marginBottom: "20px",
    }}>
      <div style={{
        width: "280px",
        height: "560px",
        background: "#111",
        borderRadius: "35px",
        border: "8px solid #222",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
      }}>
        {/* Phone Notch */}
        <div style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "25px",
          background: "#222",
          borderRadius: "15px",
          zIndex: 10,
        }} />

        {/* Status Bar */}
        <div style={{
          position: "absolute",
          top: "12px",
          left: "20px",
          right: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 11,
          fontSize: "10px",
          color: "white",
        }}>
          <span>9:41</span>
          <div style={{ display: "flex", gap: "4px" }}>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* App Header */}
        <div style={{
          position: "absolute",
          top: "45px",
          left: 0,
          right: 0,
          padding: "15px",
          background: "linear-gradient(to bottom, #FF6B6B, #FF8E53)",
          color: "white",
          zIndex: 5,
        }}>
          <h3 style={{ margin: 0, fontSize: "18px" }}>📍 Local Lens</h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "11px", opacity: 0.9 }}>
            Discover hidden gems nearby
          </p>
        </div>

        {/* Interactive Map Area */}
        <div style={{
          position: "absolute",
          top: "110px",
          left: 0,
          right: 0,
          bottom: "60px",
          background: "#1a1a1a",
          overflow: "hidden",
        }}>
          {activeScreen === 'map' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                background: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 20 0 L 0 0 0 20\" fill=\"none\" stroke=\"%23333\" stroke-width=\"0.5\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100\" height=\"100\" fill=\"url(%23grid)\" /%3E%3C/svg%3E')",
              }}
              onClick={(e) => {
                if (showAddPin) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setPins([...pins, { 
                    id: pins.length + 1, 
                    x, 
                    y, 
                    name: `Spot ${pins.length + 1}` 
                  }]);
                  setShowAddPin(false);
                }
              }}
            >
              {/* Map Pins */}
              {pins.map((pin) => (
                <motion.div
                  key={pin.id}
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  whileHover={{ scale: 1.2 }}
                  style={{
                    position: "absolute",
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
                    transform: "translate(-50%, -100%)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{
                    fontSize: "24px",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                  }}>
                    📍
                  </div>
                  <div style={{
                    position: "absolute",
                    top: "-25px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "black",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "9px",
                    whiteSpace: "nowrap",
                  }}>
                    {pin.name}
                  </div>
                </motion.div>
              ))}

              {/* Add Pin Mode Overlay */}
              {showAddPin && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(255, 107, 107, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "crosshair",
                  }}
                >
                  <div style={{
                    background: "rgba(0,0,0,0.8)",
                    padding: "10px 20px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    color: "white",
                  }}>
                    📍 Tap to add a new spot
                  </div>
                </motion.div>
              )}

              {/* Floating Action Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddPin(!showAddPin);
                }}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "20px",
                  width: "50px",
                  height: "50px",
                  borderRadius: "25px",
                  background: showAddPin ? "#666" : "linear-gradient(135deg, #FF6B6B, #FF8E53)",
                  border: "none",
                  color: "white",
                  fontSize: "24px",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                }}
              >
                {showAddPin ? "✖" : "+"}
              </motion.button>
            </motion.div>
          )}

          {activeScreen === 'list' && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={{
                padding: "15px",
                height: "100%",
                overflowY: "auto",
              }}
            >
              {pins.map((pin, i) => (
                <motion.div
                  key={pin.id}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    padding: "15px",
                    marginBottom: "10px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "20px" }}>📍</span>
                    <div>
                      <div style={{ color: "white", fontSize: "14px" }}>{pin.name}</div>
                      <div style={{ color: "#999", fontSize: "11px", marginTop: "2px" }}>
                        2.3 km away • 42 visits
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          background: "#222",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          borderTop: "1px solid #333",
        }}>
          {[
            { icon: "🗺️", label: "Map", screen: "map" },
            { icon: "📋", label: "List", screen: "list" },
            { icon: "👤", label: "Profile", screen: "profile" },
          ].map((item) => (
            <button
              key={item.screen}
              onClick={() => setActiveScreen(item.screen)}
              style={{
                background: "none",
                border: "none",
                color: activeScreen === item.screen ? "#FF6B6B" : "#666",
                fontSize: "20px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>{item.icon}</span>
              <span style={{ fontSize: "9px" }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// 🗳️ Voting System Live Demo
const VotingSystemDemo: React.FC = () => {
  const [votes, setVotes] = useState({ alice: 234, bob: 187, charlie: 142 });
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const handleVote = (candidate: string) => {
    setSelectedCandidate(candidate);
    setShowVerification(true);
  };

  const submitVote = () => {
    if (verificationCode === "1234" && selectedCandidate) {
      setVotes(prev => ({
        ...prev,
        [selectedCandidate]: prev[selectedCandidate as keyof typeof prev] + 1
      }));
      setHasVoted(true);
      setShowVerification(false);
    }
  };

  const total = votes.alice + votes.bob + votes.charlie;

  return (
    <div style={{
      background: "linear-gradient(135deg, #F39C1220, rgba(0,0,0,0.8))",
      border: "1px solid #F39C1240",
      borderRadius: "12px",
      padding: "30px",
      marginBottom: "20px",
    }}>
      <h4 style={{ color: "#F39C12", marginBottom: "20px", fontSize: "18px", textAlign: "center" }}>
        🗳️ Live Election Dashboard
      </h4>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Voting Interface */}
        <div>
          <div style={{ fontSize: "14px", marginBottom: "15px", opacity: 0.8 }}>
            Cast Your Vote
          </div>
          
          {!hasVoted && !showVerification ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {Object.entries(votes).map(([name, count]) => (
                <motion.button
                  key={name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVote(name)}
                  style={{
                    padding: "15px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid #F39C1240",
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "14px", textTransform: "capitalize" }}>
                    {name === 'alice' ? '👩 Alice Johnson' : 
                     name === 'bob' ? '👨 Bob Smith' : '👤 Charlie Davis'}
                  </span>
                  <span style={{ color: "#F39C12", fontSize: "12px" }}>
                    Select →
                  </span>
                </motion.button>
              ))}
            </div>
          ) : showVerification ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ fontSize: "12px", marginBottom: "10px", opacity: 0.7 }}>
                Enter OTP to confirm (hint: 1234)
              </div>
              <input
                type="text"
                placeholder="Enter 4-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid #F39C1240",
                  borderRadius: "8px",
                  color: "white",
                  marginBottom: "15px",
                }}
              />
              <button
                onClick={submitVote}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "linear-gradient(135deg, #F39C12, #F5B041)",
                  border: "none",
                  borderRadius: "8px",
                  color: "black",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Confirm Vote
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                padding: "20px",
                background: "rgba(76, 175, 80, 0.1)",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>✅</div>
              <div style={{ color: "#4CAF50", fontSize: "14px" }}>Vote Recorded!</div>
              <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "5px" }}>
                Transaction ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </div>
            </motion.div>
          )}
        </div>

        {/* Real-time Results */}
        <div>
          <div style={{ fontSize: "14px", marginBottom: "15px", opacity: 0.8 }}>
            Live Results • {total} votes
          </div>
          
          {Object.entries(votes).map(([name, count]) => {
            const percentage = (count / total) * 100;
            return (
              <div key={name} style={{ marginBottom: "15px" }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: "5px",
                  fontSize: "12px"
                }}>
                  <span style={{ textTransform: "capitalize" }}>{name}</span>
                  <span style={{ color: "#F39C12" }}>{count} ({percentage.toFixed(1)}%)</span>
                </div>
                <div style={{
                  width: "100%",
                  height: "8px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}>
                  <motion.div
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #F39C12, #F5B041)",
                    }}
                  />
                </div>
              </div>
            );
          })}
          
          {/* Blockchain verification */}
          <div style={{
            marginTop: "20px",
            padding: "10px",
            background: "rgba(243, 156, 18, 0.05)",
            borderRadius: "8px",
            fontSize: "11px",
            opacity: 0.8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🔐</span>
              <span>Blockchain Verified</span>
            </div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ marginTop: "5px", fontSize: "10px", fontFamily: "monospace" }}
            >
              Hash: 0x3d5a...9f2e
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🎓 College Management Platform Demo
const CollegeManagementDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [notifications] = useState([
    { id: 1, type: '📚', text: 'Assignment due tomorrow', time: '2 hours ago' },
    { id: 2, type: '🎉', text: 'Cultural fest registration open', time: '5 hours ago' },
    { id: 3, type: '📝', text: 'Exam schedule released', time: '1 day ago' },
  ]);

  return (
    <div style={{
      background: "linear-gradient(135deg, #9B59B620, rgba(0,0,0,0.8))",
      border: "1px solid #9B59B640",
      borderRadius: "12px",
      padding: "30px",
      marginBottom: "20px",
    }}>
      <h4 style={{ color: "#9B59B6", marginBottom: "20px", fontSize: "18px", textAlign: "center" }}>
        🎓 MEASI College Portal
      </h4>

      {/* Tab Navigation */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        borderBottom: "1px solid #9B59B640",
      }}>
        {['announcements', 'attendance', 'events'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              background: activeTab === tab ? "#9B59B620" : "transparent",
              border: "none",
              borderBottom: activeTab === tab ? "2px solid #9B59B6" : "none",
              color: activeTab === tab ? "#9B59B6" : "#666",
              cursor: "pointer",
              fontSize: "12px",
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" }}>
        {/* Main Content */}
        <div>
          {activeTab === 'announcements' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {notifications.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    padding: "15px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    border: "1px solid rgba(155, 89, 182, 0.2)",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>{notif.type}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", color: "white" }}>{notif.text}</div>
                    <div style={{ fontSize: "10px", opacity: 0.5, marginTop: "4px" }}>
                      {notif.time}
                    </div>
                  </div>
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#9B59B6",
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'attendance' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: "20px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
              }}
            >
              <div style={{ fontSize: "14px", marginBottom: "15px" }}>Today's Classes</div>
              {['Data Structures', 'Web Development', 'Database Systems'].map((subject, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    marginBottom: "8px",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "6px",
                  }}
                >
                  <span style={{ fontSize: "12px" }}>{subject}</span>
                  <button
                    style={{
                      padding: "4px 12px",
                      background: "#9B59B6",
                      border: "none",
                      borderRadius: "4px",
                      color: "white",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Mark Present
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Stats Sidebar */}
        <div style={{
          padding: "20px",
          background: "rgba(155, 89, 182, 0.05)",
          borderRadius: "8px",
          border: "1px solid rgba(155, 89, 182, 0.2)",
        }}>
          <div style={{ fontSize: "12px", marginBottom: "15px", opacity: 0.7 }}>
            Quick Stats
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <div style={{ fontSize: "24px", color: "#9B59B6" }}>87%</div>
              <div style={{ fontSize: "11px", opacity: 0.7 }}>Attendance Rate</div>
            </div>
            <div>
              <div style={{ fontSize: "24px", color: "#9B59B6" }}>8.7</div>
              <div style={{ fontSize: "11px", opacity: 0.7 }}>Current CGPA</div>
            </div>
            <div>
              <div style={{ fontSize: "24px", color: "#9B59B6" }}>5</div>
              <div style={{ fontSize: "11px", opacity: 0.7 }}>Upcoming Events</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const projects = [
  {
    title: "📍 Local Lens",
    desc: "Community app to discover & share hidden spots — works offline!",
    fullDesc: `Local Lens empowers communities by helping people discover hidden spots and local gems.
    Features offline-first architecture with SQLite caching, real-time sync with Firebase, and community-driven discovery.
    Built with performance optimization and seamless user experience in mind.`,
    youtube: "https://www.youtube.com/embed/H9KO_E6jXW0",
    tech: ["Flutter", "Dart", "Firebase", "Google Maps API", "SQLite", "Real-time Sync"],
    github: "https://github.com/zaheer/local-lens",
    color: "#FF6B6B",
    impact: "10K+ downloads, 500+ communities",
    demoType: "app",
  },
  {
    title: "⚡ CLI API Tester",
    desc: "Lightweight CLI tool to test REST APIs without Postman.",
    fullDesc: `A command-line tool that simplifies REST API testing for developers. Instead of relying on heavy tools like Postman, 
    this lightweight solution allows devs to quickly test endpoints, headers, and request bodies directly from the terminal.
    Features support for GET, POST, PUT, DELETE requests with custom headers and authentication.`,
    youtube: "https://www.youtube.com/embed/9VhiTQuhDLw",
    tech: ["Python", "Click", "Requests", "PyTest", "JSON Parser", "OAuth"],
    github: "https://github.com/zaheer/cli-api-tester",
    color: "#4ECDC4",
    impact: "2K+ GitHub stars, 500+ weekly downloads",
    demoType: "cli",
    codeDemo: `$ apitest get https://jsonplaceholder.typicode.com/posts/1
> Initializing API request...
> Method: GET
> URL: https://jsonplaceholder.typicode.com/posts/1
> Headers: {"Content-Type": "application/json"}

Response [200 OK]:
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat",
  "body": "quia et suscipit suscipit..."
}

$ apitest post https://api.example.com/users \\
  --header "Authorization: Bearer xyz123" \\
  --data '{"name": "John", "email": "john@example.com"}'
  
> Request completed in 234ms ✓`,
  },
  {
    title: "🧠 Mental Health AI Assistant",
    desc: "AI-powered assistant using Q&A + face emotion recognition.",
    fullDesc: `Revolutionary mental health support system combining facial emotion recognition with conversational AI.
    Uses computer vision to analyze emotional states and provides personalized recommendations for journaling, meditation, and music therapy.
    Privacy-first approach with local processing and encrypted data storage.`,
    youtube: null,
    tech: ["React", "Node.js", "TensorFlow.js", "OpenCV", "Flask", "WebRTC", "Emotion AI"],
    github: "https://github.com/zaheer/mental-health-ai",
    color: "#845EC2",
    impact: "Featured in TechCrunch, 15K+ users helped",
    demoType: "ai",
  },
  {
    title: "🗳️ Secure Voting System",
    desc: "Encrypted online voting platform for college elections.",
    fullDesc: `A secure online voting platform designed for college and organizational elections. 
    It ensures transparency, prevents duplicate votes, and provides real-time results while keeping votes encrypted and anonymous.
    Features OTP-based authentication, tamper-proof storage, and real-time dashboard.`,
    
    tech: ["React", "Node.js", "PostgreSQL", "JWT", "WebSockets", "Encryption", "OTP Auth"],
    github: "https://github.com/zaheer/secure-voting",
    color: "#F39C12",
    impact: "Used in 50+ college elections, 10K+ voters",
    demoType: "voting",
  },
  {
    title: "🎓 MEASI College Management",
    desc: "Digital platform for student management & event updates.",
    fullDesc: `A comprehensive digital platform built for MEASI Institute to simplify student management, event updates, and academic tracking. 
    It bridges communication between students, faculty, and administration through a mobile-first approach.
    Features real-time notifications, role-based access, and cross-platform compatibility.`,

    tech: ["Flutter", "React", "Node.js", "Firebase", "PostgreSQL", "FCM", "RBAC"],
    github: "https://github.com/zaheer/measi-management",
    color: "#9B59B6",
    impact: "Serving 5K+ students & 200+ faculty",
    demoType: "platform",
  },
];

// 🌍 Enhanced Earth Model with Atmosphere
const EarthModel: React.FC = () => {
  const { scene } = useGLTF("/models/earth.glb");
  const earthRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= 0.001;
    }
  });

  return (
    <group>
      {/* Earth */}
      <primitive ref={earthRef} object={scene} scale={2.8} />
      
      {/* Atmosphere Glow */}
      <mesh ref={atmosphereRef} scale={3.2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#4FC3F7"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Orbital Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6, 6.1, 64]} />
        <meshBasicMaterial color="#00BCD4" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0, Math.PI / 4]}>
        <ringGeometry args={[7.5, 7.6, 64]} />
        <meshBasicMaterial color="#FF4081" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

// 🛰️ Enhanced Orbiting Project Satellites with Z-axis movement
const ProjectSatellite: React.FC<{
  project: any;
  index: number;
  angle: number;
  radius: number;
  onClick: () => void;
  isSelected: boolean;
}> = ({ project, index, angle, radius, onClick, isSelected }) => {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [isBehindPlanet, setIsBehindPlanet] = useState(false);

  useFrame(({ clock, camera }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * 0.15;
      const orbitRadius = radius + (isSelected ? 2 : 0);
      
      // Enhanced orbital movement with varied speeds
      const speedMultiplier = 1 + (index * 0.1);
      const x = Math.cos(t * speedMultiplier + angle) * orbitRadius;
      const y = Math.sin(t * 0.5 + index) * 2; // Increased vertical movement
      const z = Math.sin(t * speedMultiplier + angle) * orbitRadius;
      
      // Only update position if not hovered
      if (!hovered) {
        ref.current.position.set(x, y, z);
        ref.current.lookAt(0, 0, 0);
      }
      
      // Check if satellite is behind the planet (for visibility)
      const currentZ = hovered ? ref.current.position.z : z;
      const distanceToCamera = ref.current.position.distanceTo(camera.position);
      const planetDistance = camera.position.length();
      setIsBehindPlanet(currentZ < -1 && distanceToCamera > planetDistance);
    }
  });

  return (
    <group ref={ref}>
      {/* Satellite Structure */}
      <mesh position={[0, 0, -0.5]}>
        <boxGeometry args={[0.3, 0.3, 1]} />
        <meshStandardMaterial 
          color={project.color} 
          emissive={project.color} 
          emissiveIntensity={hovered ? 0.5 : 0.2} 
        />
      </mesh>
      
      {/* Solar Panels with animation */}
      <mesh position={[-0.8, 0, -0.5]} rotation={[0, hovered ? Math.PI / 8 : 0, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.05]} />
        <meshStandardMaterial color="#1565C0" metalness={0.8} />
      </mesh>
      <mesh position={[0.8, 0, -0.5]} rotation={[0, hovered ? -Math.PI / 8 : 0, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.05]} />
        <meshStandardMaterial color="#1565C0" metalness={0.8} />
      </mesh>

      {/* Interactive Card - Hide when behind planet */}
      {!isBehindPlanet && (
        <Html center distanceFactor={12}>
          <motion.div
  className="project-card"
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: hovered ? 1.15 : 1, opacity: isBehindPlanet ? 0.3 : 1 }}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  onClick={onClick}
  style={{
    background: `linear-gradient(135deg, ${project.color}25, rgba(0,0,0,0.95))`,
    border: `2px solid ${project.color}`,
    borderRadius: "16px",
    textAlign: "center",
    cursor: "pointer",
    pointerEvents: "auto",
    backdropFilter: "blur(15px)",
    boxShadow: hovered 
      ? `0 0 40px ${project.color}70, inset 0 0 30px rgba(255,255,255,0.2)` 
      : `0 0 20px ${project.color}40`,
    color: "white",
    fontFamily: "'Space Mono', monospace",
    transform: isSelected ? "scale(1.1)" : "scale(1)",
    transition: "all 0.3s ease",
  }}
>

            <motion.h3 
              style={{ 
                fontSize: "18px", 
                marginBottom: "12px",
                color: project.color,
                textShadow: `0 0 10px ${project.color}`,
              }}
            >
              {project.title}
            </motion.h3>
            <p style={{ 
              fontSize: "13px", 
              opacity: 0.9, 
              lineHeight: 1.4,
              marginBottom: "15px" 
            }}>
              {project.desc}
            </p>
            
            {/* Tech Stack Preview */}
            <div style={{ 
              display: "flex", 
              gap: "6px", 
              flexWrap: "wrap", 
              justifyContent: "center",
              marginTop: "12px"
            }}>
              {project.tech.slice(0, 3).map((tech: string, i: number) => (
                <span
                  key={i}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    background: `${project.color}20`,
                    border: `1px solid ${project.color}40`,
                    fontSize: "10px",
                    color: project.color,
                  }}
                >
                  {tech}
                </span>
              ))}
              {project.tech.length > 3 && (
                <span style={{ fontSize: "10px", opacity: 0.7 }}>
                  +{project.tech.length - 3} more
                </span>
              )}
            </div>

            {/* Interaction Hint with pulsing animation */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                marginTop: "10px",
                fontSize: "11px",
                color: project.color,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              🚀 CLICK TO EXPLORE
            </motion.div>
          </motion.div>
        </Html>
      )}
    </group>
  );
};

// 🎮 Enhanced UI with Gaming Elements
// 🎮 Enhanced UI with Gaming Elements
const ProjectsOverlay: React.FC<ProjectsOverlayProps> = ({ onClose }) => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'orbit' | 'expanded'>('orbit');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      const isMobile = window.innerWidth <= 768;
      setIsMobileLandscape(isMobile && isLandscape);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const handleProjectClick = (index: number) => {
    setSelectedProject(index);
    setViewMode('expanded');
  };

  return (
    <motion.div
     className="projects-overlay"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: "fixed",
        inset: 0,
        background: "radial-gradient(ellipse at center, #0D1421 0%, #000000 100%)",
        color: "white",
        fontFamily: "'Space Mono', monospace",
        overflow: "hidden",
        zIndex: 2000,
      }}
    >
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              zIndex: 4000,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                width: "60px",
                height: "60px",
                border: "3px solid transparent",
                borderTop: "3px solid #00BCD4",
                borderRadius: "50%",
                marginBottom: "20px",
              }}
            />
            <h2 style={{ color: "#00BCD4", marginBottom: "10px" }}>
              🚀 INITIALIZING PROJECT ORBIT
            </h2>
            <p style={{ opacity: 0.7, fontSize: "14px" }}>
              Loading Earth simulation & satellite network...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD Interface */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "20px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
        zIndex: 3000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <h1 style={{ 
            fontSize: "24px", 
            color: "#00BCD4",
            textShadow: "0 0 10px #00BCD4",
            margin: 0 
          }}>
            🌍 PROJECT ORBITAL STATION
          </h1>
          <p style={{ margin: "5px 0 0 0", opacity: 0.8, fontSize: "12px" }}>
            Navigate through space • Click satellites to explore projects
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          {/* View Mode Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'orbit' ? 'expanded' : 'orbit')}
            style={{
              padding: "8px 16px",
              background: "rgba(0,188,212,0.2)",
              border: "1px solid #00BCD4",
              borderRadius: "8px",
              color: "#00BCD4",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {viewMode === 'orbit' ? '📡 ORBIT VIEW' : '🔍 DETAIL VIEW'}
          </button>

          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(45deg, #FF4081, #F50057)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "12px",
              boxShadow: "0 0 20px rgba(245,0,87,0.5)",
            }}
          >
            ✖ EXIT ORBIT
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        right: "20px",
        background: "rgba(0,0,0,0.8)",
        border: "1px solid #00BCD4",
        borderRadius: "12px",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 3000,
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <span style={{ fontSize: "12px" }}>
            🛰️ <strong>{projects.length}</strong> Active Satellites
          </span>
          <span style={{ fontSize: "12px" }}>
            🌍 <strong>Earth Orbital Station</strong>
          </span>
          <span style={{ fontSize: "12px" }}>
            ⚡ <strong>Real-time Sync</strong>
          </span>
        </div>
        <div style={{ fontSize: "12px", opacity: 0.7 }}>
          Use mouse to navigate • Scroll to zoom
        </div>
      </div>

      {/* 3D Scene */}
      <AnimatePresence>
        {viewMode === 'orbit' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Canvas 
              camera={{ position: [0, 6, 15], fov: 50 }}
              style={{ background: "transparent" }}
            >
              {/* Enhanced Lighting */}
              <Stars radius={300} depth={60} count={8000} fade speed={0.5} />
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1.2} />
              <pointLight position={[0, 0, 0]} intensity={0.8} color="#4FC3F7" />

              <EarthModel />

              {/* Project Satellites */}
              {projects.map((project, i) => (
                <ProjectSatellite
                  key={i}
                  project={project}
                  index={i}
                  angle={(i / projects.length) * Math.PI * 2}
                  radius={8}
                  onClick={() => handleProjectClick(i)}
                  isSelected={selectedProject === i}
                />
              ))}

              <OrbitControls 
                enableZoom={true} 
                enablePan={true}
                minDistance={8}
                maxDistance={25}
                enableDamping={true}
                dampingFactor={0.05}
              />
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Project Modal */}
      <AnimatePresence>
        {selectedProject !== null && viewMode === 'expanded' && (
          <motion.div
           className="expanded-project-modal"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "fixed",
              inset: "20px",
              top: "60px",
              left: "50px",
              right: "50px",
              bottom: "100px",
              background: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(13,20,33,0.95))",
              border: `2px solid ${projects[selectedProject].color}`,
              borderRadius: "20px",
              padding: "40px",
              zIndex: 4000,
              overflowY: "auto",
              backdropFilter: "blur(20px)",
              boxShadow: `0 0 60px ${projects[selectedProject].color}30`,
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedProject(null);
                setViewMode('orbit');
              }}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                padding: "12px 18px",
                background: projects[selectedProject].color,
                color: "black",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "12px",
                boxShadow: `0 0 20px ${projects[selectedProject].color}50`,
              }}
            >
              ✖ CLOSE
            </button>

            {/* Project Header */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 style={{ 
                fontSize: "2.5rem", 
                marginBottom: "10px",
                color: projects[selectedProject].color,
                textShadow: `0 0 20px ${projects[selectedProject].color}50`,
              }}>
                {projects[selectedProject].title}
              </h1>
              
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "20px", 
                marginBottom: "30px",
                padding: "15px 0",
                borderBottom: `1px solid ${projects[selectedProject].color}30`,
              }}>
                <span style={{ 
                  background: `${projects[selectedProject].color}20`,
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  border: `1px solid ${projects[selectedProject].color}40`,
                }}>
                  📊 {projects[selectedProject].impact}
                </span>
                <a
                  href={projects[selectedProject].github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    color: projects[selectedProject].color, 
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  🔗 GitHub Repository
                </a>
              </div>
            </motion.div>

            {/* Interactive Demo Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ marginBottom: "30px" }}
            >
              {/* Different demo types */}
              {projects[selectedProject].demoType === 'cli' && projects[selectedProject].codeDemo && (
                <CLIDemo codeDemo={projects[selectedProject].codeDemo as string} />
              )}
              
              {projects[selectedProject].demoType === 'ai' && (
                <AIEmotionDemo />
              )}
              
              {projects[selectedProject].demoType === 'app' && (
                <MobileAppDemo />
              )}
              
              {projects[selectedProject].demoType === 'voting' && (
                <VotingSystemDemo />
              )}
              
              {projects[selectedProject].demoType === 'platform' && (
                <CollegeManagementDemo />
              )}

              {/* YouTube Demo for projects with video */}
              {projects[selectedProject].youtube && (
                <iframe
                  width="100%"
                  height="450"
                  src={projects[selectedProject].youtube as string}
                  title={projects[selectedProject].title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    borderRadius: "16px",
                    border: `2px solid ${projects[selectedProject].color}40`,
                    boxShadow: `0 10px 30px ${projects[selectedProject].color}20`,
                    marginTop: "20px",
                  }}
                />
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 style={{ 
                color: projects[selectedProject].color, 
                marginBottom: "15px",
                fontSize: "1.3rem" 
              }}>
                🚀 Project Overview
              </h3>
              <p style={{ 
                marginBottom: "30px", 
                lineHeight: 1.8, 
                fontSize: "16px",
                opacity: 0.9,
              }}>
                {projects[selectedProject].fullDesc}
              </p>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 style={{ 
                color: projects[selectedProject].color, 
                marginBottom: "20px",
                fontSize: "1.3rem" 
              }}>
                🛠️ Technology Stack
              </h3>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: "15px" 
              }}>
                {projects[selectedProject].tech.map((tech, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                    style={{
                      padding: "12px 20px",
                      borderRadius: "12px",
                      background: `linear-gradient(135deg, ${projects[selectedProject].color}15, rgba(0,0,0,0.5))`,
                      border: `1px solid ${projects[selectedProject].color}40`,
                      fontSize: "14px",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: projects[selectedProject].color,
                      boxShadow: `0 4px 15px ${projects[selectedProject].color}20`,
                      cursor: "default",
                    }}
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectsOverlay;