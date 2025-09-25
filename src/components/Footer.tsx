import React from "react";
import { Container } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <footer className="py-4 glass-footer mt-5">
      <Container className="text-center">
        <p className="mb-0">© {new Date().getFullYear()} Mohammed Zaheer — Built for DevOne Hackathon 🚀</p>
      </Container>
    </footer>
  );
};

export default Footer;
