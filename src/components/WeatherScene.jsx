
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Globe() {
  const globe = useRef();
  const clouds = useRef();
  const atmosphere = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.35, 64, 48);
    const colors = [];
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      const noise =
        Math.sin(x * 11 + z * 8) *
          Math.cos(y * 13 + x * 4) +
        Math.sin(z * 19 + y * 7) * 0.3;

      const color = new THREE.Color(
        noise > 0.42 ? "#40c98b" : "#087acb"
      );

      colors.push(color.r, color.g, color.b);
    }

    geo.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    return geo;
  }, []);

  useFrame((state, delta) => {
    if (globe.current) globe.current.rotation.y += delta * 0.12;
    if (clouds.current) clouds.current.rotation.y -= delta * 0.08;

    if (atmosphere.current) {
      atmosphere.current.material.opacity =
        0.16 + Math.sin(state.clock.elapsedTime * 1.8) * 0.045;
    }
  });

  return (
    <group>
      <mesh ref={atmosphere} scale={1.12}>
        <sphereGeometry args={[1.35, 48, 48]} />
        <meshBasicMaterial
          color="#22aaff"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </mesh>

      <group ref={globe}>
        <mesh geometry={geometry}>
          <meshStandardMaterial
            vertexColors
            roughness={0.8}
            metalness={0.12}
          />
        </mesh>
      </group>

      <mesh ref={clouds} scale={1.025}>
        <sphereGeometry args={[1.35, 40, 32]} />
        <meshStandardMaterial
          color="#d8f3ff"
          transparent
          opacity={0.12}
          wireframe
        />
      </mesh>

      <mesh rotation={[1.1, 0.2, 0.35]}>
        <torusGeometry args={[1.8, 0.008, 8, 180]} />
        <meshBasicMaterial color="#4ddcff" />
      </mesh>

      <mesh rotation={[0.5, -0.4, -0.3]}>
        <torusGeometry args={[1.95, 0.005, 8, 180]} />
        <meshBasicMaterial
          color="#c4f4ff"
          transparent
          opacity={0.65}
        />
      </mesh>
    </group>
  );
}

function LiveRain({ count = 1400 }) {
  const rain = useRef();

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = Math.random() * 14 - 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
      speeds[i] = 5 + Math.random() * 11;
    }

    return { positions, speeds };
  }, [count]);

  useFrame((_, delta) => {
    if (!rain.current) return;

    const attr = rain.current.geometry.attributes.position;
    const arr = attr.array;
    const step = Math.min(delta, 0.04);

    for (let i = 0; i < count; i++) {
      const k = i * 3;

      arr[k] -= step * 1.1;
      arr[k + 1] -= data.speeds[i] * step;

      if (arr[k + 1] < -7) {
        arr[k + 1] = 7;
        arr[k] = (Math.random() - 0.5) * 15;
        arr[k + 2] = (Math.random() - 0.5) * 9;
      }
    }

    attr.needsUpdate = true;
  });

  return (
    <points ref={rain}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[data.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#9edfff"
        size={0.025}
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Lightning() {
  const light = useRef();

  useFrame(({ clock }) => {
    if (!light.current) return;

    const t = clock.elapsedTime % 7;

    light.current.intensity =
      t > 3.1 && t < 3.2
        ? 24
        : t > 3.28 && t < 3.36
          ? 12
          : 0;
  });

  return (
    <pointLight
      ref={light}
      position={[3, 2.5, -1]}
      color="#83caff"
      intensity={0}
      distance={12}
    />
  );
}

function Scene({ reducedMotion }) {
  useFrame((state) => {
    if (!reducedMotion) {
      state.camera.position.x =
        Math.sin(state.clock.elapsedTime * 0.12) * 0.12;
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <color attach="background" args={["#020b1b"]} />
      <fog attach="fog" args={["#020b1b", 7, 18]} />

      <ambientLight intensity={0.75} />
      <directionalLight
        position={[-3, 4, 5]}
        intensity={2.2}
        color="#9ddcff"
      />
      <pointLight
        position={[3, 2, 4]}
        intensity={30}
        color="#168bff"
      />

      <Float
        speed={reducedMotion ? 0 : 1.1}
        rotationIntensity={reducedMotion ? 0 : 0.08}
        floatIntensity={reducedMotion ? 0 : 0.18}
      >
        <Globe />
      </Float>

      <LiveRain count={reducedMotion ? 250 : 1400} />

      {!reducedMotion && (
        <>
          <Lightning />
          <Sparkles
            count={110}
            scale={[12, 8, 5]}
            size={1.8}
            speed={0.25}
            color="#6ddaff"
          />
        </>
      )}
    </>
  );
}

export default function WeatherScene({ reducedMotion = false }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden bg-[#020b1b]">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "low-power",
        }}
        className="!absolute !inset-0"
      >
        <Scene reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
