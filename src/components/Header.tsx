import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Sun, Moon } from "lucide-react";
import { navItems } from "../utils/constants";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  gameMode: "exploration" | "professional";
  toggleGameMode: () => void;
}

const Header: React.FC<HeaderProps> = ({
  darkMode,
  toggleDarkMode,
  gameMode,
  toggleGameMode,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar expand="lg" fixed="top" className={`glass-navbar ${scrolled ? "scrolled" : ""}`}>
      <Container>
        <Navbar.Brand href="#hero" className="fw-bold fs-3">Z</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center gap-3">
            {navItems.map((item: { id: string; name: string }) => (
              <Nav.Link key={item.id} href={`#${item.id}`}>
                {item.name}
              </Nav.Link>
            ))}

            {/* Toggle Game Mode Button */}
            <Nav.Link onClick={toggleGameMode} style={{ cursor: "pointer", fontWeight: "bold" }}>
              {gameMode === "exploration" ? "💼 Professional" : "🚀 Space Mode"}
            </Nav.Link>

            {/* Dark Mode Toggle */}
            <Nav.Link onClick={toggleDarkMode} style={{ cursor: "pointer" }}>
              {darkMode ? <Sun /> : <Moon />}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
