import React from "react";
import { Container } from "react-bootstrap";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="vh-100 position-relative d-flex align-items-center justify-content-center text-center"
    >
      {/* 🌌 Full 3D Starfield Background */}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#000", // deep space
        }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.2} />
      </Canvas>

      {/* ✨ Overlay Content */}
      <Container className="position-relative z-2 text-light">
        <h1 className="fw-bold display-3 glass-text">Zaheer’s Starship 🚀</h1>
        <h2 className="mb-3">Exploring Code • AI • 3D • Creativity</h2>
        <p className="mb-4">Fasten your seatbelts. Let’s launch into my portfolio.</p>

        <div className="d-flex justify-content-center gap-3">
          <a href="#projects" className="btn btn-primary">
            Launch Projects
          </a>
          <a href="#contact" className="btn btn-outline-light">
            Contact Mission Control
          </a>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
