import { Canvas } from "@react-three/fiber";
import Experience from "./Components/Experience";
import PostProcessing from "./Components/PostProcessing";
import { useControls, Leva } from "leva";

const App = () => {
  const { color } = useControls({
    color: {
      value: "#EBD9BB",
    },
  });

  return (
    <div className="canvas-container">
      <Canvas
        dpr={1}
        camera={{
          fov: 35,
          position: [0, 2, 15],
        }}
        gl={{
          alpha: true,
        }}
      >
        <Leva hidden />
        <color attach="background" args={[color]} />
        <PostProcessing />
        <Experience />
      </Canvas>
    </div>
  );
};

export default App;
