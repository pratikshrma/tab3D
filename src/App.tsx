import { Canvas } from "@react-three/fiber";
import Experience from "./Components/Experience";
import style from "./Styles/App.module.css";
import PostProcessing from "./Components/PostProcessing";
import { Leva } from "leva";

const App = () => {
  return (
    <div className="canvas-container">
      <div>
        <div className={style.ringContainer}>
          <div className={style.ring1}>
            <img src="/assets/ellipse1.svg" />
          </div>
          <div className={style.ring2}>
            <img src="/assets/ellipse2.svg" />
          </div>
        </div>
      </div>
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
        <Leva hidden/>
        <color attach="background" args={["#F7E5CD"]} />
        <PostProcessing />
        <Experience />
      </Canvas>
      <div className="vignette"></div>
    </div>
  );
};

export default App;
