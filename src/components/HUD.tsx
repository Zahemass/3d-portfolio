import React from "react";
import { Vector3 } from "three";

interface HUDProps {
  hud: { speed: string; position: Vector3 };
}

const HUD: React.FC<HUDProps> = ({ hud }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        color: "cyan",
        fontFamily: "monospace",
        fontSize: "14px",
        background: "rgba(0,0,0,0.5)",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <div>🚀 Speed: {hud.speed}</div>
      <div>
        📍 Position: x={hud.position.x.toFixed(1)} y={hud.position.y.toFixed(1)} z=
        {hud.position.z.toFixed(1)}
      </div>
    </div>
  );
};

export default HUD;
