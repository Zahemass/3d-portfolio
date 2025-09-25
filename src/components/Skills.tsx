import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SkillsOrbit from "../three/SkillsOrbit";

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-5">
      <Container>
        <h2 className="text-center fw-bold mb-5 glass-text">Skills</h2>
        <Row>
          <Col md={6} className="d-flex justify-content-center">
            <div style={{ width: "300px", height: "300px" }}>
              <Canvas>
                <ambientLight intensity={0.6} />
                <pointLight position={[5, 5, 5]} />
                <SkillsOrbit />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
              </Canvas>
            </div>
          </Col>
          <Col md={6} className="d-flex flex-column justify-content-center">
            <ul className="timeline">
              <li>🎓 Graduated</li>
              <li>💻 Internship</li>
              <li>🚀 Software Engineer</li>
            </ul>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Skills;
