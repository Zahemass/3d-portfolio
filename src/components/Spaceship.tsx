import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Group, Vector3, Color, MathUtils } from "three";

/**
 * Props for the Spaceship component
 */
interface SpaceshipProps {
  setHud: (hud: any) => void;
  paused: boolean;
  joystickDir?: { x: number; y: number };
  isMobile?: boolean;
  mobileVertical?: 'up' | 'down' | null;
  mobileRotation?: 'left' | 'right' | null;
  mobileBoost?: boolean;
  cameraControl?: {
    isDragging: boolean;
    lastMouse?: { x: number; y: number };
    lastTouch: { x: number; y: number };
    rotation: { horizontal: number; vertical: number };
    sensitivity: number;
    touchSensitivity?: number;
    mouseSensitivity?: number;
    distance?: number;
    minDistance?: number;
    maxDistance?: number;
    smoothing?: number;
    verticalLimit?: number;
  };
}

/**
 * Simplified Spaceship component - PUBG TPS Style
 * - Clean WASD movement relative to camera
 * - Mouse handles all camera rotation
 * - Simplified physics and animations
 * - Removed complex rotation keys and unnecessary controls
 */
const Spaceship: React.FC<SpaceshipProps> = ({
  setHud,
  paused,
  joystickDir,
  isMobile,
  mobileVertical,
  mobileRotation,
  mobileBoost,
  cameraControl 
}) => {
  /** === Refs === */
  const shipRef = useRef<Group>(null!);
  const { scene } = useGLTF("/spaceship.glb");

  /** === Simplified Physics === */
  const speed = 0.5;
  const maxSpeed = 2.5;
  const acceleration = 0.12;
  const friction = 0.94;
  const velocity = useRef(new Vector3(0, 0, 0));

  /** === Camera tracking === */
  const cameraPosition = useRef(new Vector3());
  const cameraTarget = useRef(new Vector3());

  /** === Effects refs === */
  const exhaustRef = useRef<any>(null);

  /** === States === */
  const [fuel, setFuel] = useState(100);
  const [health, setHealth] = useState(100);
  const [isThrusting, setIsThrusting] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);

  // Simplified animations
  const [tilt, setTilt] = useState(0);
  const [pitch, setPitch] = useState(0);

  /** === Simplified Keyboard Tracking === */
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };

    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  /** === Main Physics Loop === */
  useFrame(({ camera, clock }) => {
    if (!shipRef.current) return;

    const time = clock.getElapsedTime();

    /** Pause handling */
    if (paused) {
      velocity.current.set(0, 0, 0);
      setIsThrusting(false);
      setIsBoosting(false);
      camera.lookAt(shipRef.current.position);
      return;
    }

    /** === Camera Direction for Movement === */
    let cameraAngleH = 0;
    
    if (cameraControl) {
      cameraAngleH = cameraControl.rotation.horizontal;
    }

    // Camera-relative directions (PUBG style)
    const cameraForward = new Vector3(
      Math.sin(cameraAngleH),
      0,
      Math.cos(cameraAngleH)
    ).normalize();

    const cameraRight = new Vector3(
      Math.cos(cameraAngleH),
      0,
      -Math.sin(cameraAngleH)
    ).normalize();

    /** === Simplified Input Detection === */
    let forward = keys.current["s"];
    let backward = keys.current["w"];
    let left = keys.current["a"];
    let right = keys.current["d"];
    let upPressed = keys.current["j"]; // Space or Shift
    let downPressed = keys.current["k"];
    let boostPressed = keys.current["e"];

    /** === Mobile Override === */
    if (isMobile) {
      if (mobileVertical === 'up') {
        upPressed = true;
        downPressed = false;
      } else if (mobileVertical === 'down') {
        upPressed = false;
        downPressed = true;
      }
      
      if (mobileBoost) {
        boostPressed = true;
      }
    }

    /** === Movement Calculation === */
    let targetVelocity = new Vector3();
    let isUsingThrust = false;
    let isUsingBoost = false;

    /** === WASD Movement (Camera Relative) === */
    if (forward) {
      targetVelocity.add(cameraForward.clone().multiplyScalar(speed));
      isUsingThrust = true;
      setPitch(MathUtils.lerp(pitch, -0.1, 0.1));

      if (boostPressed && fuel > 10) {
        targetVelocity.add(cameraForward.clone().multiplyScalar(speed));
        isUsingBoost = true;
        setFuel(prev => Math.max(0, prev - 1.0));
      }
    }

    if (backward) {
      targetVelocity.add(cameraForward.clone().multiplyScalar(-speed * 0.6));
      isUsingThrust = true;
      setPitch(MathUtils.lerp(pitch, 0.1, 0.1));
    }

    if (left) {
      targetVelocity.add(cameraRight.clone().multiplyScalar(-speed));
      setTilt(MathUtils.lerp(tilt, 0.3, 0.1));
    }

    if (right) {
      targetVelocity.add(cameraRight.clone().multiplyScalar(speed));
      setTilt(MathUtils.lerp(tilt, -0.3, 0.1));
    }

    /** === Joystick Movement (Mobile) === */
    if (joystickDir && (Math.abs(joystickDir.x) > 0.1 || Math.abs(joystickDir.y) > 0.1)) {
      const joyForward = cameraForward.clone().multiplyScalar(-joystickDir.y * speed * 4.0);
      const joyRight = cameraRight.clone().multiplyScalar(joystickDir.x * speed * 4.0);
      
      targetVelocity.add(joyForward);
      targetVelocity.add(joyRight);

      setTilt(MathUtils.lerp(tilt, -joystickDir.x * 0.4, 0.1));
      setPitch(MathUtils.lerp(pitch, -joystickDir.y * 0.2, 0.1));
      
      isUsingThrust = true;

      if (joystickDir.y > 0.5 && mobileBoost && fuel > 10) {
        targetVelocity.add(cameraForward.clone().multiplyScalar(speed));
        isUsingBoost = true;
        setFuel(prev => Math.max(0, prev - 1.0));
      }
    }

    /** === Vertical Movement === */
    if (upPressed) {
      targetVelocity.y += speed * 0.8;
      isUsingThrust = true;
    }

    if (downPressed) {
      targetVelocity.y -= speed * 0.8;
      isUsingThrust = true;
    }

    /** === Reset animations when no input === */
    if (!forward && !backward && !left && !right && (!joystickDir || (Math.abs(joystickDir.x) < 0.1 && Math.abs(joystickDir.y) < 0.1))) {
      setTilt(MathUtils.lerp(tilt, 0, 0.08));
      setPitch(MathUtils.lerp(pitch, 0, 0.08));
    }

    /** === Fuel regeneration === */
    if (!isUsingBoost) {
      setFuel(prev => Math.min(100, prev + 0.2));
    }

    /** === Apply Physics === */
    velocity.current.lerp(targetVelocity, acceleration);
    velocity.current.multiplyScalar(friction);

    const currentSpeed = velocity.current.length();
    if (currentSpeed > maxSpeed) {
      velocity.current.normalize().multiplyScalar(maxSpeed);
    }

    shipRef.current.position.add(velocity.current);

    /** === Ship Rotation (Simplified) === */
    // Face movement direction naturally
    if (currentSpeed > 0.1) {
      const movementDirection = velocity.current.clone().normalize();
      const targetRotY = Math.atan2(movementDirection.x, movementDirection.z);
      shipRef.current.rotation.y = MathUtils.lerp(shipRef.current.rotation.y, targetRotY, 0.08);
    }
    
    // Apply tilt and pitch for visual feedback
    shipRef.current.rotation.z = MathUtils.lerp(shipRef.current.rotation.z, tilt, 0.1);
    shipRef.current.rotation.x = MathUtils.lerp(shipRef.current.rotation.x, pitch, 0.1);

    // Idle floating animation
    if (currentSpeed < 0.1) {
      shipRef.current.position.y += Math.sin(time * 2) * 0.01;
    }

    /** === PUBG Style TPS Camera === */
    const baseHeight = 3;
    let cameraDistance = 10;
    let smoothing = 0.1;

    if (cameraControl) {
      cameraDistance = cameraControl.distance ?? 10;
      smoothing = cameraControl.smoothing ?? 0.1;
    }

    // Camera angle from control
    const cameraAngleV = cameraControl ? cameraControl.rotation.vertical : 0;

    // Calculate camera position
    const cameraOffset = new Vector3(
      Math.sin(cameraAngleH) * Math.cos(cameraAngleV) * cameraDistance,
      baseHeight + Math.sin(cameraAngleV) * cameraDistance * 0.7,
      Math.cos(cameraAngleH) * Math.cos(cameraAngleV) * cameraDistance
    );

    const targetCamPos = shipRef.current.position.clone().add(cameraOffset);
    cameraPosition.current.lerp(targetCamPos, smoothing);
    camera.position.copy(cameraPosition.current);

    // Look at ship
    const lookTarget = shipRef.current.position.clone();
    lookTarget.y += 1;
    cameraTarget.current.lerp(lookTarget, smoothing);
    camera.lookAt(cameraTarget.current);

    /** === Update HUD === */
    setIsThrusting(isUsingThrust);
    setIsBoosting(isUsingBoost);
    setHud({
      speed: currentSpeed.toFixed(2),
      position: shipRef.current.position.clone(),
      velocity: velocity.current.clone(),
      fuel,
      health,
      isThrusting: isUsingThrust,
      isBoosting: isUsingBoost,
    });

    /** === Exhaust Effects === */
    if (exhaustRef.current) {
      exhaustRef.current.scale.setScalar(
        isUsingThrust ? 1 + Math.sin(time * 20) * 0.2 : 0.3
      );
      exhaustRef.current.material.emissiveIntensity = isUsingThrust
        ? (isUsingBoost ? 4 : 2)
        : 0.3;
    }
  });

  /** === JSX === */
  return (
    <group ref={shipRef} position={[0, 0, 5]}>
      {/* Main Ship */}
      <group>
        <primitive object={scene} scale={0.3} />
        <mesh scale={1.2}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial
            color={isBoosting ? "#00ffff" : "#4488ff"}
            transparent
            opacity={0.1}
          />
        </mesh>
      </group>

      {/* Simplified Exhaust */}
      <group position={[0, -0.3, 3]} rotation={[Math.PI, 0, 0]}>
        <mesh ref={exhaustRef}>
          <coneGeometry
            args={[0.3, isThrusting ? (isBoosting ? 1.0 : 0.6) : 0.2, 12]}
          />
          <meshStandardMaterial
            emissive={new Color(isBoosting ? "#00ffff" : "#ff4500")}
            emissiveIntensity={isThrusting ? (isBoosting ? 4 : 2) : 0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
        <pointLight
          intensity={isThrusting ? (isBoosting ? 3 : 1.5) : 0.3}
          distance={8}
          color={isBoosting ? "#00ffff" : "#ff4500"}
        />
      </group>

      {/* Boost Trail */}
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

      {/* Navigation Lights */}
      <group>
        <pointLight position={[-1, 0, 0]} intensity={0.3} color="#ff0000" />
        <pointLight position={[1, 0, 0]} intensity={0.3} color="#00ff00" />
        <pointLight position={[0, 0, -2]} intensity={0.2} color="#ffffff" />
      </group>

      {/* Damage Effects */}
      {health < 30 && (
        <group>
          {[...Array(2)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
              ]}
            >
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