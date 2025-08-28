
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Text } from '@react-three/drei';
import { Suspense, useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

function MustangModel() {
  const { scene } = useGLTF('/ford_mustang_1965.glb');

  useEffect(() => {
    if (scene) {
      console.log('Mustang model loaded:', scene);
    }
  }, [scene]);

  if (!scene) return null;

  const clonedScene = scene.clone();
  clonedScene.scale.set(4.5, 4.5, 4.5); // Adjust scale as needed
  clonedScene.position.set(-1, 0, 0);

  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (Array.isArray(child.material)) {
        child.material.forEach((mat) => (mat.needsUpdate = true));
      } else {
        child.material.needsUpdate = true;
      }
    }
  });

  return <primitive object={clonedScene} />;
}

function AutoCenterControls() {
  const controlsRef = useRef<any>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(0);
  const resetDelay = 1000;

  useFrame((state) => {
    if (!controlsRef.current) return;
    const currentTime = Date.now();
    if (!isInteracting && currentTime - lastInteractionTime > resetDelay) {
      const controls = controlsRef.current;
      const targetAzimuth = -Math.PI / 6;
      const targetPolar =  Math.PI / 2.5;
      const spherical = new THREE.Spherical().setFromVector3(
        state.camera.position.clone().sub(controls.target)
      );
      const lerpSpeed = 0.02;
      spherical.theta = THREE.MathUtils.lerp(spherical.theta, targetAzimuth, lerpSpeed);
      spherical.phi = THREE.MathUtils.lerp(spherical.phi, targetPolar, lerpSpeed);
      const newPosition = new THREE.Vector3().setFromSpherical(spherical).add(controls.target);
      state.camera.position.copy(newPosition);
      controls.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={false}
      autoRotate={!isInteracting}
      autoRotateSpeed={0.7}
      dampingFactor={0.05}
      enableDamping
      minPolarAngle={0}
      maxPolarAngle={Math.PI/2}
      minAzimuthAngle={-Math.PI}
      maxAzimuthAngle={Math.PI}
      onStart={() => setIsInteracting(true)}
      onEnd={() => {
        setIsInteracting(false);
        setLastInteractionTime(Date.now());
      }}
    />
  );
}

function LoadingFallback() {
  return (
    <group>
      <Text
        position={[0, 0, 0]}
        fontSize={0.5}
        color="#9ca3af"
        anchorX="center"
        anchorY="middle"
      >
        Loading Mustang...
      </Text>
    </group>
  );
}

function ModelFallback() {
  return (
    <group>
      {/* Simple fallback car shape */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 1, 0.7]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[2, 0.3, 0.5]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="#9ca3af"
        anchorX="center"
        anchorY="middle"
      >
        Ford Mustang 1965
      </Text>
      <Text
        position={[0, -2, 0]}
        fontSize={0.2}
        color="#6b7280"
        anchorX="center"
        anchorY="middle"
      >
        Check if /public/ford_mustang_1965.glb exists
      </Text>
    </group>
  );
}

export default function FordMustang() {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full">
      <div className="w-[280px] h-[180px] sm:w-[350px] sm:h-[220px] md:w-[450px] md:h-[280px] lg:w-[600px] lg:h-[350px] xl:w-[700px] xl:h-[400px] 2xl:w-[800px] 2xl:h-[450px] mx-auto">
        <Canvas
          camera={{ position: [0, 1, 8], fov: 45 }}
          dpr={[1, 2]}
          style={{ background: 'transparent' }}
          onError={() => setHasError(true)}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[8, 8, 8]} intensity={1.2} castShadow />
          <directionalLight position={[-8, -8, -8]} intensity={0.4} />
          <pointLight position={[0, 0, 15]} intensity={0.7} color="#3b82f6" />
          <pointLight position={[10, -10, 5]} intensity={0.5} color="#eab308" />

          <Suspense fallback={<LoadingFallback />}>
            {hasError ? <ModelFallback /> : <MustangModel />}
          </Suspense>

          <AutoCenterControls />
        </Canvas>
      </div>
    </div>
  );
}
