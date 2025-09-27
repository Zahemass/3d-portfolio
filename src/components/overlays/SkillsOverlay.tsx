import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/SkillsOverlays.css"; // Import the CSS file

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
      { name: "Next.js", level: 85, color: "#9e0202ff", experience: "2+ years" },
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

  // Total + average with proper typing
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
      className="skills-overlay"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="skills-header"
      >
        <div className="skills-header-content">
          <div>
            <h1 className="skills-title">⚡ SKILL MATRIX</h1>
            <p className="skills-subtitle">Technology Arsenal & Capabilities</p>
          </div>

          {/* Stats + Exit */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="skills-stats"
              >
                <div className="stat-item">
                  <div className="stat-value total">{totalSkills}</div>
                  <div className="stat-label">Total Skills</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value avg">{avgLevel}%</div>
                  <div className="stat-label">Avg Proficiency</div>
                </div>
                <button onClick={onClose} className="exit-button">
                  ✖ EXIT MATRIX
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Categories + Skills */}
      <div className="skills-content">
        {/* Category List */}
        <div className="categories-panel">
          <h3 className="categories-title">🎯 SKILL CATEGORIES</h3>
          <div className="categories-list">
            {Object.entries(skillCategories).map(([category, data], index) => (
              <motion.div
                key={category}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : (category as CategoryName))}
                className={`category-item ${selectedCategory === category ? 'selected' : ''}`}
              >
                <div className="category-header">
                  <span className="category-name">
                    {data.icon} {category}
                  </span>
                  <span className="category-count">{data.skills.length} skills</span>
                </div>
                <p className="category-description">{data.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="skills-panel">
          <AnimatePresence mode="wait">
            {selectedCategory ? (
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 style={{ 
                  color: "#00ffff", 
                  marginBottom: "30px", 
                  fontSize: "1.5rem", 
                  display: "flex", 
                  gap: "10px" 
                }}>
                  {skillCategories[selectedCategory].icon} {selectedCategory}
                </h3>
                <div className="skills-grid">
                  {skillCategories[selectedCategory].skills.map((skill: Skill, index: number) => (
                    <motion.div
                      key={skill.name}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                      onHoverStart={() => setHoveredSkill(skill.name)}
                      onHoverEnd={() => setHoveredSkill(null)}
                      className="skill-item"
                      style={{
                        background: hoveredSkill === skill.name
                          ? `linear-gradient(135deg, ${skill.color}20, rgba(0,0,0,0.8))`
                          : "rgba(0,0,0,0.4)",
                        borderColor: `${skill.color}40`,
                        transform: hoveredSkill === skill.name ? "translateY(-5px)" : "translateY(0)",
                        boxShadow: hoveredSkill === skill.name ? `0 10px 30px ${skill.color}30` : "0 4px 15px rgba(0,0,0,0.2)"
                      }}
                    >
                      <div className="skill-header">
                        <h4 className="skill-name" style={{ color: skill.color }}>
                          {skill.name}
                        </h4>
                      </div>
                      <div className="skill-progress-container">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                          className="skill-progress-bar"
                          style={{
                            background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)`,
                            boxShadow: `0 0 10px ${skill.color}50`
                          }}
                        />
                      </div>
                      <div className="skill-footer">
                        <span>Experience: {skill.experience}</span>
                        {hoveredSkill === skill.name && (
                          <motion.span 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            style={{ color: skill.color, fontWeight: "bold" }}
                          >
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
                className="select-prompt"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="select-icon"
                >
                  🎯
                </motion.div>
                <h3 className="select-title">SELECT A SKILL CATEGORY</h3>
                <p className="select-description">
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