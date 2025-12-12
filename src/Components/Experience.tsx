import Lights from "./Lights";
import CarosolItems from "./CarosolItems";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";
import { useGesture } from "@use-gesture/react";

const Experience = () => {
  const baseModels = [
    { src: "/models/Pot.glb", scale: 0.7 },
    { src: "/models/TABDecor2.glb", scale: 1 },
    { src: "/models/TabNandiLowPoly.glb", scale: 0.8 },
  ];

  // Create an "infinite" list of models by repeating the base models
  const infiniteModels = Array(100).fill(baseModels).flat(); // Repeat 100 times

  const [spacing, setSpacing] = useState(10);

  const [{ x }, api] = useSpring(() => ({
    x: -500,
    config: {
      mass: 1,
      tension: 150,
      friction: 20,
      precision: 0.01,
    },
  }));

  const groupRef = useRef<THREE.Group>(null!);

  const activeIndex = useRef(50);

  const bind = useGesture({
    onDrag: ({ down, movement: [mx] }) => {
      const sensitivity = 0.02;

      if (down) {
        api.start({ x: -activeIndex.current * spacing + mx * sensitivity });
      } else {
        const currentX = x.get();
        const newIndex = Math.round(-currentX / spacing);


        activeIndex.current = newIndex;

        api.start({
          x: -activeIndex.current * spacing,
        });
      }
    },
  });

  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);
      setSpacing(window.innerWidth / 250);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Lights />
      <a.group
        {...bind()}
        ref={groupRef}
        position-x={x}
        position-y={1}
        renderOrder={1}
      >
        {infiniteModels.map((_each, index) => {
          // Calculate the actual model to display based on the effective index
          const modelToDisplay = baseModels[index % baseModels.length];
          return (
            <CarosolItems
              position={[index * spacing, -1, 0]}
              location={modelToDisplay.src}
              scale={[modelToDisplay.scale, modelToDisplay.scale, modelToDisplay.scale]}
              key={index}
            />
          );
        })}
      </a.group>
    </>
  );
};

export default Experience;
