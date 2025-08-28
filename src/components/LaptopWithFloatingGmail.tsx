'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, ContactShadows } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

function LaptopModel() {
    const { scene } = useGLTF('/cyberpunk_laptop_concept_design.glb');
    const laptopRef = useRef<THREE.Group>(null);
    const cloned = scene.clone();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (laptopRef.current) {
            laptopRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
            laptopRef.current.position.y = -0.5 + Math.sin(t * 0.5) * 0.02;
            laptopRef.current.rotation.x = 0.1;
        }
    });

    useEffect(() => {
        cloned.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    child.material.metalness = 0.8;
                    child.material.roughness = 0.2;
                }
            }
        });
        cloned.scale.set(0.025, 0.025, 0.025);
        cloned.position.set(0, -1.5, 0);
        cloned.rotation.x = -0.1;
        cloned.rotation.y = Math.PI / 2; // Rotate to face the camera
    }, [cloned]);

    return <primitive ref={laptopRef} object={cloned} />;

}

function GmailLogo() {
    const { scene } = useGLTF('/gmail_logo.glb');
    const groupRef = useRef<THREE.Group>(null);

    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (groupRef.current) {
            const radius = 0.1;
            const yBase = 1.5;
            groupRef.current.position.set(
                radius * Math.cos(t),
                yBase + Math.sin(t * 2) * 0.03,
                radius * Math.sin(t)
            );
            groupRef.current.rotation.y = -t;
        }
    });

    return (
        <group ref={groupRef} scale={[12, 12, 12]}>
            <primitive object={scene.clone()} />
        </group>
    );
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
            const targetAzimuth = 0;
            const targetPolar = Math.PI / 2;

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
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.05}
            autoRotate={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(3 * Math.PI) / 4}
            minAzimuthAngle={-Math.PI / 3}
            maxAzimuthAngle={Math.PI / 3}
            onStart={() => {
                setIsInteracting(true);
            }}
            onEnd={() => {
                setIsInteracting(false);
                setLastInteractionTime(Date.now());
            }}
        />
    );
}

function SceneContents() {
    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
            <LaptopModel />
            <GmailLogo />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2} />
            <AutoCenterControls />
        </>
    );
}

export default function LaptopWithFloatingGmail() {
    return (
        <div className="w-full max-w-[800px] mx-auto h-[500px] relative overflow-hidden rounded-lg bg-black">
            <Canvas
                camera={{ position: [0, 2, 6], fov: 50 }}
                shadows
                gl={{ antialias: true, alpha: true }}
            >
                <SceneContents />
            </Canvas>
        </div>
    );
}
