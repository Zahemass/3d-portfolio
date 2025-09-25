import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground: React.FC = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setReady(true);
    });
  }, []);

  // particle options with correct types
  const options: ISourceOptions = {
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        resize: { enable: true }, // ✅ must be object
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    particles: {
      color: { value: "#00ced1" },
      links: {
        color: "#2ecc71",
        distance: 150,
        enable: true,
        opacity: 0.8,
        width: 1,
      },
      move: { enable: true, speed: 1, outModes: { default: "bounce" } },
      number: {
        density: { enable: true, width: 800, height: 800 }, // ✅ use width/height instead of area
        value: 50,
      },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 5 } },
    },
    detectRetina: true,
  };

  // ✅ explicitly return null instead of false
  if (!ready) return null;

  return <Particles id="tsparticles" options={options} />;
};

export default ParticleBackground;
