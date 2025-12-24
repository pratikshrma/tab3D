import { Canvas } from "@react-three/fiber";
import Experience from "./Components/Experience";
import { Leva, useControls } from "leva";
import * as THREE from 'three'
import { Environment, OrthographicCamera } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Preload } from "@react-three/drei";

const ResponsiveCamera = ({
  zoom,
}: {
  zoom: number;
}) => {
  return (
    <OrthographicCamera
      makeDefault
      near={0.1}
      far={3000}
      zoom={zoom}
      position={[0, 0, 50]}
    />
  );
};

const App = () => {
  // const { zoom } = useControls({
  //   "Camera Controls": folder({
  //     zoom: { value: 50, min: 0.0, max: 90 },
  //   })
  // })


  const [zoom, setZoom] = useState(50)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 800) {
        setZoom(24)
      } else {
        setZoom(45)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])


  const { color } = useControls({
    color: {
      value: "#f7e5cd",
    },
  });

  return (
    <div className="canvas-container">
      <Canvas
        dpr={[1, 2]}
        gl={{
          alpha: true,
          toneMapping: THREE.NeutralToneMapping,
          outputColorSpace: THREE.SRGBColorSpace
        }}
      >
        <Leva hidden />
        <ResponsiveCamera zoom={zoom} />
        <color attach="background" args={[color]} />
        <Environment files="/assets/warm_restaurant_1k.exr" />
        <Experience />
        <Preload all />
      </Canvas>
      <div className="vignette" />
    </div>
  );
};

export default App;
