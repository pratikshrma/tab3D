import { Canvas } from "@react-three/fiber";
import Experience from "./Components/Experience";
import PostProcessing from "./Components/PostProcessing";
import { Leva } from "leva";

const App = () => {
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
        {/* <Leva hidden/> */}
        <color attach="background" args={["#F4E6D0"]} />
        <PostProcessing />
        <Experience />
      </Canvas>
    </div>
  );
};

export default App;
