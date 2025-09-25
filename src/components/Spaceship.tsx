// filename: src/components/Spaceship.tsx
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
}

/**
 * Spaceship component
 * - Handles physics, movement, effects, and HUD updates
 * - Accepts both keyboard input and mobile joystick input
 */
const Spaceship: React.FC<SpaceshipProps> = ({
  setHud,
  paused,
  joystickDir,
  isMobile,
}) => {
  /** === Refs === */
  const shipRef = useRef<Group>(null!);
  const { scene } = useGLTF("/spaceship.glb");

  /** === Physics constants === */
  const speed = 0.4;
  const maxSpeed = 3.0;
  const acceleration = 0.08;
  const friction = 0.96;
  const velocity = useRef(new Vector3(0, 0, 0));

  /** === Effects refs === */
  const exhaustRef = useRef<any>(null);
  const leftThrusterRef = useRef<any>(null);
  const rightThrusterRef = useRef<any>(null);
  const boostTrailRef = useRef<any>(null);

  /** === States === */
  const [isThrusting, setIsThrusting] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);
  const [fuel, setFuel] = useState(100);
  const [health, setHealth] = useState(100);
  const [shieldActive, setShieldActive] = useState(false);

  const [tilt, setTilt] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [roll, setRoll] = useState(0);

  /** === Keyboard Tracking === */
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

  /** === Main Physics Loop === */
  useFrame(({ camera, clock }) => {
    if (!shipRef.current) return;

    const time = clock.getElapsedTime();

    /** If game paused */
    if (paused) {
      velocity.current.set(0, 0, 0);
      setIsThrusting(false);
      setIsBoosting(false);
      camera.lookAt(shipRef.current.position);
      return;
    }

    /** === Movement Setup === */
    let targetVelocity = new Vector3();
    let isUsingThrust = false;
    let isUsingBoost = false;

    /** === Input Detection === */
    let forward = keys.current["w"] || keys.current["arrowup"];
    let backward = keys.current["s"] || keys.current["arrowdown"];
    let left = keys.current["a"] || keys.current["arrowleft"];
    let right = keys.current["d"] || keys.current["arrowright"];
    const upPressed = keys.current[" "];
    const downPressed = keys.current["shift"];
    const boostPressed = keys.current["q"] || keys.current["e"];

    // === Joystick override ===
    let joyX = 0;
    let joyY = 0;

    if (isMobile && joystickDir) {
      joyX = joystickDir.x;
      joyY = joystickDir.y;
    }

    if (isMobile && (Math.abs(joyX) > 0.05 || Math.abs(joyY) > 0.05)) {
      // override keyboard if joystick active
      forward = false;
      backward = false;
      left = false;
      right = false;

      targetVelocity.x += joyX * speed * 1.2;
      targetVelocity.z -= joyY * speed * 1.2;
      isUsingThrust = true;

      setTilt(MathUtils.lerp(tilt, -joyX * 0.6, 0.1));
      setPitch(MathUtils.lerp(pitch, -joyY * 0.2, 0.1));
    }

    /** === Forward / Backward === */
    if (forward) {
      targetVelocity.z -= speed;
      isUsingThrust = true;

      if (boostPressed && fuel > 10) {
        targetVelocity.z -= speed * 1.5;
        isUsingBoost = true;
        setFuel((prev) => Math.max(0, prev - 0.8));
      } else {
        setFuel((prev) => Math.min(100, prev + 0.1));
      }
    } else if (backward) {
      targetVelocity.z += speed * 0.7;
      isUsingThrust = true;
    }

    /** === Left / Right Strafing === */
    if (left) {
      targetVelocity.x -= speed * 0.8;
      setTilt(MathUtils.lerp(tilt, 0.6, 0.1));
      setRoll(MathUtils.lerp(roll, 0.3, 0.05));
      if (forward) setYaw(0.015);
    } else if (right) {
      targetVelocity.x += speed * 0.8;
      setTilt(MathUtils.lerp(tilt, -0.6, 0.1));
      setRoll(MathUtils.lerp(roll, -0.3, 0.05));
      if (forward) setYaw(-0.015);
    } else {
      setTilt(MathUtils.lerp(tilt, 0, 0.08));
      setRoll(MathUtils.lerp(roll, 0, 0.05));
      setYaw(0);
    }

    /** === Vertical (Ascend/Descend) === */
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

    /** === Apply Physics === */
    velocity.current.lerp(targetVelocity, acceleration);
    velocity.current.multiplyScalar(friction);

    const currentSpeed = velocity.current.length();
    if (currentSpeed > maxSpeed) {
      velocity.current.normalize().multiplyScalar(maxSpeed);
    }

    shipRef.current.position.add(velocity.current);

    /** === Camera System === */
    shipRef.current.rotation.z = MathUtils.lerp(
      shipRef.current.rotation.z,
      tilt,
      0.1
    );
    shipRef.current.rotation.y += yaw;
    shipRef.current.rotation.x = MathUtils.lerp(
      shipRef.current.rotation.x,
      pitch,
      0.1
    );

    if (currentSpeed < 0.1) {
      shipRef.current.position.y += Math.sin(time * 2) * 0.02;
      shipRef.current.rotation.y += Math.sin(time * 1.5) * 0.005;
    }

    const baseDistance = 12;
    const baseHeight = 4;
    const cameraOffset = new Vector3(0, baseHeight, baseDistance);
    const targetCamPos = shipRef.current.position.clone().add(cameraOffset);
    camera.position.lerp(targetCamPos, 0.03);
    camera.lookAt(shipRef.current.position);

    /** === HUD Update === */
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
      exhaustRef.current.rotation.y = Math.sin(time * 15) * 0.3;
      exhaustRef.current.scale.setScalar(
        isUsingThrust ? 1 + Math.sin(time * 25) * 0.3 : 0.5
      );
      exhaustRef.current.material.emissiveIntensity = isUsingThrust
        ? isUsingBoost
          ? 4
          : 2
        : 0.5;
    }

    if (leftThrusterRef.current) {
      leftThrusterRef.current.scale.setScalar(left ? 1 : 0.3);
      leftThrusterRef.current.material.emissiveIntensity = left ? 2 : 0.2;
    }

    if (rightThrusterRef.current) {
      rightThrusterRef.current.scale.setScalar(right ? 1 : 0.3);
      rightThrusterRef.current.material.emissiveIntensity = right ? 2 : 0.2;
    }
  });

  /** === JSX === */
  return (
    <group ref={shipRef} position={[0, 0, 5]}>
      {/* === Main Ship === */}
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

      {/* === Exhaust === */}
      <group position={[0, -0.3, 3]} rotation={[Math.PI, 0, 0]}>
        <mesh ref={exhaustRef}>
          <coneGeometry
            args={[0.3, isThrusting ? (isBoosting ? 1.2 : 0.8) : 0.3, 16]}
          />
          <meshStandardMaterial
            emissive={new Color(isBoosting ? "#00ffff" : "#ff4500")}
            emissiveIntensity={isThrusting ? (isBoosting ? 4 : 2) : 0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh position={[0, 0, 0.2]}>
          <coneGeometry
            args={[0.5, isThrusting ? (isBoosting ? 1.8 : 1.2) : 0.5, 16]}
          />
          <meshStandardMaterial
            emissive={new Color(isBoosting ? "#0088ff" : "#ff6600")}
            emissiveIntensity={isThrusting ? (isBoosting ? 2 : 1) : 0.3}
            transparent
            opacity={0.4}
          />
        </mesh>
        <pointLight
          intensity={isThrusting ? (isBoosting ? 4 : 2) : 0.5}
          distance={10}
          color={isBoosting ? "#00ffff" : "#ff4500"}
        />
      </group>

      {/* === Side Thrusters === */}
      <group position={[-1.2, 0, 1]} rotation={[0, Math.PI / 2, 0]}>
        <mesh ref={leftThrusterRef}>
          <coneGeometry args={[0.15, 0.6, 8]} />
          <meshStandardMaterial
            emissive={new Color("#00ff88")}
            emissiveIntensity={2}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
      <group position={[1.2, 0, 1]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh ref={rightThrusterRef}>
          <coneGeometry args={[0.15, 0.6, 8]} />
          <meshStandardMaterial
            emissive={new Color("#00ff88")}
            emissiveIntensity={2}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {/* === Boost Trail === */}
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

      {/* === Shield === */}
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

      {/* === Navigation Lights === */}
      <group>
        <pointLight position={[-1, 0, 0]} intensity={0.5} color="#ff0000" />
        <pointLight position={[1, 0, 0]} intensity={0.5} color="#00ff00" />
        <pointLight position={[0, 0, -2]} intensity={0.3} color="#ffffff" />
      </group>

      {/* === Damage Sparks === */}
      {health < 30 && (
        <group>
          {[...Array(Math.floor((30 - health) / 5))].map((_, i) => (
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
