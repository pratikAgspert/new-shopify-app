// Cube.js
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const CubeWithLineTexture = () => {
  return (
    <Canvas>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Cube Mesh */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {/* Orbit Controls */}
      <OrbitControls />
    </Canvas>
  );
};

export default CubeWithLineTexture;
