import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Group, Vector3, Euler, Color, MathUtils } from "three";


interface SpaceshipProps {
  setHud: (hud: any) => void;
  paused: boolean;
  joystickDir?: {x: number, y: number};
  isMobile?: boolean;
}


const Spaceship: React.FC<SpaceshipProps> = ({ setHud, paused, joystickDir, isMobile }) => {

  const shipRef = useRef<Group>(null!);
  const { scene } = useGLTF("/spaceship.glb");
  
  // Enhanced physics - made more responsive
  const speed = 0.4; // Increased from 0.3
  const maxSpeed = 3.0; // Increased from 2.0
  const acceleration = 0.08; // Increased from 0.02
  const friction = 0.96; // Reduced from 0.98 for less drag
  const velocity = useRef(new Vector3(0, 0, 0));
  
  // Enhanced effects
  const exhaustRef = useRef<any>(null);
  const leftThrusterRef = useRef<any>(null);
  const rightThrusterRef = useRef<any>(null);
  const boostTrailRef = useRef<any>(null);
  
  // Enhanced states
  const [isThrusting, setIsThrusting] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);
  const [fuel, setFuel] = useState(100);
  const [health, setHealth] = useState(100);
  const [shieldActive, setShieldActive] = useState(false);
  
  // Enhanced animations
  const [tilt, setTilt] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [roll, setRoll] = useState(0);
  
  // Particle systems
  const [thrustParticles, setThrustParticles] = useState<any[]>([]);
  const [damageParticles, setDamageParticles] = useState<any[]>([]);

  // Track pressed keys with enhanced detection
  const keys = useRef<{ [key: string]: boolean }>({});
  const keyPressTime = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!keys.current[key]) {
        keyPressTime.current[key] = Date.now();
      }
      keys.current[key] = true;
    };
    
    const up = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keys.current[key] = false;
      delete keyPressTime.current[key];
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Enhanced spaceship physics and animations
  useFrame(({ camera, clock }) => {
    if (!shipRef.current) return;

    const time = clock.getElapsedTime();

    if (paused) {
      velocity.current.set(0, 0, 0);
      setIsThrusting(false);
      setIsBoosting(false);
      camera.lookAt(shipRef.current.position);
      return;
    }

    let targetVelocity = new Vector3();
    let isUsingThrust = false;
    let isUsingBoost = false;

    let forward = keys.current["w"] || keys.current["arrowup"];
let backward = keys.current["s"] || keys.current["arrowdown"];
let left = keys.current["a"] || keys.current["arrowleft"];
let right = keys.current["d"] || keys.current["arrowright"];

// 👇 Override with joystick if mobile
if (isMobile && joystickDir) {
  if (joystickDir.y > 0.3) forward = true;
  if (joystickDir.y < -0.3) backward = true;
  if (joystickDir.x < -0.3) left = true;
  if (joystickDir.x > 0.3) right = true;
}
    // Enhanced movement with acceleration/deceleration
    const forwardPressed = keys.current["w"] || keys.current["arrowup"];
    const backwardPressed = keys.current["s"] || keys.current["arrowdown"];
    const leftPressed = keys.current["a"] || keys.current["arrowleft"];
    const rightPressed = keys.current["d"] || keys.current["arrowright"];
    const upPressed = keys.current[" "];
    const downPressed = keys.current["shift"];
    const boostPressed = keys.current["q"] || keys.current["e"];

    // Forward/backward with enhanced physics
    if (forwardPressed) {
      targetVelocity.z -= speed;
      isUsingThrust = true;
      
      if (boostPressed && fuel > 10) {
        targetVelocity.z -= speed * 1.5;
        isUsingBoost = true;
        setFuel(prev => Math.max(0, prev - 0.8));
      } else {
        setFuel(prev => Math.min(100, prev + 0.1));
      }
    } else if (backwardPressed) {
      targetVelocity.z += speed * 0.7;
      isUsingThrust = true;
    }

    // Strafe with enhanced banking
    if (leftPressed) {
      targetVelocity.x -= speed * 0.8;
      setTilt(MathUtils.lerp(tilt, 0.6, 0.1));
      setRoll(MathUtils.lerp(roll, 0.3, 0.05));
      
      if (forwardPressed) {
        setYaw(0.015);
      }
    } else if (rightPressed) {
      targetVelocity.x += speed * 0.8;
      setTilt(MathUtils.lerp(tilt, -0.6, 0.1));
      setRoll(MathUtils.lerp(roll, -0.3, 0.05));
      
      if (forwardPressed) {
        setYaw(-0.015);
      }
    } else {
      setTilt(MathUtils.lerp(tilt, 0, 0.08));
      setRoll(MathUtils.lerp(roll, 0, 0.05));
      setYaw(0);
    }

    // Vertical movement with pitch
    if (upPressed) {
      targetVelocity.y += speed * 0.8;
      setPitch(MathUtils.lerp(pitch, -0.2, 0.05));
      isUsingThrust = true;
    } else if (downPressed) {
      targetVelocity.y -= speed * 0.8;
      setPitch(MathUtils.lerp(pitch, 0.2, 0.05));
      isUsingThrust = true;
    } else {
      setPitch(MathUtils.lerp(pitch, 0, 0.05));
    }

    // Apply enhanced physics
    velocity.current.lerp(targetVelocity, acceleration);
    velocity.current.multiplyScalar(friction);
    
    // Speed limiting
    const currentSpeed = velocity.current.length();
    if (currentSpeed > maxSpeed) {
      velocity.current.normalize().multiplyScalar(maxSpeed);
    }

    shipRef.current.position.add(velocity.current);
    
    // Enhanced rotation system
    shipRef.current.rotation.z = MathUtils.lerp(shipRef.current.rotation.z, tilt, 0.1);
    shipRef.current.rotation.y += yaw;
    shipRef.current.rotation.x = MathUtils.lerp(shipRef.current.rotation.x, pitch, 0.1);

    // Subtle idle animation when not moving
    if (currentSpeed < 0.1) {
      shipRef.current.position.y += Math.sin(time * 2) * 0.02;
      shipRef.current.rotation.y += Math.sin(time * 1.5) * 0.005;
    }

    // Ultra-simple camera system - no prediction, no stickiness
    const baseDistance = 12;
    const baseHeight = 4;
    
    // Fixed offset behind the ship (no rotation, no prediction)
    const cameraOffset = new Vector3(0, baseHeight, baseDistance);
    const targetCamPos = shipRef.current.position.clone().add(cameraOffset);
    
    // Very smooth camera follow
    camera.position.lerp(targetCamPos, 0.03);
    
    // Simple direct look-at with no prediction
    camera.lookAt(shipRef.current.position);

    // Update states
    setIsThrusting(isUsingThrust);
    setIsBoosting(isUsingBoost);

    // Enhanced HUD updates
    setHud({
      speed: currentSpeed.toFixed(2),
      position: shipRef.current.position.clone(),
      velocity: velocity.current.clone(),
      fuel: fuel,
      health: health,
      isThrusting: isUsingThrust,
      isBoosting: isUsingBoost,
    });

    // Enhanced exhaust effects
    if (exhaustRef.current) {
      exhaustRef.current.rotation.y = Math.sin(time * 15) * 0.3;
      exhaustRef.current.scale.setScalar(
        isUsingThrust ? 1 + Math.sin(time * 25) * 0.3 : 0.5
      );
      exhaustRef.current.material.emissiveIntensity = isUsingThrust ? 
        (isUsingBoost ? 4 : 2) + Math.sin(time * 20) * 0.5 : 0.5;
    }

    // Side thruster effects
    if (leftThrusterRef.current) {
      leftThrusterRef.current.scale.setScalar(leftPressed ? 1 : 0.3);
      leftThrusterRef.current.material.emissiveIntensity = leftPressed ? 2 : 0.2;
    }
    
    if (rightThrusterRef.current) {
      rightThrusterRef.current.scale.setScalar(rightPressed ? 1 : 0.3);
      rightThrusterRef.current.material.emissiveIntensity = rightPressed ? 2 : 0.2;
    }
  });

  return (
    <group ref={shipRef} position={[0, 0, 5]}>
      {/* Enhanced Spaceship Model with glow */}
      <group>
        <primitive object={scene} scale={0.3} />
        
        {/* Ship glow effect */}
        <mesh scale={1.2}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial
            color={isBoosting ? "#00ffff" : "#4488ff"}
            transparent
            opacity={0.1}
          />
        </mesh>
      </group>

      {/* Enhanced Main Exhaust System */}
      <group position={[0, -0.3, 3]} rotation={[Math.PI, 0, 0]}>
        {/* Primary exhaust flame */}
        <mesh ref={exhaustRef}>
          <coneGeometry args={[0.3, isThrusting ? (isBoosting ? 1.2 : 0.8) : 0.3, 16]} />
          <meshStandardMaterial
            emissive={new Color(isBoosting ? "#00ffff" : "#ff4500")}
            emissiveIntensity={isThrusting ? (isBoosting ? 4 : 2) : 0.5}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Secondary exhaust layer */}
        <mesh position={[0, 0, 0.2]}>
          <coneGeometry args={[0.5, isThrusting ? (isBoosting ? 1.8 : 1.2) : 0.5, 16]} />
          <meshStandardMaterial
            emissive={new Color(isBoosting ? "#0088ff" : "#ff6600")}
            emissiveIntensity={isThrusting ? (isBoosting ? 2 : 1) : 0.3}
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Exhaust light */}
        <pointLight 
          intensity={isThrusting ? (isBoosting ? 4 : 2) : 0.5} 
          distance={10} 
          color={isBoosting ? "#00ffff" : "#ff4500"} 
        />
      </group>

      {/* Enhanced Side Thrusters */}
      <group position={[-1.2, 0, 1]} rotation={[0, Math.PI / 2, 0]}>
        <mesh ref={leftThrusterRef}>
          <coneGeometry args={[0.15, keys.current["a"] ? 0.6 : 0.2, 8]} />
          <meshStandardMaterial
            emissive={new Color("#00ff88")}
            emissiveIntensity={keys.current["a"] ? 2 : 0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
        <pointLight 
          intensity={keys.current["a"] ? 1 : 0.1} 
          distance={3} 
          color="#00ff88" 
        />
      </group>

      <group position={[1.2, 0, 1]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh ref={rightThrusterRef}>
          <coneGeometry args={[0.15, keys.current["d"] ? 0.6 : 0.2, 8]} />
          <meshStandardMaterial
            emissive={new Color("#00ff88")}
            emissiveIntensity={keys.current["d"] ? 2 : 0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
        <pointLight 
          intensity={keys.current["d"] ? 1 : 0.1} 
          distance={3} 
          color="#00ff88" 
        />
      </group>

      {/* Enhanced Boost Trail Effect */}
      {isBoosting && (
        <group position={[0, 0, 3]}>
          <mesh>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial
              emissive={new Color("#00ffff")}
              emissiveIntensity={2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      )}

      {/* Shield Effect */}
      {shieldActive && (
        <mesh scale={1.5}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshStandardMaterial
            emissive={new Color("#00ffff")}
            emissiveIntensity={0.3}
            transparent
            opacity={0.2}
            wireframe
          />
        </mesh>
      )}

      {/* Navigation Lights */}
      <group>
        <pointLight position={[-1, 0, 0]} intensity={0.5} color="#ff0000" distance={2} />
        <pointLight position={[1, 0, 0]} intensity={0.5} color="#00ff00" distance={2} />
        <pointLight position={[0, 0, -2]} intensity={0.3} color="#ffffff" distance={3} />
      </group>

      {/* Damage sparks effect (when health is low) */}
      {health < 30 && (
        <group>
          {[...Array(Math.floor((30 - health) / 5))].map((_, i) => (
            <mesh key={i} position={[
              Math.random() * 2 - 1, 
              Math.random() * 2 - 1, 
              Math.random() * 2 - 1
            ]}>
              <sphereGeometry args={[0.05, 4, 4]} />
              <meshStandardMaterial
                emissive={new Color("#ff4500")}
                emissiveIntensity={1}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

export default Spaceship;