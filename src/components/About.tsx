import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { personalInfo } from "../utils/constants";

const About: React.FC = () => {
  return (
    <section id="about" className="py-5">
      <Container>
        <h2 className="text-center fw-bold mb-5 glass-text">About Me</h2>
        <Row className="align-items-center">
          <Col md={{ span: 8, offset: 2 }} className="text-center">
            <p className="mb-4">{personalInfo.bio}</p>
            <p className="mb-0">
              I craft immersive solutions that combine functionality with futuristic design.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;
