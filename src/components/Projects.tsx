import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { projects } from "../utils/constants";

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-5">
      <Container>
        <h2 className="text-center fw-bold mb-5 glass-text">Projects</h2>
        <Row className="align-items-stretch">
          {projects.map((p, idx) => (
            <Col md={4} key={idx} className="mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="glass-card p-4 h-100 d-flex flex-column"
              >
                {/* Project Name */}
                <h4 className="mb-3">{p.name}</h4>

                {/* Project Description */}
                <p className="flex-grow-1">{p.description}</p>

                {/* Project Link */}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary mt-auto align-self-start"
                  >
                    🔗 View Project
                  </a>
                )}
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Projects;
