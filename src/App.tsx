import { Canvas, useThree } from "@react-three/fiber";
import Experience from "./Components/Experience";
import { useControls, folder } from "leva";
import * as THREE from 'three'
import { Environment, OrthographicCamera } from "@react-three/drei";

const ResponsiveCamera = ({
  left,
  right,
  top,
  bottom,
  zoom,
}: {
  left: number;
  right: number;
  top: number;
  bottom: number;
  zoom: number;
}) => {
  const { size } = useThree();
  const viewportAspect = size.width / size.height;

  const cameraWidth = right - left;
  const cameraHeight = top - bottom;
  const cameraAspect = cameraWidth / cameraHeight;

  let baseZoom = 1;

  if (viewportAspect > cameraAspect) {
    // Viewport is wider, fit by height
    baseZoom = size.height / cameraHeight;
  } else {
    // Viewport is taller or same aspect, fit by width
    baseZoom = size.width / cameraWidth;
  }

  return (
    <OrthographicCamera
      makeDefault
      manual
      left={left}
      right={right}
      top={top}
      bottom={bottom}
      near={0.1}
      far={3000}
      zoom={baseZoom * zoom}
      position={[0, 0, 50]}
    />
  );
};

const App = () => {

  const { left, right, top, bottom, zoom } = useControls({
    "Camera Controls": folder({
      left: { value: -15 },
      right: { value: 15 },
      top: { value: 7 },
      bottom: { value: -7 },
      zoom: { value: 0.02 , min:0.0,max:0.1},
    })
  })


  const { color } = useControls({
    color: {
      value: "#EBD9BB",
    },
  });

  return (
    <div className="canvas-container">
      <Canvas
        dpr={1}
        gl={{
          alpha: true,
          toneMapping: THREE.NeutralToneMapping,
          outputColorSpace: THREE.SRGBColorSpace
        }}
      >
        <ResponsiveCamera left={left} right={right} top={top} bottom={bottom} zoom={zoom} />

        {/* <Perf /> */}
        <color attach="background" args={[color]} />
        <Environment files="/assets/warm_restaurant_1k.exr" />
        {/* <PostProcessing /> */}

        <Experience />
      </Canvas>
    </div>
  );
};

export default App;
