import Lights from "./Lights";
import CarosolItems from "./CarosolItems";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";
import { useGesture } from "@use-gesture/react";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../store";
import { useGLTF } from "@react-three/drei";

const calculateSpacing = () => {
  const calc = (window.innerWidth / 170) * 1.3
  return Math.max(8, calc)
}

const Experience = () => {
  const initialIndex = 50;
  const [spacing, setSpacing] = useState(calculateSpacing());

  useEffect(() => {
    const handleResize = () => setSpacing(calculateSpacing());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeIndex = useRef(initialIndex);

  const baseModels = [
    { src: "/models/Vallaku.glb", scale: 0.8, position: [0, 0, 0], rotation: [0, 0, 0] },
    { src: "/models/Pot.glb", scale: 0.9, position: [0, 0.5, 0], rotation: [Math.PI / 12, 0, 0] },
    { src: "/models/Nandi.glb", scale: 0.6, position: [0, 0, 0], rotation: [0, 0, 0] },
    { src: "/models/ExtraTABdecor.glb", scale: 10.0, position: [0, 0, 0], rotation: [0, 0, 0] },
  ];

  // Create an "infinite" list of models by repeating the base models
  const infiniteModels = Array(100).fill(baseModels).flat(); // Repeat 100 times


  useEffect(() => {
    const handleWindowResizing = () => {
      setSpacing(calculateSpacing())
    };
    window.addEventListener('resize', handleWindowResizing);
    return () => {
      window.removeEventListener('resize', handleWindowResizing);
    };
  }, []);


  const { dragSensitivity, wheelSensitivity, mass, tension, friction } = useControls("Carousel Settings", {
    dragSensitivity: { value: 0.02, min: 0.001, max: 0.3, step: 0.001 },
    wheelSensitivity: { value: 0.2, min: 0.1, max: 10, step: 0.1 },
    mass: { value: 1, min: 0.1, max: 10 },
    tension: { value: 160, min: 10, max: 500 },
    friction: { value: 20, min: 1, max: 100 },
  });

  const [{ x }, api] = useSpring(() => ({
    x: -initialIndex * spacing,
    config: {
      mass,
      tension,
      friction,
      precision: 0.01,
    },
  }));

  const setGlobalX = useStore((state) => state.setX);

  useFrame(() => {
    setGlobalX(x.get());
  });

  // Update spring config when Leva values change
  useEffect(() => {
    api.start({ config: { mass, tension, friction } });
  }, [mass, tension, friction, api]);

  // Maintain relative position on resize
  useEffect(() => {
    api.start({ x: -activeIndex.current * spacing, immediate: true });
  }, [spacing, api]);

  const groupRef = useRef<THREE.Group>(null!);

  const bind = useGesture({
    onDrag: ({ down, movement: [mx] }) => {
      if (down) {
        api.start({ x: -activeIndex.current * (spacing) + mx * dragSensitivity });
      } else {
        const currentX = x.get();
        const newIndex = Math.round(-currentX / spacing);
        console.log(-currentX, " - ", spacing)
        activeIndex.current = newIndex;
        api.start({
          x: -activeIndex.current * spacing,
        });
      }
    },
    onWheel: ({ active, delta: [dx, dy] }) => {
      if (active) {
        const currentX = x.get();
        api.start({
          x: currentX + (dx + dy) * wheelSensitivity * 0.4
        });
      } else {
        // Snap to nearest
        const currentX = x.get();
        const newIndex = Math.round(-currentX / spacing);
        activeIndex.current = newIndex;
        api.start({
          x: -activeIndex.current * spacing,
        });
      }
    }
  });


  return (
    <>
      <Lights />
      <mesh position={[0, 0, -2]} {...bind()}>
        <planeGeometry args={[100, 10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <a.group
        ref={groupRef}
        position-x={x}
        position-y={1}
        renderOrder={1}
      >
        {infiniteModels.map((_each, index) => {
          const modelToDisplay = baseModels[index % baseModels.length];
          const carouselX = index * spacing;
          const carouselY = -1;
          const carouselZ = 0;
          return (
            <CarosolItems
              position={[
                carouselX,
                carouselY,
                carouselZ
              ]}
              location={modelToDisplay.src}
              scale={[modelToDisplay.scale, modelToDisplay.scale, modelToDisplay.scale]}
              rawPosition={[modelToDisplay.position[0], modelToDisplay.position[1], modelToDisplay.position[2]]}
              rawRotation={[modelToDisplay.rotation[0], modelToDisplay.rotation[1], modelToDisplay.rotation[2]]}
              key={index + spacing}
              index={index}
              spacing={spacing}
            />
          );
        })}
      </a.group>
    </>
  );
};

useGLTF.preload('/models/Vallaku.glb')
useGLTF.preload('/models/Pot.glb')
useGLTF.preload('/models/Nandi.glb')
useGLTF.preload('/models/ExtraTABdecor.glb')

export default Experience;
