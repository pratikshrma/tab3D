import { useGLTF, useTexture } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface props {
  location: string;
  position: [number, number, number];
  scale: [number, number, number];
  index: number;
  rawPosition: [number, number, number];
  rawRotation: [number, number, number];
}
const CarosolItems = ({ location, position, scale, index, rawPosition, rawRotation }: props) => {
  const frame = useTexture([
    "/assets/frame1.png",
    "/assets/frame2.png",
    "/assets/frame3.png",
  ]);

  const { scene } = useGLTF(location);
  const modelRef = useRef<THREE.Group>(null!);
  const backgroundRef = useRef<THREE.Mesh>(null!)

  const timeline = useRef<gsap.core.Timeline>(null!);
  const animationState = useRef({ scaleProgress: 0 });

  useEffect(() => {
    timeline.current = gsap
      .timeline({ paused: true })
      .to(animationState.current, {
        scaleProgress: 1,
        duration: 0.5,
        ease: "power2.out",
      })
    return () => {
      timeline.current?.kill();
    };
  }, []);

  useFrame(() => {
    if (modelRef.current) {
      const { scaleProgress } = animationState.current;
      modelRef.current.scale.set(
        scale[0] + 0.05 * scaleProgress,
        scale[1] + 0.05 * scaleProgress,
        scale[2] + 0.05 * scaleProgress
      );
      backgroundRef.current.scale.set(
        3 + 0.05 * scaleProgress,
        3 + 0.05 * scaleProgress,
        3 + 0.05 * scaleProgress
      )

      // Combine base rotation (from rawRotation) with the continuous animation
      modelRef.current.rotation.x = rawRotation[0];
      modelRef.current.rotation.y += rawRotation[1] + 0.005;
      modelRef.current.rotation.z = rawRotation[2];
    }
  });

  return (
    <>
      <mesh
        ref={backgroundRef}
        position={[position[0], position[1], position[2] - 1]}
        scale={[3, 3, 3]}
        onPointerOver={() => {
          timeline.current?.play();
        }}
        onPointerOut={() => {
          timeline.current?.reverse();
        }}

      >
        <planeGeometry args={index % 2 == 0 ? [1.6, 2] as const : [2, 1.5] as const} />
        <meshStandardMaterial map={frame[index % 2]} transparent={true} />
      </mesh>
      <primitive
        ref={modelRef}
        object={scene.clone()}
        position={[
          position[0] + rawPosition[0],
          position[1] + rawPosition[1],
          position[2] + rawPosition[2],
        ]}
        scale={scale}
      />
    </>
  );
};

export default CarosolItems;
