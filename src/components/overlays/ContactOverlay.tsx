import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, FileDown, Phone, MapPin, Calendar, Send, ExternalLink } from "lucide-react";
import "../../styles/ContactOverlay.css"; // Import the CSS file

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
      className="contact-overlay"
    >
      {/* Animated Background */}
      <div className="contact-background" />

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="contact-header"
      >
        <div className="contact-header-content">
          <div>
            <h1 className="contact-title">📡 COMMUNICATION ARRAY</h1>
            <p className="contact-subtitle">
              Establish Contact Protocols • Chennai, India 🇮🇳
            </p>
          </div>
          
          <div className="contact-status">
            <div className="status-indicator">
              <div className="status-value">ONLINE</div>
              <div className="status-label">Status</div>
            </div>
            
            <button onClick={onClose} className="contact-close-btn">
              ✖ CLOSE ARRAY
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="contact-content">
        {/* Contact Methods */}
        <div className="contact-methods-panel">
          <h3 className="contact-methods-title">🎯 PRIMARY CHANNELS</h3>
          
          <div className="contact-methods-list">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              const isActive = activeMethod === method.id;
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
                  className={`contact-method ${isActive ? 'active' : ''}`}
                  style={{
                    background: isActive 
                      ? `linear-gradient(135deg, ${method.color}20, rgba(0,0,0,0.8))`
                      : undefined,
                    borderColor: isActive ? method.color : undefined,
                    boxShadow: isActive 
                      ? `0 10px 30px ${method.color}30` 
                      : "0 4px 15px rgba(0,0,0,0.2)"
                  }}
                >
                  <div className="method-header">
                    <div className="method-info">
                      <IconComponent 
                        size={24} 
                        color={method.color}
                        style={{ filter: `drop-shadow(0 0 10px ${method.color}50)` }}
                      />
                      <span className="method-title" style={{ color: method.color }}>
                        {method.title}
                      </span>
                    </div>
                    
                    <span 
                      className="method-availability"
                      style={{
                        background: `${method.color}20`,
                        color: method.color,
                        border: `1px solid ${method.color}40`
                      }}
                    >
                      {method.available}
                    </span>
                  </div>

                  <div className="method-value">{method.value}</div>

                  <div className="method-footer">
                    <span>{method.description}</span>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="method-action"
                        style={{ color: method.color }}
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
        <div className="contact-right-panel">
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <div className="form-header">
                  <h3 className="form-title">📨 SEND MESSAGE</h3>
                  <button onClick={() => setShowForm(false)} className="form-cancel-btn">
                    Cancel
                  </button>
                </div>

                {messageSent ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="message-sent"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="message-sent-icon"
                    >
                      🚀
                    </motion.div>
                    <h3 className="message-sent-title">MESSAGE TRANSMITTED!</h3>
                    <p className="message-sent-text">
                      Your message has been sent successfully. I'll get back to you soon!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="contact-form">
                    <div className="form-row">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="form-input half"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="form-input half"
                      />
                    </div>
                    
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="form-input full"
                    />
                    
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="form-textarea"
                    />
                    
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="form-submit-btn"
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
                <h3 className="social-title">🌐 SOCIAL CHANNELS</h3>
                
                <div className="social-list">
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
                      className="social-link"
                      style={{
                        background: `${social.color}10`,
                        border: `1px solid ${social.color}40`
                      }}
                    >
                      <span className="social-icon">{social.icon}</span>
                      <div className="social-info">
                        <div className="social-name" style={{ color: social.color }}>
                          {social.name}
                        </div>
                        <div className="social-description">
                          {social.description}
                        </div>
                      </div>
                      <ExternalLink size={16} style={{ marginLeft: "auto", opacity: 0.6 }} />
                    </motion.a>
                  ))}
                </div>

                <div className="location-info">
                  <h4 className="location-title">🏢 BASED IN CHENNAI, INDIA</h4>
                  <div className="location-item">
                    <MapPin size={16} color="#ffd700" />
                    <span>Available for remote work worldwide</span>
                  </div>
                  <div className="location-item">
                    <Calendar size={16} color="#ffd700" />
                    <span>Open to collaborations and opportunities</span>
                  </div>
                </div>

                {!showForm && (
                  <motion.button
                    onClick={() => setShowForm(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      marginTop: "30px",
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
                      boxShadow: "0 0 30px rgba(78,205,196,0.4)",
                      width: "100%"
                    }}
                  >
                    <Send size={18} /> Send Direct Message
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-dot"
            style={{
              background: i % 3 === 0 ? "#ffd700" : i % 3 === 1 ? "#ff6b6b" : "#4ecdc4",
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