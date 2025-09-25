import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillsOverlayProps {
  onClose: () => void;
}

// Define types
type Skill = {
  name: string;
  level: number;
  color: string;
  experience: string;
};

type SkillCategory = {
  skills: ReadonlyArray<Skill>;
  icon: string;
  description: string;
};


// Strongly typed categories object
const skillCategories = {
  "Frontend Development": {
    skills: [
      { name: "React", level: 95, color: "#61DAFB", experience: "3+ years" },
      { name: "TypeScript", level: 90, color: "#3178C6", experience: "2+ years" },
      { name: "Next.js", level: 85, color: "#000000", experience: "2+ years" },
      { name: "CSS/SCSS", level: 90, color: "#1572B6", experience: "4+ years" },
      { name: "Framer Motion", level: 80, color: "#0055FF", experience: "1+ year" },
      { name: "Tailwind CSS", level: 88, color: "#06B6D4", experience: "2+ years" }
    ],
    icon: "🎨",
    description: "Creating beautiful, responsive user interfaces"
  },
  "Backend Development": {
    skills: [
      { name: "Node.js", level: 92, color: "#339933", experience: "3+ years" },
      { name: "Express.js", level: 88, color: "#000000", experience: "3+ years" },
      { name: "Supabase", level: 85, color: "#3ECF8E", experience: "1+ year" },
      { name: "Firebase", level: 90, color: "#FFCA28", experience: "2+ years" },
      { name: "MongoDB", level: 82, color: "#47A248", experience: "2+ years" },
      { name: "PostgreSQL", level: 80, color: "#4169E1", experience: "1+ year" }
    ],
    icon: "⚙️",
    description: "Building scalable server-side applications"
  },
  "Mobile Development": {
    skills: [
      { name: "Flutter", level: 92, color: "#02569B", experience: "2+ years" },
      { name: "Dart", level: 90, color: "#0175C2", experience: "2+ years" },
      { name: "React Native", level: 75, color: "#61DAFB", experience: "1+ year" },
      { name: "Android SDK", level: 70, color: "#3DDC84", experience: "1+ year" }
    ],
    icon: "📱",
    description: "Cross-platform mobile applications"
  },
  "3D & Game Development": {
    skills: [
      { name: "Three.js", level: 85, color: "#000000", experience: "1+ year" },
      { name: "Blender", level: 78, color: "#F5792A", experience: "2+ years" },
      { name: "WebGL", level: 70, color: "#990000", experience: "1+ year" },
      { name: "Unity", level: 65, color: "#000000", experience: "6 months" }
    ],
    icon: "🎮",
    description: "Immersive 3D experiences and games"
  },
  "AI & Machine Learning": {
    skills: [
      { name: "Python", level: 88, color: "#3776AB", experience: "3+ years" },
      { name: "TensorFlow", level: 75, color: "#FF6F00", experience: "1+ year" },
      { name: "OpenCV", level: 80, color: "#5C3EE8", experience: "1+ year" },
      { name: "Scikit-learn", level: 70, color: "#F7931E", experience: "1+ year" }
    ],
    icon: "🤖",
    description: "Intelligent systems and data analysis"
  },
  "DevOps & Tools": {
    skills: [
      { name: "Git", level: 95, color: "#F05032", experience: "4+ years" },
      { name: "Docker", level: 75, color: "#2496ED", experience: "1+ year" },
      { name: "Vercel", level: 90, color: "#000000", experience: "2+ years" },
      { name: "AWS", level: 70, color: "#FF9900", experience: "1+ year" },
      { name: "Linux", level: 82, color: "#FCC624", experience: "2+ years" }
    ],
    icon: "🛠️",
    description: "Development tools and deployment"
  }
} as const;

type CategoryName = keyof typeof skillCategories;

