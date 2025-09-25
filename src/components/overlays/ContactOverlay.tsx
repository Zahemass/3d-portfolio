import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, FileDown, Phone, MapPin, Calendar, Send, ExternalLink } from "lucide-react";

interface ContactOverlayProps {
  onClose: () => void;
}

const ContactOverlay: React.FC<ContactOverlayProps> = ({ onClose }) => {
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const contactMethods = [
    {
      id: "email",
      icon: Mail,
      title: "Email",
      value: "zaheer.dev@example.com",
      action: "mailto:zaheer.dev@example.com",
      description: "Best for detailed discussions",
      color: "#4FC3F7",
      available: "24/7"
    },
    {
      id: "linkedin",
      icon: Linkedin,
      title: "LinkedIn",
      value: "/in/mohammed-zaheer-dev",
      action: "https://linkedin.com/in/mohammed-zaheer-dev",
      description: "Professional networking",
      color: "#0077B5",
      available: "Active daily"
    },
    {
      id: "github",
      icon: Github,
      title: "GitHub",
      value: "@mohammed-zaheer",
      action: "https://github.com/mohammed-zaheer",
      description: "Check out my code",
      color: "#fff",
      available: "Updated daily"
    },
    {
      id: "phone",
      icon: Phone,
      title: "Phone",
      value: "+91 98765 43210",
      action: "tel:+919876543210",
      description: "Available for calls",
      color: "#00ff88",
      available: "9 AM - 6 PM IST"
    }
  ];

  const socialLinks = [
    {
      name: "YouTube",
      url: "https://youtube.com/@konnichiwa-music",
      icon: "🎵",
      description: "Kon'nichiwa Music Channel",
      color: "#FF0000"
    },
    {
      name: "Twitter",
      url: "https://twitter.com/zaheer_dev",
      icon: "🐦",
      description: "Tech updates & thoughts",
      color: "#1DA1F2"
    },
    {
      name: "Discord",
      url: "https://discord.gg/zaheer",
      icon: "💬",
      description: "Let's chat about projects",
      color: "#5865F2"
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setShowForm(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(135deg, rgba(40,20,0,0.95), rgba(0,0,0,0.95))",
        color: "white",
        fontFamily: "'Space Mono', monospace",
        zIndex: 2000,
        overflow: "hidden"
      }}
    >
      {/* Animated Background */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.1,
        backgroundImage: `radial-gradient(circle at 20% 80%, #ffd700 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, #ff6b6b 0%, transparent 50%),
                         radial-gradient(circle at 40% 40%, #4ecdc4 0%, transparent 50%)`
      }} />

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          padding: "30px 50px",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
          borderBottom: "1px solid rgba(255,215,0,0.3)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ 
              fontSize: "2.5rem", 
              margin: 0, 
              background: "linear-gradient(45deg, #ffd700, #ff6b6b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 30px #ffd70050"
            }}>
              📡 COMMUNICATION ARRAY
            </h1>
            <p style={{ margin: "10px 0 0 0", opacity: 0.8, fontSize: "1.1rem" }}>
              Establish Contact Protocols • Chennai, India 🇮🇳
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.2rem", color: "#00ff88", fontWeight: "bold" }}>
                ONLINE
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>Status</div>
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
              ✖ CLOSE ARRAY
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div style={{ 
        display: "flex", 
        height: "calc(100vh - 140px)",
        padding: "20px 50px"
      }}>
        {/* Contact Methods */}
        <div style={{ 
          width: "50%", 
          paddingRight: "30px",
          borderRight: "1px solid rgba(255,215,0,0.3)"
        }}>
          <h3 style={{ 
            color: "#ffd700", 
            marginBottom: "30px",
            fontSize: "1.3rem",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            🎯 PRIMARY CHANNELS
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <motion.div
                  key={method.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  onHoverStart={() => setActiveMethod(method.id)}
                  onHoverEnd={() => setActiveMethod(null)}
                  onClick={() => window.open(method.action, '_blank')}
                  style={{
                    padding: "25px",
                    background: activeMethod === method.id 
                      ? `linear-gradient(135deg, ${method.color}20, rgba(0,0,0,0.8))`
                      : "rgba(255,215,0,0.05)",
                    border: `1px solid ${activeMethod === method.id ? method.color : "rgba(255,215,0,0.2)"}`,
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: activeMethod === method.id ? "translateY(-2px)" : "translateY(0)",
                    boxShadow: activeMethod === method.id 
                      ? `0 10px 30px ${method.color}30` 
                      : "0 4px 15px rgba(0,0,0,0.2)"
                  }}
                >
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    marginBottom: "12px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <IconComponent 
                        size={24} 
                        color={method.color}
                        style={{ filter: `drop-shadow(0 0 10px ${method.color}50)` }}
                      />
                      <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: method.color }}>
                        {method.title}
                      </span>
                    </div>
                    
                    <span style={{
                      fontSize: "0.8rem",
                      background: `${method.color}20`,
                      color: method.color,
                      padding: "4px 8px",
                      borderRadius: "10px",
                      border: `1px solid ${method.color}40`
                    }}>
                      {method.available}
                    </span>
                  </div>

                  <div style={{ 
                    fontSize: "1rem", 
                    marginBottom: "8px",
                    fontFamily: "monospace",
                    color: "#fff"
                  }}>
                    {method.value}
                  </div>

                  <div style={{ 
                    fontSize: "0.9rem", 
                    opacity: 0.7,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span>{method.description}</span>
                    {activeMethod === method.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "5px",
                          color: method.color,
                          fontWeight: "bold"
                        }}
                      >
                        Click to connect <ExternalLink size={14} />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          
        </div>

        {/* Right Panel - Social & Form */}
        <div style={{ flex: 1, paddingLeft: "30px", overflowY: "auto" }}>
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                  <h3 style={{ color: "#4ecdc4", fontSize: "1.3rem", margin: 0 }}>
                    📨 SEND MESSAGE
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    style={{
                      background: "transparent",
                      border: "1px solid #666",
                      color: "#666",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    Cancel
                  </button>
                </div>

                {messageSent ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      background: "rgba(0,255,136,0.1)",
                      border: "1px solid #00ff88",
                      borderRadius: "12px"
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ fontSize: "4rem", marginBottom: "20px" }}
                    >
                      🚀
                    </motion.div>
                    <h3 style={{ color: "#00ff88", marginBottom: "10px" }}>
                      MESSAGE TRANSMITTED!
                    </h3>
                    <p style={{ opacity: 0.8 }}>
                      Your message has been sent successfully. I'll get back to you soon!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ display: "flex", gap: "15px" }}>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          background: "rgba(0,0,0,0.4)",
                          border: "1px solid #333",
                          borderRadius: "8px",
                          color: "white",
                          fontSize: "14px",
                          outline: "none"
                        }}
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          background: "rgba(0,0,0,0.4)",
                          border: "1px solid #333",
                          borderRadius: "8px",
                          color: "white",
                          fontSize: "14px",
                          outline: "none"
                        }}
                      />
                    </div>
                    
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      style={{
                        padding: "12px 16px",
                        background: "rgba(0,0,0,0.4)",
                        border: "1px solid #333",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "14px",
                        outline: "none"
                      }}
                    />
                    
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      style={{
                        padding: "12px 16px",
                        background: "rgba(0,0,0,0.4)",
                        border: "1px solid #333",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "14px",
                        outline: "none",
                        resize: "vertical",
                        minHeight: "120px"
                      }}
                    />
                    
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: "15px 30px",
                        background: "linear-gradient(45deg, #4ecdc4, #44a08d)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        boxShadow: "0 0 30px rgba(78,205,196,0.4)"
                      }}
                    >
                      <Send size={18} /> Send Message
                    </motion.button>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <h3 style={{ color: "#ff6b6b", marginBottom: "30px", fontSize: "1.3rem" }}>
                  🌐 SOCIAL CHANNELS
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      style={{
                        padding: "20px",
                        background: `${social.color}10`,
                        border: `1px solid ${social.color}40`,
                        borderRadius: "12px",
                        textDecoration: "none",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        transition: "all 0.3s ease"
                      }}
                    >
                      <span style={{ fontSize: "2rem" }}>{social.icon}</span>
                      <div>
                        <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: social.color }}>
                          {social.name}
                        </div>
                        <div style={{ fontSize: "0.9rem", opacity: 0.8, marginTop: "4px" }}>
                          {social.description}
                        </div>
                      </div>
                      <ExternalLink size={16} style={{ marginLeft: "auto", opacity: 0.6 }} />
                    </motion.a>
                  ))}
                </div>

                <div style={{ 
                  marginTop: "40px",
                  padding: "25px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px"
                }}>
                  <h4 style={{ color: "#ffd700", marginBottom: "15px", fontSize: "1.1rem" }}>
                    🏢 BASED IN CHENNAI, INDIA
                  </h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <MapPin size={16} color="#ffd700" />
                    <span style={{ opacity: 0.8 }}>Available for remote work worldwide</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Calendar size={16} color="#ffd700" />
                    <span style={{ opacity: 0.8 }}>Open to collaborations and opportunities</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Elements */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden"
      }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: "3px",
              height: "3px",
              background: i % 3 === 0 ? "#ffd700" : i % 3 === 1 ? "#ff6b6b" : "#4ecdc4",
              borderRadius: "50%",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ContactOverlay;