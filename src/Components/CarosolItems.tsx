import { useGLTF, useTexture } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../store";

interface props {
  location: string;
  position: [number, number, number];
  scale: [number, number, number];
  index: number;
  rawPosition: [number, number, number];
  rawRotation: [number, number, number];
  spacing: number;
}

const CarosolItems = ({ location, position, scale, index, rawPosition, rawRotation, spacing }: props) => {
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
    // Access the global x value without triggering re-renders
    const globalX = useStore.getState().x;

    // Calculate distance from center (0)
    // currentX is the position relative to the center of the screen
    const currentX = globalX + index * spacing;
    const dist = Math.abs(currentX);

    // Calculate scale factor: 1.0 at edges/outside, 1.5 at center (adjust 1.5 for more/less growth)
    // Using cosine for smooth ease-in/out
    const scaleRange = spacing - 2; // The distance over which scaling happens
    let positionScaleFactor = 1;

    if (dist < scaleRange) {
      const normalizedDist = dist / scaleRange;
      const curve = Math.cos(normalizedDist * (Math.PI / 2));
      positionScaleFactor = 1 + curve * 1.0; // Max scale boost is 1.0 (2.0x total)
    }
    const rotation = (globalX / spacing) * Math.PI * 2;
    if (modelRef.current) {
      const { scaleProgress } = animationState.current;

      // Base scale + Hover effect
      const baseScaleX = scale[0] + 0.1 * scaleProgress;
      const baseScaleY = scale[1] + 0.1 * scaleProgress;
      const baseScaleZ = scale[2] + 0.1 * scaleProgress;

      // Apply position-based scaling
      modelRef.current.scale.set(
        baseScaleX * positionScaleFactor,
        baseScaleY * positionScaleFactor,
        baseScaleZ * positionScaleFactor
      );

      // Background scaling
      const bgBaseScale = 3 + 0.05 * scaleProgress;
      backgroundRef.current.scale.set(
        bgBaseScale * positionScaleFactor,
        bgBaseScale * positionScaleFactor,
        bgBaseScale * positionScaleFactor
      );

      modelRef.current.rotation.x = rawRotation[0];
      modelRef.current.rotation.y = rawRotation[1] + rotation;
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