const SkillsOverlay: React.FC<SkillsOverlayProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

    // ✅ Total + average with proper typing
  const totalSkills = (Object.values(skillCategories) as SkillCategory[]).reduce(
    (acc, cat) => acc + cat.skills.length,
    0
  );

  const avgLevel = Math.round(
    (Object.values(skillCategories) as SkillCategory[]).reduce(
      (acc, cat) => acc + cat.skills.reduce((sum: number, skill: Skill) => sum + skill.level, 0),
      0
    ) / totalSkills
  );


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(135deg, rgba(0,20,40,0.95), rgba(0,0,0,0.95))",
        color: "white",
        fontFamily: "'Space Mono', monospace",
        zIndex: 2000,
        overflow: "hidden"
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          padding: "30px 50px",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
          borderBottom: "1px solid rgba(0,255,136,0.3)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ 
              fontSize: "2.5rem", 
              margin: 0, 
              background: "linear-gradient(45deg, #00ff88, #00ffff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 30px #00ff8850"
            }}>
              ⚡ SKILL MATRIX
            </h1>
            <p style={{ margin: "10px 0 0 0", opacity: 0.8, fontSize: "1.1rem" }}>
              Technology Arsenal & Capabilities
            </p>
          </div>

          {/* Stats + Exit */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{ display: "flex", gap: "30px", alignItems: "center" }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", color: "#00ff88", fontWeight: "bold" }}>
                    {totalSkills}
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>Total Skills</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", color: "#00ffff", fontWeight: "bold" }}>
                    {avgLevel}%
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>Avg Proficiency</div>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(45deg, #ff4757, #ff3838)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "14px",
                    boxShadow: "0 0 20px rgba(255,71,87,0.5)"
                  }}
                >
                  ✖ EXIT MATRIX
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Categories + Skills */}
      <div style={{ display: "flex", height: "calc(100vh - 140px)", padding: "20px 50px" }}>
        {/* Category List */}
        <div style={{ width: "350px", paddingRight: "30px", borderRight: "1px solid rgba(0,255,136,0.3)" }}>
          <h3 style={{ color: "#00ff88", marginBottom: "20px", fontSize: "1.3rem" }}>
            🎯 SKILL CATEGORIES
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Object.entries(skillCategories).map(([category, data], index) => (
              <motion.div
                key={category}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : (category as CategoryName))}
                style={{
                  padding: "20px",
                  background: selectedCategory === category 
                    ? "linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,255,0.1))"
                    : "rgba(0,255,136,0.05)",
                  border: `1px solid ${selectedCategory === category ? "#00ff88" : "rgba(0,255,136,0.2)"}`,
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                    {data.icon} {category}
                  </span>
                  <span style={{
                    fontSize: "0.9rem",
                    opacity: 0.7,
                    background: "rgba(0,255,136,0.2)",
                    padding: "4px 8px",
                    borderRadius: "10px"
                  }}>
                    {data.skills.length} skills
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8 }}>{data.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div style={{ flex: 1, paddingLeft: "30px", overflowY: "auto" }}>
          <AnimatePresence mode="wait">
            {selectedCategory ? (
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 style={{ color: "#00ffff", marginBottom: "30px", fontSize: "1.5rem", display: "flex", gap: "10px" }}>
                  {skillCategories[selectedCategory].icon} {selectedCategory}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                  {skillCategories[selectedCategory].skills.map((skill: Skill, index: number) => (
                    <motion.div
                      key={skill.name}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                      onHoverStart={() => setHoveredSkill(skill.name)}
                      onHoverEnd={() => setHoveredSkill(null)}
                      style={{
                        padding: "20px",
                        background: hoveredSkill === skill.name
                          ? `linear-gradient(135deg, ${skill.color}20, rgba(0,0,0,0.8))`
                          : "rgba(0,0,0,0.4)",
                        border: `1px solid ${skill.color}40`,
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        transform: hoveredSkill === skill.name ? "translateY(-5px)" : "translateY(0)",
                        boxShadow: hoveredSkill === skill.name ? `0 10px 30px ${skill.color}30` : "0 4px 15px rgba(0,0,0,0.2)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                        <h4 style={{ margin: 0, color: skill.color, fontSize: "1.2rem", fontWeight: "bold" }}>
                          {skill.name}
                        </h4>
                        <span style={{ fontSize: "1rem", color: skill.color, fontWeight: "bold" }}>
                          {skill.level}%
                        </span>
                      </div>
                      <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", marginBottom: "12px" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                          style={{
                            height: "100%",
                            background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)`,
                            borderRadius: "4px",
                            boxShadow: `0 0 10px ${skill.color}50`
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "0.9rem", opacity: 0.7, display: "flex", justifyContent: "space-between" }}>
                        <span>Experience: {skill.experience}</span>
                        {hoveredSkill === skill.name && (
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: skill.color, fontWeight: "bold" }}>
                            Click to explore
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ fontSize: "4rem", marginBottom: "20px" }}
                >
                  🎯
                </motion.div>
                <h3 style={{ color: "#00ffff", fontSize: "1.5rem", marginBottom: "15px" }}>SELECT A SKILL CATEGORY</h3>
                <p style={{ opacity: 0.7, fontSize: "1.1rem", maxWidth: "400px", lineHeight: 1.6 }}>
                  Choose a category from the left panel to explore my technical skills,
                  experience levels, and project applications.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillsOverlay;
